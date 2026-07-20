const express = require('express');
const { optionalAuth, protect } = require('../middleware/auth');
const { validateObjectId, validateSkill } = require('../middleware/validate');
const ctrl = require('../controllers/skillsController');
const router = express.Router();


router.get('/', optionalAuth, ctrl.getAllSkills);
router.get('/:id', validateObjectId, ctrl.getSkillById);
router.post('/', protect, validateSkill, ctrl.createSkill);
router.put('/:id', protect, validateObjectId, validateSkill, ctrl.updateSkill);
router.delete('/:id', protect, validateObjectId, ctrl.deleteSkill);
router.post('/reorder', protect, validateSkill, ctrl.reorderSkills);

module.exports = router;