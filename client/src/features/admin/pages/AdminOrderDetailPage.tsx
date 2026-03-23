import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ordersApi } from '@/services/api/ordersApi';
import { Button } from '@/shared/components/Button';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { Toast } from '@/shared/components/Toast';
import { formatDateTime, formatCurrency } from '@/shared/utils/formatters';
import styles from './AdminOrderDetailPage.module.css';

interface OrderUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

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
  user_id: string | OrderUser;
  items: OrderItem[];
  total_price: number;
  status: string;
  notes?: string;
  orderType?: 'dine-in' | 'takeout' | 'delivery';
  subtotal?: number;
  createdAt: string;
  updatedAt: string;
}

const AdminOrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    if (!id) {
      setError('Order ID is missing');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const orderData = await ordersApi.getOrderByIdAdmin(id);
      setOrder(orderData);
      setError(null);
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

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return styles.statusPending;
      case 'confirmed':
        return styles.statusConfirmed;
      case 'preparing':
        return styles.statusPreparing;
      case 'delivered':
        return styles.statusDelivered;
      case 'cancelled':
        return styles.statusCancelled;
      default:
        return styles.statusDefault;
    }
  };

  const getValidNextStatuses = (currentStatus: string): string[] => {
    const statusTransitions: Record<string, string[]> = {
      pending: ['pending', 'confirmed', 'cancelled'],
      confirmed: ['confirmed', 'preparing', 'cancelled'],
      preparing: ['preparing', 'delivered', 'cancelled'],
      delivered: ['delivered'],
      cancelled: ['cancelled'],
    };
    return statusTransitions[currentStatus.toLowerCase()] || ['pending', 'confirmed', 'preparing', 'delivered', 'cancelled'];
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!order) return;

    const validStatuses = getValidNextStatuses(order.status);
    if (!validStatuses.includes(newStatus)) {
      setToast({
        message: `Cannot change status from ${order.status} to ${newStatus}`,
        type: 'error'
      });
      return;
    }

    try {
      setIsUpdatingStatus(true);
      await ordersApi.updateOrderStatus(order._id, newStatus);
      setOrder({ ...order, status: newStatus });
      setToast({
        message: `Order status updated to ${newStatus}`,
        type: 'success'
      });
    } catch (err: any) {
      setToast({
        message: err.response?.data?.message || 'Failed to update order status',
        type: 'error'
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const calculateSubtotal = () => {
    if (!order) return 0;
    return order.items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
  };

  const getCustomerInfo = (): OrderUser | null => {
    if (!order) return null;
    const userId = order.user_id;
    if (typeof userId === 'object' && userId !== null) {
      return userId as OrderUser;
    }
    return null;
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
          <Button onClick={() => navigate('/admin/orders')}>Back to Orders</Button>
        </div>
      </div>
    );
  }

  const subtotal = calculateSubtotal();
  const customer = getCustomerInfo();
  const validStatuses = getValidNextStatuses(order.status);

  return (
    <div className={styles.container}>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
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
        <div className={styles.mainContent}>
          {/* Customer Information */}
          {customer && (
            <div className={styles.section}>
              <h2>Customer Information</h2>
              <div className={styles.customerInfo}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Name:</span>
                  <span className={styles.infoValue}>{customer.name}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Email:</span>
                  <span className={styles.infoValue}>{customer.email}</span>
                </div>
                {customer.phone && (
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Phone:</span>
                    <span className={styles.infoValue}>{customer.phone}</span>
                  </div>
                )}
                {customer.address && (
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Address:</span>
                    <span className={styles.infoValue}>{customer.address}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Order Items */}
          <div className={styles.section}>
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
          </div>

          {/* Special Instructions */}
          {order.notes && (
            <div className={styles.section}>
              <h2>Special Instructions</h2>
              <div className={styles.specialInstructions}>
                <p>{order.notes}</p>
              </div>
            </div>
          )}

          {/* Order Timeline */}
          <div className={styles.section}>
            <h2>Order Timeline</h2>
            <div className={styles.timeline}>
              <div className={styles.timelineItem}>
                <div className={styles.timelineDot}></div>
                <div className={styles.timelineContent}>
                  <p className={styles.timelineLabel}>Order Created</p>
                  <p className={styles.timelineDate}>{formatDateTime(order.createdAt)}</p>
                </div>
              </div>
              {order.updatedAt !== order.createdAt && (
                <div className={styles.timelineItem}>
                  <div className={styles.timelineDot}></div>
                  <div className={styles.timelineContent}>
                    <p className={styles.timelineLabel}>Last Updated</p>
                    <p className={styles.timelineDate}>{formatDateTime(order.updatedAt)}</p>
                  </div>
                </div>
              )}
              <div className={styles.timelineItem}>
                <div className={`${styles.timelineDot} ${styles.timelineDotCurrent}`}></div>
                <div className={styles.timelineContent}>
                  <p className={styles.timelineLabel}>Current Status</p>
                  <p className={styles.timelineStatus}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.sidebar}>
          {/* Order Summary */}
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
          </div>

          {/* Status Update Controls */}
          <div className={styles.statusControl}>
            <h3>Update Status</h3>
            <select
              className={styles.statusDropdown}
              value={order.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={isUpdatingStatus}
            >
              {validStatuses.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
            {isUpdatingStatus && (
              <p className={styles.updatingText}>Updating...</p>
            )}
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            <Button fullWidth onClick={() => navigate('/admin/orders')}>
              Back to Orders
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetailPage;
