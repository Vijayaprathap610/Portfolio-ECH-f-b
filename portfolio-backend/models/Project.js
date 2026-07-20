const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Project title is required.'],
            trim: true,
            maxlength: [200, 'Title cannot exceed 200 characters.'],
        },
        description: {
            type: String,
            required: [true, 'Project description is required.'],
            trim: true,
            maxlength: [3000, 'Description cannot exceed 3000 characters.'],
        },
        shortDescription: {
            type: String,
            trim: true,
            maxlength: [300, 'Short description cannot exceed 300 characters.'],
        },
        category: {
            type: String,
            required: [true, 'Category is required.'],
            enum: {
                values: ['Web App', 'Mobile App', 'API', 'UI/UX', 'Open Source', 'Other'],
                message: 'Category must be one of: Web App, Mobile App, API, UI/UX, Open Source, Other.',
            },
            default: 'Web App',
        },
        images: [
            {
                url: { type: String, required: true },
                caption: { type: String, default: '', trim: true },
                isMain: { type: Boolean, default: false },
            },
        ],
        technologies: [
            {
                type: String,
                trim: true,
            },
        ],
        features: [
            {
                type: String,
                trim: true,
            },
        ],
        challenges: {
            type: String,
            trim: true,
            maxlength: [1000, 'Challenges cannot exceed 1000 characters.'],
            default: '',
        },
        solutions: {
            type: String,
            trim: true,
            maxlength: [1000, 'Solutions cannot exceed 1000 characters.'],
            default: '',
        },
        liveUrl: {
            type: String,
            trim: true,
            default: '',
        },
        githubUrl: {
            type: String,
            trim: true,
            default: '',
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        isVisible: {
            type: Boolean,
            default: true,
        },
        order: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: ['Completed', 'In Progress', 'Planned'],
            default: 'Completed',
        },
        completedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
        collection: 'projects',
    }
);

projectSchema.index({ category: 1, isFeatured: -1, order: 1 });
projectSchema.index({ title: 'text', description: 'text' });

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;   