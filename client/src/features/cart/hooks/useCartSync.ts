import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';

/**
 * Custom hook for syncing cart with backend
 * Usage: Call syncCart() before checkout to ensure backend cart matches frontend
 */
export const useCartSync = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const syncWithBackend = useCartStore((state) => state.syncWithBackend);

  const syncCart = async (): Promise<boolean> => {
    setIsSyncing(true);
    setSyncError(null);

    try {
      await syncWithBackend();
      return true;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to sync cart';
      setSyncError(errorMessage);
      return false;
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    syncCart,
    isSyncing,
    syncError,
  };
};
