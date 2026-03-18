# Frontend-Backend Contract
# TypeScript Interfaces & API Contract

---

## 🎯 PURPOSE

This document defines the exact contract between frontend and backend, including:
- TypeScript interfaces matching backend models
- API request/response types
- Naming conventions
- Data transformation rules

---

## 📦 CORE TYPE DEFINITIONS

### User Types

```typescript
// client/src/types/User.ts

export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string | null;
  address: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  role?: UserRole;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  address?: string;
}
```

---

### Product Types

```typescript
// client/src/types/Product.ts

export type ProductCategory = 
  | 'Nepali' 
  | 'Indian' 
  | 'Chinese' 
  | 'Continental' 
  | 'Beverages' 
  | 'Desserts';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  image_url: string;
  is_available: boolean;
  is_deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  image_url?: string;
  is_available?: boolean;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  category?: ProductCategory;
  image_url?: string;
  is_available?: boolean;
}

export interface ProductsQueryParams {
  page?: number;
  limit?: number;
  category?: ProductCategory;
  search?: string;
  available?: boolean;
  sort?: string;
}
```

---

### Cart Types

```typescript
// client/src/types/Cart.ts

import { Product } from './Product';

export interface CartItem {
  product_id: Product;
  quantity: number;
  unit_price: number;
}

export interface Cart {
  _id: string;
  user_id: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartRequest {
  product_id: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

// Computed cart summary (frontend only)
export interface CartSummary {
  subtotal: number;
  tax: number;
  total: number;
  itemCount: number;
}
```

---

### Order Types

```typescript
// client/src/types/Order.ts

import { Product } from './Product';
import { User } from './User';
import { Table } from './Table';
import { Reservation } from './Reservation';

export type OrderType = 'dine-in' | 'takeout' | 'delivery';

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'preparing' 
  | 'delivered' 
  | 'cancelled';

export interface OrderItem {
  product_id: Product;
  quantity: number;
  unit_price: number;
}

export interface Order {
  _id: string;
  user_id: string | User;
  items: OrderItem[];
  orderType: OrderType;
  table: string | Table | null;
  reservation: string | Reservation | null;
  subtotal: number;
  total_price: number;
  status: OrderStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  itemsToOrder?: string[]; // product IDs
  notes?: string;
}

export interface CreatePreOrderRequest {
  notes?: string;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

export interface OrdersQueryParams {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  startDate?: string;
  endDate?: string;
}
```

---

### Table Types

```typescript
// client/src/types/Table.ts

export type TableStatus = 'available' | 'occupied' | 'reserved';

export interface Table {
  _id: string;
  tableNumber: number;
  capacity: number;
  location: string;
  status: TableStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTableRequest {
  tableNumber: number;
  capacity: number;
  location?: string;
  status?: TableStatus;
}

export interface UpdateTableRequest {
  tableNumber?: number;
  capacity?: number;
  location?: string;
  status?: TableStatus;
}
```

---

### Reservation Types

```typescript
// client/src/types/Reservation.ts

import { User } from './User';
import { Table } from './Table';

export type ReservationStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'cancelled' 
  | 'completed';

export interface Reservation {
  _id: string;
  user_id: string | User;
  table_id: string | Table;
  date: string;
  timeSlot: string;
  numberOfGuests: number;
  specialRequests: string;
  contactPhone: string;
  status: ReservationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CheckAvailabilityRequest {
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g., "18:00"
  numberOfGuests: number;
}

export interface AvailabilityResponse {
  available: boolean;
  availableTables: Table[];
}

export interface CreateReservationRequest {
  table_id: string;
  date: string;
  timeSlot: string;
  numberOfGuests: number;
  specialRequests?: string;
  contactPhone: string;
}

export interface UpdateReservationStatusRequest {
  status: ReservationStatus;
}

export interface ReservationsQueryParams {
  page?: number;
  limit?: number;
  status?: ReservationStatus;
  date?: string;
}
```

---

### Restaurant Types

```typescript
// client/src/types/Restaurant.ts

export interface OpeningHours {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

export interface Restaurant {
  _id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  openingHours: OpeningHours;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateRestaurantRequest {
  name?: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  openingHours?: Partial<OpeningHours>;
}
```

---

### Promo Code Types (Future)

```typescript
// client/src/types/PromoCode.ts

export type DiscountType = 'percentage' | 'fixed';

export interface PromoCode {
  _id: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount: number;
  maxDiscount: number;
  validFrom: string;
  validUntil: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ValidatePromoCodeRequest {
  code: string;
  orderAmount: number;
}

export interface ValidatePromoCodeResponse {
  valid: boolean;
  discount: number;
  message: string;
}
```

---

## 🔄 API RESPONSE WRAPPERS

### Standard Response Format

```typescript
// client/src/types/ApiResponse.ts

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
  pagination?: PaginationMeta;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: Record<string, string[]>;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}
```

---

## 🛠️ UTILITY TYPES

### Form State Types

```typescript
// client/src/types/FormState.ts

export interface FormState<T> {
  data: T;
  errors: Partial<Record<keyof T, string>>;
  isSubmitting: boolean;
  isValid: boolean;
}

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}
```

---

## 🔌 API SERVICE LAYER STRUCTURE

### Example: Products API Service

