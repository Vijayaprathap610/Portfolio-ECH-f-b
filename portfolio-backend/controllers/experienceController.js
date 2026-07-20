const experienceService = require('../services/experienceService');
const { sendSuccess, sendError } = require('../utils/response');

const getAllExperience = async (req, res, next) => {
    try {
        const isAdmin = !!req.admin;
        const data = await experienceService.getAllExperience(!isAdmin);
        return sendSuccess(res, 200, 'Experience retrieved successfully.', data);
    } catch (err) { next(err); }
};

const getExperienceById = async (req, res, next) => {
    try {
        const data = await experienceService.getExperienceById(req.params.id);
        return sendSuccess(res, 200, 'Experience retrieved successfully.', data);
    } catch (err) {
        if (err.statusCode) return res.status(err.statusCode).json(sendError(err.statusCode, err.message));
        next(err);
    }
};

const createExperience = async (req, res, next) => {
    try {
        const data = await experienceService.createExperience(req.body);
        return sendSuccess(res, 201, 'Experience created successfully.', data);
    } catch (err) { next(err); }
};

const updateExperience = async (req, res, next) => {
    try {
        const data = await experienceService.updateExperience(req.params.id, req.body);
        return sendSuccess(res, 200, 'Experience updated successfully.', data);
    } catch (err) {
        if (err.statusCode) return res.status(err.statusCode).json(sendError(err.statusCode, err.message));
        next(err);
    }
};

const deleteExperience = async (req, res, next) => {
    try {
        await experienceService.deleteExperience(req.params.id);
        return sendSuccess(res, 200, 'Experience deleted successfully.');
    } catch (err) {
        if (err.statusCode) return res.status(err.statusCode).json(sendError(err.statusCode, err.message));
        next(err);
    }
};

module.exports = { getAllExperience, getExperienceById, createExperience, updateExperience, deleteExperience };