const rateLimit = require('express-rate-limit');
const { buildError } = require('../utils/response');

// General API rate limiter
const apiLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
    message: buildError(429, 'Too many requests. Please try again after 15 minutes.'),
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json(
            buildError(429, 'Too many requests. Please try again after 15 minutes.')
        );
    },
});

// Strict limiter for auth endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Only 10 attempts per 15 min
    message: buildError(429, 'Too many login attempts. Please try again after 15 minutes.'),
    skipSuccessfulRequests: true,
    handler: (req, res) => {
        res.status(429).json(
            buildError(429, 'Too many login attempts. Please wait 15 minutes before trying again.')
        );
    },
});

// Limiter for contact form submissions
const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // Only 5 contact submissions per hour per IP
    message: buildError(429, 'Too many contact submissions. Please try again after 1 hour.'),
    handler: (req, res) => {
        res.status(429).json(
            buildError(429, 'You have submitted too many messages. Please wait 1 hour.')
        );
    },
});

// Limiter for testimonial submissions
const testimonialLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    max: 3, // 3 testimonials per day per IP
    handler: (req, res) => {
        res.status(429).json(
            buildError(429, 'You have submitted too many testimonials today. Try again tomorrow.')
        );
    },
});

module.exports = { apiLimiter, authLimiter, contactLimiter, testimonialLimiter };