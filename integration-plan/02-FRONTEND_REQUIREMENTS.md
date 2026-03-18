# G. Frontend Screens/Components Required

## Overview
Based on backend capabilities, we need to build:
- **24 pages** (public, customer, admin)
- **65+ components** (shared, feature-specific)
- **2 Zustand stores** (auth, cart)
- **9 API service modules**

---

## Public Pages (No Authentication)

### 1. Home Page `/`
**Purpose:** Landing page with restaurant overview

**Components:**
- HeroSection
- FeaturedProducts (carousel)
- AboutSection
- ContactInfo
- CTAButtons (Order Now, Reserve Table)

**API Calls:**
- `GET /api/restaurant`
- `GET /api/products` (featured/limited)

**State:**
- Restaurant info (global)
- Featured products (local)

---

### 2. Menu/Products Page `/menu`
**Purpose:** Browse all menu items

**Components:**
- CategoryFilter (sidebar or tabs)
- ProductGrid
- ProductCard
- SearchBar
- SortDropdown
- Pagination

**API Calls:**
- `GET /api/products?page=1&limit=12&category=Nepali&search=momo`

**State:**
- Products list (local)
- Filters (category, search, sort)
- Pagination state

**User Actions:**
- Filter by category
- Search products
- Sort by price/name
- View product details
- Add to cart (requires login)

---

### 3. Product Detail Page `/products/:id`
**Purpose:** View single product details

**Components:**
- ProductImage
- ProductInfo (name, description, price, category)
- AvailabilityBadge
- QuantitySelector
- AddToCartButton

**API Calls:**
- `GET /api/products/:id`

**State:**
- Product details (local)
- Selected quantity (local)

---

### 4. Auth Page `/auth`
**Purpose:** Login and registration

**Components:**
- LoginForm ✅ (exists)
- RegisterForm ✅ (exists)
- FormToggle
- ValidationErrors

**API Calls:**
- `POST /api/auth/login`
- `POST /api/auth/register`

**State:**
- Auth state (global - authStore)
- Form data (local)
- Loading/error states

---

### 5. About Page `/about`
**Purpose:** Restaurant information

**Components:**
- RestaurantInfo
- AddressMap (optional)
- ContactDetails
- OpeningHours

**API Calls:**
- `GET /api/restaurant`

**State:**
- Restaurant info (global)

---

## Customer Pages (Authentication Required)

### 6. Cart Page `/cart`
**Purpose:** View and manage shopping cart

**Components:**
- CartItemsList
- CartItem (with quantity controls)
- QuantityControl
- RemoveItemButton
- CartSummary (subtotal, tax, total)
- PromoCodeInput (when implemented)
- CheckoutButton
- EmptyCart (empty state)

**API Calls:**
- `GET /api/cart`
- `PATCH /api/cart/items/:productId`
- `DELETE /api/cart/items/:productId`
- `DELETE /api/cart`

**State:**
- Cart items (global - cartStore)
- Loading states (local)

---

### 7. Checkout Page `/checkout`
**Purpose:** Place order from cart

**Components:**
- OrderSummary
- OrderTypeSelector (dine-in, takeout, delivery)
- DeliveryAddressInput
- PickupTimeSelector
- NotesTextarea
- TotalCalculation
- PlaceOrderButton

**API Calls:**
- `GET /api/cart`
- `POST /api/orders`

**State:**
- Cart items (global)
- Order form data (local)

---

### 8. Order Confirmation Page `/orders/:id/confirmation`
**Purpose:** Order placed successfully

**Components:**
- SuccessMessage
- OrderNumber
- OrderSummary
- EstimatedTime
- TrackOrderButton
- ContinueShoppingButton

**API Calls:**
- `GET /api/orders/:id`

---

### 9. My Orders Page `/orders`
**Purpose:** View order history

**Components:**
- OrdersList
- OrderCard (number, date, status, total)
- OrderStatusBadge
- StatusFilter
- DateRangeFilter
- Pagination
- EmptyState

**API Calls:**
- `GET /api/orders?page=1&status=pending`

**State:**
- Orders list (local)
- Filters (local)
- Pagination (local)

