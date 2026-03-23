const { body } = require('express-validator');
const { handleValidationErrors } = require('../middlewares/validation.middleware');

/**
 * Valid order statuses
 * These match your order workflow
 */
const VALID_ORDER_STATUSES = [
  'pending',
  'confirmed',
  'preparing',
  'ready',
  'delivered',
  'cancelled'
];

/**
 * Validation rules for creating an order
 * 
 * Validates:
 * - itemsToOrder: Optional, array of product IDs (if provided, must not be empty)
 * - notes: Optional, max 500 characters
 * 
 * Note: If itemsToOrder is not provided, the service will use all items from the user's cart.
 * If itemsToOrder is provided, it should be an array of product IDs (strings) to order from the cart.
 */
const validateCreateOrder = [
  // Items array validation (optional - if not provided, cart items will be used)
  body('itemsToOrder')
    .optional()
    .isArray({ min: 1 })                       // If provided, must be array with at least 1 item
    .withMessage('If itemsToOrder is provided, it must contain at least one item'),
  
  // Each item in the array should be a valid MongoDB ObjectId (product ID)
  body('itemsToOrder.*')
    .if(body('itemsToOrder').exists())
    .isMongoId()                               // Valid MongoDB ObjectId format
    .withMessage('Each item must be a valid product ID'),
  
  // Notes validation (optional)
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes must not exceed 500 characters'),
  
  // Handle any validation errors
  handleValidationErrors
];

/**
 * Validation rules for updating order status
 * 
 * Validates:
 * - status: Required, must be valid status
 */
const validateUpdateOrderStatus = [
  // Status validation
  body('status')
    .trim()
    .notEmpty()
    .withMessage('Status is required')
    .isIn(VALID_ORDER_STATUSES)
    .withMessage(`Status must be one of: ${VALID_ORDER_STATUSES.join(', ')}`),
  
  // Handle any validation errors
  handleValidationErrors
];

module.exports = {
  validateCreateOrder,
  validateUpdateOrderStatus
};
