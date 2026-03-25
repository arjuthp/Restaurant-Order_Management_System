import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardApi } from '@/services/api/dashboardApi';
import styles from './AnalyticsPage.module.css';

const RevenueAnalyticsPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await dashboardApi.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading analytics...</div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <button onClick={() => navigate('/admin/dashboard')} className={styles.backButton}>
          ← Back to Dashboard
        </button>
        <h1 className={styles.title}>Revenue Analytics</h1>
        <p className={styles.subtitle}>Detailed revenue breakdown and insights</p>
      </div>

      {/* Key Metrics */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>Total Revenue</div>
          <div className={styles.metricValue}>
            {formatCurrency(stats.orders.totalRevenue)}
          </div>
          <div className={styles.metricChange}>All time earnings</div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>Average Order Value</div>
          <div className={styles.metricValue}>
            {formatCurrency(stats.orders.avgOrderValue)}
          </div>
          <div className={styles.metricChange}>Per order</div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>Total Orders</div>
          <div className={styles.metricValue}>{stats.orders.totalOrders}</div>
          <div className={styles.metricChange}>Completed transactions</div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>Revenue per User</div>
          <div className={styles.metricValue}>
            {formatCurrency(stats.orders.totalRevenue / stats.users.activeCustomers)}
          </div>
          <div className={styles.metricChange}>Average customer value</div>
        </div>
      </div>

      {/* Revenue by Status */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Revenue by Order Status</h2>
        <div className={styles.statusGrid}>
          {stats.orders.statusBreakdown.map((status: any) => {
            const estimatedRevenue = (stats.orders.totalRevenue / stats.orders.totalOrders) * status.count;
            return (
              <div key={status._id} className={styles.statusCard}>
                <div className={styles.statusHeader}>
                  <span className={styles.statusName}>{status._id}</span>
                  <span className={styles.statusCount}>{status.count} orders</span>
                </div>
                <div className={styles.statusRevenue}>
                  {formatCurrency(estimatedRevenue)}
                </div>
                <div className={styles.statusPercentage}>
                  {((status.count / stats.orders.totalOrders) * 100).toFixed(1)}% of total orders
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent High-Value Orders */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Recent Orders</h2>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentActivity.map((order: any) => (
                <tr key={order._id} onClick={() => navigate(`/admin/orders/${order._id}`)} className={styles.clickableRow}>
                  <td className={styles.orderNumber}>#{order.order_number}</td>
                  <td>{order.user_id?.name || 'Unknown'}</td>
                  <td className={styles.amount}>{formatCurrency(order.total_amount)}</td>
                  <td>
                    <span className={`${styles.badge} ${styles[order.status.toLowerCase()]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={styles.actions}>
        <button onClick={() => navigate('/admin/orders')} className={styles.actionButton}>
          View All Orders
        </button>
        <button onClick={() => navigate('/admin/products')} className={styles.actionButton}>
          Manage Products
        </button>
      </div>
    </div>
  );
};

export default RevenueAnalyticsPage;
