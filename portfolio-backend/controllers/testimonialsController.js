const testimonialsService = require('../services/testimonialsService');
const { sendSuccess, sendError, sendPaginated } = require('../utils/response');

const getApprovedTestimonials = async (req, res, next) => {
    try {
        const data = await testimonialsService.getApprovedTestimonials();
        return sendSuccess(res, 200, 'Testimonials retrieved successfully.', data);
    } catch (err) { next(err); }
};

const getAllTestimonials = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, status = 'all' } = req.query;
        const { testimonials, total } = await testimonialsService.getAllTestimonials({ status, page, limit });
        return sendPaginated(res, testimonials, page, limit, total, 'Testimonials retrieved successfully.');
    } catch (err) { next(err); }
};

const submitTestimonial = async (req, res, next) => {
    try {
        const ip = req.ip || req.connection.remoteAddress;
        const data = await testimonialsService.submitTestimonial(req.body, ip);
        return sendSuccess(res, 201, 'Testimonial submitted successfully. It will appear after admin approval.', data);
    } catch (err) { next(err); }
};

const approveTestimonial = async (req, res, next) => {
    try {
        const data = await testimonialsService.approveTestimonial(req.params.id);
        return sendSuccess(res, 200, 'Testimonial approved successfully.', data);
    } catch (err) {
        if (err.statusCode) return res.status(err.statusCode).json(sendError(err.statusCode, err.message));
        next(err);
    }
};

const rejectTestimonial = async (req, res, next) => {
    try {
        const { reason } = req.body;
        const data = await testimonialsService.rejectTestimonial(req.params.id, reason);
        return sendSuccess(res, 200, 'Testimonial rejected.', data);
    } catch (err) {
        if (err.statusCode) return res.status(err.statusCode).json(sendError(err.statusCode, err.message));
        next(err);
    }
};

const deleteTestimonial = async (req, res, next) => {
    try {
        await testimonialsService.deleteTestimonial(req.params.id);
        return sendSuccess(res, 200, 'Testimonial deleted successfully.');
    } catch (err) {
        if (err.statusCode) return res.status(err.statusCode).json(sendError(err.statusCode, err.message));
        next(err);
    }
};

const updateTestimonial = async (req, res, next) => {
    try {
        const data = await testimonialsService.updateTestimonial(req.params.id, req.body);
        return sendSuccess(res, 200, 'Testimonial updated successfully.', data);
    } catch (err) {
        if (err.statusCode) return res.status(err.statusCode).json(sendError(err.statusCode, err.message));
        next(err);
    }
};

module.exports = { getApprovedTestimonials, getAllTestimonials, submitTestimonial, approveTestimonial, rejectTestimonial, deleteTestimonial, updateTestimonial };