# Console Logging Guide

## Overview

The application now has comprehensive console logging throughout the entire system to help track operations, debug issues, and monitor application behavior.

## Log Format

All logs follow this format:
```
[EMOJI] [CATEGORY] Message: {details}
```

### Log Categories

| Category | Emoji | Purpose |
|----------|-------|---------|
| APP | 🚀 | Application lifecycle |
| AUTH | 🔐 | Authentication operations |
| AUTH API | 🔐 | Auth API calls |
| API REQUEST | 🌐 | Outgoing API requests |
| API RESPONSE | ✅ | Successful API responses |
| API ERROR | ❌ | Failed API requests |
| API AUTH | 🔄 | Token refresh operations |
| CART | 🛒 | Cart operations |
| CART INIT | 🚀 | Cart initialization |
| ORDERS API | 📦 | Orders API calls |
| PRODUCTS API | 🍽️ | Products API calls |
| USERS API | 👤 | Users API calls |

### Log Levels

| Symbol | Meaning |
|--------|---------|
| ✅ | Success |
| ❌ | Error |
| ⚠️  | Warning |
| ℹ️  | Info |
| 🔄 | Processing/Loading |
| 🚪 | Logout/Exit |
| 🗑️  | Delete |
| ✏️  | Update |
| ➕ | Create |
| 🔍 | Fetch/Search |

## What Gets Logged

### 1. Application Lifecycle

```javascript
🚀 [APP] Application initialized
🌐 [APP] Environment: { apiUrl, mode }
💥 [APP] Error boundary caught error
```

### 2. Authentication

```javascript
🔐 [AUTH] Setting authentication: { user, hasAccessToken, hasRefreshToken }
✅ [AUTH] Authentication set successfully
🚪 [AUTH] Clearing authentication
✅ [AUTH] Authentication cleared

🔐 [AUTH API] Attempting login: { email }
✅ [AUTH API] Login successful: { user, role }
❌ [AUTH API] Login failed

🔐 [AUTH API] Attempting admin login
🔐 [AUTH API] Attempting registration
🚪 [AUTH API] Attempting logout
🔄 [AUTH API] Refreshing token
```

### 3. API Requests

```javascript
🌐 [API REQUEST] GET /api/products { data, params }
🔑 [API REQUEST] Auth token attached
⚠️  [API REQUEST] No auth token found

✅ [API RESPONSE] GET /api/products { status, statusText, data }
❌ [API ERROR] GET /api/products { message, status, data }

🔄 [API AUTH] 401 detected, attempting token refresh...
✅ [API AUTH] Token refreshed successfully
❌ [API AUTH] Token refresh failed
🚪 [API AUTH] Redirecting to login...
```

### 4. Cart Operations

```javascript
🛒 [CART] Adding item to cart: { name, productId, quantity, price }
📝 [CART] Item already exists, updating quantity
✨ [CART] New item added to local cart
🔄 [CART] Syncing with backend...
✅ [CART] Backend sync successful
❌ [CART] Failed to sync add item with backend
⚠️  [CART] Item kept in local cart, will retry on next operation

🔢 [CART] Updating item quantity: { productId, name, oldQuantity, newQuantity }
🗑️  [CART] Quantity is 0, removing item
🗑️  [CART] Removing item from cart: { productId, name }
🧹 [CART] Clearing cart
🔄 [CART] Updating local cart from backend data

🚀 [CART INIT] User logged in, initializing cart
👤 [CART INIT] User: { name, email, role }
📥 [CART] Loading cart from backend...
📥 [CART] Backend cart loaded: { itemCount, items }
✅ [CART] Local cart updated from backend
ℹ️  [CART] Backend cart is empty
👋 [CART INIT] User logged out, resetting cart initialization
```

### 5. Orders

```javascript
📦 [ORDERS API] Creating order: { notes }
✅ [ORDERS API] Order created successfully: { orderId, totalPrice, itemCount }
❌ [ORDERS API] Failed to create order

📋 [ORDERS API] Fetching my orders: { page, limit, status }
✅ [ORDERS API] Orders fetched: { count, page, total }

🔍 [ORDERS API] Fetching order: orderId
✅ [ORDERS API] Order fetched: { orderId, status }

❌ [ORDERS API] Cancelling order: orderId
✅ [ORDERS API] Order cancelled successfully

👨‍💼 [ORDERS API] Fetching all orders (admin)
🔄 [ORDERS API] Updating order status: { orderId, status }
```

### 6. Products

```javascript
🍽️  [PRODUCTS API] Fetching products: { search, category, page }
✅ [PRODUCTS API] Products fetched: { count, page, total }

🔍 [PRODUCTS API] Fetching product: productId
✅ [PRODUCTS API] Product fetched: productName

📂 [PRODUCTS API] Fetching products by category: category
➕ [PRODUCTS API] Creating product: productName
✏️  [PRODUCTS API] Updating product: productId
🗑️  [PRODUCTS API] Deleting product: productId
```

### 7. Users

```javascript
👤 [USERS API] Fetching my profile
✅ [USERS API] Profile fetched: { name, email, role }

✏️  [USERS API] Updating profile: { name, phone, address }
✅ [USERS API] Profile updated
```

## How to Use Console Logs

### 1. Normal Development

Open browser console (F12) and you'll see all operations in real-time:

