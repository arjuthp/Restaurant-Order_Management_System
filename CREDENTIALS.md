# 🔐 Default Credentials

**⚠️ FOR DEVELOPMENT ONLY - CHANGE IN PRODUCTION!**

---

## Admin Account

### Login URL
```
http://localhost:3000/admin/login
```

### Credentials
```
Email: admin@restaurant.com
Password: admin123
```

### How to Create
```bash
cd src
npm run seed:admin
```

---

## Customer Account

### Login/Register URL
```
http://localhost:3000/auth
```

### Test Customer (if you created one)
```
Email: [your test email]
Password: [your test password]
```

### How to Create
- Go to `http://localhost:3000/auth`
- Click "Sign up"
- Fill in the registration form

---

## Backend API

### Base URL
```
http://localhost:5000/api
```

### Test Endpoints
```bash
# Health check
GET http://localhost:5000/api/products

# Admin login
POST http://localhost:5000/api/auth/admin/login
Body: { "email": "admin@restaurant.com", "password": "admin123" }

# Customer login
POST http://localhost:5000/api/auth/login
Body: { "email": "customer@test.com", "password": "password123" }
```

---

## Frontend URLs

| Page | URL | Access |
|------|-----|--------|
| Home | `http://localhost:3000/` | Public |
| Customer Login | `http://localhost:3000/auth` | Public |
| Admin Login | `http://localhost:3000/admin/login` | Public |
| Products | `http://localhost:3000/products` | Public |
| Cart | `http://localhost:3000/cart` | Customer Only |
| Orders | `http://localhost:3000/orders` | Customer Only |
| Admin Dashboard | `http://localhost:3000/admin/dashboard` | Admin Only |

---

## Changing Admin Password

### Option 1: Re-run Seed Script with New Password
```bash
cd src
ADMIN_EMAIL=admin@restaurant.com ADMIN_PASSWORD=NewPassword123 npm run seed:admin
```

### Option 2: Update in Database
```javascript
// In MongoDB
db.users.updateOne(
  { email: "admin@restaurant.com" },
  { $set: { password: "$2a$10$..." } } // Use bcrypt to hash new password
)
```

### Option 3: Delete and Recreate
```bash
# Delete existing admin
# Then run seed script again
cd src
npm run seed:admin
```

---

## Security Notes

1. ✅ **Development:** Use default credentials for testing
2. ⚠️ **Production:** ALWAYS change default credentials
3. 🔒 **Never commit** credentials to git
4. 📝 **Document** production credentials securely (password manager)
5. 🔄 **Rotate** passwords regularly

---

**Last Updated:** March 18, 2026