---

### 10. Order Detail Page `/orders/:id`
**Purpose:** View single order details

**Components:**
- OrderHeader (number, date, status)
- OrderTimeline (status progression)
- OrderItemsList
- OrderTotals
- DeliveryInfo
- CancelOrderButton (if pending)

**API Calls:**
- `GET /api/orders/:id`
- `DELETE /api/orders/:id` (cancel)

---

### 11. Reservations Page `/reservations`
**Purpose:** Book tables and view reservations

**Components:**
- AvailabilityChecker (date, time, guests form)
- AvailableTablesList
- TableCard
- MyReservationsList
- ReservationCard
- CancelReservationButton

**API Calls:**
- `GET /api/reservations/availability?date=...&timeSlot=...&numberOfGuests=...`
- `POST /api/reservations`
- `GET /api/reservations/my-reservations`
- `PATCH /api/reservations/:id/cancel`

**State:**
- Available tables (local)
- My reservations (local)
- Booking form (local)

---

### 12. Reservation Detail Page `/reservations/:id`
**Purpose:** View single reservation

**Components:**
- ReservationDetails
- ReservationStatusBadge
- TableInfo
- SpecialRequests
- PreOrderSection
- CancelButton
- CreatePreOrderButton

**API Calls:**
- `GET /api/reservations/:id`
- `POST /api/orders/pre-order/:reservationId`

---

### 13. Profile Page `/profile`
**Purpose:** Manage user profile

**Components:**
- ProfileForm (name, email, phone, address)
- SaveButton
- ChangePasswordSection (if implemented)
- DeleteAccountButton
- ConfirmDialog

**API Calls:**
- `GET /api/users/me`
- `PATCH /api/users/me`
- `DELETE /api/users/me`

**State:**
- User profile (global - authStore)
- Form data (local)

---

## Admin Pages (Admin Authentication Required)

### 14. Admin Dashboard `/admin`
**Purpose:** Operations overview

**Components:**
- StatsCards (orders, revenue, customers, reservations)
- RecentOrdersList
- TodaysReservations
- QuickActions
- SalesChart (optional)

**API Calls:**
- `GET /api/orders/admin/all?limit=10`
- `GET /api/reservations/admin/all?date=today`
- `GET /api/users` (count)

---

### 15. Admin Products Page `/admin/products`
**Purpose:** Manage menu items

**Components:**
- ProductsTable
- AddProductButton
- ProductRow (with edit/delete actions)
- SearchBar
- CategoryFilter
- AvailabilityToggle
- Pagination

**API Calls:**
- `GET /api/products?page=1&limit=20`
- `DELETE /api/products/:id`

---

### 16. Admin Product Form `/admin/products/new` or `/admin/products/:id/edit`
**Purpose:** Create/edit product

**Components:**
- ProductForm
- ImageUpload
- CategorySelect
- AvailabilityCheckbox
- SaveButton
- CancelButton

**API Calls:**
- `POST /api/products`
- `PATCH /api/products/:id`
- `POST /api/upload` (if implemented)

---

### 17. Admin Orders Page `/admin/orders`
**Purpose:** Manage all orders

**Components:**
- OrdersTable
- OrderRow (with status update)
- StatusFilter
- DateRangeFilter
- SearchBar
- StatusUpdateDropdown
- Pagination

**API Calls:**
- `GET /api/orders/admin/all?page=1&status=...`
- `PATCH /api/orders/:id/status`

---

### 18. Admin Order Detail Page `/admin/orders/:id`
**Purpose:** View and manage order

**Components:**
- OrderDetails
- CustomerInfo
- OrderItemsList
- StatusTimeline
- StatusUpdateDropdown
- UpdateButton

**API Calls:**
- `GET /api/orders/:id`
- `PATCH /api/orders/:id/status`

---

### 19. Admin Tables Page `/admin/tables`
**Purpose:** Manage restaurant tables

**Components:**
- TablesGrid
- AddTableButton
- TableCard
- EditButton
- DeleteButton
- StatusToggle

**API Calls:**
- `GET /api/tables`
- `POST /api/tables`
- `PUT /api/tables/:id`
- `DELETE /api/tables/:id`

