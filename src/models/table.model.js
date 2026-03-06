const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  tableNumber: {
    type: Number,
    required: true,
    unique: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  location: {
    type: String
  },
  status: {
    type: String,
    required: true,
    default: "active",
    enum: ["active", "inactive"]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Table', tableSchema);
