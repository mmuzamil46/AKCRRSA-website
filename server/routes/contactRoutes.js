const express = require('express');
const router = express.Router();
const {
    createContactMessage,
    getAllContactMessages,
    updateContactMessage,
    deleteContactMessage
} = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(createContactMessage)
    .get(protect, getAllContactMessages);

router.route('/:id')
    .put(protect, updateContactMessage)
    .delete(protect, deleteContactMessage);

module.exports = router;
