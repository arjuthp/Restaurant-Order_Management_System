# Execution Plan
# Phase-by-Phase Implementation Strategy

---

## 🎯 OVERVIEW

**Total Estimated Time:** 6-8 weeks  
**Team Size:** 1-2 developers  
**Approach:** Backend fixes first, then frontend feature-by-feature

---

## 📋 PHASE 0: PREPARATION (2-3 days)

### Goals
- Set up development environment
- Review all documentation
- Understand existing codebase
- Create task tracking system

### Tasks
1. ✅ Read all planning documents
2. ✅ Set up local development environment
3. ✅ Test all existing API endpoints
4. ✅ Create GitHub issues/project board
5. ✅ Set up code review process
6. ✅ Define coding standards

### Deliverables
- Development environment ready
- All APIs tested and documented
- Task board created
- Team aligned on approach

---

## 🔴 PHASE 1: CRITICAL BACKEND FIXES (3-5 days)

### Priority: CRITICAL - Must complete before frontend work

### 1.1 Fix CORS Configuration (1 hour)
**File:** `src/app.js`

**Current:**
```javascript
app.use(cors({
    origin: '*',
    credentials: true
}));
```

**Fix:**
```javascript
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://localhost:3001', // Vite dev server
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

**Add to `.env`:**
```
FRONTEND_URL=http://localhost:3000
```

---

### 1.2 Add Centralized Error Handler (2 hours)
**New File:** `src/middleware/errorHandler.js`

```javascript
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || err.status || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        status: err.statusCode,
        stack: err.stack
      }
    });
  } else {
    // Production
    if (err.isOperational) {
      res.status(err.statusCode).json({
        success: false,
        error: {
          message: err.message,
          status: err.statusCode
        }
      });
    } else {
      console.error('ERROR 💥', err);
      res.status(500).json({
        success: false,
        error: {
          message: 'Something went wrong',
          status: 500
        }
      });
    }
  }
};

module.exports = { AppError, errorHandler };
```

**Update:** `src/app.js`
```javascript
const { errorHandler } = require('./middleware/errorHandler');

// ... all routes ...

// Error handler (must be last)
app.use(errorHandler);
```

**Update all services to use AppError:**
```javascript
const { AppError } = require('../middleware/errorHandler');

// Instead of:
throw { status: 404, message: 'Not found' };

// Use:
throw new AppError('Not found', 404);
```

---

### 1.3 Add Input Validation (1 day)
**Install:**
```bash
npm install express-validator
```

**New File:** `src/middleware/validation.js`

```javascript
const { body, param, query, validationResult } = require('express-validator');
const { AppError } = require('./errorHandler');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => ({
      field: err.param,
      message: err.msg
    }));
    throw new AppError('Validation failed', 400);
  }
  next();
};

// Product validations
const createProductValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be positive'),
  body('category').isIn(['Nepali', 'Fusion', 'Western', 'Snacks', 'Desserts', 'Drinks'])
    .withMessage('Invalid category'),
  validate
];

// Auth validations
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password min 6 characters'),
  validate
];

// ... more validations

module.exports = {
  validate,
  createProductValidation,
  registerValidation,
  // ... export all
};
```

**Update routes to use validation:**
```javascript
const { createProductValidation } = require('../middleware/validation');

router.post('/', authorize('admin'), createProductValidation, createProduct);
```

---

### 1.4 Standardize Response Formats (1 day)
**New File:** `src/utils/response.js`

```javascript
class ApiResponse {
  static success(res, data, message = null, statusCode = 200) {
    const response = {
      success: true,
      data
    };
    if (message) response.message = message;
    return res.status(statusCode).json(response);
  }

  static successWithPagination(res, data, pagination, message = null) {
    return res.status(200).json({
      success: true,
      data,
      pagination,
      ...(message && { message })
    });
  }

  static created(res, data, message = 'Resource created successfully') {
    return res.status(201).json({
      success: true,
      data,
      message
    });
  }
}

module.exports = ApiResponse;
```

**Update controllers:**
```javascript
const ApiResponse = require('../utils/response');

