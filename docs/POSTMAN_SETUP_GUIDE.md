# Postman Complete Test Suite Setup Guide

## Quick Setup Steps

### 1. Create New Collection
- Open Postman
- Click "New" → "Collection"
- Name: `Restaurant API - Complete Test Suite`

### 2. Set Collection Variables
Click on collection → Variables tab → Add these:

| Variable | Initial Value | Type |
|----------|--------------|------|
| baseUrl | http://localhost:5000/api | string |
| customerToken | (empty) | string |
| customerRefreshToken | (empty) | string |
| customerId | (empty) | string |
| adminToken | (empty) | string |
| adminRefreshToken | (empty) | string |
| adminId | (empty) | string |
| productId | (empty) | string |
| productId2 | (empty) | string |
| orderId | (empty) | string |

---

## Folder Structure & Requests

### 📁 CUSTOMER FLOW

#### 📁 1. Authentication

**✉️ Register Customer**
```
POST {{baseUrl}}/auth/register
Body (JSON):
{
  "name": "Test Customer",
  "email": "customer{{$timestamp}}@test.com",
  "password": "password123"
}

Tests:
pm.test("Registration successful", () => {
    pm.response.to.have.status(201);
    const res = pm.response.json();
    pm.collectionVariables.set("customerToken", res.accessToken);
    pm.collectionVariables.set("customerRefreshToken", res.refreshToken);
    pm.collectionVariables.set("customerId", res.user._id);
});
```

**✉️ Login Customer**
```
POST {{baseUrl}}/auth/login
Body (JSON):
{
  "email": "john@example.com",
  "password": "password123"
}

Tests:
pm.test("Login successful", () => {
    pm.response.to.have.status(200);
    const res = pm.response.json();
    pm.collectionVariables.set("customerToken", res.accessToken);
});
```

**✉️ Refresh Token**
```
POST {{baseUrl}}/auth/refresh
Body (JSON):
{
  "refreshToken": "{{customerRefreshToken}}"
}

Tests:
pm.test("Token refreshed", () => {
    pm.response.to.have.status(200);
    const res = pm.response.json();
    pm.collectionVariables.set("customerToken", res.accessToken);
});
```

**✉️ Logout Customer**
```
POST {{baseUrl}}/auth/logout
Body (JSON):
{
  "refreshToken": "{{customerRefreshToken}}"
}

Tests:
pm.test("Logout successful", () => {
    pm.response.to.have.status(200);
});
```

**✉️ [ERROR] Login with Wrong Password**
```
POST {{baseUrl}}/auth/login
Body (JSON):
{
  "email": "john@example.com",
  "password": "wrongpassword"
}

Tests:
pm.test("Should fail with 401", () => {
    pm.response.to.have.status(401);
});
```

---

#### 📁 2. Browse Products

**✉️ Get All Products**
```
GET {{baseUrl}}/products

Tests:
pm.test("Get products successful", () => {
    pm.response.to.have.status(200);
    const products = pm.response.json();
    if (products.length > 0) {
        pm.collectionVariables.set("productId", products[0]._id);
    }
    if (products.length > 1) {
        pm.collectionVariables.set("productId2", products[1]._id);
    }
});
```

**✉️ Get Product by ID**
```
GET {{baseUrl}}/products/{{productId}}

Tests:
pm.test("Get product by ID successful", () => {
    pm.response.to.have.status(200);
});
```

**✉️ [ERROR] Get Non-existent Product**
```
GET {{baseUrl}}/products/507f1f77bcf86cd799439011

Tests:
pm.test("Should return 404", () => {
    pm.response.to.have.status(404);
});
```

---

#### 📁 3. Cart Operations

**✉️ Add Item to Cart (Qty 2)**
```
POST {{baseUrl}}/cart/items
Headers:
Authorization: Bearer {{customerToken}}
Content-Type: application/json

Body (JSON):
{
  "product_id": "{{productId}}",
  "quantity": 2
}

Tests:
pm.test("Add to cart successful", () => {
    pm.response.to.have.status(200);
    const cart = pm.response.json();
    const item = cart.items[0];
    pm.expect(item.quantity).to.equal(2);
    pm.expect(item.unit_price).to.equal(item.product_id.price * 2);
});
```

**✉️ Add Same Item Again (Qty 3) - Should Update to 5**
```
POST {{baseUrl}}/cart/items
Headers:
Authorization: Bearer {{customerToken}}
Content-Type: application/json

Body (JSON):
{
  "product_id": "{{productId}}",
  "quantity": 3
}

Tests:
pm.test("❗ CRITICAL: No duplicate items", () => {
    pm.response.to.have.status(200);
    const cart = pm.response.json();
    pm.expect(cart.items.length).to.equal(1);
    pm.expect(cart.items[0].quantity).to.equal(5);
    const item = cart.items[0];
    pm.expect(item.unit_price).to.equal(item.product_id.price * 5);
});
```

