const Visitor = require('../models/Visitor');
const Project = require('../models/Project');
const Testimonial = require('../models/Testimonial');
const Skill = require('../models/Skill');
const Contact = require('../models/Contact');
const Certification = require('../models/Certification');
const Experience = require('../models/Experience');

// Record a visitor (deduplicate by IP per day)
const recordVisit = async (ip = "", page = "home") => {
    const today = new Date().toISOString().split("T")[0];

    const visitor = await Visitor.findOne({ date: today }).select("+uniqueIps");

    if (visitor) {
        const alreadyVisited = (visitor.uniqueIps ?? []).includes(ip);

        const update = {
            $inc: {
                [`pageViews.${page}`]: 1,
            },
        };

        if (!alreadyVisited) {
            update.$inc.count = 1;
            update.$addToSet = { uniqueIps: ip };
        }

        await Visitor.findOneAndUpdate({ date: today }, update);
    } else {
        await Visitor.create({
            date: today,
            count: 1,
            uniqueIps: [ip],
            pageViews: {
                [page]: 1,
            },
        });
    }
};

// Get dashboard summary statistics
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
        .select('-uniqueIps');

    const totalVisitors = stats.reduce((sum, s) => sum + s.count, 0);
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