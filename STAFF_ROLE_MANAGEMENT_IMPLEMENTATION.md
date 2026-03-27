# Staff & Role Management System - Implementation Plan

## Overview
Add staff management functionality to the restaurant system without touching existing customer/admin functionality. This allows admins to manage restaurant staff members and their roles.

---

## Current System Analysis

### Existing Setup
- **User Model**: Has roles `customer` and `admin` (hardcoded enum)
- **Auth System**: Uses JWT (access + refresh tokens)
- **Authorization**: Middleware checks `req.user.role`
- **Login Endpoints**: 
  - `/api/auth/login` - Customer login
  - `/api/auth/admin/login` - Admin login

### Goal
Add staff management WITHOUT modifying existing User model or customer/admin flows.

---

## Data Architecture

### Relationship Model
- **1 Role → Many Staff** (one-to-many)
- **1 Staff → 1 Role** (each staff has exactly one role)
- Role name is used as user differentiator

### Role Model
**File**: `src/models/role.model.js`

```javascript
{
  name: String (unique, required),        // e.g., "Waiter", "Chef", "Manager"
  description: String,                    // Role description
  isActive: Boolean (default: true),      // Soft delete flag
  timestamps: true                        // createdAt, updatedAt
}

// Indexes
- name: 1 (unique)
```

**Note**: No `createdBy` field for future-proofing. Authorization handled at middleware level only.

### Staff Model
**File**: `src/models/staff.model.js`

```javascript
{
  name: String (required),                // Staff member name
  email: String (unique, required),       // Staff email
  password: String (required, hashed),    // Hashed password (for future login)
  phone: String,                          // Contact number
  roleId: ObjectId (ref: 'Role', required), // Reference to Role
  employeeId: String (unique, sparse),    // e.g., "EMP001"
  hireDate: Date (default: Date.now),     // Date of joining
  isActive: Boolean (default: true),      // Soft delete flag
  timestamps: true                        // createdAt, updatedAt
}

// Indexes
- email: 1 (unique)
- roleId: 1
- isActive: 1
- employeeId: 1 (unique, sparse)
```

**Note**: No `createdBy` field for future-proofing. Authorization handled at middleware level only.

---

## Phase 1: Complete Implementation

### 1. Create Models

#### Role Model (`src/models/role.model.js`)
- Define schema with all fields
- Add unique index on `name`
- No `createdBy` field (future-proof design)

#### Staff Model (`src/models/staff.model.js`)
- Define schema with all fields
- Add indexes: email, roleId, isActive, employeeId (sparse)
- Add reference to Role model for `roleId`
- No `createdBy` field (future-proof design)

---

### 2. Create Services

#### Role Service (`src/service/role.service.js`)

**Methods:**
- `createRole(name, description)`
  - Create new role
  - Return created role

- `getAllRoles(filters)`
  - Get all roles with optional filters
  - Support `isActive` filter
  - Return list of roles

- `getRoleById(id)`
  - Get single role by ID
  - Return role details

- `updateRole(id, data)`
  - Update role details
  - Validate name uniqueness if changed
  - Return updated role

- `toggleRoleStatus(id, isActive)`
  - Activate/deactivate role
  - **Validation**: Check if role has active staff before deactivating
  - Return updated role

#### Staff Service (`src/service/staff.service.js`)

**Methods:**
- `createStaff(data)`
  - Validate roleId exists
  - Hash password using bcrypt
  - Generate unique employeeId if not provided
  - Return created staff with populated role

- `getAllStaff(filters)`
  - Support pagination (page, limit)
  - Support search (name, email)
  - Support filters: roleId, isActive
  - Populate roleId field
  - Return list of staff with metadata

- `getStaffById(id)`
  - Get single staff by ID
  - Populate roleId field
  - Return staff details

- `updateStaff(id, data)`
  - Validate roleId if changed
  - Hash password if changed
  - Return updated staff with populated role

- `toggleStaffStatus(id, isActive)`
  - Activate/deactivate staff
  - Return updated staff

---

### 3. Create Controllers

#### Role Controller (`src/controllers/role.controller.js`)

**Methods:**
- `createRole(req, res)`
  - Extract request body data
  - Call service method
  - Return formatted success/error response

- `getAllRoles(req, res)`
  - Extract query filters
  - Call service method
  - Return formatted response

- `getRoleById(req, res)`
  - Extract role ID from params
  - Call service method
  - Return formatted response

- `updateRole(req, res)`
  - Extract role ID and update data
  - Call service method
  - Return formatted response

- `toggleRoleStatus(req, res)`
  - Extract role ID and isActive status
  - Call service method
  - Return formatted response