**✉️ Add Different Product**
```
POST {{baseUrl}}/cart/items
Headers:
Authorization: Bearer {{customerToken}}
Content-Type: application/json

Body (JSON):
{
  "product_id": "{{productId2}}",
  "quantity": 1
}

Tests:
pm.test("Different product added", () => {
    pm.response.to.have.status(200);
    const cart = pm.response.json();
    pm.expect(cart.items.length).to.equal(2);
});
```

**✉️ Get Cart**
```
GET {{baseUrl}}/cart
Headers:
Authorization: Bearer {{customerToken}}

Tests:
pm.test("Get cart successful", () => {
    pm.response.to.have.status(200);
    const cart = pm.response.json();
    console.log("📦 Cart items:", cart.items.length);
});
```

**✉️ Update Item Quantity**
```
PATCH {{baseUrl}}/cart/items/{{productId}}
Headers:
Authorization: Bearer {{customerToken}}
Content-Type: application/json

Body (JSON):
{
  "quantity": 10
}

Tests:
pm.test("Quantity updated", () => {
    pm.response.to.have.status(200);
    const cart = pm.response.json();
    const item = cart.items.find(i => i.product_id._id === pm.collectionVariables.get("productId"));
    pm.expect(item.quantity).to.equal(10);
    pm.expect(item.unit_price).to.equal(item.product_id.price * 10);
});
```

**✉️ Remove Item from Cart**
```
DELETE {{baseUrl}}/cart/items/{{productId2}}
Headers:
Authorization: Bearer {{customerToken}}

Tests:
pm.test("Item removed", () => {
    pm.response.to.have.status(200);
});
```

**✉️ Clear Cart**
```
DELETE {{baseUrl}}/cart
Headers:
Authorization: Bearer {{customerToken}}

Tests:
pm.test("Cart cleared", () => {
    pm.response.to.have.status(200);
});
```

**✉️ [ERROR] Add Unavailable Product**
```
POST {{baseUrl}}/cart/items
Headers:
Authorization: Bearer {{customerToken}}
Content-Type: application/json

Body (JSON):
{
  "product_id": "{{productId}}",
  "quantity": 1
}

Tests:
pm.test("Should fail if product unavailable", () => {
    // This test depends on product availability
    // Manually mark product as unavailable first
});
```

---

#### 📁 4. Order Management

**✉️ Create Order from Cart**
```
POST {{baseUrl}}/orders
Headers:
Authorization: Bearer {{customerToken}}

Body (JSON):
{
  "delivery_address": "123 Test Street, Test City"
}

Tests:
pm.test("Order created", () => {
    pm.response.to.have.status(201);
    const order = pm.response.json();
    pm.collectionVariables.set("orderId", order._id);
});
```

**✉️ Get My Orders**
```
GET {{baseUrl}}/orders
Headers:
Authorization: Bearer {{customerToken}}

Tests:
pm.test("Get orders successful", () => {
    pm.response.to.have.status(200);
});
```

**✉️ Get Order by ID**
```
GET {{baseUrl}}/orders/{{orderId}}
Headers:
Authorization: Bearer {{customerToken}}

Tests:
pm.test("Get order by ID successful", () => {
    pm.response.to.have.status(200);
});
```

**✉️ [ERROR] Create Order with Empty Cart**
```
POST {{baseUrl}}/orders
Headers:
Authorization: Bearer {{customerToken}}

Body (JSON):
{
  "delivery_address": "123 Test Street"
}

Tests:
pm.test("Should fail with empty cart", () => {
    pm.response.to.have.status(400);
});
```

---

#### 📁 5. Edge Cases

**✉️ [ERROR] Access Cart Without Token**
```
GET {{baseUrl}}/cart

Tests:
pm.test("Should return 401", () => {
    pm.response.to.have.status(401);
});
```

**✉️ [ERROR] Add Negative Quantity**
```
POST {{baseUrl}}/cart/items
Headers:
Authorization: Bearer {{customerToken}}
Content-Type: application/json

Body (JSON):
{
  "product_id": "{{productId}}",
  "quantity": -5
}

Tests:
pm.test("Should fail with negative quantity", () => {
    pm.response.to.have.status(400);
});
```

**✉️ [ERROR] Update to Zero Quantity**
```
PATCH {{baseUrl}}/cart/items/{{productId}}
Headers:
Authorization: Bearer {{customerToken}}
Content-Type: application/json

Body (JSON):
{
  "quantity": 0
}

Tests:
pm.test("Zero quantity removes item", () => {
    pm.response.to.have.status(200);
    const cart = pm.response.json();
    const item = cart.items.find(i => i.product_id._id === pm.collectionVariables.get("productId"));
    pm.expect(item).to.be.undefined; // Item should be removed
});
```

---

### 📁 ADMIN FLOW

#### 📁 1. Admin Authentication

