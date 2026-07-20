const express = require("express");
const router = express.Router();
const ctrl = require('../controllers/certificationsController');
const { handleUploadError, uploadCertification } = require('../config/multer');
const { optionalAuth, protect } = require("../middleware/auth");
const { validateObjectId, validateCertification } = require("../middleware/validate");



router.get('/', optionalAuth, ctrl.getAllCertifications);
router.get('/:id', validateObjectId, ctrl.getCertificationById);
router.post(
    '/',
    protect,
    handleUploadError(uploadCertification.single('image')),
    validateCertification,
    ctrl.createCertification
);
router.put(
    '/:id',
    protect,
    validateObjectId,
    handleUploadError(uploadCertification.single('image')),
    validateCertification,
    ctrl.updateCertification
);
router.delete('/:id', protect, validateObjectId, ctrl.deleteCertification);

module.exports = router;