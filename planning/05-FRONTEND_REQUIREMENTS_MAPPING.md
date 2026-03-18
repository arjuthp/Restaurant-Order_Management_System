# Frontend Requirements Mapping
# Backend → Frontend Feature Mapping

---

## 🎨 FRONTEND PAGES NEEDED

### Public Pages (No Authentication)

#### 1. Home Page `/`
**Purpose:** Landing page with restaurant info and call-to-action

**Components Needed:**
- Hero section with restaurant image
- Featured products carousel
- About section
- Contact information
- Call-to-action buttons (Order Now, Reserve Table)

**API Calls:**
- `GET /api/restaurant` - Restaurant info
- `GET /api/products` - Featured products (filter by category or featured flag)

**State Management:**
- Restaurant info (global)
- Featured products (local)

---

#### 2. Menu/Products Page `/menu` or `/products`
**Purpose:** Browse all menu items

**Components Needed:**
- Category filter sidebar/tabs
- Product grid/list
- Product card (image, name, price, add to cart button)
- Search bar
- Sort dropdown (price, name, category)
- Pagination controls

**API Calls:**
- `GET /api/products?page=1&limit=12&category=Nepali&search=momo&sort=-price`

**State Management:**
- Products list (local)
- Filters (category, search, sort) (local)
- Pagination state (local)

**User Actions:**
- View products
- Filter by category
- Search products
- Sort products
- Add to cart (requires login)

---

#### 3. Product Detail Page `/products/:id`
**Purpose:** View single product details

**Components Needed:**
- Product image
- Product name, description, price
- Category badge
- Availability status
- Quantity selector
- Add to cart button
- Back to menu button

**API Calls:**
- `GET /api/products/:id`

**State Management:**
- Product details (local)
- Selected quantity (local)

**User Actions:**
- View details
- Select quantity
- Add to cart (requires login)

---

#### 4. Login/Register Page `/auth` or `/login`
**Purpose:** User authentication

**Components Needed:**
- Login form (email, password)
- Register form (name, email, password, phone, address)
- Toggle between login/register
- Forgot password link (if implemented)
- Form validation
- Error messages
- Loading state

**API Calls:**
- `POST /api/auth/login`
- `POST /api/auth/register`

**State Management:**
- Auth state (global - Zustand)
- Form data (local)
- Loading/error states (local)

**User Actions:**
- Login
- Register
- Toggle forms
- View validation errors

---

#### 5. About Page `/about`
**Purpose:** Restaurant information

**Components Needed:**
- Restaurant description
- Address with map
- Phone number
- Opening hours
- Social media links (if added)

**API Calls:**
- `GET /api/restaurant`

**State Management:**
- Restaurant info (global)

---


### Customer Pages (Authentication Required)

#### 6. Cart Page `/cart`
**Purpose:** View and manage shopping cart

**Components Needed:**
- Cart items list
- Cart item card (product image, name, price, quantity controls, remove button)
- Quantity increment/decrement buttons
- Remove item button
- Clear cart button
- Cart summary (subtotal, tax, total)
- Promo code input (when implemented)
- Checkout button
- Empty cart state

**API Calls:**
- `GET /api/cart` - Get cart
- `POST /api/cart/items` - Add item
- `PATCH /api/cart/items/:productId` - Update quantity
- `DELETE /api/cart/items/:productId` - Remove item
- `DELETE /api/cart` - Clear cart

**State Management:**
- Cart items (global - Zustand)
- Cart total (computed from items)
- Loading states (local)

**User Actions:**
- View cart
- Update quantities
- Remove items
- Clear cart
- Apply promo code (when implemented)
- Proceed to checkout

---

#### 7. Checkout/Order Placement Page `/checkout`
**Purpose:** Place order from cart

**Components Needed:**
- Order summary (items, quantities, prices)
- Order type selector (dine-in, takeout, delivery)
- Delivery address input (if delivery)
- Pickup time selector (if takeout)
- Notes textarea
- Total calculation
- Place order button
- Loading state
- Success/error messages

**API Calls:**
- `GET /api/cart` - Get cart items
- `POST /api/orders` - Create order

**State Management:**
- Cart items (global)
- Order form data (local)
- Loading/success states (local)

**User Actions:**
- Review order
- Select order type
- Enter delivery details
- Add notes
- Place order
- Navigate to order confirmation

---

#### 8. Order Confirmation Page `/orders/:id/confirmation`
**Purpose:** Show order placed successfully

**Components Needed:**
- Success message
- Order number
- Order details
- Estimated time
- Track order button
- Continue shopping button

**API Calls:**
- `GET /api/orders/:id` - Get order details

**State Management:**
- Order details (local)