**✉️ Admin Login**
```
POST {{baseUrl}}/auth/admin/login
Body (JSON):
{
  "email": "admin@example.com",
  "password": "admin123"
}

Tests:
pm.test("Admin login successful", () => {
    pm.response.to.have.status(200);
    const res = pm.response.json();
    pm.collectionVariables.set("adminToken", res.accessToken);
    pm.collectionVariables.set("adminRefreshToken", res.refreshToken);
});
```

**✉️ [ERROR] Customer Tries Admin Login**
```
POST {{baseUrl}}/auth/admin/login
Body (JSON):
{
  "email": "john@example.com",
  "password": "password123"
}

Tests:
pm.test("Should deny customer", () => {
    pm.response.to.have.status(403);
});
```

---

#### 📁 2. Product Management

**✉️ Create New Product**
```
POST {{baseUrl}}/products
Headers:
Authorization: Bearer {{adminToken}}

Body (JSON):
{
  "name": "Test Pizza",
  "description": "Delicious test pizza",
  "price": 12.99,
  "category": "Main Course",
  "is_available": true
}

Tests:
pm.test("Product created", () => {
    pm.response.to.have.status(201);
});
```

**✉️ Update Product**
```
PUT {{baseUrl}}/products/{{productId}}
Headers:
Authorization: Bearer {{adminToken}}

Body (JSON):
{
  "price": 15.99,
  "is_available": true
}

Tests:
pm.test("Product updated", () => {
    pm.response.to.have.status(200);
});
```

**✉️ Mark Product Unavailable**
```
PUT {{baseUrl}}/products/{{productId}}
Headers:
Authorization: Bearer {{adminToken}}

Body (JSON):
{
  "is_available": false
}

Tests:
pm.test("Product marked unavailable", () => {
    pm.response.to.have.status(200);
});
```

**✉️ Delete Product**
```
DELETE {{baseUrl}}/products/{{productId}}
Headers:
Authorization: Bearer {{adminToken}}

Tests:
pm.test("Product deleted", () => {
    pm.response.to.have.status(200);
});
```

---

#### 📁 3. Order Management (Admin)

**✉️ Get All Orders**
```
GET {{baseUrl}}/admin/orders
Headers:
Authorization: Bearer {{adminToken}}

Tests:
pm.test("Get all orders successful", () => {
    pm.response.to.have.status(200);
});
```

**✉️ Update Order Status to Preparing**
```
PUT {{baseUrl}}/admin/orders/{{orderId}}
Headers:
Authorization: Bearer {{adminToken}}

Body (JSON):
{
  "status": "preparing"
}

Tests:
pm.test("Order status updated", () => {
    pm.response.to.have.status(200);
});
```

**✉️ Update Order Status to Completed**
```
PUT {{baseUrl}}/admin/orders/{{orderId}}
Headers:
Authorization: Bearer {{adminToken}}

Body (JSON):
{
  "status": "completed"
}

Tests:
pm.test("Order completed", () => {
    pm.response.to.have.status(200);
});
```

---

#### 📁 4. User Management

**✉️ Get All Users**
```
GET {{baseUrl}}/admin/users
Headers:
Authorization: Bearer {{adminToken}}

Tests:
pm.test("Get all users successful", () => {
    pm.response.to.have.status(200);
});
```

**✉️ Get User by ID**
```
GET {{baseUrl}}/admin/users/{{customerId}}
Headers:
Authorization: Bearer {{adminToken}}

Tests:
pm.test("Get user by ID successful", () => {
    pm.response.to.have.status(200);
});
```

---

#### 📁 5. Restaurant Info

**✉️ Get Restaurant Info**
```
GET {{baseUrl}}/restaurant

Tests:
pm.test("Get restaurant info successful", () => {
    pm.response.to.have.status(200);
});
```

**✉️ Update Restaurant Info**
```
PUT {{baseUrl}}/restaurant
Headers:
Authorization: Bearer {{adminToken}}

Body (JSON):
{
  "name": "Updated Restaurant Name",
  "phone": "1234567890",
  "address": "123 Main St"
}

Tests:
pm.test("Restaurant info updated", () => {
    pm.response.to.have.status(200);
});
```

---

## How to Run Tests

### Run Entire Collection:
1. Click collection name
2. Click "Run"
3. Select all folders
4. Click "Run Restaurant API - Complete Test Suite"

### Run Specific Folder:
1. Click folder (e.g., "CUSTOMER FLOW")
2. Click "Run"
3. Watch tests execute in order

### Run Single Request:
1. Click request
2. Click "Send"
3. View "Test Results" tab

---

## Tips

- ✅ Run "CUSTOMER FLOW" first to set up customer token
- ✅ Run "ADMIN FLOW" separately with admin credentials
- ✅ Check Console (bottom) for detailed logs
- ✅ Variables auto-update after each request
- ✅ Green = Pass, Red = Fail

---

## Next Steps

1. Create admin user in database first
2. Seed some products using seedProducts.js
3. Run the collection
4. Export and share with team!
