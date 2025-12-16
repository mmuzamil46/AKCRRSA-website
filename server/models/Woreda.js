const mongoose = require('mongoose');

const woredaSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  mapUrl: { // URL for Google Maps embed or link
    type: String,
    required: true
  },
  managerName: {
    type: String,
    required: true
  },
  managerPhone: {
    type: String,
    required: true
  },
  managerPhoto: {
     type: String // URL or path to image
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Woreda', woredaSchema);
