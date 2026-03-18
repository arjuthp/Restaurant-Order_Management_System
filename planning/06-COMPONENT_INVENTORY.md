# Component Inventory
# Reusable Components Needed

---

## 🧩 SHARED COMPONENTS (Already Created in client/)

### Layout Components
1. ✅ **MainLayout** - Main app layout with header and outlet
2. ✅ **Header** - Navigation bar with logo, menu, cart icon, user menu
3. ⚠️ **Footer** - Footer with links and contact info (NOT YET CREATED)
4. ⚠️ **Sidebar** - Admin sidebar navigation (NOT YET CREATED)

### UI Components
5. ✅ **Button** - Reusable button with variants (primary, secondary, danger, ghost)
6. ✅ **Input** - Form input with label, error, helper text
7. ✅ **Modal** - Accessible modal dialog
8. ✅ **LoadingSpinner** - Loading indicator
9. ✅ **ErrorFallback** - Error boundary fallback UI

### Missing Shared Components (Need to Create)
10. ❌ **Select** - Dropdown select component
11. ❌ **Textarea** - Multi-line text input
12. ❌ **Checkbox** - Checkbox input
13. ❌ **Radio** - Radio button input
14. ❌ **Badge** - Status badge (for order/reservation status)
15. ❌ **Card** - Generic card container
16. ❌ **Table** - Data table component
17. ❌ **Pagination** - Pagination controls
18. ❌ **SearchBar** - Search input with icon
19. ❌ **DatePicker** - Date selection input
20. ❌ **TimePicker** - Time selection input
21. ❌ **ImageUpload** - Image upload with preview
22. ❌ **ConfirmDialog** - Confirmation modal
23. ❌ **Toast/Notification** - Success/error notifications
24. ❌ **EmptyState** - Empty list placeholder
25. ❌ **Tabs** - Tab navigation component
26. ❌ **Dropdown** - Dropdown menu
27. ❌ **Avatar** - User avatar component

---

## 🎯 FEATURE-SPECIFIC COMPONENTS

### Products Feature
28. ❌ **ProductCard** - Product display card
29. ❌ **ProductGrid** - Grid layout for products
30. ❌ **ProductList** - List layout for products
31. ❌ **ProductDetail** - Product detail view
32. ❌ **CategoryFilter** - Category filter sidebar/tabs
33. ❌ **ProductSearch** - Product search bar
34. ❌ **AddToCartButton** - Add to cart with quantity

### Cart Feature
35. ❌ **CartItem** - Single cart item row
36. ❌ **CartSummary** - Cart totals summary
37. ❌ **QuantityControl** - Increment/decrement buttons
38. ❌ **PromoCodeInput** - Promo code input field (when implemented)
39. ❌ **EmptyCart** - Empty cart state

### Orders Feature
40. ❌ **OrderCard** - Order summary card
41. ❌ **OrderList** - List of orders
42. ❌ **OrderDetail** - Full order details
43. ❌ **OrderStatusBadge** - Status badge with colors
44. ❌ **OrderTimeline** - Status progression timeline
45. ❌ **OrderItemsList** - List of items in order
46. ❌ **CheckoutForm** - Order placement form

### Reservations Feature
47. ❌ **AvailabilityChecker** - Date/time/guests form
48. ❌ **TableCard** - Available table card
49. ❌ **ReservationCard** - Reservation summary card
50. ❌ **ReservationList** - List of reservations
51. ❌ **ReservationDetail** - Full reservation details
52. ❌ **ReservationForm** - Booking form
53. ❌ **ReservationStatusBadge** - Status badge

### Auth Feature
54. ✅ **LoginForm** - Login form (ALREADY CREATED)
55. ✅ **RegisterForm** - Registration form (ALREADY CREATED)
56. ❌ **ForgotPasswordForm** - Password reset form (if implemented)

### Admin Feature
57. ❌ **AdminSidebar** - Admin navigation sidebar
58. ❌ **StatsCard** - Dashboard statistics card
59. ❌ **ProductForm** - Product create/edit form
60. ❌ **TableForm** - Table create/edit form
61. ❌ **OrdersTable** - Admin orders table
62. ❌ **ReservationsTable** - Admin reservations table
63. ❌ **UsersTable** - Admin users table
64. ❌ **StatusUpdateDropdown** - Status update control
65. ❌ **RestaurantSettingsForm** - Restaurant info form

---

## 📊 COMPONENT PRIORITY

### 🔴 CRITICAL (Build First)
- Button ✅
- Input ✅
- Modal ✅
- LoadingSpinner ✅
- Header ✅
- MainLayout ✅
- ProductCard
- CartItem
- OrderCard
- Badge
- EmptyState

