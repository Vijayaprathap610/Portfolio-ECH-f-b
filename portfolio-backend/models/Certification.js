const mongoose = require("mongoose");

const certificationSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Certificate title is required.'],
            trim: true,
            maxlength: [300, 'Title cannot exceed 300 characters.'],
        },
        organization: {
            type: String,
            required: [true, 'Issuing organization is required.'],
            trim: true,
            maxlength: [200, 'Organization name cannot exceed 200 characters.'],
        },
        issueDate: {
            type: Date,
            required: [true, 'Issue date is required.'],
        },
        expiryDate: {
            type: Date,
            default: null,
        },
        doesExpire: {
            type: Boolean,
            default: false,
        },
        credentialId: {
            type: String,
            trim: true,
            default: '',
        },
        credentialUrl: {
            type: String,
            trim: true,
            default: '',
        },
        description: {
            type: String,
            trim: true,
            maxlength: [1000, 'Description cannot exceed 1000 characters.'],
            default: '',
        },
        skills: [
            {
                type: String,
                trim: true,
            },
        ],
        image: {
            type: String,
            default: '',
        },
        category: {
            type: String,
            enum: ['Certificate', 'Achievement', 'Badge', 'Award', 'Course'],
            default: 'Certificate',
        },
        isVisible: {
            type: Boolean,
            default: true,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
        collection: 'certifications',
    }
);

certificationSchema.index({ isFeatured: -1, order: 1, issueDate: -1 });

const Certification = mongoose.model('Certification', certificationSchema);
module.exports = Certification;