```
🚀 [APP] Application initialized
🚀 [CART INIT] User logged in, initializing cart
📥 [CART] Loading cart from backend...
🌐 [API REQUEST] GET /api/cart
✅ [API RESPONSE] GET /api/cart
📥 [CART] Backend cart loaded: { itemCount: 2 }
✅ [CART] Local cart updated from backend
```

### 2. Debugging Issues

Filter console by category:
- Type `[CART]` to see only cart operations
- Type `[API ERROR]` to see only errors
- Type `❌` to see all failures

### 3. Tracking User Flow

Follow a complete user journey:

```
// User logs in
🔐 [AUTH API] Attempting login: { email: "user@example.com" }
🌐 [API REQUEST] POST /api/auth/login
✅ [API RESPONSE] POST /api/auth/login
✅ [AUTH API] Login successful: { user: "John", role: "customer" }
🔐 [AUTH] Setting authentication

// Cart initializes
🚀 [CART INIT] User logged in, initializing cart
📥 [CART] Loading cart from backend...
✅ [CART] Backend cart loaded: { itemCount: 0 }

// User adds item
🛒 [CART] Adding item to cart: { name: "Pizza", quantity: 1 }
✨ [CART] New item added to local cart
🔄 [CART] Syncing with backend...
🌐 [API REQUEST] POST /api/cart/items
✅ [API RESPONSE] POST /api/cart/items
✅ [CART] Backend sync successful

// User places order
📦 [ORDERS API] Creating order
🌐 [API REQUEST] POST /api/orders
✅ [API RESPONSE] POST /api/orders
✅ [ORDERS API] Order created successfully: { orderId: "123" }
```

### 4. Performance Monitoring

Track API response times by looking at timestamps in console.

### 5. Error Investigation

When errors occur, you'll see:

```
❌ [API ERROR] POST /api/cart/items {
  message: "Product not found",
  status: 404,
  data: { success: false, error: { message: "Product not found" } }
}
❌ [CART] Failed to sync add item with backend
⚠️  [CART] Item kept in local cart, will retry on next operation
```

## Console Filtering Tips

### Chrome DevTools

1. **Filter by text**: Type in the filter box
   - `[CART]` - Show only cart logs
   - `❌` - Show only errors
   - `API` - Show all API logs

2. **Filter by level**:
   - Click "Errors" to show only console.error()
   - Click "Warnings" to show only console.warn()
   - Click "Info" to show console.log()

3. **Regex filtering**:
   - `/\[CART\]|\[API\]/` - Show cart and API logs
   - `/❌|⚠️/` - Show errors and warnings

### Firefox DevTools

Similar filtering available in the console filter box.

## Production Considerations

### Disabling Logs in Production

To disable logs in production, you can:

1. **Environment-based logging**:
```typescript
const isDev = import.meta.env.MODE === 'development';
if (isDev) {
  console.log('🛒 [CART] Adding item...');
}
```

2. **Custom logger utility**:
```typescript
// utils/logger.ts
export const logger = {
  log: (...args: any[]) => {
    if (import.meta.env.MODE === 'development') {
      console.log(...args);
    }
  },
  error: (...args: any[]) => {
    console.error(...args); // Always log errors
  }
};
```

3. **Build-time removal**:
Vite automatically removes console.log in production builds if configured.

## Troubleshooting

### No Logs Appearing

1. Check console filter - clear all filters
2. Check console level - ensure "Info" is enabled
3. Check browser console settings
4. Hard refresh (Ctrl+Shift+R)

### Too Many Logs

1. Filter by specific category: `[CART]`
2. Filter by errors only: `❌`
3. Clear console regularly (Ctrl+L)

### Missing Expected Logs

1. Check if operation actually executed
2. Check for JavaScript errors blocking execution
3. Verify you're on the correct page/component

## Best Practices

1. **Keep console open during development** - Catch issues early
2. **Filter by category** - Focus on what you're working on
3. **Check logs before reporting bugs** - Logs often reveal the issue
4. **Copy error logs** - Include them in bug reports
5. **Monitor API calls** - Ensure backend communication is working

## Example Debugging Scenarios

### Scenario 1: Cart Not Syncing

Look for:
```
🛒 [CART] Adding item to cart
✨ [CART] New item added to local cart
🔄 [CART] Syncing with backend...
❌ [CART] Failed to sync add item with backend  ← Problem here!
```

### Scenario 2: Order Placement Failing

Look for:
```
📦 [ORDERS API] Creating order
🌐 [API REQUEST] POST /api/orders
❌ [API ERROR] POST /api/orders {
  status: 400,
  data: { message: "Cart is empty" }  ← Problem here!
}
```

### Scenario 3: Authentication Issues

Look for:
```
🔐 [AUTH API] Attempting login
🌐 [API REQUEST] POST /api/auth/login
❌ [API ERROR] POST /api/auth/login {
  status: 401,
  data: { message: "Invalid credentials" }  ← Problem here!
}
```

## Summary

With comprehensive logging enabled, you can now:
- ✅ Track every operation in real-time
- ✅ Debug issues quickly
- ✅ Monitor API calls and responses
- ✅ Understand user flow
- ✅ Catch errors early
- ✅ Verify cart synchronization
- ✅ Monitor authentication state

The logs are designed to be informative but not overwhelming, with clear categories and emojis for quick visual scanning.
