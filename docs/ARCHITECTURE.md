np# 🏗️ Architecture Overview

## 🎯 Single Port Architecture (Production)

```
Browser (http://localhost:5000)
         │
         ▼
┌────────────────────────────────────┐
│   Express Server (Port 5000)       │
│                                     │
│  ┌──────────────────────────────┐  │
│  │  Route Handler               │  │
│  │                              │  │
│  │  /api/*  → API Routes        │  │
│  │  /*      → React App (SPA)   │  │
│  └──────────────────────────────┘  │
│                                     │
│  ┌──────────────────────────────┐  │
│  │  API Routes                  │  │
│  │  - /api/auth                 │  │
│  │  - /api/products             │  │
│  │  - /api/cart                 │  │
│  │  - /api/orders               │  │
│  │  - /api/users                │  │
│  │  - /api/restaurant           │  │
│  └──────────────────────────────┘  │
│                                     │
│  ┌──────────────────────────────┐  │
│  │  Static Files                │  │
│  │  Serves: client/dist/*       │  │
│  │  (Built React App)           │  │
│  └──────────────────────────────┘  │
└────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│      MongoDB Database              │
│  - users                           │
│  - products                        │
│  - carts                           │
│  - orders                          │
│  - restaurant                      │
└────────────────────────────────────┘
```

---

## 🔄 Request Flow

### API Request
```
Browser → http://localhost:5000/api/products
    ↓
Express checks route
    ↓
Matches /api/* → Routes to API handler
    ↓
Middleware: CORS, JSON parser
    ↓
Auth Middleware (if protected)
    ↓
Controller → Service → Model
    ↓
MongoDB Query
    ↓
Response JSON back to browser
```

### Page Request
```
Browser → http://localhost:5000/menu
    ↓
Express checks route
    ↓
No /api/* match → Catch-all route
    ↓
Serves: client/dist/index.html
    ↓
React Router takes over
    ↓
Renders Menu component
    ↓
Component calls API
    ↓
Fetch http://localhost:5000/api/products
    ↓
(Goes through API Request flow above)
```

---

## 📂 Project Structure

```
restaurant-order-management-system/
│
├── client/                          # React Frontend
│   ├── dist/                        # Built files (served by Express)
│   │   ├── index.html
│   │   └── assets/
│   │       ├── index-[hash].js
│   │       └── index-[hash].css
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   ├── context/                 # React Context (Auth)
│   │   ├── pages/                   # Route pages
│   │   ├── services/                # API calls
│   │   ├── App.jsx                  # Main app component
│   │   └── main.jsx                 # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── src/                             # Backend (Express + MongoDB)
│   ├── auth/
│   │   └── auth.middlewares.js      # JWT verification
│   ├── controllers/                 # Request handlers
│   │   ├── auth.controller.js
│   │   ├── product.controller.js
│   │   ├── cart.controller.js
│   │   ├── order.controller.js
│   │   └── user.controller.js
│   ├── models/                      # Mongoose schemas
│   │   ├── user.model.js
│   │   ├── product.model.js
│   │   ├── cart.model.js
│   │   ├── order.model.js
│   │   └── restaurant.model.js
│   ├── routes/                      # API endpoints
│   │   ├── auth.routes.js
│   │   ├── product.routes.js
│   │   ├── cart.routes.js
│   │   ├── order.routes.js
│   │   └── user.routes.js
│   ├── service/                     # Business logic
│   │   ├── auth.service.js
│   │   ├── product.service.js
│   │   ├── cart.service.js
│   │   ├── order.service.js
│   │   └── user.service.js
│   ├── utils/
│   │   └── jwt.js                   # Token generation
│   ├── .env                         # Environment variables
│   ├── app.js                       # Express app config
│   ├── server.js                    # Server entry point
│   └── package.json
│
├── frontend/                        # Legacy vanilla JS frontend
│   ├── index.html
│   ├── menu.html
│   ├── css/
│   └── js/
│
├── package.json                     # Root scripts
├── QUICK_START.md                   # How to run
├── DEPLOYMENT_GUIDE.md              # Deployment info
└── ARCHITECTURE.md                  # This file
```

---

## 🔐 Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    User Registration                         │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
    POST /api/auth/register { name, email, password }
                           │
                           ▼
              ┌────────────────────────┐
              │  auth.controller.js    │
              └────────────────────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │  auth.service.js       │
              │  - Check email exists  │
              │  - Hash password       │
              │  - Create user         │
              │  - Generate tokens     │
              └────────────────────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │  Response              │
              │  {                     │
              │    accessToken,        │
              │    refreshToken,       │
              │    user: {...}         │
              │  }                     │
              └────────────────────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │  Client stores tokens  │
              │  in localStorage       │
              └────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────┐
│                  Protected API Request                       │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
    GET /api/cart
    Headers: { Authorization: "Bearer <token>" }
                           │
                           ▼
              ┌────────────────────────┐
              │  verifyToken           │
              │  - Extract token       │
              │  - Verify signature    │
              │  - Check expiration    │
              │  - Attach user to req  │
              └────────────────────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │  authorize('customer') │
              │  - Check user.role     │
              └────────────────────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │  cart.controller.js    │
              │  - Access req.user.id  │
              └────────────────────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │  cart.service.js       │
              │  - Find cart by userId │
              └────────────────────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │  Response: cart data   │
              └────────────────────────┘
```

---

## 🛒 Order Placement Flow

```
Customer adds items to cart
         │
         ▼
POST /api/cart/items { product_id, quantity }
         │
         ▼
Cart stored in MongoDB (user_id: customer_id)
         │
         ▼
Customer clicks "Place Order"
         │
         ▼
POST /api/orders
         │
         ▼
┌────────────────────────────────────┐
│  order.service.js                  │
│  1. Fetch cart                     │
│  2. Validate cart not empty        │
│  3. Calculate total                │
│  4. Create order document          │
│  5. Clear cart                     │
│  6. Return order                   │
└────────────────────────────────────┘
         │
         ▼
Order saved with status: "pending"
         │
         ▼
Admin sees order in /admin/orders
         │
         ▼
Admin updates status: "confirmed" → "preparing" → "delivered"
```

---

## 🔑 Key Design Decisions

### Why Single Port in Production?
- Simpler deployment (one server to manage)
- No CORS issues
- Easier to configure reverse proxy
- Better for production environments

### Why Separate Ports in Development?
- Vite hot reload for instant feedback
- Backend and frontend can restart independently
- Better developer experience

### Why Layered Architecture?
```
Routes → Controllers → Services → Models
```
- Separation of concerns
- Easier to test
- Reusable business logic
- Clean code organization

### Why JWT Tokens?
- Stateless authentication
- Scalable (no server-side sessions)
- Works across multiple servers
- Mobile-friendly

### Why Context API?
- Global auth state without prop drilling
- Built into React (no extra library)
- Simple for this app's needs

---

## 🚀 Deployment Checklist

- [ ] Build React app: `npm run build`
- [ ] Set environment variables in production
- [ ] Configure MongoDB connection string
- [ ] Set strong JWT secrets
- [ ] Enable HTTPS
- [ ] Configure CORS for production domain
- [ ] Set up process manager (PM2)
- [ ] Configure reverse proxy (Nginx)
- [ ] Set up monitoring and logging
- [ ] Regular database backups
