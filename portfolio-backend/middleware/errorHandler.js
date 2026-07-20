const logger = require('../utils/logger');
const { buildError } = require('../utils/response');

// Error handling middleware
const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || err.status || 500;
    let message = err.message || 'Internal Server Error.';
    let errors = null;

    // Log the error
    logger.error(`${req.method} ${req.originalUrl} → ${statusCode}: ${message}`, {
        stack: err.stack,
        body: req.body,
        params: req.params,
        query: req.query,
    });

    // Mongoose Validation Error
    if (err.name === 'ValidationError') {
        statusCode = 422;
        message = 'Validation failed.';
        errors = Object.values(err.errors).map((e) => ({
            field: e.path,
            message: e.message,
        }));
    }

    // Mongoose Duplicate Key Error
    if (err.code === 11000) {
        statusCode = 409;
        const field = Object.keys(err.keyValue || {})[0] || 'field';
        message = `Duplicate value for '${field}'. Please use a different value.`;
    }

    // Mongoose CastError (invalid ObjectId)
    if (err.name === 'CastError') {
        statusCode = 400;
        message = `Invalid ${err.path}: ${err.value}. Must be a valid ID.`;
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token. Please log in again.';
    }
    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expired. Please log in again.';
    }

    // Multer errors
    if (err.code === 'LIMIT_FILE_SIZE') {
        statusCode = 400;
        message = 'File too large.';
    }

    const response = buildError(statusCode, message, errors);

    // Don't expose stack trace in production
    if (process.env.NODE_ENV === 'development') {
        response.stack = err.stack;
    }

    res.status(statusCode).json(response);
};

// Handle 404 — No matching route
const notFound = (req, res, next) => {
    const err = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
    err.statusCode = 404;
    next(err);
};

module.exports = { errorHandler, notFound };