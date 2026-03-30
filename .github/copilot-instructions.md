# AI Coding Agent Instructions for Restaurant Order Management System

## Project Overview
Full-stack restaurant management system: **Node.js/Express backend** + **React TypeScript frontend** with MongoDB, serving both APIs and a single-page app on port 5000.

---

## Architecture Overview

### Single Port Architecture
- **Express server (port 5000)** handles:
  - `/api/*` routes → JSON API responses
  - `/*` fallback → Serves React app (from `client/dist/`)
- **Frontend build** (`npm run build` in `/client`) outputs to `client/dist/`, served by Express
- **No separate frontend dev server** in production; dev uses `npm run dev` for Vite HMR

### Core Layers
1. **Models** (`src/models/*.model.js`) - Mongoose schemas with timestamps, soft deletes, ObjectId references
2. **Services** (`src/service/*.service.js`) - Business logic, queries, validations
3. **Controllers** (`src/controllers/*.controller.js`) - Request handlers, call services, return responses
4. **Routes** (`src/routes/*.routes.js`) - Endpoint definitions with `authorize()` middleware for role-based access

---

## Key Patterns & Conventions

### Authentication & Authorization
- **JWT tokens**: Access token (15m) + Refresh token (7d, stored in DB)
- **Middleware**: `authorize('customer')` or `authorize('admin')` enforces role-based access on routes
- **Token storage**: Frontend stores in localStorage; axios interceptor auto-attaches to requests
- **Protected endpoints**: Examples: `router.patch('/me', authorize('customer', 'admin'), updateMyProfile)`
- **Token refresh**: POST `/api/auth/refresh` with refreshToken in body

### Service Layer Pattern
- Services instantiated in controllers: `const productService = new ProductService()`
- All database operations use `.populate()` for related objects: `.populate('category', 'name slug')`
- Helper utils: `calculatePagination()`, `buildProductFilters()`, `searchFilterHelper()`
- Error format: `throw { status: 400, message: 'error text' }` caught in controllers

### Response Format
- **Success**: `successResponse(data, message?, pagination?)`
- **Error**: `errorResponse(message, status)` from `utils/responseFormatter`
- Pagination returns: `{ products, pagination: { currentPage, itemsPerPage, totalItems } }`

### Models & Data Patterns
- **ObjectId references**: Products reference Categories by `_id` (not strings)
- **Soft deletes**: `is_deleted` flag + `deleted_at` timestamp (queries filter on `is_deleted: false`)
- **Slug fields**: Categories have auto-generated slugs for URL-friendly names
- **Timestamps**: All models have `createdAt`, `updatedAt` from `{ timestamps: true }`

### Frontend (React + TypeScript)
- **Store**: Zustand for state management (auth, cart, orders)
- **API service**: `client/src/services/api/` - Each feature has typed API file (productsApi.ts, etc.)
- **Features structure**: `client/src/features/{featureName}/{pages,components,hooks}`
- **Type definitions**: Import from `api/` files: `export interface Product { category: { _id, name, slug } }`
- **Protected routes**: `<AdminRoute>` wraps admin-only pages, uses `useAuth()` context

---

## Critical Developer Workflows

### Backend Setup & Development
```bash
cd src && npm install          # Install dependencies
npm run dev                    # Start with nodemon (watches for changes)
npm run seed                   # Populate database with 48 sample products
npm run seed:admin             # Create admin user
npm test                       # Run mocha tests
```

### Frontend Development
```bash
cd client && npm install       # Install dependencies
npm run dev                    # Vite dev server (HMR on :5173)
npm run build                  # Builds to dist/ for Express to serve
npm run test                   # Run vitest
```

### Database Seeding
- `src/seedProducts.js` - Creates 48 products across 6 categories
- `src/seedCategoriesAndProducts.js` - Full seed with categories
- **Note**: Check if categories exist before creating products (prevent duplicates)

### API Testing
- REST files in `api-tests/*.rest` - Use VSCode REST Client extension
- Variables in `.rest` files: `{{baseUrl}}`, `{{customerToken}}`, `{{adminToken}}`
- Full testing checklist in `api-tests/TESTING_CHECKLIST.md`

---

## Common Integration Points

### Adding a New Feature (e.g., Reviews)
1. **Model**: Create `src/models/review.model.js` with Mongoose schema
2. **Service**: `src/service/review.service.js` - CRUD + business logic
3. **Controller**: `src/controllers/review.controller.js` - Wrap service calls with `successResponse`/`errorResponse`
4. **Routes**: `src/routes/review.routes.js` - Add `authorize('customer')` where needed
5. **Register**: Add `app.use('/api/reviews', reviewRoutes)` in `src/app.js`
6. **Frontend**: Create `client/src/services/api/reviewsApi.ts` with typed endpoints

### Database Migration/Updates
- Run migration scripts directly: `node src/migrateCategories.js`
- Test with `npm run seed` afterward to ensure data integrity
- Check `HANDLING_EXISTING_DATA.md` for patterns on gradual migrations

### Frontend API Communication
- Always use `client/src/services/api.js` axios instance (handles auth headers)
- API calls throw on 401 (logs out user), handle 4xx/5xx in try-catch
- Store responses in Zustand store for state management
- Example: `const { data } = await api.get('/products', { params: { page: 1 } })`

---

## Project-Specific Notes

- **Imports**: Backend uses CommonJS `require()`, frontend uses ES6 `import`
- **Multer**: File uploads handled in controllers with `req.files` (multiple) or `req.file` (single)
- **Cart sync**: Uses `/api/cart` endpoints; frontend maintains cart in Zustand `useCartStore`
- **Admin routes** require explicit `authorize('admin')` check - no default assumptions
- **Soft deletes** respected everywhere: always filter `is_deleted: false` in queries
- **Environment**: `.env` in `src/` with `PORT`, `MONGO_URI`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`

---

## File Structure Reference
- Core logic: `src/{models,service,controllers,routes}`
- Utilities: `src/utils/{jwt.js, responseFormatter.js, paginationHelper.js, searchFilterHelper.js}`
- Auth middleware: `src/auth/auth.middlewares.js`
- Frontend: `client/src/{features,services,store}`
- Docs: `docs/ARCHITECTURE.md`, `docs/HOW_TO_USE.md`, `COMPLETE_IMPLEMENTATION_SUMMARY.md`
