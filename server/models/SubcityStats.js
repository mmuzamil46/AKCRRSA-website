const mongoose = require('mongoose');

const subcityStatsSchema = mongoose.Schema({
  totalPopulation: {
    type: Number,
    required: true,
    default: 737740
  },
  totalArea: {
    type: String, // e.g., "7.41 km²"
    required: true,
    default: "7.41 km²"
  },
  totalWoredas: {
    type: Number,
    required: true,
    default: 12
  },
  description: {
    type: String,
    default: "Addis Ketama Subcity Civil Registration and Residency Service Agency (AKCRRSA)"
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('SubcityStats', subcityStatsSchema);
