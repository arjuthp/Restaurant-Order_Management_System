# A. Backend Overview

## System Architecture
- **Framework:** Node.js + Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (access + refresh tokens)
- **Architecture Pattern:** Layered (Routes → Controllers → Services → Models)
- **Port:** 5000
- **API Base:** `/api`

## Technology Stack
| Component | Technology | Version |
|-----------|-----------|---------|
| Runtime | Node.js | - |
| Framework | Express.js | 4.18.2 |
| Database | MongoDB | - |
| ODM | Mongoose | 8.0.0 |
| Auth | JWT | 9.0.2 |
| Password | bcryptjs | 2.4.3 |
| CORS | cors | 2.8.5 |

## Overall Assessment
✅ **Production-ready core** with well-structured code  
⚠️ **Missing enhancements** like pagination, search, file upload  
⚠️ **Security concerns** like CORS wildcard, no rate limiting  
⚠️ **Incomplete features** like PromoCodes module

---

# B. Feature/Module Breakdown

## 1. Authentication Module ✅ COMPLETE (90%)

### Purpose
User registration, login, token management, role-based access

### Files
- `routes/auth.routes.js`
- `controllers/auth.controller.js`
- `services/auth.service.js`
- `models/user.model.js`
- `models/refreshToken.js`
- `utils/jwt.js`
- `auth/auth.middlewares.js`

### Features
✅ Customer registration  
✅ Customer login  
✅ Admin login (separate endpoint)  
✅ Token refresh mechanism  
✅ Logout (invalidates refresh token)  
✅ JWT access token (15 min expiry)  
✅ JWT refresh token (7 days expiry)  
✅ Password hashing (bcrypt, 10 rounds)  
✅ Role-based middleware (customer/admin)

### Business Rules
- Email must be unique
- Passwords hashed before storage
- Access token expires in 15 minutes
- Refresh token expires in 7 days
- Refresh tokens stored in database with TTL index
- Admin login requires `role='admin'` in database
- Tokens sent in `Authorization: Bearer <token>` header

### Missing Features
❌ Password reset/forgot password  
❌ Email verification  
❌ Account lockout after failed attempts  
❌ Password strength validation  
❌ Rate limiting on login attempts

---


## 2. Users Module ✅ COMPLETE (85%)

### Purpose
User profile management and admin user overview

### Files
- `routes/user.routes.js`
- `controllers/user.controller.js`
- `services/user.service.js`
- `models/user.model.js` (shared with auth)

### Features
✅ Get my profile  
✅ Update my profile (name, phone, address)  
✅ Delete my account  
✅ Admin: Get all users  
✅ Admin: Get user by ID

### Business Rules
- Users can only view/update their own profile
- Password and role cannot be updated through profile endpoint
- Admins can view all users
- Account deletion is permanent (no soft delete)

### Missing Features
❌ Pagination for admin user list  
❌ Search/filter users  
❌ User statistics (order count, total spent)  
❌ Soft delete  
❌ Admin ability to update user roles  
❌ User activity logs

---

## 3. Products Module ✅ MOSTLY COMPLETE (75%)

### Purpose
Menu item catalog management

### Files
- `routes/product.routes.js`
- `controllers/product.controller.js`
- `services/product.service.js`
- `models/product.model.js`

### Features
✅ Get all products (public)  
✅ Get single product (public)  
✅ Create product (admin)  
✅ Update product (admin)  
✅ Soft delete product (admin)  
✅ Category-based organization  
✅ Availability toggle

### Data Model
```javascript
{
  name: String (required),
  description: String,
  price: Number (required, min: 0),
  category: String (required),
  image_url: String,
  is_available: Boolean (default: true),
  is_deleted: Boolean (default: false),
  deleted_at: Date
}
```

### Categories
- Nepali (Momos, Dal Bhat, Choila, Sekuwa)
- Fusion (Momo Quesadilla, Sekuwa Tacos)
- Western (Pizza, Burgers, Pasta, Salmon)
- Snacks (Fries, Wings, Spring Rolls)
- Desserts (Lava Cake, Sikarni, Cheesecake)
- Drinks (Lassi, Chai, Coffee, Juice)

### Business Rules
- Soft delete (sets is_deleted=true, is_available=false)
- Products remain in database after deletion
- Public can view all non-deleted products
- Only admins can create/update/delete

### Missing Features
❌ Pagination (returns all products)  
❌ Filter by category endpoint  
❌ Search functionality  
❌ Sorting options  
❌ File upload for images (only URL string)  
❌ Product variants (size, options)  
❌ Inventory/stock management  
❌ Product ratings/reviews  
❌ Featured/popular products flag

---

## 4. Cart Module ✅ COMPLETE (90%)

### Purpose
Shopping cart management for customers

### Files
- `routes/cart.routes.js`
- `controllers/cart.contoller.js` (typo in filename)
- `services/cart.service.js`
- `models/cart.model.js`

### Features
✅ Get my cart  
✅ Add item to cart  
✅ Update item quantity  
✅ Remove item from cart  
✅ Clear entire cart  
✅ Auto-create cart on first item add  
✅ Product availability check before adding

