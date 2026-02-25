const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    unit_price: {
        type: Number, 
        required: true
    }

});

const orderSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [orderItemSchema],
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'preparing', 'delivered', 'cancelled'],
        default: 'pending'
    },
    total_price: {
        type: Number,
        required: true,
        min: 0
    },
    notes: {
        type: String,
        default: null
    }
}, {timestamps: true});

module.exports = mongoose.model('Order', orderSchema);