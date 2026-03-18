import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ordersApi } from '@/services/api/ordersApi';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { formatDateTime, formatCurrency } from '@/shared/utils/formatters';
import styles from './OrdersPage.module.css';

// Order type is defined in ordersApi.ts
type Order = Awaited<ReturnType<typeof ordersApi.getMyOrders>>[number];

const OrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const response = await ordersApi.getMyOrders();
      // Sort by date (newest first)
      const sortedOrders = response.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setOrders(sortedOrders);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string): string => {
    const statusColors: Record<string, string> = {
      pending: styles.statusPending,
      confirmed: styles.statusConfirmed,
      preparing: styles.statusPreparing,
      ready: styles.statusReady,
      delivered: styles.statusDelivered,
      cancelled: styles.statusCancelled,
    };
    return statusColors[status.toLowerCase()] || styles.statusDefault;
  };

  const handleOrderClick = (orderId: string) => {
    navigate(`/orders/${orderId}`);
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>My Orders</h1>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📦</div>
          <h2 className={styles.emptyTitle}>No Orders Yet</h2>
          <p className={styles.emptyText}>
            You haven't placed any orders yet. Start by browsing our menu!
          </p>
          <button 
            className={styles.browseButton}
            onClick={() => navigate('/products')}
          >
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>My Orders</h1>
      
      <div className={styles.ordersList}>
        {orders.map((order) => (
          <div
            key={order._id}
            className={styles.orderCard}
            onClick={() => handleOrderClick(order._id)}
          >
            <div className={styles.orderHeader}>
              <div className={styles.orderInfo}>
                <span className={styles.orderId}>Order #{order._id.slice(-8).toUpperCase()}</span>
                <span className={styles.orderDate}>{formatDateTime(order.createdAt)}</span>
              </div>
              <span className={`${styles.statusBadge} ${getStatusColor(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
            
            <div className={styles.orderBody}>
              <div className={styles.orderItems}>
                <span className={styles.itemCount}>
                  {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                </span>
              </div>
              
              <div className={styles.orderFooter}>
                <span className={styles.totalLabel}>Total:</span>
                <span className={styles.totalAmount}>{formatCurrency(order.total_price)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
