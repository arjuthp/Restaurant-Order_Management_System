# Admin Routes Audit - Frontend vs Backend

## Summary
This document compares backend admin routes with frontend API implementations to identify mismatches.

**Status**: The admin dashboard has links to Tables and Reservations pages that don't exist, and several API methods are missing.

---

## ✅ CORRECTLY IMPLEMENTED

### Orders
- **Backend**: `GET /orders/admin/all` - Get all orders (admin)
- **Frontend**: `ordersApi.getAllOrders()` ✅ Correct
- **Page**: `/admin/orders` - AdminOrdersPage ✅ Exists

- **Backend**: `GET /orders/admin/:id` - Get order by ID (admin)  
- **Frontend**: `ordersApi.getOrderByIdAdmin()` ✅ Fixed
- **Page**: `/admin/orders/:id` - AdminOrderDetailPage ✅ Exists

- **Backend**: `PATCH /orders/:id/status` - Update order status (admin)
- **Frontend**: `ordersApi.updateOrderStatus()` ✅ Correct

### Products
- **Backend**: All product routes (GET, POST, PATCH, DELETE)
- **Frontend**: `productsApi` ✅ All methods implemented
- **Page**: `/admin/products` - AdminProductsPage ✅ Exists

---

## ❌ BROKEN LINKS IN ADMIN DASHBOARD

The `AdminDashboardPage` has links to pages that don't exist:

1. **Tables Link**: `/admin/tables` → ❌ No route defined, no page exists
2. **Reservations Link**: `/admin/reservations` → ❌ No route defined, no page exists

---

## ⚠️ MISSING IMPLEMENTATIONS

### 1. Users Management (Admin)
**Backend Routes:**
- `GET /users` - Get all users (admin only)
- `GET /users/:id` - Get user by ID (admin only)

**Frontend Status:**
- ❌ API: `usersApi.ts` only has customer methods (`getMyProfile`, `updateMyProfile`)
- ❌ Page: No admin users page exists
- ❌ Route: No `/admin/users` route

**Required Actions:**
```typescript
// Add to usersApi.ts:
getAllUsers: async (): Promise<User[]>
getUserById: async (userId: string): Promise<User>
```

---

### 2. Reservations Management (Admin)
**Backend Routes:**
- `GET /reservations/admin/all` - Get all reservations (admin)
- `PATCH /reservations/admin/:id/status` - Update reservation status (admin)

**Frontend Status:**
- ❌ API: No `reservationsApi.ts` file exists
- ❌ Page: No admin reservations page exists  
- ❌ Route: No `/admin/reservations` route
- ⚠️ Dashboard has broken link to `/admin/reservations`

**Required Actions:**
1. Create `client/src/services/api/reservationsApi.ts`
2. Create `client/src/features/admin/pages/AdminReservationsPage.tsx`
3. Add route in `AppRouter.tsx`
4. Implement methods:
```typescript
getAllReservations: async (): Promise<Reservation[]>
updateReservationStatus: async (id: string, status: string): Promise<Reservation>
checkAvailability: async (params): Promise<AvailabilityData>
```

---

### 3. Tables Management (Admin)
**Backend Routes:**
- `POST /tables` - Create table (admin only)
- `PUT /tables/:id` - Update table (admin only)
- `DELETE /tables/:id` - Delete table (admin only)
- `GET /tables` - Get all tables (public)
- `GET /tables/:id` - Get table by ID (public)

**Frontend Status:**
- ❌ API: No `tablesApi.ts` file exists
- ❌ Page: No admin tables page exists
- ❌ Route: No `/admin/tables` route
- ⚠️ Dashboard has broken link to `/admin/tables`

**Required Actions:**
1. Create `client/src/services/api/tablesApi.ts`
2. Create `client/src/features/admin/pages/AdminTablesPage.tsx`
3. Add route in `AppRouter.tsx`
4. Implement methods:
```typescript
getAllTables: async (): Promise<Table[]>
getTableById: async (id: string): Promise<Table>
createTable: async (data: CreateTableData): Promise<Table>
updateTable: async (id: string, data: UpdateTableData): Promise<Table>
deleteTable: async (id: string): Promise<void>
```

---

### 4. Restaurant Info Management (Admin)
**Backend Routes:**
- `GET /restaurant` - Get restaurant info (public)
- `PATCH /restaurant` - Update restaurant info (admin only)

**Frontend Status:**
- ❌ API: No `restaurantApi.ts` file exists
- ❌ Page: No restaurant settings page exists
- ❌ Route: No `/admin/settings` route

**Required Actions:**
1. Create `client/src/services/api/restaurantApi.ts`
2. Create `client/src/features/admin/pages/AdminSettingsPage.tsx` (optional)
3. Implement methods:
```typescript
getRestaurantInfo: async (): Promise<Restaurant>
updateRestaurantInfo: async (data: UpdateRestaurantData): Promise<Restaurant>
```

---

## 🎯 PRIORITY FIXES

### Critical (Broken Links)
1. ✅ Fix order detail page to use admin endpoint (DONE)
2. ❌ Remove or fix broken Tables link in dashboard
3. ❌ Remove or fix broken Reservations link in dashboard

### High Priority (Core Admin Features)
4. Create Tables API + Page + Route
5. Create Reservations API + Page + Route

### Medium Priority (Nice to Have)
6. Create Users API for admin user management
7. Create Restaurant Settings API + Page

### Low Priority (Future Enhancement)
8. Add admin dashboard statistics
9. Add bulk operations

---

## 📋 CURRENT ADMIN ROUTES

```typescript
// Defined in AppRouter.tsx:
/admin/login          ✅ AdminLoginPage
/admin/dashboard      ✅ AdminDashboardPage
/admin/products       ✅ AdminProductsPage
/admin/orders         ✅ AdminOrdersPage
/admin/orders/:id     ✅ AdminOrderDetailPage

// Missing but linked from dashboard:
/admin/tables         ❌ NOT DEFINED
/admin/reservations   ❌ NOT DEFINED
```
