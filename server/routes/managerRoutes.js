const express = require('express');
const router = express.Router();
const { getManagerMessage, updateManagerMessage } = require('../controllers/managerController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getManagerMessage);
router.put('/', protect, admin, updateManagerMessage);

module.exports = router;
