# H. API Integration Plan
# I. Recommended Implementation Sequence

## Overview

This document outlines the exact order to implement features, from backend fixes to complete frontend integration. Each phase builds on the previous one, ensuring a stable foundation before adding complexity.

---

## 🎯 Implementation Philosophy

### Principles
1. **Fix critical backend issues first** - Don't build on a shaky foundation
2. **Build feature-by-feature** - Complete one user flow before starting another
3. **Test as you go** - Verify each feature works before moving on
4. **Start with core, add polish later** - MVP first, enhancements second
5. **Reuse existing code** - Don't reinvent the wheel

### Success Criteria
- Each phase has clear deliverables
- Each feature is testable independently
- User can complete end-to-end flows
- Code is maintainable and documented

---

## Phase 1: Backend Foundation (Week 1 - Days 1-3)

### Goal
Fix critical backend issues that block frontend integration

### Tasks

#### Day 1: Security & Error Handling
1. **Fix CORS Configuration** (30 min)
   - Update `src/app.js`
   - Add `FRONTEND_URL` to `.env`
   - Test with frontend origin

2. **Add Centralized Error Handler** (4-6h)
   - Create `middleware/errorHandler.js`
   - Create `AppError` class
   - Update `app.js` to use error handler
   - Update all controllers to throw `AppError`
   - Test error responses

3. **Fix Filename Typos** (15 min)
   - Rename `cart.contoller.js` → `cart.controller.js`
   - Rename `reservation.contollers.js` → `reservation.controllers.js`
   - Update imports in routes

#### Day 2: Validation & Response Format
4. **Add Input Validation** (8-10h)
   - Install `express-validator`
   - Create `validation/` directory
   - Create validation rules for each module:
     - `auth.validation.js`
     - `product.validation.js`
     - `cart.validation.js`
     - `order.validation.js`
     - `reservation.validation.js`
     - `table.validation.js`
     - `user.validation.js`
   - Create `middleware/validate.js`
   - Update all routes to use validation
   - Test validation errors

5. **Standardize Response Formats** (4-6h)
   - Create `utils/response.js`
   - Update all controllers to use standard format
   - Keep auth endpoints as-is (established contract)
   - Test all endpoints

#### Day 3: Rate Limiting & Logging
6. **Add Rate Limiting** (2-3h)
   - Install `express-rate-limit`
   - Create `middleware/rateLimiter.js`
   - Add general API limiter
   - Add strict auth limiter
   - Test rate limiting

7. **Add Request Logging** (2-3h)
   - Install `morgan` and `winston`
   - Create `utils/logger.js`
   - Add HTTP request logging
   - Add application logging
   - Create `logs/` directory
   - Test logging

### Deliverables
- ✅ CORS properly configured
- ✅ Consistent error handling
- ✅ Input validation on all endpoints
- ✅ Standardized response format
- ✅ Rate limiting active
- ✅ Request/error logging working

### Testing
```bash
# Test CORS
curl -H "Origin: http://localhost:3000" http://localhost:5000/api/products

# Test validation
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name": ""}' # Should return validation error

# Test rate limiting
# Make 6 rapid requests to /api/auth/login

# Check logs
cat logs/combined.log
```

---

## Phase 2: Pagination & Search (Week 1 - Days 4-5)

### Goal
Add pagination and search/filter to all list endpoints

### Tasks

#### Day 4: Pagination
1. **Add Pagination Helper** (1h)
   - Create `utils/pagination.js`
   - Create reusable pagination function

2. **Update Product Service** (2h)
   - Add pagination to `getAllProducts()`
   - Add query parameter parsing
   - Test with different page/limit values

3. **Update Order Service** (2h)
   - Add pagination to `getAllOrders()`
   - Add pagination to `getMyOrders()`
   - Test pagination

4. **Update User Service** (1h)
   - Add pagination to `getAllUsers()`
   - Test pagination

5. **Update Reservation Service** (2h)
   - Add pagination to `getAllReservations()`
   - Add pagination to `getMyReservations()`
   - Test pagination

#### Day 5: Search & Filtering
6. **Add Product Search/Filter** (3h)
   - Add search by name (regex)
   - Add filter by category
   - Add filter by availability
   - Add sorting
   - Test all combinations

7. **Add Order Filtering** (2h)
   - Add filter by status
   - Add filter by date range
   - Add sorting
   - Test filters

8. **Add Reservation Filtering** (2h)
   - Add filter by date
   - Add filter by status
   - Add sorting
   - Test filters

