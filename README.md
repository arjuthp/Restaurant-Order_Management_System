# 🍽️ Restaurant Order Management System

Full-stack restaurant order management system with React frontend and Node.js backend.

> ✨ **New:** Single-port production mode! Run everything on `http://localhost:5000` with `npm run prod`

## 📚 Documentation

- 📖 **[HOW_TO_USE.md](HOW_TO_USE.md)** - Quick usage guide
- 🚀 **[QUICK_START.md](QUICK_START.md)** - Fast setup reference
- 🏗️ **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture & flow diagrams
- 📦 **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Deployment details
- 🔄 **[DEVELOPER_FLOW_COMPLETE.md](DEVELOPER_FLOW_COMPLETE.md)** - Complete client-to-server flow for all scenarios
- 📦 **[SPA_STATIC_SERVING_EXPLAINED.md](SPA_STATIC_SERVING_EXPLAINED.md)** - Static serving & SPA fallback explained

## 📋 Features

### Customer Features
- ✅ User registration and authentication
- ✅ Browse menu by categories (Nepali, Fusion, Western, Snacks, Desserts, Drinks)
- ✅ Add items to cart with quantity selection
- ✅ View and manage shopping cart
- ✅ Place orders with optional notes
- ✅ View order history
- ✅ Cancel pending orders

### Admin Features
- ✅ Admin authentication
- ✅ Dashboard with statistics (orders, revenue, products)
- ✅ Product management (Create, Read, Update, Delete)
- ✅ Order management (View all orders, update status)
- ✅ Filter orders by status

---

## 🏗️ Tech Stack

### Frontend
- **React 18** - UI library
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **Vite** - Build tool
- **Context API** - State management

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd Restaurant_Order_Management_System
```

### 2. Install All Dependencies
```bash
npm run install-all
```

This installs dependencies for both backend and frontend.

### 3. Configure Environment Variables

Create `src/.env` file:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_access_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
```

### 4. Seed Database with Products
```bash
npm run seed
```

This adds 47 menu items to your database.

### 5. Run the Application

**Option A: Production Mode (Single Port - Recommended)**
```bash
npm run prod
```
Access everything at: `http://localhost:5000`

**Option B: Development Mode (Hot Reload)**
```bash
npm start
```
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:3001` (with hot reload)

> 💡 **Tip:** Use production mode to access everything on one URL. Use development mode when actively coding for instant updates.

---

## 📁 Project Structure

```
Restaurant_Order_Management_System/
├── src/                          # Backend (Node.js/Express)
│   ├── models/                   # Mongoose models
│   │   ├── user.model.js
│   │   ├── product.model.js
│   │   ├── cart.model.js
│   │   ├── order.model.js
│   │   └── refreshToken.js
│   ├── controllers/              # Request handlers
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── product.controller.js
│   │   ├── cart.controller.js
│   │   └── order.controller.js
│   ├── services/                 # Business logic
│   │   ├── auth.service.js
│   │   ├── user.service.js
│   │   ├── product.service.js
│   │   ├── cart.service.js
│   │   └── order.service.js
│   ├── routes/                   # API routes
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── product.routes.js
│   │   ├── cart.routes.js
│   │   └── order.routes.js
│   ├── auth/                     # Authentication middleware
│   │   └── auth.middlewares.js
│   ├── utils/                    # Utilities
│   │   └── jwt.js
│   ├── app.js                    # Express app
│   ├── server.js                 # Server entry point
│   └── seedProducts.js           # Database seeder
│
├── client/                       # Frontend (React)
│   ├── src/
│   │   ├── components/           # Reusable components
│   │   ├── pages/                # Page components
│   │   ├── services/             # API services
│   │   ├── context/              # React Context
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   └── package.json
│
├── package.json                  # Root package.json
└── README.md
```

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register        - Register new customer
POST   /api/auth/login           - Customer login
POST   /api/auth/admin/login     - Admin login
POST   /api/auth/logout          - Logout
POST   /api/auth/refresh         - Refresh access token
```