#### Staff Controller (`src/controllers/staff.controller.js`)

**Methods:**
- `createStaff(req, res)`
  - Extract request body data
  - Call service method
  - Return formatted response with populated role

- `getAllStaff(req, res)`
  - Extract query params (page, limit, search, filters)
  - Call service method
  - Return formatted response with pagination metadata

- `getStaffById(req, res)`
  - Extract staff ID from params
  - Call service method
  - Return formatted response

- `updateStaff(req, res)`
  - Extract staff ID and update data
  - Call service method
  - Return formatted response

- `toggleStaffStatus(req, res)`
  - Extract staff ID and isActive status
  - Call service method
  - Return formatted response

---

### 4. Create Routes (Admin-Only)

#### Role Routes (`src/routes/role.routes.js`)

```javascript
const express = require('express');
const router = express.Router();
const { authorize } = require('../auth/auth.middlewares');
const roleController = require('../controllers/role.controller');

// All routes require admin authorization
router.post('/', authorize('admin'), roleController.createRole);
router.get('/', authorize('admin'), roleController.getAllRoles);
router.get('/:id', authorize('admin'), roleController.getRoleById);
router.put('/:id', authorize('admin'), roleController.updateRole);
router.patch('/:id/status', authorize('admin'), roleController.toggleRoleStatus);

module.exports = router;
```

**Endpoints:**
- `POST /api/admin/roles` - Create new role
- `GET /api/admin/roles` - List all roles (with filters)
- `GET /api/admin/roles/:id` - Get role details
- `PUT /api/admin/roles/:id` - Update role
- `PATCH /api/admin/roles/:id/status` - Activate/deactivate role

#### Staff Routes (`src/routes/staff.routes.js`)

```javascript
const express = require('express');
const router = express.Router();
const { authorize } = require('../auth/auth.middlewares');
const staffController = require('../controllers/staff.controller');

// All routes require admin authorization
router.post('/', authorize('admin'), staffController.createStaff);
router.get('/', authorize('admin'), staffController.getAllStaff);
router.get('/:id', authorize('admin'), staffController.getStaffById);
router.put('/:id', authorize('admin'), staffController.updateStaff);
router.patch('/:id/status', authorize('admin'), staffController.toggleStaffStatus);

module.exports = router;
```

**Endpoints:**
- `POST /api/admin/staff` - Create new staff
- `GET /api/admin/staff` - List all staff (with pagination/filters)
- `GET /api/admin/staff/:id` - Get staff details
- `PUT /api/admin/staff/:id` - Update staff
- `PATCH /api/admin/staff/:id/status` - Activate/deactivate staff

---

### 5. Create Validators

#### Staff Validator (`src/validators/staff.validator.js`)

**Validation Rules:**
- Email: Valid email format, required
- Name: String, required, min 2 characters
- Password: String, required, min 6 characters (on create)
- Phone: String, optional, valid phone format
- RoleId: Valid MongoDB ObjectId, required
- EmployeeId: String, optional, unique

**Methods:**
- `validateCreateStaff` - Validation for POST /staff
- `validateUpdateStaff` - Validation for PUT /staff/:id

---

### 6. Register Routes in App

**Update**: `src/app.js`

```javascript
// Add these imports
const roleRoutes = require('./routes/role.routes');
const staffRoutes = require('./routes/staff.routes');

// Register routes (add after existing routes)
app.use('/api/admin/roles', roleRoutes);
app.use('/api/admin/staff', staffRoutes);
```

---

### 7. Create Seed Script

**File**: `src/seedRoles.js`

**Purpose**: Create default roles for the restaurant

**Default Roles to Create:**
1. Waiter - "Serves customers and takes orders"
2. Chef - "Prepares food in the kitchen"
3. Manager - "Manages restaurant operations"
4. Cashier - "Handles payments and billing"
5. Host - "Greets and seats customers"
6. Bartender - "Prepares and serves beverages"

**Script Features:**
- Check if roles already exist before creating
- Set all roles as active by default
- No admin reference needed (future-proof)

---

### 8. Testing Checklist

#### Role API Tests
- [ ] Create role (admin token) → Success
- [ ] Create role (customer token) → 403 Forbidden
- [ ] Create role (no token) → 401 Unauthorized
- [ ] Create duplicate role → 400 Bad Request
- [ ] Get all roles → Success with list
- [ ] Get role by ID → Success with details
- [ ] Update role → Success
- [ ] Deactivate role with no staff → Success
- [ ] Deactivate role with active staff → 400 Bad Request
- [ ] Activate role → Success