async function getAllProducts(req, res) {
  const products = await productService.getAllProducts();
  return ApiResponse.success(res, products);
}
```

---

### 1.5 Fix Filename Typos (10 minutes)
```bash
mv src/controllers/cart.contoller.js src/controllers/cart.controller.js
mv src/controllers/reservation.contollers.js src/controllers/reservation.controllers.js
```

**Update imports in routes files**

---

### Phase 1 Deliverables
- ✅ CORS properly configured
- ✅ Centralized error handling
- ✅ Input validation on all endpoints
- ✅ Standardized response formats
- ✅ Filename typos fixed
- ✅ All existing tests passing

---

## 🟡 PHASE 2: ESSENTIAL BACKEND FEATURES (2-3 days)

### Priority: CRITICAL - Required for good UX

### 2.1 Implement File Upload (4-6 hours)
**Install dependencies:**
```bash
cd src
npm install multer
```

**New File:** `src/middleware/upload.middleware.js`

```javascript
const multer = require('multer');
const path = require('path');
const { AppError } = require('./errorHandler');

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/products/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new AppError('Only image files are allowed', 400));
  }
};

// Upload middleware
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: fileFilter
});

module.exports = upload;
```

**New File:** `src/controllers/upload.controller.js`

```javascript
const { AppError } = require('../middleware/errorHandler');
const ApiResponse = require('../utils/response');

exports.uploadProductImage = async (req, res) => {
  if (!req.file) {
    throw new AppError('No file uploaded', 400);
  }

  const imageUrl = `/uploads/products/${req.file.filename}`;
  
  return ApiResponse.success(res, { 
    url: imageUrl,
    filename: req.file.filename 
  }, 'Image uploaded successfully');
};
```

**New File:** `src/routes/upload.routes.js`

```javascript
const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload.controller');
const upload = require('../middleware/upload.middleware');
const { authorize } = require('../auth/auth.middlewares');

router.post(
  '/product-image',
  authorize('admin'),
  upload.single('image'),
  uploadController.uploadProductImage
);

module.exports = router;
```

**Update:** `src/app.js`

```javascript
const uploadRoutes = require('./routes/upload.routes');

// Serve static files
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/upload', uploadRoutes);
```

**Create directory:**
```bash
mkdir -p uploads/products
```

---

### 2.2 Add Pagination to All List Endpoints (6-8 hours)

**New File:** `src/utils/pagination.js`

```javascript
class Pagination {
  static paginate(query, page = 1, limit = 10) {
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    return {
      skip,
      limit: limitNum,
      page: pageNum
    };
  }

  static formatResponse(data, total, page, limit) {
    const totalPages = Math.ceil(total / limit);
    
    return {
      data,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit),
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };
  }
}

module.exports = Pagination;
```

**Update:** `src/service/product.service.js`

```javascript
const Pagination = require('../utils/pagination');

exports.getAllProducts = async (queryParams) => {
  const { page = 1, limit = 12, category, search, available } = queryParams;
  
  // Build filter
  const filter = { is_deleted: false };
  if (category) filter.category = category;
  if (available !== undefined) filter.is_available = available === 'true';
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  // Get pagination params
  const { skip, limit: limitNum } = Pagination.paginate(null, page, limit);

  // Execute query
  const products = await Product.find(filter)
    .skip(skip)
    .limit(limitNum)
    .sort({ createdAt: -1 });

  const total = await Product.countDocuments(filter);

  return Pagination.formatResponse(products, total, page, limitNum);
};
```

**Update:** `src/controllers/product.controller.js`

```javascript
const ApiResponse = require('../utils/response');

