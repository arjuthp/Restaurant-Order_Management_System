# Restaurant Order Management - React Frontend

Modern React frontend for the Restaurant Order Management System.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd client
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The app will run on `http://localhost:3000`

### 3. Make sure Backend is Running
```bash
# In another terminal
cd src
npm start
```

Backend should be running on `http://localhost:5000`

---

## 📁 Project Structure

```
client/
├── public/              # Static files
├── src/
│   ├── components/      # Reusable components
│   │   ├── Navbar.jsx
│   │   ├── ProductCard.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── AdminRoute.jsx
│   ├── pages/           # Page components
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── AdminLogin.jsx
│   │   ├── Menu.jsx
│   │   ├── Cart.jsx
│   │   ├── Orders.jsx
│   │   └── admin/
│   │       ├── Dashboard.jsx
│   │       ├── Products.jsx
│   │       └── Orders.jsx
│   ├── services/        # API services
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── productService.js
│   │   ├── cartService.js
│   │   └── orderService.js
│   ├── context/         # React Context
│   │   └── AuthContext.jsx
│   ├── App.jsx          # Main app component
│   ├── App.css          # App styles
│   ├── index.css        # Global styles
│   └── main.jsx         # Entry point
├── package.json
└── vite.config.js
```

---

## 🎯 Features

### Customer Features:
- ✅ User Registration & Login
- ✅ Browse Menu by Category
- ✅ Add Items to Cart
- ✅ Update Cart Quantities
- ✅ Place Orders
- ✅ View Order History
- ✅ Cancel Pending Orders

### Admin Features:
- ✅ Admin Login
- ✅ Dashboard with Statistics
- ✅ Manage Products (CRUD)
- ✅ View All Orders
- ✅ Update Order Status
- ✅ Filter Orders by Status

---

## 🔗 API Integration

The frontend connects to your Node.js backend running on `http://localhost:5000`

All API calls are handled through service files in `src/services/`:
- `authService.js` - Authentication
- `productService.js` - Products
- `cartService.js` - Shopping cart
- `orderService.js` - Orders

---

## 🎨 Styling

- Custom CSS (no external UI library)
- Responsive design
- Clean and modern interface
- Mobile-friendly

---

## 🔐 Authentication

- JWT tokens stored in localStorage
- Automatic token attachment to requests
- Protected routes for customers and admins
- Auto-redirect on token expiration

---

## 📱 Routes

### Public Routes:
- `/` - Home page
- `/menu` - Browse menu
- `/login` - Customer login
- `/register` - Customer registration
- `/admin/login` - Admin login

### Customer Protected Routes:
- `/cart` - Shopping cart
- `/orders` - Order history

### Admin Protected Routes:
- `/admin/dashboard` - Admin dashboard
- `/admin/products` - Manage products
- `/admin/orders` - Manage orders

---

## 🛠️ Technologies

- **React 18** - UI library
- **React Router v6** - Routing
- **Axios** - HTTP client
- **Vite** - Build tool
- **Context API** - State management

---

## 📝 Environment

The app is configured to connect to:
- Backend API: `http://localhost:5000/api`
- Frontend Dev Server: `http://localhost:3000`

---

## 🚀 Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

---

## 🎉 You're All Set!

Your React frontend is ready to connect to your Node.js backend!
