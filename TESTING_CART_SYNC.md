# Testing Cart Synchronization

## Prerequisites

1. Backend server running on `http://localhost:5000`
2. Frontend dev server running on `http://localhost:3000`
3. MongoDB running and connected
4. User account created (customer role)

## Test Scenarios

### Test 1: Basic Add to Cart

**Steps:**
1. Login as a customer
2. Navigate to Products page
3. Click "Add to Cart" on any product
4. Check browser console - should see no errors
5. Navigate to Cart page
6. Verify item appears in cart

**Expected Result:**
- ✅ Item appears instantly in cart
- ✅ No console errors
- ✅ Backend cart updated (verify in MongoDB or backend logs)

**Verify Backend:**
```bash
# Check MongoDB cart collection
mongosh restaurant
db.carts.find().pretty()
```

---

### Test 2: Update Quantity

**Steps:**
1. Go to Cart page with items
2. Click + or - to change quantity
3. Verify quantity updates instantly
4. Check browser console

**Expected Result:**
- ✅ Quantity updates immediately
- ✅ Total price recalculates
- ✅ Backend synced (check MongoDB)

---

### Test 3: Remove Item

**Steps:**
1. Go to Cart page with items
2. Click "Remove" on an item
3. Confirm removal in modal
4. Verify item disappears

**Expected Result:**
- ✅ Item removed instantly
- ✅ Backend synced (check MongoDB)

---

### Test 4: Place Order (Main Fix)

**Steps:**
1. Add items to cart
2. Navigate to Checkout page
3. Check browser console - should see "Validating cart with backend..."
4. Fill in special instructions (optional)
5. Click "Place Order"
6. Wait for response

**Expected Result:**
- ✅ Order created successfully
- ✅ Redirected to order details page
- ✅ Cart cleared
- ✅ No "Cart is empty" error

**Verify Backend:**
```bash
# Check orders collection
mongosh restaurant
db.orders.find().sort({createdAt: -1}).limit(1).pretty()
```

---

### Test 5: Cart Persistence

**Steps:**
1. Login and add items to cart
2. Close browser completely
3. Reopen browser
4. Login again
5. Check cart

**Expected Result:**
- ✅ Cart items restored from backend
- ✅ All items present with correct quantities

---

### Test 6: Multi-Device Sync (Optional)

**Steps:**
1. Login on Device A (e.g., Chrome)
2. Add items to cart
3. Login on Device B (e.g., Firefox or Incognito)
4. Check cart on Device B

**Expected Result:**
- ✅ Cart items appear on Device B
- ✅ Same items and quantities

---

### Test 7: Network Failure Handling

**Steps:**
1. Open browser DevTools → Network tab
2. Set throttling to "Offline"
3. Try to add item to cart
4. Check console for error
5. Set throttling back to "Online"
6. Add another item

**Expected Result:**
- ✅ Item added to local cart even when offline
- ✅ Error logged in console
- ✅ When back online, next operation syncs everything

---

### Test 8: Product Unavailable

**Steps:**
1. Add a product to cart
2. In backend, mark that product as unavailable:
   ```javascript
   db.products.updateOne(
     { _id: ObjectId("product_id") },
     { $set: { is_available: false } }
   )
   ```
3. Try to add the same product again

**Expected Result:**
- ✅ Error message: "Product is not available"
- ✅ Item not added to cart

---

### Test 9: Product Deleted

**Steps:**
1. Add a product to cart
2. In backend, soft-delete that product:
   ```javascript
   db.products.updateOne(
     { _id: ObjectId("product_id") },
     { $set: { is_deleted: true, is_available: false } }
   )
   ```
3. Try to checkout

**Expected Result:**
- ✅ Error message about product not found
- ✅ User can remove item and continue

---

### Test 10: Empty Cart Checkout

**Steps:**
1. Ensure cart is empty
2. Try to navigate to `/checkout` directly

**Expected Result:**
- ✅ Redirected back to cart page
- ✅ Message: "Your cart is empty"

---

## Debugging

### Check Frontend State

Open browser console and run:
```javascript
// Get current cart state
JSON.parse(localStorage.getItem('cart-storage'))

// Check Zustand store
useCartStore.getState()
```

### Check Backend State

```bash
# Connect to MongoDB
mongosh restaurant

# Check cart for specific user
db.carts.findOne({ user_id: ObjectId("user_id") })

# Check all carts
db.carts.find().pretty()

# Check recent orders
db.orders.find().sort({createdAt: -1}).limit(5).pretty()
```

### Check Backend Logs

```bash
# In backend terminal, you should see:
POST /api/cart/items 200
PATCH /api/cart/items/:id 200
DELETE /api/cart/items/:id 200
GET /api/cart 200
POST /api/orders 201
```

---

## Common Issues & Solutions

### Issue: "Cart is empty" on checkout

**Cause:** Backend cart not synced
**Solution:** 
- Check if items are being added to backend
- Verify MongoDB connection
- Check backend logs for errors

### Issue: Items disappear after refresh

**Cause:** Backend cart not loading on app start
**Solution:**
- Check `useCartInitialization` hook is working
- Verify `GET /api/cart` returns data
- Check browser console for errors

### Issue: Quantity not updating

**Cause:** Backend sync failing
**Solution:**
- Check network tab for failed requests
- Verify product still exists
- Check backend validation

### Issue: Duplicate items in cart

**Cause:** Race condition in sync
**Solution:**
- This shouldn't happen with current implementation
- If it does, clear cart and re-add items

---

## Performance Testing

### Load Test: Multiple Operations

**Steps:**
1. Rapidly add 10 items to cart
2. Rapidly update quantities
3. Check if all operations complete

**Expected Result:**
- ✅ All operations complete successfully
- ✅ No race conditions
- ✅ Final state is correct

### Stress Test: Large Cart

**Steps:**
1. Add 20+ different items to cart
2. Navigate to cart page
3. Update multiple quantities
4. Proceed to checkout

**Expected Result:**
- ✅ UI remains responsive
- ✅ All items sync correctly
- ✅ Order places successfully

---

## Monitoring Checklist

After deployment, monitor:

- [ ] Cart sync success rate (should be >99%)
- [ ] Average sync latency (should be <500ms)
- [ ] Rollback frequency (should be rare)
- [ ] Checkout success rate
- [ ] "Cart is empty" error rate (should be 0%)

---

## Success Criteria

✅ All test scenarios pass
✅ No "Cart is empty" errors on checkout
✅ Cart persists across sessions
✅ Backend cart always in sync with frontend
✅ Graceful error handling
✅ No console errors during normal operation