exports.getAllProducts = async (req, res) => {
  const result = await productService.getAllProducts(req.query);
  return ApiResponse.successWithPagination(
    res, 
    result.data, 
    result.pagination
  );
};
```

**Apply same pattern to:**
- Orders service/controller
- Users service/controller
- Reservations service/controller
- Tables service/controller

---

### 2.3 Add Search and Filtering (2-3 hours)

**Update:** `src/service/order.service.js`

```javascript
exports.getAllOrders = async (queryParams) => {
  const { page = 1, limit = 10, status, startDate, endDate, userId } = queryParams;
  
  const filter = {};
  if (status) filter.status = status;
  if (userId) filter.user_id = userId;
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }

  const { skip, limit: limitNum } = Pagination.paginate(null, page, limit);

  const orders = await Order.find(filter)
    .populate('user_id', 'name email')
    .populate('items.product_id')
    .skip(skip)
    .limit(limitNum)
    .sort({ createdAt: -1 });

  const total = await Order.countDocuments(filter);

  return Pagination.formatResponse(orders, total, page, limitNum);
};
```

**Update:** `src/service/reservation.service.js`

```javascript
exports.getAllReservations = async (queryParams) => {
  const { page = 1, limit = 10, status, date, userId } = queryParams;
  
  const filter = {};
  if (status) filter.status = status;
  if (userId) filter.user_id = userId;
  if (date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    filter.date = { $gte: startOfDay, $lte: endOfDay };
  }

  const { skip, limit: limitNum } = Pagination.paginate(null, page, limit);

  const reservations = await Reservation.find(filter)
    .populate('user_id', 'name email phone')
    .populate('table_id')
    .skip(skip)
    .limit(limitNum)
    .sort({ date: -1, timeSlot: -1 });

  const total = await Reservation.countDocuments(filter);

  return Pagination.formatResponse(reservations, total, page, limitNum);
};
```

---

### Phase 2 Deliverables
- ✅ File upload endpoint working
- ✅ Product images can be uploaded
- ✅ All list endpoints have pagination
- ✅ Products have search functionality
- ✅ Orders have filtering by status/date
- ✅ Reservations have filtering by status/date
- ✅ Performance improved for large datasets

---

## 🔵 PHASE 3: FRONTEND FOUNDATION (2-3 days)

### Priority: CRITICAL - Required before building features

### 3.1 Create Complete Type System (1 day)

**Create:** `client/src/types/index.ts`

```typescript
// Re-export all types
export * from './User';
export * from './Product';
export * from './Cart';
export * from './Order';
export * from './Table';
export * from './Reservation';
export * from './Restaurant';
export * from './PromoCode';
export * from './ApiResponse';
export * from './FormState';
```

**Create type files as documented in `09-FRONTEND_BACKEND_CONTRACT.md`:**
- `client/src/types/User.ts`
- `client/src/types/Product.ts`
- `client/src/types/Cart.ts`
- `client/src/types/Order.ts`
- `client/src/types/Table.ts`
- `client/src/types/Reservation.ts`
- `client/src/types/Restaurant.ts`
- `client/src/types/PromoCode.ts`
- `client/src/types/ApiResponse.ts`
- `client/src/types/FormState.ts`

---

### 3.2 Build Complete API Service Layer (1 day)

**Update:** `client/src/services/api/apiClient.ts`

Add token refresh logic as documented in `09-FRONTEND_BACKEND_CONTRACT.md`

**Create API services:**
- `client/src/services/api/cartApi.ts`
- `client/src/services/api/ordersApi.ts`
- `client/src/services/api/tablesApi.ts`
- `client/src/services/api/reservationsApi.ts`
- `client/src/services/api/restaurantApi.ts`
- `client/src/services/api/usersApi.ts`
- `client/src/services/api/uploadApi.ts`

**Create:** `client/src/services/api/index.ts`

```typescript
export * from './authApi';
export * from './productsApi';
export * from './cartApi';
export * from './ordersApi';
export * from './tablesApi';
export * from './reservationsApi';
export * from './restaurantApi';
export * from './usersApi';
export * from './uploadApi';
```

---

### 3.3 Create Shared Components (1 day)

**Create essential shared components:**

1. **Badge Component** (`client/src/shared/components/Badge.tsx`)
```typescript
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default';
  size?: 'sm' | 'md' | 'lg';
}
```

2. **Select Component** (`client/src/shared/components/Select.tsx`)
```typescript
interface SelectProps {
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}
```

3. **Table Component** (`client/src/shared/components/Table.tsx`)
```typescript
interface TableProps<T> {
  columns: Array<{
    key: string;
    header: string;
    render?: (item: T) => React.ReactNode;
  }>;
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
}
```

4. **Pagination Component** (`client/src/shared/components/Pagination.tsx`)
```typescript
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
```

5. **Card Component** (`client/src/shared/components/Card.tsx`)
6. **SearchBar Component** (`client/src/shared/components/SearchBar.tsx`)
7. **FilterDropdown Component** (`client/src/shared/components/FilterDropdown.tsx`)
8. **EmptyState Component** (`client/src/shared/components/EmptyState.tsx`)
9. **Toast Component** (`client/src/shared/components/Toast.tsx`)
10. **ConfirmDialog Component** (`client/src/shared/components/ConfirmDialog.tsx`)

---

### 3.4 Create Utility Functions (0.5 day)

**Create:** `client/src/shared/utils/formatters.ts`

```typescript
export const formatPrice = (price: number): string => {
  return `Rs. ${price.toFixed(2)}`;
};

