import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore';
import { ordersApi } from '@/services/api/ordersApi';
import { Button } from '@/shared/components/Button';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import styles from './CheckoutPage.module.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart, syncWithBackend } = useCartStore();
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = getTotalPrice();

  const handlePlaceOrder = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Step 1: Sync cart with backend before placing order
      await syncWithBackend();

      // Step 2: Create order (backend will use cart items)
      const order = await ordersApi.createOrder({
        notes: specialInstructions || undefined,
      });

      // Step 3: Clear cart after successful order
      clearCart();

      // Step 4: Show success and redirect to order details
      navigate(`/orders/${order._id}`, {
        state: { message: 'Order placed successfully!' },
      });
    } catch (err: any) {
      console.error('Failed to place order:', err);
      setError(
        err.response?.data?.message ||
          err.message ||
          'Failed to place order. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect to cart if empty
  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Checkout</h1>

      <div className={styles.content}>
        {/* Order Summary Section */}
        <div className={styles.orderSummary}>
          <h2>Order Summary</h2>
          
          <div className={styles.items}>
            {items.map((item) => (
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
            disabled={isLoading || items.length === 0}
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" />
                <span>Placing Order...</span>
              </>
            ) : (
              'Place Order'
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
