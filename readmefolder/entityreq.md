Here you go!

---

## 🔐 Auth / User Schema

```js
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    default: null
  },
  address: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ["customer", "admin"],
    default: "customer"
  }
}, { timestamps: true })
```

---

## 🏪 Restaurant Schema

```js
const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: null
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  opening_hours: {
    type: String,
    default: null
  }
}, { timestamps: true })
```

---

## 🍔 Product Schema

```js
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: null
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true
  },
  image_url: {
    type: String,
    default: null
  },
  is_available: {
    type: Boolean,
    default: true
  }
}, { timestamps: true })
```

---

## 🛒 Cart Schema

```js
const cartItemSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  unit_price: {
    type: Number,
    required: true
  }
})

const cartSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  items: [cartItemSchema]
}, { timestamps: true })
```

---

## 📦 Order Schema

```js
const orderItemSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  unit_price: {
    type: Number,
    required: true
  }
})

const orderSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  items: [orderItemSchema],
  status: {
    type: String,
    enum: ["pending", "confirmed", "preparing", "delivered", "cancelled"],
    default: "pending"
  },
  total_price: {
    type: Number,
    required: true,
    min: 0
  },
  notes: {
    type: String,
    default: null
  }
}, { timestamps: true })
```

---

## Quick Notes

| Thing | Why |
|-------|-----|
| `{ timestamps: true }` | Auto adds `createdAt` and `updatedAt` on every schema |
| `ref: "User"` | Enables `.populate()` to get full user data |
| `unit_price` in cart and order items | Snapshot of price at that moment — protects against future price changes |
| Cart has `unique: true` on `user_id` | One cart per customer only |
| Items are embedded as sub-documents | Cleaner than separate collections for this scale |