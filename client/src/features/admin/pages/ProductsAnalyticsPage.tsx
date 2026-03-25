import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardApi } from '@/services/api/dashboardApi';
import styles from './AnalyticsPage.module.css';

const ProductsAnalyticsPage = () => {
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

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading analytics...</div>
      </div>
    );
  }

  if (!stats) return null;

  const availabilityRate = (stats.products.available / stats.products.total) * 100;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <button onClick={() => navigate('/admin/dashboard')} className={styles.backButton}>
          ← Back to Dashboard
        </button>
        <h1 className={styles.title}>Products & Inventory Analytics</h1>
        <p className={styles.subtitle}>Detailed product inventory and category insights</p>
      </div>

      {/* Key Metrics */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>Total Products</div>
          <div className={styles.metricValue}>{stats.products.total}</div>
          <div className={styles.metricChange}>In catalog</div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>Available Products</div>
          <div className={styles.metricValue}>{stats.products.available}</div>
          <div className={styles.metricChange}>{availabilityRate.toFixed(1)}% availability</div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>Out of Stock</div>
          <div className={styles.metricValue}>{stats.products.outOfStock}</div>
          <div className={styles.metricChange}>Needs attention</div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>Categories</div>
          <div className={styles.metricValue}>{stats.categories.length}</div>
          <div className={styles.metricChange}>Product types</div>
        </div>
      </div>

      {/* Availability Status */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Inventory Status</h2>
        <div className={styles.statusGrid}>
          <div className={styles.statusCard}>
            <div className={styles.statusHeader}>
              <span className={styles.statusIcon}>✅</span>
              <span className={styles.statusName}>Available</span>
            </div>
            <div className={styles.statusValue}>{stats.products.available}</div>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ 
                  width: `${availabilityRate}%`,
                  background: '#10B981'
                }}
              ></div>
            </div>
            <div className={styles.statusPercentage}>{availabilityRate.toFixed(1)}% of total</div>
          </div>

          <div className={styles.statusCard}>
            <div className={styles.statusHeader}>
              <span className={styles.statusIcon}>⚠️</span>
              <span className={styles.statusName}>Out of Stock</span>
            </div>
            <div className={styles.statusValue}>{stats.products.outOfStock}</div>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ 
                  width: `${((stats.products.outOfStock / stats.products.total) * 100)}%`,
                  background: '#EF4444'
                }}
              ></div>
            </div>
            <div className={styles.statusPercentage}>
              {((stats.products.outOfStock / stats.products.total) * 100).toFixed(1)}% of total
            </div>
          </div>
        </div>
      </div>

      {/* Products by Category */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Products by Category</h2>
        <div className={styles.categoryGrid}>
          {stats.categories.map((cat: any) => {
            const percentage = (cat.count / stats.products.total) * 100;
            return (
              <div key={cat.category} className={styles.categoryCard}>
                <div className={styles.categoryHeader}>
                  <span className={styles.categoryName}>{cat.category}</span>
                  <span className={styles.categoryCount}>{cat.count}</span>
                </div>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill} 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className={styles.categoryPercentage}>
                  {percentage.toFixed(1)}% of inventory
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className={styles.actions}>
        <button onClick={() => navigate('/admin/products')} className={styles.actionButton}>
          Manage Products
        </button>
        <button onClick={() => navigate('/admin/products')} className={styles.actionButton}>
          Add New Product
        </button>
      </div>
    </div>
  );
};

export default ProductsAnalyticsPage;
