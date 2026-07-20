const skillsService = require('../services/skillsService');
const { sendSuccess, sendError } = require('../utils/response');

const getAllSkills = async (req, res, next) => {
    try {
        const isAdmin = !!req.admin;
        const filters = isAdmin ? {} : { isVisible: true };
        if (req.query.category) filters.category = req.query.category;
        const result = await skillsService.getAllSkills(filters);
        return sendSuccess(res, 200, 'Skills retrieved successfully.', result);
    } catch (err) { next(err); }
};

const getSkillById = async (req, res, next) => {
    try {
        const skill = await skillsService.getSkillById(req.params.id);
        return sendSuccess(res, 200, 'Skill retrieved successfully.', skill);
    } catch (err) {
        if (err.statusCode) return res.status(err.statusCode).json(sendError(err.statusCode, err.message));
        next(err);
    }
};

const createSkill = async (req, res, next) => {
    try {
        const skill = await skillsService.createSkill(req.body);
        return sendSuccess(res, 201, 'Skill created successfully.', skill);
    } catch (err) {
        if (err.statusCode) return res.status(err.statusCode).json(sendError(err.statusCode, err.message));
        next(err);
    }
};

const updateSkill = async (req, res, next) => {
    try {
        const skill = await skillsService.updateSkill(req.params.id, req.body);
        return sendSuccess(res, 200, 'Skill updated successfully.', skill);
    } catch (err) {
        if (err.statusCode) return res.status(err.statusCode).json(sendError(err.statusCode, err.message));
        next(err);
    }
};

const deleteSkill = async (req, res, next) => {
    try {
        await skillsService.deleteSkill(req.params.id);
        return sendSuccess(res, 200, 'Skill deleted successfully.');
    } catch (err) {
        if (err.statusCode) return res.status(err.statusCode).json(sendError(err.statusCode, err.message));
        next(err);
    }
};

const reorderSkills = async (req, res, next) => {
    try {
        const { orderedIds } = req.body;
        if (!Array.isArray(orderedIds)) return res.status(400).json(sendError(400, 'orderedIds must be an array.'));
        const result = await skillsService.reorderSkills(orderedIds);
        return sendSuccess(res, 200, result.message);
    } catch (err) { next(err); }
};

module.exports = { getAllSkills, getSkillById, createSkill, updateSkill, deleteSkill, reorderSkills };