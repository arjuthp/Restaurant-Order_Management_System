// src/validators/reservation.validator.js

const { body } = require('express-validator');
const { handleValidationErrors } = require('../middlewares/validation.middleware');

/**
 * Valid reservation statuses
 */
const VALID_RESERVATION_STATUSES = [
  'pending',
  'confirmed',
  'cancelled',
  'completed',
  'no-show'
];

/**
 * Validation rules for creating a reservation
 * 
 * Validates:
 * - table: Required, valid MongoDB ObjectId
 * - date: Required, valid date, must be future
 * - timeSlot: Required, valid time format (HH:MM)
 * - numberOfGuests: Required, integer 1-20
 * - contactPhone: Required, exactly 10 digits
 * - specialRequests: Optional, max 500 characters
 */
const validateCreateReservation = [
  // Table ID validation
  body('table')
    .notEmpty()
    .withMessage('Table ID is required')
    .isMongoId()
    .withMessage('Invalid table ID format'),
  
  // Date validation
  body('date')
    .notEmpty()
    .withMessage('Reservation date is required')
    .isISO8601()                               // Valid date format (YYYY-MM-DD)
    .withMessage('Invalid date format. Use YYYY-MM-DD')
    .custom((value) => {
      // Check if date is in the future
      const reservationDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);              // Reset time to start of day
      
      if (reservationDate < today) {
        throw new Error('Reservation date must be in the future');
      }
      return true;
    }),
  
  // Time slot validation
  body('timeSlot')
    .notEmpty()
    .withMessage('Time slot is required')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)  // HH:MM format
    .withMessage('Invalid time format. Use HH:MM (e.g., 18:00)')
    .custom((value) => {
      // Check if time is within restaurant hours (09:00 - 22:00)
      const [hours, minutes] = value.split(':').map(Number);
      const timeInMinutes = hours * 60 + minutes;
      const openTime = 9 * 60;                 // 09:00
      const closeTime = 22 * 60;               // 22:00
      
      if (timeInMinutes < openTime || timeInMinutes > closeTime) {
        throw new Error('Time slot must be between 09:00 and 22:00');
      }
      return true;
    }),
  
  // Number of guests validation
  body('numberOfGuests')
    .notEmpty()
    .withMessage('Number of guests is required')
    .isInt({ min: 1, max: 20 })
    .withMessage('Number of guests must be between 1 and 20')
    .toInt(),
  
  // Contact phone validation
  body('contactPhone')
    .trim()
    .notEmpty()
    .withMessage('Contact phone is required')
    .matches(/^\d{10}$/)
    .withMessage('Phone number must be exactly 10 digits'),
  
  // Special requests validation (optional)
  body('specialRequests')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Special requests must not exceed 500 characters'),
  
  // Handle any validation errors
  handleValidationErrors
];

/**
 * Validation rules for updating reservation status
 * 
 * Validates:
 * - status: Required, must be valid status
 */
const validateUpdateReservationStatus = [
  // Status validation
  body('status')
    .trim()
    .notEmpty()
    .withMessage('Status is required')
    .isIn(VALID_RESERVATION_STATUSES)
    .withMessage(`Status must be one of: ${VALID_RESERVATION_STATUSES.join(', ')}`),
  
  // Handle any validation errors
  handleValidationErrors
];

module.exports = {
  validateCreateReservation,
  validateUpdateReservationStatus
};
