const express = require('express');
const router = express.Router();
const { createRemoteReport, cleanupDuplicates, getOfficerStats, getReportsByDateRange } = require('../controllers/remoteReportController');

router.post('/', createRemoteReport);
router.post('/cleanup', cleanupDuplicates);
router.get('/stats', getOfficerStats);
router.get('/reports', getReportsByDateRange);

module.exports = router;
