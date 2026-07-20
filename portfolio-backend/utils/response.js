//Build a success response object
const buildSuccess = (statusCode, message, data = null, meta = null) => {
    const response = {
        success: true,
        status: statusCode,
        message,
    };
    if (data !== null) response.data = data;
    if (meta !== null) response.meta = meta;
    return response;
};

//Build an error response object
const buildError = (statusCode, message, errors = null) => {
    const response = {
        success: false,
        status: statusCode,
        message,
    };
    if (errors !== null) response.errors = errors;
    return response;
};

// Send a success response
const sendSuccess = (res, statusCode, message, data = null, meta = null) => {
    return res.status(statusCode).json(buildSuccess(statusCode, message, data, meta));
};

// Send an error response
const sendError = (statusCode, message, errors = null) => {
    return buildError(statusCode, message, errors);
};


// Send a paginated response
const sendPaginated = (res, data, page, limit, total, message = 'Data retrieved successfully.') => {
    const totalPages = Math.ceil(total / limit);
    return res.status(200).json({
        success: true,
        status: 200,
        message,
        data,
        meta: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages,
            hasNextPage: Number(page) < totalPages,
            hasPrevPage: Number(page) > 1,
        },
    });
};

module.exports = { buildSuccess, buildError, sendSuccess, sendError, sendPaginated };