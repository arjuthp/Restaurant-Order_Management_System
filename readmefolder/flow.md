Based on your documentation, here is your complete flow:

---

## 🗺️ Overall System Flow

```
Client (Browser / Mobile)
         ↓
    Express App
         ↓
   Global Middleware
         ↓
      Routes
         ↓
  Auth Middleware
         ↓
    Controllers
         ↓
     Services
         ↓
    Mongoose Models
         ↓
     MongoDB
```

---

## 🔐 Auth Flow

### Register
```
POST /api/auth/register
         ↓
cors, helmet, json parser
         ↓
validate body (name, email, password)
         ↓
check if email already exists
         ↓
hash password (bcrypt)
         ↓
save user to DB (role: "customer")
         ↓
return token + user
```

### Login (Customer)
```
POST /api/auth/login
         ↓
validate body (email, password)
         ↓
find user by email
         ↓
compare password with bcrypt
         ↓
generate JWT token
         ↓
return token + user
```

### Login (Admin)
```
POST /api/auth/admin/login
         ↓
validate body (email, password)
         ↓
find user by email
         ↓
check role === "admin"
         ↓
compare password with bcrypt
         ↓
generate JWT token
         ↓
return token + user
```

### Logout
```
POST /api/auth/logout
         ↓
verifyToken middleware
         ↓
invalidate token (blacklist or client deletes it)
         ↓
return success message
```

---

## 🏪 Restaurant Flow

### Get Restaurant Info
```
GET /api/restaurant
         ↓
no auth needed
         ↓
fetch restaurant document from DB
         ↓
return restaurant data
```

### Update Restaurant
```
PATCH /api/restaurant
         ↓
verifyToken
         ↓
verifyAdmin (role === "admin")
         ↓
validate body
         ↓
update restaurant document in DB
         ↓
return updated restaurant
```

---

## 🍔 Product Flow

### Get All Products
```
GET /api/products
         ↓
no auth needed
         ↓
fetch all products where is_available: true
         ↓
return products list
```

### Get Single Product
```
GET /api/products/:id
         ↓
no auth needed
         ↓
fetch product by id
         ↓
if not found → 404
         ↓
return product
```

### Create Product
```
POST /api/products
         ↓
verifyToken
         ↓
verifyAdmin
         ↓
validate body (name, price, category required)
         ↓
save product to DB
         ↓
return new product
```

### Update Product
```
PATCH /api/products/:id
         ↓
verifyToken
         ↓
verifyAdmin
         ↓
validate body
         ↓
find product by id
         ↓
if not found → 404
         ↓
update and save
         ↓
return updated product
```

### Delete Product
```
DELETE /api/products/:id
         ↓
verifyToken
         ↓
verifyAdmin
         ↓
find product by id
         ↓
if not found → 404
         ↓
delete product
         ↓
return success message
```

---

## 👤 User Flow

### Get All Users (Admin)
```
GET /api/users
         ↓
verifyToken
         ↓
verifyAdmin
         ↓
fetch all users from DB
         ↓
return users list (exclude passwords)
```

### Get My Profile
```
GET /api/users/me
         ↓
verifyToken
         ↓
verifyCustomer
         ↓
fetch user by req.user.id
         ↓
return user (exclude password)
```

### Update My Profile
```
PATCH /api/users/me
         ↓
verifyToken
         ↓
verifyCustomer
         ↓
validate body
         ↓
update user by req.user.id
         ↓
return updated user
```

### Delete My Account
```
DELETE /api/users/me
         ↓
verifyToken
         ↓
verifyCustomer
         ↓
delete user by req.user.id
         ↓
return success message
```

---

## 🛒 Cart Flow

### Get Cart
```
GET /api/cart
         ↓
verifyToken
         ↓
verifyCustomer
         ↓
find cart by user_id (req.user.id)
         ↓
populate product details
         ↓
return cart with items
```

