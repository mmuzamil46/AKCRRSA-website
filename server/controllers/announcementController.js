const asyncHandler = require('express-async-handler');
const Announcement = require('../models/Announcement');

const getAnnouncements = asyncHandler(async (req, res) => {
  const now = new Date();
  const announcements = await Announcement.find({ 
    isActive: true,
    $or: [
      { expiryDate: null },
      { expiryDate: { $gt: now } }
    ]
  }).sort({ createdAt: -1 });
  res.json(announcements);
});

const getAllAnnouncements = asyncHandler(async (req, res) => {
  const announcements = await Announcement.find().sort({ createdAt: -1 });
  res.json(announcements);
});

const createAnnouncement = asyncHandler(async (req, res) => {
  const { text, type, expiryDate } = req.body;
  const announcement = await Announcement.create({ text, type, expiryDate });
  res.status(201).json(announcement);
});

const updateAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await Announcement.findById(req.params.id);
  if (announcement) {
    announcement.text = req.body.text || announcement.text;
    announcement.type = req.body.type || announcement.type;
    announcement.isActive = req.body.isActive !== undefined ? req.body.isActive : announcement.isActive;
    announcement.expiryDate = req.body.expiryDate !== undefined ? req.body.expiryDate : announcement.expiryDate;
    
    const updated = await announcement.save();
    res.json(updated);
  } else {
    res.status(404);
    throw new Error('Announcement not found');
  }
});

const deleteAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await Announcement.findById(req.params.id);
  if (announcement) {
    await announcement.deleteOne();
    res.json({ message: 'Announcement removed' });
  } else {
    res.status(404);
    throw new Error('Announcement not found');
  }
});

module.exports = { getAnnouncements, getAllAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement };
