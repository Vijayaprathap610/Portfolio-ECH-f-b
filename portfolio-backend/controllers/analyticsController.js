const analyticsService = require('../services/analyticsService');
const { sendSuccess } = require('../utils/response');

const recordVisit = async (req, res, next) => {
    try {
        const ip = req.ip || req.connection.remoteAddress;
        const { page = 'home' } = req.body;
        await analyticsService.recordVisit(ip, page);
        return sendSuccess(res, 200, 'Visit recorded.');
    } catch (err) { next(err); }
};

const getDashboardStats = async (req, res, next) => {
    try {
        const stats = await analyticsService.getDashboardStats();
        return sendSuccess(res, 200, 'Dashboard statistics retrieved.', stats);
    } catch (err) { next(err); }
};

const getVisitorStats = async (req, res, next) => {
    try {
        const days = parseInt(req.query.days) || 30;
        const data = await analyticsService.getVisitorStats(days);
        return sendSuccess(res, 200, 'Visitor statistics retrieved.', data);
    } catch (err) { next(err); }
};

const getMonthlyActivity = async (req, res, next) => {
    try {
        const data = await analyticsService.getMonthlyActivity();
        return sendSuccess(res, 200, 'Monthly activity retrieved.', data);
    } catch (err) { next(err); }
};

module.exports = { recordVisit, getDashboardStats, getVisitorStats, getMonthlyActivity };