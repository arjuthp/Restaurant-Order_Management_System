# Restaurant Frontend Integration - Implementation Tasks

**Feature:** Restaurant Frontend Integration  
**Status:** In Progress  
**Last Updated:** March 18, 2026

---

## 📋 TASK ORGANIZATION

This task list is organized into **3 phases**:
1. **Phase 1:** Frontend features that work with current backend (NO backend changes needed)
2. **Phase 2:** Critical backend fixes
3. **Phase 3:** Frontend enhancements using new backend features

---

## 🎯 PHASE 1: FRONTEND WITH CURRENT BACKEND (Week 1)

Build these features NOW - backend is ready as-is.

### Epic 1: Authentication & Authorization ✅ Backend Ready

- [x] 1.1 Create Customer Login Page
  - [x] 1.1.1 Build login form component (email, password fields)
  - [x] 1.1.2 Add form validation (email format, required fields)
  - [x] 1.1.3 Integrate with POST /api/auth/login endpoint
  - [x] 1.1.4 Store tokens and user in authStore on success
  - [x] 1.1.5 Show error messages for failed login
  - [x] 1.1.6 Redirect to /products after successful login

- [x] 1.2 Create Customer Registration Page
  - [x] 1.2.1 Build registration form (name, email, password, phone, address)
  - [x] 1.2.2 Add form validation (all fields)
  - [x] 1.2.3 Integrate with POST /api/auth/register endpoint
  - [x] 1.2.4 Auto-login after successful registration
  - [x] 1.2.5 Show error for duplicate email
  - [x] 1.2.6 Add link to switch to login form

- [x] 1.3 Create Admin Login Page (Separate Portal)
  - [x] 1.3.1 Create /admin/login route (separate from customer login)
  - [x] 1.3.2 Build admin login form component (email, password fields)
  - [x] 1.3.3 Add distinct admin branding/styling
  - [x] 1.3.4 Integrate with POST /api/auth/admin/login endpoint
  - [x] 1.3.5 Store tokens and admin user in authStore on success
  - [x] 1.3.6 Show error messages for failed login
  - [x] 1.3.7 Redirect to /admin/dashboard after successful login
  - [x] 1.3.8 Add link to customer login page

- [x] 1.4 Implement Protected Routes
  - [x] 1.4.1 Create ProtectedRoute component
  - [x] 1.4.2 Check authentication status from authStore
  - [x] 1.4.3 Redirect to /auth if not authenticated
  - [x] 1.4.4 Store original URL for redirect after login
  - [x] 1.4.5 Create AdminRoute component (checks role='admin')
  - [x] 1.4.6 Redirect non-admins to home page

- [x] 1.5 Implement Logout
  - [x] 1.5.1 Add logout button in header/navigation
  - [x] 1.5.2 Call POST /api/auth/logout endpoint
  - [x] 1.5.3 Clear authStore (tokens and user)
  - [x] 1.5.4 Redirect to appropriate login page (customer or admin)
  - [x] 1.5.5 Show logout button only when authenticated

---

### Epic 2: Product Browsing (Customer) ✅ Backend Ready

**Note:** Products will load all at once (no pagination yet). This is OK for small datasets.

- [x] 2.1 Create Products List Page
  - [x] 2.1.1 Fetch products from GET /api/products
  - [x] 2.1.2 Display products in grid layout (responsive)
  - [x] 2.1.3 Show product card: image, name, price, availability
  - [x] 2.1.4 Add loading spinner while fetching
  - [x] 2.1.5 Show empty state if no products
  - [x] 2.1.6 Mark unavailable products visually (grayed out)
  - [x] 2.1.7 Add "Add to Cart" button on each card
  - [x] 2.1.8 Use placeholder image if product.image_url is null

- [x] 2.2 Create Product Detail Page
  - [x] 2.2.1 Fetch single product from GET /api/products/:id
  - [x] 2.2.2 Display large image, name, description, price, category
  - [x] 2.2.3 Show availability status badge
  - [x] 2.2.4 Add quantity selector (1-10)
  - [x] 2.2.5 Add "Add to Cart" button
  - [x] 2.2.6 Disable button if unavailable
  - [x] 2.2.7 Add back button to products list
  - [x] 2.2.8 Show loading state while fetching

