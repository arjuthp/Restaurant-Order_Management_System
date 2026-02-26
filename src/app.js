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

app.use(cors({
    origin: '*',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({extended:false}));

// API Routes
app.use('/api/restaurant', restaurantRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/users", userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Serve static files
app.use(express.static(path.join(__dirname, '../client/dist')));
app.use(express.static(path.join(__dirname, '../frontend')));

// SPA fallback
app.use((req, res) => {
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ 
            success: false, 
            message: 'API endpoint not found' 
        });
    }
    
    const fs = require('fs');
    const reactIndexPath = path.join(__dirname, '../client/dist', 'index.html');
    const vanillaIndexPath = path.join(__dirname, '../frontend', 'index.html');
    
    if (fs.existsSync(reactIndexPath)) {
        res.sendFile(reactIndexPath);
    } else if (fs.existsSync(vanillaIndexPath)) {
        res.sendFile(vanillaIndexPath);
    } else {
        res.status(404).send('Frontend not found. Please run: npm run build');
    }
});

module.exports = app;