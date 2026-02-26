# 🔄 RefreshToken Model Usage Explained

## When and Where `refreshToken.js` is Called in Your Project

This document explains every scenario where the RefreshToken model is used in your Restaurant Order Management System.

---

## 📋 Table of Contents

1. [RefreshToken Model Overview](#refreshtoken-model-overview)
2. [When RefreshToken is Created (Stored)](#when-refreshtoken-is-created-stored)
3. [When RefreshToken is Read (Retrieved)](#when-refreshtoken-is-read-retrieved)
4. [When RefreshToken is Deleted](#when-refreshtoken-is-deleted)
5. [Complete Flow Diagrams](#complete-flow-diagrams)
6. [Database Operations](#database-operations)

---

## 📦 RefreshToken Model Overview

### File Location
```
src/models/refreshToken.js
```

### Model Schema
```javascript
const refreshTokenSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  expiresAt: {
    type: Date,
    required: true
  }
}, { timestamps: true });

// Auto-delete expired tokens
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
```

### Purpose
- Stores refresh tokens in the database
- Links tokens to specific users
- Automatically deletes expired tokens
- Enables token revocation on logout

---

## 🔵 When RefreshToken is Created (Stored)

The RefreshToken model is used to **CREATE** (store) new tokens in these scenarios:

### Scenario 1: User Registration

```
┌─────────────────────────────────────────────────────────────────────┐
│ FLOW: User Registers                                                │
└─────────────────────────────────────────────────────────────────────┘

POST /api/auth/register
Body: { name, email, password }
    ↓
auth.controller.js → register()
    ↓
auth.service.js → registerUser()
    ↓
STEP 1: Create user in database
    const user = await User.create({ name, email, password, role })
    ↓
STEP 2: Generate tokens
    _generateAndStoreTokens(user)
        ↓
        STEP 2a: Generate JWT tokens
            const accessToken = generateAccessToken(userId, userRole)
            const refreshToken = generateRefreshToken(userId)
        ↓
        STEP 2b: Store refresh token in database
            ⭐ await RefreshToken.create({
                user_id: userId,
                token: refreshToken,
                expiresAt: new Date(Date.now() + 7 days)
            })
    ↓
STEP 3: Return tokens to client
    return { accessToken, refreshToken, user }
```

**Database Operation:**
```javascript
// In auth.service.js → _storeRefreshToken()
await RefreshToken.create({
    user_id: userId,
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
})
```

**MongoDB Document Created:**
```json
{
    "_id": ObjectId("65f1a2b3c4d5e6f7g8h9i0j1"),
    "user_id": ObjectId("65f1a2b3c4d5e6f7g8h9i0j2"),
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZjFhMmIzYzRkNWU2ZjdnOGg5aTBqMiIsImlhdCI6MTcwOTU2NzgwMCwiZXhwIjoxNzEwMTcyNjAwfQ.abc123",
    "expiresAt": ISODate("2026-03-04T10:00:00.000Z"),
    "createdAt": ISODate("2026-02-25T10:00:00.000Z"),
    "updatedAt": ISODate("2026-02-25T10:00:00.000Z")
}
```

---

### Scenario 2: User Login (Customer or Admin)

```
┌─────────────────────────────────────────────────────────────────────┐
│ FLOW: User Logs In                                                  │
└─────────────────────────────────────────────────────────────────────┘

POST /api/auth/login  (or /api/auth/admin/login)
Body: { email, password }
    ↓
auth.controller.js → login() or adminLogin()
    ↓
auth.service.js → loginUser(email, password, requiredRole)
    ↓
STEP 1: Find user and verify password
    const user = await User.findOne({ email })
    await bcrypt.compare(password, user.password)
    ↓
STEP 2: Generate and store tokens
    _generateAndStoreTokens(user)
        ↓
        ⭐ await RefreshToken.create({
            user_id: userId,
            token: refreshToken,
            expiresAt: new Date(Date.now() + 7 days)
        })
    ↓
STEP 3: Return tokens to client
    return { accessToken, refreshToken, user }
```

**Key Point:** Every time a user logs in, a NEW refresh token is created and stored in the database.

---

## 🔍 When RefreshToken is Read (Retrieved)

The RefreshToken model is used to **READ** (retrieve) tokens in this scenario:

### Scenario 3: Refresh Access Token

```
┌─────────────────────────────────────────────────────────────────────┐
│ FLOW: Access Token Expired, Need New One                            │
└─────────────────────────────────────────────────────────────────────┘

TRIGGER: Access token expires (after 15 minutes)
    ↓
User makes request with expired access token
    ↓
Middleware returns 403 Forbidden
    ↓
Frontend detects expired token
    ↓
POST /api/auth/refresh
Body: { refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
    ↓
auth.controller.js → refreshToken()
    ↓
auth.service.js → refreshAccessToken(token)
    ↓
STEP 1: Find refresh token in database
    ⭐ const storedToken = await RefreshToken.findOne({ token })
    ↓
    🟡 if (!storedToken) → throw 'Invalid refresh Token'
    ↓
    🟢 Token found in database
    ↓
STEP 2: Verify token signature and expiration
    const decoded = verifyRefreshToken(token)
    // Checks JWT signature and expiration
    ↓
STEP 3: Find user
    const user = await User.findById(decoded.id)
    ↓
STEP 4: Generate NEW access token
    const newAccessToken = generateAccessToken(user._id, user.role)
    ↓
STEP 5: Return new access token
    return { accessToken: newAccessToken }
    ↓
Frontend stores new access token
    ↓
Retry original request with new token
```

**Database Operation:**
```javascript
// In auth.service.js → refreshAccessToken()
const storedToken = await RefreshToken.findOne({ 
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." 
})
```

**Why Check Database?**
- Ensures token hasn't been revoked (deleted on logout)
- Validates token still exists and is valid
- Prevents use of old/stolen tokens

---

## 🗑️ When RefreshToken is Deleted

The RefreshToken model is used to **DELETE** tokens in this scenario:

### Scenario 4: User Logout

```
┌─────────────────────────────────────────────────────────────────────┐
│ FLOW: User Logs Out                                                 │
└─────────────────────────────────────────────────────────────────────┘

User clicks "Logout" button
    ↓
POST /api/auth/logout
Body: { refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
    ↓
auth.controller.js → logout()
    ↓
auth.service.js → logout(token)
    ↓
STEP 1: Delete refresh token from database
    ⭐ const result = await RefreshToken.deleteOne({ token })
    ↓
    🟡 if (result.deletedCount === 0) → throw 'Token not found'
    ↓
    🟢 Token deleted successfully
    ↓
STEP 2: Return success message
    return { message: 'Logged out Successfully' }
    ↓
Frontend clears localStorage:
    - Remove accessToken
    - Remove refreshToken
    - Remove user data
    ↓
User is logged out
```

**Database Operation:**
```javascript
// In auth.service.js → logout()
const result = await RefreshToken.deleteOne({ 
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." 
})
```

**Why Delete from Database?**
- Revokes the refresh token
- Prevents token reuse after logout
- Security: Even if someone steals the token, it won't work
- User must login again to get new tokens

---

### Scenario 5: Automatic Expiration (MongoDB TTL Index)

```
┌─────────────────────────────────────────────────────────────────────┐
│ FLOW: Automatic Token Cleanup                                       │
└─────────────────────────────────────────────────────────────────────┘

MongoDB Background Process (runs automatically)
    ↓
Checks refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
    ↓
Finds tokens where: expiresAt < current time
    ↓
⭐ Automatically deletes expired tokens
    ↓
No manual cleanup needed!
```

**How it works:**
```javascript
// In refreshToken.js model
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
```

This creates a TTL (Time To Live) index that automatically deletes documents when `expiresAt` date is reached.

---

## 📊 Complete Flow Diagrams

### Registration/Login Flow (Token Creation)

```
┌──────────────┐
│    CLIENT    │
└──────┬───────┘
       │ POST /api/auth/register or /api/auth/login
       │ { email, password }
       ↓
┌──────────────┐
│  CONTROLLER  │
└──────┬───────┘
       │ register() or login()
       ↓
┌──────────────┐
│   SERVICE    │
└──────┬───────┘
       │ registerUser() or loginUser()
       │
       ├─→ Create/Find User in DB
       │
       ├─→ Generate JWT Tokens
       │   - accessToken (15 min)
       │   - refreshToken (7 days)
       │
       ├─→ ⭐ RefreshToken.create()
       │   Store in database:
       │   {
       │     user_id: userId,
       │     token: refreshToken,
       │     expiresAt: Date + 7 days
       │   }
       │
       └─→ Return tokens to client
           ↓
┌──────────────┐
│   DATABASE   │
│   (MongoDB)  │
│              │
│ refreshtokens│
│ collection   │
│ + 1 document │
└──────────────┘
```

---

### Token Refresh Flow (Token Read)

```
┌──────────────┐
│    CLIENT    │
│ Access token │
│   expired!   │
└──────┬───────┘
       │ POST /api/auth/refresh
       │ { refreshToken: "..." }
       ↓
┌──────────────┐
│  CONTROLLER  │
└──────┬───────┘
       │ refreshToken()
       ↓
┌──────────────┐
│   SERVICE    │
└──────┬───────┘
       │ refreshAccessToken(token)
       │
       ├─→ ⭐ RefreshToken.findOne({ token })
       │   Check if token exists in DB
       │   ↓
       │   🟡 Not found? → Error: Invalid token
       │   🟢 Found? → Continue
       │
       ├─→ Verify JWT signature
       │   jwt.verify(token, SECRET)
       │
       ├─→ Find user by ID
       │   User.findById(decoded.id)
       │
       ├─→ Generate NEW access token
       │   (Refresh token stays the same)
       │
       └─→ Return new access token
           ↓
┌──────────────┐
│    CLIENT    │
│ Store new    │
│ access token │
│ Retry request│
└──────────────┘
```

---

### Logout Flow (Token Delete)

```
┌──────────────┐
│    CLIENT    │
│ User clicks  │
│   "Logout"   │
└──────┬───────┘
       │ POST /api/auth/logout
       │ { refreshToken: "..." }
       ↓
┌──────────────┐
│  CONTROLLER  │
└──────┬───────┘
       │ logout()
       ↓
┌──────────────┐
│   SERVICE    │
└──────┬───────┘
       │ logout(token)
       │
       ├─→ ⭐ RefreshToken.deleteOne({ token })
       │   Remove from database
       │   ↓
       │   🟡 Not found? → Error: Token not found
       │   🟢 Deleted? → Success
       │
       └─→ Return success message
           ↓
┌──────────────┐
│   DATABASE   │
│   (MongoDB)  │
│              │
│ refreshtokens│
│ collection   │
│ - 1 document │
└──────────────┘
       ↓
┌──────────────┐
│    CLIENT    │
│ Clear tokens │
│ from storage │
│ Redirect to  │
│    login     │
└──────────────┘
```

---

## 🗄️ Database Operations Summary

### CREATE Operations

| When | Method | Location | Purpose |
|------|--------|----------|---------|
| User Registration | `RefreshToken.create()` | `auth.service.js` → `_storeRefreshToken()` | Store new refresh token for registered user |
| User Login | `RefreshToken.create()` | `auth.service.js` → `_storeRefreshToken()` | Store new refresh token for logged-in user |
| Admin Login | `RefreshToken.create()` | `auth.service.js` → `_storeRefreshToken()` | Store new refresh token for admin |

### READ Operations

| When | Method | Location | Purpose |
|------|--------|----------|---------|
| Token Refresh | `RefreshToken.findOne({ token })` | `auth.service.js` → `refreshAccessToken()` | Verify refresh token exists and is valid |

### DELETE Operations

| When | Method | Location | Purpose |
|------|--------|----------|---------|
| User Logout | `RefreshToken.deleteOne({ token })` | `auth.service.js` → `logout()` | Revoke refresh token |
| Automatic Expiry | MongoDB TTL Index | Database (automatic) | Auto-delete expired tokens |

---

## 🔐 Security Benefits

### Why Store Refresh Tokens in Database?

1. **Token Revocation**
   - Can invalidate tokens on logout
   - Prevents use of stolen tokens after logout

2. **Validation**
   - Verify token hasn't been revoked
   - Check token still exists before issuing new access token

3. **Audit Trail**
   - Track when tokens were created
   - Monitor active sessions
   - Identify suspicious activity

4. **Automatic Cleanup**
   - TTL index removes expired tokens
   - Keeps database clean
   - No manual maintenance needed

---

## 📝 Code References

### Import Statement
```javascript
// src/service/auth.service.js
const RefreshToken = require('../models/refreshToken');
```

### Usage Locations

1. **Create Token:**
   ```javascript
   // Line 48-53 in auth.service.js
   async _storeRefreshToken(userId, refreshToken){
       await RefreshToken.create({
           user_id: userId,
           token: refreshToken,
           expiresAt: new Date(Date.now() + this.tokenExpire)
       });
   }
   ```

2. **Find Token:**
   ```javascript
   // Line 109 in auth.service.js
   async refreshAccessToken(token){
       const storedToken = await RefreshToken.findOne({token});
       if(!storedToken){
           throw {status: 401, message: 'Invalid refresh Token'};
       }
       // ... rest of logic
   }
   ```

3. **Delete Token:**
   ```javascript
   // Line 121 in auth.service.js
   async logout(token){
       const result = await RefreshToken.deleteOne({token});
       if(result.deletedCount === 0){
           throw{status: 404, message: 'Token not found'};
       }
       return{message: 'Logged out Successfully'};
   }
   ```

---

## 🎯 Summary

The `refreshToken.js` model is called in **4 main scenarios**:

1. ✅ **User Registration** → CREATE token in database
2. ✅ **User Login** → CREATE token in database
3. ✅ **Token Refresh** → READ token from database
4. ✅ **User Logout** → DELETE token from database
5. ✅ **Automatic Expiry** → DELETE by MongoDB TTL index

Every operation goes through `auth.service.js` which is the only file that directly interacts with the RefreshToken model.
