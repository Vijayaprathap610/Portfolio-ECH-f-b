const authService = require('../services/authService');
const { sendSuccess, sendError } = require('../utils/response');
const logger = require('../utils/logger');

/**
 * POST /api/auth/admin/login
 * Admin login with name + secret key
 */
const adminLogin = async (req, res, next) => {
    try {
        const { name, secretKey } = req.body;
        const ip = req.ip || req.connection.remoteAddress;

        const result = await authService.adminLogin(name, secretKey, ip);

        logger.info(`Admin logged in: ${name}`);
        return sendSuccess(res, 200, 'Login successful.', result);
    } catch (err) {
        if (err.statusCode) {
            return res.status(err.statusCode).json(sendError(err.statusCode, err.message));
        }
        next(err);
    }
};

/**
 * GET /api/auth/admin/me
 * Get current logged-in admin info
 */
const getMe = async (req, res, next) => {
    try {
        return sendSuccess(res, 200, 'Admin profile retrieved.', {
            id: req.admin._id,
            name: req.admin.name,
            role: req.admin.role,
            lastLogin: req.admin.lastLogin,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * POST /api/auth/admin/logout
 * Logout (client-side token invalidation)
 */
const adminLogout = async (req, res) => {
    logger.info(`Admin logged out: ${req.admin?.name}`);
    return sendSuccess(res, 200, 'Logged out successfully.');
};

module.exports = { adminLogin, getMe, adminLogout };