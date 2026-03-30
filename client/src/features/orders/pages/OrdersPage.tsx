import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ordersApi } from '@/services/api/ordersApi';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { Pagination } from '@/shared/components/Pagination';
import { formatDateTime, formatCurrency } from '@/shared/utils/formatters';
import styles from './OrdersPage.module.css';

// Order type is defined in ordersApi.ts
type Order = Awaited<ReturnType<typeof ordersApi.getMyOrders>>['orders'][number];

interface PaginationMetadata {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

const OrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [pagination, setPagination] = useState<PaginationMetadata>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  useEffect(() => {
    loadOrders(pagination.currentPage, statusFilter);
  }, [statusFilter]);

  const loadOrders = async (page: number = 1, status?: string) => {
    try {
      setIsLoading(true);
      const params: { page: number; limit: number; status?: string } = { page, limit: 10 };
      if (status && status !== 'all') {
        params.status = status;
      }
      const response = await ordersApi.getMyOrders(params);
      setOrders(response.orders);
      setPagination(response.pagination);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
    loadOrders(page, statusFilter);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
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
          <div className={styles.emptyIcon}></div>
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
      
      <div className={styles.filterContainer}>
        <label htmlFor="status-filter" className={styles.filterLabel}>
          Filter by Status:
        </label>
        <select
          id="status-filter"
          className={styles.filterDropdown}
          value={statusFilter}
          onChange={(e) => handleStatusFilterChange(e.target.value)}
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="preparing">Preparing</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

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

      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default OrdersPage;
