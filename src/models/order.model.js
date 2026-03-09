const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    product_name: {
        type: String,
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
//////new for reservations
    orderType: {
        type: String,
        enum: ['dine-in', 'takeout', 'delivery'],
        required: true,
        default: 'dine-in'
    },

    //link to table(for dinein orders)
    table: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Table',
        default: null //null for takeouts and delivery
    },

    //link to reservations(for pre-order)
    reservation:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reservation',
        default: null
    },

    //Delivery details
    deliveryAddress: {
        type : String,
        default: null
    },
    deliveryFee: {
        type: Number,
        default: 0
    },

    //Pickup time (for takeout)
    pickupTime: {
        type: Date,
        default: null
    },
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