# Staff & Role Management - Testing Guide

## 📋 Prerequisites

1. ✅ Server is running (`npm start` or `node src/server.js`)
2. ✅ Database is connected
3. ✅ Roles are seeded (`node src/seedRoles.js`)
4. ✅ Admin user exists (run `node src/seedAdmin.js` if needed)

---

## 🚀 Quick Start

### 1. Import Postman Collection

1. Open Postman
2. Click **Import** button
3. Select `postman/Staff-Role-Management.postman_collection.json`
4. Collection will appear in your sidebar

### 2. Set Base URL (if different)

- Click on the collection name
- Go to **Variables** tab
- Update `baseUrl` if your server runs on a different port
- Default: `http://localhost:5000/api`

---

## 📝 Testing Workflow

### Step 1: Admin Login (REQUIRED FIRST)

**Request:** `0. Setup - Admin Login > Admin Login`

**Credentials:**
```json
{
  "email": "admin@restaurant.com",
  "password": "admin123"
}
```

**What happens:**
- ✅ Returns admin access token
- ✅ Token is automatically saved to collection variable
- ✅ All subsequent requests use this token

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "user": {
      "id": "...",
      "email": "admin@restaurant.com",
      "role": "admin"
    }
  }
}
```

---

### Step 2: Test Role Management

#### 2.1 Get All Roles
**Request:** `1. Role Management > Get All Roles`

**Expected:** List of 6 seeded roles (Waiter, Chef, Manager, etc.)

#### 2.2 Create New Role
**Request:** `1. Role Management > Create Role`

**Body:**
```json
{
  "name": "Kitchen Helper",
  "description": "Assists chefs in the kitchen"
}
```

**What happens:**
- ✅ Creates new role
- ✅ Role ID is automatically saved to collection variable
- ✅ Can be used in staff creation

#### 2.3 Get Role by ID
**Request:** `1. Role Management > Get Role by ID`

**Uses:** Automatically uses saved `roleId` from previous request

#### 2.4 Update Role
**Request:** `1. Role Management > Update Role`

**Body:**
```json
{
  "name": "Kitchen Helper",
  "description": "Assists chefs and maintains kitchen cleanliness"
}
```

#### 2.5 Deactivate Role
**Request:** `1. Role Management > Deactivate Role`

**Body:**
```json
{
  "isActive": false
}
```

**Note:** Will fail if role has active staff assigned

#### 2.6 Activate Role
**Request:** `1. Role Management > Activate Role`

**Body:**
```json
{
  "isActive": true
}
```

---

### Step 3: Test Staff Management

#### 3.1 Create Staff
**Request:** `2. Staff Management > Create Staff`

**Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@restaurant.com",
  "password": "password123",
  "phone": "+1234567890",
  "roleId": "{{roleId}}",
  "employeeId": "EMP1001",
  "hireDate": "2024-01-15"
}
```

**What happens:**
- ✅ Creates new staff member
- ✅ Password is hashed automatically
- ✅ Staff ID is saved to collection variable
- ✅ Role data is populated in response

