const morgan = require('morgan');
const logger = require('../utils/logger');

// Morgan stream → Winston
const stream = {
    write: (message) => {
        logger.http(message.trim());
    },
};

// Skip logging in test environment
const skip = () => process.env.NODE_ENV === 'test';

// Development: colorful detailed format
// Production: combined Apache-style format
const format = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';

const requestLogger = morgan(format, { stream, skip });

module.exports = requestLogger;