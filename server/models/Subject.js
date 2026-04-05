const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    lowercase: true
  },
  icon: {
    type: String // emoji string e.g. "⚛️"
  },
  description: {
    type: String
  },
  // Link to exam category
  examCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExamCategory'
  },
  // Education levels this subject is relevant for
  educationLevels: [{
    type: String,
    enum: [
      'class_11',
      'class_12',
      'entrance_exam',
      'undergraduate',
      'postgraduate',
      'professional',
      'competitive'
    ]
  }],
  // Target exams this subject is relevant for
  targetExams: [{
    type: String
  }],
  // Parent subject for hierarchical organization
  parentSubject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  },
  // Display order within category
  displayOrder: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index for unique subject within category
subjectSchema.index({ name: 1, examCategory: 1 }, { unique: true });
subjectSchema.index({ examCategory: 1 });
subjectSchema.index({ educationLevels: 1 });
subjectSchema.index({ targetExams: 1 });

module.exports = mongoose.model('Subject', subjectSchema);