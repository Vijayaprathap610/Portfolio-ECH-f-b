const Testimonial = require('../models/Testimonial');


// Public: only approved testimonials
const getApprovedTestimonials = async () => {
    return Testimonial.find({ status: 'approved', isVisible: true })
        .sort({ isFeatured: -1, order: 1, createdAt: -1 })
        .select('-submitterEmail -submitterIp');
};

// Admin: all testimonials with filters
const getAllTestimonials = async ({ status, page = 1, limit = 10 }) => {
    const query = {};
    if (status && status !== 'all') query.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const [testimonials, total] = await Promise.all([
        Testimonial.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
        Testimonial.countDocuments(query),
    ]);

    return { testimonials, total };
};

const getTestimonialById = async (id) => {
    const t = await Testimonial.findById(id);
    if (!t) throw { statusCode: 404, message: 'Testimonial not found.' };
    return t;
};

const submitTestimonial = async (data, ip = '') => {
    const testimonial = await Testimonial.create({
        ...data,
        status: 'pending',
        submitterIp: ip,
    });
    return testimonial;
};

const approveTestimonial = async (id) => {
    const t = await Testimonial.findByIdAndUpdate(
        id,
        { status: 'approved', approvedAt: new Date(), rejectionReason: '' },
        { new: true }
    );
    if (!t) throw { statusCode: 404, message: 'Testimonial not found.' };
    return t;
};

const rejectTestimonial = async (id, reason = '') => {
    const t = await Testimonial.findByIdAndUpdate(
        id,
        { status: 'rejected', rejectionReason: reason },
        { new: true }
    );
    if (!t) throw { statusCode: 404, message: 'Testimonial not found.' };
    return t;
};

const deleteTestimonial = async (id) => {
    const t = await Testimonial.findByIdAndDelete(id);
    if (!t) throw { statusCode: 404, message: 'Testimonial not found.' };
    return t;
};

const updateTestimonial = async (id, data) => {
    const t = await Testimonial.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!t) throw { statusCode: 404, message: 'Testimonial not found.' };
    return t;
};

const getPendingCount = async () => Testimonial.countDocuments({ status: 'pending' });

module.exports = { getApprovedTestimonials, getAllTestimonials, getTestimonialById, submitTestimonial, approveTestimonial, rejectTestimonial, deleteTestimonial, updateTestimonial, getPendingCount };