---

### Epic 3: Cart Management (Customer) ✅ Backend Ready

- [x] 3.1 Implement Cart State Management
  - [x] 3.1.1 Create cartStore with Zustand
  - [x] 3.1.2 Add actions: addItem, removeItem, updateQuantity, clearCart
  - [x] 3.1.3 Persist cart in localStorage
  - [x] 3.1.4 Calculate subtotal and total
  - [x] 3.1.5 Show cart item count in header

- [x] 3.2 Create Cart Page
  - [x] 3.2.1 Display all cart items with image, name, price, quantity
  - [x] 3.2.2 Add quantity controls (+/- buttons) for each item
  - [x] 3.2.3 Add remove button for each item
  - [x] 3.2.4 Show subtotal and total
  - [x] 3.2.5 Show empty state with "Browse Menu" button
  - [x] 3.2.6 Add "Proceed to Checkout" button
  - [x] 3.2.7 Update totals immediately on quantity change
  - [x] 3.2.8 Add confirmation dialog for remove action

- [x] 3.3 Sync Cart with Backend
  - [x] 3.3.1 Call POST /api/cart/sync before checkout
  - [x] 3.3.2 Send cart items array to backend
  - [x] 3.3.3 Handle sync errors gracefully
  - [x] 3.3.4 Update local cart if backend returns different data

---

### Epic 4: Order Placement (Customer) ✅ Backend Ready

**Note:** Orders will load all at once (no pagination yet). This is OK for testing.

- [x] 4.1 Create Checkout Page
  - [x] 4.1.1 Display order summary (all items from cart)
  - [x] 4.1.2 Add special instructions textarea
  - [x] 4.1.3 Show order total prominently
  - [x] 4.1.4 Add "Place Order" button
  - [x] 4.1.5 Sync cart with backend before placing order
  - [x] 4.1.6 Call POST /api/orders to create order
  - [x] 4.1.7 Clear cart after successful order
  - [x] 4.1.8 Show success message and redirect to order details

- [x] 4.2 Create Orders List Page
  - [x] 4.2.1 Fetch orders from GET /api/orders/my-orders
  - [x] 4.2.2 Display orders in list/table format
  - [x] 4.2.3 Show: order ID, date, status, total for each order
  - [x] 4.2.4 Add status badge with color coding
  - [x] 4.2.5 Sort by date (newest first)
  - [x] 4.2.6 Make each order clickable to view details
  - [x] 4.2.7 Show empty state if no orders
  - [x] 4.2.8 Add loading state while fetching

- [ ] 4.3 Create Order Detail Page
  - [ ] 4.3.1 Fetch order from GET /api/orders/:id
  - [ ] 4.3.2 Display order number and status badge
  - [ ] 4.3.3 Show order date and time
  - [ ] 4.3.4 List all items with quantities and prices
  - [ ] 4.3.5 Show subtotal and total
  - [ ] 4.3.6 Display special instructions if provided
  - [ ] 4.3.7 Add back button to orders list
  - [ ] 4.3.8 Show order type (dine-in/takeout/delivery)

---

### Epic 5: User Profile ✅ Backend Ready

- [ ] 5.1 Create Profile Page
  - [ ] 5.1.1 Fetch user data from GET /api/users/me
  - [ ] 5.1.2 Display user info: name, email, phone, address
  - [ ] 5.1.3 Show role badge (customer/admin)
  - [ ] 5.1.4 Add "Edit Profile" button
  - [ ] 5.1.5 Show loading state while fetching

- [ ] 5.2 Create Edit Profile Form
  - [ ] 5.2.1 Pre-fill form with current user data
  - [ ] 5.2.2 Allow editing: name, phone, address (NOT email/password)
  - [ ] 5.2.3 Add form validation
  - [ ] 5.2.4 Call PATCH /api/users/me to update
  - [ ] 5.2.5 Update authStore with new user data
  - [ ] 5.2.6 Show success message after update
  - [ ] 5.2.7 Add cancel button to discard changes

---

### Epic 6: Admin Order Management ✅ Backend Ready

**Note:** Orders will load all at once (no pagination/filtering yet).