---

### 20. Admin Table Form `/admin/tables/new` or `/admin/tables/:id/edit`
**Purpose:** Create/edit table

**Components:**
- TableForm
- SaveButton
- CancelButton

**API Calls:**
- `POST /api/tables`
- `PUT /api/tables/:id`

---

### 21. Admin Reservations Page `/admin/reservations`
**Purpose:** Manage all reservations

**Components:**
- ReservationsTable or CalendarView
- ReservationRow
- StatusFilter
- DateFilter
- StatusUpdateDropdown
- Pagination

**API Calls:**
- `GET /api/reservations/admin/all?date=...&status=...`
- `PATCH /api/reservations/admin/:id/status`

---

### 22. Admin Users Page `/admin/users`
**Purpose:** View all customers

**Components:**
- UsersTable
- UserRow
- SearchBar
- RoleFilter
- Pagination

**API Calls:**
- `GET /api/users?page=1&limit=20`

---

### 23. Admin Settings Page `/admin/settings`
**Purpose:** Manage restaurant settings

**Components:**
- RestaurantSettingsForm
- LogoUpload (if implemented)
- SaveButton

**API Calls:**
- `GET /api/restaurant`
- `PATCH /api/restaurant`

---

### 24. Admin Promo Codes Page `/admin/promo-codes` (Future)
**Purpose:** Manage promotional codes

**Components:**
- PromoCodesTable
- AddPromoCodeButton
- PromoCodeRow
- EditButton
- DeleteButton
- ActiveToggle

**API Calls:**
- (To be implemented)

---


## Shared Components Inventory

### Already Created ✅
1. Button - Reusable button with variants
2. Input - Form input with label/error
3. Modal - Accessible modal dialog
4. LoadingSpinner - Loading indicator
5. ErrorFallback - Error boundary UI
6. MainLayout - Main app layout
7. Header - Navigation bar
8. LoginForm - Login form
9. RegisterForm - Registration form

### Need to Create ❌

#### Core UI Components (Priority: Critical)
10. Badge - Status badges (order/reservation status)
11. Select - Dropdown select
12. Textarea - Multi-line text input
13. Checkbox - Checkbox input
14. Card - Generic card container
15. EmptyState - Empty list placeholder
16. SearchBar - Search input with icon
17. Pagination - Pagination controls
18. ConfirmDialog - Confirmation modal

#### Product Components
19. ProductCard - Product display card
20. ProductGrid - Grid layout for products
21. ProductDetail - Product detail view
22. CategoryFilter - Category filter sidebar/tabs
23. AddToCartButton - Add to cart with quantity

#### Cart Components
24. CartItem - Single cart item row
25. CartSummary - Cart totals summary
26. QuantityControl - Increment/decrement buttons
27. PromoCodeInput - Promo code field (future)
28. EmptyCart - Empty cart state

#### Order Components
29. OrderCard - Order summary card
30. OrderList - List of orders
31. OrderDetail - Full order details
32. OrderStatusBadge - Status badge with colors
33. OrderTimeline - Status progression timeline
34. OrderItemsList - List of items in order
35. CheckoutForm - Order placement form

#### Reservation Components
36. AvailabilityChecker - Date/time/guests form
37. TableCard - Available table card
38. ReservationCard - Reservation summary card
39. ReservationList - List of reservations
40. ReservationDetail - Full reservation details
41. ReservationForm - Booking form
42. ReservationStatusBadge - Status badge

#### Admin Components
43. AdminSidebar - Admin navigation sidebar
44. StatsCard - Dashboard statistics card
45. ProductForm - Product create/edit form
46. TableForm - Table create/edit form
47. OrdersTable - Admin orders table
48. ReservationsTable - Admin reservations table
49. UsersTable - Admin users table
50. StatusUpdateDropdown - Status update control
51. RestaurantSettingsForm - Restaurant info form
52. DataTable - Generic data table component

#### Advanced Components (Optional)
53. DatePicker - Date selection input
54. TimePicker - Time selection input
55. ImageUpload - Image upload with preview
56. Toast/Notification - Success/error notifications
57. Tabs - Tab navigation component
58. Dropdown - Dropdown menu
59. Avatar - User avatar component
60. Footer - Footer with links