```typescript
// client/src/services/api/productsApi.ts

import { apiClient } from './apiClient';
import { 
  Product, 
  CreateProductRequest, 
  UpdateProductRequest,
  ProductsQueryParams,
  PaginatedResponse 
} from '@/types';

export const productsApi = {
  // Get all products (with pagination)
  getAll: async (params?: ProductsQueryParams): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get('/products', { params });
    return response.data;
  },

  // Get single product
  getById: async (id: string): Promise<Product> => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  // Create product (admin)
  create: async (data: CreateProductRequest): Promise<Product> => {
    const response = await apiClient.post('/products', data);
    return response.data;
  },

  // Update product (admin)
  update: async (id: string, data: UpdateProductRequest): Promise<Product> => {
    const response = await apiClient.patch(`/products/${id}`, data);
    return response.data;
  },

  // Delete product (admin)
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },
};
```

---

## 📝 NAMING CONVENTIONS

### Backend → Frontend Mapping

| Backend Field | Frontend Field | Notes |
|--------------|----------------|-------|
| `_id` | `_id` or `id` | Keep `_id` for consistency with MongoDB |
| `user_id` | `user_id` or `userId` | Use snake_case to match backend |
| `product_id` | `product_id` or `productId` | Use snake_case to match backend |
| `is_available` | `is_available` or `isAvailable` | Use snake_case to match backend |
| `is_deleted` | `is_deleted` or `isDeleted` | Use snake_case to match backend |
| `image_url` | `image_url` or `imageUrl` | Use snake_case to match backend |
| `total_price` | `total_price` or `totalPrice` | Use snake_case to match backend |
| `createdAt` | `createdAt` | Already camelCase |
| `updatedAt` | `updatedAt` | Already camelCase |

**Recommendation:** Use snake_case for fields that come directly from backend to avoid transformation overhead. Use camelCase for frontend-only computed fields.

---

## 🔄 DATA TRANSFORMATION RULES

### Date Handling

```typescript
// Backend sends ISO strings
// Frontend should parse to Date objects when needed

export const parseDate = (dateString: string): Date => {
  return new Date(dateString);
};

export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString();
};

export const formatDateTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString();
};
```

---

### Price Formatting

```typescript
// Backend sends numbers
// Frontend formats for display

export const formatPrice = (price: number): string => {
  return `Rs. ${price.toFixed(2)}`;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-NP', {
    style: 'currency',
    currency: 'NPR',
  }).format(amount);
};
```

---

### Status Badge Mapping

```typescript
// Map status to colors for UI

export const orderStatusColors: Record<OrderStatus, string> = {
  pending: 'yellow',
  confirmed: 'blue',
  preparing: 'orange',
  delivered: 'green',
  cancelled: 'red',
};

export const reservationStatusColors: Record<ReservationStatus, string> = {
  pending: 'yellow',
  confirmed: 'green',
  cancelled: 'red',
  completed: 'gray',
};
```

---

## 🔐 AUTH TOKEN HANDLING

### Token Storage

```typescript
// client/src/services/auth/tokenService.ts

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export const tokenService = {
  getAccessToken: (): string | null => {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  setAccessToken: (token: string): void => {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setRefreshToken: (token: string): void => {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  clearTokens: (): void => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};
```

---

### Request Interceptor

```typescript
// client/src/services/api/apiClient.ts

import axios from 'axios';
import { tokenService } from '../auth/tokenService';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retried, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = tokenService.getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const response = await axios.post('/api/auth/refresh', {
          refreshToken,
        });

        const { accessToken } = response.data;
        tokenService.setAccessToken(accessToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        tokenService.clearTokens();
        window.location.href = '/auth';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
```

---

## 📊 VALIDATION RULES

### Frontend Validation (must match backend)

```typescript
// client/src/shared/utils/validators.ts

export const validators = {
  email: (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },

  password: (value: string): boolean => {
    // Minimum 6 characters (match backend)
    return value.length >= 6;
  },

  phone: (value: string): boolean => {
    // Optional validation for phone format
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(value);
  },

  required: (value: any): boolean => {
    return value !== null && value !== undefined && value !== '';
  },

  minLength: (value: string, min: number): boolean => {
    return value.length >= min;
  },

  maxLength: (value: string, max: number): boolean => {
    return value.length <= max;
  },

  min: (value: number, min: number): boolean => {
    return value >= min;
  },

  max: (value: number, max: number): boolean => {
    return value <= max;
  },
};
```

---

## 🎨 CONSTANTS

### Shared Constants

```typescript
// client/src/shared/utils/constants.ts

export const PRODUCT_CATEGORIES = [
  'Nepali',
  'Indian',
  'Chinese',
  'Continental',
  'Beverages',
  'Desserts',
] as const;

export const ORDER_TYPES = ['dine-in', 'takeout', 'delivery'] as const;

export const ORDER_STATUSES = [
  'pending',
  'confirmed',
  'preparing',
  'delivered',
  'cancelled',
] as const;

export const RESERVATION_STATUSES = [
  'pending',
  'confirmed',
  'cancelled',
  'completed',
] as const;

export const TABLE_STATUSES = ['available', 'occupied', 'reserved'] as const;

export const USER_ROLES = ['customer', 'admin'] as const;

export const TIME_SLOTS = [
  '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30',
  '20:00', '20:30', '21:00', '21:30',
] as const;

export const PAGINATION_DEFAULTS = {
  page: 1,
  limit: 12,
} as const;
```

---

## ✅ TYPE SAFETY CHECKLIST

- [ ] All backend models have corresponding TypeScript interfaces
- [ ] All API requests have typed request bodies
- [ ] All API responses have typed response bodies
- [ ] All query parameters are typed
- [ ] All form data is typed
- [ ] All state is typed
- [ ] No `any` types used (except where absolutely necessary)
- [ ] Enums/unions used for fixed values (status, role, etc.)
- [ ] Validation rules match backend validation
- [ ] Date handling is consistent
- [ ] Price formatting is consistent
- [ ] Error handling is typed

---

