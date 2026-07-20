const Profile = require('../models/Profile');
const path = require('path');
const fs = require('fs');

//Get the single profile document (always exists after seed)
const getProfile = async () => {
    let profile = await Profile.findOne();
    if (!profile) {
        profile = await Profile.create({
            fullName: 'Your Name',
            title: 'Full Stack MERN Developer',
            email: 'admin@elitecodehub.com',
        });
    }
    return profile;
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
            fs.unlinkSync(oldFilePath);
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

module.exports = { getProfile, updateProfile, updateProfilePhoto, updateResume };