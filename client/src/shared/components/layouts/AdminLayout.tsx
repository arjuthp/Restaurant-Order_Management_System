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
            <svg className={styles.navIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            <span className={styles.navText}>Dashboard</span>
          </Link>

          <Link
            to="/admin/products"
            className={`${styles.navItem} ${isActive('/admin/products') ? styles.navItemActive : ''}`}
            onClick={closeSidebar}
          >
            <svg className={styles.navIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
            <span className={styles.navText}>Products</span>
          </Link>

          <Link
            to="/admin/categories"
            className={`${styles.navItem} ${isActive('/admin/categories') ? styles.navItemActive : ''}`}
            onClick={closeSidebar}
          >
            <svg className={styles.navIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            </svg>
            <span className={styles.navText}>Categories</span>
          </Link>

          <Link
            to="/admin/inventory"
            className={`${styles.navItem} ${isActive('/admin/inventory') ? styles.navItemActive : ''}`}
            onClick={closeSidebar}
          >
            <svg className={styles.navIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="8" y1="6" x2="21" y2="6"></line>
              <line x1="8" y1="12" x2="21" y2="12"></line>
              <line x1="8" y1="18" x2="21" y2="18"></line>
              <line x1="3" y1="6" x2="3.01" y2="6"></line>
              <line x1="3" y1="12" x2="3.01" y2="12"></line>
              <line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>
            <span className={styles.navText}>Inventory</span>
          </Link>

          <Link
            to="/admin/orders"
            className={`${styles.navItem} ${isActive('/admin/orders') ? styles.navItemActive : ''}`}
            onClick={closeSidebar}
          >
            <svg className={styles.navIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            <span className={styles.navText}>Orders</span>
          </Link>

          <Link
            to="/admin/users"
            className={`${styles.navItem} ${isActive('/admin/users') ? styles.navItemActive : ''}`}
            onClick={closeSidebar}
          >
            <svg className={styles.navIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <span className={styles.navText}>Users</span>
          </Link>

          <Link
            to="/admin/staff"
            className={`${styles.navItem} ${isActive('/admin/staff') ? styles.navItemActive : ''}`}
            onClick={closeSidebar}
          >
            <svg className={styles.navIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <span className={styles.navText}>Staff</span>
          </Link>

          <Link
            to="/admin/roles"
            className={`${styles.navItem} ${isActive('/admin/roles') ? styles.navItemActive : ''}`}
            onClick={closeSidebar}
          >
            <svg className={styles.navIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5"></path>
              <path d="M2 12l10 5 10-5"></path>
            </svg>
            <span className={styles.navText}>Roles</span>
          </Link>

          <Link
            to="/admin/tables"
            className={`${styles.navItem} ${isActive('/admin/tables') ? styles.navItemActive : ''}`}
            onClick={closeSidebar}
          >
            <svg className={styles.navIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="10" width="18" height="12" rx="2"></rect>
              <path d="M7 10V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4"></path>
            </svg>
            <span className={styles.navText}>Tables</span>
          </Link>

          <Link
            to="/admin/reservations"
            className={`${styles.navItem} ${isActive('/admin/reservations') ? styles.navItemActive : ''}`}
            onClick={closeSidebar}
          >
            <svg className={styles.navIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span className={styles.navText}>Reservations</span>
          </Link>

          <Link
            to="/admin/profile"
            className={`${styles.navItem} ${isActive('/admin/profile') ? styles.navItemActive : ''}`}
            onClick={closeSidebar}
          >
            <svg className={styles.navIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span className={styles.navText}>My Profile</span>
          </Link>

          <Link
            to="/admin/settings"
            className={`${styles.navItem} ${isActive('/admin/settings') ? styles.navItemActive : ''}`}
            onClick={closeSidebar}
          >
            <svg className={styles.navIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
            <span className={styles.navText}>Restaurant Settings</span>
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
            variant="danger"
            size="md"
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
