const ErrorResponse = require('../utils/error.response');

function handleError(err, req, res, next) {
    let error = { ...err };
    error.message = err.message;

    // Zod validation error
    if (err.name === 'ZodError') {
        const message = err.issues[0]?.message || 'Validation error';
        error = new ErrorResponse(message, 400);
    }

    // Duplicate key error (e.g., unique constraint violation)
    if (err.code === 11000) {
        let message = 'Duplication error';
        Object.keys(err.keyValue).forEach((key) => {
            message = `${key} already exists`;
        });

        error = new ErrorResponse(message, 400);
    }

    // Validation errors
    if (err.name === 'ValidationError') {
        let message = 'Validation error';
        Object.keys(err.errors).forEach((field) => {
            message = err.errors[field].message;
        });
        
        error = new ErrorResponse(message, 400);
    }

    // Custom error handling
    if (err.name === 'CastError') {
        const field = err.path;
        const message = `Invalid ${field}`;
        
        error = new ErrorResponse(message, 400);
    }
    
    // TypeError error handling
    if (err.name === 'TypeError') {
        const message = err.message;
        error = new ErrorResponse(message, 400);
    }

    // SyntaxError error handling
    if (err.name === 'SyntaxError') {
        const message = err.message;
        error = new ErrorResponse(message, 400);
    }

    // StrictPopulateError error handling
    if (err.name === 'StrictPopulateError') {
        const message = err.message;
        error = new ErrorResponse(message, 400);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || "Internal server error"
    });
}

module.exports = handleError;