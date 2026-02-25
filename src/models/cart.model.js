const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    product_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required: true
    },
    quantity:{
        type: Number,
        required: true,
        min: 1
    },
    unit_price: {
        type: Number,
        required: true
    }
});

const cartSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true // one cart per person
    },
    items: [cartItemSchema]
}, {timestamps: true});

module.exports = mongoose.model('Cart', cartSchema);