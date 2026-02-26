# 🔄 Complete Developer Flow - Client to Server

## Visual Request/Response Sequences for All Scenarios

This document provides clear visual flows showing how requests travel from client to server, through all layers, and back to the client for every possible scenario in the Restaurant Order Management System.

---

## 📋 Table of Contents

1. [Authentication Flows](#1-authentication-flows)
2. [Product/Menu Flows](#2-productmenu-flows)
3. [Cart Management Flows](#3-cart-management-flows)
4. [Order Placement Flows](#4-order-placement-flows)
5. [Order Management Flows](#5-order-management-flows)
6. [User Profile Flows](#6-user-profile-flows)
7. [Restaurant Info Flows](#7-restaurant-info-flows)
8. [Admin Operations Flows](#8-admin-operations-flows)

---

## Legend

```
🟢 SUCCESS PATH
🔴 ERROR PATH
🟡 DECISION POINT
🔵 DATABASE OPERATION
⚙️  MIDDLEWARE
📤 REQUEST
📥 RESPONSE
```

---

## 1. Authentication Flows

### 1.1 Customer Registration (Success)

```
┌─────────────────────────────────────────────────────────────────────┐
│ CLIENT SIDE (React)                                                 │
└─────────────────────────────────────────────────────────────────────┘

User fills registration form
    ↓
Register.jsx → handleSubmit()
    ↓
authService.register({ name, email, password })
    ↓
📤 POST http://localhost:5000/api/auth/register
   Headers: { Content-Type: application/json }
   Body: {
     "name": "John Doe",
     "email": "john@example.com",
     "password": "password123"
   }

┌─────────────────────────────────────────────────────────────────────┐
│ SERVER SIDE (Express)                                               │
└─────────────────────────────────────────────────────────────────────┘

Request arrives at Express server
    ↓
⚙️  CORS Middleware
    → Adds CORS headers
    → Calls next()
    ↓
⚙️  express.json() Middleware
    → Parses JSON body
    → Sets req.body = { name, email, password }
    → Calls next()
    ↓
Router: /api/auth → auth.routes.js
    ↓
Route: POST /register → register controller
    ↓
┌─────────────────────────────────────────────────────────────────────┐
│ CONTROLLER (auth.controller.js)                                     │
└─────────────────────────────────────────────────────────────────────┘

async function register(req, res) {
    Extract: name, email, password from req.body
    ↓
    Call: authService.registerUser(name, email, password)
}

┌─────────────────────────────────────────────────────────────────────┐
│ SERVICE (auth.service.js)                                           │
└─────────────────────────────────────────────────────────────────────┘

async registerUser(name, email, password) {
    
    STEP 1: Check if email exists
    ↓
    🔵 const existingUser = await User.findOne({ email })
    ↓
    🟡 if (existingUser) → throw { status: 400, message: 'Email already Exists' }
    ↓
    🟢 Email is unique, continue
    ↓
    STEP 2: Hash password
    ↓
    const hashedPassword = await bcrypt.hash(password, 10)
    // "password123" → "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"
    ↓
    STEP 3: Create user in database
    ↓
    🔵 const user = await User.create({
        name: "John Doe",
        email: "john@example.com",
        password: hashedPassword,
        role: "customer"
    })
    ↓
    STEP 4: Generate JWT tokens
    ↓
    const accessToken = jwt.sign(
        { id: user._id, role: user.role },
        JWT_SECRET,
        { expiresIn: '15m' }
    )
    const refreshToken = jwt.sign(
        { id: user._id },
        JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
    )
    ↓
    STEP 5: Store refresh token
    ↓
    🔵 await RefreshToken.create({
        user_id: user._id,
        token: refreshToken,
        expiresAt: Date.now() + 7 days
    })
    ↓
    STEP 6: Return data
    ↓
    return {
        accessToken,
        refreshToken,
        user: { id, name, email, role }
    }
}

┌─────────────────────────────────────────────────────────────────────┐
│ RESPONSE BACK TO CLIENT                                             │
└─────────────────────────────────────────────────────────────────────┘

Service → Controller → Express → Client
    ↓
📥 HTTP/1.1 201 Created
   Content-Type: application/json
   
   {
     "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "user": {
       "id": "65f1a2b3c4d5e6f7g8h9i0j1",
       "name": "John Doe",
       "email": "john@example.com",
       "role": "customer"
     }
   }

┌─────────────────────────────────────────────────────────────────────┐
│ CLIENT SIDE (React) - Response Handling                             │
└─────────────────────────────────────────────────────────────────────┘

authService.register() receives response
    ↓
Store tokens in localStorage:
    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('refreshToken', data.refreshToken)
    localStorage.setItem('user', JSON.stringify(data.user))
    ↓
Update AuthContext state:
    setUser(data.user)
    ↓
Navigate to /menu
    ↓
✅ User is now logged in and can browse menu
```

---

### 1.2 Customer Registration (Error - Email Exists)

```
┌─────────────────────────────────────────────────────────────────────┐
│ CLIENT → SERVER (Same as success until...)                          │
└─────────────────────────────────────────────────────────────────────┘

SERVICE (auth.service.js):
    
    STEP 1: Check if email exists
    ↓
    🔵 const existingUser = await User.findOne({ email })
    ↓
    🔴 existingUser found!
    ↓
    throw { status: 400, message: 'Email already Exists' }

┌─────────────────────────────────────────────────────────────────────┐
│ ERROR HANDLING                                                      │
└─────────────────────────────────────────────────────────────────────┘

Service throws error
    ↓
Controller catches in try/catch:
    catch (error) {
        const status = error.status || 500  // 400
        res.status(status).json({ message: error.message })
    }
    ↓
📥 HTTP/1.1 400 Bad Request
   Content-Type: application/json
   
   {
     "message": "Email already Exists"
   }

┌─────────────────────────────────────────────────────────────────────┐
│ CLIENT SIDE - Error Handling                                        │
└─────────────────────────────────────────────────────────────────────┘

authService.register() throws error
    ↓
Component catches error:
    catch (error) {
        setError(error.response?.data?.message || 'Registration failed')
    }
    ↓
Display error message to user:
    🔴 "Email already Exists"
    ↓
User remains on registration page
```

---

### 1.3 Customer Login (Success)

```
┌─────────────────────────────────────────────────────────────────────┐
│ CLIENT SIDE                                                         │
└─────────────────────────────────────────────────────────────────────┘

User enters credentials
    ↓
Login.jsx → handleSubmit()
    ↓
authService.login({ email, password })
    ↓
📤 POST http://localhost:5000/api/auth/login
   Body: {
     "email": "john@example.com",
     "password": "password123"
   }

┌─────────────────────────────────────────────────────────────────────┐
│ SERVER SIDE                                                         │
└─────────────────────────────────────────────────────────────────────┘

Request → CORS → JSON Parser → Router → Controller
    ↓
auth.controller.js → login()
    ↓
authService.loginUser(email, password)
    ↓
STEP 1: Find user by email
    ↓
    🔵 const user = await User.findOne({ email })
    ↓
    🟡 if (!user) → throw { status: 401, message: 'Invalid credentials' }
    ↓
    🟢 User found
    ↓
STEP 2: Verify password
    ↓
    const isMatch = await bcrypt.compare(password, user.password)
    // Compares "password123" with stored hash
    ↓
    🟡 if (!isMatch) → throw { status: 401, message: 'Invalid credentials' }
    ↓
    🟢 Password matches
    ↓
STEP 3-6: Generate tokens (same as registration)
    ↓
📥 HTTP/1.1 200 OK
   {
     "accessToken": "...",
     "refreshToken": "...",
     "user": { ... }
   }

┌─────────────────────────────────────────────────────────────────────┐
│ CLIENT SIDE                                                         │
└─────────────────────────────────────────────────────────────────────┘

Store tokens → Update state → Navigate to /menu
✅ User logged in successfully
```

---

### 1.4 Admin Login (Success)

```
┌─────────────────────────────────────────────────────────────────────┐
│ CLIENT SIDE                                                         │
└─────────────────────────────────────────────────────────────────────┘

Admin enters credentials on /admin/login
    ↓
📤 POST http://localhost:5000/api/auth/admin/login
   Body: {
     "email": "admin@example.com",
     "password": "admin123"
   }

┌─────────────────────────────────────────────────────────────────────┐
│ SERVER SIDE                                                         │
└─────────────────────────────────────────────────────────────────────┘

auth.controller.js → adminLogin()
    ↓
authService.loginUser(email, password, 'admin')
                                        ↑
                                   requiredRole
    ↓
STEP 1: Find user
    🔵 const user = await User.findOne({ email })
    ↓
STEP 2: Check role
    🟡 if (requiredRole && user.role !== requiredRole)
        → throw { status: 403, message: 'Access Denied. admin only.' }
    ↓
    🟢 user.role === 'admin' ✓
    ↓
STEP 3: Verify password (same as customer login)
    ↓
STEP 4-6: Generate tokens with role: 'admin'
    ↓
📥 HTTP/1.1 200 OK
   {
     "accessToken": "...",
     "refreshToken": "...",
     "user": {
       "id": "...",
       "name": "Admin User",
       "email": "admin@example.com",
       "role": "admin"  ← Important!
     }
   }

┌─────────────────────────────────────────────────────────────────────┐
│ CLIENT SIDE                                                         │
└─────────────────────────────────────────────────────────────────────┘

Store tokens → Update state → Navigate to /admin/dashboard
✅ Admin logged in with elevated privileges
```

---

### 1.5 Token Refresh Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│ SCENARIO: Access token expired after 15 minutes                    │
└─────────────────────────────────────────────────────────────────────┘

User makes request with expired token
    ↓
📤 GET http://localhost:5000/api/cart
   Headers: { Authorization: "Bearer <expired_token>" }
    ↓
⚙️  authorize('customer') middleware
    ↓
    const decoded = jwt.verify(token, JWT_SECRET)
    ↓
    🔴 jwt.verify() throws: "jwt expired"
    ↓
    return res.status(403).json({ message: 'Invalid or expired token' })
    ↓
📥 HTTP/1.1 403 Forbidden
   { "message": "Invalid or expired token" }

┌─────────────────────────────────────────────────────────────────────┐
│ CLIENT SIDE - Axios Interceptor                                     │
└─────────────────────────────────────────────────────────────────────┘

api.interceptors.response catches 403 error
    ↓
Automatically triggers refresh:
    ↓
📤 POST http://localhost:5000/api/auth/refresh
   Body: {
     "refreshToken": "<stored_refresh_token>"
   }

┌─────────────────────────────────────────────────────────────────────┐
│ SERVER SIDE                                                         │
└─────────────────────────────────────────────────────────────────────┘

auth.controller.js → refreshToken()
    ↓
authService.refreshAccessToken(token)
    ↓
STEP 1: Find refresh token in database
    🔵 const storedToken = await RefreshToken.findOne({ token })
    ↓
    🟡 if (!storedToken) → throw { status: 401, message: 'Invalid refresh Token' }
    ↓
    🟢 Token found in database
    ↓
STEP 2: Verify refresh token signature
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET)
    ↓
STEP 3: Find user
    🔵 const user = await User.findById(decoded.id)
    ↓
STEP 4: Generate new access token
    const newAccessToken = jwt.sign(
        { id: user._id, role: user.role },
        JWT_SECRET,
        { expiresIn: '15m' }
    )
    ↓
📥 HTTP/1.1 200 OK
   {
     "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   }

┌─────────────────────────────────────────────────────────────────────┐
│ CLIENT SIDE                                                         │
└─────────────────────────────────────────────────────────────────────┘

Store new access token:
    localStorage.setItem('accessToken', newAccessToken)
    ↓
Retry original request with new token:
    📤 GET http://localhost:5000/api/cart
       Headers: { Authorization: "Bearer <new_token>" }
    ↓
✅ Request succeeds with new token
```

---

## 2. Product/Menu Flows

### 2.1 Get All Products (Public - Success)

```
┌─────────────────────────────────────────────────────────────────────┐
│ CLIENT SIDE                                                         │
└─────────────────────────────────────────────────────────────────────┘

User navigates to /menu
    ↓
Menu.jsx component mounts
    ↓
useEffect(() => { loadProducts() }, [])
    ↓
productService.getAllProducts()
    ↓
📤 GET http://localhost:5000/api/products
   (No authentication required - public endpoint)

┌─────────────────────────────────────────────────────────────────────┐
│ SERVER SIDE                                                         │
└─────────────────────────────────────────────────────────────────────┘

Request → CORS → JSON Parser → Router
    ↓
Router: /api/products → product.routes.js
    ↓
Route: GET / → getAllProducts (NO MIDDLEWARE)
    ↓
product.controller.js → getAllProducts()
    ↓
productService.getAllProducts()
    ↓
🔵 const products = await Product.find({ is_available: true })
    ↓
MongoDB Query:
    db.products.find({ is_available: true })
    ↓
Returns 48 products
    ↓
📥 HTTP/1.1 200 OK
   [
     {
       "_id": "65f1a2b3c4d5e6f7g8h9i0j3",
       "name": "Chicken Momo",
       "description": "Steamed dumplings filled with chicken",
       "price": 150,
       "category": "Nepali",
       "is_available": true,
       "image_url": "https://example.com/momo.jpg"
     },
     { ... 47 more products ... }
   ]

┌─────────────────────────────────────────────────────────────────────┐
│ CLIENT SIDE                                                         │
└─────────────────────────────────────────────────────────────────────┘

productService returns data
    ↓
Component updates state:
    setProducts(data)
    ↓
Group products by category:
    const grouped = {
      Nepali: [...],
      Fusion: [...],
      Western: [...],
      Snacks: [...],
      Desserts: [...],
      Drinks: [...]
    }
    ↓
Render ProductCard components for each product
    ↓
✅ Menu displayed with all available products
```

---

### 2.2 Create Product (Admin Only - Success)

```
┌─────────────────────────────────────────────────────────────────────┐
│ CLIENT SIDE                                                         │
└─────────────────────────────────────────────────────────────────────┘

Admin fills product form on /admin/products
    ↓
📤 POST http://localhost:5000/api/products
   Headers: {
     Authorization: "Bearer <admin_token>",
     Content-Type: "application/json"
   }
   Body: {
     "name": "Veg Momo",
     "description": "Steamed dumplings with vegetables",
     "price": 120,
     "category": "Nepali",
     "is_available": true,
     "image_url": "https://example.com/vegmomo.jpg"
   }

┌─────────────────────────────────────────────────────────────────────┐
│ SERVER SIDE                                                         │
└─────────────────────────────────────────────────────────────────────┘

Request → CORS → JSON Parser → Router
    ↓
Route: POST /products → authorize('admin') → createProduct
    ↓
⚙️  authorize('admin') Middleware:
    ↓
    Extract token from Authorization header
    ↓
    const decoded = jwt.verify(token, JWT_SECRET)
    // decoded = { id: "admin_id", role: "admin", ... }
    ↓
    req.user = { id: decoded.id, role: decoded.role }
    ↓
    🟡 Check role: if (req.user.role !== 'admin')
        → return 403 Forbidden
    ↓
    🟢 req.user.role === 'admin' ✓
    ↓
    next() → proceed to controller
    ↓
product.controller.js → createProduct()
    ↓
productService.createProduct(productData)
    ↓
🔵 const product = await Product.create({
    name: "Veg Momo",
    description: "Steamed dumplings with vegetables",
    price: 120,
    category: "Nepali",
    is_available: true,
    image_url: "https://example.com/vegmomo.jpg"
})
    ↓
MongoDB: INSERT INTO products
    ↓
📥 HTTP/1.1 201 Created
   {
     "_id": "65f1a2b3c4d5e6f7g8h9i0j5",
     "name": "Veg Momo",
     "description": "Steamed dumplings with vegetables",
     "price": 120,
     "category": "Nepali",
     "is_available": true,
     "image_url": "https://example.com/vegmomo.jpg",
     "createdAt": "2026-02-25T11:00:00.000Z",
     "updatedAt": "2026-02-25T11:00:00.000Z"
   }

┌─────────────────────────────────────────────────────────────────────┐
│ CLIENT SIDE                                                         │
└─────────────────────────────────────────────────────────────────────┘

Update products list:
    setProducts([...products, newProduct])
    ↓
Show success notification
    ↓
✅ Product created and visible in menu
```

---

### 2.3 Create Product (Error - Not Admin)

```
┌─────────────────────────────────────────────────────────────────────┐
│ CLIENT SIDE                                                         │
└─────────────────────────────────────────────────────────────────────┘

Customer tries to create product (shouldn't happen in UI, but possible via API)
    ↓
📤 POST http://localhost:5000/api/products
   Headers: { Authorization: "Bearer <customer_token>" }
   Body: { ... product data ... }

┌─────────────────────────────────────────────────────────────────────┐
│ SERVER SIDE                                                         │
└─────────────────────────────────────────────────────────────────────┘

Request → Router → authorize('admin') middleware
    ↓
Extract and verify token
    ↓
req.user = { id: "customer_id", role: "customer" }
    ↓
🔴 Check role: req.user.role !== 'admin'
    ↓
return res.status(403).json({
    message: 'Access denied. Required role: admin'
})
    ↓
📥 HTTP/1.1 403 Forbidden
   {
     "message": "Access denied. Required role: admin"
   }
    ↓
Controller never executes
Product not created

┌─────────────────────────────────────────────────────────────────────┐
│ CLIENT SIDE                                                         │
└─────────────────────────────────────────────────────────────────────┘

Error caught:
    🔴 "Access denied. Required role: admin"
    ↓
Display error message
```

---

## 3. Cart Management Flows

### 3.1 Add Item to Cart (Success)

```
┌─────────────────────────────────────────────────────────────────────┐
│ CLIENT SIDE                                                         │
└─────────────────────────────────────────────────────────────────────┘

User clicks "Add to Cart" on Chicken Momo
    ↓
Menu.jsx → handleAddToCart(productId, quantity)
    ↓
cartService.addItem(productId, 1)
    ↓
📤 POST http://localhost:5000/api/cart/items
   Headers: { Authorization: "Bearer <token>" }
   Body: {
     "product_id": "65f1a2b3c4d5e6f7g8h9i0j3",
     "quantity": 1
   }

┌─────────────────────────────────────────────────────────────────────┐
│ SERVER SIDE                                                         │
└─────────────────────────────────────────────────────────────────────┘

Request → Router → authorize('customer') → addItemToCart
    ↓
⚙️  authorize('customer') verifies token
    req.user = { id: "user_id", role: "customer" }
    ↓
cart.controller.js → addItemToCart()
    Extract: product_id, quantity from req.body
    Extract: userId from req.user.id
    ↓
    Validate: if (!product_id || !quantity) → 400 Bad Request
    ↓
    Call: cartService.addItemtoCart(userId, product_id, quantity)

┌─────────────────────────────────────────────────────────────────────┐
│ SERVICE LAYER                                                       │
└─────────────────────────────────────────────────────────────────────┘

cartService.addItemtoCart(userId, productId, quantity):
    
    STEP 1: Validate product exists
    ↓
    🔵 const product = await Product.findById(productId)
    ↓
    🟡 if (!product) → throw { status: 404, message: 'Product not found' }
    ↓
    🟢 Product found
    ↓
    STEP 2: Check availability
    ↓
    🟡 if (!product.is_available)
        → throw { status: 400, message: 'Product is not available' }
    ↓
    🟢 Product is available
    ↓
    STEP 3: Get or create cart
    ↓
    🔵 let cart = await Cart.findOne({ user_id: userId })
    ↓
    🟡 if (!cart) {
        cart = await Cart.create({ user_id: userId, items: [] })
    }
    ↓
    STEP 4: Check if product already in cart
    ↓
    const existingItemIndex = cart.items.findIndex(
        item => item.product_id.toString() === productId
    )
    ↓
    🟡 if (existingItemIndex > -1) {
        // Product exists → Update quantity
        cart.items[existingItemIndex].quantity += quantity
    } else {
        // New product → Add to cart
        cart.items.push({
            product_id: productId,
            quantity: quantity,
            unit_price: product.price
        })
    }
    ↓
    STEP 5: Save cart
    ↓
    🔵 await cart.save()
    ↓
    STEP 6: Return populated cart
    ↓
    🔵 return await Cart.findOne({ user_id: userId })
                        .populate('items.product_id')

┌─────────────────────────────────────────────────────────────────────┐
│ RESPONSE                                                            │
└─────────────────────────────────────────────────────────────────────┘

📥 HTTP/1.1 200 OK
   {
     "_id": "cart_id",
     "user_id": "user_id",
     "items": [
       {
         "_id": "item_id",
         "product_id": {
           "_id": "65f1a2b3c4d5e6f7g8h9i0j3",
           "name": "Chicken Momo",
           "price": 150,
           "category": "Nepali",
           "is_available": true
         },
         "quantity": 1,
         "unit_price": 150
       }
     ],
     "createdAt": "2026-02-25T10:00:00.000Z",
     "updatedAt": "2026-02-25T10:30:00.000Z"
   }

┌─────────────────────────────────────────────────────────────────────┐
│ CLIENT SIDE                                                         │
└─────────────────────────────────────────────────────────────────────┘

Update cart state:
    setCart(data)
    ↓
Update cart badge:
    cartItemCount = data.items.length
    ↓
Show success notification:
    ✅ "Item added to cart"
```

---

### 3.2 Add Item to Cart (Error - Product Not Available)

```
Same flow until SERVICE LAYER STEP 2:

STEP 2: Check availability
    ↓
    🔴 product.is_available === false
    ↓
    throw { status: 400, message: 'Product is not available' }
    ↓
Controller catches error:
    catch (error) {
        res.status(400).json({ message: 'Product is not available' })
    }
    ↓
📥 HTTP/1.1 400 Bad Request
   { "message": "Product is not available" }
    ↓
CLIENT: Display error
    🔴 "Product is not available"
```

---

### 3.3 Update Cart Item Quantity

```
┌─────────────────────────────────────────────────────────────────────┐
│ CLIENT SIDE                                                         │
└─────────────────────────────────────────────────────────────────────┘

User changes quantity in cart (e.g., 1 → 3)
    ↓
Cart.jsx → handleUpdateQuantity(productId, newQuantity)
    ↓
📤 PATCH http://localhost:5000/api/cart/items/65f1a2b3c4d5e6f7g8h9i0j3
   Headers: { Authorization: "Bearer <token>" }
   Body: { "quantity": 3 }

┌─────────────────────────────────────────────────────────────────────┐
│ SERVER SIDE                                                         │
└─────────────────────────────────────────────────────────────────────┘

Router → authorize('customer') → updateItemQuantity
    ↓
cart.controller.js:
    Extract: productId from req.params
    Extract: quantity from req.body
    Extract: userId from req.user.id
    ↓
    Validate: if (!quantity) → 400 Bad Request
    ↓
cartService.updateItemQuantity(userId, productId, quantity):
    
    STEP 1: Get cart
    🔵 const cart = await Cart.findOne({ user_id: userId })
    ↓
    STEP 2: Find item in cart
    const itemIndex = cart.items.findIndex(
        item => item.product_id.toString() === productId
    )
    ↓
    🟡 if (itemIndex === -1)
        → throw { status: 404, message: 'Item not found in cart' }
    ↓
    🟢 Item found
    ↓
    STEP 3: Update or remove
    🟡 if (quantity <= 0) {
        // Remove item
        cart.items.splice(itemIndex, 1)
    } else {
        // Update quantity
        cart.items[itemIndex].quantity = quantity
    }
    ↓
    STEP 4: Save and return
    🔵 await cart.save()
    return await Cart.findOne({ user_id: userId }).populate('items.product_id')
    ↓
📥 HTTP/1.1 200 OK
   { cart with updated quantity }
    ↓
CLIENT: Update UI with new cart state
```

---

### 3.4 Remove Item from Cart

```
┌─────────────────────────────────────────────────────────────────────┐
│ CLIENT SIDE                                                         │
└─────────────────────────────────────────────────────────────────────┘

User clicks "Remove" button
    ↓
📤 DELETE http://localhost:5000/api/cart/items/65f1a2b3c4d5e6f7g8h9i0j3
   Headers: { Authorization: "Bearer <token>" }

┌─────────────────────────────────────────────────────────────────────┐
│ SERVER SIDE                                                         │
└─────────────────────────────────────────────────────────────────────┘

cartService.removeItemFromCart(userId, productId):
    
    Get cart
    ↓
    Filter out the item:
    cart.items = cart.items.filter(
        item => item.product_id.toString() !== productId
    )
    ↓
    🔵 await cart.save()
    ↓
📥 HTTP/1.1 200 OK
   { cart without removed item }
    ↓
CLIENT: Update cart state, show notification
```

---

### 3.5 Clear Entire Cart

```
┌─────────────────────────────────────────────────────────────────────┐
│ CLIENT SIDE                                                         │
└─────────────────────────────────────────────────────────────────────┘

User clicks "Clear Cart"
    ↓
📤 DELETE http://localhost:5000/api/cart
   Headers: { Authorization: "Bearer <token>" }

┌─────────────────────────────────────────────────────────────────────┐
│ SERVER SIDE                                                         │
└─────────────────────────────────────────────────────────────────────┘

cartService.clearCart(userId):
    
    🔵 const cart = await Cart.findOne({ user_id: userId })
    ↓
    🟡 if (!cart) → throw { status: 404, message: 'Cart not found' }
    ↓
    cart.items = []
    ↓
    🔵 await cart.save()
    ↓
📥 HTTP/1.1 200 OK
   {
     "message": "Cart cleared",
     "cart": { items: [] }
   }
    ↓
CLIENT: Reset cart state to empty
```

---

## 4. Order Placement Flows

### 4.1 Place Order (Success)

```
┌─────────────────────────────────────────────────────────────────────┐
│ CLIENT SIDE                                                         │
└─────────────────────────────────────────────────────────────────────┘

User reviews cart and clicks "Place Order"
    ↓
Cart.jsx → handlePlaceOrder()
    ↓
orderService.createOrder({ delivery_address })
    ↓
📤 POST http://localhost:5000/api/orders
   Headers: { Authorization: "Bearer <token>" }
   Body: {
     "delivery_address": "123 Main Street, Kathmandu"
   }

┌─────────────────────────────────────────────────────────────────────┐
│ SERVER SIDE                                                         │
└─────────────────────────────────────────────────────────────────────┘

Router → authorize('customer') → createOrder
    ↓
order.controller.js:
    Extract: delivery_address from req.body
    Extract: userId from req.user.id
    ↓
    Validate: if (!delivery_address) → 400 Bad Request
    ↓
orderService.createOrder(userId, delivery_address):

    
    STEP 1: Fetch user's cart
    ↓
    🔵 const cart = await Cart.findOne({ user_id: userId })
                              .populate('items.product_id')
    ↓
    STEP 2: Validate cart not empty
    ↓
    🟡 if (!cart || cart.items.length === 0)
        → throw { status: 400, message: 'Cart is empty' }
    ↓
    🟢 Cart has items
    ↓
    STEP 3: Calculate total amount
    ↓
    let total = 0
    for (const item of cart.items) {
        total += item.quantity * item.unit_price
    }
    // Example: (2 × 150) + (1 × 200) = 500
    ↓
    STEP 4: Create order document
    ↓
    🔵 const order = await Order.create({
        user_id: userId,
        items: cart.items.map(item => ({
            product_id: item.product_id._id,
            quantity: item.quantity,
            unit_price: item.unit_price
        })),
        total_amount: total,
        status: 'pending',
        delivery_address: delivery_address
    })
    ↓
    MongoDB: INSERT INTO orders
    ↓
    STEP 5: Clear user's cart
    ↓
    🔵 await Cart.updateOne(
        { user_id: userId },
        { $set: { items: [] } }
    )
    ↓
    STEP 6: Return populated order
    ↓
    🔵 return await Order.findById(order._id)
                         .populate('user_id')
                         .populate('items.product_id')

┌─────────────────────────────────────────────────────────────────────┐
│ RESPONSE                                                            │
└─────────────────────────────────────────────────────────────────────┘

📥 HTTP/1.1 201 Created
   {
     "_id": "order_id",
     "user_id": {
       "_id": "user_id",
       "name": "John Doe",
       "email": "john@example.com"
     },
     "items": [
       {
         "product_id": {
           "_id": "product_id",
           "name": "Chicken Momo",
           "price": 150
         },
         "quantity": 2,
         "unit_price": 150
       },
       {
         "product_id": {
           "_id": "product_id_2",
           "name": "Dal Bhat",
           "price": 200
         },
         "quantity": 1,
         "unit_price": 200
       }
     ],
     "total_amount": 500,
     "status": "pending",
     "delivery_address": "123 Main Street, Kathmandu",
     "createdAt": "2026-02-25T11:00:00.000Z",
     "updatedAt": "2026-02-25T11:00:00.000Z"
   }

┌─────────────────────────────────────────────────────────────────────┐
│ CLIENT SIDE                                                         │
└─────────────────────────────────────────────────────────────────────┘

Order created successfully
    ↓
Clear cart state:
    setCart({ items: [] })
    ↓
Navigate to /orders
    ↓
Show success notification:
    ✅ "Order placed successfully! Order ID: order_id"
    ↓
Display order details with status: "pending"
```

---

### 4.2 Place Order (Error - Empty Cart)

```
Same flow until SERVICE STEP 2:

STEP 2: Validate cart not empty
    ↓
    🔴 cart.items.length === 0
    ↓
    throw { status: 400, message: 'Cart is empty' }
    ↓
📥 HTTP/1.1 400 Bad Request
   { "message": "Cart is empty" }
    ↓
CLIENT: Display error
    🔴 "Cart is empty. Please add items before placing order."
```

---

## 5. Order Management Flows

### 5.1 Get My Orders (Customer)

```
┌─────────────────────────────────────────────────────────────────────┐
│ CLIENT SIDE                                                         │
└─────────────────────────────────────────────────────────────────────┘

User navigates to /orders
    ↓
Orders.jsx component mounts
    ↓
orderService.getMyOrders()
    ↓
📤 GET http://localhost:5000/api/orders
   Headers: { Authorization: "Bearer <token>" }

┌─────────────────────────────────────────────────────────────────────┐
│ SERVER SIDE                                                         │
└─────────────────────────────────────────────────────────────────────┘

Router → authorize('customer') → getMyOrders
    ↓
order.controller.js:
    Extract: userId from req.user.id
    ↓
orderService.getMyOrders(userId):
    
    🔵 const orders = await Order.find({ user_id: userId })
                                 .populate('items.product_id')
                                 .sort({ createdAt: -1 })
    ↓
    MongoDB: SELECT * FROM orders WHERE user_id = ? ORDER BY createdAt DESC
    ↓
📥 HTTP/1.1 200 OK
   [
     {
       "_id": "order_id_1",
       "user_id": "user_id",
       "items": [...],
       "total_amount": 500,
       "status": "delivered",
       "delivery_address": "123 Main St",
       "createdAt": "2026-02-24T10:00:00.000Z"
     },
     {
       "_id": "order_id_2",
       "user_id": "user_id",
       "items": [...],
       "total_amount": 300,
       "status": "pending",
       "delivery_address": "456 Second St",
       "createdAt": "2026-02-25T11:00:00.000Z"
     }
   ]

┌─────────────────────────────────────────────────────────────────────┐
│ CLIENT SIDE                                                         │
└─────────────────────────────────────────────────────────────────────┘

Display orders list:
    - Most recent first
    - Show status badges (pending, confirmed, preparing, delivered)
    - Show total amount
    - Show order date
    ↓
✅ User can see all their order history
```

---

### 5.2 Cancel Order (Customer - Success)

```
┌─────────────────────────────────────────────────────────────────────┐
│ CLIENT SIDE                                                         │
└─────────────────────────────────────────────────────────────────────┘

User clicks "Cancel" on pending order
    ↓
📤 DELETE http://localhost:5000/api/orders/order_id
   Headers: { Authorization: "Bearer <token>" }

┌─────────────────────────────────────────────────────────────────────┐
│ SERVER SIDE                                                         │
└─────────────────────────────────────────────────────────────────────┘

Router → authorize('customer') → cancelOrder
    ↓
order.controller.js:
    Extract: orderId from req.params.id
    Extract: userId from req.user.id
    ↓
orderService.cancelOrder(userId, orderId):
    
    STEP 1: Find order
    ↓
    🔵 const order = await Order.findById(orderId)
    ↓
    🟡 if (!order) → throw { status: 404, message: 'Order not found' }
    ↓
    🟢 Order found
    ↓
    STEP 2: Verify ownership
    ↓
    🟡 if (order.user_id.toString() !== userId)
        → throw { status: 403, message: 'Access denied. This is not your order.' }
    ↓
    🟢 User owns this order
    ↓
    STEP 3: Check if cancellable
    ↓
    🟡 if (order.status !== 'pending')
        → throw { status: 400, message: 'Cannot cancel order. Order is already confirmed/preparing/delivered.' }
    ↓
    🟢 Order is still pending
    ↓
    STEP 4: Update status
    ↓
    order.status = 'cancelled'
    🔵 await order.save()
    ↓
📥 HTTP/1.1 200 OK
   {
     "message": "Order cancelled successfully",
     "order": {
       "_id": "order_id",
       "status": "cancelled",
       "updatedAt": "2026-02-25T11:45:00.000Z"
     }
   }

┌─────────────────────────────────────────────────────────────────────┐
│ CLIENT SIDE                                                         │
└─────────────────────────────────────────────────────────────────────┘

Update order in list:
    order.status = 'cancelled'
    ↓
Show notification:
    ✅ "Order cancelled successfully"
```

---

### 5.3 Cancel Order (Error - Already Confirmed)

```
Same flow until SERVICE STEP 3:

STEP 3: Check if cancellable
    ↓
    🔴 order.status === 'confirmed' (or 'preparing' or 'delivered')
    ↓
    throw { status: 400, message: 'Cannot cancel order. Order is already confirmed/preparing/delivered.' }
    ↓
📥 HTTP/1.1 400 Bad Request
   { "message": "Cannot cancel order. Order is already confirmed/preparing/delivered." }
    ↓
CLIENT: Display error
    🔴 "Cannot cancel this order. It has already been confirmed."
```

---

### 5.4 Get All Orders (Admin)

```
┌─────────────────────────────────────────────────────────────────────┐
│ CLIENT SIDE                                                         │
└─────────────────────────────────────────────────────────────────────┘

Admin navigates to /admin/orders
    ↓
📤 GET http://localhost:5000/api/orders/admin/all
   Headers: { Authorization: "Bearer <admin_token>" }

┌─────────────────────────────────────────────────────────────────────┐
│ SERVER SIDE                                                         │
└─────────────────────────────────────────────────────────────────────┘

Router → authorize('admin') → getAllOrders
    ↓
⚙️  authorize('admin') verifies:
    req.user.role === 'admin' ✓
    ↓
order.controller.js → getAllOrders()
    ↓
orderService.getAllOrders():
    
    🔵 const orders = await Order.find()
                                 .populate('user_id')
                                 .populate('items.product_id')
                                 .sort({ createdAt: -1 })
    ↓
    MongoDB: SELECT * FROM orders (all orders from all users)
    ↓
📥 HTTP/1.1 200 OK
   [
     {
       "_id": "order_id_1",
       "user_id": {
         "_id": "user_id_1",
         "name": "John Doe",
         "email": "john@example.com"
       },
       "items": [...],
       "total_amount": 500,
       "status": "pending",
       "createdAt": "2026-02-25T11:00:00.000Z"
     },
     {
       "_id": "order_id_2",
       "user_id": {
         "_id": "user_id_2",
         "name": "Jane Smith",
         "email": "jane@example.com"
       },
       "items": [...],
       "total_amount": 300,
       "status": "confirmed",
       "createdAt": "2026-02-25T10:00:00.000Z"
     }
     // ... all orders from all customers
   ]

┌─────────────────────────────────────────────────────────────────────┐
│ CLIENT SIDE                                                         │
└─────────────────────────────────────────────────────────────────────┘

Display all orders with:
    - Customer name and email
    - Order items
    - Status
    - Total amount
    - Action buttons (Update Status)
    ↓
✅ Admin can see and manage all orders
```

---

### 5.5 Update Order Status (Admin)

```
┌─────────────────────────────────────────────────────────────────────┐
│ CLIENT SIDE                                                         │
└─────────────────────────────────────────────────────────────────────┘

Admin selects new status from dropdown
    ↓
📤 PATCH http://localhost:5000/api/orders/order_id/status
   Headers: { Authorization: "Bearer <admin_token>" }
   Body: { "status": "confirmed" }

┌─────────────────────────────────────────────────────────────────────┐
│ SERVER SIDE                                                         │
└─────────────────────────────────────────────────────────────────────┘

Router → authorize('admin') → updateOrderStatus
    ↓
order.controller.js:
    Extract: orderId from req.params.id
    Extract: status from req.body
    ↓
    Validate: if (!status) → 400 Bad Request
    ↓
orderService.updateOrderStatus(orderId, status):
    
    STEP 1: Find order
    ↓
    🔵 const order = await Order.findById(orderId)
    ↓
    🟡 if (!order) → throw { status: 404, message: 'Order not found' }
    ↓
    🟢 Order found
    ↓
    STEP 2: Validate status value
    ↓
    const validStatuses = ['pending', 'confirmed', 'preparing', 'delivered', 'cancelled']
    🟡 if (!validStatuses.includes(status))
        → throw { status: 400, message: 'Invalid status value' }
    ↓
    🟢 Status is valid
    ↓
    STEP 3: Update status
    ↓
    order.status = status
    🔵 await order.save()
    ↓
    STEP 4: Return populated order
    ↓
    🔵 return await Order.findById(orderId)
                         .populate('user_id')
                         .populate('items.product_id')
    ↓
📥 HTTP/1.1 200 OK
   {
     "_id": "order_id",
     "user_id": { ... },
     "items": [...],
     "total_amount": 500,
     "status": "confirmed",  ← Updated
     "updatedAt": "2026-02-25T12:00:00.000Z"
   }

┌─────────────────────────────────────────────────────────────────────┐
│ CLIENT SIDE                                                         │
└─────────────────────────────────────────────────────────────────────┘

Update order in list:
    order.status = 'confirmed'
    ↓
Show notification:
    ✅ "Order status updated to confirmed"
    ↓
Customer sees updated status in their orders page
```

---

## 6. User Profile Flows

### 6.1 Get My Profile

```
┌─────────────────────────────────────────────────────────────────────┐
│ CLIENT SIDE                                                         │
└─────────────────────────────────────────────────────────────────────┘

User navigates to /profile
    ↓
📤 GET http://localhost:5000/api/users/me
   Headers: { Authorization: "Bearer <token>" }

┌─────────────────────────────────────────────────────────────────────┐
│ SERVER SIDE                                                         │
└─────────────────────────────────────────────────────────────────────┘

Router → authorize('customer') → getMyProfile
    ↓
user.controller.js:
    Extract: userId from req.user.id
    ↓
userService.getUserById(userId):
    
    🔵 const user = await User.findById(userId).select('-password')
    //                                          ↑
    //                          Exclude password from response
    ↓
    🟡 if (!user) → throw { status: 404, message: 'User not found' }
    ↓
📥 HTTP/1.1 200 OK
   {
     "_id": "user_id",
     "name": "John Doe",
     "email": "john@example.com",
     "role": "customer",
     "phone": "1234567890",
     "createdAt": "2026-02-20T10:00:00.000Z",
     "updatedAt": "2026-02-25T10:00:00.000Z"
   }
   // Note: password field is NOT included

┌─────────────────────────────────────────────────────────────────────┐
│ CLIENT SIDE                                                         │
└─────────────────────────────────────────────────────────────────────┘

Display profile form with user data pre-filled
```

---

### 6.2 Update My Profile

```
┌─────────────────────────────────────────────────────────────────────┐
│ CLIENT SIDE                                                         │
└─────────────────────────────────────────────────────────────────────┘

User updates name and phone
    ↓
📤 PATCH http://localhost:5000/api/users/me
   Headers: { Authorization: "Bearer <token>" }
   Body: {
     "name": "John Smith",
     "phone": "9876543210"
   }

┌─────────────────────────────────────────────────────────────────────┐
│ SERVER SIDE                                                         │
└─────────────────────────────────────────────────────────────────────┘

Router → authorize('customer') → updateMyProfile
    ↓
user.controller.js:
    Extract: userId from req.user.id
    Extract: updateData from req.body
    ↓
userService.updateUser(userId, updateData):
    
    🔵 const user = await User.findByIdAndUpdate(
        userId,
        { name: "John Smith", phone: "9876543210" },
        { new: true, runValidators: true }
    ).select('-password')
    //  ↑                    ↑
    //  Return updated doc   Run schema validation
    ↓
📥 HTTP/1.1 200 OK
   {
     "_id": "user_id",
     "name": "John Smith",  ← Updated
     "email": "john@example.com",
     "role": "customer",
     "phone": "9876543210",  ← Updated
     "updatedAt": "2026-02-25T12:00:00.000Z"
   }

┌─────────────────────────────────────────────────────────────────────┐
│ CLIENT SIDE                                                         │
└─────────────────────────────────────────────────────────────────────┘

Update user state:
    setUser(updatedUser)
    ↓
Update localStorage:
    localStorage.setItem('user', JSON.stringify(updatedUser))
    ↓
Show notification:
    ✅ "Profile updated successfully"
```

---

## 7. Restaurant Info Flows

### 7.1 Get Restaurant Info (Public)

```
┌─────────────────────────────────────────────────────────────────────┐
│ CLIENT SIDE                                                         │
└─────────────────────────────────────────────────────────────────────┘

User visits homepage or about page
    ↓
📤 GET http://localhost:5000/api/restaurant
   (No authentication required)

┌─────────────────────────────────────────────────────────────────────┐
│ SERVER SIDE                                                         │
└─────────────────────────────────────────────────────────────────────┘

Router → getRestaurantInfo (NO MIDDLEWARE)
    ↓
restaurant.controller.js → getRestaurantInfo()
    ↓
restaurantService.getRestaurantInfo():
    
    🔵 const restaurant = await Restaurant.findOne()
    ↓
📥 HTTP/1.1 200 OK
   {
     "_id": "restaurant_id",
     "name": "Nepali Fusion Restaurant",
     "description": "Authentic Nepali cuisine with a modern twist",
     "address": "Thamel, Kathmandu, Nepal",
     "phone": "+977-1-4567890",
     "email": "info@nepalifusion.com",
     "opening_hours": {
       "monday": "10:00 AM - 10:00 PM",
       "tuesday": "10:00 AM - 10:00 PM",
       ...
     }
   }

┌─────────────────────────────────────────────────────────────────────┐
│ CLIENT SIDE                                                         │
└─────────────────────────────────────────────────────────────────────┘

Display restaurant information:
    - Name, description
    - Contact details
    - Opening hours
```

---

### 7.2 Update Restaurant Info (Admin Only)

```
┌─────────────────────────────────────────────────────────────────────┐
│ CLIENT SIDE                                                         │
└─────────────────────────────────────────────────────────────────────┘

Admin updates restaurant info
    ↓
📤 PATCH http://localhost:5000/api/restaurant
   Headers: { Authorization: "Bearer <admin_token>" }
   Body: {
     "phone": "+977-1-9999999",
     "description": "Best Nepali cuisine in town"
   }

┌─────────────────────────────────────────────────────────────────────┐
│ SERVER SIDE                                                         │
└─────────────────────────────────────────────────────────────────────┘

Router → authorize('admin') → updateRestaurantInfo
    ↓
⚙️  authorize('admin') verifies admin role
    ↓
restaurant.controller.js → updateRestaurantInfo()
    ↓
restaurantService.updateRestaurantInfo(updateData):
    
    🔵 const restaurant = await Restaurant.findOneAndUpdate(
        {},  // Find first restaurant document
        updateData,
        { new: true, runValidators: true }
    )
    ↓
📥 HTTP/1.1 200 OK
   {
     "_id": "restaurant_id",
     "name": "Nepali Fusion Restaurant",
     "description": "Best Nepali cuisine in town",  ← Updated
     "phone": "+977-1-9999999",  ← Updated
     ...
   }

┌─────────────────────────────────────────────────────────────────────┐
│ CLIENT SIDE                                                         │
└─────────────────────────────────────────────────────────────────────┘

Update restaurant state
Show notification:
    ✅ "Restaurant information updated"
```

---

## 8. Admin Operations Flows

### 8.1 Get All Users (Admin Only)

```
┌─────────────────────────────────────────────────────────────────────┐
│ CLIENT SIDE                                                         │
└─────────────────────────────────────────────────────────────────────┘

Admin navigates to /admin/users
    ↓
📤 GET http://localhost:5000/api/users
   Headers: { Authorization: "Bearer <admin_token>" }

┌─────────────────────────────────────────────────────────────────────┐
│ SERVER SIDE                                                         │
└─────────────────────────────────────────────────────────────────────┘

Router → authorize('admin') → getAllUsers
    ↓
user.controller.js → getAllUsers()
    ↓
userService.getAllUsers():
    
    🔵 const users = await User.find().select('-password')
    ↓
📥 HTTP/1.1 200 OK
   [
     {
       "_id": "user_id_1",
       "name": "John Doe",
       "email": "john@example.com",
       "role": "customer",
       "createdAt": "2026-02-20T10:00:00.000Z"
     },
     {
       "_id": "user_id_2",
       "name": "Jane Smith",
       "email": "jane@example.com",
       "role": "customer",
       "createdAt": "2026-02-21T10:00:00.000Z"
     },
     {
       "_id": "admin_id",
       "name": "Admin User",
       "email": "admin@example.com",
       "role": "admin",
       "createdAt": "2026-02-15T10:00:00.000Z"
     }
   ]

┌─────────────────────────────────────────────────────────────────────┐
│ CLIENT SIDE                                                         │
└─────────────────────────────────────────────────────────────────────┘

Display users table with:
    - Name, email, role
    - Registration date
    - Total orders count (if available)
```

---

## Summary: Complete Request Flow Pattern

```
┌─────────────────────────────────────────────────────────────────────┐
│ EVERY REQUEST FOLLOWS THIS PATTERN                                 │
└─────────────────────────────────────────────────────────────────────┘

CLIENT (React Component)
    ↓
Service Layer (API call with axios)
    ↓
📤 HTTP Request (with headers, body, params)
    ↓
EXPRESS SERVER
    ↓
⚙️  CORS Middleware
    ↓
⚙️  JSON Parser Middleware
    ↓
Router (URL matching)
    ↓
⚙️  Auth Middleware (if protected route)
    │   - Extract token
    │   - Verify signature
    │   - Check expiration
    │   - Attach req.user
    │   - Check role authorization
    ↓
Controller (Request handler)
    │   - Extract data from req
    │   - Validate input
    │   - Call service
    │   - Handle errors
    │   - Send response
    ↓
Service (Business logic)
    │   - Validate business rules
    │   - Database operations
    │   - Data transformation
    │   - Return data or throw error
    ↓
Model (Mongoose)
    │   - Schema validation
    │   - Database query
    │   - Return documents
    ↓
MongoDB (Database)
    │   - Store/retrieve data
    │   - Return results
    ↓
Response flows back up the chain
    ↓
📥 HTTP Response (JSON)
    ↓
CLIENT (React Component)
    │   - Update state
    │   - Re-render UI
    │   - Show notifications
```

---

## Key Decision Points Across All Flows

```
🟡 AUTHENTICATION DECISIONS:
   - Is token provided?
   - Is token valid and not expired?
   - Does user have required role?

🟡 VALIDATION DECISIONS:
   - Are required fields present?
   - Is data format correct?
   - Does resource exist?

🟡 AUTHORIZATION DECISIONS:
   - Does user own this resource?
   - Can user perform this action?
   - Is resource in correct state?

🟡 BUSINESS LOGIC DECISIONS:
   - Is product available?
   - Is cart empty?
   - Can order be cancelled?
   - Is status transition valid?
```

---

## Error Handling Pattern (All Scenarios)

```
┌─────────────────────────────────────────────────────────────────────┐
│ ERROR OCCURS IN ANY LAYER                                          │
└─────────────────────────────────────────────────────────────────────┘

Service/Middleware throws error:
    throw { status: 400, message: 'Error description' }
    ↓
Controller catches in try/catch:
    catch (error) {
        const status = error.status || 500
        res.status(status).json({ message: error.message })
    }
    ↓
📥 HTTP Error Response:
    HTTP/1.1 [status code]
    { "message": "Error description" }
    ↓
Axios catches error:
    .catch(error => {
        const message = error.response?.data?.message || 'Operation failed'
    })
    ↓
Component displays error:
    setError(message)
    🔴 Error shown to user
```

---

**End of Complete Developer Flow Documentation**

This document covers all possible request/response scenarios in the Restaurant Order Management System, showing the complete journey from client to server and back for every feature.
