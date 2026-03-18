# Admin Setup Guide

This guide explains how to create and manage admin users in the Restaurant Order Management System.

## 🎯 Overview

For security reasons, admin users **cannot self-register** through the UI. Admins must be created through:
1. **Database seeding** (recommended for initial setup)
2. **Direct database insertion** (for manual setup)
3. **Future: Admin User Management UI** (for creating additional admins)

---

## 🚀 Quick Start: Create First Admin

### Method 1: Using Seed Script (Recommended)

#### Step 1: Navigate to backend directory
```bash
cd src
```

#### Step 2: Run the seed script
```bash
npm run seed:admin
```

This creates an admin with default credentials:
- **Email:** `admin@restaurant.com`
- **Password:** `admin123`
- **Role:** `admin`

#### Step 3: Login
1. Go to `http://localhost:5173/admin/login`
2. Enter the credentials above
3. **IMPORTANT:** Change the password immediately!

### Method 2: Custom Admin Credentials

Create admin with your own credentials using environment variables:

```bash
ADMIN_EMAIL=your@email.com \
ADMIN_PASSWORD=YourSecurePassword123 \
ADMIN_NAME="Your Name" \
npm run seed:admin
```

### Method 3: Production Deployment

For production, set environment variables in your deployment platform:

```bash
# .env file or deployment environment
ADMIN_EMAIL=admin@yourrestaurant.com
ADMIN_PASSWORD=VerySecurePassword123!
ADMIN_NAME=Restaurant Manager
```

Then run during deployment:
```bash
npm run seed:admin
```

---

## 🏢 Production Workflow

### Initial Deployment (One-Time)

```
┌─────────────────────────────────────────┐
│  1. Deploy Application                  │
│     - Backend + Frontend                │
│     - Database setup                    │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  2. Create Super Admin                  │
│     Run: npm run seed:admin             │
│     (Uses env variables)                │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  3. Super Admin Logs In                 │
│     URL: /admin/login                   │
│     Changes password                    │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  4. Super Admin Creates Other Admins    │
│     (Future: Through User Management UI)│
└─────────────────────────────────────────┘
```

---

## 🔐 Security Best Practices

### ✅ DO:
- Use strong passwords (min 12 characters, mixed case, numbers, symbols)
- Change default password immediately after first login
- Use environment variables for production credentials
- Limit number of admin accounts
- Use unique emails for each admin
- Enable 2FA (future enhancement)

### ❌ DON'T:
- Use default credentials in production
- Share admin credentials
- Store credentials in code or git
- Create admin registration UI (security risk)
- Use simple passwords like "admin123"

---

## 🛠️ Manual Database Setup

If you prefer to create admin manually in MongoDB:

### Using MongoDB Compass or Shell:

```javascript
// 1. Hash the password first (use bcrypt with 10 rounds)
// You can use: https://bcrypt-generator.com/
// Or run in Node.js:
const bcrypt = require('bcryptjs');
const hashedPassword = await bcrypt.hash('YourPassword123', 10);

// 2. Insert into users collection
db.users.insertOne({
  name: "Restaurant Admin",
  email: "admin@restaurant.com",
  password: "$2a$10$...", // Your hashed password here
  role: "admin",
  phone: null,
  address: null,
  createdAt: new Date(),
  updatedAt: new Date()
});
```

---

## 📋 Verification

After creating an admin, verify it works:

### 1. Check Database
```bash
# MongoDB Shell
use restaurant_db
db.users.findOne({ role: "admin" })
```

### 2. Test Login
1. Go to `http://localhost:5173/admin/login`
2. Enter admin credentials
3. Should redirect to `/admin/dashboard`

### 3. Test Admin Routes
- Try accessing `/admin/dashboard`
- Try accessing `/admin/products`
- Verify customer routes redirect non-admins

---

## 🔄 Managing Multiple Admins

### Current Limitation
The current version only supports creating the initial admin via seed script.

### Future Enhancement (Recommended)
Add an "Admin User Management" page where super admins can:
- View all users
- Create new admin accounts
- Deactivate admin accounts
- Reset passwords
- Assign roles

This would be implemented as:
- **Frontend:** `/admin/users` page
- **Backend:** Already has `GET /api/admin/users` endpoint
- **Feature:** Add `POST /api/admin/users` to create new admins

---

## 🆘 Troubleshooting

### Problem: "Admin user already exists"
**Solution:** The admin email is already in the database. Either:
- Use a different email
- Delete the existing user and re-run seed
- Reset the password manually in database

### Problem: "Access Denied. admin only."
**Solution:** The user exists but doesn't have admin role. Update in database:
```javascript
db.users.updateOne(
  { email: "admin@restaurant.com" },
  { $set: { role: "admin" } }
);
```

### Problem: "Invalid credentials"
**Solution:** 
- Check email spelling
- Verify password is correct
- Ensure user exists in database
- Check password was hashed correctly

### Problem: Can't access admin routes after login
**Solution:**
- Check browser console for errors
- Verify token is stored in localStorage
- Check user role in authStore
- Verify AdminRoute component is working

---

## 📝 Environment Variables

### Development (.env)
```bash
# MongoDB
MONGO_URI=mongodb://localhost:27017/restaurant_db

# JWT
JWT_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-here

# Admin Credentials (for seeding)
ADMIN_EMAIL=admin@restaurant.com
ADMIN_PASSWORD=admin123
ADMIN_NAME=Restaurant Admin

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### Production (.env.production)
```bash
# MongoDB
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/restaurant_db

# JWT (use strong random strings)
JWT_SECRET=<generate-strong-secret>
JWT_REFRESH_SECRET=<generate-strong-secret>

# Admin Credentials (CHANGE THESE!)
ADMIN_EMAIL=admin@yourrestaurant.com
ADMIN_PASSWORD=<generate-strong-password>
ADMIN_NAME=Restaurant Manager

# Frontend URL
FRONTEND_URL=https://yourrestaurant.com
```

---

## 🎓 For Developers Delivering to Clients

When delivering this project to a restaurant/organization:

### 1. Pre-Deployment Checklist
- [ ] Set strong admin credentials in environment variables
- [ ] Update FRONTEND_URL to production domain
- [ ] Generate strong JWT secrets
- [ ] Test admin login on staging environment

### 2. Deployment Steps
```bash
# 1. Deploy backend and database
# 2. Set environment variables
# 3. Run admin seed script
npm run seed:admin

# 4. Verify admin can login
# 5. Provide credentials to client securely
```

### 3. Client Handoff
Provide the client with:
- Admin login URL: `https://yourrestaurant.com/admin/login`
- Admin email (from env variable)
- Temporary password (they MUST change it)
- Instructions to change password
- Admin user guide

### 4. Post-Deployment
- Client logs in and changes password
- Client can start managing products, orders, etc.
- Future: Client can create additional admin accounts through UI

---

## 📚 Related Documentation

- [API Documentation](./HOW_TO_USE.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Architecture Overview](./ARCHITECTURE.md)
- [Security Best Practices](./SECURITY.md) *(to be created)*

---

## ✅ Summary

**For Development:**
```bash
npm run seed:admin
# Login at: http://localhost:5173/admin/login
# Email: admin@restaurant.com
# Password: admin123
```

**For Production:**
```bash
# Set env variables first!
ADMIN_EMAIL=admin@yourrestaurant.com \
ADMIN_PASSWORD=SecurePass123! \
npm run seed:admin
```

**Security:** Admin registration UI is intentionally NOT provided. Admins are created via seed script or database for security.

---

**Last Updated:** March 18, 2026  
**Version:** 1.0