### Add Item to Cart
```
POST /api/cart/items
         ↓
verifyToken
         ↓
verifyCustomer
         ↓
validate body (product_id, quantity)
         ↓
find product by id
         ↓
if not found → 404
         ↓
check if product already in cart
         ↓
if yes → increase quantity
if no  → push new item
         ↓
save unit_price snapshot from product
         ↓
return updated cart
```

### Update Item Quantity
```
PATCH /api/cart/items/:productId
         ↓
verifyToken
         ↓
verifyCustomer
         ↓
validate body (quantity)
         ↓
find cart by user_id
         ↓
find item in cart by productId
         ↓
if not found → 404
         ↓
update quantity
         ↓
return updated cart
```

### Remove Item from Cart
```
DELETE /api/cart/items/:productId
         ↓
verifyToken
         ↓
verifyCustomer
         ↓
find cart by user_id
         ↓
remove item where product_id matches
         ↓
return updated cart
```

### Clear Cart
```
DELETE /api/cart
         ↓
verifyToken
         ↓
verifyCustomer
         ↓
find cart by user_id
         ↓
set items to []
         ↓
return empty cart
```

---

## 📦 Order Flow

### Place Order (Most Complex)
```
POST /api/orders
         ↓
verifyToken
         ↓
verifyCustomer
         ↓
fetch cart by user_id
         ↓
if cart empty → 400 error
         ↓
calculate total_price from cart items
         ↓
start DB transaction
         ↓
create order with:
   - user_id
   - items (copied from cart)
   - total_price
   - status: "pending"
   - notes (optional)
         ↓
clear cart (items = [])
         ↓
commit transaction
         ↓
return new order
```

### Get My Orders
```
GET /api/orders
         ↓
verifyToken
         ↓
verifyCustomer
         ↓
fetch all orders where user_id === req.user.id
         ↓
return orders list
```

### Get Single Order
```
GET /api/orders/:id
         ↓
verifyToken
         ↓
verifyCustomer
         ↓
fetch order by id
         ↓
check order.user_id === req.user.id
         ↓
if not match → 403 forbidden
         ↓
return order
```

### Get All Orders (Admin)
```
GET /api/orders/admin
         ↓
verifyToken
         ↓
verifyAdmin
         ↓
fetch all orders from DB
         ↓
populate user details
         ↓
return all orders
```

### Update Order Status (Admin)
```
PATCH /api/orders/:id/status
         ↓
verifyToken
         ↓
verifyAdmin
         ↓
validate body (status)
         ↓
find order by id
         ↓
if not found → 404
         ↓
update status
         ↓
return updated order
```

### Cancel Order (Customer)
```
DELETE /api/orders/:id
         ↓
verifyToken
         ↓
verifyCustomer
         ↓
find order by id
         ↓
check order.user_id === req.user.id
         ↓
if not match → 403
         ↓
check status === "pending"
         ↓
if not pending → 400 (cannot cancel)
         ↓
update status to "cancelled"
         ↓
return updated order
```

---

## 🔁 Complete Middleware Chain Per Access Level

```
✅ Public
Request → Global Middleware → Route → Controller

🔑 Customer Auth
Request → Global Middleware → verifyToken → verifyCustomer → Route → Controller

🔒 Admin Only
Request → Global Middleware → verifyToken → verifyAdmin → Route → Controller
```

---

## 📁 How This Maps to Your Folder Structure

```
src/
├── app.js
├── server.js
├── routes/
│   ├── auth.routes.js
│   ├── restaurant.routes.js
│   ├── product.routes.js
│   ├── user.routes.js
│   ├── cart.routes.js
│   └── order.routes.js
├── middleware/
│   ├── verifyToken.js
│   ├── verifyAdmin.js
│   ├── verifyCustomer.js
│   └── errorHandler.js
├── controllers/
│   ├── auth.controller.js
│   ├── restaurant.controller.js
│   ├── product.controller.js
│   ├── user.controller.js
│   ├── cart.controller.js
│   └── order.controller.js
├── models/
│   ├── user.model.js
│   ├── restaurant.model.js
│   ├── product.model.js
│   ├── cart.model.js
│   └── order.model.js
└── utils/
    ├── generateToken.js
    └── hashPassword.js
```

---