export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
```

**Create:** `client/src/shared/utils/validators.ts`

```typescript
export const validators = {
  email: (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },
  password: (value: string): boolean => {
    return value.length >= 6;
  },
  required: (value: any): boolean => {
    return value !== null && value !== undefined && value !== '';
  },
  phone: (value: string): boolean => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(value);
  }
};
```

**Create:** `client/src/shared/utils/constants.ts`

```typescript
export const PRODUCT_CATEGORIES = [
  'Nepali', 'Indian', 'Chinese', 'Continental', 'Beverages', 'Desserts'
] as const;

export const ORDER_STATUSES = [
  'pending', 'confirmed', 'preparing', 'delivered', 'cancelled'
] as const;

export const RESERVATION_STATUSES = [
  'pending', 'confirmed', 'cancelled', 'completed'
] as const;

export const TIME_SLOTS = [
  '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
  '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'
] as const;
```

---

### 3.5 Enhance State Management (0.5 day)

**Create:** `client/src/store/restaurantStore.ts`

```typescript
import { create } from 'zustand';
import { Restaurant } from '@/types';

interface RestaurantState {
  restaurant: Restaurant | null;
  loading: boolean;
  error: string | null;
  fetchRestaurant: () => Promise<void>;
}

export const useRestaurantStore = create<RestaurantState>((set) => ({
  restaurant: null,
  loading: false,
  error: null,
  fetchRestaurant: async () => {
    // Implementation
  }
}));
```

**Update:** `client/src/store/cartStore.ts` - Add persistence

```typescript
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      // ... existing cart logic
    }),
    {
      name: 'cart-storage'
    }
  )
);
```

---

### Phase 3 Deliverables
- ✅ Complete TypeScript type system
- ✅ All API services implemented
- ✅ 10+ shared components created
- ✅ Utility functions for formatting/validation
- ✅ Constants defined
- ✅ Enhanced state management
- ✅ Cart persistence

---

## 🟢 PHASE 4: AUTHENTICATION & LAYOUTS (2-3 days)

### Priority: CRITICAL - Foundation for all pages

### 4.1 Enhance Authentication Pages (1 day)

**Update:** `client/src/features/auth/pages/AuthPage.tsx`

Add:
- Form validation
- Loading states
- Error handling
- Success messages
- Redirect after login

**Update:** `client/src/features/auth/components/LoginForm.tsx`

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  try {
    const response = await authApi.login({ email, password });
    login(response.user, response.accessToken, response.refreshToken);
    navigate('/');
  } catch (err: any) {
    setError(err.response?.data?.error?.message || 'Login failed');
  } finally {
    setLoading(false);
  }
};
```

**Update:** `client/src/features/auth/components/RegisterForm.tsx`

Add validation for:
- Name (required)
- Email (required, valid format)
- Password (required, min 6 chars)
- Phone (optional, valid format)

---

### 4.2 Create Layout Components (1 day)

**Create:** `client/src/shared/components/layouts/Header.tsx`

```typescript
export const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { items } = useCartStore();

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">Restaurant</Link>
        
        <nav>
          <Link to="/menu">Menu</Link>
          <Link to="/reservations">Reservations</Link>
          {user?.role === 'admin' && (
            <Link to="/admin">Admin</Link>
          )}
        </nav>

        <div className="actions">
          <Link to="/cart">
            Cart ({items.length})
          </Link>
          {user ? (
            <>
              <Link to="/profile">{user.name}</Link>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <Link to="/auth">Login</Link>
          )}
        </div>
      </div>
    </header>
  );
};
```

**Create:** `client/src/shared/components/layouts/Footer.tsx`

