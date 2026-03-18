import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { cartApi } from '@/services/api/cartApi';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string | null;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  syncWithBackend: () => Promise<void>;
  updateFromBackend: (backendItems: Array<{
    product_id: { _id: string; name: string; price: number; image_url?: string | null };
    quantity: number;
  }>) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find((i) => i.productId === item.productId);
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          ),
        })),
      clearCart: () => set({ items: [] }),
      getTotalPrice: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },
      syncWithBackend: async () => {
        const { items } = get();
        
        // Convert cart items to format expected by backend
        const cartItems = items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        }));

        try {
          // Sync cart with backend
          const backendCart = await cartApi.syncCart(cartItems);
          
          // Update local cart with backend response
          get().updateFromBackend(backendCart.items);
        } catch (error) {
          // Re-throw error to be handled by caller
          throw error;
        }
      },
      updateFromBackend: (backendItems) => {
        // Convert backend cart items to local cart format
        const localItems: CartItem[] = backendItems.map((item) => ({
          productId: item.product_id._id,
          name: item.product_id.name,
          price: item.product_id.price,
          quantity: item.quantity,
          image_url: item.product_id.image_url,
        }));

        set({ items: localItems });
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
