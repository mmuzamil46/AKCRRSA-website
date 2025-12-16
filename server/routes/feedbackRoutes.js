const express = require('express');
const router = express.Router();
const {
    createFeedback,
    getAllFeedback,
    getApprovedFeedback,
    updateFeedback,
    deleteFeedback
} = require('../controllers/feedbackController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(createFeedback)
    .get(protect, getAllFeedback);

router.get('/approved', getApprovedFeedback);

router.route('/:id')
    .put(protect, updateFeedback)
    .delete(protect, deleteFeedback);

module.exports = router;
