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
  isSyncing: boolean;
  lastSyncError: string | null;
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  syncWithBackend: () => Promise<void>;
  loadFromBackend: () => Promise<void>;
  updateFromBackend: (backendItems: Array<{
    product_id: { _id: string; name: string; price: number; image_url?: string | null };
    quantity: number;
  }>) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isSyncing: false,
      lastSyncError: null,

      // Add item with background sync
      addItem: async (item) => {
        console.log('🛒 [CART] Adding item to cart:', {
          name: item.name,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        });

        // 1. Optimistic update - update UI immediately
        set((state) => {
          const existingItem = state.items.find((i) => i.productId === item.productId);
          if (existingItem) {
            console.log('📝 [CART] Item already exists, updating quantity:', {
              oldQuantity: existingItem.quantity,
              newQuantity: existingItem.quantity + item.quantity
            });
            return {
              items: state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          console.log('✨ [CART] New item added to local cart');
          return { items: [...state.items, item] };
        });

        // 2. Background sync with backend
        try {
          console.log('🔄 [CART] Syncing with backend...');
          set({ isSyncing: true, lastSyncError: null });
          
          const currentItem = get().items.find((i) => i.productId === item.productId);
          if (currentItem) {
            await cartApi.addItem(item.productId, currentItem.quantity);
            console.log('✅ [CART] Backend sync successful');
          }
          
          set({ isSyncing: false });
        } catch (error: any) {
          console.error('❌ [CART] Failed to sync add item with backend:', error);
          console.error('❌ [CART] Error details:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
          });
          set({ 
            isSyncing: false, 
            lastSyncError: error.message || 'Failed to sync with server' 
          });
          
          console.warn('⚠️  [CART] Item kept in local cart, will retry on next operation');
        }
      },

      // Remove item with background sync
      removeItem: async (productId) => {
        const itemToRemove = get().items.find((i) => i.productId === productId);
        console.log('🗑️  [CART] Removing item from cart:', {
          productId,
          name: itemToRemove?.name
        });

        // 1. Optimistic update
        const previousItems = get().items;
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
        console.log('✨ [CART] Item removed from local cart');

        // 2. Background sync
        try {
          console.log('🔄 [CART] Syncing removal with backend...');
          set({ isSyncing: true, lastSyncError: null });
          await cartApi.removeItem(productId);
          console.log('✅ [CART] Backend sync successful');
          set({ isSyncing: false });
        } catch (error: any) {
          console.error('❌ [CART] Failed to sync remove item with backend:', error);
          console.error('❌ [CART] Error details:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
          });
          set({ 
            isSyncing: false,
            lastSyncError: error.message || 'Failed to sync with server'
          });
          
          // Rollback on critical errors (like 404)
          if (error.response?.status === 404) {
            console.warn('⚠️  [CART] Item not found in backend, rolling back local removal');
            set({ items: previousItems });
          }
        }
      },

      // Update quantity with background sync
      updateQuantity: async (productId, quantity) => {
        const item = get().items.find((i) => i.productId === productId);
        console.log('🔢 [CART] Updating item quantity:', {
          productId,
          name: item?.name,
          oldQuantity: item?.quantity,
          newQuantity: quantity
        });

        // 1. Optimistic update
        const previousItems = get().items;
        
        if (quantity <= 0) {
          console.log('🗑️  [CART] Quantity is 0, removing item');
          await get().removeItem(productId);
          return;
        }

        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          ),
        }));
        console.log('✨ [CART] Quantity updated in local cart');

        // 2. Background sync
        try {
          console.log('🔄 [CART] Syncing quantity update with backend...');
          set({ isSyncing: true, lastSyncError: null });
          await cartApi.updateItemQuantity(productId, quantity);
          console.log('✅ [CART] Backend sync successful');
          set({ isSyncing: false });
        } catch (error: any) {
          console.error('❌ [CART] Failed to sync update quantity with backend:', error);
          console.error('❌ [CART] Error details:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
          });
          set({ 
            isSyncing: false,
            lastSyncError: error.message || 'Failed to sync with server'
          });
          
          // Rollback on critical errors
          if (error.response?.status === 404 || error.response?.status === 400) {
            console.warn('⚠️  [CART] Critical error, rolling back quantity change');
            set({ items: previousItems });
          }
        }
      },

      // Clear cart with backend sync
      clearCart: async () => {
        console.log('🧹 [CART] Clearing cart');
        const previousItems = get().items;
        console.log('🧹 [CART] Items to clear:', previousItems.length);
        
        // 1. Optimistic update
        set({ items: [] });
        console.log('✨ [CART] Local cart cleared');

        // 2. Background sync
        try {
          console.log('🔄 [CART] Syncing cart clear with backend...');
          set({ isSyncing: true, lastSyncError: null });
          await cartApi.clearCart();
          console.log('✅ [CART] Backend cart cleared successfully');
          set({ isSyncing: false });
        } catch (error: any) {
          console.error('❌ [CART] Failed to clear backend cart:', error);
          console.error('❌ [CART] Error details:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
          });
          set({ 
            isSyncing: false,
            lastSyncError: error.message || 'Failed to sync with server'
          });
          console.warn('⚠️  [CART] Local cart cleared but backend sync failed');
        }
      },

      getTotalPrice: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },

      // Full sync - used for conflict resolution
      syncWithBackend: async () => {
        const { items } = get();
        
        // Convert cart items to format expected by backend
        const cartItems = items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        }));

        try {
          set({ isSyncing: true, lastSyncError: null });
          
          // Sync cart with backend
          const backendCart = await cartApi.syncCart(cartItems);
          
          // Update local cart with backend response
          get().updateFromBackend(backendCart.items);
          
          set({ isSyncing: false });
        } catch (error: any) {
          console.error('Failed to sync cart:', error);
          set({ 
            isSyncing: false,
            lastSyncError: error.message || 'Failed to sync with server'
          });
          throw error;
        }
      },

      // Load cart from backend (on app start)
      loadFromBackend: async () => {
        console.log('📥 [CART] Loading cart from backend...');
        try {
          set({ isSyncing: true, lastSyncError: null });
          
          const backendCart = await cartApi.getCart();
          console.log('📥 [CART] Backend cart loaded:', {
            itemCount: backendCart.items?.length || 0,
            items: backendCart.items?.map(i => ({
              name: i.product_id.name,
              quantity: i.quantity
            }))
          });
          
          // Merge with local cart (backend is source of truth)
          if (backendCart.items && backendCart.items.length > 0) {
            get().updateFromBackend(backendCart.items);
            console.log('✅ [CART] Local cart updated from backend');
          } else {
            console.log('ℹ️  [CART] Backend cart is empty');
          }
          
          set({ isSyncing: false });
        } catch (error: any) {
          console.error('❌ [CART] Failed to load cart from backend:', error);
          console.error('❌ [CART] Error details:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
          });
          set({ 
            isSyncing: false,
            lastSyncError: error.message || 'Failed to load cart'
          });
          console.warn('⚠️  [CART] Keeping local cart due to backend load failure');
        }
      },

      updateFromBackend: (backendItems) => {
        console.log('🔄 [CART] Updating local cart from backend data');
        // Convert backend cart items to local cart format
        const localItems: CartItem[] = backendItems.map((item) => ({
          productId: item.product_id._id,
          name: item.product_id.name,
          price: item.product_id.price,
          quantity: item.quantity,
          image_url: item.product_id.image_url,
        }));

        console.log('✅ [CART] Local cart updated with', localItems.length, 'items');
        set({ items: localItems });
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
