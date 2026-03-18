# Module Analysis (Continued)
# Products, Cart, Orders, Tables, Reservations

---

## 3. Products Module ✅ MOSTLY COMPLETE

**Purpose:** Menu item catalog management

**Files:**
- `routes/product.routes.js`
- `controllers/product.controller.js`
- `services/product.service.js`
- `models/product.model.js`

**Endpoints:**
```
GET    /api/products          - Get all products (Public)
GET    /api/products/:id      - Get single product (Public)
POST   /api/products          - Create product (Admin)
PATCH  /api/products/:id      - Update product (Admin)
DELETE /api/products/:id      - Soft delete product (Admin)
```

**Data Model:**
```javascript
{
  name: String (required),
  description: String,
  price: Number (required, min: 0),
  category: String (required),
  image_url: String,
  is_available: Boolean (default: true),
  is_deleted: Boolean (default: false),
  deleted_at: Date,
  timestamps: true
}
```

**Categories:** Nepali, Fusion, Western, Snacks, Desserts, Drinks

**Request/Response Formats:**

**Create Product:**
```json
Request: {
  "name": "string",
  "description": "string",
  "price": number,
  "category": "string",
  "image_url": "string" (optional),
  "is_available": boolean (optional)
}

Response: (full product object)
```

**Business Rules:**
- Soft delete (sets is_deleted=true, is_available=false)
- Products remain in database after deletion
- Public can view all non-deleted products
- Only admins can create/update/delete

**Missing/Incomplete:**
- ❌ No pagination (returns all products)
- ❌ No filtering by category endpoint
- ❌ No search functionality
- ❌ No sorting options
- ❌ No file upload for images (only URL string)
- ❌ No product variants (size, options)
- ❌ No inventory/stock management
- ❌ No product ratings/reviews
- ❌ No featured/popular products flag

**Frontend Needs:**
- Product listing page with category filters
- Product detail page
- Admin product management (CRUD)
- Image upload component
- Search bar
- Category navigation

---


## 4. Cart Module ✅ COMPLETE

**Purpose:** Shopping cart management for customers

**Files:**
- `routes/cart.routes.js`
- `controllers/cart.contoller.js` (typo in filename)
- `services/cart.service.js`
- `models/cart.model.js`

**Endpoints:**
```
GET    /api/cart                    - Get my cart (Customer)
POST   /api/cart/items              - Add item to cart (Customer)
PATCH  /api/cart/items/:productId   - Update quantity (Customer)
DELETE /api/cart/items/:productId   - Remove item (Customer)
DELETE /api/cart                    - Clear cart (Customer)
```

**Data Model:**
```javascript
{
  user_id: ObjectId (ref: User, unique),
  items: [{
    product_id: ObjectId (ref: Product),
    quantity: Number (min: 1),
    unit_price: Number
  }],
  timestamps: true
}
```

**Request/Response Formats:**

**Add to Cart:**
```json
Request: {
  "product_id": "string",
  "quantity": number
}

Response: {
  "_id": "cart_id",
  "user_id": "user_id",
  "items": [
    {
      "product_id": {product_object},
      "quantity": number,
      "unit_price": number
    }
  ],
  "createdAt": "date",
  "updatedAt": "date"
}
```

**Update Quantity:**
```json
Request: {
  "quantity": number
}

Response: (full cart object)
```

**Business Rules:**
- One cart per user
- Cart auto-created on first item add
- If item exists, quantity is incremented
- unit_price = product.price * quantity
- Setting quantity to 0 removes item
- Cart cleared after order placement
- Product availability checked before adding

**Missing/Incomplete:**
- ❌ No cart expiration
- ❌ No cart total calculation in response
- ❌ No promo code application
- ❌ No cart item limits
- ❌ No price validation (if product price changes)

**Frontend Needs:**
- Cart icon with item count badge
- Cart page with item list
- Quantity increment/decrement buttons
- Remove item button
- Clear cart button
- Total price display
- Checkout button

---


## 5. Orders Module ✅ ADVANCED FEATURES

**Purpose:** Order placement, tracking, and management

**Files:**
- `routes/order.routes.js`
- `controllers/order.controller.js`
- `services/order.service.js`
- `models/order.model.js`

**Endpoints:**
```
POST   /api/orders                           - Create order (Customer)
POST   /api/orders/pre-order/:reservationId  - Pre-order for reservation (Customer)
GET    /api/orders                           - Get my orders (Customer)
GET    /api/orders/:id                       - Get order by ID (Customer)
DELETE /api/orders/:id                       - Cancel order (Customer)
GET    /api/orders/admin/all                 - Get all orders (Admin)
PATCH  /api/orders/:id/status                - Update status (Admin)
```

**Data Model:**
```javascript
{
  user_id: ObjectId (ref: User),
  items: [{
    product_id: ObjectId (ref: Product),
    product_name: String,
    quantity: Number,
    unit_price: Number
  }],
  orderType: String (enum: dine-in, takeout, delivery),
  table: ObjectId (ref: Table, optional),
  reservation: ObjectId (ref: Reservation, optional),
  deliveryAddress: String,
  deliveryFee: Number,
  pickupTime: Date,
  subtotal: Number,
  promoCode: String,
  discountAmount: Number,
  total_price: Number,
  status: String (enum: pending, confirmed, preparing, delivered, cancelled),
  notes: String,
  timestamps: true
}
```

**Status Flow:**
```
pending → confirmed → preparing → delivered
   ↓
cancelled (only from pending)
```

**Request/Response Formats:**

**Create Order:**
```json
Request: {
  "itemsToOrder": ["product_id1", "product_id2"] (optional, defaults to all cart items),
  "notes": "string" (optional)
}

Response: (full order object with populated items)
```

**Pre-Order for Reservation:**
```json
Request: {
  "notes": "string" (optional)
}

Response: (full order object linked to reservation and table)
```

**Update Status (Admin):**
```json
Request: {
  "status": "confirmed|preparing|delivered|cancelled"
}

Response: (updated order object)
```

**Business Rules:**
- Cart must not be empty
- Can order specific items or all cart items
- Cart cleared after order (or specific items removed)
- Only pending orders can be cancelled
- Customers can only view their own orders
- Admins can view and update all orders
- Pre-orders linked to reservations and tables
- Order items snapshot product name and price

**Missing/Incomplete:**
- ❌ No pagination for order lists
- ❌ No filtering by status/date
- ❌ No order search
- ❌ Promo code fields exist but not integrated
- ❌ No order notifications
- ❌ No estimated delivery time
- ❌ No order rating/feedback
- ❌ No order history export

**Frontend Needs:**
- Order placement flow
- Order confirmation page
- Order history list
- Order detail page with status tracking
- Cancel order button (for pending)
- Admin order management dashboard
- Status update dropdown (admin)
- Order filters (status, date range)
- Real-time order status updates (optional)

---