### Data Model
```javascript
{
  user_id: ObjectId (ref: User, unique),
  items: [{
    product_id: ObjectId (ref: Product),
    quantity: Number (min: 1),
    unit_price: Number
  }]
}
```

### Business Rules
- One cart per user
- If item exists, quantity is incremented
- unit_price = product.price * quantity
- Setting quantity to 0 removes item
- Cart cleared after order placement
- Product availability checked before adding

### Missing Features
❌ Cart expiration  
❌ Cart total calculation in response  
❌ Promo code application  
❌ Cart item limits  
❌ Price validation (if product price changes)

---

## 5. Orders Module ✅ ADVANCED (85%)

### Purpose
Order placement, tracking, and management

### Files
- `routes/order.routes.js`
- `controllers/order.controller.js`
- `services/order.service.js`
- `models/order.model.js`

### Features
✅ Create order from cart  
✅ Create pre-order for reservation  
✅ Get my orders  
✅ Get order by ID  
✅ Cancel order (pending only)  
✅ Admin: Get all orders  
✅ Admin: Update order status  
✅ Order items snapshot (name, price)

### Data Model
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
  notes: String
}
```

### Status Flow
```
pending → confirmed → preparing → delivered
   ↓
cancelled (only from pending)
```

### Business Rules
- Cart must not be empty
- Can order specific items or all cart items
- Cart cleared after order (or specific items removed)
- Only pending orders can be cancelled
- Customers can only view their own orders
- Admins can view and update all orders
- Pre-orders linked to reservations and tables
- Order items snapshot product name and price

### Missing Features
❌ Pagination for order lists  
❌ Filtering by status/date  
❌ Order search  
❌ Promo code integration (fields exist but not functional)  
❌ Order notifications  
❌ Estimated delivery time  
❌ Order rating/feedback  
❌ Order history export

---

## 6. Tables Module ✅ COMPLETE (90%)

### Purpose
Restaurant table management

### Files
- `routes/table.routes.js`
- `controllers/table.controller.js`
- `services/table.service.js`
- `models/table.model.js`

### Features
✅ Get all tables (public)  
✅ Get table by ID (public)  
✅ Create table (admin)  
✅ Update table (admin)  
✅ Delete table (admin)  
✅ Table status (active/inactive)

### Data Model
```javascript
{
  tableNumber: Number (required, unique),
  capacity: Number (required, min: 1),
  location: String,
  status: String (enum: active, inactive, default: active)
}
```

### Business Rules
- Table numbers must be unique
- Capacity must be at least 1
- Public can view tables (for reservation planning)
- Only admins can manage tables
- Inactive tables not available for reservations

### Missing Features
❌ Table layout/floor plan support  
❌ Table combination (joining tables)  
❌ Real-time availability status  
❌ Table QR codes  
❌ Table assignment to waiters

---

## 7. Reservations Module ✅ ADVANCED (90%)

### Purpose
Table booking and reservation management

### Files
- `routes/reservation.routes.js`
- `controllers/reservation.contollers.js` (typo in filename)
- `services/reservation.service.js`
- `models/reservation.model.js`

### Features
✅ Check table availability  
✅ Create reservation  
✅ Get my reservations  
✅ Get reservation by ID  
✅ Cancel reservation  
✅ Admin: Get all reservations  
✅ Admin: Update reservation status  
✅ Pre-order integration  
✅ Double booking prevention

### Data Model
```javascript
{
  user: ObjectId (ref: User),
  table: ObjectId (ref: Table),
  date: Date,
  timeSlot: String (e.g., "18:00"),
  numberOfGuests: Number (min: 1, max: 20),
  duration: Number (min: 60, max: 240, default: 120 minutes),
  endTime: Date (auto-calculated),
  preOrder: ObjectId (ref: Order),
  hasPreOrder: Boolean (default: false),
  status: String (enum: pending, confirmed, completed, cancelled, no-show),
  specialRequests: String,
  contactPhone: String (required)
}
```

### Business Rules
- Prevents double booking (same table, date, time)
- Auto-calculates end time based on duration
- Table capacity must accommodate guests
- Only active tables can be reserved
- Customers can only view/cancel their own reservations
- Admins can view/update all reservations
- Pre-orders linked to reservations
- Cancelled reservations don't block tables

### Missing Features
❌ Time slot validation (business hours)  
❌ Advance booking limits (e.g., max 30 days ahead)  
❌ Reservation reminders/notifications  
❌ No-show penalties  
❌ Recurring reservations  
❌ Waitlist functionality  
❌ Reservation modifications (must cancel and rebook)

---

## 8. Restaurant Module ✅ BASIC (70%)

### Purpose
Restaurant information management

### Files
- `routes/restaurant.routes.js`
- `controllers/restaurant.controller.js`
- `services/restaurant.service.js`
- `models/restaurant.model.js`

### Features
✅ Get restaurant info (public)  
✅ Update restaurant info (admin)  
✅ Auto-creates default restaurant if none exists

### Data Model
```javascript
{
  name: String (required),
  description: String,
  address: String (required),
  phone: String (required),
  opening_hours: String
}
```

### Business Rules
- Only one restaurant document in database
- Public can view info
- Only admins can update

### Missing Features
❌ Logo/images  
❌ Social media links  
❌ Multiple locations support  
❌ Business hours structure (just string)  
❌ Holiday hours  
❌ Delivery zones  
❌ Payment methods info  
❌ Cuisine types

---

## 9. PromoCodes Module ⚠️ INCOMPLETE (20%)

### Purpose
Promotional code management and validation

### Files
- `models/promoCode.model.js` (model exists)
- `services/promoCode.service.js` (partial implementation)
- ❌ No routes file
- ❌ No controller file

### Data Model (Defined but Not Used)
```javascript
{
  code: String (required, unique, uppercase),
  description: String,
  discountType: String (enum: percentage, fixed),
  discountValue: Number (required, min: 0),
  minOrderAmount: Number (default: 0),
  maxDiscountAmount: Number,
  validFrom: Date (required),
  validTo: Date (required),
  isActive: Boolean (default: true),
  usageLimit: Number,
  usedCount: Number (default: 0),
  perUserLimit: Number (default: 1)
}
```

### What Exists
- Model definition
- Partial validation logic in service

### What's Missing
❌ API endpoints  
❌ Controller  
❌ Routes  
❌ Integration with orders  
❌ Usage tracking  
❌ Admin management interface

---

# C. Endpoint Inventory

## Authentication Endpoints (5 total)

### POST /api/auth/register
- **Auth:** None
- **Purpose:** Register new customer
- **Returns:** Access token, refresh token, user object

### POST /api/auth/login
- **Auth:** None
- **Purpose:** Customer login
- **Returns:** Access token, refresh token, user object

### POST /api/auth/admin/login
- **Auth:** None
- **Purpose:** Admin login
- **Returns:** Access token, refresh token, user object (role must be admin)

### POST /api/auth/refresh
- **Auth:** None
- **Purpose:** Refresh access token
- **Body:** `{ refreshToken: string }`
- **Returns:** New access token

### POST /api/auth/logout
- **Auth:** None
- **Purpose:** Invalidate refresh token
- **Body:** `{ refreshToken: string }`
- **Returns:** Success message

---

## User Endpoints (5 total)

### GET /api/users/me
- **Auth:** Customer or Admin
- **Purpose:** Get my profile
- **Returns:** User object

### PATCH /api/users/me
- **Auth:** Customer or Admin
- **Purpose:** Update my profile
- **Body:** `{ name?, phone?, address? }`
- **Returns:** Updated user object

### DELETE /api/users/me
- **Auth:** Customer or Admin
- **Purpose:** Delete my account
- **Returns:** Success message

### GET /api/users
- **Auth:** Admin
- **Purpose:** Get all users
- **Returns:** Array of user objects
- **⚠️ Missing:** Pagination, search, filters

### GET /api/users/:id
- **Auth:** Admin
- **Purpose:** Get user by ID
- **Returns:** User object

---

## Product Endpoints (5 total)

### GET /api/products
- **Auth:** None (public)
- **Purpose:** Get all products
- **Returns:** Array of product objects
- **⚠️ Missing:** Pagination, category filter, search, sort

### GET /api/products/:id
- **Auth:** None (public)
- **Purpose:** Get single product
- **Returns:** Product object

### POST /api/products
- **Auth:** Admin
- **Purpose:** Create product
- **Body:** `{ name, description, price, category, image_url?, is_available? }`
- **Returns:** Created product object

### PATCH /api/products/:id
- **Auth:** Admin
- **Purpose:** Update product
- **Body:** Same as POST (all optional)
- **Returns:** Updated product object

### DELETE /api/products/:id
- **Auth:** Admin
- **Purpose:** Soft delete product
- **Returns:** Success message

---

## Cart Endpoints (5 total)

### GET /api/cart
- **Auth:** Customer
- **Purpose:** Get my cart
- **Returns:** Cart object with populated items

### POST /api/cart/items
- **Auth:** Customer
- **Purpose:** Add item to cart
- **Body:** `{ product_id, quantity }`
- **Returns:** Updated cart object

### PATCH /api/cart/items/:productId
- **Auth:** Customer
- **Purpose:** Update item quantity
- **Body:** `{ quantity }`
- **Returns:** Updated cart object

### DELETE /api/cart/items/:productId
- **Auth:** Customer
- **Purpose:** Remove item from cart
- **Returns:** Updated cart object

### DELETE /api/cart
- **Auth:** Customer
- **Purpose:** Clear entire cart
- **Returns:** Success message with empty cart

---

## Order Endpoints (7 total)

### POST /api/orders
- **Auth:** Customer
- **Purpose:** Create order from cart
- **Body:** `{ itemsToOrder?, notes? }`
- **Returns:** Created order object

### POST /api/orders/pre-order/:reservationId
- **Auth:** Customer
- **Purpose:** Create pre-order for reservation
- **Body:** `{ notes? }`
- **Returns:** Created order object with reservation link

### GET /api/orders
- **Auth:** Customer
- **Purpose:** Get my orders
- **Returns:** Array of order objects
- **⚠️ Missing:** Pagination, status filter, date filter

### GET /api/orders/:id
- **Auth:** Customer (own) or Admin (all)
- **Purpose:** Get order by ID
- **Returns:** Order object with populated data

### DELETE /api/orders/:id
- **Auth:** Customer
- **Purpose:** Cancel order (pending only)
- **Returns:** Updated order object with status=cancelled

### GET /api/orders/admin/all
- **Auth:** Admin
- **Purpose:** Get all orders
- **Returns:** Array of order objects
- **⚠️ Missing:** Pagination, filters

### PATCH /api/orders/:id/status
- **Auth:** Admin
- **Purpose:** Update order status
- **Body:** `{ status }`
- **Returns:** Updated order object

---

## Table Endpoints (5 total)

### GET /api/tables
- **Auth:** None (public)
- **Purpose:** Get all tables
- **Returns:** `{ success, count, data: [tables] }`

### GET /api/tables/:id
- **Auth:** None (public)
- **Purpose:** Get table by ID
- **Returns:** `{ success, data: table }`

### POST /api/tables
- **Auth:** Admin
- **Purpose:** Create table
- **Body:** `{ tableNumber, capacity, location?, status? }`
- **Returns:** `{ success, message, data: table }`

### PUT /api/tables/:id
- **Auth:** Admin
- **Purpose:** Update table
- **Body:** Same as POST
- **Returns:** `{ success, message, data: table }`

### DELETE /api/tables/:id
- **Auth:** Admin
- **Purpose:** Delete table
- **Returns:** `{ success, message }`

---

## Reservation Endpoints (7 total)

### GET /api/reservations/availability
- **Auth:** None (public)
- **Purpose:** Check table availability
- **Query:** `?date=YYYY-MM-DD&timeSlot=HH:MM&numberOfGuests=N`
- **Returns:** `{ success, count, data: [available_tables] }`

### POST /api/reservations
- **Auth:** Customer
- **Purpose:** Create reservation
- **Body:** `{ table, date, timeSlot, numberOfGuests, duration?, specialRequests?, contactPhone }`
- **Returns:** `{ success, message, data: reservation }`

### GET /api/reservations/my-reservations
- **Auth:** Customer
- **Purpose:** Get my reservations
- **Returns:** `{ success, count, data: [reservations] }`

### GET /api/reservations/:id
- **Auth:** Customer (own) or Admin (all)
- **Purpose:** Get reservation by ID
- **Returns:** `{ success, data: reservation }`

### PATCH /api/reservations/:id/cancel
- **Auth:** Customer
- **Purpose:** Cancel reservation
- **Returns:** `{ success, message, data: reservation }`

### GET /api/reservations/admin/all
- **Auth:** Admin
- **Purpose:** Get all reservations
- **Query:** `?date=YYYY-MM-DD&status=pending`
- **Returns:** `{ success, count, data: [reservations] }`

### PATCH /api/reservations/admin/:id/status
- **Auth:** Admin
- **Purpose:** Update reservation status
- **Body:** `{ status }`
- **Returns:** `{ success, message, data: reservation }`

---

## Restaurant Endpoints (2 total)

### GET /api/restaurant
- **Auth:** None (public)
- **Purpose:** Get restaurant info
- **Returns:** Restaurant object

### PATCH /api/restaurant
- **Auth:** Admin
- **Purpose:** Update restaurant info
- **Body:** `{ name?, description?, address?, phone?, opening_hours? }`
- **Returns:** Updated restaurant object

---

## PromoCode Endpoints ❌ NOT IMPLEMENTED

No endpoints exist yet. Need to create:
- GET /api/promo-codes (admin)
- POST /api/promo-codes (admin)
- PATCH /api/promo-codes/:id (admin)
- DELETE /api/promo-codes/:id (admin)
- POST /api/promo-codes/validate (customer)

---

# Summary

## Total Endpoints: 41 implemented, 5 missing

### By Module
- Authentication: 5 ✅
- Users: 5 ✅
- Products: 5 ✅
- Cart: 5 ✅
- Orders: 7 ✅
- Tables: 5 ✅
- Reservations: 7 ✅
- Restaurant: 2 ✅
- PromoCodes: 0 ❌

### By Access Level
- Public: 11 endpoints
- Customer: 18 endpoints
- Admin: 12 endpoints

### Response Format Inconsistency
- Some return `{ success, data, message }`
- Some return data directly
- Some return arrays, some objects
- **Recommendation:** Standardize or handle variations in frontend
## 2. Users Module ✅ COMPLETE (85%)

### Purpose
User profile management and admin user overview

### Files
- `routes/user.routes.js`
- `controllers/user.controller.js`
- `services/user.service.js`
- `models/user.model.js` (shared with auth)

### Features
✅ Get my profile (customer/admin)  
✅ Update my profile (name, phone, address)  
✅ Delete my account  
✅ Get all users (admin only)  
✅ Get user by ID (admin only)

### Data Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: customer, admin, default: customer),
  phone: String,
  address: String,
  timestamps: true
}
```

