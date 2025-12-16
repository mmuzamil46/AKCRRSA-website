const express = require('express');
const router = express.Router();
const {
  getWoredas,
  createWoreda,
  updateWoreda,
  deleteWoreda,
} = require('../controllers/woredaController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getWoredas).post(protect, createWoreda);
router.route('/:id').put(protect, updateWoreda).delete(protect, deleteWoreda);

module.exports = router;
