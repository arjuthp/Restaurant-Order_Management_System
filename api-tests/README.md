# 🧪 API Testing with REST Client

## VS Code REST Client Extension

This folder contains `.rest` files for testing all API endpoints using the VS Code REST Client extension.

---

## 📋 Setup

### 1. Install VS Code Extension

Install **REST Client** by Huachao Mao:
- Open VS Code
- Go to Extensions (Ctrl+Shift+X)
- Search for "REST Client"
- Install the extension by Huachao Mao

### 2. Start Your Server

```bash
# Make sure server is running
npm run server

# You should see:
# MongoDB connected
# Server Started: http://localhost:5000
```

### 3. How to Use .rest Files

1. Open any `.rest` file
2. Click "Send Request" above any request
3. Response appears in a new panel
4. Variables are automatically shared between requests

---

## 📁 File Structure

```
api-tests/
├── README.md                    # This file
├── 01-auth.rest                 # Authentication tests
├── 02-products.rest             # Product CRUD tests
├── 03-cart.rest                 # Cart management tests
├── 04-orders.rest               # Order management tests
├── 05-users.rest                # User profile tests
├── 06-restaurant.rest           # Restaurant info tests
├── 07-admin-operations.rest     # Admin-specific tests
└── 08-edge-cases.rest           # Error scenarios & edge cases
```

---

## 🎯 Testing Workflow

### Recommended Order:

1. **01-auth.rest** - Register and login to get tokens
2. **02-products.rest** - Test product endpoints
3. **03-cart.rest** - Test cart functionality
4. **04-orders.rest** - Test order placement
5. **05-users.rest** - Test user profile
6. **06-restaurant.rest** - Test restaurant info
7. **07-admin-operations.rest** - Test admin features
8. **08-edge-cases.rest** - Test error handling

---

## 💡 Tips

### Variables

Variables are defined at the top of each file:
```http
@baseUrl = http://localhost:5000/api
@accessToken = your_token_here
```

After login, copy the token and update `@accessToken` variable.

### Send Request

Click "Send Request" link above any request or use:
- **Windows/Linux:** `Ctrl+Alt+R`
- **Mac:** `Cmd+Alt+R`

### View Response

Response opens in a new panel showing:
- Status code
- Headers
- Response body (formatted JSON)

### Multiple Requests

Separate requests with `###`:
```http
GET {{baseUrl}}/products

###

GET {{baseUrl}}/products/123
```

---

## 🔑 Quick Start

1. Open `01-auth.rest`
2. Click "Send Request" on "Register Customer"
3. Copy `accessToken` from response
4. Update `@accessToken` variable at top of file
5. Now you can test protected endpoints!

---

## 📊 Test Coverage

- ✅ Authentication (16 tests) - Register, Login, Logout, Refresh, Admin login
- ✅ Products (16 tests) - CRUD operations, availability, categories
- ✅ Cart (19 tests) - Add, Update, Remove, Clear, workflows
- ✅ Orders (27 tests) - Create, View, Cancel, Status updates, Admin management
- ✅ Users (18 tests) - Profile operations, Admin view all users
- ✅ Restaurant (14 tests) - Public info, Admin updates
- ✅ Admin Operations (20+ tests) - Consolidated admin-only endpoints
- ✅ Edge Cases (46 tests) - Validation, security, boundary values, error handling

**Total: 176+ comprehensive test cases**

---

## 🐛 Troubleshooting

### Server Not Running
```
Error: connect ECONNREFUSED 127.0.0.1:5000
```
**Solution:** Start server with `npm run server`

### 404 Not Found
```
HTTP/1.1 404 Not Found
```
**Solution:** Check URL is correct (should start with `/api`)

### 401 Unauthorized
```
HTTP/1.1 401 Unauthorized
```
**Solution:** Update `@accessToken` with valid token from login

### 403 Forbidden
```
HTTP/1.1 403 Forbidden
```
**Solution:** Use correct role (admin token for admin endpoints)

---

Happy Testing! 🚀
