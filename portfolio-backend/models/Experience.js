const mongoose = require("mongoose");

const experienceSchema = new mongoose.Schema(
    {
        company: {
            type: String,
            required: [true, 'Company name is required.'],
            trim: true,
            maxlength: [200, 'Company name cannot exceed 200 characters.'],
        },
        position: {
            type: String,
            required: [true, 'Position is required.'],
            trim: true,
            maxlength: [200, 'Position cannot exceed 200 characters.'],
        },
        type: {
            type: String,
            enum: {
                values: ['Full-time', 'Part-time', 'Internship', 'Freelance', 'Contract', 'Volunteer'],
                message: 'Type must be a valid employment type.',
            },
            default: 'Internship',
        },
        location: {
            type: String,
            trim: true,
            maxlength: [200, 'Location cannot exceed 200 characters.'],
            default: '',
        },
        startDate: {
            type: Date,
            required: [true, 'Start date is required.'],
        },
        endDate: {
            type: Date,
            default: null,
        },
        isCurrent: {
            type: Boolean,
            default: false,
        },
        description: {
            type: String,
            trim: true,
            maxlength: [2000, 'Description cannot exceed 2000 characters.'],
        },
        responsibilities: [
            {
                type: String,
                trim: true,
                maxlength: [500, 'Responsibility cannot exceed 500 characters.'],
            },
        ],
        technologies: [
            {
                type: String,
                trim: true,
            },
        ],
        companyLogo: {
            type: String,
            default: '',
        },
        isVisible: {
            type: Boolean,
            default: true,
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
        collection: 'experiences',
    }
);

// Virtual: formatted duration
experienceSchema.virtual('duration').get(function () {
    const start = this.startDate;
    const end = this.isCurrent ? new Date() : this.endDate;
    if (!start || !end) return '';
    const months =
        (end.getFullYear() - start.getFullYear()) * 12 +
        (end.getMonth() - start.getMonth());
    if (months < 12) return `${months} month${months !== 1 ? 's' : ''}`;
    const years = Math.floor(months / 12);
    const rem = months % 12;
    return rem
        ? `${years} yr${years !== 1 ? 's' : ''} ${rem} mo${rem !== 1 ? 's' : ''}`
        : `${years} yr${years !== 1 ? 's' : ''}`;
});

experienceSchema.set('toJSON', { virtuals: true });
experienceSchema.set('toObject', { virtuals: true });
experienceSchema.index({ order: 1, startDate: -1 });

const Experience = mongoose.model('Experience', experienceSchema);
module.exports = Experience;    