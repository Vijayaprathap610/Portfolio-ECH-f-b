const Certification = require('../models/Certification');
const path = require('path');
const fs = require('fs');


// Normalize a raw payload before handing it to Mongoose.
// Converts a comma-separated `skills` string into an array.
// Converts an empty-string `expiryDate` to null (Mongoose throws a
// CastError on an empty string for a Date field, which happens whenever
// "doesExpire" is unchecked but expiryDate was previously populated, or
// the date input is submitted blank).
const normalizePayload = (data) => {
    const payload = { ...data };

    if (typeof payload.skills === 'string') {
        payload.skills = payload.skills
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
    }

    if (payload.expiryDate === '' || payload.expiryDate === undefined) {
        payload.expiryDate = null;
    }

    // If the cert doesn't expire, force expiryDate to null regardless of stray input
    const doesExpire = payload.doesExpire === true || payload.doesExpire === 'true';
    if (!doesExpire) {
        payload.expiryDate = null;
    }

    if (payload.issueDate === '') {
        delete payload.issueDate; // let required-field validation catch it
    }

    return payload;
};

const getAllCertifications = async (onlyVisible = false) => {
    const query = onlyVisible ? { isVisible: true } : {};
    return Certification.find(query).sort({ isFeatured: -1, order: 1, issueDate: -1 });
};

const getCertificationById = async (id) => {
    const cert = await Certification.findById(id);
    if (!cert) throw { statusCode: 404, message: 'Certification not found.' };
    return cert;
};

const createCertification = async (data, file = null) => {
    const payload = normalizePayload(data);
    if (file) {
        payload.image = `/uploads/certifications/${file.filename}`;
    }
    return Certification.create(payload);
};

const updateCertification = async (id, data, file = null) => {
    const cert = await Certification.findById(id);
    if (!cert) throw { statusCode: 404, message: 'Certification not found.' };

    const payload = normalizePayload(data);

    if (file) {
        // Delete old image from disk before replacing it
        if (cert.image) {
            const oldPath = path.join(__dirname, '..', cert.image);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        payload.image = `/uploads/certifications/${file.filename}`;
    }

    Object.assign(cert, payload);
    await cert.save();
    return cert;
};

const deleteCertification = async (id) => {
    const cert = await Certification.findByIdAndDelete(id);
    if (!cert) throw { statusCode: 404, message: 'Certification not found.' };

    if (cert.image) {
        const filePath = path.join(__dirname, '..', cert.image);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    return cert;
};

module.exports = { getAllCertifications, getCertificationById, createCertification, updateCertification, deleteCertification };