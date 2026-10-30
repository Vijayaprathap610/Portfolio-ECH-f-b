const Visitor = require('../models/Visitor');
const Project = require('../models/Project');
const Testimonial = require('../models/Testimonial');
const Skill = require('../models/Skill');
const Contact = require('../models/Contact');
const Certification = require('../models/Certification');
const Experience = require('../models/Experience');
const logger = require('../utils/logger');

// Record a visitor (deduplicate by IP per day, bulletproof against undefined)
const recordVisit = async (ip = "", page = "home") => {
    try {
        const today = new Date().toISOString().split("T")[0];
        const safeIp = String(ip || "").trim();
        const safePage = String(page || "home").trim().toLowerCase();

        const visitor = await Visitor.findOne({ date: today }).select("+uniqueIps");

        if (visitor) {
            const ips = Array.isArray(visitor.uniqueIps) ? visitor.uniqueIps : [];
            const alreadyVisited = safeIp ? ips.includes(safeIp) : false;

            const update = {
                $inc: {
                    [`pageViews.${safePage}`]: 1,
                },
            };

            if (!alreadyVisited && safeIp) {
                update.$inc.count = 1;
                update.$addToSet = { uniqueIps: safeIp };
            }

            await Visitor.findOneAndUpdate({ date: today }, update);
        } else {
            await Visitor.create({
                date: today,
                count: 1,
                uniqueIps: safeIp ? [safeIp] : [],
                pageViews: {
                    [safePage]: 1,
                },
            });
        }
    } catch (err) {
        logger.error(`recordVisit error: ${err.message}`);
    }
};

// Get dashboard summary statistics with fast parallel execution
const getDashboardStats = async () => {
    const [
        totalProjects,
        totalSkills,
        totalTestimonials,
        pendingTestimonials,
        totalMessages,
        unreadMessages,
        totalCertifications,
        totalExperience,
    ] = await Promise.all([
        Project.countDocuments({ isVisible: true }),
        Skill.countDocuments({ isVisible: true }),
        Testimonial.countDocuments({ status: 'approved' }),
        Testimonial.countDocuments({ status: 'pending' }),
        Contact.countDocuments(),
        Contact.countDocuments({ isRead: false }),
        Certification.countDocuments({ isVisible: true }),
        Experience.countDocuments({ isVisible: true }),
    ]);

    return {
        totalProjects,
        totalSkills,
        totalTestimonials,
        pendingTestimonials,
        totalMessages,
        unreadMessages,
        totalCertifications,
        totalExperience,
    };
};

// Get visitor stats for the last 30 days
const getVisitorStats = async (days = 30) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const cutoffStr = cutoff.toISOString().split('T')[0];

    const stats = await Visitor.find({ date: { $gte: cutoffStr } })
        .sort({ date: 1 })
        .select('-uniqueIps')
        .lean();

    const totalVisitors = stats.reduce((sum, s) => sum + (s.count || 0), 0);
    return { stats, totalVisitors };
};

// Monthly content activity (projects/messages by month)
const getMonthlyActivity = async () => {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const [projectsByMonth, messagesByMonth] = await Promise.all([
        Project.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
        ]),
        Contact.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
        ]),
    ]);

    return { projectsByMonth, messagesByMonth };
};

module.exports = { recordVisit, getDashboardStats, getVisitorStats, getMonthlyActivity };
