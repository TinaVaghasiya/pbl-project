const mongoose = require('mongoose');

const learningSignSchema = new mongoose.Schema({
  letter: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    enum: ['alphabet', 'number', 'word', 'sentence'],
    required: true
  },
  image: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('LearningSign', learningSignSchema);
