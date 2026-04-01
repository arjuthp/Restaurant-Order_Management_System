const express = require('express');
const cors = require('cors');
const path = require('path');

const restaurantRoutes = require('./routes/restaurant.routes');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.routes');
const categoryRoutes = require('./routes/category.routes');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/order.routes');
const tableRoutes = require('./routes/table.routes');
const reservationRoutes = require('./routes/reservation.routes');
const dashboardRoutes = require('./routes/dashboard.router');
const staffRoutes = require('./routes/staff.routes');
const roleRoutes = require('./routes/role.routes');

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3002',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));



app.use(express.json());
app.use(express.urlencoded({extended:false}));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`Incoming: ${req.method} ${req.url}`);
    next();
});

// API Routes
app.use('/api/restaurant', restaurantRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/users", userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/roles', roleRoutes);

// 404 handler for undefined routes
app.use((req, res) => {
    res.status(404).json({ 
        success: false, 
        message: 'API endpoint not found' 
    });
});

// Global error handler middleware
app.use((err, req, res, next) => {
    console.error('Global error handler:', {
        message: err.message,
        stack: err.stack,
        status: err.status || 500,
        url: req.url,
        method: req.method,
    });

    const status = err.status || 500;
    res.status(status).json({
        success: false,
        message: err.message || 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? {
            message: err.message,
            stack: err.stack,
        } : undefined,
    });
});

module.exports = app;