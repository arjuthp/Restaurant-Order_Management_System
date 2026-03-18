# J. First Concrete Tasks to Start Now

## 🚀 Ready to Start? Here's What to Do

This document provides the exact first steps to begin implementation. Follow these tasks in order for a smooth start.

---

## Prerequisites Check

Before starting, verify:
- [ ] Node.js installed (v18+)
- [ ] MongoDB running and accessible
- [ ] Backend running on port 5000
- [ ] Frontend dev server can run on port 3000
- [ ] Git repository initialized
- [ ] Code editor ready (VS Code recommended)

---

## Task 1: Fix CORS Configuration (30 minutes)

### Why This First?
Without proper CORS, frontend can't make API calls to backend.

### Steps

1. **Update backend .env file**
```bash
cd src
# Add to .env
echo "FRONTEND_URL=http://localhost:3000" >> .env
```

2. **Update src/app.js**
```javascript
// Find the CORS configuration (around line 15-20)
// Replace:
app.use(cors({
    origin: '*',
    credentials: true
}));

// With:
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://localhost:5000', // production mode
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, mobile apps)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
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

3. **Test CORS**
```bash
# Restart backend
cd src
npm start

# Test from terminal
curl -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -X OPTIONS \
  http://localhost:5000/api/products

# Should see Access-Control-Allow-Origin header
```

### Success Criteria
- ✅ Backend accepts requests from http://localhost:3000
- ✅ CORS headers present in response
- ✅ No CORS errors in browser console

---

## Task 2: Add Centralized Error Handler (4-6 hours)

### Why This Second?
Consistent error handling makes frontend integration much easier.

### Steps

1. **Create error handler file**
```bash
cd src
mkdir -p middleware
touch middleware/errorHandler.js
```

2. **Implement error handler**
```javascript
// middleware/errorHandler.js

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  
  // Log error for debugging
  console.error('Error:', err);
  
  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new AppError(message, 404);
  }
  
  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} already exists`;
    error = new AppError(message, 400);
  }
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map(val => val.message)
      .join(', ');
    error = new AppError(message, 400);
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = new AppError(message, 401);
  }
  
  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = new AppError(message, 401);
  }
  
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    success: false,
    error: {
      message,
      statusCode,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};

module.exports = { AppError, errorHandler };
```

3. **Update app.js to use error handler**
```javascript
// At the top of src/app.js
const { errorHandler } = require('./middleware/errorHandler');

// At the bottom, after all routes, before module.exports
app.use(errorHandler);
```

4. **Update one controller to use AppError (example: product.controller.js)**
```javascript
// At the top
const { AppError } = require('../middleware/errorHandler');

// Replace error throwing
// Old:
if (!product) {
  throw { status: 404, message: 'Product not found' };
}

// New:
if (!product) {
  throw new AppError('Product not found', 404);
}
```

5. **Test error handling**
```bash
# Test 404 error
curl http://localhost:5000/api/products/invalid_id

# Should return:
# {
#   "success": false,
#   "error": {
#     "message": "Resource not found",
#     "statusCode": 404
#   }
# }
```

### Success Criteria
- ✅ Error handler middleware created
- ✅ AppError class working
- ✅ Consistent error response format
- ✅ Different error types handled correctly

---

## Task 3: Fix Filename Typos (15 minutes)

### Why This Third?
Clean up technical debt before building more features.

### Steps

1. **Rename cart controller**
```bash
cd src/controllers
mv cart.contoller.js cart.controller.js
```

2. **Update cart routes**
```javascript
// src/routes/cart.routes.js
// Change:
const cartController = require('../controllers/cart.contoller');

// To:
const cartController = require('../controllers/cart.controller');
```

3. **Rename reservation controller**
```bash
cd src/controllers
mv reservation.contollers.js reservation.controllers.js
```

4. **Update reservation routes**
```javascript
// src/routes/reservation.routes.js
// Change:
const reservationController = require('../controllers/reservation.contollers');

// To:
const reservationController = require('../controllers/reservation.controllers');
```

