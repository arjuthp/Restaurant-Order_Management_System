const { validationResult } = require('express-validator');
const { errorResponse } = require('../utils/responseFormatter');

/**
 * Middleware to handle validation errors form express-validator
 * 
 * how it works??
 * collects all validation errors from the request
 * if error exists, formats them and returns 400 response
 * if no errors , passes coontrol to next middleware/ controller
 * 
 */

const handleValidationErrors = (req, res, next) => {
    //Extract validation errors from request 
    const errors = validationResult(req);
    
    //if no errors, continue to next middleware
    if(errors.isEmpty()){
        return next();
    }

    //Format errors into readable array
    const formattedErrors = errors.array().map(error => ({
        field: error.path, //which field has the error
        message: error.msg, // error message
        value: error.value // the invalid value that was provided
    }));

    //Return 400 Bad Request with formatted errrors
    return res.status(400).json(
        errorResponse('Validation failed', 400, formattedErrors));
};

module.exports = { handleValidationErrors};