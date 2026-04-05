const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  },
  text: {
    type: String,
    required: true
  },
  image: {
    type: String, // URL/path to uploaded image
    default: null
  },
  imageAlt: {
    type: String, // Alt text for accessibility
    default: ''
  },
  options: {
    type: [String],
    validate: {
      validator: function(arr) {
        return arr.length === 4;
      },
      message: 'Options array must have exactly 4 elements'
    }
  },
  correctIndex: {
    type: Number,
    min: 0,
    max: 3,
    required: true
  },
  explanation: {
    type: String
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Question', questionSchema);