# Complete Restaurant API - Postman Collection Guide

## 📦 What's Included

This comprehensive Postman collection includes ALL your backend APIs:

- 🔐 **Authentication** (5 endpoints)
- 🍕 **Products** (7 endpoints)
- 🛒 **Cart** (5 endpoints)
- 📦 **Orders** (7 endpoints)
- 👤 **Users & Profile** (5 endpoints)
- 🪑 **Tables** (5 endpoints)
- 📅 **Reservations** (7 endpoints)
- 🏪 **Restaurant Info** (2 endpoints)

**Total: 43 API endpoints**

## 🚀 Quick Start

### 1. Import the Collection

1. Open Postman
2. Click **Import** button (top left)
3. Select the file: `postman/Complete-Restaurant-API.postman_collection.json`
4. Click **Import**

### 2. Configure Variables

The collection uses these variables (automatically managed):

- `baseUrl`: http://localhost:5000/api (change if your server runs on different port)
- `accessToken`: Auto-set after customer login
- `adminToken`: Auto-set after admin login
- `refreshToken`: Auto-set after login/register
- `productId`: Auto-set when creating/listing products
- `orderId`: Auto-set when creating orders
- `tableId`: Auto-set when creating/listing tables
- `reservationId`: Auto-set when creating reservations
- `userId`: Auto-set when listing users

### 3. Start Testing

**Recommended Testing Flow:**

1. **Login as Admin** → Sets `adminToken`
2. **Create Products** → Sets `productId`
3. **Create Tables** → Sets `tableId`
4. **Login as Customer** → Sets `accessToken`
5. **Add Items to Cart**
6. **Create Order**
7. **Create Reservation**
8. Test other endpoints as needed

## 📋 API Categories

### 🔐 Authentication

- **Register Customer** - Create new customer account
- **Login Customer** - Get customer access token
- **Login Admin** - Get admin access token
- **Refresh Token** - Get new access token using refresh token
- **Logout** - Invalidate refresh token

### 🍕 Products

- **Get All Products** - Public, with pagination, search, filters
- **Get Product by ID** - Public
- **Create Product** - Admin only (JSON)
- **Create Product with Image** - Admin only (Form-data with file upload)
- **Update Product** - Admin only (JSON)
- **Update Product with Image** - Admin only (Form-data)
- **Delete Product** - Admin only

**Query Parameters for Get All Products:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search in name/description
- `category` - Filter by category
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `sortBy` - Sort field (name, price, createdAt)
- `sortOrder` - asc or desc

### 🛒 Cart

All cart endpoints require customer authentication:

- **Get My Cart** - View current cart
- **Add Item to Cart** - Add product with quantity
  - Body: `{ "product_id": "...", "quantity": 2 }`
- **Update Item Quantity** - Change quantity of existing item
- **Remove Item from Cart** - Remove specific product
- **Clear Cart** - Remove all items

### 📦 Orders

**Customer Endpoints:**
- **Create Order** - Place new order (uses cart items if no itemsToOrder provided)
  - Body: `{ "itemsToOrder": [{ "product": "...", "quantity": 2 }], "notes": "..." }`
  - Or: `{ "notes": "..." }` (uses cart items)
- **Create Pre-Order for Reservation** - Link order to reservation (uses cart items)
  - Body: `{ "notes": "..." }`
- **Get My Orders** - List my orders with pagination
- **Get Order by ID** - View specific order details
- **Cancel Order** - Cancel pending order

**Admin Endpoints:**
- **Get All Orders** - List all orders with filters
- **Get Order by ID** - View any order
- **Update Order Status** - Change order status (pending, confirmed, preparing, ready, delivered, cancelled)

### 👤 Users & Profile

**User Endpoints (Customer/Admin):**
- **Get My Profile** - View own profile
- **Update My Profile** - Update name, phone, address
- **Delete My Account** - Delete own account

**Admin Endpoints:**
- **Get All Users** - List all users with pagination
- **Get User by ID** - View specific user details

### 🪑 Tables

**Public Endpoints:**
- **Get All Tables** - List all tables
- **Get Table by ID** - View table details

**Admin Endpoints:**
- **Create Table** - Add new table
- **Update Table** - Modify table details
- **Delete Table** - Remove table

### 📅 Reservations

**Public Endpoints:**
- **Check Availability** - Find available tables for date/time/guests

**Customer Endpoints:**
- **Create Reservation** - Book a table
- **Get My Reservations** - List my reservations
- **Get Reservation by ID** - View reservation details
- **Cancel Reservation** - Cancel my reservation

**Admin Endpoints:**
- **Get All Reservations** - List all reservations with filters
- **Update Reservation Status** - Change status (pending, confirmed, seated, completed, cancelled, no-show)

### 🏪 Restaurant Info

- **Get Restaurant Info** - Public, view restaurant details
- **Update Restaurant Info** - Admin only, update restaurant info

## 🔑 Authentication Flow

### For Customer Testing:

```
1. Register Customer (or use existing)
   → Sets accessToken automatically

2. Use accessToken for customer endpoints:
   - Cart operations
   - Create orders
   - View my orders
   - Create reservations
   - Profile management
```

### For Admin Testing:

```
1. Login as Admin
   → Sets adminToken automatically

2. Use adminToken for admin endpoints:
   - Product management
   - Table management
   - View all orders
   - Update order status
   - View all reservations
   - Update reservation status
   - User management
```

## 💡 Tips

1. **Auto-saved Variables**: Most IDs are automatically saved to variables after creation, so you can immediately test related endpoints

2. **Image Upload**: For product image upload, use the "Create Product with Image" or "Update Product with Image" requests with form-data

3. **Pagination**: Most list endpoints support `page` and `limit` query parameters

4. **Filters**: Products, Orders, and Reservations support various filters - check the query parameters

5. **Test Scripts**: Login requests automatically save tokens, so you don't need to copy-paste them

## 🐛 Troubleshooting

- **401 Unauthorized**: Token expired or invalid - login again
- **403 Forbidden**: Wrong role (e.g., customer trying admin endpoint)
- **404 Not Found**: Invalid ID or resource doesn't exist
- **400 Bad Request**: Check request body format and required fields

### Common Issues:

**"Product ID and quantity are required" when adding to cart:**
- Make sure you're using `product_id` (with underscore), not `productId`
- Correct: `{ "product_id": "...", "quantity": 2 }`

**"Validation error" when creating order:**
- Use `itemsToOrder` array with `product` and `quantity` fields
- Or omit `itemsToOrder` to use items from your cart
- Correct: `{ "itemsToOrder": [{ "product": "...", "quantity": 2 }], "notes": "..." }`
- Or: `{ "notes": "..." }` (uses cart)

## 📝 Default Credentials

Make sure you have these users in your database:

**Admin:**
- Email: admin@example.com
- Password: admin123

**Customer:**
- Email: john@example.com
- Password: password123

(Or register a new customer using the Register endpoint)

## 🎯 Testing Checklist

- [ ] Login as admin
- [ ] Create products
- [ ] Create tables
- [ ] Login as customer
- [ ] Add items to cart
- [ ] Create order
- [ ] Check availability
- [ ] Create reservation
- [ ] Admin: View all orders
- [ ] Admin: Update order status
- [ ] Admin: View all reservations
- [ ] Admin: Update reservation status

---

**Collection File**: `postman/Complete-Restaurant-API.postman_collection.json`

**Last Updated**: March 22, 2026