### Deliverables
- ✅ All list endpoints support pagination
- ✅ Products searchable and filterable
- ✅ Orders filterable by status/date
- ✅ Reservations filterable by date/status
- ✅ Consistent pagination response format

### Testing
```bash
# Test product pagination
GET /api/products?page=1&limit=10

# Test product search
GET /api/products?search=momo&category=Nepali&available=true

# Test order filtering
GET /api/orders?status=pending&startDate=2024-01-01

# Test reservation filtering
GET /api/reservations/admin/all?date=2024-03-20&status=confirmed
```

---


## Phase 3: File Upload (Week 2 - Day 1)

### Goal
Enable image uploads for products and restaurant

### Tasks

1. **Setup File Upload** (2h)
   - Install `multer`
   - Create `uploads/` directory
   - Create `middleware/upload.js`
   - Configure storage and file filter
   - Add file size limits

2. **Create Upload Endpoint** (1h)
   - Create `routes/upload.routes.js`
   - Add POST `/api/upload` endpoint
   - Require admin authentication
   - Return file URL

3. **Serve Static Files** (30 min)
   - Add static middleware in `app.js`
   - Test file access via URL

4. **Update Product Endpoints** (1h)
   - Update product form to accept file uploads
   - Test image upload with product creation
   - Test image update

5. **Update Restaurant Endpoint** (30 min)
   - Add logo upload capability
   - Test restaurant logo upload

### Deliverables
- ✅ File upload endpoint working
- ✅ Images accessible via URL
- ✅ Product images uploadable
- ✅ Restaurant logo uploadable

### Testing
```bash
# Test file upload
curl -X POST http://localhost:5000/api/upload \
  -H "Authorization: Bearer <admin_token>" \
  -F "image=@/path/to/image.jpg"

# Test image access
curl http://localhost:5000/uploads/image-123456.jpg
```

---

## Phase 4: Shared UI Components (Week 2 - Days 2-3)

### Goal
Build reusable UI components needed across features

### Tasks

#### Day 2: Core UI Components
1. **Badge Component** (1h)
   - Create `shared/components/Badge.tsx`
   - Add variants (success, warning, danger, info)
   - Add sizes (sm, md, lg)
   - Create CSS module
   - Test with different variants

2. **Select Component** (2h)
   - Create `shared/components/Select.tsx`
   - Add label, error, helper text
   - Add required indicator
   - Create CSS module
   - Test with options

3. **Textarea Component** (1h)
   - Create `shared/components/Textarea.tsx`
   - Add label, error, helper text
   - Add character count (optional)
   - Create CSS module
   - Test with validation

4. **Card Component** (1h)
   - Create `shared/components/Card.tsx`
   - Add header, body, footer slots
   - Create CSS module
   - Test with content

5. **EmptyState Component** (1h)
   - Create `shared/components/EmptyState.tsx`
   - Add icon, title, description, action
   - Create CSS module
   - Test with different content

#### Day 3: Navigation & Data Components
6. **SearchBar Component** (1h)
   - Create `shared/components/SearchBar.tsx`
   - Add search icon
   - Add clear button
   - Add loading state
   - Create CSS module
   - Test with onChange

7. **Pagination Component** (2h)
   - Create `shared/components/Pagination.tsx`
   - Add page numbers
   - Add prev/next buttons
   - Add page size selector
   - Create CSS module
   - Test with different page counts

8. **ConfirmDialog Component** (2h)
   - Create `shared/components/ConfirmDialog.tsx`
   - Extend Modal component
   - Add variants (danger, warning, info)
   - Add confirm/cancel buttons
   - Create CSS module
   - Test with different actions

### Deliverables
- ✅ 8 new shared components created
- ✅ All components styled and tested
- ✅ Components documented with examples

---

## Phase 5: Products Feature (Week 2 - Days 4-5)

### Goal
Complete product browsing and management

### Tasks

#### Day 4: Product Display
1. **ProductCard Component** (2h)
   - Create `features/products/components/ProductCard.tsx`
   - Display image, name, price, category
   - Add "Add to Cart" button
   - Add availability badge
   - Create CSS module
   - Test with product data

2. **ProductGrid Component** (1h)
   - Create `features/products/components/ProductGrid.tsx`
   - Responsive grid layout
   - Use ProductCard
   - Test with multiple products

3. **CategoryFilter Component** (2h)
   - Create `features/products/components/CategoryFilter.tsx`
   - List all categories
   - Highlight active category
   - Add "All" option
   - Create CSS module
   - Test filtering

