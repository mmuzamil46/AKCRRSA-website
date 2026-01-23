const express = require('express');
const router = express.Router();
const { authOfficer, registerOfficer } = require('../controllers/officerController');

router.post('/login', authOfficer);
router.post('/', registerOfficer);

module.exports = router;