---

## Component Priority Matrix

### 🔴 Sprint 1: Core UI (Week 1)
Must build before any features:
- Badge
- Select
- Textarea
- Card
- EmptyState
- SearchBar
- Pagination
- ConfirmDialog

### 🔴 Sprint 2: Products & Cart (Week 1-2)
For customer shopping flow:
- ProductCard
- ProductGrid
- CategoryFilter
- AddToCartButton
- CartItem
- CartSummary
- QuantityControl
- CheckoutForm

### 🔴 Sprint 3: Orders (Week 2)
For order management:
- OrderCard
- OrderList
- OrderStatusBadge
- OrderDetail
- OrderItemsList
- OrderTimeline

### ⚠️ Sprint 4: Reservations (Week 2-3)
For table booking:
- AvailabilityChecker
- TableCard
- ReservationCard
- ReservationForm
- ReservationList
- ReservationDetail

### ⚠️ Sprint 5: Admin (Week 3)
For admin management:
- AdminSidebar
- StatsCard
- DataTable
- ProductForm
- TableForm
- StatusUpdateDropdown
- OrdersTable
- ReservationsTable
- UsersTable

### 💡 Sprint 6: Polish (Week 4)
Nice-to-have enhancements:
- DatePicker
- TimePicker
- ImageUpload
- Toast/Notification
- Tabs
- Dropdown
- Avatar
- Footer

---

## State Management Plan

### Zustand Stores

#### authStore
```typescript
interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}
```

#### cartStore
```typescript
interface CartState {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  fetchCart: () => Promise<void>;
  addItem: (productId: string, quantity: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}
```

### Local State
- Form data (controlled inputs)
- Filters and search queries
- Pagination state
- Loading and error states
- Modal open/close states
- Temporary UI state

---

## API Service Modules

### services/api/apiClient.ts ✅
- Axios instance with base URL
- Request/response interceptors
- Token injection
- Auto token refresh on 401

### services/api/authApi.ts ✅
- login()
- register()
- adminLogin()
- refreshToken()
- logout()

### services/api/productsApi.ts ✅
- getProducts(params)
- getProduct(id)
- createProduct(data) - admin
- updateProduct(id, data) - admin
- deleteProduct(id) - admin

### services/api/cartApi.ts ❌
- getCart()
- addItem(productId, quantity)
- updateQuantity(productId, quantity)
- removeItem(productId)
- clearCart()

### services/api/ordersApi.ts ❌
- createOrder(data)
- createPreOrder(reservationId, data)
- getMyOrders(params)
- getOrder(id)
- cancelOrder(id)
- getAllOrders(params) - admin
- updateOrderStatus(id, status) - admin

### services/api/reservationsApi.ts ❌
- checkAvailability(params)
- createReservation(data)
- getMyReservations()
- getReservation(id)
- cancelReservation(id)
- getAllReservations(params) - admin
- updateReservationStatus(id, status) - admin

### services/api/tablesApi.ts ❌
- getTables()
- getTable(id)
- createTable(data) - admin
- updateTable(id, data) - admin
- deleteTable(id) - admin

### services/api/usersApi.ts ❌
- getMyProfile()
- updateMyProfile(data)
- deleteMyAccount()
- getAllUsers(params) - admin
- getUser(id) - admin

### services/api/restaurantApi.ts ❌
- getRestaurantInfo()
- updateRestaurantInfo(data) - admin

---

## Routing Structure

