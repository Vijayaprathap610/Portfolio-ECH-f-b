const express = require('express');
const { optionalAuth, protect } = require('../middleware/auth');
const { validateObjectId, validateProject } = require('../middleware/validate');
const { uploadProject, handleUploadError } = require('../config/multer');
const ctrl = require('../controllers/projectsController')
const router = express.Router();


router.get('/categories', ctrl.getCategories);
router.get('/', optionalAuth, ctrl.getAllProjects);
router.get('/:id', validateObjectId, ctrl.getProjectById);
router.post(
    '/',
    protect,
    handleUploadError(uploadProject.array('images', 10)),
    validateProject,
    ctrl.createProject
);
router.put(
    '/:id',
    protect,
    validateObjectId,
    handleUploadError(uploadProject.array('images', 10)),
    validateProject,
    ctrl.updateProject
);
router.delete('/:id', protect, validateObjectId, ctrl.deleteProject);
router.delete('/:id/image', protect, validateObjectId, ctrl.deleteProjectImage);

module.exports = router;