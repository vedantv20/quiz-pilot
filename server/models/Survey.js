const mongoose = require('mongoose');

const surveySchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // one per student
  },
  targetExam: {
    type: String,
    required: true
  },
  attemptYear: {
    type: Number
  },
  dailyStudyHours: {
    type: Number,
    min: 1,
    max: 12
  },
  weakSubjects: [{
    type: String
  }],
  strongSubjects: [{
    type: String
  }],
  resourcesUsed: [{
    type: String // e.g. ["YouTube", "Coaching", "Books", "Apps"]
  }],
  stressLevel: {
    type: Number,
    min: 1,
    max: 5
  },
  confidenceLevel: {
    type: Number,
    min: 1,
    max: 5
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Survey', surveySchema);