### Business Rules
- Password and role cannot be updated through profile endpoint
- Users can only view/update their own profile
- Admins can view all users
- Account deletion is permanent (no soft delete)

### Missing Features
❌ No pagination for admin user list  
❌ No search/filter capabilities  
❌ No user statistics (order count, total spent)  
❌ No soft delete  
❌ No admin ability to update user roles  
❌ No user activity logs

---

## 3. Products Module ✅ MOSTLY COMPLETE (75%)

### Purpose
Menu item catalog management

### Files
- `routes/product.routes.js`
- `controllers/product.controller.js`
- `services/product.service.js`
- `models/product.model.js`

### Features
✅ Get all products (public)  
✅ Get single product (public)  
✅ Create product (admin)  
✅ Update product (admin)  
✅ Soft delete product (admin)

### Data Model
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

### Categories
- Nepali
- Fusion
- Western
- Snacks
- Desserts
- Drinks

### Business Rules
- Soft delete (sets `is_deleted=true`, `is_available=false`)
- Products remain in database after deletion
- Public can view all non-deleted products
- Only admins can create/update/delete

### Missing Features
❌ No pagination (returns all products)  
❌ No filtering by category endpoint  
❌ No search functionality  
❌ No sorting options  
❌ No file upload for images (only URL string)  
❌ No product variants (size, options)  
❌ No inventory/stock management  
❌ No product ratings/reviews  
❌ No featured/popular products flag

