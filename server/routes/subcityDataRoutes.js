const express = require('express');
const router = express.Router();
const { getSubcityData, updateSubcityStats } = require('../controllers/subcityDataController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getSubcityData);

router.route('/stats')
    .put(protect, admin, updateSubcityStats);

module.exports = router;