```typescript
export const Footer: React.FC = () => {
  const { restaurant } = useRestaurantStore();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div>
            <h3>{restaurant?.name || 'Restaurant'}</h3>
            <p>{restaurant?.description}</p>
          </div>
          <div>
            <h4>Contact</h4>
            <p>{restaurant?.phone}</p>
            <p>{restaurant?.email}</p>
            <p>{restaurant?.address}</p>
          </div>
          <div>
            <h4>Hours</h4>
            {/* Display opening hours */}
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Restaurant. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
```

**Create:** `client/src/shared/components/layouts/AdminLayout.tsx`

```typescript
export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <AdminHeader />
        <main>{children}</main>
      </div>
    </div>
  );
};
```

**Create:** `client/src/shared/components/layouts/AdminSidebar.tsx`

```typescript
export const AdminSidebar: React.FC = () => {
  return (
    <aside className="admin-sidebar">
      <nav>
        <Link to="/admin">Dashboard</Link>
        <Link to="/admin/products">Products</Link>
        <Link to="/admin/orders">Orders</Link>
        <Link to="/admin/tables">Tables</Link>
        <Link to="/admin/reservations">Reservations</Link>
        <Link to="/admin/users">Users</Link>
        <Link to="/admin/settings">Settings</Link>
      </nav>
    </aside>
  );
};
```

---

### 4.3 Set Up Protected Routes (0.5 day)

**Create:** `client/src/app/routes/ProtectedRoute.tsx`

```typescript
interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { user, isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
```

**Update:** `client/src/app/routes/AppRoutes.tsx`

```typescript
export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
      <Route path="/menu" element={<MainLayout><ProductsPage /></MainLayout>} />
      <Route path="/auth" element={<AuthPage />} />

      {/* Protected customer routes */}
      <Route path="/cart" element={
        <ProtectedRoute>
          <MainLayout><CartPage /></MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/orders" element={
        <ProtectedRoute>
          <MainLayout><OrdersPage /></MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/reservations" element={
        <ProtectedRoute>
          <MainLayout><ReservationsPage /></MainLayout>
        </ProtectedRoute>
      } />

      {/* Protected admin routes */}
      <Route path="/admin/*" element={
        <ProtectedRoute requireAdmin>
          <AdminLayout>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/products" element={<AdminProductsPage />} />
              <Route path="/orders" element={<AdminOrdersPage />} />
              {/* More admin routes */}
            </Routes>
          </AdminLayout>
        </ProtectedRoute>
      } />
    </Routes>
  );
};
```

---

### Phase 4 Deliverables
- ✅ Enhanced auth pages with validation
- ✅ Complete layout system (Header, Footer, MainLayout, AdminLayout)
- ✅ Protected routes working
- ✅ Admin-only routes protected
- ✅ Navigation working
- ✅ User can login/register/logout

---

## 🟣 PHASE 5: CUSTOMER FEATURES (5-7 days)

### Priority: CRITICAL - Core business functionality

### 5.1 Product Browsing (2 days)

**Update:** `client/src/features/products/pages/ProductsPage.tsx`

Add:
- Product grid/list view
- Search functionality
- Category filter
- Availability filter
- Pagination
- Loading states
- Empty states

```typescript
export const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    page: 1
  });

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await productsApi.getAll(filters);
      setProducts(response.data);
      setPagination(response.pagination);
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="products-page">
      <SearchBar 
        value={filters.search}
        onChange={(value) => setFilters({ ...filters, search: value, page: 1 })}
      />
      
      <FilterDropdown
        options={PRODUCT_CATEGORIES}
        value={filters.category}
        onChange={(value) => setFilters({ ...filters, category: value, page: 1 })}
      />

      {loading ? (
        <LoadingSpinner />
      ) : products.length === 0 ? (
        <EmptyState message="No products found" />
      ) : (
        <>
          <div className="products-grid">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          
          {pagination && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={(page) => setFilters({ ...filters, page })}
            />
          )}
        </>
      )}
    </div>
  );
};
```

**Create:** `client/src/features/products/components/ProductCard.tsx`

```typescript
interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    addItem(product, 1);
    // Show toast notification
  };

  return (
    <Card className="product-card">
      <img src={product.image_url} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <div className="product-footer">
        <span className="price">{formatPrice(product.price)}</span>
        <Badge variant={product.is_available ? 'success' : 'error'}>
          {product.is_available ? 'Available' : 'Unavailable'}
        </Badge>
      </div>
      <Button 
        onClick={handleAddToCart}
        disabled={!product.is_available}
      >
        Add to Cart
      </Button>
    </Card>
  );
};
```

