const { createLogger, format, transports } = require('winston');
const fs = require('fs');
const path = require('path');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

const { combine, timestamp, printf, colorize, errors, json } = format;

// Custom log format for console
const consoleFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`;
});

// Custom log format for files
const fileFormat = combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    json()
);

const logger = createLogger({
    level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true })
    ),
    transports: [
        // Console transport (development)
        new transports.Console({
            format: combine(
                colorize({ all: true }),
                timestamp({ format: 'HH:mm:ss' }),
                consoleFormat
            ),
            silent: process.env.NODE_ENV === 'test',
        }),

        // Error log file
        new transports.File({
            filename: path.join(logsDir, 'error.log'),
            level: 'error',
            format: fileFormat,
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),

        // Combined log file
        new transports.File({
            filename: path.join(logsDir, 'combined.log'),
            format: fileFormat,
            maxsize: 10485760, // 10MB
            maxFiles: 10,
        }),
    ],
    exceptionHandlers: [
        new transports.File({ filename: path.join(logsDir, 'exceptions.log') }),
    ],
    rejectionHandlers: [
        new transports.File({ filename: path.join(logsDir, 'rejections.log') }),
    ],
});

module.exports = logger;