---

#### 9. My Orders Page `/orders` or `/my-orders`
**Purpose:** View order history

**Components Needed:**
- Orders list/table
- Order card (order number, date, status, total, items count)
- Status badge (color-coded)
- View details button
- Cancel button (for pending orders)
- Filter by status dropdown
- Date range filter
- Pagination controls
- Empty state

**API Calls:**
- `GET /api/orders?page=1&limit=10&status=pending`

**State Management:**
- Orders list (local)
- Filters (status, date range) (local)
- Pagination state (local)

**User Actions:**
- View orders
- Filter by status
- View order details
- Cancel pending orders

---

#### 10. Order Detail Page `/orders/:id`
**Purpose:** View single order details

**Components Needed:**
- Order number and date
- Status badge with timeline
- Items list with prices
- Subtotal, tax, total
- Delivery/pickup info
- Notes
- Cancel button (if pending)
- Back to orders button

**API Calls:**
- `GET /api/orders/:id`
- `DELETE /api/orders/:id` - Cancel order

**State Management:**
- Order details (local)
- Loading/error states (local)

**User Actions:**
- View details
- Cancel order (if pending)
- Track status

---

#### 11. Reservations Page `/reservations`
**Purpose:** Check availability and book tables

**Components Needed:**
- Availability checker form (date, time, guests)
- Available tables list
- Table card (number, capacity, location)
- Book button
- My reservations section
- Reservation card (date, time, table, status)
- Cancel button
- Empty state

**API Calls:**
- `GET /api/reservations/availability?date=...&timeSlot=...&numberOfGuests=...`
- `POST /api/reservations` - Create reservation
- `GET /api/reservations/my-reservations`
- `PATCH /api/reservations/:id/cancel`

**State Management:**
- Available tables (local)
- My reservations (local)
- Booking form data (local)

**User Actions:**
- Check availability
- Select table
- Book reservation
- View my reservations
- Cancel reservation
- Pre-order for reservation (link to cart)

---

#### 12. Reservation Detail Page `/reservations/:id`
**Purpose:** View single reservation details

**Components Needed:**
- Reservation details (date, time, guests, table)
- Status badge
- Special requests
- Contact phone
- Pre-order section (if exists)
- Cancel button
- Create pre-order button

**API Calls:**
- `GET /api/reservations/:id`
- `POST /api/orders/pre-order/:reservationId`

**State Management:**
- Reservation details (local)

**User Actions:**
- View details
- Cancel reservation
- Create pre-order

---

#### 13. Profile Page `/profile`
**Purpose:** View and edit user profile

**Components Needed:**
- Profile form (name, email, phone, address)
- Save button
- Change password section (if implemented)
- Delete account button (with confirmation)
- Loading/success states

**API Calls:**
- `GET /api/users/me`
- `PATCH /api/users/me`
- `DELETE /api/users/me`

**State Management:**
- User profile (global - Zustand)
- Form data (local)
- Loading states (local)

**User Actions:**
- View profile
- Edit profile
- Save changes
- Delete account

---


### Admin Pages (Admin Authentication Required)

#### 14. Admin Dashboard `/admin` or `/admin/dashboard`
**Purpose:** Overview of restaurant operations

**Components Needed:**
- Statistics cards (total orders, revenue, customers, reservations)
- Recent orders list
- Today's reservations
- Low stock alerts (if inventory added)
- Quick actions (add product, view orders)
- Charts (sales over time, popular products)

**API Calls:**
- `GET /api/orders/admin/all?limit=10&sort=-createdAt`
- `GET /api/reservations/admin/all?date=today`
- `GET /api/analytics/*` (if implemented)

**State Management:**
- Dashboard stats (local)
- Recent data (local)

**User Actions:**
- View overview
- Navigate to detailed pages

---

#### 15. Admin Products Page `/admin/products`
**Purpose:** Manage menu items

**Components Needed:**
- Products table/grid
- Add product button
- Edit button per product
- Delete button per product
- Search bar
- Category filter
- Availability toggle
- Pagination controls

**API Calls:**
- `GET /api/products?page=1&limit=20`
- `POST /api/products` - Create
- `PATCH /api/products/:id` - Update
- `DELETE /api/products/:id` - Delete

**State Management:**
- Products list (local)
- Filters (local)
- Pagination (local)

**User Actions:**
- View all products
- Add new product
- Edit product
- Delete product
- Toggle availability
- Search/filter

---

#### 16. Admin Product Form `/admin/products/new` or `/admin/products/:id/edit`
**Purpose:** Create or edit product

**Components Needed:**
- Product form (name, description, price, category, image)
- Image upload component
- Category dropdown
- Availability checkbox
- Save button
- Cancel button
- Form validation
- Loading/error states

