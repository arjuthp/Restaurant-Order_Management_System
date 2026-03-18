# API Contract Summary
# Complete Endpoint Inventory

---

## 📡 AUTHENTICATION ENDPOINTS

### POST /api/auth/register
**Purpose:** Register new customer account  
**Auth:** None  
**Request:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "customer|admin" (optional),
  "phone": "string" (optional),
  "address": "string" (optional)
}
```
**Response:** 201
```json
{
  "accessToken": "jwt_string",
  "refreshToken": "jwt_string",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "customer|admin",
    "phone": "string|null",
    "address": "string|null"
  }
}
```

---

### POST /api/auth/login
**Purpose:** Customer login  
**Auth:** None  
**Request:**
```json
{
  "email": "string",
  "password": "string"
}
```
**Response:** 200 (same as register)

---

### POST /api/auth/admin/login
**Purpose:** Admin login  
**Auth:** None  
**Request:** (same as login)  
**Response:** 200 (same as register, but user.role must be 'admin')

---

### POST /api/auth/refresh
**Purpose:** Refresh access token  
**Auth:** None  
**Request:**
```json
{
  "refreshToken": "string"
}
```
**Response:** 200
```json
{
  "accessToken": "new_jwt_string"
}
```

---

### POST /api/auth/logout
**Purpose:** Logout and invalidate refresh token  
**Auth:** None  
**Request:**
```json
{
  "refreshToken": "string"
}
```
**Response:** 200
```json
{
  "message": "Logged out Successfully"
}
```

---

## 👤 USER ENDPOINTS

### GET /api/users/me
**Purpose:** Get my profile  
**Auth:** Customer or Admin  
**Response:** 200
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "role": "customer|admin",
  "phone": "string|null",
  "address": "string|null"
}
```

---

### PATCH /api/users/me
**Purpose:** Update my profile  
**Auth:** Customer or Admin  
**Request:**
```json
{
  "name": "string" (optional),
  "phone": "string" (optional),
  "address": "string" (optional)
}
```
**Response:** 200 (same as GET /api/users/me)

---

### DELETE /api/users/me
**Purpose:** Delete my account  
**Auth:** Customer or Admin  
**Response:** 200
```json
{
  "message": "User deleted successfully"
}
```

---

### GET /api/users
**Purpose:** Get all users (admin only)  
**Auth:** Admin  
**Query Params:** (NEEDS TO BE ADDED)
- `page` - Page number
- `limit` - Items per page
- `search` - Search by name/email

**Response:** 200
```json
[
  {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "customer|admin",
    "phone": "string|null",
    "address": "string|null"
  }
]
```

---

### GET /api/users/:id
**Purpose:** Get user by ID (admin only)  
**Auth:** Admin  
**Response:** 200 (same as GET /api/users/me)

---

## 🪑 TABLE ENDPOINTS

### GET /api/tables
**Purpose:** Get all tables (public)  
**Auth:** None  
**Response:** 200
```json
[
  {
    "_id": "string",
    "tableNumber": number,
    "capacity": number,
    "location": "string",
    "status": "available|occupied|reserved",
    "createdAt": "date",
    "updatedAt": "date"
  }
]
```

---

### GET /api/tables/:id
**Purpose:** Get table by ID  
**Auth:** None  
**Response:** 200 (single table object)

---

### POST /api/tables
**Purpose:** Create table (admin only)  
**Auth:** Admin  
**Request:**
```json
{
  "tableNumber": number,
  "capacity": number,
  "location": "string" (optional),
  "status": "available|occupied|reserved" (optional)
}
```
**Response:** 201 (created table object)

---

### PUT /api/tables/:id
**Purpose:** Update table (admin only)  
**Auth:** Admin  
**Request:** (same as POST, all fields optional)  
**Response:** 200 (updated table object)

---

### DELETE /api/tables/:id
**Purpose:** Delete table (admin only)  
**Auth:** Admin  
**Response:** 200
```json
{
  "message": "Table deleted successfully"
}
```

---

## 📅 RESERVATION ENDPOINTS

### GET /api/reservations/availability
**Purpose:** Check table availability (public)  
**Auth:** None  
**Query Params:**
- `date` - Reservation date (YYYY-MM-DD)
- `timeSlot` - Time slot (e.g., "18:00")
- `numberOfGuests` - Number of guests

**Response:** 200
```json
{
  "available": boolean,
  "availableTables": [
    {
      "_id": "string",
      "tableNumber": number,
      "capacity": number,
      "location": "string"
    }
  ]
}
```

---

