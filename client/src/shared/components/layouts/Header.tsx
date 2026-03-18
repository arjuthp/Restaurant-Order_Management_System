import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { authApi } from '@/services/api/authApi';
import { Button } from '../Button';
import styles from './Header.module.css';

export const Header = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const totalItems = useCartStore((state) => state.getTotalItems());

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API call failed:', error);
    } finally {
      clearAuth();
      navigate('/');
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          Restaurant App
        </Link>

        <nav className={styles.nav} aria-label="Main navigation">
          <Link to="/products" className={styles.navLink}>
            Menu
          </Link>
          {isAuthenticated && (
            <>
              <Link to="/orders" className={styles.navLink}>
                Orders
              </Link>
              <Link to="/reservations" className={styles.navLink}>
                Reservations
              </Link>
            </>
          )}
        </nav>

        <div className={styles.actions}>
          <Link to="/cart" className={styles.cartButton} aria-label={`Cart with ${totalItems} items`}>
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
            <Button size="sm" onClick={() => navigate('/auth')}>
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
