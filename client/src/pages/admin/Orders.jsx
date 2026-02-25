import { useState, useEffect } from 'react';
import orderService from '../../services/orderService';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getAllOrders();
      setOrders(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      fetchOrders();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const statuses = ['All', 'pending', 'confirmed', 'preparing', 'delivered', 'cancelled'];
  
  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'All' || order.status === filterStatus;
    
    const search = searchQuery.toLowerCase();
    const orderId = order._id.slice(-6).toLowerCase();
    const customerName = order.user_id?.name?.toLowerCase() || '';
    const customerEmail = order.user_id?.email?.toLowerCase() || '';
    const orderItems = order.items.map(item => item.product_id?.name || '').join(' ').toLowerCase();
    
    const matchesSearch = orderId.includes(search) ||
                         customerName.includes(search) ||
                         customerEmail.includes(search) ||
                         orderItems.includes(search);
    
    return matchesStatus && matchesSearch;
  });

  if (loading) return <div className="loading">Loading orders...</div>;

  return (
    <div className="container">
      <h1 style={{ marginBottom: '30px' }}>📦 Manage Orders</h1>

      {error && <div className="error">{error}</div>}

      {/* Status Filter */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
        {statuses.map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`btn ${filterStatus === status ? 'btn-primary' : 'btn-secondary'}`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              placeholder="🔍 Search by order ID, customer name, email, or items..."
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

      {filteredOrders.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <p>{searchQuery || filterStatus !== 'All' ? 'No orders match your filters' : 'No orders found'}</p>
        </div>
      ) : (
        filteredOrders.map(order => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <div>
                <h3>Order #{order._id.slice(-6)}</h3>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>
                  {formatDate(order.createdAt)}
                </p>
                <p style={{ fontWeight: '600', marginTop: '5px' }}>
                  Customer: {order.user_id?.name || 'Unknown'} ({order.user_id?.email})
                </p>
                {order.user_id?.phone && (
                  <p style={{ color: '#666', fontSize: '0.9rem' }}>
                    Phone: {order.user_id.phone}
                  </p>
                )}
              </div>
              <span className={`order-status ${order.status}`}>
                {order.status.toUpperCase()}
              </span>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <h4 style={{ marginBottom: '10px' }}>Items:</h4>
              {order.items.map((item, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: '8px 0', 
                  borderBottom: '1px solid #eee' 
                }}>
                  <span>
                    {item.product_id?.name || 'Product'} × {item.quantity}
                  </span>
                  <span>Rs. {item.unit_price * item.quantity}</span>
                </div>
              ))}
            </div>

            {order.notes && (
              <div style={{ 
                background: '#f5f5f5', 
                padding: '10px', 
                borderRadius: '5px', 
                marginBottom: '15px' 
              }}>
                <strong>Customer Notes:</strong> {order.notes}
              </div>
            )}

            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              paddingTop: '15px',
              borderTop: '2px solid #eee'
            }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>
                Total: Rs. {order.total_price}
              </div>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                {order.status === 'pending' && (
                  <button
                    onClick={() => updateStatus(order._id, 'confirmed')}
                    className="btn btn-success"
                  >
                    Confirm
                  </button>
                )}
                {order.status === 'confirmed' && (
                  <button
                    onClick={() => updateStatus(order._id, 'preparing')}
                    className="btn btn-primary"
                  >
                    Start Preparing
                  </button>
                )}
                {order.status === 'preparing' && (
                  <button
                    onClick={() => updateStatus(order._id, 'delivered')}
                    className="btn btn-success"
                  >
                    Mark Delivered
                  </button>
                )}
                {order.status !== 'cancelled' && order.status !== 'delivered' && (
                  <button
                    onClick={() => updateStatus(order._id, 'cancelled')}
                    className="btn btn-danger"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;
