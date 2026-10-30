const Contact = require('../models/Contact');

const submitMessage = async (data, ip = '') => {
    const contact = await Contact.create({ ...data, senderIp: ip });
    return contact;
};

const getAllMessages = async ({ page = 1, limit = 10, status }) => {
    const query = {};
    if (status && status !== 'all') query.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const [messages, total] = await Promise.all([
        Contact.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
        Contact.countDocuments(query),
    ]);

    return { messages, total };
};

const getMessageById = async (id) => {
    const msg = await Contact.findById(id);
    if (!msg) throw { statusCode: 404, message: 'Message not found.' };

    // Auto-mark as read
    if (!msg.isRead) {
        msg.isRead = true;
        msg.readAt = new Date();
        if (msg.status === 'unread') msg.status = 'read';
        await msg.save();
    }
    return msg;
};

const updateMessageStatus = async (id, status, notes = '') => {
    const update = { status };
    if (status === 'replied') update.repliedAt = new Date();
    if (notes) update.adminNotes = notes;

    const msg = await Contact.findByIdAndUpdate(id, update, { new: true });
    if (!msg) throw { statusCode: 404, message: 'Message not found.' };
    return msg;
};

const deleteMessage = async (id) => {
    const msg = await Contact.findByIdAndDelete(id);
    if (!msg) throw { statusCode: 404, message: 'Message not found.' };
    return msg;
};

const getUnreadCount = async () => Contact.countDocuments({ isRead: false });

module.exports = { submitMessage, getAllMessages, getMessageById, updateMessageStatus, deleteMessage, getUnreadCount };