### ⚠️ IMPORTANT (Build Second)
- Select
- Textarea
- Card
- Table
- Pagination
- SearchBar
- ProductGrid
- CartSummary
- OrderList
- ReservationCard
- AdminSidebar

### 💡 OPTIONAL (Build Later)
- DatePicker
- TimePicker
- ImageUpload
- Toast/Notification
- Tabs
- Dropdown
- Avatar
- OrderTimeline
- Charts (for analytics)

---


## 🎨 COMPONENT DESIGN SPECIFICATIONS

### Badge Component
```typescript
interface BadgeProps {
  variant: 'success' | 'warning' | 'danger' | 'info' | 'default';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

// Usage:
<Badge variant="success">Confirmed</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="danger">Cancelled</Badge>
```

**Status Color Mapping:**
- `pending` → warning (yellow)
- `confirmed` → info (blue)
- `preparing` → info (blue)
- `delivered` → success (green)
- `completed` → success (green)
- `cancelled` → danger (red)
- `no-show` → danger (red)

---

### Select Component
```typescript
interface SelectProps {
  label?: string;
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
}

// Usage:
<Select
  label="Category"
  options={[
    { value: 'Nepali', label: 'Nepali' },
    { value: 'Fusion', label: 'Fusion' }
  ]}
  value={category}
  onChange={setCategory}
/>
```

---

### Table Component
```typescript
interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
  sortable?: boolean;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  loading?: boolean;
  emptyMessage?: string;
}

// Usage:
<Table
  data={orders}
  columns={[
    { key: 'id', header: 'Order #' },
    { key: 'date', header: 'Date', render: (order) => formatDate(order.createdAt) },
    { key: 'status', header: 'Status', render: (order) => <Badge>{order.status}</Badge> }
  ]}
  onRowClick={(order) => navigate(`/orders/${order._id}`)}
/>
```

---

### Pagination Component
```typescript
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
  totalItems?: number;
}

// Usage:
<Pagination
  currentPage={page}
  totalPages={10}
  onPageChange={setPage}
  totalItems={100}
/>
```

---

### ProductCard Component
```typescript
interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onClick?: (product: Product) => void;
}

// Usage:
<ProductCard
  product={product}
  onAddToCart={handleAddToCart}
  onClick={() => navigate(`/products/${product._id}`)}
/>
```

---

### CartItem Component
```typescript
interface CartItemProps {
  item: CartItem;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

// Usage:
<CartItem
  item={cartItem}
  onUpdateQuantity={handleUpdateQuantity}
  onRemove={handleRemove}
/>
```

---

### EmptyState Component
```typescript
interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Usage:
<EmptyState
  icon={<ShoppingCartIcon />}
  title="Your cart is empty"
  description="Add some delicious items to get started!"
  action={{
    label: "Browse Menu",
    onClick: () => navigate('/menu')
  }}
/>
```

---

### SearchBar Component
```typescript
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSearch?: () => void;
  loading?: boolean;
}

// Usage:
<SearchBar
  value={searchQuery}
  onChange={setSearchQuery}
  placeholder="Search products..."
  onSearch={handleSearch}
/>
```

---

### ConfirmDialog Component
```typescript
interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

// Usage:
<ConfirmDialog
  isOpen={showConfirm}
  onClose={() => setShowConfirm(false)}
  onConfirm={handleDelete}
  title="Delete Product"
  message="Are you sure you want to delete this product? This action cannot be undone."
  confirmText="Delete"
  variant="danger"
/>
```

---

## 🎯 COMPONENT DEVELOPMENT ORDER

### Sprint 1: Core UI Components (Week 1)
1. Badge
2. Select
3. Textarea
4. Card
5. EmptyState
6. SearchBar
7. Pagination

### Sprint 2: Product Components (Week 1-2)
8. ProductCard
9. ProductGrid
10. CategoryFilter
11. AddToCartButton

### Sprint 3: Cart & Orders (Week 2)
12. CartItem
13. CartSummary
14. QuantityControl
15. OrderCard
16. OrderStatusBadge
17. CheckoutForm

### Sprint 4: Reservations (Week 2-3)
18. AvailabilityChecker
19. TableCard
20. ReservationCard
21. ReservationForm

### Sprint 5: Admin Components (Week 3)
22. AdminSidebar
23. StatsCard
24. Table (data table)
25. StatusUpdateDropdown
26. ProductForm
27. TableForm

### Sprint 6: Advanced Features (Week 4)
28. DatePicker
29. TimePicker
30. ImageUpload
31. Toast/Notification
32. ConfirmDialog
33. OrderTimeline

---

