# 🚀 API Testing Quick Reference

## Setup Checklist

1. ✅ Install VS Code REST Client extension
2. ✅ Start server: `npm run server`
3. ✅ Open `01-auth.rest` and register/login
4. ✅ Copy `accessToken` from response
5. ✅ Update `@accessToken` or `@customerToken` variable in each file
6. ✅ Start testing!

---

## File Overview

| File | Tests | Purpose |
|------|-------|---------|
| `01-auth.rest` | 16 | Authentication & authorization |
| `02-products.rest` | 16 | Product catalog management |
| `03-cart.rest` | 19 | Shopping cart operations |
| `04-orders.rest` | 27 | Order lifecycle management |
| `05-users.rest` | 18 | User profile management |
| `06-restaurant.rest` | 14 | Restaurant information |
| `07-admin-operations.rest` | 20+ | All admin features consolidated |
| `08-edge-cases.rest` | 46 | Error handling & validation |

**Total: 176+ test cases**

---

## Common Variables

```http
@baseUrl = http://localhost:5000/api
@customerToken = your_customer_token_here
@adminToken = your_admin_token_here
@productId = your_product_id_here
@orderId = your_order_id_here
```

---

## Quick Test Sequences

### 🎯 Complete Customer Journey

1. **Register** → `01-auth.rest` #1
2. **Login** → `01-auth.rest` #6
3. **Browse Products** → `02-products.rest` #1
4. **Add to Cart** → `03-cart.rest` #4
5. **View Cart** → `03-cart.rest` #1
6. **Create Order** → `04-orders.rest` #1
7. **View Orders** → `04-orders.rest` #6
8. **Update Profile** → `05-users.rest` #4

### 👑 Complete Admin Journey

1. **Admin Login** → `01-auth.rest` #9
2. **Create Product** → `02-products.rest` #9
3. **View All Orders** → `04-orders.rest` #17
4. **Update Order Status** → `04-orders.rest` #20
5. **View All Users** → `05-users.rest` #16
6. **Update Restaurant** → `06-restaurant.rest` #5

### 🔒 Security Testing

1. **No Token** → Any protected endpoint without Authorization header
2. **Invalid Token** → Use `invalid_token_string`
3. **Wrong Role** → Customer token on admin endpoint
4. **Expired Token** → Wait 15+ minutes after login
5. **SQL Injection** → `08-edge-cases.rest` #4
6. **XSS Attempts** → `08-edge-cases.rest` #5, #29

---

## API Endpoints Summary

### Authentication (`/api/auth`)
- `POST /register` - Register new customer
- `POST /login` - Customer login
- `POST /admin/login` - Admin login
- `POST /refresh` - Refresh access token
- `POST /logout` - Logout user

### Products (`/api/products`)
- `GET /` - Get all products (public)
- `GET /:id` - Get single product (public)
- `POST /` - Create product (admin)
- `PATCH /:id` - Update product (admin)
- `DELETE /:id` - Delete product (admin)

### Cart (`/api/cart`)
- `GET /` - Get my cart (customer)
- `POST /items` - Add item to cart (customer)
- `PATCH /items/:productId` - Update item quantity (customer)
- `DELETE /items/:productId` - Remove item (customer)
- `DELETE /` - Clear cart (customer)

### Orders (`/api/orders`)
- `POST /` - Create order from cart (customer)
- `GET /` - Get my orders (customer)
- `GET /:id` - Get order by ID (customer)
- `DELETE /:id` - Cancel order (customer)
- `GET /admin/all` - Get all orders (admin)
- `PATCH /:id/status` - Update order status (admin)

### Users (`/api/users`)
- `GET /me` - Get my profile (customer)
- `PATCH /me` - Update my profile (customer)
- `DELETE /me` - Delete my account (customer)
- `GET /` - Get all users (admin)

### Restaurant (`/api/restaurant`)
- `GET /` - Get restaurant info (public)
- `PATCH /` - Update restaurant info (admin)

---

## Response Status Codes

| Code | Meaning | Common Scenarios |
|------|---------|------------------|
| 200 | OK | Successful GET, PATCH, DELETE |
| 201 | Created | Successful POST (register, create) |
| 400 | Bad Request | Missing required fields, invalid data |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Wrong role (customer accessing admin) |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Database errors, validation errors |

---

## Order Status Flow

```
pending → confirmed → preparing → delivered
   ↓
cancelled (can cancel at any stage before delivered)
```

---

## Testing Tips

### 1. Use Variables
Always update variables at the top of each file after getting IDs or tokens.

### 2. Test in Order
Follow the recommended sequence in each file for best results.

### 3. Check Responses
Verify response status codes and body content match expectations.

### 4. Test Error Cases
Don't just test happy paths - error scenarios are equally important.

### 5. Clean Up
Delete test data periodically to keep database clean.

### 6. Use Workflows
Each file has complete workflow tests at the bottom - run these to test full features.

---

## Common Issues & Solutions

### ❌ 404 Not Found
**Problem:** URL is incorrect  
**Solution:** Ensure URL starts with `/api` (e.g., `/api/products` not `/products`)

### ❌ 401 Unauthorized
**Problem:** Missing or invalid token  
**Solution:** Login again and update `@accessToken` variable

### ❌ 403 Forbidden
**Problem:** Wrong role (customer trying admin endpoint)  
**Solution:** Use admin token for admin endpoints

### ❌ 500 Internal Server Error
**Problem:** Validation error or database issue  
**Solution:** Check request body format and required fields

### ❌ Connection Refused
**Problem:** Server not running  
**Solution:** Run `npm run server` in terminal

---

## Keyboard Shortcuts

- **Send Request:** `Ctrl+Alt+R` (Windows/Linux) or `Cmd+Alt+R` (Mac)
- **Switch Panel:** `Ctrl+Tab`
- **Close Response:** `Ctrl+W`

---

## Best Practices

1. ✅ Always test authentication first
2. ✅ Keep tokens updated in variables
3. ✅ Test both success and error scenarios
4. ✅ Verify response data structure
5. ✅ Test authorization (customer vs admin)
6. ✅ Check edge cases and validation
7. ✅ Test complete workflows end-to-end
8. ✅ Document any bugs found

---

## Next Steps

1. Run through all test files sequentially
2. Document any failing tests
3. Test edge cases thoroughly
4. Verify security measures
5. Check performance with large datasets
6. Test concurrent operations
7. Validate error messages are user-friendly

---

Happy Testing! 🎉

For detailed test cases, open the individual `.rest` files.
