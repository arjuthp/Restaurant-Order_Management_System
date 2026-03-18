# Frontend Architecture Documentation

## Overview

This is a production-grade React application following modern best practices for scalability, maintainability, and performance.

## Architecture Principles

### 1. Feature-Based Structure
Each feature is self-contained with its own components, pages, and logic:
- Easy to locate code
- Clear boundaries
- Scalable for large teams
- Easy to delete/refactor features

### 2. Separation of Concerns
- **app/** - Application setup and configuration
- **features/** - Business logic and domain-specific code
- **shared/** - Reusable, generic code
- **services/** - External integrations (API)
- **store/** - Global state management

### 3. Component Design

#### Shared Components
Located in `shared/components/`, these are:
- Generic and reusable
- No business logic
- Highly configurable via props
- Examples: Button, Input, Modal, LoadingSpinner

#### Feature Components
Located in `features/*/components/`, these are:
- Domain-specific
- Can contain business logic
- May use shared components
- Examples: LoginForm, ProductCard

### 4. State Management Strategy

#### Local State (useState)
- Component-specific state
- Form inputs
- UI toggles

#### Global State (Zustand)
- Authentication state
- Shopping cart
- User preferences

**Why Zustand?**
- Minimal boilerplate
- No providers needed
- TypeScript-friendly
- Built-in persistence

### 5. API Layer

#### Centralized API Client
`services/api/apiClient.ts` provides:
- Axios instance with base configuration
- Request/response interceptors
- Token management
- Automatic token refresh
- Error handling

#### Feature-Specific API Modules
- `authApi.ts` - Authentication endpoints
- `productsApi.ts` - Product endpoints
- Each module exports typed functions

### 6. Routing Strategy

#### Code Splitting
- Lazy loading for route components
- Reduces initial bundle size
- Faster page loads

#### Protected Routes
- `ProtectedRoute` component
- Redirects unauthenticated users
- Checks auth state from Zustand

### 7. Error Handling

#### Error Boundaries
- Catches React component errors
- Provides fallback UI
- Prevents app crashes

#### API Error Handling
- Centralized in API client
- User-friendly error messages
- Automatic retry for 401 errors

### 8. Performance Optimizations

- Route-based code splitting
- Lazy loading components
- CSS Modules for scoped styles
- Vite for fast builds
- Tree shaking

### 9. Accessibility

- Semantic HTML elements
- ARIA labels and roles
- Keyboard navigation support
- Focus management
- Screen reader compatibility

### 10. Type Safety

- TypeScript throughout
- Strict mode enabled
- Interface definitions for API responses
- Type-safe state management

## Folder Structure Explained

```
src/
├── app/                    # Application core
│   ├── App.tsx            # Root component
│   ├── providers/         # Context providers
│   ├── routes/            # Routing configuration
│   └── styles/            # Global styles
│
├── features/              # Feature modules
│   ├── auth/
│   │   ├── components/    # Auth-specific components
│   │   └── pages/         # Auth pages
│   ├── products/
│   ├── cart/
│   ├── orders/
│   └── reservations/
│
├── shared/                # Shared resources
│   ├── components/        # Reusable UI components
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Utility functions
│   └── config/            # Configuration
│
├── services/              # External services
│   └── api/               # API integration
│
├── store/                 # Global state
│   ├── authStore.ts
│   └── cartStore.ts
│
└── tests/                 # Test utilities
    └── setup.ts
```

## Data Flow

1. **User Action** → Component event handler
2. **Component** → Calls API service function
3. **API Service** → Makes HTTP request via apiClient
4. **API Client** → Adds auth token, sends request
5. **Response** → Updates Zustand store or local state
6. **State Change** → Component re-renders

## Adding New Features

### Step 1: Create Feature Folder
```
features/
└── my-feature/
    ├── components/
    ├── pages/
    └── hooks/ (optional)
```

### Step 2: Create API Module
```typescript
// services/api/myFeatureApi.ts
export const myFeatureApi = {
  getAll: () => apiClient.get('/my-feature'),
  // ...
};
```

### Step 3: Add Routes
```typescript
// app/routes/AppRouter.tsx
const MyFeaturePage = lazy(() => import('@/features/my-feature/pages/MyFeaturePage'));
```

### Step 4: (Optional) Add Store
```typescript
// store/myFeatureStore.ts
export const useMyFeatureStore = create<MyFeatureState>()(...);
```

## Testing Strategy

- **Unit Tests** - Individual components and functions
- **Integration Tests** - Feature workflows
- **Vitest** - Fast, Vite-native testing
- **Testing Library** - User-centric testing

## Build & Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Environment Variables

- `VITE_API_BASE_URL` - Backend API URL
- All env vars must be prefixed with `VITE_`

## Best Practices

1. **Keep components small** - Single responsibility
2. **Use TypeScript** - Catch errors early
3. **Write tests** - Ensure reliability
4. **Follow naming conventions** - Consistency matters
5. **Document complex logic** - Help future developers
6. **Use semantic HTML** - Accessibility first
7. **Optimize images** - Performance matters
8. **Handle errors gracefully** - Better UX
9. **Keep dependencies updated** - Security & features
10. **Review code** - Maintain quality

## Common Patterns

### Custom Hooks
```typescript
// shared/hooks/useAsync.ts
export const useAsync = <T>(asyncFn: () => Promise<T>) => {
  // Reusable async logic
};
```

### API Calls
```typescript
const { data, isLoading, error } = useAsync(() => 
  productsApi.getAll()
);
```

### Form Handling
```typescript
const [formData, setFormData] = useState({});
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  await api.submit(formData);
};
```

## Troubleshooting

### Build Errors
- Check TypeScript errors: `npm run lint`
- Clear node_modules: `rm -rf node_modules && npm install`

### Runtime Errors
- Check browser console
- Verify API endpoint URLs
- Check network tab for failed requests

### Performance Issues
- Use React DevTools Profiler
- Check bundle size: `npm run build`
- Lazy load heavy components
