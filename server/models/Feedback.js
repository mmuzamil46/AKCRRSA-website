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
    userEmail: {
        type: String
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
