import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

/**
 * Redirects users to appropriate dashboard based on their role
 * - Admin → /admin/dashboard
 * - Customer → /dashboard
 * - Not logged in → /auth
 */
export const RoleBasedRedirect = () => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth" replace />;
  }

  if (user.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Navigate to="/dashboard" replace />;
};
