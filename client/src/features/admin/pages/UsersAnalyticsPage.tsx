import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardApi } from '@/services/api/dashboardApi';
import styles from './AnalyticsPage.module.css';

const UsersAnalyticsPage = () => {
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

  const activeRate = (stats.users.activeCustomers / stats.users.totalUsers) * 100;
  const avgRevenuePerCustomer = stats.orders.totalRevenue / stats.users.activeCustomers;
  const avgOrdersPerCustomer = stats.orders.totalOrders / stats.users.activeCustomers;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <button onClick={() => navigate('/admin/dashboard')} className={styles.backButton}>
          ← Back to Dashboard
        </button>
        <h1 className={styles.title}>Users & Customers Analytics</h1>
        <p className={styles.subtitle}>Detailed customer insights and engagement metrics</p>
      </div>

      {/* Key Metrics */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>Total Users</div>
          <div className={styles.metricValue}>{stats.users.totalUsers}</div>
          <div className={styles.metricChange}>Registered customers</div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>Active Customers</div>
          <div className={styles.metricValue}>{stats.users.activeCustomers}</div>
          <div className={styles.metricChange}>{activeRate.toFixed(1)}% of total</div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>Avg Revenue per Customer</div>
          <div className={styles.metricValue}>{formatCurrency(avgRevenuePerCustomer)}</div>
          <div className={styles.metricChange}>Customer lifetime value</div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>Avg Orders per Customer</div>
          <div className={styles.metricValue}>{avgOrdersPerCustomer.toFixed(1)}</div>
          <div className={styles.metricChange}>Purchase frequency</div>
        </div>
      </div>

      {/* Customer Engagement */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Customer Engagement</h2>
        <div className={styles.statusGrid}>
          <div className={styles.statusCard}>
            <div className={styles.statusHeader}>
              <span className={styles.statusIcon}>✅</span>
              <span className={styles.statusName}>Active Customers</span>
            </div>
            <div className={styles.statusValue}>{stats.users.activeCustomers}</div>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ 
                  width: `${activeRate}%`,
                  background: '#10B981'
                }}
              ></div>
            </div>
            <div className={styles.statusPercentage}>
              {activeRate.toFixed(1)}% have placed orders
            </div>
          </div>

          <div className={styles.statusCard}>
            <div className={styles.statusHeader}>
              <span className={styles.statusIcon}>💤</span>
              <span className={styles.statusName}>Inactive Users</span>
            </div>
            <div className={styles.statusValue}>
              {stats.users.totalUsers - stats.users.activeCustomers}
            </div>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ 
                  width: `${100 - activeRate}%`,
                  background: '#F59E0B'
                }}
              ></div>
            </div>
            <div className={styles.statusPercentage}>
              {(100 - activeRate).toFixed(1)}% haven't ordered yet
            </div>
          </div>
        </div>
      </div>

      {/* Shopping Cart Activity */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Shopping Cart Activity</h2>
        <div className={styles.cartGrid}>
          <div className={styles.cartCard}>
            <svg className={styles.cartIcon} width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <div className={styles.cartValue}>{stats.carts.activeCarts}</div>
            <div className={styles.cartLabel}>Active Carts</div>
            <div className={styles.cartSubtext}>
              Potential customers browsing
            </div>
          </div>

          <div className={styles.cartCard}>
            <svg className={styles.cartIcon} width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            </svg>
            <div className={styles.cartValue}>{stats.carts.totalCartItems}</div>
            <div className={styles.cartLabel}>Items in Carts</div>
            <div className={styles.cartSubtext}>
              {(stats.carts.totalCartItems / stats.carts.activeCarts).toFixed(1)} items per cart
            </div>
          </div>

          <div className={styles.cartCard}>
            <svg className={styles.cartIcon} width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
            <div className={styles.cartValue}>
              {((stats.carts.activeCarts / stats.users.totalUsers) * 100).toFixed(1)}%
            </div>
            <div className={styles.cartLabel}>Cart Conversion</div>
            <div className={styles.cartSubtext}>
              Users with active carts
            </div>
          </div>
        </div>
      </div>

      {/* Recent Customer Activity */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Recent Customer Orders</h2>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Email</th>
                <th>Order Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentActivity.map((order: any) => (
                <tr 
                  key={order._id} 
                  onClick={() => navigate(`/admin/users/${order.user_id?._id}`)} 
                  className={styles.clickableRow}
                >
                  <td className={styles.customerName}>
                    <div className={styles.customerAvatar}>
                      {order.user_id?.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    {order.user_id?.name || 'Unknown'}
                  </td>
                  <td>{order.user_id?.email || 'N/A'}</td>
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
        <button onClick={() => navigate('/admin/users')} className={styles.actionButton}>
          View All Users
        </button>
        <button onClick={() => navigate('/admin/orders')} className={styles.actionButton}>
          View Orders
        </button>
      </div>
    </div>
  );
};

export default UsersAnalyticsPage;
