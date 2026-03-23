# Restaurant Frontend Integration - Implementation Tasks

**Feature:** Restaurant Frontend Integration  
**Status:** Primary Complete ✅ | Secondary In Progress  
**Last Updated:** March 19, 2026

---

## ⚠️ CRITICAL IMPLEMENTATION RULES

### **BACKEND CHANGES REQUIRE EXPLICIT PERMISSION**

Before making ANY changes to backend files (anything in the `src/` directory), you MUST:
1. **STOP and ASK for permission** - Explain what you want to change and why
2. **Wait for explicit approval** from the project owner
3. **Show the exact changes** you plan to make before implementing
4. **Proceed step-by-step** with approval at each stage

This is a strict requirement for ALL backend modifications including:
- Installing new packages
- Creating new files
- Modifying existing files
- Changing configurations
- Database schema changes

**The project owner must be aware of and approve every backend change.**

---

## 🔧 PROJECT CONFIGURATION

### **Development Ports**
- **Frontend (Vite):** http://localhost:3000 (configured in `client/vite.config.ts`)
- **Backend (Express):** http://localhost:5000 (configured in `src/server.js`)
- **MongoDB:** mongodb://localhost:27017

**⚠️ IMPORTANT:** Frontend runs on port **3000**, NOT Vite's default port 5173. Always use `http://localhost:3000` for CORS and frontend URL configurations.

---

## 📋 TASK ORGANIZATION

This spec is split into **TWO PARTS**:

### **🎯 PRIMARY SPEC (Core MVP - COMPLETE)**
Essential features for a functional restaurant ordering system. All tasks complete and verified.

### **🔄 SECONDARY SPEC (Enhancements - IN PROGRESS)**
Nice-to-have features, UI improvements, and advanced functionality.

---

# 🎯 PRIMARY SPEC - CORE MVP ✅

All core functionality implemented and working.

---

## Epic 1: Authentication & Authorization ✅

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

## Epic 2: Product Browsing (Customer) ✅

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

## Epic 3: Cart Management (Customer) ✅

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

## Epic 4: Order Placement (Customer) ✅

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

- [x] 4.3 Create Order Detail Page
  - [x] 4.3.1 Fetch order from GET /api/orders/:id
  - [x] 4.3.2 Display order number and status badge
  - [x] 4.3.3 Show order date and time
  - [x] 4.3.4 List all items with quantities and prices
  - [x] 4.3.5 Show subtotal and total
  - [x] 4.3.6 Display special instructions if provided
  - [x] 4.3.7 Add back button to orders list
  - [x] 4.3.8 Show order type (dine-in/takeout/delivery)

---

## Epic 5: User Profile ✅

- [x] 5.1 Create Profile Page
  - [x] 5.1.1 Fetch user data from GET /api/users/me
  - [x] 5.1.2 Display user info: name, email, phone, address
  - [x] 5.1.3 Show role badge (customer/admin)
  - [x] 5.1.4 Add "Edit Profile" button
  - [x] 5.1.5 Show loading state while fetching

- [x] 5.2 Create Edit Profile Form
  - [x] 5.2.1 Pre-fill form with current user data
  - [x] 5.2.2 Allow editing: name, phone, address (NOT email/password)
  - [x] 5.2.3 Add form validation
  - [x] 5.2.4 Call PATCH /api/users/me to update
  - [x] 5.2.5 Update authStore with new user data
  - [x] 5.2.6 Show success message after update
  - [x] 5.2.7 Add cancel button to discard changes

---

## Epic 6: Admin Order Management ✅

- [x] 6.1 Create Admin Orders Page
  - [x] 6.1.1 Fetch all orders from GET /api/orders (admin only)
  - [x] 6.1.2 Display in table: order ID, customer, date, status, total
  - [x] 6.1.3 Sort by date (newest first)
  - [x] 6.1.4 Add status badge with color coding
  - [x] 6.1.5 Highlight pending orders
  - [x] 6.1.6 Add "View Details" button for each order
  - [x] 6.1.7 Add "Update Status" dropdown for each order
  - [x] 6.1.8 Show loading state while fetching

- [x] 6.2 Implement Order Status Update
  - [x] 6.2.1 Create status dropdown with valid options
  - [x] 6.2.2 Call PATCH /api/orders/:id to update status
  - [x] 6.2.3 Refresh order list after update
  - [x] 6.2.4 Show success message
  - [x] 6.2.5 Handle errors gracefully
  - [x] 6.2.6 Validate status transitions (pending → confirmed → preparing → delivered)

- [x] 6.3 Create Admin Order Detail Page
  - [x] 6.3.1 Fetch order from GET /api/orders/:id
  - [x] 6.3.2 Show customer information
  - [x] 6.3.3 Display all order items
  - [x] 6.3.4 Highlight special instructions
  - [x] 6.3.5 Show order timeline/history
  - [x] 6.3.6 Add status update controls
  - [x] 6.3.7 Add back button to orders list

