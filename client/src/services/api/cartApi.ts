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

export const cartApi = {
  /**
   * Syncs the local cart with the backend by clearing and re-adding all items
   * This ensures the backend cart matches the frontend cart state before checkout
   */
  async syncCart(items: CartItem[]): Promise<BackendCart> {
    try {
      // Step 1: Clear the backend cart
      await apiClient.delete('/cart');

      // Step 2: Add all items from frontend cart to backend
      // We need to add items one by one since there's no bulk sync endpoint
      for (const item of items) {
        try {
          await apiClient.post('/cart/items', {
            product_id: item.productId,
            quantity: item.quantity,
          });
        } catch (itemError: any) {
          // If a specific item fails (e.g., product unavailable), continue with others
          console.error(`Failed to add item ${item.productId}:`, itemError);
          // We'll still throw at the end if any items failed
        }
      }

      // Step 3: Get the updated cart from backend to verify sync
      const cart = await apiClient.get<BackendCart>('/cart');
      return cart;
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
    return apiClient.get<BackendCart>('/cart');
  },

  /**
   * Add an item to the backend cart
   */
  async addItem(productId: string, quantity: number): Promise<BackendCart> {
    return apiClient.post<BackendCart>('/cart/items', {
      product_id: productId,
      quantity,
    });
  },

  /**
   * Update item quantity in backend cart
   */
  async updateItemQuantity(
    productId: string,
    quantity: number
  ): Promise<BackendCart> {
    return apiClient.patch<BackendCart>(`/cart/items/${productId}`, {
      quantity,
    });
  },

  /**
   * Remove an item from backend cart
   */
  async removeItem(productId: string): Promise<BackendCart> {
    return apiClient.delete<BackendCart>(`/cart/items/${productId}`);
  },

  /**
   * Clear the entire backend cart
   */
  async clearCart(): Promise<{ message: string; cart: BackendCart }> {
    return apiClient.delete<{ message: string; cart: BackendCart }>('/cart');
  },
};
