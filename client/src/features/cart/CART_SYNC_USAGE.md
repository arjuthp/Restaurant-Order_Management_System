# Cart Sync Usage Guide

This document explains how to use the cart synchronization functionality implemented in task 3.3.

## Overview

The cart sync feature ensures that the frontend cart state is synchronized with the backend before checkout. This is important because:

1. The backend needs to validate product availability
2. Prices may have changed since items were added to cart
3. Products may have been removed or become unavailable
4. The backend cart is the source of truth for order creation

## Implementation Details

### Files Created/Modified

1. **`client/src/services/api/cartApi.ts`** - Cart API service with sync functionality
2. **`client/src/store/cartStore.ts`** - Updated cart store with sync methods
3. **`client/src/features/cart/hooks/useCartSync.ts`** - Custom hook for easy sync usage
4. **`client/src/store/__tests__/cartStore.test.ts`** - Tests for sync functionality

### How It Works

The sync process:

1. Clears the backend cart (DELETE /api/cart)
2. Adds all items from frontend cart to backend (POST /api/cart/items for each item)
3. Retrieves the updated cart from backend (GET /api/cart)
4. Updates the local cart with backend response

This ensures the backend cart exactly matches the frontend cart, and any discrepancies (unavailable products, price changes) are reflected in the local cart.

## Usage Examples

### Example 1: Using the Custom Hook (Recommended)

```typescript
import { useCartSync } from '@/features/cart/hooks/useCartSync';
import { useCartStore } from '@/store/cartStore';

function CheckoutPage() {
  const { syncCart, isSyncing, syncError } = useCartSync();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  const handleCheckout = async () => {
    // Sync cart with backend before checkout
    const success = await syncCart();
    
    if (!success) {
      // Show error to user
      alert(`Failed to sync cart: ${syncError}`);
      return;
    }

    // Proceed with order creation
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: 'Please deliver quickly' }),
      });

      if (response.ok) {
        clearCart();
        // Navigate to order confirmation
      }
    } catch (error) {
      console.error('Order creation failed:', error);
    }
  };

  return (
    <div>
      <h1>Checkout</h1>
      {/* Display cart items */}
      <button onClick={handleCheckout} disabled={isSyncing}>
        {isSyncing ? 'Syncing...' : 'Place Order'}
      </button>
      {syncError && <p className="error">{syncError}</p>}
    </div>
  );
}
```

### Example 2: Using the Store Directly

```typescript
import { useCartStore } from '@/store/cartStore';
import { useState } from 'react';

function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const syncWithBackend = useCartStore((state) => state.syncWithBackend);
  const clearCart = useCartStore((state) => state.clearCart);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      // Sync cart with backend
      await syncWithBackend();

      // Create order
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: 'Special instructions' }),
      });

      if (response.ok) {
        clearCart();
        // Navigate to success page
      }
    } catch (err: any) {
      setError(err.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleCheckout} disabled={loading}>
        {loading ? 'Processing...' : 'Place Order'}
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
```

### Example 3: Updating Cart from Backend Response

```typescript
import { useCartStore } from '@/store/cartStore';
import { useEffect } from 'react';
import { cartApi } from '@/services/api/cartApi';

function CartPage() {
  const updateFromBackend = useCartStore((state) => state.updateFromBackend);
  const items = useCartStore((state) => state.items);

  useEffect(() => {
    // Load cart from backend on mount
    const loadBackendCart = async () => {
      try {
        const backendCart = await cartApi.getCart();
        updateFromBackend(backendCart.items);
      } catch (error) {
        console.error('Failed to load cart:', error);
      }
    };

    loadBackendCart();
  }, [updateFromBackend]);

  return (
    <div>
      <h1>Your Cart</h1>
      {items.map((item) => (
        <div key={item.productId}>
          {item.name} - ${item.price} x {item.quantity}
        </div>
      ))}
    </div>
  );
}
```

## Error Handling

The sync functionality handles errors gracefully:

1. **Network errors**: Caught and re-thrown with descriptive messages
2. **Individual item failures**: Logged but don't stop the sync process
3. **Backend validation errors**: Returned in error message (e.g., "Product not available")

Always wrap sync calls in try-catch blocks and show appropriate error messages to users.

## Testing

Tests are located in `client/src/store/__tests__/cartStore.test.ts` and cover:

- Updating local cart from backend data
- Replacing existing cart items
- Handling empty backend carts
- All existing cart functionality

Run tests with:
```bash
npm test -- cartStore.test.ts --run
```

## API Reference

### cartApi.syncCart(items)

Syncs local cart items with backend.

**Parameters:**
- `items: CartItem[]` - Array of cart items to sync

**Returns:**
- `Promise<BackendCart>` - The updated cart from backend

**Throws:**
- `Error` - If sync fails

### useCartStore.syncWithBackend()

Store method to sync cart with backend and update local state.

**Returns:**
- `Promise<void>`

**Throws:**
- `Error` - If sync fails

### useCartStore.updateFromBackend(backendItems)

Updates local cart with backend cart data.

**Parameters:**
- `backendItems: BackendCartItem[]` - Cart items from backend

**Returns:**
- `void`

## Notes

- The backend doesn't have a dedicated `/sync` endpoint, so we use existing endpoints
- Sync clears and rebuilds the backend cart to ensure consistency
- Always sync before checkout to ensure data accuracy
- The local cart is automatically updated with backend response
- Sync is idempotent - calling it multiple times is safe