---

## 4. Cart Module ✅ COMPLETE (90%)

### Purpose
Shopping cart management for customers

### Files
- `routes/cart.routes.js`
- `controllers/cart.contoller.js` (typo in filename)
- `services/cart.service.js`
- `models/cart.model.js`

### Features
✅ Get my cart  
✅ Add item to cart  
✅ Update item quantity  
✅ Remove item from cart  
✅ Clear entire cart

### Data Model
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

### Business Rules
- One cart per user
- Cart auto-created on first item add
- If item exists, quantity is incremented
- `unit_price = product.price * quantity`
- Setting quantity to 0 removes item
- Cart cleared after order placement
- Product availability checked before adding

### Missing Features
❌ No cart expiration  
❌ No cart total calculation in response  
❌ No promo code application  
❌ No cart item limits  
❌ No price validation (if product price changes)

---

## 5. Orders Module ✅ ADVANCED (85%)

### Purpose
Order placement, tracking, and management

### Files
- `routes/order.routes.js`
- `controllers/order.controller.js`
- `services/order.service.js`
- `models/order.model.js`

### Features
✅ Create order from cart  
✅ Create pre-order for reservation  
✅ Get my orders  
✅ Get order by ID  
✅ Cancel order (pending only)  
✅ Get all orders (admin)  
✅ Update order status (admin)

