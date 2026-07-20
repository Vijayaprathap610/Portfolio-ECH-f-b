const express = require('express');
const { optionalAuth, protect } = require('../middleware/auth');
const { validateObjectId, validateExperience } = require('../middleware/validate');
const ctrl = require('../controllers/experienceController');
const router = express.Router();

router.get('/', optionalAuth, ctrl.getAllExperience);
router.get('/:id', validateObjectId, ctrl.getExperienceById);
router.post('/', protect, validateExperience, ctrl.createExperience);
router.put('/:id', protect, validateObjectId, validateExperience, ctrl.updateExperience);
router.delete('/:id', protect, validateObjectId, ctrl.deleteExperience);

module.exports = router;