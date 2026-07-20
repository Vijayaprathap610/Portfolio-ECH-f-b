const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Admin name is required.'],
            trim: true,
            lowercase: true,
            unique: true,
            maxlength: [50, 'Name cannot exceed 50 characters.'],
        },
        secretKeyHash: {
            type: String,
            required: [true, 'Secret key is required.'],
            select: false,
        },
        role: {
            type: String,
            enum: ['admin', 'superadmin'],
            default: 'admin',
        },
        lastLogin: {
            type: Date,
            default: null,
        },
        loginAttempts: {
            type: Number,
            default: 0,
        },
        lockUntil: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
        collection: 'admins',
    }
);

// Check if account is locked
adminSchema.virtual('isLocked').get(function () {
    return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Compare provided secret key with stored hash
adminSchema.methods.compareSecretKey = async function (candidateKey) {
    return await bcrypt.compare(candidateKey, this.secretKeyHash);
};

// Increment login attempts
adminSchema.methods.incLoginAttempts = async function () {
    // Reset lock if it has expired
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return await this.updateOne({
            $set: { loginAttempts: 1 },
            $unset: { lockUntil: 1 },
        });
    }
    const updates = { $inc: { loginAttempts: 1 } };
    // Lock after 5 attempts for 15 minutes
    if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
        updates.$set = { lockUntil: Date.now() + 15 * 60 * 1000 };
    }
    return await this.updateOne(updates);
};

// Hash secret key before saving if modified
adminSchema.pre('save', async function () {
    if (!this.isModified('secretKeyHash')) return;
    this.secretKeyHash = await bcrypt.hash(this.secretKeyHash, 12);

});
adminSchema.methods.compareSecretKey = function (candidateKey) {
    return bcrypt.compare(candidateKey, this.secretKeyHash);
};

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;