### Data Model
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
  table: ObjectId (ref: Table),
  reservation: ObjectId (ref: Reservation),
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

### Status Flow
```
pending → confirmed → preparing → delivered
   ↓
cancelled (only from pending)
```

### Business Rules
- Cart must not be empty
- Can order specific items or all cart items
- Cart cleared after order (or specific items removed)
- Only pending orders can be cancelled
- Customers can only view their own orders
- Admins can view and update all orders
- Pre-orders linked to reservations and tables
- Order items snapshot product name and price

### Missing Features
❌ No pagination for order lists  
❌ No filtering by status/date  
❌ No order search  
❌ Promo code fields exist but not integrated  
❌ No order notifications  
❌ No estimated delivery time  
❌ No order rating/feedback  
❌ No order history export

---

## 6. Tables Module ✅ COMPLETE (90%)

### Purpose
Restaurant table management

### Files
- `routes/table.routes.js`
- `controllers/table.controller.js`
- `services/table.service.js`
- `models/table.model.js`

### Features
✅ Get all tables (public)  
✅ Get table by ID (public)  
✅ Create table (admin)  
✅ Update table (admin)  
✅ Delete table (admin)

### Data Model
```javascript
{
  tableNumber: Number (required, unique),
  capacity: Number (required, min: 1),
  location: String,
  status: String (enum: active, inactive, default: active),
  timestamps: true
}
```

### Business Rules
- Table numbers must be unique
- Capacity must be at least 1
- Public can view tables (for reservation planning)
- Only admins can manage tables
- Inactive tables not available for reservations

### Missing Features
❌ No table layout/floor plan support  
❌ No table combination (joining tables)  
❌ No real-time availability status  
❌ No table QR codes  
❌ No table assignment to waiters

---

## 7. Reservations Module ✅ ADVANCED (90%)

### Purpose
Table booking and reservation management

### Files
- `routes/reservation.routes.js`
- `controllers/reservation.contollers.js` (typo in filename)
- `services/reservation.service.js`
- `models/reservation.model.js`

### Features
✅ Check table availability  
✅ Create reservation  
✅ Get my reservations  
✅ Get reservation by ID  
✅ Cancel reservation  
✅ Get all reservations (admin)  
✅ Update reservation status (admin)

