const express = require('express');
const router = express.Router();
const { getSocialSettings, updateSocialSettings } = require('../controllers/socialController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getSocialSettings)
    .put(protect, admin, updateSocialSettings);

module.exports = router;
