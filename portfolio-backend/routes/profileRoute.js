const express = require('express');
const { getProfile, updateProfile, updateProfilePhoto, updateResume } = require('../controllers/profileController');
const { protect } = require('../middleware/auth');
const { validateProfile } = require('../middleware/validate');
const { handleUploadError, uploadProfile } = require('../config/multer')
const router = express.Router();


// Public
router.get('/', getProfile);

// Admin protected
router.put('/', protect, validateProfile, updateProfile);
router.patch(
    '/photo',
    protect,
    handleUploadError(uploadProfile.single('photo')),
    updateProfilePhoto
);
router.patch('/resume', protect, updateResume);

module.exports = router;