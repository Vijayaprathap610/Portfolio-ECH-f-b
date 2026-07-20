const certificationsService = require('../services/certificationsService');
const { sendSuccess, sendError } = require('../utils/response');

const getAllCertifications = async (req, res, next) => {
    try {
        const isAdmin = !!req.admin;
        const data = await certificationsService.getAllCertifications(!isAdmin);
        return sendSuccess(res, 200, 'Certifications retrieved successfully.', data);
    } catch (err) { next(err); }
};

const getCertificationById = async (req, res, next) => {
    try {
        const data = await certificationsService.getCertificationById(req.params.id);
        return sendSuccess(res, 200, 'Certification retrieved successfully.', data);
    } catch (err) {
        if (err.statusCode) return res.status(err.statusCode).json(sendError(err.statusCode, err.message));
        next(err);
    }
};

const createCertification = async (req, res, next) => {
    try {
        const data = await certificationsService.createCertification(req.body, req.file || null);
        return sendSuccess(res, 201, 'Certification created successfully.', data);
    } catch (err) { next(err); }
};

const updateCertification = async (req, res, next) => {
    try {
        const data = await certificationsService.updateCertification(req.params.id, req.body, req.file || null);
        return sendSuccess(res, 200, 'Certification updated successfully.', data);
    } catch (err) {
        if (err.statusCode) return res.status(err.statusCode).json(sendError(err.statusCode, err.message));
        next(err);
    }
};

const deleteCertification = async (req, res, next) => {
    try {
        await certificationsService.deleteCertification(req.params.id);
        return sendSuccess(res, 200, 'Certification deleted successfully.');
    } catch (err) {
        if (err.statusCode) return res.status(err.statusCode).json(sendError(err.statusCode, err.message));
        next(err);
    }
};

module.exports = { getAllCertifications, getCertificationById, createCertification, updateCertification, deleteCertification };