**API Calls:**
- `POST /api/products` - Create
- `PATCH /api/products/:id` - Update
- `POST /api/upload` - Upload image (if implemented)

**State Management:**
- Form data (local)
- Image file (local)
- Loading states (local)

**User Actions:**
- Fill form
- Upload image
- Save product
- Cancel

---

#### 17. Admin Orders Page `/admin/orders`
**Purpose:** Manage all orders

**Components Needed:**
- Orders table
- Order row (order number, customer, date, status, total, actions)
- Status filter dropdown
- Date range filter
- Search by order number/customer
- Status update dropdown per order
- View details button
- Pagination controls

**API Calls:**
- `GET /api/orders/admin/all?page=1&status=pending&startDate=...`
- `PATCH /api/orders/:id/status` - Update status

**State Management:**
- Orders list (local)
- Filters (local)
- Pagination (local)

**User Actions:**
- View all orders
- Filter by status/date
- Update order status
- View order details

---

#### 18. Admin Order Detail Page `/admin/orders/:id`
**Purpose:** View and manage single order

**Components Needed:**
- Order details (all info)
- Customer info
- Items list
- Status timeline
- Status update dropdown
- Update button
- Print/export button (optional)

**API Calls:**
- `GET /api/orders/:id`
- `PATCH /api/orders/:id/status`

**State Management:**
- Order details (local)
- Status update (local)

**User Actions:**
- View full details
- Update status
- Print order

---

#### 19. Admin Tables Page `/admin/tables`
**Purpose:** Manage restaurant tables

**Components Needed:**
- Tables list/grid
- Add table button
- Table card (number, capacity, location, status)
- Edit button
- Delete button
- Status toggle

**API Calls:**
- `GET /api/tables`
- `POST /api/tables` - Create
- `PUT /api/tables/:id` - Update
- `DELETE /api/tables/:id` - Delete

**State Management:**
- Tables list (local)

**User Actions:**
- View tables
- Add table
- Edit table
- Delete table
- Toggle status

---

#### 20. Admin Table Form `/admin/tables/new` or `/admin/tables/:id/edit`
**Purpose:** Create or edit table

**Components Needed:**
- Table form (number, capacity, location, status)
- Save button
- Cancel button
- Form validation

**API Calls:**
- `POST /api/tables`
- `PUT /api/tables/:id`

**State Management:**
- Form data (local)

**User Actions:**
- Fill form
- Save table
- Cancel

---

#### 21. Admin Reservations Page `/admin/reservations`
**Purpose:** Manage all reservations

**Components Needed:**
- Reservations table/calendar view
- Reservation row (customer, date, time, table, guests, status)
- Status filter
- Date filter
- Status update dropdown
- View details button
- Pagination controls

**API Calls:**
- `GET /api/reservations/admin/all?date=...&status=...`
- `PATCH /api/reservations/admin/:id/status`

**State Management:**
- Reservations list (local)
- Filters (local)

**User Actions:**
- View all reservations
- Filter by date/status
- Update status
- View details

---

#### 22. Admin Users Page `/admin/users`
**Purpose:** View all customers

**Components Needed:**
- Users table
- User row (name, email, role, phone, registration date)
- Search bar
- Role filter
- Pagination controls

**API Calls:**
- `GET /api/users?page=1&limit=20`

**State Management:**
- Users list (local)
- Pagination (local)

**User Actions:**
- View all users
- Search users
- View user details (optional)

---

#### 23. Admin Settings Page `/admin/settings`
**Purpose:** Manage restaurant settings

**Components Needed:**
- Restaurant info form (name, description, address, phone, hours)
- Logo upload (if implemented)
- Save button
- Loading/success states

**API Calls:**
- `GET /api/restaurant`
- `PATCH /api/restaurant`

**State Management:**
- Restaurant info (global)
- Form data (local)

**User Actions:**
- Edit restaurant info
- Save changes

---

#### 24. Admin Promo Codes Page `/admin/promo-codes` (When Implemented)
**Purpose:** Manage promotional codes

**Components Needed:**
- Promo codes table
- Add promo code button
- Promo code row (code, discount, validity, usage, status)
- Edit/delete buttons
- Active/inactive toggle

**API Calls:**
- `GET /api/promo-codes` (to be implemented)
- `POST /api/promo-codes` (to be implemented)
- `PATCH /api/promo-codes/:id` (to be implemented)
- `DELETE /api/promo-codes/:id` (to be implemented)

**State Management:**
- Promo codes list (local)

**User Actions:**
- View promo codes
- Add promo code
- Edit promo code
- Delete promo code
- Toggle active status

---