- [ ] 6.1 Create Admin Orders Page
  - [ ] 6.1.1 Fetch all orders from GET /api/orders (admin only)
  - [ ] 6.1.2 Display in table: order ID, customer, date, status, total
  - [ ] 6.1.3 Sort by date (newest first)
  - [ ] 6.1.4 Add status badge with color coding
  - [ ] 6.1.5 Highlight pending orders
  - [ ] 6.1.6 Add "View Details" button for each order
  - [ ] 6.1.7 Add "Update Status" dropdown for each order
  - [ ] 6.1.8 Show loading state while fetching

- [ ] 6.2 Implement Order Status Update
  - [ ] 6.2.1 Create status dropdown with valid options
  - [ ] 6.2.2 Call PATCH /api/orders/:id to update status
  - [ ] 6.2.3 Refresh order list after update
  - [ ] 6.2.4 Show success message
  - [ ] 6.2.5 Handle errors gracefully
  - [ ] 6.2.6 Validate status transitions (pending → confirmed → preparing → delivered)

- [ ] 6.3 Create Admin Order Detail Page
  - [ ] 6.3.1 Fetch order from GET /api/orders/:id
  - [ ] 6.3.2 Show customer information
  - [ ] 6.3.3 Display all order items
  - [ ] 6.3.4 Highlight special instructions
  - [ ] 6.3.5 Show order timeline/history
  - [ ] 6.3.6 Add status update controls
  - [ ] 6.3.7 Add back button to orders list

---

### Epic 7: Basic Admin Product Management ✅ Backend Ready

**Note:** Can create/edit products but WITHOUT image upload (use external URLs for now).

- [ ] 7.1 Create Admin Products Page
  - [ ] 7.1.1 Fetch products from GET /api/products
  - [ ] 7.1.2 Display in table: image, name, category, price, availability
  - [ ] 7.1.3 Add "Add Product" button at top
  - [ ] 7.1.4 Add Edit and Delete buttons for each product
  - [ ] 7.1.5 Show availability badge (color-coded)
  - [ ] 7.1.6 Format price with currency
  - [ ] 7.1.7 Show loading state while fetching

- [ ] 7.2 Create Product Form (Add/Edit)
  - [ ] 7.2.1 Create form with fields: name, description, price, category, image_url, availability
  - [ ] 7.2.2 Add validation for all required fields
  - [ ] 7.2.3 Category dropdown with valid options
  - [ ] 7.2.4 Price input (decimal numbers only)
  - [ ] 7.2.5 Availability checkbox (default: true)
  - [ ] 7.2.6 Image URL text input (temporary - until file upload is added)
  - [ ] 7.2.7 Add save and cancel buttons
  - [ ] 7.2.8 Show form in modal or separate page

- [ ] 7.3 Implement Create Product
  - [ ] 7.3.1 Call POST /api/products with form data
  - [ ] 7.3.2 Validate all fields before submit
  - [ ] 7.3.3 Show success message after creation
  - [ ] 7.3.4 Refresh product list
  - [ ] 7.3.5 Close form/modal
  - [ ] 7.3.6 Handle errors and show error messages

- [ ] 7.4 Implement Edit Product
  - [ ] 7.4.1 Pre-fill form with current product data
  - [ ] 7.4.2 Call PATCH /api/products/:id with updated data
  - [ ] 7.4.3 Show success message after update
  - [ ] 7.4.4 Refresh product list
  - [ ] 7.4.5 Close form/modal
  - [ ] 7.4.6 Handle errors gracefully

- [ ] 7.5 Implement Delete Product
  - [ ] 7.5.1 Add delete button for each product
  - [ ] 7.5.2 Show confirmation dialog "Are you sure?"
  - [ ] 7.5.3 Call DELETE /api/products/:id
  - [ ] 7.5.4 Remove product from list immediately
  - [ ] 7.5.5 Show success message
  - [ ] 7.5.6 Handle errors and show error messages

---

### Epic 8: Navigation & Layout

- [ ] 8.1 Create Main Layout Component
  - [ ] 8.1.1 Create header with logo and navigation
  - [ ] 8.1.2 Add navigation links (Home, Products, Cart, Orders, Profile)
  - [ ] 8.1.3 Show cart icon with item count
  - [ ] 8.1.4 Show login/logout button based on auth state
  - [ ] 8.1.5 Show admin link if user is admin
  - [ ] 8.1.6 Create footer component
  - [ ] 8.1.7 Make layout responsive (mobile-friendly)

