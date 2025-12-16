const express = require('express');
const router = express.Router();
const { getAboutContent, updateAboutContent } = require('../controllers/aboutController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(getAboutContent)
    .put(protect, updateAboutContent);

module.exports = router;
