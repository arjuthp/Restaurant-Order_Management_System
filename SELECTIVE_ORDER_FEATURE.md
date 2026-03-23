# Selective Order Feature Implementation

## Overview
Implemented the ability for users to select specific items from their cart to order, while keeping unselected items in the cart for later.

## Backend (Already Implemented)
The backend already supported this feature through the `itemsToOrder` parameter in the order creation endpoint:

```javascript
// src/service/order.service.js
async createOrder(userId, itemsToOrder = null, notes = null) {
  // If itemsToOrder is provided, only order those specific items
  // Otherwise, order all items in the cart
  
  // After order creation, only remove ordered items from cart
  if(itemsToOrder && itemsToOrder.length > 0){
    cart.items = cart.items.filter(item => 
      !itemsToOrder.includes(item.product_id._id.toString())
    );
  } else {
    cart.items = [];
  }
}
```

## Frontend Changes

### 1. Cart Page (`CartPage.tsx`)
Added item selection functionality:
- Checkbox for each cart item
- "Select All" checkbox at the top
- Visual indication of selected/unselected items (opacity change)
- Updated summary to show:
  - All items subtotal
  - Selected items count
  - Selected items total
- Checkout button shows selected item count
- Selected items passed to checkout page via navigation state

### 2. Checkout Page (`CheckoutPage.tsx`)
Updated to handle selective ordering:
- Receives selected item IDs from navigation state
- Filters items to show only selected ones
- Shows info message when ordering partial cart
- Sends `itemsToOrder` array to backend API
- Only removes ordered items from cart after successful order
- Button shows count of items being ordered

### 3. Orders API (`ordersApi.ts`)
Updated TypeScript interface:
```typescript
interface CreateOrderRequest {
  itemsToOrder?: string[]; // Array of product IDs
  notes?: string;
}
```

### 4. Styling
Added CSS for:
- Item checkboxes
- Select all bar
- Unselected item styling (reduced opacity)
- Selection note in checkout page

## User Flow

1. User adds multiple items to cart (e.g., 3 products)
2. On cart page, user sees all items with checkboxes (all selected by default)
3. User unchecks items they don't want to order now
4. Summary shows: "Selected Items (1)" with the correct total
5. User clicks "Proceed to Checkout (1 item)"
6. Checkout page shows only selected item with note: "Ordering 1 of 3 items from your cart"
7. User places order
8. Only ordered item is removed from cart
9. Remaining items stay in cart for future orders

## API Contract

### Request
```json
POST /orders
{
  "itemsToOrder": ["product_id_1", "product_id_2"],
  "notes": "Optional special instructions"
}
```

### Response
```json
{
  "success": true,
  "data": {
    "_id": "order_id",
    "items": [...],
    "total_price": 25.50,
    "status": "pending"
  }
}
```

## Benefits
- Real-world shopping experience
- Users can save items for later
- Flexible ordering without cart management hassle
- Backend already supported it - just needed UI
