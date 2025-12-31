const mongoose = require('mongoose');

const visitorCountSchema = mongoose.Schema({
  count: {
    type: Number,
    required: true,
    default: 0
  },
  lastVisited: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('VisitorCount', visitorCountSchema);
