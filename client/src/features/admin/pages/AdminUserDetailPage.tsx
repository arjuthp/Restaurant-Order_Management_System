import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usersApi, User } from '@/services/api/usersApi';
import { ordersApi } from '@/services/api/ordersApi';
import { reservationsApi } from '@/services/api/reservationsApi';
import { Button } from '@/shared/components/Button';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { formatDateTime, formatCurrency } from '@/shared/utils/formatters';
import styles from './AdminUserDetailPage.module.css';

const AdminUserDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [userReservations, setUserReservations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'info' | 'orders' | 'reservations'>('info');

  useEffect(() => {
    if (id) {
      loadUserData();
    }
  }, [id]);

  const loadUserData = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      const userData = await usersApi.getUserById(id);
      setUser(userData);

      // Load user's orders and reservations
      try {
        const allOrders = await ordersApi.getAllOrders();
        const filteredOrders = allOrders.orders.filter(
          (order: any) => {
            const userId = typeof order.user_id === 'object' ? order.user_id._id : order.user_id;
            return userId === id;
          }
        );
        setUserOrders(filteredOrders);
      } catch (err) {
        console.error('Failed to load user orders:', err);
      }

      try {
        const allReservations = await reservationsApi.getAllReservations();
        const filteredReservations = allReservations.filter(
          (res: any) => {
            const userId = typeof res.user === 'object' ? res.user._id : res.user;
            return userId === id;
          }
        );
        setUserReservations(filteredReservations);
      } catch (err) {
        console.error('Failed to load user reservations:', err);
      }

      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to load user details');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error || !user) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error || 'User not found'}</div>
        <Button onClick={() => navigate('/admin/users')}>Back to Users</Button>
      </div>
    );
  }

  const totalSpent = userOrders.reduce((sum, order) => sum + order.total_price, 0);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Button variant="ghost" onClick={() => navigate('/admin/users')}>
          ← Back to Users
        </Button>
      </div>

      <div className={styles.userCard}>
        <div className={styles.userHeader}>
          <div className={styles.avatar}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className={styles.userInfo}>
            <h1 className={styles.userName}>{user.name}</h1>
            <span className={user.role === 'admin' ? styles.roleAdmin : styles.roleCustomer}>
              {user.role}
            </span>
          </div>
        </div>

        <div className={styles.stats}>
          <div className={styles.statItem}>
            <div className={styles.statValue}>{userOrders.length}</div>
            <div className={styles.statLabel}>Total Orders</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>{formatCurrency(totalSpent)}</div>
            <div className={styles.statLabel}>Total Spent</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>{userReservations.length}</div>
            <div className={styles.statLabel}>Reservations</div>
          </div>
        </div>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'info' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('info')}
        >
          User Information
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'orders' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders ({userOrders.length})
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'reservations' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('reservations')}
        >
          Reservations ({userReservations.length})
        </button>
      </div>

      <div className={styles.tabContent}>
        {activeTab === 'info' && (
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.label}>Email:</span>
              <span className={styles.value}>{user.email}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Phone:</span>
              <span className={styles.value}>{user.phone || 'Not provided'}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Address:</span>
              <span className={styles.value}>{user.address || 'Not provided'}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Member Since:</span>
              <span className={styles.value}>{user.createdAt ? formatDateTime(user.createdAt) : 'N/A'}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Last Updated:</span>
              <span className={styles.value}>{user.updatedAt ? formatDateTime(user.updatedAt) : 'N/A'}</span>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className={styles.ordersList}>
            {userOrders.length === 0 ? (
              <div className={styles.emptyState}>No orders yet</div>
            ) : (
              userOrders.map((order) => (
                <div key={order._id} className={styles.orderCard}>
                  <div className={styles.orderHeader}>
                    <span className={styles.orderId}>Order #{order._id.slice(-6)}</span>
                    <span className={styles.orderStatus}>{order.status}</span>
                  </div>
                  <div className={styles.orderDetails}>
                    <p>{order.items.length} items</p>
                    <p>{formatCurrency(order.total_price)}</p>
                    <p>{formatDateTime(order.createdAt)}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => navigate(`/admin/orders/${order._id}`)}
                  >
                    View Details
                  </Button>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'reservations' && (
          <div className={styles.reservationsList}>
            {userReservations.length === 0 ? (
              <div className={styles.emptyState}>No reservations yet</div>
            ) : (
              userReservations.map((reservation) => {
                const table = typeof reservation.table === 'object' ? reservation.table : null;
                return (
                  <div key={reservation._id} className={styles.reservationCard}>
                    <div className={styles.reservationHeader}>
                      <span>Table {table?.tableNumber || 'N/A'}</span>
                      <span className={styles.reservationStatus}>{reservation.status}</span>
                    </div>
                    <div className={styles.reservationDetails}>
                      <p>{formatDateTime(reservation.date)}</p>
                      <p>{reservation.timeSlot}</p>
                      <p>{reservation.numberOfGuests} guests</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUserDetailPage;