**Create:** `client/src/features/products/pages/ProductDetailPage.tsx`

Show:
- Product image
- Name, description, price
- Category badge
- Availability status
- Quantity selector
- Add to cart button
- Related products (optional)

---

### 5.2 Cart Management (1 day)

**Update:** `client/src/features/cart/pages/CartPage.tsx`

```typescript
export const CartPage: React.FC = () => {
  const { items, updateQuantity, removeItem, clearCart } = useCartStore();
  const navigate = useNavigate();

  const subtotal = items.reduce((sum, item) => 
    sum + (item.product.price * item.quantity), 0
  );

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <EmptyState 
        message="Your cart is empty"
        action={<Button onClick={() => navigate('/menu')}>Browse Menu</Button>}
      />
    );
  }

  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>
      
      <div className="cart-items">
        {items.map(item => (
          <CartItem
            key={item.product._id}
            item={item}
            onUpdateQuantity={updateQuantity}
            onRemove={removeItem}
          />
        ))}
      </div>

      <div className="cart-summary">
        <h3>Order Summary</h3>
        <div className="summary-row">
          <span>Subtotal:</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="summary-row total">
          <span>Total:</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <Button onClick={handleCheckout} fullWidth>
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );
};
```

---

### 5.3 Order Placement (1 day)

**Create:** `client/src/features/orders/pages/CheckoutPage.tsx`

