const express = require('express');
const router = express.Router();
const { getDocuments, createDocument, deleteDocument } = require('../controllers/documentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getDocuments).post(protect, createDocument);
router.route('/:id').delete(protect, deleteDocument);

module.exports = router;
