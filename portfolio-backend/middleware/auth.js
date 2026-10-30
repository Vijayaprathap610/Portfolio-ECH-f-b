const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const logger = require('../utils/logger');
const { sendError } = require('../utils/response');

// Protect routes - verify jwt Bearer token
const protect = async (req, res, next) => {
    try {
        let token;

        // Extract token from Authorization header
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer ')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res
                .status(401)
                .json(sendError(401, 'Access denied. No token provided.'));
        }

        // Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json(sendError(401, 'Token expired. Please log in again.'));
            }
            return res.status(401).json(sendError(401, 'Invalid token. Authentication failed.'));
        }

        // Find admin in database
        const admin = await Admin.findById(decoded.id).select('-secretKeyHash');
        if (!admin) {
            return res.status(401).json(sendError(401, 'Admin account not found.'));
        }

        // Attach admin to request (both req.admin and req.user to ensure full compatibility)
        req.admin = admin;
        req.user = admin;
        next();
    } catch (err) {
        logger.error(`Auth middleware error: ${err.message}`);
        return res.status(500).json(sendError(500, 'Authentication error. Please try again.'));
    }
};

// Role-based access control
const authorize = (...roles) => {
    return (req, res, next) => {
        const currentRole = req.admin?.role || req.user?.role;
        if (!currentRole || !roles.includes(currentRole)) {
            return res.status(403).json(
                sendError(403, `Access denied. Required role: ${roles.join(' or ')}.`)
            );
        }
        next();
    };
};

// Optional auth — attach admin/user if token provided, continue either way
const optionalAuth = async (req, res, next) => {
    try {
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer ')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const foundAdmin = await Admin.findById(decoded.id).select('-secretKeyHash');
                req.admin = foundAdmin;
                req.user = foundAdmin;
            } catch {
                // Token invalid — continue as guest
                req.admin = null;
                req.user = null;
            }
        } else {
            req.admin = null;
            req.user = null;
        }
        next();
    } catch (err) {
        req.admin = null;
        req.user = null;
        next();
    }
};

module.exports = { protect, authorize, optionalAuth };
