const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema(
    {
        date: {
            type: String, // YYYY-MM-DD
            required: true,
            index: true,
        },
        count: {
            type: Number,
            default: 1,
        },
        uniqueIps: [
            {
                type: String,
                default:[],
            },
        ],
        pageViews: {
            home: { type: Number, default: 0 },
            projects: { type: Number, default: 0 },
            about: { type: Number, default: 0 },
            contact: { type: Number, default: 0 },
        },
    },
    {
        timestamps: true,
        collection: 'visitors',
    }
);

visitorSchema.index({ date: -1 });

const Visitor = mongoose.model('Visitor', visitorSchema);
module.exports = Visitor;