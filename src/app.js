const express = require('express');
const path = require('path');
const cors = require('cors');


const restaurantRoutes = require('./routes/restaurant.routes');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.routes');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/order.routes');


const app = express();

// CORS - Allow frontend to connect
app.use(cors({
    origin: '*', // Allow all origins for development
    credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended:false})); // parse form data

// API Routes (must come before static files)
app.use('/api/restaurant', restaurantRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/users", userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Serve React build files (production)
app.use(express.static(path.join(__dirname, '../client/dist')));

// Serve vanilla JS frontend (fallback)
app.use(express.static(path.join(__dirname, '../frontend')));

// SPA fallback: serve index.html for any route that doesn't match API or static files
app.use((req, res, next) => {
    // If it's an API route that didn't match, return 404 JSON
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ 
            success: false, 
            message: 'API endpoint not found' 
        });
    }
    
    const fs = require('fs');
    const reactIndexPath = path.join(__dirname, '../client/dist', 'index.html');
    const vanillaIndexPath = path.join(__dirname, '../frontend', 'index.html');
    
    // Serve React app if built, otherwise vanilla frontend
    if (fs.existsSync(reactIndexPath)) {
        res.sendFile(reactIndexPath);
    } else if (fs.existsSync(vanillaIndexPath)) {
        res.sendFile(vanillaIndexPath);
    } else {
        res.status(404).send('Frontend not found. Please run: npm run build');
    }
});

module.exports = app;