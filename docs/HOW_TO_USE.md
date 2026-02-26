# 🎯 How to Use - Single Port Setup

## ✅ Problem Fixed!

**Before:** Backend on port 5000, React on port 3001 (confusing!)
**Now:** Everything on port 5000 in production mode

---

## 🚀 Quick Commands

### Run Everything on http://localhost:5000
```bash
npm run prod
```

### Development Mode (Hot Reload)
```bash
npm start
```
- Backend: http://localhost:5000
- Frontend: http://localhost:3001

---

## 📖 Step-by-Step Guide

### 1️⃣ First Time Setup
```bash
# Install all dependencies
npm run install-all

# Make sure MongoDB is running
# Check src/.env has correct MONGO_URI

# Seed database with sample products
npm run seed
```

### 2️⃣ Run in Production Mode
```bash
# Build React and start server
npm run prod
```

### 3️⃣ Open Browser
```
http://localhost:5000
```

You should see the React homepage!

---

## 🧪 Test the Application

### As Customer:
1. Go to http://localhost:5000
2. Click "Register" → Create account
3. Go to "Menu" → Browse products
4. Click "Add to Cart" on items
5. Go to "Cart" → Review items
6. Click "Place Order"
7. Go to "Orders" → See your order

### As Admin:
1. Go to http://localhost:5000/admin/login
2. Login with admin credentials
3. Go to "Products" → Add/Edit/Delete products
4. Go to "Orders" → See all orders
5. Update order status

---

## 🔧 How It Works

### Production Mode (`npm run prod`)
```
1. Runs: npm run build
   → Builds React app to client/dist/

2. Runs: cd src && npm start
   → Starts Express server

3. Express serves:
   - API routes: /api/*
   - React app: /* (everything else)

4. Result: Everything on port 5000!
```

### Development Mode (`npm start`)
```
1. Runs backend: cd src && npm start
   → Express on port 5000

2. Runs frontend: cd client && npm run dev
   → Vite on port 3001

3. Vite proxies API calls to port 5000

4. Result: Hot reload for development!
```

---

## 📁 What Changed

### `src/app.js`
```javascript
// API routes FIRST
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
// ... other API routes

// Serve React build files
app.use(express.static(path.join(__dirname, '../client/dist')));

// Catch-all: serve React for any non-API route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});
```

### `client/src/services/api.js`
```javascript
// Use relative URL in production, absolute in dev
const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:5000/api';
```

### `package.json`
```json
{
  "scripts": {
    "build": "cd client && npm run build",
    "prod": "npm run build && cd src && npm start"
  }
}
```

---

## 🎨 URL Structure

### Production (npm run prod)
```
http://localhost:5000/              → React Homepage
http://localhost:5000/menu          → React Menu Page
http://localhost:5000/cart          → React Cart Page
http://localhost:5000/api/products  → API Endpoint
http://localhost:5000/api/cart      → API Endpoint
```

### Development (npm start)
```
http://localhost:3001/              → React Homepage (Vite)
http://localhost:3001/menu          → React Menu Page (Vite)
http://localhost:5000/api/products  → API Endpoint (Express)
```

---

## 🐛 Troubleshooting

### React app not showing at port 5000?
```bash
# Rebuild the React app
npm run build

# Check if dist folder exists
ls -la client/dist/

# Restart server
cd src && npm start
```

### API calls failing?
```bash
# Check backend is running
curl http://localhost:5000/api/products

# Check MongoDB connection
# Look for "MongoDB connected" in terminal
```

### Port 5000 already in use?
```bash
# Find and kill the process
lsof -ti:5000 | xargs kill -9

# Or use a different port in src/.env
PORT=5001
```

### Changes not showing?
```bash
# In production mode, rebuild after changes
npm run build

# Or use development mode for hot reload
npm start
```

---

## 📚 Additional Resources

- `QUICK_START.md` - Quick reference guide
- `DEPLOYMENT_GUIDE.md` - Detailed deployment info
- `ARCHITECTURE.md` - System architecture diagrams
- `README.md` - Project overview

---

## ✨ Summary

**Development:** Use `npm start` for hot reload
**Production:** Use `npm run prod` for single port
**Result:** Clean, professional setup with one URL! 🎉
