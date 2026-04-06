const mongoose = require('mongoose');

const examCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String
  },
  icon: {
    type: String // emoji string
  },
  // Education level this category belongs to
  educationLevel: {
    type: String,
    enum: [
      'class_11',
      'class_12',
      'entrance_exam',
      'undergraduate',
      'postgraduate',
      'professional',
      'competitive'
    ],
    required: true
  },
  // Specific stream/branch if applicable
  stream: {
    type: String,
    enum: [
      'science', 
      'commerce', 
      'arts', 
      'engineering', 
      'medical', 
      'general',
      'computer_science',
      'software',
      'interview',
      'advanced_cs'
    ],
    default: 'general'
  },
  // Target exams this category prepares for
  targetExams: [{
    type: String // e.g., "JEE Main", "JEE Advanced", "NEET", "MHTCET"
  }],
  // Ordering priority for display
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

// Index for efficient querying
examCategorySchema.index({ educationLevel: 1, stream: 1 });
examCategorySchema.index({ slug: 1 });

module.exports = mongoose.model('ExamCategory', examCategorySchema);
