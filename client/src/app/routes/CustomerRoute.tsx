import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

interface CustomerRouteProps {
  children: React.ReactNode;
}

/**
 * Protects customer-only routes
 * - Redirects unauthenticated users to login
 * - Redirects admins to admin dashboard
 * - Allows customers to access the route
 */
export const CustomerRoute = ({ children }: CustomerRouteProps) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Redirect admins to admin dashboard
  if (user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
};
