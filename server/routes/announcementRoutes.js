const express = require('express');
const router = express.Router();
const { getAnnouncements, getAllAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } = require('../controllers/announcementController');
const { protect } = require('../middleware/authMiddleware');

router.route('/public').get(getAnnouncements); // For frontend (only active)
router.route('/').get(protect, getAllAnnouncements).post(protect, createAnnouncement);
router.route('/:id').put(protect, updateAnnouncement).delete(protect, deleteAnnouncement);

module.exports = router;
