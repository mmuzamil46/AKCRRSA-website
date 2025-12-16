const mongoose = require('mongoose');

const announcementSchema = mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['info', 'warning', 'danger', 'success'],
    default: 'info',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  expiryDate: {
    type: Date,
    default: null, // null means no expiry
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Announcement', announcementSchema);
