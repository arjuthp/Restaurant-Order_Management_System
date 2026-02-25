import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import orderService from '../../services/orderService';
import productService from '../../services/productService';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalProducts: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [orders, products] = await Promise.all([
        orderService.getAllOrders(),
        productService.getAllProducts()
      ]);

      const pendingOrders = orders.filter(o => o.status === 'pending').length;
      const totalRevenue = orders
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, o) => sum + o.total_price, 0);

      setStats({
        totalOrders: orders.length,
        pendingOrders,
        totalProducts: products.length,
        totalRevenue
      });
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="container">
      <h1 style={{ marginBottom: '30px' }}>📊 Admin Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <h3 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{stats.totalOrders}</h3>
          <p style={{ fontSize: '1.1rem' }}>Total Orders</p>
        </div>

        <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
          <h3 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{stats.pendingOrders}</h3>
          <p style={{ fontSize: '1.1rem' }}>Pending Orders</p>
        </div>

        <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
          <h3 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{stats.totalProducts}</h3>
          <p style={{ fontSize: '1.1rem' }}>Total Products</p>
        </div>

        <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white' }}>
          <h3 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Rs. {stats.totalRevenue}</h3>
          <p style={{ fontSize: '1.1rem' }}>Total Revenue</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        <div className="card">
          <h2 style={{ marginBottom: '15px' }}>🍽️ Manage Products</h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>Add, edit, or remove menu items</p>
          <Link to="/admin/products" className="btn btn-primary" style={{ width: '100%' }}>
            Go to Products
          </Link>
        </div>

        <div className="card">
          <h2 style={{ marginBottom: '15px' }}>📦 Manage Orders</h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>View and update order status</p>
          <Link to="/admin/orders" className="btn btn-primary" style={{ width: '100%' }}>
            Go to Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
