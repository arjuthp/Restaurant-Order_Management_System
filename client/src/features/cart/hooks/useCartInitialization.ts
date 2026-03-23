import { useEffect, useRef } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';

/**
 * Hook to initialize cart from backend when user logs in
 * This ensures cart is synced across devices and sessions
 */
export const useCartInitialization = () => {
  const { user } = useAuthStore();
  const { loadFromBackend } = useCartStore();
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Only load once when user is authenticated
    if (user && !hasInitialized.current) {
      console.log('🚀 [CART INIT] User logged in, initializing cart');
      console.log('👤 [CART INIT] User:', { name: user.name, email: user.email, role: user.role });
      hasInitialized.current = true;
      
      // Load cart from backend in the background
      loadFromBackend().catch((err) => {
        console.error('❌ [CART INIT] Failed to load cart from backend:', err);
        console.warn('⚠️  [CART INIT] Keeping local cart');
      });
    }

    // Reset flag when user logs out
    if (!user) {
      if (hasInitialized.current) {
        console.log('👋 [CART INIT] User logged out, resetting cart initialization');
      }
      hasInitialized.current = false;
    }
  }, [user, loadFromBackend]);
};