**Expected Response:**
```json
{
  "success": true,
  "message": "Staff created successfully",
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john.doe@restaurant.com",
    "phone": "+1234567890",
    "roleId": {
      "_id": "...",
      "name": "Kitchen Helper",
      "description": "Assists chefs in the kitchen"
    },
    "employeeId": "EMP1001",
    "hireDate": "2024-01-15T00:00:00.000Z",
    "isActive": true,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

#### 3.2 Get All Staff
**Request:** `2. Staff Management > Get All Staff`

**Expected:** List of all staff with pagination metadata

#### 3.3 Search Staff
**Request:** `2. Staff Management > Search Staff by Name`

**Query:** `?search=john`

**Searches:** Name and email fields (case-insensitive)

#### 3.4 Filter Staff by Role
**Request:** `2. Staff Management > Filter Staff by Role`

**Query:** `?roleId={{roleId}}`

**Returns:** Only staff assigned to specific role

#### 3.5 Filter Active Staff
**Request:** `2. Staff Management > Filter Active Staff`

**Query:** `?isActive=true`

**Returns:** Only active staff members

#### 3.6 Get Staff by ID
**Request:** `2. Staff Management > Get Staff by ID`

**Uses:** Automatically uses saved `staffId`

#### 3.7 Update Staff
**Request:** `2. Staff Management > Update Staff`

**Body:**
```json
{
  "name": "John Doe Updated",
  "phone": "+1234567899"
}
```

**Note:** Password is optional, only hash if provided

#### 3.8 Deactivate Staff
**Request:** `2. Staff Management > Deactivate Staff`

**Body:**
```json
{
  "isActive": false
}
```

---

### Step 4: Test Error Scenarios

#### 4.1 Duplicate Role Name
**Request:** `3. Error Testing > Create Role - Duplicate Name`

**Expected:** `400 Bad Request` - "Role with this name already exists"

#### 4.2 Invalid Role ID
**Request:** `3. Error Testing > Create Staff - Invalid Role ID`

**Expected:** `400 Bad Request` - "Invalid role ID"

#### 4.3 Duplicate Email
**Request:** `3. Error Testing > Create Staff - Duplicate Email`

**Expected:** `400 Bad Request` - "Staff with this email already exists"

#### 4.4 Invalid ID
**Request:** `3. Error Testing > Get Role - Invalid ID`

**Expected:** `404 Not Found` - "Role not found"

#### 4.5 No Authentication
**Request:** `3. Error Testing > Access Without Token`

**Expected:** `401 Unauthorized` - "Access token required"

---

## ✅ Testing Checklist

### Role Management
- [ ] Get all roles (should show 6 seeded roles)
- [ ] Create new role
- [ ] Get role by ID
- [ ] Update role
- [ ] Filter active roles
- [ ] Deactivate role (without staff)
- [ ] Activate role
- [ ] Try to create duplicate role (should fail)

### Staff Management
- [ ] Create staff with valid roleId
- [ ] Get all staff with pagination
- [ ] Search staff by name
- [ ] Filter staff by roleId
- [ ] Filter active staff
- [ ] Get staff by ID
- [ ] Update staff details
- [ ] Update staff password
- [ ] Deactivate staff
- [ ] Activate staff
- [ ] Try to create staff with invalid roleId (should fail)
- [ ] Try to create staff with duplicate email (should fail)

### Authorization
- [ ] All requests require admin token
- [ ] Requests without token return 401
- [ ] Customer token should return 403 (if you test with customer)

### Data Integrity
- [ ] Staff roleId references valid Role
- [ ] Role data is populated in staff responses
- [ ] Password is not returned in responses
- [ ] Cannot deactivate role with active staff
- [ ] Unique constraints work (email, employeeId)

---

## 🔧 Troubleshooting

### Issue: "Access token required"
**Solution:** Run "Admin Login" request first to get token

### Issue: "Invalid role ID"
**Solution:** 
1. Run "Get All Roles" to see available roles
2. Copy a valid role `_id`
3. Update `roleId` variable or use in request body

### Issue: "Role not found"
**Solution:** Make sure you ran `node src/seedRoles.js`

### Issue: "Cannot deactivate role"
**Solution:** Deactivate or delete all staff assigned to that role first

### Issue: Token expired
**Solution:** Run "Admin Login" again to get a fresh token

---

## 📊 Expected Results Summary

### Successful Operations
- **Create:** `201 Created`
- **Read:** `200 OK`
- **Update:** `200 OK`
- **Delete/Toggle:** `200 OK`

### Error Responses
- **Validation Error:** `400 Bad Request`
- **Unauthorized:** `401 Unauthorized`
- **Forbidden:** `403 Forbidden`
- **Not Found:** `404 Not Found`
- **Server Error:** `500 Internal Server Error`

---

## 🎯 Next Steps

After all tests pass:
1. ✅ Backend is complete and working
2. ✅ Ready for frontend integration
3. ✅ Can start building admin GUI for role/staff management

---

## 📝 Notes

- All endpoints require admin authentication
- Tokens are automatically managed by Postman scripts
- Role ID and Staff ID are automatically saved after creation
- Safe to run tests multiple times (idempotent where possible)
- Seed script can be run multiple times (skips existing roles)

---

## 🚀 Quick Test Run

**Run these in order:**
1. Admin Login
2. Get All Roles
3. Create Role
4. Create Staff (using created role)
5. Get All Staff
6. Update Staff
7. Deactivate Staff

**All should return success responses!**
