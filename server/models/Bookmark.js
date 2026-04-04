const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// compound unique index on (student, question)
bookmarkSchema.index({ student: 1, question: 1 }, { unique: true });

module.exports = mongoose.model('Bookmark', bookmarkSchema);