### Users
```
GET    /api/users                - Get all users (Admin)
GET    /api/users/me             - Get my profile (Customer)
PATCH  /api/users/me             - Update my profile (Customer)
DELETE /api/users/me             - Delete my account (Customer)
```

### Products
```
GET    /api/products             - Get all products (Public)
GET    /api/products/:id         - Get single product (Public)
POST   /api/products             - Create product (Admin)
PATCH  /api/products/:id         - Update product (Admin)
DELETE /api/products/:id         - Delete product (Admin)
```

### Cart
```
GET    /api/cart                 - Get my cart (Customer)
POST   /api/cart/items           - Add item to cart (Customer)
PATCH  /api/cart/items/:id       - Update item quantity (Customer)
DELETE /api/cart/items/:id       - Remove item (Customer)
DELETE /api/cart                 - Clear cart (Customer)
```

### Orders
```
POST   /api/orders               - Create order (Customer)
GET    /api/orders               - Get my orders (Customer)
GET    /api/orders/:id           - Get single order (Customer)
DELETE /api/orders/:id           - Cancel order (Customer)
GET    /api/orders/admin/all     - Get all orders (Admin)
PATCH  /api/orders/:id/status    - Update order status (Admin)
```

---

## 🎯 Available Scripts

### Root Level
```bash
npm start           # Run both backend and frontend (dev mode)
npm run prod        # Build React + run on single port (production)
npm run build       # Build React app for production
npm run server      # Run only backend
npm run client      # Run only frontend
npm run install-all # Install all dependencies
npm run seed        # Seed database with products
```

> 📖 **More Info:** See `HOW_TO_USE.md` for detailed usage guide

### Backend (src/)
```bash
npm start           # Start backend server
npm run dev         # Start with nodemon (auto-reload)
node seedProducts.js # Seed products
```

### Frontend (client/)
```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
```

---

## 👤 Default Users

### Create Admin User
You need to manually create an admin user in MongoDB:

```javascript
// In MongoDB or using register endpoint, set role to 'admin'
{
  "name": "Admin",
  "email": "admin@restaurant.com",
  "password": "admin123",
  "role": "admin"
}
```

### Customer Users
Register through the app at `/register`

---

## 🗂️ Database Collections

- **users** - Customer and admin accounts
- **products** - Menu items
- **carts** - Shopping carts (one per user)
- **orders** - Order history
- **refreshtokens** - JWT refresh tokens

---

## 🔐 Authentication Flow

1. User registers/logs in
2. Backend returns access token (15min) and refresh token (7 days)
3. Frontend stores tokens in localStorage
4. Access token sent with every request
5. On token expiry, use refresh token to get new access token

---

## 📱 Order Status Flow

```
pending → confirmed → preparing → delivered
   ↓
cancelled (can only cancel if pending)
```

---

## 🎨 Menu Categories

- **Nepali** - Momos, Dal Bhat, Choila, Sekuwa
- **Fusion** - Momo Quesadilla, Sekuwa Tacos, etc.
- **Western** - Pizza, Burgers, Pasta, Salmon
- **Snacks** - Fries, Wings, Spring Rolls
- **Desserts** - Lava Cake, Sikarni, Cheesecake
- **Drinks** - Lassi, Chai, Coffee, Juice

---

## 🐛 Troubleshooting

### Backend won't start
- Check MongoDB connection string in `.env`
- Ensure MongoDB is running
- Check if port 5000 is available

### Frontend won't start
- Run `cd client && npm install`
- Check if port 3000 is available
- Ensure backend is running on port 5000

### Can't login
- Check if user exists in database
- Verify JWT secrets in `.env`
- Check browser console for errors

---

## 📝 License

ISC

---

## 🤝 Contributing

Feel free to submit issues and pull requests!

---

## 📧 Contact

For questions or support, please open an issue.

---

**Enjoy your restaurant management system! 🎉**
