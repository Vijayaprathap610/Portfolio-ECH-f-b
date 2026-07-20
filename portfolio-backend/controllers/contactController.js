const contactService = require('../services/contactService');
const { sendSuccess, sendError, sendPaginated } = require('../utils/response');

const submitMessage = async (req, res, next) => {
    try {
        const ip = req.ip || req.connection.remoteAddress;
        const data = await contactService.submitMessage(req.body, ip);
        return sendSuccess(res, 201, 'Your message has been sent successfully. I will get back to you soon!', data);
    } catch (err) { next(err); }
};

const getAllMessages = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, status = 'all' } = req.query;
        const { messages, total } = await contactService.getAllMessages({ page, limit, status });
        return sendPaginated(res, messages, page, limit, total, 'Messages retrieved successfully.');
    } catch (err) { next(err); }
};

const getMessageById = async (req, res, next) => {
    try {
        const data = await contactService.getMessageById(req.params.id);
        return sendSuccess(res, 200, 'Message retrieved successfully.', data);
    } catch (err) {
        if (err.statusCode) return res.status(err.statusCode).json(sendError(err.statusCode, err.message));
        next(err);
    }
};

const updateMessageStatus = async (req, res, next) => {
    try {
        const { status, notes } = req.body;
        if (!status) return res.status(400).json(sendError(400, 'Status is required.'));
        const data = await contactService.updateMessageStatus(req.params.id, status, notes);
        return sendSuccess(res, 200, 'Message status updated successfully.', data);
    } catch (err) {
        if (err.statusCode) return res.status(err.statusCode).json(sendError(err.statusCode, err.message));
        next(err);
    }
};

const deleteMessage = async (req, res, next) => {
    try {
        await contactService.deleteMessage(req.params.id);
        return sendSuccess(res, 200, 'Message deleted successfully.');
    } catch (err) {
        if (err.statusCode) return res.status(err.statusCode).json(sendError(err.statusCode, err.message));
        next(err);
    }
};

module.exports = { submitMessage, getAllMessages, getMessageById, updateMessageStatus, deleteMessage };