- [ ] 8.2 Create Admin Layout Component
  - [ ] 8.2.1 Create admin sidebar navigation
  - [ ] 8.2.2 Add links: Dashboard, Products, Orders, Users
  - [ ] 8.2.3 Show current user info in sidebar
  - [ ] 8.2.4 Add logout button
  - [ ] 8.2.5 Make responsive (collapsible on mobile)

---

## 🔧 PHASE 2: CRITICAL BACKEND FIXES (Week 2)

These backend changes are needed to unlock advanced features.

### Epic 9: Backend - CORS & Security

- [ ] 9.1 Fix CORS Configuration
  - [ ] 9.1.1 Replace `origin: '*'` with environment variable
  - [ ] 9.1.2 Set FRONTEND_URL in .env file
  - [ ] 9.1.3 Configure allowed methods and headers
  - [ ] 9.1.4 Test CORS from frontend
  - [ ] 9.1.5 Verify credentials work properly

---

### Epic 10: Backend - Response Standardization

- [ ] 10.1 Standardize API Response Formats
  - [ ] 10.1.1 Create response utility functions
  - [ ] 10.1.2 Update all controllers to use standard format
  - [ ] 10.1.3 Success format: `{ success: true, data: {...} }`
  - [ ] 10.1.4 Error format: `{ success: false, error: { message, status } }`
  - [ ] 10.1.5 Test all endpoints return consistent format

---

### Epic 11: Backend - Pagination

- [ ] 11.1 Add Pagination to Products
  - [ ] 11.1.1 Update product service to support page/limit params
  - [ ] 11.1.2 Add pagination metadata to response
  - [ ] 11.1.3 Default limit: 12 products per page
  - [ ] 11.1.4 Test pagination with query params

- [ ] 11.2 Add Pagination to Orders
  - [ ] 11.2.1 Update order service for pagination
  - [ ] 11.2.2 Apply to both customer and admin endpoints
  - [ ] 11.2.3 Default limit: 10 orders per page
  - [ ] 11.2.4 Test pagination

- [ ] 11.3 Add Pagination to Users (Admin)
  - [ ] 11.3.1 Update user service for pagination
  - [ ] 11.3.2 Default limit: 10 users per page
  - [ ] 11.3.3 Test pagination

- [ ] 11.4 Add Pagination to Reservations
  - [ ] 11.4.1 Update reservation service for pagination
  - [ ] 11.4.2 Default limit: 10 reservations per page
  - [ ] 11.4.3 Test pagination

---

### Epic 12: Backend - Search & Filter

- [ ] 12.1 Add Product Search
  - [ ] 12.1.1 Add search parameter to GET /api/products
  - [ ] 12.1.2 Search by name and description (case-insensitive)
  - [ ] 12.1.3 Use MongoDB text search or regex
  - [ ] 12.1.4 Test search functionality

- [ ] 12.2 Add Product Category Filter
  - [ ] 12.2.1 Add category parameter to GET /api/products
  - [ ] 12.2.2 Filter by exact category match
  - [ ] 12.2.3 Support "all" to show all categories
  - [ ] 12.2.4 Test category filtering

- [ ] 12.3 Add Product Availability Filter
  - [ ] 12.3.1 Add available parameter to GET /api/products
  - [ ] 12.3.2 Filter by is_available field
  - [ ] 12.3.3 Test availability filtering

- [ ] 12.4 Add Order Status Filter
  - [ ] 12.4.1 Add status parameter to GET /api/orders
  - [ ] 12.4.2 Filter by order status
  - [ ] 12.4.3 Test status filtering

- [ ] 12.5 Add Order Date Range Filter
  - [ ] 12.5.1 Add startDate and endDate parameters
  - [ ] 12.5.2 Filter orders by date range
  - [ ] 12.5.3 Test date filtering

- [ ] 12.6 Add Reservation Filters
  - [ ] 12.6.1 Add date parameter for specific date
  - [ ] 12.6.2 Add status parameter for reservation status
  - [ ] 12.6.3 Test reservation filtering

