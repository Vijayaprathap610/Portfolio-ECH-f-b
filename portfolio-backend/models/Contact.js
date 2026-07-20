const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required.'],
            trim: true,
            maxlength: [100, 'Name cannot exceed 100 characters.'],
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
            default: '',
            maxlength: [20, 'Phone cannot exceed 20 characters.'],
        },
        subject: {
            type: String,
            required: [true, 'Subject is required.'],
            trim: true,
            maxlength: [300, 'Subject cannot exceed 300 characters.'],
        },
        message: {
            type: String,
            required: [true, 'Message is required.'],
            trim: true,
            minlength: [10, 'Message must be at least 10 characters.'],
            maxlength: [5000, 'Message cannot exceed 5000 characters.'],
        },
        status: {
            type: String,
            enum: ['unread', 'read', 'replied', 'archived'],
            default: 'unread',
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        readAt: {
            type: Date,
            default: null,
        },
        repliedAt: {
            type: Date,
            default: null,
        },
        adminNotes: {
            type: String,
            default: '',
            trim: true,
            select: false,
        },
        senderIp: {
            type: String,
            default: '',
            select: false,
        },
    },
    {
        timestamps: true,
        collection: 'contacts',
    }
);

contactSchema.index({ status: 1, createdAt: -1 });
contactSchema.index({ isRead: 1 });

const Contact = mongoose.model('Contact', contactSchema);
module.exports = Contact;   