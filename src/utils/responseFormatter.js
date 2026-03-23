const successResponse = (data, message = null, pagination = null) => {
    const response = {
        success: true,
        data
    };
    if (message) {
        response.message = message;
    }
    if(pagination) {
        response.pagination = pagination;
    }
    return response;
};

const errorResponse = (message, status = 500, errors = null) => {
    const response = { 
        success: false,
        error: {
            message,
            status
        }
    };
    if (errors) {
        response.error.errors = errors;
    }
    return response;
};

module.exports = {
    successResponse, 
    errorResponse
};