### POST /api/reservations
**Purpose:** Create reservation (customer only)  
**Auth:** Customer  
**Request:**
```json
{
  "table_id": "string",
  "date": "YYYY-MM-DD",
  "timeSlot": "string",
  "numberOfGuests": number,
  "specialRequests": "string" (optional),
  "contactPhone": "string"
}
```
**Response:** 201
```json
{
  "_id": "string",
  "user_id": "user_id",
  "table_id": {table_object},
  "date": "date",
  "timeSlot": "string",
  "numberOfGuests": number,
  "specialRequests": "string",
  "contactPhone": "string",
  "status": "pending|confirmed|cancelled|completed",
  "createdAt": "date",
  "updatedAt": "date"
}
```

---

### GET /api/reservations/my-reservations
**Purpose:** Get my reservations (customer only)  
**Auth:** Customer  
**Query Params:** (NEEDS TO BE ADDED)
- `page` - Page number
- `limit` - Items per page
- `status` - Filter by status

**Response:** 200 (array of reservations with populated table)

---

### GET /api/reservations/:id
**Purpose:** Get reservation by ID  
**Auth:** Customer (own reservations)  
**Response:** 200 (single reservation object with populated user and table)

---

### PATCH /api/reservations/:id/cancel
**Purpose:** Cancel reservation (customer only)  
**Auth:** Customer  
**Response:** 200 (updated reservation object with status='cancelled')

---

### GET /api/reservations/admin/all
**Purpose:** Get all reservations (admin only)  
**Auth:** Admin  
**Query Params:** (NEEDS TO BE ADDED)
- `page` - Page number
- `limit` - Items per page
- `status` - Filter by status
- `date` - Filter by date

**Response:** 200 (array of reservations with populated user and table)

---

### PATCH /api/reservations/admin/:id/status
**Purpose:** Update reservation status (admin only)  
**Auth:** Admin  
**Request:**
```json
{
  "status": "confirmed|cancelled|completed"
}
```
**Response:** 200 (updated reservation object)

---

## 🏪 RESTAURANT ENDPOINTS

### GET /api/restaurant
**Purpose:** Get restaurant information (public)  
**Auth:** None  
**Response:** 200
```json
{
  "_id": "string",
  "name": "string",
  "description": "string",
  "address": "string",
  "phone": "string",
  "email": "string",
  "openingHours": {
    "monday": "string",
    "tuesday": "string",
    "wednesday": "string",
    "thursday": "string",
    "friday": "string",
    "saturday": "string",
    "sunday": "string"
  },
  "createdAt": "date",
  "updatedAt": "date"
}
```

---

### PATCH /api/restaurant
**Purpose:** Update restaurant information (admin only)  
**Auth:** Admin  
**Request:** (all fields optional)
```json
{
  "name": "string",
  "description": "string",
  "address": "string",
  "phone": "string",
  "email": "string",
  "openingHours": {
    "monday": "string",
    "tuesday": "string",
    "wednesday": "string",
    "thursday": "string",
    "friday": "string",
    "saturday": "string",
    "sunday": "string"
  }
}
```
**Response:** 200 (updated restaurant object)

---

## 🎟️ PROMO CODE ENDPOINTS (NOT IMPLEMENTED)

**Note:** Model exists but no routes/controller implemented yet.

**Needed Endpoints:**
- `GET /api/promo-codes` - Get all promo codes (admin)
- `POST /api/promo-codes` - Create promo code (admin)
- `PATCH /api/promo-codes/:id` - Update promo code (admin)
- `DELETE /api/promo-codes/:id` - Delete promo code (admin)
- `POST /api/promo-codes/validate` - Validate promo code (customer)
- `POST /api/cart/apply-promo` - Apply promo to cart (customer)

---

## 📊 RESPONSE FORMAT RECOMMENDATIONS

### Current Issues:
1. Inconsistent response formats across endpoints
2. No pagination metadata
3. No standardized error format
4. No success/data wrapper

### Recommended Standard Format:

**Success Response:**
```json
{
  "success": true,
  "data": {}, // or []
  "message": "Optional success message",
  "pagination": { // for list endpoints
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 100,
    "itemsPerPage": 12
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE",
    "details": {} // optional validation errors
  }
}
```

---

## 🔍 MISSING QUERY PARAMETERS

Most list endpoints need these query params:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10-20)
- `sort` - Sort field (e.g., -createdAt, name)
- `search` - Search term
- Status/category filters specific to each endpoint

---

## 🚨 CRITICAL API GAPS

1. **No file upload endpoint** - Products need image upload
2. **No promo code routes** - Model exists but not exposed
3. **No pagination** - All list endpoints return full arrays
4. **No search/filter** - Limited query capabilities
5. **No analytics endpoints** - Dashboard needs stats
6. **No password reset** - Auth flow incomplete
7. **No email verification** - Security gap
8. **No rate limiting** - API vulnerable to abuse

