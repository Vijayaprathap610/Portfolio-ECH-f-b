const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Skill name is required.'],
            trim: true,
            maxlength: [100, 'Skill name cannot exceed 100 characters.'],
        },
        category: {
            type: String,
            required: [true, 'Category is required.'],
            enum: {
                values: ['Frontend', 'Backend', 'Database', 'Tools', 'Soft Skills'],
                message: 'Category must be one of: Frontend, Backend, Database, Tools, Soft Skills.',
            },
        },
        percentage: {
            type: Number,
            required: [true, 'Skill percentage is required.'],
            min: [0, 'Percentage cannot be less than 0.'],
            max: [100, 'Percentage cannot exceed 100.'],
        },
        icon: {
            type: String,
            default: 'FaCode',
            trim: true,
        },
        color: {
            type: String,
            default: '#6c63ff',
            trim: true,
            match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Please enter a valid hex color.'],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [300, 'Description cannot exceed 300 characters.'],
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
        collection: 'skills',
    }
);

skillSchema.index({ category: 1, order: 1 });

const Skill = mongoose.model('Skill', skillSchema);
module.exports = Skill;