### Data Model
```javascript
{
  user: ObjectId (ref: User),
  table: ObjectId (ref: Table),
  date: Date,
  timeSlot: String (e.g., "18:00"),
  numberOfGuests: Number (min: 1, max: 20),
  duration: Number (min: 60, max: 240, default: 120 minutes),
  endTime: Date (auto-calculated),
  preOrder: ObjectId (ref: Order),
  hasPreOrder: Boolean (default: false),
  status: String (enum: pending, confirmed, completed, cancelled, no-show),
  specialRequests: String,
  contactPhone: String (required),
  timestamps: true
}
```

### Business Rules
- Prevents double booking (same table, date, time)
- Auto-calculates end time based on duration
- Table capacity must accommodate guests
- Only active tables can be reserved
- Customers can only view/cancel their own reservations
- Admins can view/update all reservations
- Pre-orders linked to reservations
- Cancelled reservations don't block tables

### Missing Features
❌ No time slot validation (business hours)  
❌ No advance booking limits (e.g., max 30 days ahead)  
❌ No reservation reminders/notifications  
❌ No no-show penalties  
❌ No recurring reservations  
❌ No waitlist functionality  
❌ No reservation modifications (must cancel and rebook)

---

## 8. Restaurant Module ✅ BASIC (70%)

### Purpose
Restaurant information management

### Files
- `routes/restaurant.routes.js`
- `controllers/restaurant.controller.js`
- `services/restaurant.service.js`
- `models/restaurant.model.js`

### Features
✅ Get restaurant info (public)  
✅ Update restaurant info (admin)

### Data Model
```javascript
{
  name: String (required),
  description: String,
  address: String (required),
  phone: String (required),
  opening_hours: String,
  timestamps: true
}
```

### Business Rules
- Auto-creates default restaurant if none exists
- Only one restaurant document in database
- Public can view info
- Only admins can update

### Missing Features
❌ No logo/images  
❌ No social media links  
❌ No multiple locations support  
❌ No business hours structure (just string)  
❌ No holiday hours  
❌ No delivery zones  
❌ No payment methods info  
❌ No cuisine types

---

## 9. PromoCodes Module ⚠️ INCOMPLETE (20%)

### Purpose
Promotional code management and validation

### Files
- `models/promoCode.model.js` (model exists)
- `services/promoCode.service.js` (partial implementation)
- ❌ No routes file
- ❌ No controller file

### Data Model (Defined but Not Used)
```javascript
{
  code: String (required, unique, uppercase),
  description: String,
  discountType: String (enum: percentage, fixed),
  discountValue: Number (required, min: 0),
  minOrderAmount: Number (default: 0),
  maxDiscountAmount: Number,
  validFrom: Date (required),
  validTo: Date (required),
  isActive: Boolean (default: true),
  usageLimit: Number,
  usedCount: Number (default: 0),
  perUserLimit: Number (default: 1),
  timestamps: true
}
```

### What Exists
- Model definition
- Partial validation logic in service

### What's Missing
❌ No API endpoints  
❌ No controller  
❌ No routes  
❌ Not integrated with orders  
❌ No admin management interface  
❌ No usage tracking  
❌ No promo code application in cart/order

### To Complete This Module
1. Create routes file
2. Create controller
3. Complete service methods (CRUD)
4. Integrate with order creation
5. Add promo code field to cart
6. Track usage per user
7. Admin management endpoints

---

# Summary Table

| Module | Status | Files | Endpoints | Completeness |
|--------|--------|-------|-----------|--------------|
| Authentication | ✅ Complete | 7 | 5 | 90% |
| Users | ✅ Complete | 4 | 5 | 85% |
| Products | ✅ Mostly Complete | 4 | 5 | 75% |
| Cart | ✅ Complete | 4 | 5 | 90% |
| Orders | ✅ Advanced | 4 | 7 | 85% |
| Tables | ✅ Complete | 4 | 5 | 90% |
| Reservations | ✅ Advanced | 4 | 7 | 90% |
| Restaurant | ✅ Basic | 4 | 2 | 70% |
| PromoCodes | ⚠️ Incomplete | 2 | 0 | 20% |

**Total Endpoints:** 41 (excluding PromoCodes)

---

# C. Endpoint Inventory

## Authentication Endpoints (5)

### POST /api/auth/register
- **Auth:** None
- **Purpose:** Register new customer
- **Returns:** Access token, refresh token, user object

### POST /api/auth/login
- **Auth:** None
- **Purpose:** Customer login
- **Returns:** Access token, refresh token, user object

### POST /api/auth/admin/login
- **Auth:** None
- **Purpose:** Admin login
- **Returns:** Access token, refresh token, user object (role must be admin)

### POST /api/auth/refresh
- **Auth:** None
- **Purpose:** Refresh access token
- **Body:** `{ refreshToken: string }`
- **Returns:** New access token

### POST /api/auth/logout
- **Auth:** None
- **Purpose:** Invalidate refresh token
- **Body:** `{ refreshToken: string }`
- **Returns:** Success message

---

## User Endpoints (5)