---


## 🍽️ PRODUCT ENDPOINTS

### GET /api/products
**Purpose:** Get all products (public)  
**Auth:** None  
**Query Params:** (NEEDS TO BE ADDED)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 12)
- `category` - Filter by category
- `search` - Search by name
- `available` - Filter by availability (true/false)
- `sort` - Sort field (e.g., -price, name)

**Current Response:** 200
```json
[
  {
    "_id": "string",
    "name": "string",
    "description": "string",
    "price": number,
    "category": "string",
    "image_url": "string",
    "is_available": boolean,
    "is_deleted": boolean,
    "createdAt": "date",
    "updatedAt": "date"
  }
]
```

**Recommended Response:** 200
```json
{
  "success": true,
  "data": [products],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 100,
    "itemsPerPage": 12
  }
}
```

---

### GET /api/products/:id
**Purpose:** Get single product  
**Auth:** None  
**Response:** 200 (single product object)

---

### POST /api/products
**Purpose:** Create product (admin only)  
**Auth:** Admin  
**Request:**
```json
{
  "name": "string",
  "description": "string",
  "price": number,
  "category": "string",
  "image_url": "string" (optional),
  "is_available": boolean (optional)
}
```
**Response:** 201 (created product object)

---

### PATCH /api/products/:id
**Purpose:** Update product (admin only)  
**Auth:** Admin  
**Request:** (same as POST, all fields optional)  
**Response:** 200 (updated product object)

---

### DELETE /api/products/:id
**Purpose:** Soft delete product (admin only)  
**Auth:** Admin  
**Response:** 200
```json
{
  "message": "Product deleted successfully"
}
```

---

## 🛒 CART ENDPOINTS

### GET /api/cart
**Purpose:** Get my cart  
**Auth:** Customer  
**Response:** 200
```json
{
  "_id": "cart_id",
  "user_id": "user_id",
  "items": [
    {
      "product_id": {
        "_id": "string",
        "name": "string",
        "price": number,
        "image_url": "string"
      },
      "quantity": number,
      "unit_price": number
    }
  ],
  "createdAt": "date",
  "updatedAt": "date"
}
```

---

### POST /api/cart/items
**Purpose:** Add item to cart  
**Auth:** Customer  
**Request:**
```json
{
  "product_id": "string",
  "quantity": number
}
```
**Response:** 200 (full cart object)

---

### PATCH /api/cart/items/:productId
**Purpose:** Update item quantity  
**Auth:** Customer  
**Request:**
```json
{
  "quantity": number
}
```
**Response:** 200 (full cart object)

---

### DELETE /api/cart/items/:productId
**Purpose:** Remove item from cart  
**Auth:** Customer  
**Response:** 200 (full cart object)

---

### DELETE /api/cart
**Purpose:** Clear cart  
**Auth:** Customer  
**Response:** 200
```json
{
  "message": "Cart cleared",
  "cart": {cart_object}
}
```

---

## 📦 ORDER ENDPOINTS

### POST /api/orders
**Purpose:** Create order from cart  
**Auth:** Customer  
**Request:**
```json
{
  "itemsToOrder": ["product_id1", "product_id2"] (optional),
  "notes": "string" (optional)
}
```
**Response:** 201 (order object with populated items)

---

### POST /api/orders/pre-order/:reservationId
**Purpose:** Create pre-order for reservation  
**Auth:** Customer  
**Request:**
```json
{
  "notes": "string" (optional)
}
```
**Response:** 201
```json
{
  "success": true,
  "message": "Pre-order created successfully",
  "data": {order_object_with_reservation_and_table}
}
```

---

### GET /api/orders
**Purpose:** Get my orders  
**Auth:** Customer  
**Query Params:** (NEEDS TO BE ADDED)
- `page` - Page number
- `limit` - Items per page
- `status` - Filter by status

**Response:** 200
```json
[
  {
    "_id": "string",
    "user_id": "string",
    "items": [order_items],
    "orderType": "dine-in|takeout|delivery",
    "table": "table_id",
    "reservation": "reservation_id",
    "subtotal": number,
    "total_price": number,
    "status": "pending|confirmed|preparing|delivered|cancelled",
    "notes": "string",
    "createdAt": "date",
    "updatedAt": "date"
  }
]
```

---

### GET /api/orders/:id
**Purpose:** Get order by ID  
**Auth:** Customer (own orders) or Admin (all orders)  
**Response:** 200 (single order object with populated user and items)

---

