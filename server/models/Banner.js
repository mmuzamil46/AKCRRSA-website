const mongoose = require('mongoose');

const bannerSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
  },
  image: {
    type: String, // Image URL
    required: true,
  },
  link: {
    type: String, // Optional CTA link
  },
  order: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Banner', bannerSchema);
