import { ErrorBoundary } from 'react-error-boundary';
import { AppProviders } from './providers/AppProviders';
import { AppRouter } from './routes/AppRouter';
import { ErrorFallback } from '@/shared/components/ErrorFallback';

export const App = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AppProviders>
        <AppRouter />
      </AppProviders>
    </ErrorBoundary>
  );
};