### DELETE /api/orders/:id
**Purpose:** Cancel order (only pending)  
**Auth:** Customer  
**Response:** 200 (updated order object with status='cancelled')

---

### GET /api/orders/admin/all
**Purpose:** Get all orders (admin only)  
**Auth:** Admin  
**Query Params:** (NEEDS TO BE ADDED)
- `page` - Page number
- `limit` - Items per page
- `status` - Filter by status
- `startDate` - Filter by date range
- `endDate` - Filter by date range

**Response:** 200 (array of orders with populated user and items)

---

### PATCH /api/orders/:id/status
**Purpose:** Update order status (admin only)  
**Auth:** Admin  
**Request:**
```json
{
  "status": "confirmed|preparing|delivered|cancelled"
}
```
**Response:** 200 (updated order object)

---


## 🪑 TABLE ENDPOINTS

### GET /api/tables
**Purpose:** Get all tables (public)  
**Auth:** None  
**Response:** 200
```json
{
  "success": true,
  "count": number,
  "data": [
    {
      "_id": "string",
      "tableNumber": number,
      "capacity": number,
      "location": "string",
      "status": "active|inactive",
      "createdAt": "date",
      "updatedAt": "date"
    }
  ]
}
```

---

### GET /api/tables/:id
**Purpose:** Get table by ID (public)  
**Auth:** None  
**Response:** 200
```json
{
  "success": true,
  "data": {table_object}
}
```

---

### POST /api/tables
**Purpose:** Create table (admin only)  
**Auth:** Admin  
**Request:**
```json
{
  "tableNumber": number,
  "capacity": number,
  "location": "string" (optional),
  "status": "active|inactive" (optional)
}
```
**Response:** 201
```json
{
  "success": true,
  "message": "Table created successfully",
  "data": {table_object}
}
```

---

### PUT /api/tables/:id
**Purpose:** Update table (admin only)  
**Auth:** Admin  
**Request:** (same as POST, all fields optional)  
**Response:** 200
```json
{
  "success": true,
  "message": "Table updated successfully",
  "data": {table_object}
}
```

---

### DELETE /api/tables/:id
**Purpose:** Delete table (admin only)  
**Auth:** Admin  
**Response:** 200
```json
{
  "success": true,
  "message": "Table deleted successfully"
}
```

---

## 📅 RESERVATION ENDPOINTS

### GET /api/reservations/availability
**Purpose:** Check table availability (public)  
**Auth:** None  
**Query Params:** (REQUIRED)
- `date` - Date (YYYY-MM-DD)
- `timeSlot` - Time (HH:MM)
- `numberOfGuests` - Number of guests

**Response:** 200
```json
{
  "success": true,
  "count": number,
  "data": [
    {
      "_id": "string",
      "tableNumber": number,
      "capacity": number,
      "location": "string",
      "status": "active"
    }
  ]
}
```

---

