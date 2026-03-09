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
    type: String,
    required: true
  },
  image_url: {
    type: String,
    default: null
  },
  is_available: {
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

//isdeleted 
// /deleted_at 
