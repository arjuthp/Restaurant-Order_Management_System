import { ErrorBoundary } from 'react-error-boundary';
import { AppProviders } from './providers/AppProviders';
import { AppRouter } from './routes/AppRouter';
import { ErrorFallback } from '@/shared/components/ErrorFallback';
import { useCartInitialization } from '@/features/cart/hooks/useCartInitialization';
import { useEffect } from 'react';

const AppContent = () => {
  // Initialize cart from backend when user logs in
  useCartInitialization();
  
  useEffect(() => {
    console.log('🚀 [APP] Application initialized');
    console.log('🌐 [APP] Environment:', {
      apiUrl: import.meta.env.VITE_API_BASE_URL,
      mode: import.meta.env.MODE
    });
  }, []);
  
  return <AppRouter />;
};

export const App = () => {
  return (
    <ErrorBoundary 
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        console.error('💥 [APP] Error boundary caught error:', error);
        console.error('💥 [APP] Error info:', errorInfo);
      }}
    >
      <AppProviders>
        <AppContent />
      </AppProviders>
    </ErrorBoundary>
  );
};
