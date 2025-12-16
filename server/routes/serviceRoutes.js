const express = require('express');
const router = express.Router();
const {
  getServices,
  createService,
  updateService,
  deleteService,
} = require('../controllers/serviceController');

// TODO: Add auth middleware for create/update/delete
router.route('/').get(getServices).post(createService);
router.route('/:id').put(updateService).delete(deleteService);

module.exports = router;
