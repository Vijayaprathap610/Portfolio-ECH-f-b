const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema({
    degree: { type: String, required: true, trim: true },
    institution: { type: String, required: true, trim: true },
    board: { type: String, trim: true },
    year: { type: String, required: true, trim: true },
    percentage: { type: String, trim: true },
    description: { type: String, trim: true },
}, { _id: true });

const profileSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: [true, 'Full name is required.'],
            trim: true,
            maxlength: [100, 'Full name cannot exceed 100 characters.'],
        },
        title: {
            type: String,
            required: [true, 'Title is required.'],
            trim: true,
            maxlength: [150, 'Title cannot exceed 150 characters.'],
        },
        email: {
            type: String,
            required: [true, 'Email is required.'],
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address.'],
        },
        phone: {
            type: String,
            trim: true,
            maxlength: [20, 'Phone cannot exceed 20 characters.'],
        },
        location: {
            type: String,
            trim: true,
            maxlength: [100, 'Location cannot exceed 100 characters.'],
        },
        bio: {
            type: String,
            trim: true,
            maxlength: [2000, 'Bio cannot exceed 2000 characters.'],
        },
        objective: {
            type: String,
            trim: true,
            maxlength: [1000, 'Objective cannot exceed 1000 characters.'],
        },
        profilePhoto: {
            type: String,
            default: '',
        },
        resumeUrl: {
            type: String,
            default: '',
        },
        socialLinks: {
            github: { type: String, default: '', trim: true },
            linkedin: { type: String, default: '', trim: true },
            twitter: { type: String, default: '', trim: true },
            instagram: { type: String, default: '', trim: true },
            portfolio: { type: String, default: '', trim: true },
        },
        personalInfo: {
            dob: { type: String, default: '' },
            nationality: { type: String, default: '', trim: true },
            languages: [{ type: String, trim: true }],
            interests: [{ type: String, trim: true }],
            availability: { type: String, default: 'Available', trim: true },
        },
        education: [educationSchema],
    },
    {
        timestamps: true,
        collection: 'profiles',
    }
);

const Profile = mongoose.model('Profile', profileSchema);
module.exports = Profile;