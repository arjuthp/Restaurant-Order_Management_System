import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/shared/components/Button';
import { Modal } from '@/shared/components/Modal';
import { useNavigate } from 'react-router-dom';
import styles from './CartPage.module.css';

const CartPage = () => {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, getTotalPrice, isSyncing } = useCartStore();
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set(items.map(i => i.productId)));

  const handleCheckout = () => {
    // Navigate to checkout page with selected items
    navigate('/checkout', { state: { selectedItems: Array.from(selectedItems) } });
  };

  const toggleItemSelection = (productId: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === items.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(items.map(i => i.productId)));
    }
  };

  const handleRemoveClick = (productId: string) => {
    setItemToRemove(productId);
  };

  const confirmRemove = async () => {
    if (itemToRemove) {
      setIsRemoving(true);
      try {
        await removeItem(itemToRemove);
      } catch (err) {
        console.error('Failed to remove item:', err);
        // Item is still removed locally
      } finally {
        setIsRemoving(false);
        setItemToRemove(null);
      }
    }
  };

  const cancelRemove = () => {
    setItemToRemove(null);
  };

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    // Enforce min 1 and max 10
    const clampedQuantity = Math.max(1, Math.min(10, newQuantity));
    try {
      await updateQuantity(productId, clampedQuantity);
    } catch (err) {
      console.error('Failed to update quantity:', err);
      // Quantity is still updated locally
    }
  };

  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}></div>
        <h2>Your cart is empty</h2>
        <p>Add some delicious items to get started!</p>
        <Button onClick={() => navigate('/products')}>Browse Menu</Button>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const selectedSubtotal = items
    .filter(item => selectedItems.has(item.productId))
    .reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Shopping Cart</h1>

      <div className={styles.selectAllBar}>
        <label>
          <input
            type="checkbox"
            checked={selectedItems.size === items.length && items.length > 0}
            onChange={toggleSelectAll}
          />
          <span>Select All ({selectedItems.size} of {items.length} selected)</span>
        </label>
      </div>

      <div className={styles.content}>
        <div className={styles.items}>
          {items.map((item) => (
            <div key={item.productId} className={`${styles.item} ${!selectedItems.has(item.productId) ? styles.itemUnselected : ''}`}>
              <input
                type="checkbox"
                checked={selectedItems.has(item.productId)}
                onChange={() => toggleItemSelection(item.productId)}
                className={styles.itemCheckbox}
                aria-label={`Select ${item.name}`}
              />
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
                  disabled={isSyncing}
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
            <span>All Items Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Selected Items ({selectedItems.size})</span>
            <span>${selectedSubtotal.toFixed(2)}</span>
          </div>
          <div className={`${styles.summaryRow} ${styles.total}`}>
            <span>Total to Order</span>
            <span>${selectedSubtotal.toFixed(2)}</span>
          </div>
          <Button fullWidth onClick={handleCheckout} disabled={selectedItems.size === 0}>
            Proceed to Checkout ({selectedItems.size} items)
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
            <Button variant="ghost" onClick={cancelRemove} disabled={isRemoving}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmRemove} disabled={isRemoving}>
              {isRemoving ? 'Removing...' : 'Remove'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CartPage;