### GET /api/users/me
- **Auth:** Customer or Admin
- **Purpose:** Get my profile
- **Returns:** User object (without password)

### PATCH /api/users/me
- **Auth:** Customer or Admin
- **Purpose:** Update my profile
- **Body:** `{ name?, phone?, address? }`
- **Returns:** Updated user object

### DELETE /api/users/me
- **Auth:** Customer or Admin
- **Purpose:** Delete my account
- **Returns:** Success message

### GET /api/users
- **Auth:** Admin only
- **Purpose:** Get all users
- **Returns:** Array of user objects

### GET /api/users/:id
- **Auth:** Admin only
- **Purpose:** Get user by ID
- **Returns:** User object

---

## Product Endpoints (5)

### GET /api/products
- **Auth:** None (public)
- **Purpose:** Get all products
- **Query:** None (should add: page, limit, category, search, sort)
- **Returns:** Array of product objects

### GET /api/products/:id
- **Auth:** None (public)
- **Purpose:** Get single product
- **Returns:** Product object

### POST /api/products
- **Auth:** Admin only
- **Purpose:** Create product
- **Body:** `{ name, description?, price, category, image_url?, is_available? }`
- **Returns:** Created product object

### PATCH /api/products/:id
- **Auth:** Admin only
- **Purpose:** Update product
- **Body:** Same as POST (all optional)
- **Returns:** Updated product object

### DELETE /api/products/:id
- **Auth:** Admin only
- **Purpose:** Soft delete product
- **Returns:** Success message

---

## Cart Endpoints (5)

### GET /api/cart
- **Auth:** Customer
- **Purpose:** Get my cart
- **Returns:** Cart object with populated items

### POST /api/cart/items
- **Auth:** Customer
- **Purpose:** Add item to cart
- **Body:** `{ product_id, quantity }`
- **Returns:** Updated cart object

### PATCH /api/cart/items/:productId
- **Auth:** Customer
- **Purpose:** Update item quantity
- **Body:** `{ quantity }`
- **Returns:** Updated cart object

### DELETE /api/cart/items/:productId
- **Auth:** Customer
- **Purpose:** Remove item from cart
- **Returns:** Updated cart object

### DELETE /api/cart
- **Auth:** Customer
- **Purpose:** Clear entire cart
- **Returns:** Empty cart object

---

## Order Endpoints (7)

### POST /api/orders
- **Auth:** Customer
- **Purpose:** Create order from cart
- **Body:** `{ itemsToOrder?, notes? }`
- **Returns:** Created order object

### POST /api/orders/pre-order/:reservationId
- **Auth:** Customer
- **Purpose:** Create pre-order for reservation
- **Body:** `{ notes? }`
- **Returns:** Created order object with reservation link

### GET /api/orders
- **Auth:** Customer
- **Purpose:** Get my orders
- **Query:** None (should add: page, limit, status)
- **Returns:** Array of order objects

### GET /api/orders/:id
- **Auth:** Customer (own) or Admin (all)
- **Purpose:** Get order by ID
- **Returns:** Order object with populated user and items

### DELETE /api/orders/:id
- **Auth:** Customer
- **Purpose:** Cancel order (pending only)
- **Returns:** Updated order object (status=cancelled)

### GET /api/orders/admin/all
- **Auth:** Admin only
- **Purpose:** Get all orders
- **Query:** None (should add: page, limit, status, date range)
- **Returns:** Array of order objects

### PATCH /api/orders/:id/status
- **Auth:** Admin only
- **Purpose:** Update order status
- **Body:** `{ status: 'confirmed' | 'preparing' | 'delivered' | 'cancelled' }`
- **Returns:** Updated order object

---

## Table Endpoints (5)

### GET /api/tables
- **Auth:** None (public)
- **Purpose:** Get all tables
- **Returns:** Array of table objects

### GET /api/tables/:id
- **Auth:** None (public)
- **Purpose:** Get table by ID
- **Returns:** Table object

### POST /api/tables
- **Auth:** Admin only
- **Purpose:** Create table
- **Body:** `{ tableNumber, capacity, location?, status? }`
- **Returns:** Created table object

### PUT /api/tables/:id
- **Auth:** Admin only
- **Purpose:** Update table
- **Body:** Same as POST
- **Returns:** Updated table object

### DELETE /api/tables/:id
- **Auth:** Admin only
- **Purpose:** Delete table
- **Returns:** Success message

---

## Reservation Endpoints (7)

### GET /api/reservations/availability
- **Auth:** None (public)
- **Purpose:** Check table availability
- **Query:** `?date=2024-03-20&timeSlot=18:00&numberOfGuests=4`
- **Returns:** Array of available table objects

### POST /api/reservations
- **Auth:** Customer
- **Purpose:** Create reservation
- **Body:** `{ table, date, timeSlot, numberOfGuests, duration?, specialRequests?, contactPhone }`
- **Returns:** Created reservation object

### GET /api/reservations/my-reservations
- **Auth:** Customer
- **Purpose:** Get my reservations
- **Returns:** Array of reservation objects

