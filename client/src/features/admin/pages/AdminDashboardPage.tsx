import { useAuthStore } from '@/store/authStore';
import styles from './AdminDashboardPage.module.css';

const AdminDashboardPage = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Admin Dashboard</h1>
        <p className={styles.subtitle}>Welcome back, {user?.name}!</p>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardIcon}>📦</div>
          <h3 className={styles.cardTitle}>Products</h3>
          <p className={styles.cardDescription}>Manage menu items and inventory</p>
          <a href="/admin/products" className={styles.cardLink}>
            Manage Products →
          </a>
        </div>

        <div className={styles.card}>
          <div className={styles.cardIcon}>📋</div>
          <h3 className={styles.cardTitle}>Orders</h3>
          <p className={styles.cardDescription}>View and process customer orders</p>
          <a href="/admin/orders" className={styles.cardLink}>
            View Orders →
          </a>
        </div>

        <div className={styles.card}>
          <div className={styles.cardIcon}>🪑</div>
          <h3 className={styles.cardTitle}>Tables</h3>
          <p className={styles.cardDescription}>Manage restaurant tables</p>
          <a href="/admin/tables" className={styles.cardLink}>
            Manage Tables →
          </a>
        </div>

        <div className={styles.card}>
          <div className={styles.cardIcon}>📅</div>
          <h3 className={styles.cardTitle}>Reservations</h3>
          <p className={styles.cardDescription}>Handle table reservations</p>
          <a href="/admin/reservations" className={styles.cardLink}>
            View Reservations →
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
