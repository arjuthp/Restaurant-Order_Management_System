Here you go!

---

## 🔐 Auth Routes
`/api/auth`

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/admin/login
POST   /api/auth/logout
```

---

## 🏪 Restaurant Routes
`/api/restaurant`

```
GET    /api/restaurant
PATCH  /api/restaurant
```

---

## 🍔 Product Routes
`/api/products`

```
GET    /api/products
GET    /api/products/:id
POST   /api/products
PATCH  /api/products/:id
DELETE /api/products/:id
```

---

## 👤 User Routes
`/api/users`

```
GET    /api/users
GET    /api/users/me
PATCH  /api/users/me
DELETE /api/users/me
```

---

## 🛒 Cart Routes
`/api/cart`

```
GET    /api/cart
POST   /api/cart/items
PATCH  /api/cart/items/:productId
DELETE /api/cart/items/:productId
DELETE /api/cart
```

---

## 📦 Order Routes
`/api/orders`

```
POST   /api/orders
GET    /api/orders
GET    /api/orders/:id
GET    /api/orders/admin
PATCH  /api/orders/:id/status
DELETE /api/orders/:id
```

---

## 📁 Folder Structure
```
src/
├── routes/
│   ├── auth.routes.js
│   ├── restaurant.routes.js
│   ├── product.routes.js
│   ├── user.routes.js
│   ├── cart.routes.js
│   └── order.routes.js
```

---

## 🔌 Register in app.js
```js
app.use("/api/auth",       authRoutes)
app.use("/api/restaurant", restaurantRoutes)
app.use("/api/products",   productRoutes)
app.use("/api/users",      userRoutes)
app.use("/api/cart",       cartRoutes)
app.use("/api/orders",     orderRoutes)
```