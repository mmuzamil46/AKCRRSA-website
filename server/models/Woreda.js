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
  },
  population: {
    type: Number,
    default: 0
  },
  lat: {
    type: Number,
    default: 9.04923
  },
  lng: {
    type: Number,
    default: 38.71802
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Woreda', woredaSchema);
