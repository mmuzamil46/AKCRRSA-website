const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true,
  },
  user: {
    type: String, // Name of the commenter
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  isApproved: {
    type: Boolean,
    default: false, // For moderation
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Comment', commentSchema);
