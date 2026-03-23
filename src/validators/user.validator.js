const { body } = require('express-validator');
const { handleValidationErrors } = require('../middlewares/validation.middleware');

/**
 * Validation rules for user profile update
 * 
 * Validates:
 * - name: Optional, 2-50 characters if provided
 * - email: Optional, valid email format if provided
 * - phone: Optional, exactly 10 digits if provided
 * - address: Optional, max 200 characters if provided
 * 
 * Note: Password updates are not allowed through profile update
 */

const validateProfileUpdate = [
    // Name validation (optional)
    body('name')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Name cannot be empty')
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),

    // Email validation (optional)
    body('email')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Email cannot be empty')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    
    // Phone validation (optional)
    body('phone')
        .optional()
        .trim()
        .matches(/^\d{10}$/)
        .withMessage('Phone number must be exactly 10 digits'),
    
    // Address validation (optional)
    body('address')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('Address must not exceed 200 characters'),
    
    // Prevent password updates through profile update
    body('password')
        .not()
        .exists()
        .withMessage('Password cannot be updated through profile update'),
    
    // Prevent role updates
    body('role')
        .not()
        .exists()
        .withMessage('Role cannot be updated'),
    
    // Handle any validation errors
    handleValidationErrors
];

module.exports = {
    validateProfileUpdate
};