```typescript
export const CheckoutPage: React.FC = () => {
  const { items, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      // First, sync cart with backend
      for (const item of items) {
        await cartApi.addItem({
          product_id: item.product._id,
          quantity: item.quantity
        });
      }

      // Then create order
      const order = await ordersApi.createFromCart({ notes });
      
      // Clear local cart
      clearCart();
      
      // Show success message
      toast.success('Order placed successfully!');
      
      // Navigate to order details
      navigate(`/orders/${order._id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      
      <div className="checkout-content">
        <div className="order-items">
          <h2>Order Items</h2>
          {items.map(item => (
            <div key={item.product._id} className="checkout-item">
              <span>{item.product.name}</span>
              <span>x{item.quantity}</span>
              <span>{formatPrice(item.product.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        <div className="order-notes">
          <h2>Special Instructions</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any special requests?"
            rows={4}
          />
        </div>

        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>{formatPrice(calculateSubtotal(items))}</span>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <span>{formatPrice(calculateSubtotal(items))}</span>
          </div>
          <Button 
            onClick={handlePlaceOrder} 
            loading={loading}
            fullWidth
          >
            Place Order
          </Button>
        </div>
      </div>
    </div>
  );
};
```

---

### 5.4 Order History & Details (1 day)

**Update:** `client/src/features/orders/pages/OrdersPage.tsx`

```typescript
export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    page: 1
  });

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await ordersApi.getMyOrders(filters);
      setOrders(response.data);
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="orders-page">
      <h1>My Orders</h1>
      
      <FilterDropdown
        options={ORDER_STATUSES}
        value={filters.status}
        onChange={(value) => setFilters({ ...filters, status: value })}
      />

      {loading ? (
        <LoadingSpinner />
      ) : orders.length === 0 ? (
        <EmptyState message="No orders yet" />
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};
```

**Create:** `client/src/features/orders/pages/OrderDetailPage.tsx`

```typescript
export const OrderDetailPage: React.FC = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const data = await ordersApi.getById(orderId!);
      setOrder(data);
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!order) return <EmptyState message="Order not found" />;

  return (
    <div className="order-detail-page">
      <h1>Order #{order._id.slice(-6)}</h1>
      
      <div className="order-info">
        <Badge variant={getStatusVariant(order.status)}>
          {order.status}
        </Badge>
        <p>Placed on {formatDateTime(order.createdAt)}</p>
      </div>

      <div className="order-items">
        <h2>Items</h2>
        {order.items.map((item, index) => (
          <div key={index} className="order-item">
            <span>{item.product_id.name}</span>
            <span>x{item.quantity}</span>
            <span>{formatPrice(item.unit_price * item.quantity)}</span>
          </div>
        ))}
      </div>

      <div className="order-summary">
        <div className="summary-row">
          <span>Subtotal:</span>
          <span>{formatPrice(order.subtotal)}</span>
        </div>
        <div className="summary-row total">
          <span>Total:</span>
          <span>{formatPrice(order.total_price)}</span>
        </div>
      </div>

      {order.notes && (
        <div className="order-notes">
          <h3>Special Instructions</h3>
          <p>{order.notes}</p>
        </div>
      )}
    </div>
  );
};
```

---

### 5.5 Reservations (Optional - 1-2 days)

**Create:** `client/src/features/reservations/pages/ReservationsPage.tsx`

Features:
- Check availability
- Select date and time
- Select number of guests
- View available tables
- Create reservation
- View my reservations
- Cancel reservation

---

### Phase 5 Deliverables
- ✅ Product browsing with search/filter
- ✅ Product detail page
- ✅ Cart management
- ✅ Order placement (checkout)
- ✅ Order history
- ✅ Order details
- ✅ Complete customer e-commerce flow
- ✅ Reservations (optional)

---

## 🔴 PHASE 6: ADMIN FEATURES (4-5 days)

### Priority: CRITICAL - Admin needs to manage the system

### 6.1 Admin Dashboard (1 day)

**Create:** `client/src/features/dashboard/pages/AdminDashboardPage.tsx`

```typescript
export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalReservations: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    // Fetch stats from various endpoints
    const [orders, products, reservations] = await Promise.all([
      ordersApi.getAll({ limit: 1000 }),
      productsApi.getAll({ limit: 1000 }),
      reservationsApi.getAll({ limit: 1000 })
    ]);

    setStats({
      totalOrders: orders.pagination.totalItems,
      pendingOrders: orders.data.filter(o => o.status === 'pending').length,
      totalRevenue: orders.data.reduce((sum, o) => sum + o.total_price, 0),
      totalProducts: products.pagination.totalItems,
      totalReservations: reservations.pagination.totalItems
    });
  };

  return (
    <div className="admin-dashboard">
      <h1>Dashboard</h1>
      
      <div className="stats-grid">
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon="📦"
        />
        <StatCard
          title="Pending Orders"
          value={stats.pendingOrders}
          icon="⏳"
          variant="warning"
        />
        <StatCard
          title="Total Revenue"
          value={formatPrice(stats.totalRevenue)}
          icon="💰"
          variant="success"
        />
        <StatCard
          title="Products"
          value={stats.totalProducts}
          icon="🍽️"
        />
        <StatCard
          title="Reservations"
          value={stats.totalReservations}
          icon="📅"
        />
      </div>

      <div className="recent-orders">
        <h2>Recent Orders</h2>
        {/* Show recent orders table */}
      </div>
    </div>
  );
};
```

---

### 6.2 Product Management (1.5 days)

**Create:** `client/src/features/products/pages/AdminProductsPage.tsx`

```typescript
export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleCreate = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await productsApi.delete(id);
      fetchProducts();
    }
  };

  return (
    <div className="admin-products-page">
      <div className="page-header">
        <h1>Products</h1>
        <Button onClick={handleCreate}>Add Product</Button>
      </div>

      <Table
        columns={[
          { key: 'image_url', header: 'Image', render: (p) => <img src={p.image_url} /> },
          { key: 'name', header: 'Name' },
          { key: 'category', header: 'Category' },
          { key: 'price', header: 'Price', render: (p) => formatPrice(p.price) },
          { key: 'is_available', header: 'Status', render: (p) => (
            <Badge variant={p.is_available ? 'success' : 'error'}>
              {p.is_available ? 'Available' : 'Unavailable'}
            </Badge>
          )},
          { key: 'actions', header: 'Actions', render: (p) => (
            <>
              <Button size="sm" onClick={() => handleEdit(p)}>Edit</Button>
              <Button size="sm" variant="danger" onClick={() => handleDelete(p._id)}>Delete</Button>
            </>
          )}
        ]}
        data={products}
        loading={loading}
      />

      {showModal && (
        <ProductFormModal
          product={editingProduct}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            fetchProducts();
          }}
        />
      )}
    </div>
  );
};
```
