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

  // Capitalize first letter of each word
  const formatName = (name: string | undefined) => {
    if (!name) return 'Guest';
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
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
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {totalItems > 0 && <span className={styles.badge}>{totalItems}</span>}
          </Link>

          {isAuthenticated ? (
            <div className={styles.userMenu}>
              <span className={styles.userName}>{formatName(user?.name)}</span>
              <Button size="sm" variant="secondary" onClick={handleLogout}>
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
