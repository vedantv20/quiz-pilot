const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  answers: [{
    type: Number // selected option indices, -1 = skipped
  }],
  score: {
    type: Number // raw correct count
  },
  percentage: {
    type: Number // score / total * 100
  },
  timeTaken: {
    type: Number // seconds
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Attempt', attemptSchema);