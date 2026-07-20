const express = require('express');
const { authLimiter } = require('../middleware/rateLimiter');
const { validateAdminLogin } = require('../middleware/validate');
const { adminLogin, getMe, adminLogout } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const router = express.Router();


router.post('/admin/login', authLimiter, validateAdminLogin, adminLogin);
router.get('/admin/me', protect, getMe);
router.post('/admin/logout', protect, adminLogout);

module.exports = router;