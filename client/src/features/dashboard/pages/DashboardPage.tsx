import { useAuthStore } from '@/store/authStore';
import { Link } from 'react-router-dom';
import styles from './DashboardPage.module.css';

const DashboardPage = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome back, {user?.name}!</h1>
      
      <div className={styles.grid}>
        <Link to="/products" className={styles.card}>
          <div className={styles.icon}>🍽️</div>
          <h2>Browse Menu</h2>
          <p>Explore our delicious offerings</p>
        </Link>

        <Link to="/orders" className={styles.card}>
          <div className={styles.icon}>📦</div>
          <h2>My Orders</h2>
          <p>Track your order history</p>
        </Link>

        <Link to="/reservations" className={styles.card}>
          <div className={styles.icon}>📅</div>
          <h2>Reservations</h2>
          <p>Book a table for dining</p>
        </Link>

        <Link to="/cart" className={styles.card}>
          <div className={styles.icon}>🛒</div>
          <h2>Shopping Cart</h2>
          <p>Review your items</p>
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;
