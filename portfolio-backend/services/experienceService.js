const Experience = require('../models/Experience');

// Normalize a raw payload before handing it to Mongoose.
// Converts comma/newline-separated strings into arrays.
// Converts empty-string Date fields to null (Mongoose throws a CastError
//  on an empty string for a Date field, which happens whenever the
// "I currently work here" checkbox is ticked and endDate is left blank).
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

    // Guard against empty-string Date values (CastError otherwise)
    if (payload.endDate === '' || payload.endDate === undefined) {
        payload.endDate = null;
    }
    if (payload.startDate === '') {
        delete payload.startDate; // let required-field validation catch it
    }

    // If marked as current, endDate should always be null regardless of what was sent
    if (payload.isCurrent === true || payload.isCurrent === 'true') {
        payload.endDate = null;
    }

    return payload;
};

const getAllExperience = async (onlyVisible = false) => {
    const query = onlyVisible ? { isVisible: true } : {};
    return Experience.find(query).sort({ order: 1, startDate: -1 });
};

const getExperienceById = async (id) => {
    const exp = await Experience.findById(id);
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