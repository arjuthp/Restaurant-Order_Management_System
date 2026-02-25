import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import cartService from '../services/cartService';
import orderService from '../services/orderService';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [placing, setPlacing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await cartService.getCart();
      setCart(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    try {
      const data = await cartService.updateQuantity(productId, newQuantity);
      setCart(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update quantity');
    }
  };

  const removeItem = async (productId) => {
    try {
      const data = await cartService.removeItem(productId);
      setCart(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove item');
    }
  };

  const placeOrder = async () => {
    if (!cart || cart.items.length === 0) {
      setError('Cart is empty');
      return;
    }

    try {
      setPlacing(true);
      await orderService.createOrder(orderNotes);
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  const calculateTotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + (item.unit_price * item.quantity), 0);
  };

  if (loading) return <div className="loading">Loading cart...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="cart-container container">
      <h1 style={{ marginBottom: '30px' }}>🛒 Shopping Cart</h1>

      {!cart || cart.items.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h2>Your cart is empty</h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>Add some delicious items from our menu!</p>
          <button onClick={() => navigate('/menu')} className="btn btn-primary">
            Browse Menu
          </button>
        </div>
      ) : (
        <>
          {cart.items.map(item => (
            <div key={item.product_id._id} className="cart-item">
              <div className="cart-item-image">🍽️</div>
              <div className="cart-item-details">
                <h3>{item.product_id.name}</h3>
                <p style={{ color: '#666' }}>{item.product_id.category}</p>
                <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2c3e50' }}>
                  Rs. {item.unit_price} × {item.quantity} = Rs. {item.unit_price * item.quantity}
                </p>
              </div>
              <div className="cart-item-actions">
                <div className="quantity-controls">
                  <button
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.product_id._id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span style={{ minWidth: '30px', textAlign: 'center' }}>{item.quantity}</span>
                  <button
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.product_id._id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.product_id._id)}
                  className="btn btn-danger"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="card" style={{ marginTop: '20px' }}>
            <h2 style={{ marginBottom: '20px' }}>Order Summary</h2>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '20px' }}>
              Total: Rs. {calculateTotal()}
            </div>

            <div className="form-group">
              <label className="form-label">Order Notes (Optional)</label>
              <textarea
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                className="form-input"
                rows="3"
                placeholder="Any special instructions..."
              />
            </div>

            <button
              onClick={placeOrder}
              disabled={placing}
              className="btn btn-success"
              style={{ width: '100%', fontSize: '1.1rem', padding: '15px' }}
            >
              {placing ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
