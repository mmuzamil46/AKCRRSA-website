const express = require('express');
const router = express.Router();
const { createRemoteReport, cleanupDuplicates, getOfficerStats } = require('../controllers/remoteReportController');

router.post('/', createRemoteReport);
router.post('/cleanup', cleanupDuplicates);
router.get('/stats', getOfficerStats);

module.exports = router;
