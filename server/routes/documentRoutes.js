const express = require('express');
const router = express.Router();
const { getDocuments, createDocument, deleteDocument, updateDocument, reindexAll } = require('../controllers/documentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getDocuments).post(protect, createDocument);
router.post('/reindex', protect, reindexAll);
router.route('/:id').delete(protect, deleteDocument).put(protect, updateDocument);

module.exports = router;
