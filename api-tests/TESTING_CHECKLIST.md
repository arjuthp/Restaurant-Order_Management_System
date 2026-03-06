# ✅ API Testing Checklist

## 🎯 Complete Testing Workflow

### Phase 1: Setup ⚙️

- [ ] Server is running on `http://localhost:5000`
- [ ] MongoDB is connected
- [ ] VS Code REST Client extension installed
- [ ] Customer user exists in database
- [ ] Admin user exists in database

### Phase 2: Authentication 🔐

**File:** `api-tests/01-auth.rest`

- [ ] Login as Customer (copy `accessToken`)
- [ ] Login as Admin (copy `accessToken` as `adminToken`)
- [ ] Update tokens in `09-tables.rest`
- [ ] Update tokens in `10-reservations.rest`

### Phase 3: Table Management 🪑

**File:** `api-tests/09-tables.rest`

#### Public Routes (No Auth)
- [ ] Test #1: Get all tables
- [ ] Test #9: Get table by ID

#### Admin Routes (Requires Admin Token)
- [ ] Test #2: Create table (capacity 4)
- [ ] Test #3: Create table (capacity 6)
- [ ] Test #4: Create table (capacity 8)
- [ ] Test #12: Update table
- [ ] Test #13: Change table status

#### Error Cases
- [ ] Test #5: Create without auth (should fail)
- [ ] Test #6: Duplicate table number (should fail)
- [ ] Test #7: Invalid capacity (should fail)
- [ ] Test #8: Missing required fields (should fail)
- [ ] Test #14: Update without auth (should fail)
- [ ] Test #17: Delete without auth (should fail)

### Phase 4: Reservation System 📅

**File:** `api-tests/10-reservations.rest`

#### Public Routes (No Auth)
- [ ] Test #1: Check availability (4 guests)
- [ ] Test #2: Check availability (2 guests)
- [ ] Test #3: Check availability (8 guests)

#### Customer Routes (Requires Customer Token)
- [ ] Test #5: Create reservation (copy `reservationId`)
- [ ] Test #6: Create another reservation
- [ ] Test #10: Get my reservations
- [ ] Test #12: Get reservation by ID
- [ ] Test #15: Cancel reservation

#### Admin Routes (Requires Admin Token)
- [ ] Test #18: Get all reservations
- [ ] Test #19: Filter by status
- [ ] Test #20: Filter by date
- [ ] Test #21: Multiple filters
- [ ] Test #23: Update status to "confirmed"
- [ ] Test #24: Update status to "completed"
- [ ] Test #25: Update status to "no-show"

#### Error Cases
- [ ] Test #4: Missing parameters (should fail)
- [ ] Test #7: Create without auth (should fail)
- [ ] Test #8: Double booking (should fail)
- [ ] Test #11: Get reservations without auth (should fail)
- [ ] Test #13: View other user's reservation (should fail)
- [ ] Test #16: Cancel already cancelled (should fail)
- [ ] Test #22: Customer tries admin route (should fail)
- [ ] Test #26: Missing status field (should fail)
- [ ] Test #28: Customer tries to update status (should fail)

## 📊 Test Results Summary

### Tables API
- Total Tests: 18
- Public Routes: 2
- Admin Routes: 5
- Error Cases: 11

### Reservations API
- Total Tests: 28
- Public Routes: 4
- Customer Routes: 6
- Admin Routes: 8
- Error Cases: 10

## 🎓 Learning Objectives

After completing all tests, you should understand:

### 1. Authentication & Authorization
- ✅ How JWT tokens work
- ✅ Difference between customer and admin roles
- ✅ How middleware protects routes

### 2. CRUD Operations
- ✅ Create (POST)
- ✅ Read (GET)
- ✅ Update (PUT/PATCH)
- ✅ Delete (DELETE)

### 3. Data Validation
- ✅ Required fields
- ✅ Data types
- ✅ Business rules (capacity > 0, unique table numbers)

### 4. Error Handling
- ✅ 400 Bad Request (validation errors)
- ✅ 401 Unauthorized (missing token)
- ✅ 403 Forbidden (insufficient permissions)
- ✅ 404 Not Found (resource doesn't exist)

### 5. Advanced Concepts
- ✅ Transactions (preventing double booking)
- ✅ Populate (joining user/table data)
- ✅ Query parameters (filtering)
- ✅ Route specificity (/:id vs /my-reservations)

## 🏆 Success Criteria

### All Tests Pass ✅
- All success cases return expected responses
- All error cases return appropriate error messages
- No server crashes or unexpected errors

### Data Integrity ✅
- Tables created successfully
- Reservations linked to correct users and tables
- Double booking prevented
- Cancelled reservations don't block tables

### Security ✅
- Public routes accessible without auth
- Protected routes require valid tokens
- Users can only access their own data
- Admin routes restricted to admins only

## 📝 Notes Section

Use this space to track issues or observations:

```
Date: ___________
Tester: ___________

Issues Found:
1. 
2. 
3. 

Questions:
1. 
2. 
3. 

Improvements Needed:
1. 
2. 
3. 
```

## 🚀 Next Steps

After completing all tests:

1. [ ] Review any failed tests
2. [ ] Fix bugs in code
3. [ ] Re-run failed tests
4. [ ] Document any API changes
5. [ ] Update frontend to use new APIs
6. [ ] Create automated test scripts
7. [ ] Deploy to staging environment

---

**Happy Testing!** 🎉

Remember: Testing is not just about finding bugs, it's about understanding how your system works!