---

## Epic 7: Admin Product Management ✅

- [x] 7.1 Create Admin Products Page
  - [x] 7.1.1 Fetch products from GET /api/products
  - [x] 7.1.2 Display in table: image, name, category, price, availability
  - [x] 7.1.3 Add "Add Product" button at top
  - [x] 7.1.4 Add Edit and Delete buttons for each product
  - [x] 7.1.5 Show availability badge (color-coded)
  - [x] 7.1.6 Format price with currency
  - [x] 7.1.7 Show loading state while fetching

- [x] 7.2 Create Product Form (Add/Edit)
  - [x] 7.2.1 Create form with fields: name, description, price, category, image_url, availability
  - [x] 7.2.2 Add validation for all required fields
  - [x] 7.2.3 Category dropdown with valid options
  - [x] 7.2.4 Price input (decimal numbers only)
  - [x] 7.2.5 Availability checkbox (default: true)
  - [x] 7.2.6 Image URL text input (temporary - until file upload is added)
  - [x] 7.2.7 Add save and cancel buttons
  - [x] 7.2.8 Show form in modal or separate page

- [x] 7.3 Implement Create Product
  - [x] 7.3.1 Call POST /api/products with form data
  - [x] 7.3.2 Validate all fields before submit
  - [x] 7.3.3 Show success message after creation
  - [x] 7.3.4 Refresh product list
  - [x] 7.3.5 Close form/modal
  - [x] 7.3.6 Handle errors and show error messages

- [x] 7.4 Implement Edit Product
  - [x] 7.4.1 Pre-fill form with current product data
  - [x] 7.4.2 Call PATCH /api/products/:id with updated data
  - [x] 7.4.3 Show success message after update
  - [x] 7.4.4 Refresh product list
  - [x] 7.4.5 Close form/modal
  - [x] 7.4.6 Handle errors gracefully

- [x] 7.5 Implement Delete Product
  - [x] 7.5.1 Add delete button for each product
  - [x] 7.5.2 Show confirmation dialog "Are you sure?"
  - [x] 7.5.3 Call DELETE /api/products/:id
  - [x] 7.5.4 Remove product from list immediately
  - [x] 7.5.5 Show success message
  - [x] 7.5.6 Handle errors and show error messages

---

## Epic 8: Navigation & Layout ✅

- [x] 8.1 Create Main Layout Component
  - [x] 8.1.1 Create header with logo and navigation
  - [x] 8.1.2 Add navigation links (Home, Products, Cart, Orders, Profile)
  - [x] 8.1.3 Show cart icon with item count
  - [x] 8.1.4 Show login/logout button based on auth state
  - [x] 8.1.5 Show admin link if user is admin
  - [x] 8.1.6 Create footer component
  - [x] 8.1.7 Make layout responsive (mobile-friendly)

- [x] 8.2 Create Admin Layout Component
  - [x] 8.2.1 Create admin sidebar navigation
  - [x] 8.2.2 Add links: Dashboard, Products, Orders, Users
  - [x] 8.2.3 Show current user info in sidebar
  - [x] 8.2.4 Add logout button
  - [x] 8.2.5 Make responsive (collapsible on mobile)

---

## Epic 9: Backend - CORS & Security ✅

- [x] 9.1 Fix CORS Configuration
  - [x] 9.1.1 Replace `origin: '*'` with environment variable
  - [x] 9.1.2 Set FRONTEND_URL in .env file
  - [x] 9.1.3 Configure allowed methods and headers
  - [x] 9.1.4 Test CORS from frontend
  - [x] 9.1.5 Verify credentials work properly

---

## Epic 10: Backend - Response Standardization ✅

- [x] 10.1 Standardize API Response Formats
  - [x] 10.1.1 Create response utility functions
  - [x] 10.1.2 Update all controllers to use standard format
  - [x] 10.1.3 Success format: `{ success: true, data: {...} }`
  - [x] 10.1.4 Error format: `{ success: false, error: { message, status } }`
  - [x] 10.1.5 Test all endpoints return consistent format

---

## Epic 11: Backend - Pagination ✅

- [x] 11.1 Add Pagination to Products
  - [x] 11.1.1 Update product service to support page/limit params
  - [x] 11.1.2 Add pagination metadata to response
  - [x] 11.1.3 Default limit: 12 products per page
  - [x] 11.1.4 Test pagination with query params

- [x] 11.2 Add Pagination to Orders
  - [x] 11.2.1 Update order service for pagination
  - [x] 11.2.2 Apply to both customer and admin endpoints
  - [x] 11.2.3 Default limit: 10 orders per page
  - [x] 11.2.4 Test pagination

