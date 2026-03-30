const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: null
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  image_url: {
    type: String,
    default: null
  },
  images: {
    type: [String],
    default: []
  },
  is_available: {
    type: Boolean,
    default: true
  },
  quantity: {
    type: Number,
    default: 10,
    min: 0
  },
  low_stock_threshold: {
    type: Number,
    default: 10,
    min: 0
  },
  track_inventory:{
    type: Boolean,
    default: true
  },

  is_deleted: {
    type: Boolean,
    default: false
  },
  deleted_at: {
    type: Date,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema); 
