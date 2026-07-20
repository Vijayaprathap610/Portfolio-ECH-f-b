const profileService = require('../services/profileService');
const { sendSuccess, sendError } = require('../utils/response');

const getProfile = async (req, res, next) => {
    try {
        const profile = await profileService.getProfile();
        return sendSuccess(res, 200, 'Profile retrieved successfully.', profile);
    } catch (err) { next(err); }
};

const updateProfile = async (req, res, next) => {
    try {
        const profile = await profileService.updateProfile(req.body);
        return sendSuccess(res, 200, 'Profile updated successfully.', profile);
    } catch (err) { next(err); }
};

const updateProfilePhoto = async (req, res, next) => {
    try {
        if (!req.file) return res.status(400).json(sendError(400, 'No image file provided.'));
        const profile = await profileService.updateProfilePhoto(req.file.path);
        return sendSuccess(res, 200, 'Profile photo updated successfully.', profile);
    } catch (err) { next(err); }
};

const updateResume = async (req, res, next) => {
    try {
        const { resumeUrl } = req.body;
        if (!resumeUrl) return res.status(400).json(sendError(400, 'Resume URL is required.'));
        const profile = await profileService.updateResume(resumeUrl);
        return sendSuccess(res, 200, 'Resume URL updated successfully.', profile);
    } catch (err) { next(err); }
};

module.exports = { getProfile, updateProfile, updateProfilePhoto, updateResume };