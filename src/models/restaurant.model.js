const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: null
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    opening_hours: {
        type: String,
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);
