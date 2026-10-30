const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const logger = require('../utils/logger');

// Generate JWT token for admin/user
const generateToken = (adminId, role) => {
    return jwt.sign(
        { id: adminId, role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
};

// Admin login — validate name + secret key
const adminLogin = async (name, secretKey, ip = '') => {
    // Find admin by name, including secretKeyHash for comparison
    const admin = await Admin.findOne({ name: name.toLowerCase() }).select('+secretKeyHash');

    if (!admin) {
        throw { statusCode: 401, message: 'Invalid credentials. Admin not found.' };
    }

    // Check account lock
    if (admin.isLocked) {
        const lockMins = Math.ceil((admin.lockUntil - Date.now()) / 60000);
        throw {
            statusCode: 429,
            message: `Account temporarily locked due to too many failed attempts. Try again in ${lockMins} minute(s).`,
        };
    }

    // Verify secret key
    const isMatch = await admin.compareSecretKey(secretKey);

    if (!isMatch) {
        await admin.incLoginAttempts();
        const remaining = Math.max(0, 5 - (admin.loginAttempts + 1));
        const hint = remaining > 0 ? ` ${remaining} attempt(s) remaining.` : ' Account locked for 15 minutes.';
        throw { statusCode: 401, message: `Invalid credentials.${hint}` };
    }

    // Reset login attempts on success
    await Admin.findByIdAndUpdate(admin._id, {
        $set: { loginAttempts: 0, lastLogin: new Date() },
        $unset: { lockUntil: 1 },
    });

    logger.info(`Admin login successful: ${admin.name} from IP: ${ip}`);

    const token = generateToken(admin._id, admin.role);

    const adminInfo = {
        id: admin._id,
        name: admin.name,
        role: admin.role,
        lastLogin: new Date(),
    };

    return {
        token,
        admin: adminInfo,
        user: adminInfo,
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    };
};

// Verify token validity (for token refresh check)
const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch {
        throw { statusCode: 401, message: 'Invalid or expired token.' };
    }
};

module.exports = { generateToken, adminLogin, verifyToken };
