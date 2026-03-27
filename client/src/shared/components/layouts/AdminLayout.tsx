import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/services/api/authApi';
import { Button } from '../Button';
import styles from './AdminLayout.module.css';

export const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, clearAuth } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      clearAuth();
      navigate('/admin/login');
    }
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className={styles.adminLayout}>
      {/* Mobile menu button */}
      <button
        className={styles.mobileMenuButton}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
        aria-expanded={sidebarOpen}
      >
        <span className={styles.hamburger}></span>
        <span className={styles.hamburger}></span>
        <span className={styles.hamburger}></span>
      </button>

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>Admin Panel</h2>
        </div>

        <nav className={styles.sidebarNav} aria-label="Admin navigation">
          <Link
            to="/admin/dashboard"
            className={`${styles.navItem} ${isActive('/admin/dashboard') ? styles.navItemActive : ''}`}
            onClick={closeSidebar}
          >
            <span className={styles.navIcon}>📊</span>
            <span className={styles.navText}>Dashboard</span>
          </Link>

          <Link
            to="/admin/products"
            className={`${styles.navItem} ${isActive('/admin/products') ? styles.navItemActive : ''}`}
            onClick={closeSidebar}
          >
            <span className={styles.navIcon}>📦</span>
            <span className={styles.navText}>Products</span>
          </Link>

          <Link
            to="/admin/categories"
            className={`${styles.navItem} ${isActive('/admin/categories') ? styles.navItemActive : ''}`}
            onClick={closeSidebar}
          >
            <span className={styles.navIcon}>📂</span>
            <span className={styles.navText}>Categories</span>
          </Link>

          <Link
            to="/admin/inventory"
            className={`${styles.navItem} ${isActive('/admin/inventory') ? styles.navItemActive : ''}`}
            onClick={closeSidebar}
          >
            <span className={styles.navIcon}>📊</span>
            <span className={styles.navText}>Inventory</span>
          </Link>

          <Link
            to="/admin/orders"
            className={`${styles.navItem} ${isActive('/admin/orders') ? styles.navItemActive : ''}`}
            onClick={closeSidebar}
          >
            <span className={styles.navIcon}>📋</span>
            <span className={styles.navText}>Orders</span>
          </Link>

          <Link
            to="/admin/users"
            className={`${styles.navItem} ${isActive('/admin/users') ? styles.navItemActive : ''}`}
            onClick={closeSidebar}
          >
            <span className={styles.navIcon}>👥</span>
            <span className={styles.navText}>Users</span>
          </Link>

          <Link
            to="/admin/roles"
            className={`${styles.navItem} ${isActive('/admin/roles') ? styles.navItemActive : ''}`}
            onClick={closeSidebar}
          >
            <span className={styles.navIcon}>🎭</span>
            <span className={styles.navText}>Roles</span>
          </Link>

          <Link
            to="/admin/staff"
            className={`${styles.navItem} ${isActive('/admin/staff') ? styles.navItemActive : ''}`}
            onClick={closeSidebar}
          >
            <span className={styles.navIcon}>👔</span>
            <span className={styles.navText}>Staff</span>
          </Link>

          <Link
            to="/admin/profile"
            className={`${styles.navItem} ${isActive('/admin/profile') ? styles.navItemActive : ''}`}
            onClick={closeSidebar}
          >
            <span className={styles.navIcon}>⚙️</span>
            <span className={styles.navText}>My Profile</span>
          </Link>
        </nav>

        {/* User info section */}
        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className={styles.userDetails}>
              <div className={styles.userName}>{user?.name}</div>
              <div className={styles.userRole}>{user?.role}</div>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className={styles.logoutButton}
          >
            Logout
          </Button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className={styles.overlay}
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Main content */}
      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
};