4. **Update ProductsPage** (2h)
   - Use ProductGrid
   - Add CategoryFilter
   - Add SearchBar
   - Add Pagination
   - Implement filtering logic
   - Test complete flow

#### Day 5: Product Detail & Admin
5. **ProductDetailPage** (2h)
   - Create `features/products/pages/ProductDetailPage.tsx`
   - Display full product info
   - Add quantity selector
   - Add "Add to Cart" button
   - Test with product ID

6. **Admin ProductForm** (3h)
   - Create `features/products/components/ProductForm.tsx`
   - Add all product fields
   - Add image upload
   - Add validation
   - Test create and edit

7. **Admin ProductsPage** (2h)
   - Create `features/products/pages/AdminProductsPage.tsx`
   - List products in table
   - Add search and filter
   - Add edit/delete actions
   - Test CRUD operations

### Deliverables
- ✅ Product browsing working
- ✅ Product search and filter working
- ✅ Product detail page working
- ✅ Admin product management working

### Testing
- Browse products by category
- Search for products
- View product details
- Add product to cart (requires auth)
- Admin: Create new product
- Admin: Edit product
- Admin: Delete product

---

## Phase 6: Cart Feature (Week 3 - Days 1-2)

### Goal
Complete shopping cart functionality

### Tasks

#### Day 1: Cart Components
1. **Create Cart API Service** (1h)
   - Create `services/api/cartApi.ts`
   - Implement all cart methods
   - Test API calls

2. **Create Cart Store** (2h)
   - Update `store/cartStore.ts`
   - Add cart state
   - Add cart actions
   - Integrate with API
   - Test store methods

3. **CartItem Component** (2h)
   - Create `features/cart/components/CartItem.tsx`
   - Display product info
   - Add quantity controls
   - Add remove button
   - Calculate item total
   - Create CSS module
   - Test with cart item

4. **QuantityControl Component** (1h)
   - Create `shared/components/QuantityControl.tsx`
   - Add increment/decrement buttons
   - Add input field
   - Add min/max validation
   - Create CSS module
   - Test with different values

#### Day 2: Cart Page & Integration
5. **CartSummary Component** (1h)
   - Create `features/cart/components/CartSummary.tsx`
   - Display subtotal
   - Display tax (if applicable)
   - Display total
   - Add checkout button
   - Create CSS module

6. **Update CartPage** (2h)
   - Use CartItem for each item
   - Use CartSummary
   - Add empty cart state
   - Add clear cart button
   - Test complete cart flow

7. **Integrate Cart with Products** (2h)
   - Add "Add to Cart" functionality
   - Show success feedback
   - Update cart icon badge
   - Test adding from products page
   - Test adding from product detail

### Deliverables
- ✅ Cart store working
- ✅ Cart page displaying items
- ✅ Quantity updates working
- ✅ Remove item working
- ✅ Clear cart working
- ✅ Add to cart from products working
- ✅ Cart icon shows item count

### Testing
- Add items to cart
- Update quantities
- Remove items
- Clear cart
- Navigate to checkout

---

## Phase 7: Orders Feature (Week 3 - Days 3-5)

### Goal
Complete order placement and management

### Tasks

#### Day 3: Order Components
1. **Create Orders API Service** (1h)
   - Create `services/api/ordersApi.ts`
   - Implement all order methods
   - Test API calls

2. **OrderStatusBadge Component** (1h)
   - Create `features/orders/components/OrderStatusBadge.tsx`
   - Map status to colors
   - Use Badge component
   - Test with different statuses

3. **OrderCard Component** (2h)
   - Create `features/orders/components/OrderCard.tsx`
   - Display order summary
   - Show status badge
   - Show order date and total
   - Add "View Details" button
   - Create CSS module
   - Test with order data

4. **OrderItemsList Component** (1h)
   - Create `features/orders/components/OrderItemsList.tsx`
   - Display order items
   - Show quantities and prices
   - Calculate totals
   - Create CSS module

#### Day 4: Checkout & Order Pages
5. **CheckoutPage** (3h)
   - Create `features/orders/pages/CheckoutPage.tsx`
   - Display cart summary
   - Add order type selector
   - Add delivery address (if delivery)
   - Add notes field
   - Add place order button
   - Handle order creation
   - Redirect to confirmation
   - Test checkout flow

