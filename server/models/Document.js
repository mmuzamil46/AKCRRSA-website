const mongoose = require('mongoose');

const documentSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  category: {
    type: String, // e.g., 'Regulation', 'Form', 'Report'
    default: 'Other',
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Document', documentSchema);
