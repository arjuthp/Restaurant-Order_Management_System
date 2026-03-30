import { useAuthStore } from '@/store/authStore';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/Button';
import { authApi } from '@/services/api/authApi';
import styles from './DashboardPage.module.css';

const DashboardPage = () => {
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const navigate = useNavigate();

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
      navigate('/');
    }
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
    <div className={styles.container}>
      <div className={styles.headerSection}>
        <h1 className={styles.title}>Welcome back, {formatName(user?.name)}!</h1>
        <Button variant="danger" size="md" onClick={handleLogout}>
          Logout
        </Button>
      </div>
      
      <div className={styles.grid}>
        <Link to="/products" className={styles.card}>
          <div className={styles.icon}></div>
          <h2>Browse Menu</h2>
          <p>Explore our delicious offerings</p>
        </Link>

        <Link to="/orders" className={styles.card}>
          <div className={styles.icon}></div>
          <h2>My Orders</h2>
          <p>Track your order history</p>
        </Link>

        <Link to="/reservations" className={styles.card}>
          <div className={styles.icon}></div>
          <h2>Reservations</h2>
          <p>Book a table for dining</p>
        </Link>

        <Link to="/cart" className={styles.card}>
          <div className={styles.icon}></div>
          <h2>Shopping Cart</h2>
          <p>Review your items</p>
        </Link>

        <Link to="/profile" className={styles.card}>
          <div className={styles.icon}></div>
          <h2>My Profile</h2>
          <p>View and edit your information</p>
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;
