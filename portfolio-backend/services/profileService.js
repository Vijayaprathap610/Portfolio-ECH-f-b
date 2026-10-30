const Profile = require('../models/Profile');
const Skill = require('../models/Skill');
const Project = require('../models/Project');
const Experience = require('../models/Experience');
const Certification = require('../models/Certification');
const Testimonial = require('../models/Testimonial');
const path = require('path');
const fs = require('fs');

// Get the single profile document (always exists after seed)
const getProfile = async () => {
    let profile = await Profile.findOne().lean();
    if (!profile) {
        const created = await Profile.create({
            fullName: 'VIJAYAPRATHAP K',
            title: 'Full Stack MERN Developer',
            email: 'admin@elitecodehub.com',
        });
        profile = created.toObject();
    }
    return profile;
};

// High-speed portfolio bundle that serves all public data in 1 request
const getPortfolioBundle = async () => {
    const [profile, skills, projects, experience, certifications, testimonials] = await Promise.all([
        getProfile(),
        Skill.find({ isVisible: true }).sort({ order: 1 }).lean(),
        Project.find({ isVisible: true }).sort({ isFeatured: -1, order: 1, createdAt: -1 }).lean(),
        Experience.find({ isVisible: true }).sort({ order: 1, startDate: -1 }).lean(),
        Certification.find({ isVisible: true }).sort({ order: 1, issueDate: -1 }).lean(),
        Testimonial.find({ status: 'approved' }).sort({ order: 1, createdAt: -1 }).lean(),
    ]);

    return {
        profile,
        skills,
        projects,
        experience,
        certifications,
        testimonials,
    };
};

// Update profile fields
const updateProfile = async (updateData) => {
    let profile = await Profile.findOne();
    if (!profile) {
        profile = new Profile(updateData);
    } else {
        Object.assign(profile, updateData);
    }
    await profile.save();
    return profile;
};

// Update profile photo — delete old file, save new path
const updateProfilePhoto = async (filePath) => {
    const profile = await Profile.findOne();
    if (!profile) throw { statusCode: 404, message: 'Profile not found.' };

    // Delete old photo if it exists
    if (profile.profilePhoto) {
        const oldFilePath = path.join(__dirname, '..', profile.profilePhoto);
        if (fs.existsSync(oldFilePath)) {
            try {
                fs.unlinkSync(oldFilePath);
            } catch {
                /* ignored */
            }
        }
    }

    const relativePath = filePath.replace(path.join(__dirname, '..'), '').replace(/\\/g, '/');
    profile.profilePhoto = relativePath;
    await profile.save();
    return profile;
};

// Update resume URL or path
const updateResume = async (resumeUrl) => {
    const profile = await Profile.findOne();
    if (!profile) throw { statusCode: 404, message: 'Profile not found.' };
    profile.resumeUrl = resumeUrl;
    await profile.save();
    return profile;
};

module.exports = { getProfile, getPortfolioBundle, updateProfile, updateProfilePhoto, updateResume };
