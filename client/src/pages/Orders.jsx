import { useState, useEffect } from 'react';
import orderService from '../services/orderService';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getMyOrders();
      setOrders(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      await orderService.cancelOrder(orderId);
      fetchOrders();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel order');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const filteredOrders = orders.filter(order => {
    const orderId = order._id.slice(-6).toLowerCase();
    const orderStatus = order.status.toLowerCase();
    const orderItems = order.items.map(item => item.product_id?.name || '').join(' ').toLowerCase();
    const search = searchQuery.toLowerCase();
    
    return orderId.includes(search) || 
           orderStatus.includes(search) || 
           orderItems.includes(search);
  });

  if (loading) return <div className="loading">Loading orders...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="container">
      <h1 style={{ marginBottom: '30px' }}>📦 My Orders</h1>

      {/* Search Bar */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              placeholder="🔍 Search orders by ID, status, or items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && setSearchQuery(e.target.value)}
              className="form-input"
              style={{ fontSize: '1rem', padding: '12px', paddingRight: '40px', width: '100%' }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: '#999',
                  padding: '0 5px'
                }}
              >
                ×
              </button>
            )}
          </div>
          <button
            onClick={() => {/* Search is already real-time */}}
            className="btn btn-primary"
            style={{ whiteSpace: 'nowrap' }}
          >
            Search
          </button>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h2>No orders yet</h2>
          <p style={{ color: '#666' }}>Start ordering from our delicious menu!</p>
        </div>
      ) : (
        <>
          {filteredOrders.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
              <p>No orders match your search</p>
            </div>
          ) : (
            filteredOrders.map(order => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <div>
                <h3>Order #{order._id.slice(-6)}</h3>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>{formatDate(order.createdAt)}</p>
              </div>
              <span className={`order-status ${order.status}`}>
                {order.status.toUpperCase()}
              </span>
            </div>

            <div style={{ marginBottom: '15px' }}>
              {order.items.map((item, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                  <span>
                    {item.product_id?.name || 'Product'} × {item.quantity}
                  </span>
                  <span>Rs. {item.unit_price * item.quantity}</span>
                </div>
              ))}
            </div>

            {order.notes && (
              <div style={{ background: '#f5f5f5', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>
                <strong>Notes:</strong> {order.notes}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>
                Total: Rs. {order.total_price}
              </div>
              {order.status === 'pending' && (
                <button
                  onClick={() => cancelOrder(order._id)}
                  className="btn btn-danger"
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        ))
          )}
        </>
      )}
    </div>
  );
};

export default Orders;