- [x] 11.3 Add Pagination to Users (Admin)
  - [x] 11.3.1 Update user service for pagination
  - [x] 11.3.2 Default limit: 10 users per page
  - [x] 11.3.3 Test pagination

- [x] 11.4 Add Pagination to Reservations
  - [x] 11.4.1 Update reservation service for pagination
  - [x] 11.4.2 Default limit: 10 reservations per page
  - [x] 11.4.3 Test pagination

---

## Epic 12: Backend - File Upload ✅

- [x] 12.1 Setup File Upload Infrastructure
  - [x] 12.1.1 Install multer package
  - [x] 12.1.2 Create uploads/products directory
  - [x] 12.1.3 Create upload middleware (file validation, size limits)
  - [x] 12.1.4 Configure allowed file types (JPEG, PNG, WebP)
  - [x] 12.1.5 Set 5MB file size limit
  - [x] 12.1.6 Add static file serving for /uploads

- [x] 12.2 Add Image Upload to Product Routes
  - [x] 12.2.1 Update POST /api/products to accept multipart/form-data
  - [x] 12.2.2 Update PATCH /api/products/:id for image updates
  - [x] 12.2.3 Add multer middleware to routes
  - [x] 12.2.4 Update controller to handle file upload
  - [x] 12.2.5 Save image URL to database
  - [x] 12.2.6 Test image upload with Postman

---

## 📊 PRIMARY SPEC SUMMARY

**Total:** 90/90 tasks complete (100%) ✅

**Epics Complete:**
- ✅ Epic 1-12: All core functionality working

**What's Working:**
- Full customer journey (browse → cart → checkout → orders)
- Full admin functionality (products CRUD, order management)
- Authentication & authorization (customer + admin)
- Backend infrastructure (pagination, file upload, CORS, responses)
- Responsive layouts and navigation

---

# 🔄 SECONDARY SPEC - ENHANCEMENTS

Features that improve UX but aren't critical for core functionality.

---

## Epic 13: Backend - Search & Filter ✅ COMPLETE

- [x] 13.1 Add Product Search
  - [x] 13.1.1 Add search parameter to GET /api/products
  - [x] 13.1.2 Search by name and description (case-insensitive)
  - [x] 13.1.3 Use MongoDB text search or regex
  - [x] 13.1.4 Test search functionality

- [x] 13.2 Add Product Category Filter
  - [x] 13.2.1 Add category parameter to GET /api/products
  - [x] 13.2.2 Filter by exact category match
  - [x] 13.2.3 Support "all" to show all categories
  - [x] 13.2.4 Test category filtering

- [x] 13.3 Add Product Availability Filter
  - [x] 13.3.1 Add available parameter to GET /api/products
  - [x] 13.3.2 Filter by is_available field
  - [x] 13.3.3 Test availability filtering

- [x] 13.4 Add Order Status Filter
  - [x] 13.4.1 Add status parameter to GET /api/orders
  - [x] 13.4.2 Filter by order status
  - [x] 13.4.3 Test status filtering

- [x] 13.5 Add Order Date Range Filter
  - [x] 13.5.1 Add startDate and endDate parameters
  - [x] 13.5.2 Filter orders by date range
  - [x] 13.5.3 Test date filtering

- [x] 13.6 Add Reservation Filters
  - [x] 13.6.1 Add date parameter for specific date
  - [x] 13.6.2 Add status parameter for reservation status
  - [x] 13.6.3 Test reservation filtering

---

## Epic 14: Backend - Input Validation

- [x] 14.1 Setup Validation Middleware
  - [x] 14.1.1 Install express-validator or joi
  - [x] 14.1.2 Create validation middleware
  - [x] 14.1.3 Create validation error handler

- [x] 14.2 Add Product Validation
  - [x] 14.2.1 Validate name (required, string)
  - [x] 14.2.2 Validate price (required, positive number)
  - [x] 14.2.3 Validate category (required, valid enum)
  - [x] 14.2.4 Apply to create and update routes

- [x] 14.3 Add User Validation
  - [x] 14.3.1 Validate email (required, valid format)
  - [x] 14.3.2 Validate password (required, min 6 chars)
  - [x] 14.3.3 Validate name (required, string)
  - [x] 14.3.4 Validate phone (optional, 10 digits)

- [x] 14.4 Add Order Validation
  - [x] 14.4.1 Validate items array (not empty)
  - [x] 14.4.2 Validate notes (optional, string)
  - [x] 14.4.3 Apply to order creation route

- [x] 14.5 Add Reservation Validation
  - [x] 14.5.1 Validate date (required, future date)
  - [x] 14.5.2 Validate timeSlot (required, valid format)
  - [x] 14.5.3 Validate numberOfGuests (required, positive)
  - [x] 14.5.4 Apply to reservation routes

---

## Epic 15: Product Search & Filter (Frontend)

