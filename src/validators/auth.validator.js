const { body } = require('express-validator');
const { handleValidationErrors } = require('../middlewares/validation.middleware');

/**
 * Validation rules for user registration
 * 
 * Validates:
 * - name: Required, 2-50 characters
 * - email: Required, valid email format
 * - password: Required, minimum 6 characters
 * - phone: Optional, exactly 10 digits
 * - address: Optional, max 200 characters
 * - role: Optional, must be 'customer' or 'admin'
 */

const validateRegister = [
    //Name validation
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2, max: 50})
        .withMessage('Name must be between 2 and 50 characters'),

    //Email Validtion 
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(), //converts to lowercase
    
    //Password Validation
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
        
    //Phone validation (optional)
    body('phone')
        .optional()
        .trim()
        .matches(/^\d{10}$/) // exactly 10 digits
        .withMessage('Phone number must be exactly 10 digits'),
    
    // Address validation (optional)
    body('address')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('Address must not exceed 200 characters'),
    
    // Role validation (optional)
    body('role')
        .optional()
        .isIn(['customer', 'admin'])
        .withMessage('Role must be either customer or admin'),
    
    // Handle any validation errors
    handleValidationErrors
];

/**
 * Validation rules for user login
 * 
 * Validates:
 * - email: Required, valid email format
 * - password: Required, not empty
 */

const validateLogin = [
    // Email validation
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    
    // Password validation
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    
    // Handle any validation errors
    handleValidationErrors
];

module.exports = {
  validateRegister,
  validateLogin
};