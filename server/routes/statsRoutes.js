const express = require('express');
const router = express.Router();
const { getCumulativeStats, incrementVisitorCount, getVisitorCount } = require('../controllers/statsController');

router.get('/cumulative', getCumulativeStats);
router.post('/visit', incrementVisitorCount);
router.get('/visit', getVisitorCount);

module.exports = router;
