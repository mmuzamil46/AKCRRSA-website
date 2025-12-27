const mongoose = require('mongoose');

const cumulativeStatsSchema = mongoose.Schema({
  serviceName: {
    type: String,
    required: true,
    unique: true,
  },
  totalCount: {
    type: Number,
    required: true,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true,
  collection: 'cumulativestats' // Explicitly match the pluralized name from local sync
});

module.exports = mongoose.model('CumulativeStats', cumulativeStatsSchema);