```typescript
// Public routes
/                          → HomePage
/menu                      → ProductsPage
/products/:id              → ProductDetailPage
/auth                      → AuthPage
/about                     → AboutPage

// Customer routes (protected)
/cart                      → CartPage
/checkout                  → CheckoutPage
/orders                    → MyOrdersPage
/orders/:id                → OrderDetailPage
/orders/:id/confirmation   → OrderConfirmationPage
/reservations              → ReservationsPage
/reservations/:id          → ReservationDetailPage
/profile                   → ProfilePage

// Admin routes (protected, admin only)
/admin                     → AdminDashboardPage
/admin/products            → AdminProductsPage
/admin/products/new        → AdminProductFormPage
/admin/products/:id/edit   → AdminProductFormPage
/admin/orders              → AdminOrdersPage
/admin/orders/:id          → AdminOrderDetailPage
/admin/tables              → AdminTablesPage
/admin/tables/new          → AdminTableFormPage
/admin/tables/:id/edit     → AdminTableFormPage
/admin/reservations        → AdminReservationsPage
/admin/users               → AdminUsersPage
/admin/settings            → AdminSettingsPage
/admin/promo-codes         → AdminPromoCodesPage (future)

// Error routes
/404                       → NotFoundPage
/403                       → UnauthorizedPage
```

---

## TypeScript Interfaces

### User
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  phone?: string;
  address?: string;
}
```

### Product
```typescript
interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  category: 'Nepali' | 'Fusion' | 'Western' | 'Snacks' | 'Desserts' | 'Drinks';
  image_url?: string;
  is_available: boolean;
  is_deleted: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### CartItem
```typescript
interface CartItem {
  product_id: Product;
  quantity: number;
  unit_price: number;
}

interface Cart {
  _id: string;
  user_id: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}
```

### Order
```typescript
interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
}

interface Order {
  _id: string;
  user_id: string | User;
  items: OrderItem[];
  orderType?: 'dine-in' | 'takeout' | 'delivery';
  table?: string;
  reservation?: string;
  deliveryAddress?: string;
  deliveryFee?: number;
  pickupTime?: string;
  subtotal: number;
  promoCode?: string;
  discountAmount?: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'delivered' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Table
```typescript
interface Table {
  _id: string;
  tableNumber: number;
  capacity: number;
  location?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}
```

### Reservation
```typescript
interface Reservation {
  _id: string;
  user: string | User;
  table: string | Table;
  date: string;
  timeSlot: string;
  numberOfGuests: number;
  duration: number;
  endTime: string;
  preOrder?: string;
  hasPreOrder: boolean;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  specialRequests?: string;
  contactPhone: string;
  createdAt: string;
  updatedAt: string;
}
```

### Restaurant
```typescript
interface Restaurant {
  _id: string;
  name: string;
  description?: string;
  address: string;
  phone: string;
  opening_hours?: string;
  createdAt: string;
  updatedAt: string;
}
```

---

## Error Handling Strategy

### API Error Handling
```typescript
try {
  const response = await api.get('/endpoint');
  return response.data;
} catch (error) {
  if (error.response) {
    // Server responded with error
    throw new Error(error.response.data.message || 'Server error');
  } else if (error.request) {
    // No response received
    throw new Error('Network error. Please check your connection.');
  } else {
    // Request setup error
    throw new Error('An unexpected error occurred.');
  }
}
```

### Component Error Handling
- Use Error Boundaries for component errors
- Show user-friendly error messages
- Provide retry mechanisms
- Log errors for debugging

### Form Validation
- Client-side validation before API calls
- Display field-level errors
- Disable submit during validation
- Show success feedback

---

## Accessibility Requirements

### ARIA Labels
- All interactive elements have labels
- Form inputs have associated labels
- Buttons have descriptive text

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Logical tab order
- Focus indicators visible
- Escape key closes modals

### Semantic HTML
- Use proper heading hierarchy
- Use semantic elements (nav, main, article, etc.)
- Use lists for list content
- Use buttons for actions, links for navigation

### Screen Reader Support
- Alt text for images
- ARIA live regions for dynamic content
- Status messages announced
- Error messages associated with fields

---

## Performance Optimizations

### Code Splitting
- Route-based lazy loading
- Component lazy loading for heavy components
- Dynamic imports for admin features

### Memoization
- useMemo for expensive calculations
- useCallback for event handlers
- React.memo for pure components

### API Optimization
- Debounce search inputs
- Cache frequently accessed data
- Pagination for large lists
- Optimistic UI updates

### Bundle Optimization
- Tree shaking
- Minification
- Compression
- CDN for static assets

---

**End of Frontend Requirements**
