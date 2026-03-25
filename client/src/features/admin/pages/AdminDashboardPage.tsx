import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { dashboardApi, DashboardStats } from '@/services/api/dashboardApi';
import styles from './AdminDashboardPage.module.css';

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardApi.getStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
      setError('Failed to load dashboard statistics. Please try again.');
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getStatusClass = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'completed') return styles.completed;
    if (statusLower === 'pending') return styles.pending;
    if (statusLower === 'cancelled') return styles.cancelled;
    return styles.default;
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>⚠️</div>
          <div className={styles.errorMessage}>{error}</div>
          <button onClick={fetchDashboardStats} className={styles.retryButton}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>📊</div>
          <div className={styles.errorMessage}>No data available</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>My Dashboard</h1>
          <p className={styles.subtitle}>Your weekly restaurant dashboard of all</p>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className={styles.userDetails}>
              <div className={styles.userName}>{user?.name}</div>
              <div className={styles.userEmail}>{user?.email}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards - Now Clickable! */}
      <div className={styles.metricsGrid}>
        <div 
          className={styles.metricCard}
          onClick={() => navigate('/admin/analytics/products')}
        >
          <div className={styles.metricIcon} style={{ background: '#FFE5E5' }}>
            <span style={{ color: '#FF6B6B' }}>📦</span>
          </div>
          <div className={styles.metricContent}>
            <div className={styles.metricLabel}>Available Products</div>
            <div className={styles.metricValue}>{stats.products.available}</div>
            <div className={styles.metricSubtext}>
              {stats.products.outOfStock} out of stock • Click for details
            </div>
          </div>
        </div>

        <div 
          className={styles.metricCard}
          onClick={() => navigate('/admin/orders')}
        >
          <div className={styles.metricIcon} style={{ background: '#E8E5FF' }}>
            <span style={{ color: '#7C3AED' }}>📋</span>
          </div>
          <div className={styles.metricContent}>
            <div className={styles.metricLabel}>Total Orders</div>
            <div className={styles.metricValue}>{stats.orders.totalOrders.toLocaleString()}</div>
            <div className={styles.metricSubtext}>All time • Click to view</div>
          </div>
        </div>

        <div 
          className={styles.metricCard}
          onClick={() => navigate('/admin/analytics/revenue')}
        >
          <div className={styles.metricIcon} style={{ background: '#D1F4FF' }}>
            <span style={{ color: '#0891B2' }}>💰</span>
          </div>
          <div className={styles.metricContent}>
            <div className={styles.metricLabel}>Total Revenue</div>
            <div className={styles.metricValue}>
              {formatCurrency(stats.orders.totalRevenue).replace('.00', '')}
            </div>
            <div className={styles.metricSubtext}>All time earnings • Click for breakdown</div>
          </div>
        </div>

        <div 
          className={styles.metricCard}
          onClick={() => navigate('/admin/analytics/revenue')}
        >
          <div className={styles.metricIcon} style={{ background: '#D1FAE5' }}>
            <span style={{ color: '#10B981' }}>📊</span>
          </div>
          <div className={styles.metricContent}>
            <div className={styles.metricLabel}>Avg Order Value</div>
            <div className={styles.metricValue}>{formatCurrency(stats.orders.avgOrderValue)}</div>
            <div className={styles.metricSubtext}>Per order average</div>
          </div>
        </div>

        <div 
          className={styles.metricCard}
          onClick={() => navigate('/admin/analytics/users')}
        >
          <div className={styles.metricIcon} style={{ background: '#FEF3C7' }}>
            <span style={{ color: '#F59E0B' }}>🛒</span>
          </div>
          <div className={styles.metricContent}>
            <div className={styles.metricLabel}>Active Carts</div>
            <div className={styles.metricValue}>{stats.carts.activeCarts}</div>
            <div className={styles.metricSubtext}>{stats.carts.totalCartItems} items • Click for details</div>
          </div>
        </div>

        <div 
          className={styles.metricCard}
          onClick={() => navigate('/admin/analytics/users')}
        >
          <div className={styles.metricIcon} style={{ background: '#E0E7FF' }}>
            <span style={{ color: '#6366F1' }}>👥</span>
          </div>
          <div className={styles.metricContent}>
            <div className={styles.metricLabel}>Total Users</div>
            <div className={styles.metricValue}>{stats.users.totalUsers.toLocaleString()}</div>
            <div className={styles.metricSubtext}>{stats.users.activeCustomers} active • Click for analytics</div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className={styles.mainGrid}>
        {/* Left Column */}
        <div className={styles.leftColumn}>
          {/* Revenue Chart Widget */}
          <div className={styles.widget}>
            <div className={styles.widgetHeader}>
              <h3 className={styles.widgetTitle}>Total Revenue</h3>
              <button className={styles.moreButton}>•••</button>
            </div>
            <div className={styles.revenueDisplay}>
              <div className={styles.revenueAmount}>
                {formatCurrency(stats.orders.totalRevenue)}
              </div>
              <div className={styles.revenueSubtext}>
                Average: {formatCurrency(stats.orders.avgOrderValue)}
              </div>
            </div>
            <div className={styles.chartPlaceholder}>
              <div className={styles.barChart}>
                {stats.orders.statusBreakdown.map((status, index) => {
                  const maxCount = Math.max(...stats.orders.statusBreakdown.map(s => s.count));
                  const height = (status.count / maxCount) * 100;
                  return (
                    <div key={status._id} className={styles.barWrapper}>
                      <div 
                        className={styles.bar} 
                        style={{ 
                          height: `${height}%`,
                          background: index % 3 === 0 ? '#FF6B6B' : index % 3 === 1 ? '#4ECDC4' : '#FFD93D'
                        }}
                      ></div>
                      <div className={styles.barLabel}>{status._id.substring(0, 3)}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Categories Widget */}
          <div className={styles.widget}>
            <div className={styles.widgetHeader}>
              <h3 className={styles.widgetTitle}>Products by Category</h3>
              <a href="/admin/products" className={styles.seeAllLink}>See all →</a>
            </div>
            <div className={styles.categoryList}>
              {stats.categories.slice(0, 5).map((cat) => (
                <div key={cat.category} className={styles.categoryItem}>
                  <div className={styles.categoryInfo}>
                    <div className={styles.categoryDot}></div>
                    <span className={styles.categoryName}>{cat.category}</span>
                  </div>
                  <span className={styles.categoryCount}>{cat.count} items</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className={styles.rightColumn}>
          {/* Performance Widget */}
          <div className={styles.widget}>
            <div className={styles.widgetHeader}>
              <h3 className={styles.widgetTitle}>Performance</h3>
              <button className={styles.moreButton}>•••</button>
            </div>
            <div className={styles.performanceCircle}>
              <svg viewBox="0 0 200 200" className={styles.circleChart}>
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="#f0f0f0"
                  strokeWidth="20"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="#FF6B6B"
                  strokeWidth="20"
                  strokeDasharray={`${(stats.products.available / stats.products.total) * 502} 502`}
                  strokeLinecap="round"
                  transform="rotate(-90 100 100)"
                />
                <text
                  x="100"
                  y="100"
                  textAnchor="middle"
                  dy="0.3em"
                  className={styles.circleText}
                >
                  {Math.round((stats.products.available / stats.products.total) * 100)}%
                </text>
              </svg>
            </div>
            <div className={styles.performanceLabel}>Product Availability</div>
            <div className={styles.performanceStats}>
              <div className={styles.performanceStat}>
                <span className={styles.statDot} style={{ background: '#FF6B6B' }}></span>
                <span>Available: {stats.products.available}</span>
              </div>
              <div className={styles.performanceStat}>
                <span className={styles.statDot} style={{ background: '#E0E0E0' }}></span>
                <span>Out of Stock: {stats.products.outOfStock}</span>
              </div>
            </div>
          </div>

          {/* Cart Stats Widget */}
          <div className={styles.widget}>
            <div className={styles.widgetHeader}>
              <h3 className={styles.widgetTitle}>Your Customers</h3>
              <button 
                className={styles.viewMoreButton}
                onClick={() => navigate('/admin/analytics/users')}
              >
                View More
              </button>
            </div>
            <div className={styles.customerStats}>
              <div className={styles.customerStatItem}>
                <div className={styles.customerStatValue}>{stats.carts.activeCarts}</div>
                <div className={styles.customerStatLabel}>Active Carts</div>
              </div>
              <div className={styles.customerStatDivider}></div>
              <div className={styles.customerStatItem}>
                <div className={styles.customerStatValue}>{stats.carts.totalCartItems}</div>
                <div className={styles.customerStatLabel}>Items in Carts</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Widget */}
      <div className={styles.widget}>
        <div className={styles.widgetHeader}>
          <h3 className={styles.widgetTitle}>Recent Orders</h3>
          <a href="/admin/orders" className={styles.seeAllLink}>See all →</a>
        </div>
        <div className={styles.ordersTable}>
          {stats.recentActivity.length > 0 ? (
            stats.recentActivity.slice(0, 5).map((order) => (
              <div 
                key={order._id} 
                className={styles.orderRow}
                onClick={() => navigate(`/admin/orders/${order._id}`)}
              >
                <div className={styles.orderCustomer}>
                  <div className={styles.customerAvatar}>
                    {order.user_id?.name?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div className={styles.customerInfo}>
                    <div className={styles.customerName}>{order.user_id?.name || 'Unknown'}</div>
                    <div className={styles.orderNumber}>#{order.order_number}</div>
                  </div>
                </div>
                <div className={styles.orderDate}>{formatDate(order.createdAt)}</div>
                <div className={styles.orderAmount}>{formatCurrency(order.total_amount)}</div>
                <div className={`${styles.orderStatus} ${getStatusClass(order.status)}`}>
                  {order.status}
                </div>
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📦</div>
              <div className={styles.emptyText}>No recent orders</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
