const promoCodeSchema = new mongoose.Schema({
  
  // 1. code
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },

  // 2. description
  description: {
    type: String,
    default: null
  },

  // 3. discountType
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  },

  // 4. discountValue
  discountValue: {
    type: Number,
    required: true,
    min: 0
  },

  // 5. minOrderAmount
  minOrderAmount: {
    type: Number,
    default: 0,
    min: 0
  },

  // 6. maxDiscountAmount
  maxDiscountAmount: {
    type: Number,
    default: null,
    min: 0
  },

  // 7. validFrom
  validFrom: {
    type: Date,
    required: true
  },

  // 8. validTo
  validTo: {
    type: Date,
    required: true
  },

  // 9. isActive
  isActive: {
    type: Boolean,
    default: true
  },

  // 10. usageLimit
  usageLimit: {
    type: Number,
    default: null,
    min: 0
  },

  // 11. usedCount
  usedCount: {
    type: Number,
    default: 0,
    min: 0
  },

  // 12. perUserLimit
  perUserLimit: {
    type: Number,
    default: 1,
    min: 1
  }

}, { timestamps: true }); // 13. timestamps

module.exports = mongoose.model('PromoCode', promoCodeSchema);
