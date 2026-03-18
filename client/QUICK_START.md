# Quick Start Guide

## 🚀 Get Running in 3 Steps

### 1. Install Dependencies
```bash
cd client
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

Edit `.env` if your backend runs on a different port:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000`

## 📁 Project Structure

```
client/
├── src/
│   ├── app/              # App setup (routing, providers)
│   ├── features/         # Feature modules
│   │   ├── auth/         # Login/Register
│   │   ├── products/     # Menu browsing
│   │   ├── cart/         # Shopping cart
│   │   ├── orders/       # Order management
│   │   ├── reservations/ # Table booking
│   │   └── dashboard/    # Home dashboard
│   ├── shared/           # Reusable components
│   │   ├── components/   # Button, Input, Modal, etc.
│   │   ├── hooks/        # Custom hooks
│   │   └── utils/        # Helper functions
│   ├── services/         # API integration
│   ├── store/            # Global state (Zustand)
│   └── tests/            # Test setup
```

## 🎯 Key Features

### Authentication
- Login/Register forms
- JWT token management
- Automatic token refresh
- Protected routes

### Products
- Browse menu items
- Filter by category
- Add to cart

### Shopping Cart
- Add/remove items
- Update quantities
- Persistent storage

### State Management
- **Auth Store** - User authentication state
- **Cart Store** - Shopping cart with persistence

## 🛠️ Available Scripts

```bash
npm run dev       # Start dev server (port 3000)
npm run build     # Production build
npm run preview   # Preview production build
npm test          # Run tests
npm run lint      # Check code quality
npm run format    # Format code with Prettier
```

## 🔌 API Integration

The app proxies API requests to your backend:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`
- API calls to `/api/*` are proxied automatically

## 📝 Adding a New Feature

### 1. Create Feature Folder
```bash
mkdir -p src/features/my-feature/{components,pages}
```

### 2. Create Page Component
```typescript
// src/features/my-feature/pages/MyFeaturePage.tsx
const MyFeaturePage = () => {
  return <div>My Feature</div>;
};

export default MyFeaturePage;
```

### 3. Add Route
```typescript
// src/app/routes/AppRouter.tsx
const MyFeaturePage = lazy(() => import('@/features/my-feature/pages/MyFeaturePage'));

// Add to routes:
<Route path="/my-feature" element={<MyFeaturePage />} />
```

### 4. Create API Module (if needed)
```typescript
// src/services/api/myFeatureApi.ts
import { apiClient } from './apiClient';

export const myFeatureApi = {
  getAll: () => apiClient.get('/my-feature'),
  getById: (id: string) => apiClient.get(`/my-feature/${id}`),
};
```

## 🎨 Using Shared Components

### Button
```typescript
import { Button } from '@/shared/components/Button';

<Button variant="primary" size="md" onClick={handleClick}>
  Click Me
</Button>
```

### Input
```typescript
import { Input } from '@/shared/components/Input';

<Input
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={errors.email}
  required
/>
```

### Modal
```typescript
import { Modal } from '@/shared/components/Modal';

<Modal isOpen={isOpen} onClose={handleClose} title="My Modal">
  <p>Modal content</p>
</Modal>
```

## 🧪 Writing Tests

```typescript
// src/features/my-feature/__tests__/MyComponent.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MyComponent } from '../MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors
```bash
# Check for errors
npm run lint
```

### API Connection Issues
1. Verify backend is running on port 5000
2. Check `.env` file has correct API URL
3. Check browser console for CORS errors

## 📚 Learn More

- [Full Architecture Documentation](./ARCHITECTURE.md)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Zustand Documentation](https://zustand-demo.pmnd.rs)
- [React Router Documentation](https://reactrouter.com)

## 🎓 Best Practices

1. **Keep components small** - Single responsibility
2. **Use TypeScript** - Type everything
3. **Write tests** - Test user behavior
4. **Handle errors** - Always show feedback
5. **Accessibility** - Use semantic HTML
6. **Performance** - Lazy load when possible
7. **Code style** - Run `npm run format` before committing

## 🚢 Deployment

### Build for Production
```bash
npm run build
```

Output in `dist/` folder.

### Deploy to Vercel/Netlify
1. Connect your Git repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variable: `VITE_API_BASE_URL`

### Deploy with Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 💡 Tips

- Use `@/` alias for imports (e.g., `@/shared/components/Button`)
- Check `ARCHITECTURE.md` for detailed explanations
- Run tests before committing: `npm test`
- Format code automatically: `npm run format`
- Use React DevTools for debugging