6. **OrderConfirmationPage** (1h)
   - Create `features/orders/pages/OrderConfirmationPage.tsx`
   - Display success message
   - Show order number
   - Show order summary
   - Add "Track Order" button
   - Add "Continue Shopping" button

7. **MyOrdersPage** (2h)
   - Create `features/orders/pages/MyOrdersPage.tsx`
   - List orders with OrderCard
   - Add status filter
   - Add pagination
   - Add empty state
   - Test with multiple orders

#### Day 5: Order Detail & Admin
8. **OrderDetailPage** (2h)
   - Create `features/orders/pages/OrderDetailPage.tsx`
   - Display full order details
   - Show status timeline (optional)
   - Show order items
   - Add cancel button (if pending)
   - Test with order ID

9. **Admin OrdersPage** (3h)
   - Create `features/orders/pages/AdminOrdersPage.tsx`
   - List all orders in table
   - Add status filter
   - Add date filter
   - Add status update dropdown
   - Add pagination
   - Test order management

### Deliverables
- ✅ Checkout flow working
- ✅ Order placement working
- ✅ Order confirmation showing
- ✅ My orders page working
- ✅ Order detail page working
- ✅ Order cancellation working
- ✅ Admin order management working
- ✅ Admin status updates working

### Testing
- Complete checkout process
- View order confirmation
- View order history
- View order details
- Cancel pending order
- Admin: View all orders
- Admin: Filter orders
- Admin: Update order status

---

## Phase 8: User Profile (Week 4 - Day 1)

### Goal
Complete user profile management

### Tasks

1. **Create Users API Service** (30 min)
   - Create `services/api/usersApi.ts`
   - Implement profile methods
   - Test API calls

2. **ProfilePage** (2h)
   - Create `features/auth/pages/ProfilePage.tsx`
   - Display user info
   - Add edit form
   - Add save button
   - Add delete account button
   - Use ConfirmDialog for delete
   - Test profile updates

3. **Update Auth Store** (1h)
   - Add updateProfile action
   - Add deleteAccount action
   - Test store updates

### Deliverables
- ✅ Profile page working
- ✅ Profile updates working
- ✅ Account deletion working

### Testing
- View profile
- Update profile info
- Delete account

---

## Phase 9: Reservations Feature (Week 4 - Days 2-4)

### Goal
Complete table reservation system

### Tasks

#### Day 2: Reservation Components
1. **Create Reservations API Service** (1h)
   - Create `services/api/reservationsApi.ts`
   - Implement all reservation methods
   - Test API calls

2. **Create Tables API Service** (30 min)
   - Create `services/api/tablesApi.ts`
   - Implement table methods
   - Test API calls

3. **AvailabilityChecker Component** (2h)
   - Create `features/reservations/components/AvailabilityChecker.tsx`
   - Add date picker
   - Add time slot selector
   - Add guests input
   - Add check availability button
   - Create CSS module
   - Test availability check

4. **TableCard Component** (1h)
   - Create `features/reservations/components/TableCard.tsx`
   - Display table info
   - Add book button
   - Create CSS module
   - Test with table data

#### Day 3: Reservation Pages
5. **ReservationCard Component** (1h)
   - Create `features/reservations/components/ReservationCard.tsx`
   - Display reservation summary
   - Show status badge
   - Add view details button
   - Add cancel button
   - Create CSS module

6. **ReservationsPage** (3h)
   - Create `features/reservations/pages/ReservationsPage.tsx`
   - Add AvailabilityChecker
   - Display available tables
   - Add booking form
   - Display my reservations
   - Test complete booking flow

7. **ReservationDetailPage** (2h)
   - Create `features/reservations/pages/ReservationDetailPage.tsx`
   - Display full reservation details
   - Show table info
   - Add cancel button
   - Add pre-order button
   - Test with reservation ID

#### Day 4: Admin Reservations & Tables
8. **Admin TablesPage** (2h)
   - Create `features/tables/pages/AdminTablesPage.tsx`
   - List tables
   - Add create table button
   - Add edit/delete actions
   - Test table management

9. **Admin ReservationsPage** (2h)
   - Create `features/reservations/pages/AdminReservationsPage.tsx`
   - List all reservations
   - Add date filter
   - Add status filter
   - Add status update
   - Test reservation management

### Deliverables
- ✅ Availability checking working
- ✅ Table booking working
- ✅ My reservations page working
- ✅ Reservation detail page working
- ✅ Reservation cancellation working
- ✅ Admin table management working
- ✅ Admin reservation management working

