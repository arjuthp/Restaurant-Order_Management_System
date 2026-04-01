import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ordersApi } from '@/services/api/ordersApi';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { Pagination } from '@/shared/components/Pagination';
import { Toast } from '@/shared/components/Toast';
import { formatDateTime, formatCurrency } from '@/shared/utils/formatters';
import styles from './AdminOrdersPage.module.css';

// Order type with populated user_id
interface OrderUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
}

// Extend the base Order type from API
type Order = Awaited<ReturnType<typeof ordersApi.getAllOrders>>['orders'][number] & {
  user_id: OrderUser | string;
};

interface PaginationMetadata {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

const AdminOrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [tempStartDate, setTempStartDate] = useState<string>('');
  const [tempEndDate, setTempEndDate] = useState<string>('');
  const [pagination, setPagination] = useState<PaginationMetadata>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  useEffect(() => {
    loadOrders(1, statusFilter, startDate, endDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const loadOrders = async (page: number = 1, status?: string, start?: string, end?: string) => {
    try {
      setIsLoading(true);
      setError(''); // Clear previous errors
      const params: { page: number; limit: number; status?: string; startDate?: string; endDate?: string } = { page, limit: 10 };
      if (status && status !== 'all') {
        params.status = status;
      }
      if (start) {
        params.startDate = start;
      }
      if (end) {
        params.endDate = end;
      }
      
      console.log('Loading orders with params:', params);
      
      const response = await ordersApi.getAllOrders(params);
      setOrders(response.orders);
      setPagination(response.pagination);
    } catch (err: any) {
      console.error('Failed to load orders:', err);
      const errorMessage = err.response?.data?.error?.message 
        || err.response?.data?.message 
        || err.message 
        || 'Failed to load orders';
      setError(errorMessage);
      setOrders([]); // Clear orders on error
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
    loadOrders(page, statusFilter, startDate, endDate);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleStartDateChange = (date: string) => {
    setTempStartDate(date);
  };

  const handleEndDateChange = (date: string) => {
    setTempEndDate(date);
  };

  const handleApplyDateFilter = () => {
    setStartDate(tempStartDate);
    setEndDate(tempEndDate);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    loadOrders(1, statusFilter, tempStartDate, tempEndDate);
  };

  const handleClearDateFilter = () => {
    setStartDate('');
    setEndDate('');
    setTempStartDate('');
    setTempEndDate('');
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    loadOrders(1, statusFilter, '', '');
  };

  const getStatusColor = (status: string): string => {
    const statusColors: Record<string, string> = {
      pending: styles.statusPending,
      confirmed: styles.statusConfirmed,
      preparing: styles.statusPreparing,
      delivered: styles.statusDelivered,
      cancelled: styles.statusCancelled,
    };
    return statusColors[status.toLowerCase()] || styles.statusDefault;
  };

  // Get valid next statuses based on current status
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

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const order = orders.find(o => o._id === orderId);
    if (!order) return;

    // Validate status transition
    const validStatuses = getValidNextStatuses(order.status);
    if (!validStatuses.includes(newStatus)) {
      setToast({
        message: `Cannot change status from ${order.status} to ${newStatus}`,
        type: 'error'
      });
      return;
    }

    try {
      setUpdatingOrderId(orderId);
      await ordersApi.updateOrderStatus(orderId, newStatus);
      // Update local state
      setOrders(orders.map(o => 
        o._id === orderId ? { ...o, status: newStatus } : o
      ));
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
      setUpdatingOrderId(null);
    }
  };

  const handleViewDetails = (orderId: string) => {
    navigate(`/admin/orders/${orderId}`);
  };

  const getCustomerName = (order: Order): string => {
    const userId = order.user_id as OrderUser | string;
    if (typeof userId === 'object' && userId !== null) {
      return userId.name;
    }
    return 'Unknown Customer';
  };

  const isPendingOrder = (status: string): boolean => {
    return status.toLowerCase() === 'pending';
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
    const hasActiveFilters = statusFilter !== 'all' || startDate || endDate;
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Manage Orders</h1>
        
        {/* Show filters even in empty state */}
        <div className={styles.filterContainer}>
          <div className={styles.filterGroup}>
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

          <div className={styles.filterGroup}>
            <label htmlFor="start-date" className={styles.filterLabel}>
              From:
            </label>
            <input
              type="date"
              id="start-date"
              className={styles.dateInput}
              value={tempStartDate}
              onChange={(e) => handleStartDateChange(e.target.value)}
            />
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="end-date" className={styles.filterLabel}>
              To:
            </label>
            <input
              type="date"
              id="end-date"
              className={styles.dateInput}
              value={tempEndDate}
              onChange={(e) => handleEndDateChange(e.target.value)}
            />
          </div>

          <button
            className={styles.searchButton}
            onClick={handleApplyDateFilter}
            disabled={!tempStartDate && !tempEndDate}
          >
            Search
          </button>

          {(startDate || endDate) && (
            <button
              className={styles.clearButton}
              onClick={handleClearDateFilter}
              title="Clear date filter"
            >
              Clear Dates
            </button>
          )}
        </div>

        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📋</div>
          <h2 className={styles.emptyTitle}>
            {hasActiveFilters ? 'No Orders Found' : 'No Orders Yet'}
          </h2>
          <p className={styles.emptyText}>
            {hasActiveFilters 
              ? `No orders found matching your filters${startDate || endDate ? ` (${startDate || 'any'} to ${endDate || 'any'})` : ''}.`
              : 'No customer orders have been placed yet.'}
          </p>
          {hasActiveFilters && (
            <button className={styles.clearFiltersButton} onClick={handleClearDateFilter}>
              Clear All Filters
            </button>
          )}
        </div>
      </div>
    );
  }

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
        <h1 className={styles.title}>Manage Orders</h1>
        <p className={styles.subtitle}>View and process customer orders</p>
      </div>

      <div className={styles.filterContainer}>
        <div className={styles.filterGroup}>
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

        <div className={styles.filterGroup}>
          <label htmlFor="start-date" className={styles.filterLabel}>
            From:
          </label>
          <input
            type="date"
            id="start-date"
            className={styles.dateInput}
            value={tempStartDate}
            onChange={(e) => handleStartDateChange(e.target.value)}
          />
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="end-date" className={styles.filterLabel}>
            To:
          </label>
          <input
            type="date"
            id="end-date"
            className={styles.dateInput}
            value={tempEndDate}
            onChange={(e) => handleEndDateChange(e.target.value)}
          />
        </div>

        <button
          className={styles.searchButton}
          onClick={handleApplyDateFilter}
          disabled={!tempStartDate && !tempEndDate}
        >
          Search
        </button>

        {(startDate || endDate) && (
          <button
            className={styles.clearButton}
            onClick={handleClearDateFilter}
            title="Clear date filter"
          >
            Clear Dates
          </button>
        )}
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Status</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const validStatuses = getValidNextStatuses(order.status);
              return (
                <tr 
                  key={order._id}
                  className={isPendingOrder(order.status) ? styles.pendingRow : ''}
                >
                  <td className={styles.orderId}>
                    #{order._id.slice(-8).toUpperCase()}
                  </td>
                  <td className={styles.customerName}>
                    {getCustomerName(order)}
                  </td>
                  <td className={styles.orderDate}>
                    {formatDateTime(order.createdAt)}
                  </td>
                  <td>
                    <span className={`${styles.statusBadge} ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className={styles.totalPrice}>
                    {formatCurrency(order.total_price)}
                  </td>
                  <td className={styles.actions}>
                    <button
                      className={styles.viewButton}
                      onClick={() => handleViewDetails(order._id)}
                    >
                      View Details
                    </button>
                    <select
                      className={styles.statusDropdown}
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      disabled={updatingOrderId === order._id}
                    >
                      {validStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
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

export default AdminOrdersPage;
