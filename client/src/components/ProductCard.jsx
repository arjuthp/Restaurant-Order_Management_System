import { useState } from 'react';
import cartService from '../services/cartService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (isAdmin) {
      setMessage('Admins cannot add items to cart');
      return;
    }

    try {
      setLoading(true);
      await cartService.addToCart(product._id, quantity);
      setMessage('Added to cart!');
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to add to cart');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-card">
      <div className="product-image">
        🍽️
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <span className="product-category">{product.category}</span>
        <p className="product-description">{product.description}</p>
        <div className="product-price">Rs. {product.price}</div>
        
        {!isAdmin && (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              style={{ width: '60px', padding: '8px' }}
              className="form-input"
            />
            <button
              onClick={handleAddToCart}
              disabled={loading}
              className="btn btn-primary"
              style={{ flex: 1 }}
            >
              {loading ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
        )}
        
        {message && (
          <div style={{ marginTop: '10px', color: message.includes('Failed') ? 'red' : 'green' }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
