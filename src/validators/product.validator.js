const { body } = require('express-validator');
const { handleValidationErrors } = require('../middlewares/validation.middleware');

/**
 * Validation rules for creating a new product
 * 
 * Validates:
 * - name: Required, 3-100 characters
 * - description: Optional, max 500 characters
 * - price: Required, positive number
 * - category: Required, must be valid MongoDB ObjectId
 * - is_available: Optional, must be boolean
 */

const validateCreateProduct = [
    //Name validation
    body('name')
        .trim() //remove whitespaces
        .notEmpty() //must not be empty
        .withMessage('Product name is required')
        .isLength({min: 3, max: 100}) //length check
        .withMessage('Product name must be between 3 and 100 characters'),

    //Description vlaidation (optional)
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500})
        .withMessage('Description must not exceed 500 characters'),
        
    //Price Validation
    body('price')
        .notEmpty()
        .withMessage('Price is required')
        .isFloat({ min: 0.01 }) //must be positive decimal
        .withMessage("Price must be a positive number")
        .toFloat(), //conv string to number
    
    //Category validation - now accepts MongoDB ObjectId
    body('category')
        .trim()
        .notEmpty()
        .withMessage('Category is required')
        .isMongoId()
        .withMessage('Category must be a valid category ID'),

    //Availability validation(optional)
    body('is_available')
        .optional()
        .isBoolean()
        .withMessage('Availability must be a boolean value')
        .toBoolean(),

        handleValidationErrors //handle validation errors
];

/**
 * Validation rules for updating a product 
 * 
 * same as create, but all fields are optional 
 */
const validateUpdateProduct = [
    //Name validation (optional)
    body('name')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Product name cannot be empty')
        .isLength({ min: 3, max: 100 })
        .withMessage('Product name must be between 3 and 100 characters'),

    //Description validation (optional)
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Description must not exceed 500 characters'),

    
    // Price validation (optional)
    body('price')
        .optional()
        .isFloat({ min: 0.01 })
        .withMessage('Price must be a positive number')
        .toFloat(),
        
    // Category validation (optional) - now accepts MongoDB ObjectId
    body('category')
        .optional()
        .trim()
        .isMongoId()
        .withMessage('Category must be a valid category ID'),
    
    // Availability validation (optional)
    body('is_available')
        .optional()
        .isBoolean()
        .withMessage('Availability must be a boolean value')
        .toBoolean(),
    
    // Handle any validation errors
    handleValidationErrors
    ];

 module.exports = {
  validateCreateProduct,
  validateUpdateProduct
};