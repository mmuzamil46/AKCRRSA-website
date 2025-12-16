const asyncHandler = require('express-async-handler');
const Comment = require('../models/Comment');

// @desc    Get comments for a specific service
// @route   GET /api/comments/service/:serviceId
// @access  Public
const getCommentsByService = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ 
    serviceId: req.params.serviceId,
    isApproved: true 
  }).sort({ createdAt: -1 });
  
  res.json(comments);
});

// @desc    Get all comments (Admin)
// @route   GET /api/comments
// @access  Private (Admin)
const getAllComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find().populate('serviceId', 'title').sort({ createdAt: -1 });
  res.json(comments);
});

// @desc    Create a comment
// @route   POST /api/comments
// @access  Public
const createComment = asyncHandler(async (req, res) => {
  const { serviceId, user, content, rating } = req.body;

  if (!serviceId || !user || !content || !rating) {
    res.status(400);
    throw new Error('Please fill all fields');
  }

  const comment = new Comment({
    serviceId,
    user,
    content,
    rating,
    isApproved: false // Default to unapproved
  });

  const createdComment = await comment.save();
  res.status(201).json(createdComment);
});

// @desc    Approve a comment
// @route   PUT /api/comments/:id/approve
// @access  Private (Admin)
const approveComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (comment) {
    comment.isApproved = true;
    const updatedComment = await comment.save();
    res.json(updatedComment);
  } else {
    res.status(404);
    throw new Error('Comment not found');
  }
});

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private (Admin)
const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (comment) {
    await comment.deleteOne();
    res.json({ message: 'Comment removed' });
  } else {
    res.status(404);
    throw new Error('Comment not found');
  }
});

module.exports = {
  getCommentsByService,
  getAllComments,
  createComment,
  approveComment,
  deleteComment
};
