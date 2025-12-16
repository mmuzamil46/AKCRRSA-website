const mongoose = require('mongoose');

const serviceSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  icon: {
    type: String, // Icon class name (e.g. remixicon) or image URL
    default: 'ri-service-fill'
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  requirements: {
    type: [String], // List of requirements for the service
    required: true,
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Service', serviceSchema);
