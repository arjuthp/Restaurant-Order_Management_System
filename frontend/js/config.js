// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

const API_ENDPOINTS = {
    // Auth
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    ADMIN_LOGIN: '/auth/admin/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    
    // User
    GET_PROFILE: '/users/me',
    UPDATE_PROFILE: '/users/me',
    DELETE_ACCOUNT: '/users/me',
    GET_ALL_USERS: '/users',
    
    // Restaurant (to be implemented)
    GET_RESTAURANT: '/restaurant',
    UPDATE_RESTAURANT: '/restaurant',
    
    // Products (to be implemented)
    GET_PRODUCTS: '/products',
    GET_PRODUCT: '/products/:id',
    CREATE_PRODUCT: '/products',
    UPDATE_PRODUCT: '/products/:id',
    DELETE_PRODUCT: '/products/:id',
    
    // Cart (to be implemented)
    GET_CART: '/cart',
    ADD_TO_CART: '/cart/items',
    UPDATE_CART_ITEM: '/cart/items/:productId',
    REMOVE_FROM_CART: '/cart/items/:productId',
    CLEAR_CART: '/cart',
    
    // Orders (to be implemented)
    CREATE_ORDER: '/orders',
    GET_MY_ORDERS: '/orders',
    GET_ORDER: '/orders/:id',
    GET_ALL_ORDERS: '/orders/admin',
    UPDATE_ORDER_STATUS: '/orders/:id/status',
    CANCEL_ORDER: '/orders/:id'
};

// Local Storage Keys
const STORAGE_KEYS = {
    ACCESS_TOKEN: 'accessToken',
    REFRESH_TOKEN: 'refreshToken',
    USER: 'user'
};
