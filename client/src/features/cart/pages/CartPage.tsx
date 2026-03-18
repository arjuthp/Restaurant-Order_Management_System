import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/shared/components/Button';
import { Modal } from '@/shared/components/Modal';
import { useNavigate } from 'react-router-dom';
import styles from './CartPage.module.css';

const CartPage = () => {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);

  const handleCheckout = () => {
    // Navigate to checkout page
    navigate('/checkout');
  };

  const handleRemoveClick = (productId: string) => {
    setItemToRemove(productId);
  };

  const confirmRemove = () => {
    if (itemToRemove) {
      removeItem(itemToRemove);
      setItemToRemove(null);
    }
  };

  const cancelRemove = () => {
    setItemToRemove(null);
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    // Enforce min 1 and max 10
    const clampedQuantity = Math.max(1, Math.min(10, newQuantity));
    updateQuantity(productId, clampedQuantity);
  };

  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>🛒</div>
        <h2>Your cart is empty</h2>
        <p>Add some delicious items to get started!</p>
        <Button onClick={() => navigate('/products')}>Browse Menu</Button>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const total = subtotal;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Shopping Cart</h1>

      <div className={styles.content}>
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

              <div className={styles.itemInfo}>
                <h3>{item.name}</h3>
                <p className={styles.itemPrice}>${item.price.toFixed(2)} each</p>
                <p className={styles.itemSubtotal}>
                  Subtotal: ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>

              <div className={styles.itemActions}>
                <div className={styles.quantity}>
                  <button
                    onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                    disabled={item.quantity >= 10}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleRemoveClick(item.productId)}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.summary}>
          <h2>Order Summary</h2>
          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className={`${styles.summaryRow} ${styles.total}`}>
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <Button fullWidth onClick={handleCheckout}>
            Proceed to Checkout
          </Button>
        </div>
      </div>

      <Modal
        isOpen={itemToRemove !== null}
        onClose={cancelRemove}
        title="Remove Item"
        size="sm"
      >
        <div className={styles.confirmDialog}>
          <p>Are you sure you want to remove this item from your cart?</p>
          <div className={styles.confirmActions}>
            <Button variant="ghost" onClick={cancelRemove}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmRemove}>
              Remove
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CartPage;
