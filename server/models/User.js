const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin'],
    default: 'student'
  },
  avatar: {
    type: String // URL, optional
  },
  targetExam: {
    type: String // e.g. "JEE", "NEET", "UPSC", "CAT", "GATE"
  },
  streak: {
    type: Number,
    default: 0
  },
  lastActiveDate: {
    type: Date
  },
  badges: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);