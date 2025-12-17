const asyncHandler = require('express-async-handler');
const ContactMessage = require('../models/ContactMessage');

// @desc    Create new contact message
// @route   POST /api/contact
// @access  Public
const createContactMessage = asyncHandler(async (req, res) => {
    const { name, phone, message } = req.body;

    const contactMessage = await ContactMessage.create({
        name,
        phone,
        message
    });

    res.status(201).json({ 
        success: true, 
        message: 'Message sent successfully',
        data: contactMessage 
    });
});

// @desc    Get all contact messages (admin)
// @route   GET /api/contact
// @access  Private/Admin
const getAllContactMessages = asyncHandler(async (req, res) => {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
});

// @desc    Update contact message status
// @route   PUT /api/contact/:id
// @access  Private/Admin
const updateContactMessage = asyncHandler(async (req, res) => {
    const message = await ContactMessage.findById(req.params.id);

    if (!message) {
        res.status(404);
        throw new Error('Message not found');
    }

    message.status = req.body.status || message.status;
    const updated = await message.save();
    res.json(updated);
});

// @desc    Delete contact message
// @route   DELETE /api/contact/:id
// @access  Private/Admin
const deleteContactMessage = asyncHandler(async (req, res) => {
    const message = await ContactMessage.findById(req.params.id);

    if (!message) {
        res.status(404);
        throw new Error('Message not found');
    }

    await message.deleteOne();
    res.json({ message: 'Message removed' });
});

module.exports = {
    createContactMessage,
    getAllContactMessages,
    updateContactMessage,
    deleteContactMessage
};
