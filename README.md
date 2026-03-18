# 🍽️ Restaurant Order Management System - Backend API

RESTful API for restaurant order management system built with Node.js, Express, and MongoDB.

## 📚 Documentation

- 📖 **[API Documentation](docs/HOW_TO_USE.md)** - API usage guide
- 🚀 **[Quick Start](docs/QUICK_START.md)** - Fast setup reference
- 🏗️ **[Architecture](docs/ARCHITECTURE.md)** - System architecture
- 🧪 **[API Testing](api-tests/README.md)** - Test your endpoints

## 📋 Features

### Authentication & Authorization
- ✅ User registration and login
- ✅ Admin authentication
- ✅ JWT access & refresh tokens
- ✅ Role-based access control

### Product Management
- ✅ CRUD operations for menu items
- ✅ Category-based organization (Nepali, Fusion, Western, Snacks, Desserts, Drinks)
- ✅ Public product browsing

### Cart Management
- ✅ Add/update/remove items
- ✅ Quantity management
- ✅ User-specific carts

### Order Management
- ✅ Place orders with notes
- ✅ Order history tracking
- ✅ Status updates (pending → confirmed → preparing → delivered)
- ✅ Cancel pending orders
- ✅ Admin order management

### Table & Reservation System
- ✅ Table management (CRUD)
- ✅ Availability checking
- ✅ Reservation booking
- ✅ Reservation status management

### User Management
- ✅ Profile management
- ✅ Admin user overview
- ✅ Account deletion

---

## 🏗️ Tech Stack

- **Node.js** - Runtime environment
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

### 2. Install Dependencies
```bash
cd src
npm install
```

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

This adds 48 menu items to your database.

### 5. Start the Server

```bash
npm start
```

API will be available at: `http://localhost:5000/api`

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
│   │   ├── table.model.js
│   │   ├── reservation.model.js
│   │   ├── promoCode.model.js
│   │   └── refreshToken.js
│   ├── controllers/              # Request handlers
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── product.controller.js
│   │   ├── cart.controller.js
│   │   ├── order.controller.js
│   │   ├── table.controller.js
│   │   └── reservation.controller.js
│   ├── services/                 # Business logic
│   │   ├── auth.service.js
│   │   ├── user.service.js
│   │   ├── product.service.js
│   │   ├── cart.service.js
│   │   ├── order.service.js
│   │   ├── table.service.js
│   │   └── reservation.service.js
│   ├── routes/                   # API routes
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── product.routes.js
│   │   ├── cart.routes.js
│   │   ├── order.routes.js
│   │   ├── table.routes.js
│   │   └── reservation.routes.js
│   ├── auth/                     # Authentication middleware
│   │   └── auth.middlewares.js
│   ├── utils/                    # Utilities
│   │   └── jwt.js
│   ├── app.js                    # Express app
│   ├── server.js                 # Server entry point
│   └── seedProducts.js           # Database seeder
│
├── api-tests/                    # REST API test files
├── docs/                         # Documentation
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

### Tables
```
GET    /api/tables               - Get all tables (Public)
GET    /api/tables/:id           - Get single table (Public)
POST   /api/tables               - Create table (Admin)
PUT    /api/tables/:id           - Update table (Admin)
DELETE /api/tables/:id           - Delete table (Admin)
```

### Reservations
```
GET    /api/reservations/availability           - Check availability (Public)
POST   /api/reservations                        - Create reservation (Customer)
GET    /api/reservations/my-reservations        - Get my reservations (Customer)
GET    /api/reservations/:id                    - Get single reservation (Customer)
PATCH  /api/reservations/:id/cancel             - Cancel reservation (Customer)
GET    /api/reservations/admin/all              - Get all reservations (Admin)
PATCH  /api/reservations/admin/:id/status       - Update status (Admin)
```

### Restaurant
```
GET    /api/restaurant           - Get restaurant info (Public)
PATCH  /api/restaurant           - Update restaurant info (Admin)
```

---

## 🎯 Available Scripts

```bash
npm start           # Start backend server
npm run dev         # Start with nodemon (auto-reload)
npm run seed        # Seed database with products
npm run kill-port   # Kill process on port 5000
npm run clean-start # Kill port and start fresh
```

---

## 👤 Default Users

### Create Admin User

**Quick Setup (Recommended):**
```bash
cd src
npm run seed:admin
```

This creates an admin account with:
- **Email:** `admin@restaurant.com`
- **Password:** `admin123`
- **Role:** `admin`

**Admin Login:**
- Frontend: `http://localhost:3000/admin/login`
- Use the credentials above to login

**⚠️ IMPORTANT:** Change the password after first login in production!

**Custom Admin Credentials:**
```bash
ADMIN_EMAIL=your@email.com ADMIN_PASSWORD=YourPassword123 npm run seed:admin
```

**Manual Database Creation:**
```javascript
// In MongoDB, insert into users collection:
{
  "name": "Admin",
  "email": "admin@restaurant.com",
  "password": "$2a$10$...", // Hashed password
  "role": "admin"
}
```

### Customer Users
Register through the API at `POST /api/auth/register` or via the frontend at `http://localhost:3000/auth`

---

## 🗂️ Database Collections

- **users** - Customer and admin accounts
- **products** - Menu items
- **carts** - Shopping carts (one per user)
- **orders** - Order history
- **tables** - Restaurant tables
- **reservations** - Table reservations
- **promocodes** - Promotional codes
- **refreshtokens** - JWT refresh tokens

---

## 🔐 Authentication Flow

1. User registers/logs in
2. Backend returns access token (15min) and refresh token (7 days)
3. Client stores tokens
4. Access token sent with every request in Authorization header
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

## 🧪 Testing the API

Use the provided REST files in `api-tests/` directory with VS Code REST Client extension:

1. Install REST Client extension
2. Open any `.rest` file in `api-tests/`
3. Click "Send Request" above each endpoint
4. View responses in the right panel

See [api-tests/README.md](api-tests/README.md) for detailed testing guide.

---

## 🐛 Troubleshooting

### Backend won't start
- Check MongoDB connection string in `.env`
- Ensure MongoDB is running
- Check if port 5000 is available: `lsof -ti:5000`

### Can't login
- Check if user exists in database
- Verify JWT secrets in `.env`
- Check server logs for errors

### Database connection error
- Verify MONGO_URI in `.env`
- Check MongoDB service is running
- Ensure network access if using MongoDB Atlas

---

## 📝 License

ISC

---

## 🤝 Contributing

Feel free to submit issues and pull requests!

---

**Enjoy your restaurant API! 🎉**
