# API Parameter Quick Reference

## 🔑 Important: Parameter Naming

Your backend uses **snake_case** for some parameters. Make sure to use the correct format!

## 📋 Endpoint Parameters

### 🛒 Cart Endpoints

#### Add Item to Cart
```json
POST /api/cart/items
{
  "product_id": "67e8ccc8f82b8ada9e7c128",  // ⚠️ Use underscore!
  "quantity": 2
}
```

#### Update Item Quantity
```json
PATCH /api/cart/items/:productId
{
  "quantity": 3
}
```

### 📦 Order Endpoints

#### Create Order (Option 1: Specify Items)
```json
POST /api/orders
{
  "itemsToOrder": [                         // ⚠️ Use camelCase!
    {
      "product": "67e8ccc8f82b8ada9e7c128",
      "quantity": 2
    }
  ],
  "notes": "Please deliver to front door"  // Optional
}
```

#### Create Order (Option 2: Use Cart Items)
```json
POST /api/orders
{
  "notes": "Please deliver to front door"  // Optional
}
// If itemsToOrder is not provided, uses items from user's cart
```

#### Create Pre-Order for Reservation
```json
POST /api/orders/pre-order/:reservationId
{
  "notes": "Pre-order for dinner reservation"  // Optional
}
// Uses items from user's cart
```

#### Update Order Status (Admin)
```json
PATCH /api/orders/:orderId/status
{
  "status": "confirmed"
}
// Valid statuses: pending, confirmed, preparing, ready, delivered, cancelled
```

### 🍕 Product Endpoints

#### Create Product (JSON)
```json
POST /api/products
{
  "name": "Margherita Pizza",
  "description": "Classic Italian pizza",
  "price": 12.99,
  "category": "main",
  "stock": 50,
  "isAvailable": true
}
```

#### Create Product (with Image)
```
POST /api/products
Content-Type: multipart/form-data

name: Margherita Pizza
description: Classic Italian pizza
price: 12.99
category: main
stock: 50
isAvailable: true
image: [file]
```

### 📅 Reservation Endpoints

#### Create Reservation
```json
POST /api/reservations
{
  "table": "67e8ccc8f82b8ada9e7c128",
  "date": "2026-12-25",
  "timeSlot": "18:00",
  "numberOfGuests": 4,
  "contactPhone": "1234567890",
  "specialRequests": "Window seat preferred"  // Optional
}
```

#### Update Reservation Status (Admin)
```json
PATCH /api/reservations/admin/:reservationId/status
{
  "status": "confirmed"
}
// Valid statuses: pending, confirmed, seated, completed, cancelled, no-show
```

### 🪑 Table Endpoints

#### Create Table
```json
POST /api/tables
{
  "tableNumber": 1,
  "capacity": 4,
  "location": "Window side",
  "status": "active"
}
```

### 👤 User Endpoints

#### Update Profile
```json
PATCH /api/users/me
{
  "name": "John Doe Updated",
  "phone": "9876543210",
  "address": "456 New Street, City"
}
```

### 🏪 Restaurant Info

#### Update Restaurant Info (Admin)
```json
PATCH /api/restaurant
{
  "name": "My Restaurant",
  "description": "Best food in town",
  "address": "123 Restaurant St",
  "phone": "555-1234",
  "email": "info@restaurant.com",
  "openingHours": {
    "monday": "9:00 AM - 10:00 PM",
    "tuesday": "9:00 AM - 10:00 PM",
    "wednesday": "9:00 AM - 10:00 PM",
    "thursday": "9:00 AM - 10:00 PM",
    "friday": "9:00 AM - 11:00 PM",
    "saturday": "10:00 AM - 11:00 PM",
    "sunday": "10:00 AM - 9:00 PM"
  }
}
```

## ⚠️ Common Mistakes

### ❌ Wrong
```json
// Adding to cart
{
  "productId": "...",  // Wrong! Backend expects product_id
  "quantity": 2
}

// Creating order
{
  "items": [...],      // Wrong! Backend expects itemsToOrder
  "deliveryAddress": "...",
  "paymentMethod": "card"
}
```

### ✅ Correct
```json
// Adding to cart
{
  "product_id": "...",  // Correct! Use underscore
  "quantity": 2
}

// Creating order
{
  "itemsToOrder": [...],  // Correct! Use camelCase
  "notes": "..."
}
```

## 📝 Query Parameters

### Products
```
GET /api/products?page=1&limit=10&search=pizza&category=main&minPrice=5&maxPrice=50&sortBy=price&sortOrder=asc
```

### Orders
```
GET /api/orders?page=1&limit=10&status=pending
GET /api/orders/admin/all?page=1&limit=10&status=pending
```

### Users (Admin)
```
GET /api/users?page=1&limit=10&role=customer
```

### Reservations
```
GET /api/reservations/availability?date=2026-12-25&timeSlot=18:00&numberOfGuests=4
GET /api/reservations/admin/all?status=pending&date=2026-12-25
```

---

**Pro Tip**: The updated Postman collection already has all the correct parameter names. Just re-import it!
