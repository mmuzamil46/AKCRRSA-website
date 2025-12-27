const express = require('express');
const router = express.Router();
const { getCumulativeStats } = require('../controllers/statsController');

router.get('/cumulative', getCumulativeStats);

module.exports = router;
