# 🧪 Tables & Reservations Testing Guide

## 📋 Prerequisites

Before testing, ensure:

1. ✅ Server is running: `cd src && npm start`
2. ✅ MongoDB is connected
3. ✅ You have created users (customer and admin)
4. ✅ VS Code REST Client extension is installed

## 🚀 Quick Start Testing Flow

### Step 1: Authentication (Required First!)

Open `api-tests/01-auth.rest` and run:

1. **Login as Customer**
   ```
   POST /api/auth/login
   ```
   - Copy the `accessToken` from response
   - Paste it in `@accessToken` variable in test files

2. **Login as Admin**
   ```
   POST /api/auth/admin/login
   ```
   - Copy the `accessToken` from response
   - Paste it in `@adminToken` variable in test files

### Step 2: Table Management

Open `api-tests/09-tables.rest`:

1. **Create Tables** (Admin only)
   - Run test #2, #3, #4 to create multiple tables
   - Copy a `_id` from response
   - Paste it in `@tableId` variable

2. **View Tables** (Public)
   - Run test #1 to see all tables
   - No authentication needed!

3. **Update/Delete** (Admin only)
   - Run tests #12-18 to manage tables

### Step 3: Reservations

Open `api-tests/10-reservations.rest`:

1. **Check Availability** (Public)
   - Run test #1 to see free tables
   - Note the available table IDs

2. **Create Reservation** (Customer)
   - Update `@tableId` with an available table
   - Run test #5 to book
   - Copy `_id` to `@reservationId`

3. **Manage Reservations**
   - Customer: Run tests #10-17
   - Admin: Run tests #18-28

## 📝 Testing Scenarios

### Scenario A: Complete Customer Journey

```
1. Check availability (test #1)
2. Create reservation (test #5)
3. View my reservations (test #10)
4. View specific reservation (test #12)
5. Cancel reservation (test #15)
```

### Scenario B: Admin Management

```
1. Create tables (09-tables.rest #2-4)
2. View all reservations (test #18)
3. Filter by status (test #19)
4. Update reservation status (test #23)
5. Mark as completed (test #24)
```

### Scenario C: Error Testing

```
1. Try booking without auth (test #7)
2. Try double booking (test #8)
3. Try viewing others' reservations (test #13)
4. Try admin routes as customer (test #22)
```

## 🔧 How to Use REST Files

### Method 1: Click "Send Request"

1. Open `.rest` file
2. Click "Send Request" link above each request
3. View response in right panel

### Method 2: Keyboard Shortcut

1. Place cursor on request
2. Press `Ctrl+Alt+R` (Windows/Linux) or `Cmd+Alt+R` (Mac)

### Method 3: Right-Click

1. Right-click on request
2. Select "Send Request"

## 📊 Understanding Responses

### Success Responses

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Responses

```json
{
  "success": false,
  "message": "Error description"
}
```

### Common Status Codes

- `200 OK` - Success (GET, PUT, PATCH, DELETE)
- `201 Created` - Resource created (POST)
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Missing/invalid token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource doesn't exist
- `500 Internal Server Error` - Server error

## 🎯 Variable Management

### Update Variables in Each File

At the top of each `.rest` file:

```http
@baseUrl = http://localhost:5000/api
@accessToken = YOUR_CUSTOMER_TOKEN_HERE
@adminToken = YOUR_ADMIN_TOKEN_HERE
@tableId = YOUR_TABLE_ID_HERE
@reservationId = YOUR_RESERVATION_ID_HERE
```

### Tips:
- Update tokens after each login (they expire!)
- Update IDs after creating resources
- Use same variables across all test files

## 🐛 Troubleshooting

### "Unauthorized" Error
**Problem:** Token is missing or expired
**Solution:** 
1. Run login request again
2. Copy new token
3. Update `@accessToken` or `@adminToken`

### "Table not found" Error
**Problem:** Invalid or non-existent table ID
**Solution:**
1. Run "Get All Tables" (09-tables.rest #1)
2. Copy a valid `_id`
3. Update `@tableId` variable

### "Table already booked" Error
**Problem:** Trying to book already reserved table
**Solution:**
1. Change `date` or `timeSlot` in request
2. Or use different `tableId`
3. Or check availability first (test #1)

### "You can only view your own reservations" Error
**Problem:** Trying to access another user's reservation
**Solution:**
- This is correct behavior!
- Users can only see their own bookings
- Admins can see all bookings

### Connection Refused
**Problem:** Server not running
**Solution:**
```bash
cd src
npm start
```

## 💡 Pro Tips

### 1. Test in Order
Follow the test numbers sequentially for best results.

### 2. Create Multiple Tables
Create tables with different capacities:
- Small (2-4 people)
- Medium (4-6 people)
- Large (6-8 people)

### 3. Test Different Time Slots
Use various times to test availability:
- `17:00`, `18:00`, `19:00`, `20:00`, `21:00`

### 4. Test Edge Cases
- Book same table at different times ✅
- Book different tables at same time ✅
- Book same table at same time ❌ (should fail)

### 5. Use Comments
Add notes in `.rest` files:
```http
### My custom test
GET {{baseUrl}}/tables
# This is my note
```

## 📚 API Endpoints Reference

### Tables

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/tables` | None | Get all tables |
| GET | `/tables/:id` | None | Get table by ID |
| POST | `/tables` | Admin | Create table |
| PUT | `/tables/:id` | Admin | Update table |
| DELETE | `/tables/:id` | Admin | Delete table |

### Reservations

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/reservations/availability` | None | Check availability |
| POST | `/reservations` | Customer | Create reservation |
| GET | `/reservations/my-reservations` | Customer | Get my reservations |
| GET | `/reservations/:id` | Customer | Get reservation by ID |
| PATCH | `/reservations/:id/cancel` | Customer | Cancel reservation |
| GET | `/reservations/admin/all` | Admin | Get all reservations |
| PATCH | `/reservations/admin/:id/status` | Admin | Update status |

## 🎓 Learning Exercises

### Exercise 1: Full Booking Flow
Complete a full customer booking from start to finish.

### Exercise 2: Admin Dashboard
Simulate an admin managing all reservations for a day.

### Exercise 3: Error Handling
Intentionally trigger each error type and understand why.

### Exercise 4: Concurrent Bookings
Try to book the same table twice simultaneously (use two browser tabs).

### Exercise 5: Status Lifecycle
Create a reservation and move it through all status states.

## 📞 Need Help?

- Check server logs for detailed errors
- Review the code in controllers/services
- Read the comments in test files
- Test one endpoint at a time

Happy Testing! 🚀
