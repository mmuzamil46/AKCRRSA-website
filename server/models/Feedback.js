const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    serviceType: {
        type: String,
        required: true
    },
    woredaOffice: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        default: 'Anonymous'
    },
    phone: {
        type: String,
        required: true // Making it required based on user request "most users use phone", but can be optional if needed. Let's make it required as user emphasized it.
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
