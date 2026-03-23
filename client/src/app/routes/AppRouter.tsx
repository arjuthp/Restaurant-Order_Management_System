import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/shared/components/layouts/MainLayout';
import { AdminLayout } from '@/shared/components/layouts/AdminLayout';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { ProtectedRoute } from './ProtectedRoute';
import { CustomerRoute } from './CustomerRoute';
import { AdminRoute } from './AdminRoute';
import { RoleBasedRedirect } from './RoleBasedRedirect';

// Lazy load feature modules
const AuthPage = lazy(() => import('@/features/auth/pages/AuthPage'));
const AdminLoginPage = lazy(() => import('@/features/auth/pages/AdminLoginPage'));
const AdminDashboardPage = lazy(() => import('@/features/admin/pages/AdminDashboardPage'));
const AdminProductsPage = lazy(() => import('@/features/admin/pages/AdminProductsPage'));
const AdminOrdersPage = lazy(() => import('@/features/admin/pages/AdminOrdersPage'));
const AdminOrderDetailPage = lazy(() => import('@/features/admin/pages/AdminOrderDetailPage'));
const AdminTablesPage = lazy(() => import('@/features/admin/pages/AdminTablesPage'));
const AdminReservationsPage = lazy(() => import('@/features/admin/pages/AdminReservationsPage'));
const AdminUsersPage = lazy(() => import('@/features/admin/pages/AdminUsersPage'));
const AdminUserDetailPage = lazy(() => import('@/features/admin/pages/AdminUserDetailPage'));
const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage'));
const ProductsPage = lazy(() => import('@/features/products/pages/ProductsPage'));
const ProductDetailPage = lazy(() => import('@/features/products/pages/ProductDetailPage'));
const CartPage = lazy(() => import('@/features/cart/pages/CartPage'));
const CheckoutPage = lazy(() => import('@/features/orders/pages/CheckoutPage'));
const OrdersPage = lazy(() => import('@/features/orders/pages/OrdersPage'));
const OrderDetailPage = lazy(() => import('@/features/orders/pages/OrderDetailPage'));
const ReservationsPage = lazy(() => import('@/features/reservations/pages/ReservationsPage'));
const ProfilePage = lazy(() => import('@/features/profile/pages/ProfilePage'));

export const AppRouter = () => {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        
        {/* Root redirect based on user role */}
        <Route path="/" element={<RoleBasedRedirect />} />
        
        {/* Admin routes with AdminLayout */}
        <Route element={<AdminLayout />}>
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            }
          />
          
          <Route
            path="/admin/products"
            element={
              <AdminRoute>
                <AdminProductsPage />
              </AdminRoute>
            }
          />
          
          <Route
            path="/admin/orders"
            element={
              <AdminRoute>
                <AdminOrdersPage />
              </AdminRoute>
            }
          />
          
          <Route
            path="/admin/orders/:id"
            element={
              <AdminRoute>
                <AdminOrderDetailPage />
              </AdminRoute>
            }
          />
          
          <Route
            path="/admin/tables"
            element={
              <AdminRoute>
                <AdminTablesPage />
              </AdminRoute>
            }
          />
          
          <Route
            path="/admin/reservations"
            element={
              <AdminRoute>
                <AdminReservationsPage />
              </AdminRoute>
            }
          />
          
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminUsersPage />
              </AdminRoute>
            }
          />
          
          <Route
            path="/admin/users/:id"
            element={
              <AdminRoute>
                <AdminUserDetailPage />
              </AdminRoute>
            }
          />
          
          <Route
            path="/admin/profile"
            element={
              <AdminRoute>
                <ProfilePage />
              </AdminRoute>
            }
          />
        </Route>
        
        {/* Customer routes with MainLayout */}
        <Route element={<MainLayout />}>
          <Route
            path="/dashboard"
            element={
              <CustomerRoute>
                <DashboardPage />
              </CustomerRoute>
            }
          />
          
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          
          <Route
            path="/cart"
            element={
              <CustomerRoute>
                <CartPage />
              </CustomerRoute>
            }
          />
          
          <Route
            path="/checkout"
            element={
              <CustomerRoute>
                <CheckoutPage />
              </CustomerRoute>
            }
          />
          
          <Route
            path="/orders"
            element={
              <CustomerRoute>
                <OrdersPage />
              </CustomerRoute>
            }
          />
          
          <Route
            path="/orders/:id"
            element={
              <CustomerRoute>
                <OrderDetailPage />
              </CustomerRoute>
            }
          />
          
          <Route
            path="/reservations"
            element={
              <CustomerRoute>
                <ReservationsPage />
              </CustomerRoute>
            }
          />
          
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Route>
        
        <Route path="*" element={<RoleBasedRedirect />} />
      </Routes>
    </Suspense>
  );
};
