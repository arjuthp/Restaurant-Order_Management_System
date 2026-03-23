import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { ordersApi } from '@/services/api/ordersApi';
import { cartApi } from '@/services/api/cartApi';
import { Button } from '@/shared/components/Button';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import styles from './CheckoutPage.module.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, clearCart, loadFromBackend, removeItem } = useCartStore();
  const { user } = useAuthStore();
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasValidated, setHasValidated] = useState(false);

  // Get selected items from navigation state
  const selectedItemIds = (location.state as any)?.selectedItems as string[] | undefined;
  
  // Filter items to only show selected ones
  const itemsToOrder = selectedItemIds 
    ? items.filter(item => selectedItemIds.includes(item.productId))
    : items;

  const total = itemsToOrder.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Debug: Log user info
  console.log('Current user:', user);

  // Validate cart on page load - ensure backend has the cart
  useEffect(() => {
    const validateCart = async () => {
      if (items.length > 0 && !hasValidated) {
        try {
          console.log('🔄 Validating cart with backend...');
          await loadFromBackend();
          setHasValidated(true);
          console.log('✅ Cart validated');
        } catch (err) {
          console.error('Failed to validate cart:', err);
          // Continue anyway - items are in local cart
        }
      }
    };
    validateCart();
  }, [items.length, hasValidated, loadFromBackend]);

  const handlePlaceOrder = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('📦 Creating order from backend cart...');
      console.log('Frontend cart items:', items);
      console.log('Selected items to order:', selectedItemIds);
      
      // FORCE SYNC: Ensure backend cart has all items before placing order
      console.log('🔄 FORCE SYNCING cart to backend before order...');
      try {
        // Add each item to backend cart
        for (const item of itemsToOrder) {
          console.log(`Adding ${item.name} (${item.productId}) to backend cart...`);
          await cartApi.addItem(item.productId, item.quantity);
        }
        console.log('✅ Cart force-synced to backend');
      } catch (syncError: any) {
        console.error('❌ Failed to sync cart:', syncError);
        setError('Failed to sync cart. Please try again.');
        setIsLoading(false);
        return;
      }
      
      // Now create the order
      const order = await ordersApi.createOrder({
        itemsToOrder: selectedItemIds, // Send selected product IDs to backend
        notes: specialInstructions || undefined,
      });
      console.log('✅ Order created:', order);

      // Remove only ordered items from frontend cart
      if (selectedItemIds && selectedItemIds.length > 0) {
        for (const productId of selectedItemIds) {
          await removeItem(productId);
        }
      } else {
        // If no selection, clear entire cart
        await clearCart();
      }

      // Show success and redirect to order details
      navigate(`/orders/${order._id}`, {
        state: { message: 'Order placed successfully!' },
      });
    } catch (err: any) {
      console.error('❌ Failed to place order:', err);
      console.error('Error details:', {
        status: err.response?.status,
        statusText: err.response?.statusText,
        message: err.response?.data?.message,
        data: err.response?.data,
      });
      
      // Check if it's a 403 error
      if (err.response?.status === 403) {
        setError(
          'Access denied. Please make sure you are logged in as a customer (not admin). ' +
          (err.response?.data?.message || '')
        );
      } else if (err.response?.status === 400 && err.response?.data?.message?.includes('Cart is empty')) {
        setError(
          'Your cart appears to be empty on the server. Please try adding items again or refresh the page.'
        );
      } else {
        setError(
          err.response?.data?.message ||
            err.message ||
            'Failed to place order. Please try again.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect to cart if no items to order
  if (itemsToOrder.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Checkout</h1>

      {/* Debug Info */}
      {user && (
        <div style={{ 
          padding: '10px', 
          marginBottom: '20px', 
          backgroundColor: user.role === 'customer' ? '#d4edda' : '#f8d7da',
          border: `1px solid ${user.role === 'customer' ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '4px'
        }}>
          <strong>Debug Info:</strong> Logged in as <strong>{user.name}</strong> ({user.email}) 
          - Role: <strong>{user.role}</strong>
          {user.role !== 'customer' && (
            <div style={{ color: '#721c24', marginTop: '5px' }}>
              ⚠️ Warning: Only customers can place orders. You are logged in as {user.role}.
            </div>
          )}
        </div>
      )}

      <div className={styles.content}>
        {/* Order Summary Section */}
        <div className={styles.orderSummary}>
          <h2>Order Summary</h2>
          {selectedItemIds && selectedItemIds.length < items.length && (
            <p className={styles.selectionNote}>
              Ordering {itemsToOrder.length} of {items.length} items from your cart
            </p>
          )}
          
          <div className={styles.items}>
            {itemsToOrder.map((item) => (
              <div key={item.productId} className={styles.item}>
                <img
                  src={item.image_url || '/placeholder-food.jpg'}
                  alt={item.name}
                  className={styles.itemImage}
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-food.jpg';
                  }}
                />
                <div className={styles.itemDetails}>
                  <h3>{item.name}</h3>
                  <p className={styles.itemPrice}>
                    ${item.price.toFixed(2)} × {item.quantity}
                  </p>
                </div>
                <div className={styles.itemTotal}>
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* Special Instructions */}
          <div className={styles.specialInstructions}>
            <label htmlFor="specialInstructions">
              Special Instructions (Optional)
            </label>
            <textarea
              id="specialInstructions"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="Any special requests or dietary requirements?"
              rows={4}
              maxLength={500}
            />
            <span className={styles.charCount}>
              {specialInstructions.length}/500
            </span>
          </div>
        </div>

        {/* Order Total and Place Order Section */}
        <div className={styles.orderTotal}>
          <h2>Order Total</h2>
          
          <div className={styles.totalBreakdown}>
            <div className={styles.totalRow}>
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className={styles.totalRow}>
              <span>Tax</span>
              <span>$0.00</span>
            </div>
            <div className={styles.totalRow}>
              <span>Delivery Fee</span>
              <span>$0.00</span>
            </div>
            <div className={`${styles.totalRow} ${styles.grandTotal}`}>
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          {error && (
            <div className={styles.error} role="alert">
              {error}
            </div>
          )}

          <Button
            fullWidth
            onClick={handlePlaceOrder}
            disabled={isLoading || itemsToOrder.length === 0}
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" />
                <span>Placing Order...</span>
              </>
            ) : (
              `Place Order (${itemsToOrder.length} item${itemsToOrder.length !== 1 ? 's' : ''})`
            )}
          </Button>

          <Button
            fullWidth
            variant="ghost"
            onClick={() => navigate('/cart')}
            disabled={isLoading}
          >
            Back to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
