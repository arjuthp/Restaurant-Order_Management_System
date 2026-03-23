# Cart Synchronization Flow Diagram

## Before (Broken Flow)

```
┌─────────────────┐
│  User adds item │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│ Zustand Store (Local)   │
│ ✅ Item added           │
└─────────────────────────┘
         │
         │ (No backend sync!)
         │
         ▼
┌─────────────────────────┐
│ User clicks checkout    │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ POST /api/orders        │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ Backend checks cart     │
│ ❌ Cart is empty!       │
└─────────────────────────┘
```

## After (Fixed Flow)

```
┌─────────────────┐
│  User adds item │
└────────┬────────┘
         │
         ├──────────────────────────────┐
         │                              │
         ▼                              ▼
┌─────────────────────────┐   ┌──────────────────────┐
│ Zustand Store (Local)   │   │ POST /api/cart/items │
│ ✅ Item added instantly │   │ (Background sync)    │
└─────────────────────────┘   └──────┬───────────────┘
                                     │
                                     ▼
                              ┌──────────────────────┐
                              │ MongoDB Cart         │
                              │ ✅ Item saved        │
                              └──────────────────────┘
         │
         │ User continues shopping...
         │
         ▼
┌─────────────────────────┐
│ User clicks checkout    │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ GET /api/cart           │
│ (Validate cart)         │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ POST /api/orders        │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ Backend reads cart      │
│ ✅ Cart has items!      │
│ ✅ Order created!       │
└─────────────────────────┘
```

## Detailed Operation Flow

### Add Item Operation

```
User Action: Click "Add to Cart"
     │
     ▼
┌─────────────────────────────────────────┐
│ 1. Optimistic Update                    │
│    - Update Zustand store immediately   │
│    - User sees item in cart (instant)   │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ 2. Background Sync                      │
│    - POST /api/cart/items               │
│    - { product_id, quantity }           │
└──────────────┬──────────────────────────┘
               │
               ├─────────────┬─────────────┐
               │             │             │
               ▼             ▼             ▼
         ┌─────────┐   ┌─────────┐   ┌─────────┐
         │ Success │   │ 404 Not │   │ Network │
         │         │   │  Found  │   │  Error  │
         └────┬────┘   └────┬────┘   └────┬────┘
              │             │             │
              ▼             ▼             ▼
         ┌─────────┐   ┌─────────┐   ┌─────────┐
         │ Synced  │   │ Rollback│   │ Keep in │
         │         │   │  local  │   │  local  │
         └─────────┘   └─────────┘   └─────────┘
```

### Update Quantity Operation

```
User Action: Change quantity
     │
     ▼
┌─────────────────────────────────────────┐
│ 1. Save previous state                  │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ 2. Optimistic Update                    │
│    - Update Zustand store immediately   │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ 3. Background Sync                      │
│    - PATCH /api/cart/items/:id          │
│    - { quantity }                       │
└──────────────┬──────────────────────────┘
               │
               ├─────────────┬─────────────┐
               │             │             │
               ▼             ▼             ▼
         ┌─────────┐   ┌─────────┐   ┌─────────┐
         │ Success │   │ 404/400 │   │ Network │
         │         │   │  Error  │   │  Error  │
         └────┬────┘   └────┬────┘   └────┬────┘
              │             │             │
              ▼             ▼             ▼
         ┌─────────┐   ┌─────────┐   ┌─────────┐
         │ Synced  │   │ Rollback│   │ Keep    │
         │         │   │ to prev │   │ updated │
         └─────────┘   └─────────┘   └─────────┘
```

### Checkout Flow

```
User navigates to /checkout
     │
     ▼
┌─────────────────────────────────────────┐
│ 1. Cart Validation (useEffect)          │
│    - GET /api/cart                      │
│    - Load backend cart                  │
│    - Merge with local cart              │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ 2. User reviews order                   │
│    - Sees items, total, etc.            │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ 3. User clicks "Place Order"            │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ 4. Create Order                         │
│    - POST /api/orders                   │
│    - Backend reads from cart in DB      │
└──────────────┬──────────────────────────┘
               │
               ├─────────────┬─────────────┐
               │             │             │
               ▼             ▼             ▼
         ┌─────────┐   ┌─────────┐   ┌─────────┐
         │ Success │   │ Empty   │   │  Other  │
         │         │   │  Cart   │   │  Error  │
         └────┬────┘   └────┬────┘   └────┬────┘
              │             │             │
              ▼             ▼             ▼
         ┌─────────┐   ┌─────────┐   ┌─────────┐
         │ Clear   │   │ Show    │   │ Show    │
         │ cart &  │   │ error   │   │ error   │
         │ redirect│   │ message │   │ message │
         └─────────┘   └─────────┘   └─────────┘
```

## State Synchronization

```
┌──────────────────────────────────────────────────────┐
│                   Frontend State                     │
│  ┌────────────────────────────────────────────────┐  │
│  │ Zustand Store (in-memory + localStorage)      │  │
│  │                                                │  │
│  │ items: [                                       │  │
│  │   { productId, name, price, quantity, ... }   │  │
│  │ ]                                              │  │
│  │ isSyncing: boolean                             │  │
│  │ lastSyncError: string | null                   │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────┬───────────────────────────────┘
                       │
                       │ Sync Operations
                       │ (POST, PATCH, DELETE, GET)
                       │
                       ▼
┌──────────────────────────────────────────────────────┐
│                   Backend State                      │
│  ┌────────────────────────────────────────────────┐  │
│  │ MongoDB Cart Collection                        │  │
│  │                                                │  │
│  │ {                                              │  │
│  │   user_id: ObjectId,                           │  │
│  │   items: [                                     │  │
│  │     {                                          │  │
│  │       product_id: ObjectId (ref: Product),     │  │
│  │       quantity: Number,                        │  │
│  │       unit_price: Number                       │  │
│  │     }                                          │  │
│  │   ]                                            │  │
│  │ }                                              │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

## Multi-Device Sync

```
Device A (Browser)          Backend (MongoDB)          Device B (Mobile)
      │                           │                           │
      │  1. Add item              │                           │
      ├──────────────────────────>│                           │
      │  POST /api/cart/items     │                           │
      │                           │                           │
      │  2. Item saved            │                           │
      │<──────────────────────────┤                           │
      │                           │                           │
      │                           │  3. User opens app        │
      │                           │<──────────────────────────┤
      │                           │  GET /api/cart            │
      │                           │                           │
      │                           │  4. Cart with item        │
      │                           ├──────────────────────────>│
      │                           │                           │
      │                           │  ✅ Cart synced!          │
```

## Error Recovery Flow

```
┌─────────────────────────────────────────┐
│ Operation fails (network error)         │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ Item stays in local cart                │
│ Error logged to console                 │
│ lastSyncError updated                   │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ User continues shopping                 │
│ (App still works!)                      │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ Next successful operation               │
│ OR checkout validation                  │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ Full cart sync happens                  │
│ Everything back in sync                 │
└─────────────────────────────────────────┘
```
