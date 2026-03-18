# Restaurant Management System - Frontend

Production-grade React application built with modern best practices for 2025.

## Tech Stack

- **React 18.3** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **React Router v6** - Client-side routing
- **Zustand** - State management
- **Axios** - HTTP client
- **Vitest** - Testing framework
- **ESLint + Prettier** - Code quality

## Architecture

### Feature-Based Structure
```
src/
├── app/              # App entry, providers, routing
├── features/         # Domain modules (auth, products, cart, orders, reservations)
├── shared/           # Reusable components, hooks, utils
├── services/         # API layer
├── store/            # Zustand state management
└── assets/           # Static files
```

### Key Design Decisions

1. **Feature-based architecture** - Each domain (auth, products, cart) is self-contained
2. **Shared module** - Reusable components, hooks, and utilities
3. **API abstraction** - Centralized API client with interceptors
4. **State management** - Zustand for global state (auth, cart)
5. **Code splitting** - Lazy loading for route-based components
6. **CSS Modules** - Scoped styling to avoid conflicts
7. **Accessibility** - ARIA labels, semantic HTML, keyboard navigation
8. **Error handling** - Error boundaries and loading states

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
cd client
npm install
```

### Environment Setup

Create `.env` file:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

### Development

```bash
npm run dev
```

Runs on `http://localhost:3000`

### Build

```bash
npm run build
```

### Testing

```bash
npm test          # Run tests
npm run test:ui   # Run tests with UI
```

### Linting & Formatting

```bash
npm run lint      # Check code quality
npm run format    # Format code
```

## Features

### Implemented
- ✅ Authentication (login/register)
- ✅ Protected routes
- ✅ Product browsing
- ✅ Shopping cart
- ✅ Responsive design
- ✅ Error boundaries
- ✅ Loading states
- ✅ Token refresh mechanism

### Ready to Implement
- Orders management
- Table reservations
- User profile
- Admin dashboard

## API Integration

The app connects to the backend API at `/api`:
- `/api/auth` - Authentication
- `/api/products` - Products
- `/api/cart` - Cart operations
- `/api/orders` - Orders
- `/api/reservations` - Reservations

## Project Structure

```
client/
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── providers/
│   │   ├── routes/
│   │   └── styles/
│   ├── features/
│   │   ├── auth/
│   │   ├── products/
│   │   ├── cart/
│   │   ├── orders/
│   │   ├── reservations/
│   │   └── dashboard/
│   ├── shared/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── config/
│   ├── services/
│   │   └── api/
│   ├── store/
│   └── tests/
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## Performance Optimizations

- Route-based code splitting
- Lazy loading components
- Memoization where needed
- Optimized bundle size
- Tree shaking

## Accessibility

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus management
- Screen reader support

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