#### Staff API Tests
- [ ] Create staff with valid roleId → Success
- [ ] Create staff with invalid roleId → 400 Bad Request
- [ ] Create staff (customer token) → 403 Forbidden
- [ ] Get all staff → Success with pagination
- [ ] Get all staff with filters (roleId, isActive) → Success
- [ ] Search staff by name/email → Success
- [ ] Get staff by ID → Success with populated role
- [ ] Update staff → Success
- [ ] Update staff with new roleId → Success
- [ ] Deactivate staff → Success
- [ ] Activate staff → Success

#### Data Integrity Tests
- [ ] Staff.roleId references valid Role
- [ ] Unique constraints work (email, employeeId)
- [ ] Soft delete works (isActive flag)
- [ ] Sparse index on employeeId allows multiple nulls

---

## Authorization Flow

### How Admin-Only Access Works

**Single-Layer Protection (Route Level):**

1. **Route Level (Primary & Only)**
   - Middleware: `authorize('admin')`
   - Checks: `req.user.role === 'admin'`
   - If not admin → 403 Forbidden
   - If admin → proceeds to controller

**Request Flow:**
```
1. Request: POST /api/admin/roles
2. Middleware: authorize('admin') checks JWT token
3. If role !== 'admin' → 403 Forbidden (STOP)
4. If role === 'admin' → Continue
5. Controller: Extract request body
6. Service: Create role (no admin reference stored)
7. Response: Success with created role
```

**Why No `createdBy` Field?**
- Future-proof: When User.role is removed, no database changes needed
- Clean separation: Authorization at middleware level only
- No confusing references between User and Staff/Role models
- Simpler data model without cross-references

---

## Implementation Order

### Step-by-Step Execution

1. ✅ **Create Role Model** (`src/models/role.model.js`)
2. ✅ **Create Staff Model** (`src/models/staff.model.js`)
3. ✅ **Create Role Service** (`src/service/role.service.js`)
4. ✅ **Create Staff Service** (`src/service/staff.service.js`)
5. ✅ **Create Role Controller** (`src/controllers/role.controller.js`)
6. ✅ **Create Staff Controller** (`src/controllers/staff.controller.js`)
7. ✅ **Create Staff Validator** (`src/validators/staff.validator.js`)
8. ✅ **Create Role Routes** (`src/routes/role.routes.js`)
9. ✅ **Create Staff Routes** (`src/routes/staff.routes.js`)
10. ✅ **Register Routes in App** (`src/app.js`)
11. ✅ **Create Seed Script** (`src/seedRoles.js`)
12. ✅ **Test with Postman** (all endpoints)

---

## Key Design Decisions

### Why Soft Delete (isActive)?
- Maintains data integrity
- Preserves historical records
- Allows reactivation without data loss
- Prevents breaking references in other collections

### Why Separate Staff from User?
- Clear separation of concerns
- User model remains unchanged (no breaking changes)
- Different authentication flows possible in future
- Easier to add staff-specific features later

### Why NO createdBy Field?
- Future-proof design: When User.role is removed, no database migration needed
- Clean separation: Authorization handled purely at middleware level
- No confusing cross-references between User and Staff/Role models
- Simpler data model without unnecessary relationships
- If audit trail needed later, can be added to application logs instead

### Why roleId Reference?
- Flexible role management
- Easy to add/modify roles without changing staff
- Supports one-to-many relationship
- Enables role-based queries and filtering

---

## Future Enhancements (Phase 2+)

### Not Included in Phase 1
- Staff login functionality
- Permissions system (role-based access control)
- Staff assignment to orders/tables/reservations
- Staff performance tracking
- Shift management
- Staff dashboard

### Can Be Added Later Without Breaking Changes
- All Phase 1 code is designed to be extensible
- Password field already exists (hashed) for future login
- Role model can have permissions array added
- Staff model can have additional fields added

---

## Phase 1 Deliverables

### What You'll Have After Phase 1
✅ Role & Staff models (future-proof, no User references)  
✅ Complete CRUD APIs (admin-only via `authorize('admin')`)  
✅ Activate/deactivate functionality (no hard deletes)  
✅ Role validation when creating/updating staff  
✅ Seed script for default roles  
✅ Postman collection for testing  
✅ Pagination and filtering for staff list  
✅ Search functionality for staff  
✅ Populated role data in staff responses  

### What You Won't Have (Future Phases)
⏸️ Staff login endpoint  
⏸️ Staff authentication middleware  
⏸️ Permissions system  
⏸️ Staff-specific routes/features  
⏸️ Frontend UI for staff management  

---

## Ready to Implement?

This document provides the complete blueprint for Phase 1. Follow the implementation order, and you'll have a fully functional staff management system that admins can use to manage restaurant staff and their roles.

**Next Step**: Start with creating the Role model!