---

### Epic 13: Backend - File Upload

- [x] 13.1 Setup File Upload Infrastructure
  - [x] 13.1.1 Install multer package
  - [x] 13.1.2 Create uploads/products directory
  - [x] 13.1.3 Create upload middleware (file validation, size limits)
  - [x] 13.1.4 Configure allowed file types (JPEG, PNG, WebP)
  - [x] 13.1.5 Set 5MB file size limit
  - [x] 13.1.6 Add static file serving for /uploads

- [x] 13.2 Add Image Upload to Product Routes
  - [x] 13.2.1 Update POST /api/products to accept multipart/form-data
  - [x] 13.2.2 Update PATCH /api/products/:id for image updates
  - [x] 13.2.3 Add multer middleware to routes
  - [x] 13.2.4 Update controller to handle file upload
  - [x] 13.2.5 Save image URL to database
  - [x] 13.2.6 Test image upload with Postman

---

### Epic 14: Backend - Input Validation

- [ ] 14.1 Setup Validation Middleware
  - [ ] 14.1.1 Install express-validator or joi
  - [ ] 14.1.2 Create validation middleware
  - [ ] 14.1.3 Create validation error handler

- [ ] 14.2 Add Product Validation
  - [ ] 14.2.1 Validate name (required, string)
  - [ ] 14.2.2 Validate price (required, positive number)
  - [ ] 14.2.3 Validate category (required, valid enum)
  - [ ] 14.2.4 Apply to create and update routes

- [ ] 14.3 Add User Validation
  - [ ] 14.3.1 Validate email (required, valid format)
  - [ ] 14.3.2 Validate password (required, min 6 chars)
  - [ ] 14.3.3 Validate name (required, string)
  - [ ] 14.3.4 Validate phone (optional, 10 digits)

- [ ] 14.4 Add Order Validation
  - [ ] 14.4.1 Validate items array (not empty)
  - [ ] 14.4.2 Validate notes (optional, string)
  - [ ] 14.4.3 Apply to order creation route

- [ ] 14.5 Add Reservation Validation
  - [ ] 14.5.1 Validate date (required, future date)
  - [ ] 14.5.2 Validate timeSlot (required, valid format)
  - [ ] 14.5.3 Validate numberOfGuests (required, positive)
  - [ ] 14.5.4 Apply to reservation routes

---

## 🚀 PHASE 3: FRONTEND ENHANCEMENTS (Week 3)

Update frontend to use new backend features.

### Epic 15: Product Search & Filter (Frontend)

- [ ] 15.1 Add Product Search Bar
  - [ ] 15.1.1 Create search input component
  - [ ] 15.1.2 Debounce search input (300ms)
  - [ ] 15.1.3 Call GET /api/products?search=query
  - [ ] 15.1.4 Update product list with results
  - [ ] 15.1.5 Show "no results" message if empty
  - [ ] 15.1.6 Add clear search button

- [ ] 15.2 Add Category Filter
  - [ ] 15.2.1 Create category dropdown component
  - [ ] 15.2.2 Fetch categories from products
  - [ ] 15.2.3 Call GET /api/products?category=value
  - [ ] 15.2.4 Update product list with filtered results
  - [ ] 15.2.5 Show active filter visually
  - [ ] 15.2.6 Combine with search functionality

- [ ] 15.3 Add Availability Filter
  - [ ] 15.3.1 Add "Show only available" checkbox
  - [ ] 15.3.2 Call GET /api/products?available=true
  - [ ] 15.3.3 Update product list
  - [ ] 15.3.4 Combine with search and category filters

---

### Epic 16: Pagination (Frontend)

- [ ] 16.1 Add Pagination to Products
  - [ ] 16.1.1 Create pagination component
  - [ ] 16.1.2 Call GET /api/products?page=1&limit=12
  - [ ] 16.1.3 Display page numbers and navigation
  - [ ] 16.1.4 Show total pages and current page
  - [ ] 16.1.5 Reset to page 1 when filters change

- [ ] 16.2 Add Pagination to Orders
  - [ ] 16.2.1 Add pagination to customer orders page
  - [ ] 16.2.2 Add pagination to admin orders page
  - [ ] 16.2.3 Use limit=10 for orders
  - [ ] 16.2.4 Test pagination navigation