5. **Test that everything still works**
```bash
# Restart server
cd src
npm start

# Test cart endpoint
curl http://localhost:5000/api/cart \
  -H "Authorization: Bearer <your_token>"

# Test reservations endpoint
curl http://localhost:5000/api/reservations/availability?date=2024-03-20&timeSlot=18:00&numberOfGuests=4
```

### Success Criteria
- ✅ Files renamed correctly
- ✅ Imports updated
- ✅ No errors on server start
- ✅ Endpoints still working

---

## Task 4: Install Validation Dependencies (5 minutes)

### Why This Fourth?
Prepare for adding input validation in next task.

### Steps

1. **Install express-validator**
```bash
cd src
npm install express-validator
```

2. **Verify installation**
```bash
npm list express-validator
# Should show version number
```

### Success Criteria
- ✅ express-validator installed
- ✅ No installation errors

---

## Task 5: Add Product Validation (2 hours)

### Why This Fifth?
Start with one module to establish validation pattern.

### Steps

1. **Create validation directory and file**
```bash
cd src
mkdir -p validation
touch validation/product.validation.js
```

2. **Implement product validation**
```javascript
// validation/product.validation.js

const { body, query } = require('express-validator');

const categories = ['Nepali', 'Fusion', 'Western', 'Snacks', 'Desserts', 'Drinks'];

exports.createProductValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Product name is required')
    .isLength({ min: 3, max: 100 }).withMessage('Name must be 3-100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description max 500 characters'),
  
  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  
  body('category')
    .notEmpty().withMessage('Category is required')
    .isIn(categories).withMessage(`Category must be one of: ${categories.join(', ')}`),
  
  body('image_url')
    .optional()
    .trim()
    .isURL().withMessage('Invalid URL format'),
  
  body('is_available')
    .optional()
    .isBoolean().withMessage('is_available must be true or false'),
];

exports.updateProductValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 }).withMessage('Name must be 3-100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description max 500 characters'),
  
  body('price')
    .optional()
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  
  body('category')
    .optional()
    .isIn(categories).withMessage(`Category must be one of: ${categories.join(', ')}`),
  
  body('image_url')
    .optional()
    .trim()
    .isURL().withMessage('Invalid URL format'),
  
  body('is_available')
    .optional()
    .isBoolean().withMessage('is_available must be true or false'),
];

exports.getProductsValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  
  query('category')
    .optional()
    .isIn(categories).withMessage(`Category must be one of: ${categories.join(', ')}`),
  
  query('search')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 }).withMessage('Search must be 1-100 characters'),
  
  query('available')
    .optional()
    .isBoolean().withMessage('available must be true or false'),
];
```

3. **Create validation middleware**
```bash
touch middleware/validate.js
```

```javascript
// middleware/validate.js

const { validationResult } = require('express-validator');

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg,
        value: err.value
      }))
    });
  }
  
  next();
};
```

4. **Update product routes to use validation**
```javascript
// routes/product.routes.js

const { 
  createProductValidation, 
  updateProductValidation,
  getProductsValidation 
} = require('../validation/product.validation');
const { validate } = require('../middleware/validate');

// Update routes
router.get('/', getProductsValidation, validate, productController.getAllProducts);
router.post('/', authenticateToken, authorizeRole(['admin']), 
  createProductValidation, validate, productController.createProduct);
router.patch('/:id', authenticateToken, authorizeRole(['admin']), 
  updateProductValidation, validate, productController.updateProduct);
```

5. **Test validation**
```bash
# Test invalid product creation
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{
    "name": "AB",
    "price": -10,
    "category": "InvalidCategory"
  }'

# Should return validation errors:
# {
#   "success": false,
#   "errors": [
#     { "field": "name", "message": "Name must be 3-100 characters" },
#     { "field": "price", "message": "Price must be a positive number" },
#     { "field": "category", "message": "Category must be one of: ..." }
#   ]
# }
```

### Success Criteria
- ✅ Validation rules created
- ✅ Validation middleware working
- ✅ Product routes using validation
- ✅ Validation errors returned correctly

---

## Task 6: Create Shared UI Components (4 hours)

### Why This Sixth?
Need basic UI components before building features.

### Steps

1. **Create Badge component**
```bash
cd client/src/shared/components
touch Badge.tsx Badge.module.css
```

