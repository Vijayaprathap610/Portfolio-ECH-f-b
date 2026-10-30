const Experience = require('../models/Experience');

const normalizePayload = (data) => {
    const payload = { ...data };

    if (typeof payload.responsibilities === 'string') {
        payload.responsibilities = payload.responsibilities
            .split('\n')
            .map((r) => r.trim())
            .filter(Boolean);
    }

    if (typeof payload.technologies === 'string') {
        payload.technologies = payload.technologies
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean);
    }

    if (payload.endDate === '' || payload.endDate === undefined || payload.endDate === 'null') {
        payload.endDate = null;
    }
    if (payload.startDate === '') {
        delete payload.startDate;
    }

    if (payload.isCurrent === true || payload.isCurrent === 'true') {
        payload.endDate = null;
    }

    return payload;
};

const getAllExperience = async (onlyVisible = false) => {
    const query = onlyVisible ? { isVisible: true } : {};
    return Experience.find(query).sort({ order: 1, startDate: -1 }).lean();
};

const getExperienceById = async (id) => {
    const exp = await Experience.findById(id).lean();
    if (!exp) throw { statusCode: 404, message: 'Experience not found.' };
    return exp;
};

const createExperience = async (data) => {
    return Experience.create(normalizePayload(data));
};

const updateExperience = async (id, data) => {
    const exp = await Experience.findByIdAndUpdate(id, normalizePayload(data), {
        new: true,
        runValidators: true,
    });
    if (!exp) throw { statusCode: 404, message: 'Experience not found.' };
    return exp;
};

const deleteExperience = async (id) => {
    const exp = await Experience.findByIdAndDelete(id);
    if (!exp) throw { statusCode: 404, message: 'Experience not found.' };
    return exp;
};

module.exports = { getAllExperience, getExperienceById, createExperience, updateExperience, deleteExperience };
