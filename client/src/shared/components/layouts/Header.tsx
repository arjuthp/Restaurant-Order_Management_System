import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { authApi } from '@/services/api/authApi';
import { Button } from '../Button';
import styles from './Header.module.css';

export const Header = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const totalItems = useCartStore((state) => state.getTotalItems());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API call failed:', error);
    } finally {
      clearAuth();
      setMobileMenuOpen(false);
      navigate('/');
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo} onClick={closeMobileMenu}>
          Restaurant App
        </Link>

        <button
          className={styles.mobileMenuButton}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          <span className={styles.hamburger}></span>
          <span className={styles.hamburger}></span>
          <span className={styles.hamburger}></span>
        </button>

        <nav 
          className={`${styles.nav} ${mobileMenuOpen ? styles.navOpen : ''}`} 
          aria-label="Main navigation"
        >
          <Link to="/dashboard" className={styles.navLink} onClick={closeMobileMenu}>
            Home
          </Link>
          <Link to="/products" className={styles.navLink} onClick={closeMobileMenu}>
            Products
          </Link>
          {isAuthenticated && (
            <>
              <Link to="/cart" className={styles.navLink} onClick={closeMobileMenu}>
                Cart
              </Link>
              <Link to="/orders" className={styles.navLink} onClick={closeMobileMenu}>
                Orders
              </Link>
              <Link to="/profile" className={styles.navLink} onClick={closeMobileMenu}>
                Profile
              </Link>
              {user?.role === 'admin' && (
                <Link to="/admin/dashboard" className={styles.navLink} onClick={closeMobileMenu}>
                  Admin
                </Link>
              )}
            </>
          )}
        </nav>

        <div className={styles.actions}>
          <Link 
            to="/cart" 
            className={styles.cartButton} 
            aria-label={`Cart with ${totalItems} items`}
            onClick={closeMobileMenu}
          >
            🛒
            {totalItems > 0 && <span className={styles.badge}>{totalItems}</span>}
          </Link>

          {isAuthenticated ? (
            <div className={styles.userMenu}>
              <span className={styles.userName}>{user?.name}</span>
              <Button size="sm" variant="ghost" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <Button size="sm" onClick={() => { navigate('/auth'); closeMobileMenu(); }}>
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
