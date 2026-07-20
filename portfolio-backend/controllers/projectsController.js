const projectsService = require('../services/projectsService');
const { sendSuccess, sendError, sendPaginated } = require('../utils/response');

const getAllProjects = async (req, res, next) => {
    try {
        const { page = 1, limit = 6, category, search, sort = '-createdAt', featured } = req.query;
        const isAdmin = !!req.admin;
        const query = { page, limit, category, search, sort, featured };
        if (!isAdmin) query.isVisible = true;
        const { projects, total } = await projectsService.getAllProjects(query);
        return sendPaginated(res, projects, page, limit, total, 'Projects retrieved successfully.');
    } catch (err) { next(err); }
};

const getProjectById = async (req, res, next) => {
    try {
        const project = await projectsService.getProjectById(req.params.id);
        return sendSuccess(res, 200, 'Project retrieved successfully.', project);
    } catch (err) {
        if (err.statusCode) return res.status(err.statusCode).json(sendError(err.statusCode, err.message));
        next(err);
    }
};

const createProject = async (req, res, next) => {
    try {
        const files = req.files || [];
        const project = await projectsService.createProject(req.body, files);
        return sendSuccess(res, 201, 'Project created successfully.', project);
    } catch (err) {
        if (err.statusCode) return res.status(err.statusCode).json(sendError(err.statusCode, err.message));
        next(err);
    }
};

const updateProject = async (req, res, next) => {
    try {
        const files = req.files || [];
        const project = await projectsService.updateProject(req.params.id, req.body, files);
        return sendSuccess(res, 200, 'Project updated successfully.', project);
    } catch (err) {
        if (err.statusCode) return res.status(err.statusCode).json(sendError(err.statusCode, err.message));
        next(err);
    }
};

const deleteProject = async (req, res, next) => {
    try {
        await projectsService.deleteProject(req.params.id);
        return sendSuccess(res, 200, 'Project deleted successfully.');
    } catch (err) {
        if (err.statusCode) return res.status(err.statusCode).json(sendError(err.statusCode, err.message));
        next(err);
    }
};

const deleteProjectImage = async (req, res, next) => {
    try {
        const { imageUrl } = req.body;
        if (!imageUrl) return res.status(400).json(sendError(400, 'imageUrl is required.'));
        const project = await projectsService.deleteProjectImage(req.params.id, imageUrl);
        return sendSuccess(res, 200, 'Image deleted successfully.', project);
    } catch (err) {
        if (err.statusCode) return res.status(err.statusCode).json(sendError(err.statusCode, err.message));
        next(err);
    }
};

const getCategories = async (req, res, next) => {
    try {
        const categories = await projectsService.getCategories();
        return sendSuccess(res, 200, 'Categories retrieved.', categories);
    } catch (err) { next(err); }
};

module.exports = { getAllProjects, getProjectById, createProject, updateProject, deleteProject, deleteProjectImage, getCategories };