---

### Epic 17: Admin Product Image Upload (Frontend)

- [ ] 17.1 Update Product Form for File Upload
  - [ ] 17.1.1 Replace image URL input with file upload
  - [ ] 17.1.2 Add file input with accept="image/jpeg,image/png,image/webp"
  - [ ] 17.1.3 Show image preview after selection
  - [ ] 17.1.4 Validate file size (max 5MB)
  - [ ] 17.1.5 Validate file type on frontend
  - [ ] 17.1.6 Show error for invalid files

- [ ] 17.2 Implement Image Upload
  - [ ] 17.2.1 Create FormData for multipart/form-data
  - [ ] 17.2.2 Append file and other product fields
  - [ ] 17.2.3 Call POST /api/products with FormData
  - [ ] 17.2.4 Handle upload progress (optional)
  - [ ] 17.2.5 Show success message with uploaded image
  - [ ] 17.2.6 Handle upload errors

- [ ] 17.3 Implement Image Update
  - [ ] 17.3.1 Show current image in edit form
  - [ ] 17.3.2 Allow replacing image with new upload
  - [ ] 17.3.3 Call PATCH /api/products/:id with FormData
  - [ ] 17.3.4 Update product list with new image
  - [ ] 17.3.5 Handle errors gracefully

---

### Epic 18: Order Filtering (Frontend)

- [ ] 18.1 Add Order Status Filter
  - [ ] 18.1.1 Create status filter dropdown
  - [ ] 18.1.2 Call GET /api/orders?status=value
  - [ ] 18.1.3 Update order list with filtered results
  - [ ] 18.1.4 Apply to both customer and admin pages

- [ ] 18.2 Add Order Date Filter (Admin)
  - [ ] 18.2.1 Create date range picker
  - [ ] 18.2.2 Call GET /api/orders?startDate=...&endDate=...
  - [ ] 18.2.3 Update order list with filtered results
  - [ ] 18.2.4 Combine with status filter

---

## 📊 PROGRESS TRACKING

### Phase 1 Progress: 0/68 tasks complete
- Epic 1: 0/7 ⬜⬜⬜⬜⬜⬜⬜
- Epic 2: 0/8 ⬜⬜⬜⬜⬜⬜⬜⬜
- Epic 3: 0/8 ⬜⬜⬜⬜⬜⬜⬜⬜
- Epic 4: 0/8 ⬜⬜⬜⬜⬜⬜⬜⬜
- Epic 5: 0/7 ⬜⬜⬜⬜⬜⬜⬜
- Epic 6: 0/8 ⬜⬜⬜⬜⬜⬜⬜⬜
- Epic 7: 0/8 ⬜⬜⬜⬜⬜⬜⬜⬜
- Epic 8: 0/7 ⬜⬜⬜⬜⬜⬜⬜

### Phase 2 Progress: 0/42 tasks complete
- Epic 9: 0/5 ⬜⬜⬜⬜⬜
- Epic 10: 0/5 ⬜⬜⬜⬜⬜
- Epic 11: 0/4 ⬜⬜⬜⬜
- Epic 12: 0/6 ⬜⬜⬜⬜⬜⬜
- Epic 13: 0/6 ⬜⬜⬜⬜⬜⬜
- Epic 14: 0/5 ⬜⬜⬜⬜⬜

### Phase 3 Progress: 0/21 tasks complete
- Epic 15: 0/3 ⬜⬜⬜
- Epic 16: 0/2 ⬜⬜
- Epic 17: 0/3 ⬜⬜⬜
- Epic 18: 0/2 ⬜⬜

---

## 🎯 NEXT STEPS

**Start with Phase 1, Epic 1, Task 1.3** - Create Admin Login Page (Separate Portal)

Your boilerplate is ready! You have:
- ✅ React + TypeScript + Vite
- ✅ React Router for navigation
- ✅ Zustand for state management
- ✅ Axios API client with interceptors
- ✅ Auth store with token management
- ✅ Error boundary
- ✅ Testing setup
- ✅ Customer login and registration complete

**Next: Implement separate admin login portal at /admin/login**

---

**Version:** 2.1  
**Last Updated:** March 18, 2026
