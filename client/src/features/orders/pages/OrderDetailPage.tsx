import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ordersApi } from '@/services/api/ordersApi';
import { Button } from '@/shared/components/Button';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { formatDateTime, formatCurrency } from '@/shared/utils/formatters';
import styles from './OrderDetailPage.module.css';

interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
}

interface OrderItem {
  product_id: string | Product;
  product_name: string;
  quantity: number;
  unit_price: number;
}

interface Order {
  _id: string;
  user_id: string;
  items: OrderItem[];
  total_price: number;
  status: string;
  notes?: string;
  orderType?: 'dine-in' | 'takeout' | 'delivery';
  subtotal?: number;
  createdAt: string;
  updatedAt: string;
}

const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage] = useState<string | null>(
    location.state?.message || null
  );

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) {
        setError('Order ID is missing');
        setIsLoading(false);
        return;
      }

      try {
        const orderData = await ordersApi.getOrderById(id);
        setOrder(orderData);
      } catch (err: any) {
        console.error('Failed to fetch order:', err);
        setError(
          err.response?.data?.message ||
            err.message ||
            'Failed to load order details'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return styles.statusPending;
      case 'confirmed':
        return styles.statusConfirmed;
      case 'preparing':
        return styles.statusPreparing;
      case 'ready':
        return styles.statusReady;
      case 'delivered':
      case 'completed':
        return styles.statusCompleted;
      case 'cancelled':
        return styles.statusCancelled;
      default:
        return styles.statusDefault;
    }
  };

  const calculateSubtotal = () => {
    if (!order) return 0;
    return order.items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error || !order) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Error</h2>
          <p>{error || 'Order not found'}</p>
          <Button onClick={() => navigate('/orders')}>Back to Orders</Button>
        </div>
      </div>
    );
  }

  const subtotal = calculateSubtotal();

  return (
    <div className={styles.container}>
      {successMessage && (
        <div className={styles.successMessage} role="alert">
          ✓ {successMessage}
        </div>
      )}

      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Order #{order._id.slice(-8).toUpperCase()}</h1>
          <p className={styles.date}>{formatDateTime(order.createdAt)}</p>
          {order.orderType && (
            <p className={styles.orderType}>
              <span className={styles.orderTypeLabel}>Type:</span>{' '}
              <span className={styles.orderTypeValue}>
                {order.orderType.charAt(0).toUpperCase() + order.orderType.slice(1)}
              </span>
            </p>
          )}
        </div>
        <div className={`${styles.statusBadge} ${getStatusBadgeClass(order.status)}`}>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.orderDetails}>
          <h2>Order Items</h2>
          <div className={styles.items}>
            {order.items.map((item, index) => (
              <div key={index} className={styles.item}>
                <div className={styles.itemInfo}>
                  <h3>{item.product_name}</h3>
                  <p className={styles.itemQuantity}>Quantity: {item.quantity}</p>
                  <p className={styles.itemPrice}>{formatCurrency(item.unit_price)} each</p>
                </div>
                <div className={styles.itemTotal}>
                  {formatCurrency(item.unit_price * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          {order.notes && (
            <div className={styles.notes}>
              <h3>Special Instructions</h3>
              <p>{order.notes}</p>
            </div>
          )}
        </div>

        <div className={styles.summary}>
          <h2>Order Summary</h2>
          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className={`${styles.summaryRow} ${styles.total}`}>
            <span>Total</span>
            <span>{formatCurrency(order.total_price)}</span>
          </div>

          <Button fullWidth onClick={() => navigate('/orders')}>
            Back to Orders
          </Button>
          <Button fullWidth variant="ghost" onClick={() => navigate('/products')}>
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
