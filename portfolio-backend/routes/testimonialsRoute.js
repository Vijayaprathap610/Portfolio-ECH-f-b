const express = require("express");
const router = express.Router();
const ctrl = require('../controllers/testimonialsController');
const { protect } = require("../middleware/auth");
const { validateTestimonial, validateObjectId } = require("../middleware/validate");
const { testimonialLimiter } = require('../middleware/rateLimiter');


// Public routes
router.get('/', ctrl.getApprovedTestimonials);
router.post('/', testimonialLimiter, validateTestimonial, ctrl.submitTestimonial);

// Admin-only routes
router.get('/admin/all', protect, ctrl.getAllTestimonials);
router.put('/:id', protect, validateObjectId, ctrl.updateTestimonial);
router.patch('/:id/approve', protect, validateObjectId, ctrl.approveTestimonial);
router.patch('/:id/reject', protect, validateObjectId, ctrl.rejectTestimonial);
router.delete('/:id', protect, validateObjectId, ctrl.deleteTestimonial);

module.exports = router;