### POST /api/reservations
**Purpose:** Create reservation (customer)  
**Auth:** Customer  
**Request:**
```json
{
  "table": "table_id",
  "date": "2024-03-20",
  "timeSlot": "18:00",
  "numberOfGuests": number,
  "duration": number (optional, default: 120),
  "specialRequests": "string" (optional),
  "contactPhone": "string"
}
```
**Response:** 201
```json
{
  "success": true,
  "message": "Reservation created successfully",
  "data": {
    "_id": "string",
    "user": "user_id",
    "table": "table_id",
    "date": "date",
    "timeSlot": "string",
    "numberOfGuests": number,
    "duration": number,
    "endTime": "date",
    "status": "pending",
    "specialRequests": "string",
    "contactPhone": "string",
    "hasPreOrder": false,
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

---

### GET /api/reservations/my-reservations
**Purpose:** Get my reservations  
**Auth:** Customer  
**Response:** 200
```json
{
  "success": true,
  "count": number,
  "data": [
    {
      reservation_object_with_populated_table
    }
  ]
}
```

---

### GET /api/reservations/:id
**Purpose:** Get reservation by ID (own only)  
**Auth:** Customer  
**Response:** 200
```json
{
  "success": true,
  "data": {
    reservation_object_with_populated_user_and_table
  }
}
```

---

### PATCH /api/reservations/:id/cancel
**Purpose:** Cancel reservation  
**Auth:** Customer  
**Response:** 200
```json
{
  "success": true,
  "message": "Reservation cancelled successfully",
  "data": {updated_reservation_object}
}
```

---

### GET /api/reservations/admin/all
**Purpose:** Get all reservations (admin only)  
**Auth:** Admin  
**Query Params:** (OPTIONAL)
- `date` - Filter by date
- `status` - Filter by status

**Response:** 200
```json
{
  "success": true,
  "count": number,
  "data": [
    {
      reservation_objects_with_populated_user_and_table
    }
  ]
}
```

---

### PATCH /api/reservations/admin/:id/status
**Purpose:** Update reservation status (admin only)  
**Auth:** Admin  
**Request:**
```json
{
  "status": "pending|confirmed|completed|cancelled|no-show"
}
```
**Response:** 200
```json
{
  "success": true,
  "message": "Reservation status updated successfully",
  "data": {updated_reservation_object}
}
```

---

## 🏪 RESTAURANT ENDPOINTS

### GET /api/restaurant
**Purpose:** Get restaurant info (public)  
**Auth:** None  
**Response:** 200
```json
{
  "_id": "string",
  "name": "string",
  "description": "string",
  "address": "string",
  "phone": "string",
  "opening_hours": "string",
  "createdAt": "date",
  "updatedAt": "date"
}
```

---

### PATCH /api/restaurant
**Purpose:** Update restaurant info (admin only)  
**Auth:** Admin  
**Request:**
```json
{
  "name": "string" (optional),
  "description": "string" (optional),
  "address": "string" (optional),
  "phone": "string" (optional),
  "opening_hours": "string" (optional)
}
```
**Response:** 200 (updated restaurant object)

---

## 🎟️ PROMO CODE ENDPOINTS (TO BE IMPLEMENTED)

### GET /api/promo-codes
**Purpose:** Get all promo codes (admin only)  
**Auth:** Admin  
**Status:** ❌ NOT IMPLEMENTED

---

### POST /api/promo-codes
**Purpose:** Create promo code (admin only)  
**Auth:** Admin  
**Status:** ❌ NOT IMPLEMENTED

---

### PATCH /api/promo-codes/:id
**Purpose:** Update promo code (admin only)  
**Auth:** Admin  
**Status:** ❌ NOT IMPLEMENTED

---

### DELETE /api/promo-codes/:id
**Purpose:** Delete promo code (admin only)  
**Auth:** Admin  
**Status:** ❌ NOT IMPLEMENTED

---

### POST /api/promo-codes/validate
**Purpose:** Validate promo code  
**Auth:** Customer  
**Status:** ❌ NOT IMPLEMENTED

---

## 📤 FILE UPLOAD ENDPOINT (TO BE IMPLEMENTED)

### POST /api/upload
**Purpose:** Upload image file  
**Auth:** Admin  
**Request:** multipart/form-data with file  
**Response:** 200
```json
{
  "success": true,
  "url": "string",
  "filename": "string"
}
```
**Status:** ❌ NOT IMPLEMENTED

---

## 📊 ENDPOINT SUMMARY

| Module | Endpoints | Status | Auth Required |
|--------|-----------|--------|---------------|
| Authentication | 5 | ✅ Complete | Mixed |
| Users | 5 | ✅ Complete | Yes |
| Products | 5 | ✅ Complete | Mixed |
| Cart | 5 | ✅ Complete | Customer |
| Orders | 7 | ✅ Complete | Mixed |
| Tables | 5 | ✅ Complete | Mixed |
| Reservations | 7 | ✅ Complete | Mixed |
| Restaurant | 2 | ✅ Complete | Mixed |
| Promo Codes | 0 | ❌ Missing | Admin |
| File Upload | 0 | ❌ Missing | Admin |

**Total Endpoints:** 41 implemented, 6 missing

---

## 🔒 AUTHENTICATION HEADER FORMAT

All authenticated endpoints require:
```
Authorization: Bearer <access_token>
```

**Token Expiry:**
- Access Token: 15 minutes
- Refresh Token: 7 days

**Token Refresh Flow:**
1. Client receives 401 Unauthorized
2. Client calls POST /api/auth/refresh with refresh token
3. Client receives new access token
4. Client retries original request with new token

---

## ⚠️ ERROR RESPONSE FORMAT

**Current (Inconsistent):**
```json
// Some endpoints:
{ "message": "Error message" }

// Others:
{ "success": false, "message": "Error message" }
```

**Recommended (Standardized):**
```json
{
  "success": false,
  "error": {
    "message": "Error message",
    "status": 400,
    "code": "VALIDATION_ERROR" (optional),
    "details": {} (optional, for validation errors)
  }
}
```

**Common Status Codes:**
- 200 OK - Success
- 201 Created - Resource created
- 400 Bad Request - Validation error
- 401 Unauthorized - Missing/invalid token
- 403 Forbidden - Insufficient permissions
- 404 Not Found - Resource not found
- 500 Internal Server Error - Server error

---

