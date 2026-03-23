import { apiClient } from './apiClient';

interface CartItem {
  productId: string;
  quantity: number;
}

interface BackendCartItem {
  product_id: {
    _id: string;
    name: string;
    price: number;
    image_url?: string | null;
  };
  quantity: number;
}

interface BackendCart {
  _id: string;
  user_id: string;
  items: BackendCartItem[];
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const cartApi = {
  /**
   * Syncs the local cart with the backend by ensuring all items match
   * This ensures the backend cart matches the frontend cart state before checkout
   */
  async syncCart(items: CartItem[]): Promise<BackendCart> {
    try {
      // If no items to sync, just clear the backend cart
      if (items.length === 0) {
        await apiClient.delete<ApiResponse<BackendCart>>('/cart');
        const response = await apiClient.get<ApiResponse<BackendCart>>('/cart');
        return response.data;
      }

      // Get current backend cart
      let backendCart: BackendCart | null = null;
      try {
        const response = await apiClient.get<ApiResponse<BackendCart>>('/cart');
        backendCart = response.data;
      } catch (error: any) {
        // If cart doesn't exist, it will be created when we add first item
        backendCart = null;
      }

      // Build a map of current backend items
      const backendItemsMap = new Map<string, number>();
      if (backendCart && backendCart.items) {
        for (const item of backendCart.items) {
          const productId = typeof item.product_id === 'object' ? item.product_id._id : item.product_id;
          backendItemsMap.set(productId, item.quantity);
        }
      }

      // Build a map of frontend items
      const frontendItemsMap = new Map(
        items.map(item => [item.productId, item.quantity])
      );

      // Remove items that are in backend but not in frontend
      for (const [productId] of backendItemsMap) {
        if (!frontendItemsMap.has(productId)) {
          try {
            await apiClient.delete(`/cart/items/${productId}`);
          } catch (error) {
            console.error(`Failed to remove item ${productId}:`, error);
          }
        }
      }

      // Add or update items from frontend
      const failedItems: string[] = [];
      for (const item of items) {
        try {
          const backendQuantity = backendItemsMap.get(item.productId);
          
          if (backendQuantity === undefined) {
            // Item doesn't exist in backend, add it
            await apiClient.post<ApiResponse<BackendCart>>('/cart/items', {
              product_id: item.productId,
              quantity: item.quantity,
            });
          } else if (backendQuantity !== item.quantity) {
            // Item exists but quantity is different, update it
            await apiClient.patch<ApiResponse<BackendCart>>(`/cart/items/${item.productId}`, {
              quantity: item.quantity,
            });
          }
          // If quantities match, no action needed
        } catch (itemError: any) {
          console.error(`Failed to sync item ${item.productId}:`, itemError);
          failedItems.push(item.productId);
        }
      }

      // Get the final cart state
      const finalResponse = await apiClient.get<ApiResponse<BackendCart>>('/cart');
      
      // If some items failed, throw an error with details
      if (failedItems.length > 0) {
        throw new Error(
          `Failed to sync ${failedItems.length} item(s). Some products may be unavailable.`
        );
      }
      
      return finalResponse.data;
    } catch (error: any) {
      // Provide detailed error message
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to sync cart with backend';
      
      throw new Error(errorMessage);
    }
  },

  /**
   * Get the current cart from backend
   */
  async getCart(): Promise<BackendCart> {
    const response = await apiClient.get<ApiResponse<BackendCart>>('/cart');
    return response.data;
  },

  /**
   * Add an item to the backend cart
   */
  async addItem(productId: string, quantity: number): Promise<BackendCart> {
    const response = await apiClient.post<ApiResponse<BackendCart>>('/cart/items', {
      product_id: productId,
      quantity,
    });
    return response.data;
  },

  /**
   * Update item quantity in backend cart
   */
  async updateItemQuantity(
    productId: string,
    quantity: number
  ): Promise<BackendCart> {
    const response = await apiClient.patch<ApiResponse<BackendCart>>(`/cart/items/${productId}`, {
      quantity,
    });
    return response.data;
  },

  /**
   * Remove an item from backend cart
   */
  async removeItem(productId: string): Promise<BackendCart> {
    const response = await apiClient.delete<ApiResponse<BackendCart>>(`/cart/items/${productId}`);
    return response.data;
  },

  /**
   * Clear the entire backend cart
   */
  async clearCart(): Promise<BackendCart> {
    const response = await apiClient.delete<ApiResponse<BackendCart>>('/cart');
    return response.data;
  },
};