### GET /api/reservations/:id
- **Auth:** Customer (own) or Admin (all)
- **Purpose:** Get reservation by ID
- **Returns:** Reservation object

### PATCH /api/reservations/:id/cancel
- **Auth:** Customer
- **Purpose:** Cancel reservation
- **Returns:** Updated reservation object (status=cancelled)

### GET /api/reservations/admin/all
- **Auth:** Admin only
- **Purpose:** Get all reservations
- **Query:** `?date=...&status=...`
- **Returns:** Array of reservation objects

### PATCH /api/reservations/admin/:id/status
- **Auth:** Admin only
- **Purpose:** Update reservation status
- **Body:** `{ status: 'confirmed' | 'completed' | 'cancelled' | 'no-show' }`
- **Returns:** Updated reservation object

---

## Restaurant Endpoints (2)

### GET /api/restaurant
- **Auth:** None (public)
- **Purpose:** Get restaurant info
- **Returns:** Restaurant object

### PATCH /api/restaurant
- **Auth:** Admin only
- **Purpose:** Update restaurant info
- **Body:** `{ name?, description?, address?, phone?, opening_hours? }`
- **Returns:** Updated restaurant object

---

# D. Data Model / Entity Relationships

## Entity Relationship Diagram

```
User (1) ──────< (1) Cart
  │
  ├──────< (*) Orders
  │
  └──────< (*) Reservations
              │
              ├──── (1) Table
              │
              └──── (0..1) Order (pre-order)

Product (*) ────< (*) CartItem
  │
  └──────< (*) OrderItem

Table (1) ──────< (*) Reservations

RefreshToken (*) ────> (1) User

Restaurant (singleton)

PromoCode (not integrated yet)
```

## Key Relationships

### User → Cart (1:1)
- Each user has exactly one cart
- Cart auto-created on first item add
- Cart cleared after order placement

### User → Orders (1:Many)
- User can have multiple orders
- Orders store user_id reference
- Customers see only their orders
- Admins see all orders

### User → Reservations (1:Many)
- User can have multiple reservations
- Reservations store user reference
- Customers see only their reservations
- Admins see all reservations

### Cart → Products (Many:Many)
- Cart has multiple items
- Each item references a product
- Stores quantity and unit_price snapshot

### Order → Products (Many:Many)
- Order has multiple items
- Each item snapshots product_name and unit_price
- Preserves order details even if product changes

### Reservation → Table (Many:1)
- Multiple reservations can reference same table
- Different time slots prevent conflicts
- Table capacity validated against numberOfGuests

### Reservation → Order (1:0..1)
- Reservation can have optional pre-order
- Pre-order links back to reservation
- Pre-order also links to table

### User → RefreshTokens (1:Many)
- User can have multiple refresh tokens (multiple devices)
- Tokens auto-expire after 7 days (TTL index)
- Logout deletes specific token

---

# E. Auth / Roles / Permissions Summary

## Roles

### Customer (default)
- Can register and login
- Can view products (public)
- Can manage own cart
- Can place orders
- Can view own orders
- Can cancel own pending orders
- Can make reservations
- Can view own reservations
- Can cancel own reservations
- Can view and update own profile
- Can delete own account

### Admin
- All customer permissions
- Can create/update/delete products
- Can view all orders
- Can update order status
- Can view all users
- Can create/update/delete tables
- Can view all reservations
- Can update reservation status
- Can update restaurant info

## Authentication Flow

```
1. User registers/logs in
   ↓
2. Backend validates credentials
   ↓
3. Backend generates:
   - Access token (JWT, 15 min expiry)
   - Refresh token (JWT, 7 days expiry)
   ↓
4. Refresh token stored in database
   ↓
5. Both tokens returned to client
   ↓
6. Client stores tokens (localStorage/memory)
   ↓
7. Client sends access token in Authorization header
   ↓
8. Backend middleware verifies token
   ↓
9. On 401 error, client uses refresh token
   ↓
10. Backend validates refresh token from database
    ↓
11. New access token generated and returned
    ↓
12. On logout, refresh token deleted from database
```

## Middleware

### authenticateToken
- Verifies JWT access token
- Extracts user info from token
- Attaches user to request object
- Returns 401 if invalid/expired

### authorizeRole(roles)
- Checks if user has required role
- Must be used after authenticateToken
- Returns 403 if unauthorized

## Token Structure

### Access Token Payload
```javascript
{
  id: user._id,
  email: user.email,
  role: user.role,
  iat: issued_at_timestamp,
  exp: expiry_timestamp
}
```

### Refresh Token Payload
```javascript
{
  id: user._id,
  iat: issued_at_timestamp,
  exp: expiry_timestamp
}
```

## Security Considerations

✅ **Implemented:**
- Password hashing (bcrypt)
- JWT tokens with expiration
- Role-based access control
- Refresh token rotation
- Token stored in database (can be revoked)

⚠️ **Missing:**
- Rate limiting on auth endpoints
- Account lockout after failed attempts
- Password strength requirements
- Email verification
- Two-factor authentication
- IP-based restrictions
- Session management

---

**End of Backend Inventory**
