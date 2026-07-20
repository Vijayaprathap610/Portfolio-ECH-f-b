const express = require("express");
const router = express.Router();
const ctrl = require('../controllers/analyticsController');
const { protect } = require("../middleware/auth");

// Public — record visits
router.post('/visit', ctrl.recordVisit);

// Admin-protected — view stats
router.get('/dashboard', protect, ctrl.getDashboardStats);
router.get('/visitors', protect, ctrl.getVisitorStats);
router.get('/monthly', protect, ctrl.getMonthlyActivity);

module.exports = router;