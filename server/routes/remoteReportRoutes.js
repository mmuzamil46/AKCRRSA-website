const express = require('express');
const router = express.Router();
const { createRemoteReport } = require('../controllers/remoteReportController');

router.post('/', createRemoteReport);

module.exports = router;
