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
          <div className={styles.errorIcon}></div>
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
          <div className={styles.logoContainer}>
            <div className={styles.logo}>
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="22" fill="url(#logoGradient)" />
                <path d="M24 12L28 20H20L24 12Z" fill="white" opacity="0.9" />
                <path d="M18 22H30V28H18V22Z" fill="white" opacity="0.9" />
                <path d="M20 30H28V34H20V30Z" fill="white" opacity="0.9" />
                <defs>
                  <linearGradient id="logoGradient" x1="0" y1="0" x2="48" y2="48">
                    <stop offset="0%" stopColor="#2D5016" />
                    <stop offset="100%" stopColor="#4A7C2C" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className={styles.logoText}>
              <div className={styles.logoTitle}>Restaurant Admin</div>
              <div className={styles.logoSubtitle}>Management Portal</div>
            </div>
          </div>
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
          <div className={styles.metricIcon}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="9" y1="9" x2="15" y2="9"></line>
              <line x1="9" y1="15" x2="15" y2="15"></line>
            </svg>
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
          <div className={styles.metricIcon}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
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
          <div className={styles.metricIcon}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
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
          <div className={styles.metricIcon}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <line x1="18" y1="20" x2="18" y2="10"></line>
              <line x1="12" y1="20" x2="12" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="14"></line>
            </svg>
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
          <div className={styles.metricIcon}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
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
          <div className={styles.metricIcon}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
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
                  const colors = [
                    'linear-gradient(135deg, #2D5016 0%, #4A7C2C 100%)',
                    'linear-gradient(135deg, #D35400 0%, #E67E22 100%)',
                    'linear-gradient(135deg, #1A3009 0%, #2D5016 100%)',
                    'linear-gradient(135deg, #FF8C42 0%, #FFA666 100%)'
                  ];
                  return (
                    <div key={status._id} className={styles.barWrapper}>
                      <div 
                        className={styles.bar} 
                        style={{ 
                          height: `${height}%`,
                          background: colors[index % colors.length]
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
                  stroke="#E0E0E0"
                  strokeWidth="20"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="url(#performanceGradient)"
                  strokeWidth="20"
                  strokeDasharray={`${(stats.products.available / stats.products.total) * 502} 502`}
                  strokeLinecap="round"
                  transform="rotate(-90 100 100)"
                />
                <defs>
                  <linearGradient id="performanceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2D5016" />
                    <stop offset="50%" stopColor="#4A7C2C" />
                    <stop offset="100%" stopColor="#D35400" />
                  </linearGradient>
                </defs>
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
                <span className={styles.statDot} style={{ background: 'linear-gradient(135deg, #2D5016 0%, #4A7C2C 100%)' }}></span>
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
                    <div className={styles.orderNumber}>#{order._id.slice(-8).toUpperCase()}</div>
                  </div>
                </div>
                <div className={styles.orderDate}>{formatDate(order.createdAt)}</div>
                <div className={styles.orderAmount}>{formatCurrency(order.total_price)}</div>
                <div className={`${styles.orderStatus} ${getStatusClass(order.status)}`}>
                  {order.status}
                </div>
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}></div>
              <div className={styles.emptyText}>No recent orders</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