```typescript
// Badge.tsx
import styles from './Badge.module.css';

interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Badge = ({ 
  variant = 'default', 
  size = 'md', 
  children 
}: BadgeProps) => {
  return (
    <span className={`${styles.badge} ${styles[variant]} ${styles[size]}`}>
      {children}
    </span>
  );
};
```

```css
/* Badge.module.css */
.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-weight: 500;
  text-align: center;
}

.sm {
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
}

.md {
  font-size: 0.875rem;
}

.lg {
  font-size: 1rem;
  padding: 0.375rem 1rem;
}

.default {
  background-color: #e5e7eb;
  color: #374151;
}

.success {
  background-color: #d1fae5;
  color: #065f46;
}

.warning {
  background-color: #fef3c7;
  color: #92400e;
}

.danger {
  background-color: #fee2e2;
  color: #991b1b;
}

.info {
  background-color: #dbeafe;
  color: #1e40af;
}
```

2. **Create Select component**
```bash
touch Select.tsx Select.module.css
```

```typescript
// Select.tsx
import styles from './Select.module.css';

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

export const Select = ({
  label,
  options,
  value,
  onChange,
  error,
  placeholder = 'Select an option',
  required = false,
  disabled = false,
}: SelectProps) => {
  return (
    <div className={styles.container}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <select
        className={`${styles.select} ${error ? styles.error : ''}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required={required}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
};
```

```css
/* Select.module.css */
.container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.required {
  color: #dc2626;
  margin-left: 0.25rem;
}

.select {
  padding: 0.625rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  background-color: white;
  cursor: pointer;
  transition: border-color 0.2s;
}

.select:hover {
  border-color: #9ca3af;
}

.select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.select:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
}

.select.error {
  border-color: #dc2626;
}

.errorText {
  font-size: 0.875rem;
  color: #dc2626;
}
```

3. **Create Card component**
```bash
touch Card.tsx Card.module.css
```

```typescript
// Card.tsx
import styles from './Card.module.css';

interface CardProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const Card = ({ children, header, footer, className = '' }: CardProps) => {
  return (
    <div className={`${styles.card} ${className}`}>
      {header && <div className={styles.header}>{header}</div>}
      <div className={styles.body}>{children}</div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
};
```

```css
/* Card.module.css */
.card {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  font-weight: 600;
}

.body {
  padding: 1.5rem;
}

.footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  background-color: #f9fafb;
}
```

4. **Export components**
```typescript
// shared/components/index.ts
export { Badge } from './Badge';
export { Select } from './Select';
export { Card } from './Card';
export { Button } from './Button';
export { Input } from './Input';
export { Modal } from './Modal';
export { LoadingSpinner } from './LoadingSpinner';
export { ErrorFallback } from './ErrorFallback';
```

5. **Test components**
Create a test page to verify components render correctly.

### Success Criteria
- ✅ Badge component created and styled
- ✅ Select component created and styled
- ✅ Card component created and styled
- ✅ Components exported from index
- ✅ Components render correctly

---

## Next Steps

After completing these first tasks, you'll have:
- ✅ Secure CORS configuration
- ✅ Consistent error handling
- ✅ Clean codebase (no typos)
- ✅ Validation infrastructure
- ✅ Product validation working
- ✅ Basic UI components ready

**Continue with:** Task 7 in Phase 1 (Add validation for other modules)

---

## Quick Reference Commands

### Start Backend
```bash
cd src
npm start
```

### Start Frontend
```bash
cd client
npm run dev
```

### Test API Endpoint
```bash
curl http://localhost:5000/api/products
```

### Check Logs
```bash
# Backend logs
cd src
tail -f logs/combined.log

# Frontend console
# Open browser DevTools → Console
```

---

## Troubleshooting

### CORS Error
- Check `FRONTEND_URL` in `.env`
- Verify origin in CORS config
- Restart backend server

### Validation Not Working
- Check express-validator installed
- Verify validation middleware imported
- Check route order (validation before controller)

### Components Not Rendering
- Check import paths
- Verify CSS modules configured
- Check for TypeScript errors

---

**You're ready to start! Begin with Task 1 and work through sequentially. Good luck! 🚀**
