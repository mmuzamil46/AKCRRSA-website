const asyncHandler = require('express-async-handler');
const Feedback = require('../models/Feedback');

// @desc    Create new feedback
// @route   POST /api/feedback
// @access  Public
const createFeedback = asyncHandler(async (req, res) => {
    const { serviceType, woredaOffice, rating, comment, userName, userEmail } = req.body;

    const feedback = await Feedback.create({
        serviceType,
        woredaOffice,
        rating,
        comment,
        userName: userName || 'Anonymous',
        userEmail
    });

    res.status(201).json(feedback);
});

// @desc    Get all feedback (admin)
// @route   GET /api/feedback
// @access  Private/Admin
const getAllFeedback = asyncHandler(async (req, res) => {
    const feedback = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedback);
});

// @desc    Get approved feedback (public)
// @route   GET /api/feedback/approved
// @access  Public
const getApprovedFeedback = asyncHandler(async (req, res) => {
    const feedback = await Feedback.find({ status: 'approved' }).sort({ createdAt: -1 });
    res.json(feedback);
});

// @desc    Update feedback status
// @route   PUT /api/feedback/:id
// @access  Private/Admin
const updateFeedback = asyncHandler(async (req, res) => {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
        res.status(404);
        throw new Error('Feedback not found');
    }

    feedback.status = req.body.status || feedback.status;
    const updated = await feedback.save();
    res.json(updated);
});

// @desc    Delete feedback
// @route   DELETE /api/feedback/:id
// @access  Private/Admin
const deleteFeedback = asyncHandler(async (req, res) => {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
        res.status(404);
        throw new Error('Feedback not found');
    }

    await feedback.deleteOne();
    res.json({ message: 'Feedback removed' });
});

module.exports = {
    createFeedback,
    getAllFeedback,
    getApprovedFeedback,
    updateFeedback,
    deleteFeedback
};
