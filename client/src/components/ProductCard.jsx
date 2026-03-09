import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import cartService from '../services/cartService';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, isAdmin } = useAuth();
  const { fetchCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (isAdmin) {
      toast.error('Admins cannot add items to cart');
      return;
    }

    try {
      setLoading(true);
      await cartService.addToCart(product._id, quantity);
      await fetchCart(); // Refresh global cart state
      toast.success(`${product.name} added to cart!`);
      setQuantity(1);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    } finally {
      setLoading(false);
    }
  };

  const getEmojiForCategory = (category) => {
    const cat = category.toLowerCase();
    if (cat.includes('momo') || cat.includes('nepali')) return '🥟';
    if (cat.includes('pizza')) return '🍕';
    if (cat.includes('burger')) return '🍔';
    if (cat.includes('drink') || cat.includes('beverage')) return '🥤';
    if (cat.includes('dessert') || cat.includes('sweet')) return '🍰';
    return '🍽️';
  };

  return (
    <div className="product-card">
      <div className="product-image-wrapper">
        <div className="product-image">
          {getEmojiForCategory(product.category)}
        </div>
      </div>

      <div className="product-info">
        <div className="product-category">{product.category}</div>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>

        <div className="product-footer">
          <div className="product-price-container">
            <span className="product-price-label">Price</span>
            <div className="product-price">Rs. {product.price?.toLocaleString()}</div>
          </div>

          {!isAdmin && (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <div className="qty-stepper">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <input type="text" value={quantity} readOnly />
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>

              <motion.button
                onClick={handleAddToCart}
                disabled={loading}
                className="btn btn-primary btn-sm"
                whileTap={{ scale: 0.95 }}
                style={{ height: '34px', minWidth: '80px', padding: '0 12px' }}
              >
                {loading ? '...' : '🛒 Add'}
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
