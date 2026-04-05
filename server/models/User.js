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
  // Educational qualification fields
  educationLevel: {
    type: String,
    enum: [
      'class_11',
      'class_12', 
      'undergraduate',
      'postgraduate',
      'working_professional',
      'other'
    ]
  },
  currentClass: {
    type: String // e.g. "11th Science", "12th Commerce", "B.Tech CSE"
  },
  targetExams: [{
    type: String // Array of target exams e.g. ["JEE", "MHTCET"]
  }],
  targetExam: {
    type: String // Legacy field - primary target exam
  },
  preferredSubjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  }],
  onboardingCompleted: {
    type: Boolean,
    default: false
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