### Testing
- Check table availability
- Book a table
- View my reservations
- View reservation details
- Cancel reservation
- Admin: Manage tables
- Admin: Manage reservations
- Admin: Update reservation status

---

## Phase 10: Admin Dashboard (Week 4 - Day 5)

### Goal
Complete admin dashboard and remaining admin features

### Tasks

1. **StatsCard Component** (1h)
   - Create `features/dashboard/components/StatsCard.tsx`
   - Display metric value
   - Display metric label
   - Add icon (optional)
   - Create CSS module

2. **AdminDashboardPage** (3h)
   - Create `features/dashboard/pages/AdminDashboardPage.tsx`
   - Add stats cards (orders, revenue, customers, reservations)
   - Add recent orders list
   - Add today's reservations
   - Add quick actions
   - Test dashboard

3. **Admin UsersPage** (2h)
   - Create `features/users/pages/AdminUsersPage.tsx`
   - List all users
   - Add search
   - Add pagination
   - Test user list

4. **Admin SettingsPage** (1h)
   - Create `features/restaurant/pages/AdminSettingsPage.tsx`
   - Display restaurant info form
   - Add save button
   - Test settings update

### Deliverables
- ✅ Admin dashboard working
- ✅ Admin users page working
- ✅ Admin settings page working

### Testing
- View admin dashboard
- Check statistics
- View recent orders
- View today's reservations
- View all users
- Update restaurant settings

---

## Phase 11: Polish & Testing (Week 5)

### Goal
Add final touches and comprehensive testing

### Tasks

#### Day 1: Error Handling & Loading States
1. Add loading spinners to all async operations
2. Add error messages for failed operations
3. Add success feedback for actions
4. Test error scenarios

#### Day 2: Responsive Design
1. Test all pages on mobile
2. Fix responsive issues
3. Test on tablet
4. Test on different browsers

#### Day 3: Accessibility
1. Add ARIA labels
2. Test keyboard navigation
3. Test with screen reader
4. Fix accessibility issues

#### Day 4: Performance
1. Add code splitting
2. Optimize images
3. Add memoization where needed
4. Test performance

#### Day 5: Final Testing
1. Test all user flows end-to-end
2. Test admin flows
3. Fix bugs
4. Update documentation

### Deliverables
- ✅ All features working smoothly
- ✅ Responsive on all devices
- ✅ Accessible
- ✅ Performant
- ✅ Well-tested

---

## Testing Strategy

### Unit Testing
- Test individual components
- Test utility functions
- Test API services
- Test store actions

### Integration Testing
- Test component interactions
- Test API integration
- Test store integration
- Test routing

### End-to-End Testing
- Test complete user flows
- Test admin flows
- Test error scenarios
- Test edge cases

### Manual Testing Checklist

#### Customer Flow
- [ ] Register account
- [ ] Login
- [ ] Browse products
- [ ] Search products
- [ ] Filter by category
- [ ] View product details
- [ ] Add to cart
- [ ] Update cart quantities
- [ ] Remove from cart
- [ ] Checkout
- [ ] View order confirmation
- [ ] View order history
- [ ] View order details
- [ ] Cancel pending order
- [ ] Check table availability
- [ ] Book reservation
- [ ] View my reservations
- [ ] Cancel reservation
- [ ] Update profile
- [ ] Logout

#### Admin Flow
- [ ] Admin login
- [ ] View dashboard
- [ ] Create product
- [ ] Edit product
- [ ] Delete product
- [ ] View all orders
- [ ] Filter orders
- [ ] Update order status
- [ ] View all reservations
- [ ] Update reservation status
- [ ] Create table
- [ ] Edit table
- [ ] Delete table
- [ ] View all users
- [ ] Update restaurant settings

---

## Deployment Checklist

### Backend
- [ ] Environment variables configured
- [ ] Database connection secure
- [ ] CORS configured for production
- [ ] Rate limiting enabled
- [ ] Logging configured
- [ ] Error handling working
- [ ] File uploads working
- [ ] API documentation accessible

### Frontend
- [ ] Build successful
- [ ] Environment variables configured
- [ ] API base URL correct
- [ ] Assets optimized
- [ ] Code split properly
- [ ] Error boundaries working
- [ ] Loading states working

### Testing
- [ ] All features tested
- [ ] No console errors
- [ ] No broken links
- [ ] Forms validated
- [ ] Auth working
- [ ] Protected routes working

---

**End of Implementation Sequence**
