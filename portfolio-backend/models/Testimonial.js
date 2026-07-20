const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required.'],
            trim: true,
            maxlength: [100, 'Name cannot exceed 100 characters.'],
        },
        company: {
            type: String,
            trim: true,
            maxlength: [200, 'Company name cannot exceed 200 characters.'],
            default: '',
        },
        position: {
            type: String,
            trim: true,
            maxlength: [200, 'Position cannot exceed 200 characters.'],
            default: '',
        },
        message: {
            type: String,
            required: [true, 'Testimonial message is required.'],
            trim: true,
            minlength: [20, 'Message must be at least 20 characters.'],
            maxlength: [1000, 'Message cannot exceed 1000 characters.'],
        },
        rating: {
            type: Number,
            required: [true, 'Rating is required.'],
            min: [1, 'Rating must be at least 1.'],
            max: [5, 'Rating cannot exceed 5.'],
        },
        avatar: {
            type: String,
            default: '',
        },
        status: {
            type: String,
            enum: {
                values: ['pending', 'approved', 'rejected'],
                message: 'Status must be pending, approved, or rejected.',
            },
            default: 'pending',
        },
        isVisible: {
            type: Boolean,
            default: true,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        approvedAt: {
            type: Date,
            default: null,
        },
        rejectionReason: {
            type: String,
            default: '',
        },
        order: {
            type: Number,
            default: 0,
        },
        // Submitter metadata
        submitterEmail: {
            type: String,
            trim: true,
            lowercase: true,
            default: '',
            select: false, // Hide from public responses
        },
        submitterIp: {
            type: String,
            default: '',
            select: false,
        },
    },
    {
        timestamps: true,
        collection: 'testimonials',
    }
);

testimonialSchema.index({ status: 1, isFeatured: -1, order: 1 });

const Testimonial = mongoose.model('Testimonial', testimonialSchema);
module.exports = Testimonial;   