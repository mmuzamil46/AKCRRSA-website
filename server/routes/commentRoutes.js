const express = require('express');
const router = express.Router();
const {
  getCommentsByService,
  getAllComments,
  createComment,
  approveComment,
  deleteComment
} = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getAllComments).post(createComment);
router.route('/service/:serviceId').get(getCommentsByService);
router.route('/:id/approve').put(protect, approveComment);
router.route('/:id').delete(protect, deleteComment);

module.exports = router;
