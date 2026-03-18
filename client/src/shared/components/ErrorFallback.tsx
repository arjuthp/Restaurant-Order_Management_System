import { FallbackProps } from 'react-error-boundary';
import { Button } from './Button';
import styles from './ErrorFallback.module.css';

export const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <div className={styles.container} role="alert">
      <div className={styles.content}>
        <h1 className={styles.title}>Oops! Something went wrong</h1>
        <p className={styles.message}>
          We're sorry for the inconvenience. Please try refreshing the page.
        </p>
        {error?.message && (
          <details className={styles.details}>
            <summary>Error details</summary>
            <pre className={styles.errorMessage}>{error.message}</pre>
          </details>
        )}
        <div className={styles.actions}>
          <Button onClick={resetErrorBoundary}>Try again</Button>
          <Button variant="ghost" onClick={() => window.location.href = '/'}>
            Go to homepage
          </Button>
        </div>
      </div>
    </div>
  );
};
