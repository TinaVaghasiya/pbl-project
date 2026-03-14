const mongoose = require('mongoose');

const gestureLogSchema = new mongoose.Schema({
  detectedSign: {
    type: String,
    required: true
  },
  confidence: {
    type: Number,
    default: 0
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('GestureLog', gestureLogSchema);