- [x] 15.1 Add Product Search Bar
  - [x] 15.1.1 Create search input component
  - [x] 15.1.2 Debounce search input (300ms)
  - [x] 15.1.3 Call GET /api/products?search=query
  - [x] 15.1.4 Update product list with results
  - [x] 15.1.5 Show "no results" message if empty
  - [x] 15.1.6 Add clear search button

- [x] 15.2 Add Category Filter
  - [x] 15.2.1 Create category dropdown component
  - [x] 15.2.2 Fetch categories from products
  - [x] 15.2.3 Call GET /api/products?category=value
  - [x] 15.2.4 Update product list with filtered results
  - [x] 15.2.5 Show active filter visually
  - [x] 15.2.6 Combine with search functionality

- [x] 15.3 Add Availability Filter
  - [x] 15.3.1 Add "Show only available" checkbox
  - [x] 15.3.2 Call GET /api/products?available=true
  - [x] 15.3.3 Update product list
  - [x] 15.3.4 Combine with search and category filters

---

## Epic 16: Pagination (Frontend)

- [x] 16.1 Add Pagination to Products
  - [x] 16.1.1 Create pagination component
  - [x] 16.1.2 Call GET /api/products?page=1&limit=12
  - [x] 16.1.3 Display page numbers and navigation
  - [x] 16.1.4 Show total pages and current page
  - [x] 16.1.5 Reset to page 1 when filters change

- [x] 16.2 Add Pagination to Orders
  - [x] 16.2.1 Add pagination to customer orders page
  - [x] 16.2.2 Add pagination to admin orders page
  - [x] 16.2.3 Use limit=10 for orders
  - [x] 16.2.4 Test pagination navigation

---

## Epic 17: Admin Product Image Upload (Frontend)

- [x] 17.1 Update Product Form for File Upload
  - [x] 17.1.1 Replace image URL input with file upload
  - [x] 17.1.2 Add file input with accept="image/jpeg,image/png,image/webp"
  - [x] 17.1.3 Show image preview after selection
  - [x] 17.1.4 Validate file size (max 5MB)
  - [x] 17.1.5 Validate file type on frontend
  - [x] 17.1.6 Show error for invalid files

- [x] 17.2 Implement Image Upload
  - [x] 17.2.1 Create FormData for multipart/form-data
  - [x] 17.2.2 Append file and other product fields
  - [x] 17.2.3 Call POST /api/products with FormData
  - [x] 17.2.4 Handle upload progress (optional)
  - [x] 17.2.5 Show success message with uploaded image
  - [x] 17.2.6 Handle upload errors

- [x] 17.3 Implement Image Update
  - [x] 17.3.1 Show current image in edit form
  - [x] 17.3.2 Allow replacing image with new upload
  - [x] 17.3.3 Call PATCH /api/products/:id with FormData
  - [x] 17.3.4 Update product list with new image
  - [x] 17.3.5 Handle errors gracefully

---

## Epic 18: Order Filtering (Frontend)

- [x] 18.1 Add Order Status Filter
  - [x] 18.1.1 Create status filter dropdown
  - [x] 18.1.2 Call GET /api/orders?status=value
  - [x] 18.1.3 Update order list with filtered results
  - [x] 18.1.4 Apply to both customer and admin pages

- [x] 18.2 Add Order Date Filter (Admin)
  - [x] 18.2.1 Create date range picker
  - [x] 18.2.2 Call GET /api/orders?startDate=...&endDate=...
  - [x] 18.2.3 Update order list with filtered results
  - [x] 18.2.4 Combine with status filter

---

## 📊 SECONDARY SPEC SUMMARY

**Total:** 18/57 tasks complete (32%)

**Completed:**
- ✅ Epic 13: Backend search/filter (18/18 tasks)

**Pending:**
- ⬜ Epic 14: Input validation (0/15 tasks)
- ⬜ Epic 15: Search/filter UI (0/12 tasks)
- ⬜ Epic 16: Pagination UI (0/6 tasks)
- ⬜ Epic 17: Image upload UI (0/9 tasks)
- ⬜ Epic 18: Order filtering UI (0/6 tasks)

---

## 🎯 NEXT STEPS

**Primary Spec:** ✅ Complete and ready for production

**Secondary Spec Priorities:**
1. **Epic 15** - Search/Filter UI (high priority, backend ready)
2. **Epic 16** - Pagination UI (high priority, backend ready)
3. **Epic 14** - Input Validation (medium priority)
4. **Epic 17** - Image Upload UI (medium priority, backend ready)
5. **Epic 18** - Order Filtering UI (medium priority, backend ready)

**Recommendation:** Deploy primary spec, gather feedback, then enhance with secondary features.

---

**Version:** 3.0 (Optimized)  
**Last Updated:** March 19, 2026  
**Primary:** ✅ 100% | **Secondary:** 🔄 32%
