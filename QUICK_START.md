# ⚡ Quick Start Guide

## 🎯 Goal: Run Everything on http://localhost:5000

---

## 🚀 Option 1: Production Mode (Recommended)

**Single command to build and run everything:**

```bash
npm run prod
```

Then open: **http://localhost:5000**

✅ React app served from backend
✅ API available at /api/*
✅ One URL for everything

---

## 🔧 Option 2: Development Mode

**For active development with hot reload:**

```bash
npm start
```

This runs:
- Backend: http://localhost:5000
- Frontend: http://localhost:3001 (with hot reload)

Use this when you're coding and want instant updates.

---

## 📦 First Time Setup

```bash
# Install all dependencies
npm run install-all

# Seed the database with sample products
npm run seed

# Build and run in production mode
npm run prod
```

---

## 🔄 Workflow

### When Developing:
```bash
npm start
# Edit code → See changes instantly at http://localhost:3001
```

### When Testing Production:
```bash
npm run build  # Build React app
cd src && npm start  # Start backend only
# Visit http://localhost:5000
```

### When Deploying:
```bash
npm run prod
# Everything at http://localhost:5000
```

---

## 📝 Available Scripts

| Command | What It Does |
|---------|-------------|
| `npm start` | Run backend + frontend (dev mode) |
| `npm run server` | Run only backend |
| `npm run client` | Run only frontend |
| `npm run build` | Build React for production |
| `npm run prod` | Build + run in production mode |
| `npm run seed` | Add sample products to database |
| `npm run install-all` | Install all dependencies |

---

## ✅ Success Checklist

After running `npm run prod`, you should be able to:

- [ ] Visit http://localhost:5000
- [ ] See the React homepage
- [ ] Navigate to /menu and see products
- [ ] Register a new account
- [ ] Login successfully
- [ ] Add items to cart
- [ ] Place an order
- [ ] Admin login at /admin/login

---

## 🐛 Troubleshooting

**Port 5000 already in use?**
```bash
# Kill the process using port 5000
lsof -ti:5000 | xargs kill -9
```

**MongoDB not connected?**
- Check `src/.env` has correct `MONGO_URI`
- Make sure MongoDB is running

**React app not showing?**
```bash
# Rebuild the React app
npm run build
```

**API calls failing?**
- Check backend is running on port 5000
- Check `client/src/services/api.js` has correct baseURL
