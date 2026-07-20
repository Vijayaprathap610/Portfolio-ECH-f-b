const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/contactController');
const { validateContact, validateObjectId } = require('../middleware/validate');
const { contactLimiter } = require('../middleware/rateLimiter');
const { protect } = require('../middleware/auth');


// Public
router.post('/', contactLimiter, validateContact, ctrl.submitMessage);

// Admin-protected
router.get('/', protect, ctrl.getAllMessages);
router.get('/:id', protect, validateObjectId, ctrl.getMessageById);
router.patch('/:id/status', protect, validateObjectId, ctrl.updateMessageStatus);
router.delete('/:id', protect, validateObjectId, ctrl.deleteMessage);

module.exports = router;