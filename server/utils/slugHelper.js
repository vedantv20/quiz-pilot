const { Quiz } = require('../models');

const generateSlug = async (title, currentId = null) => {
  const baseSlug = title.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text

  let slug = baseSlug;
  let counter = 1;
  
  while (true) {
    const existingQuiz = await Quiz.findOne({ slug });
    if (!existingQuiz || (currentId && existingQuiz._id.toString() === currentId.toString())) {
      break;
    }
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
};

const resolveQuiz = async (idOrSlug) => {
  const mongoose = require('mongoose');
  if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
    const quiz = await Quiz.findById(idOrSlug);
    if (quiz) return quiz;
  }
  return await Quiz.findOne({ slug: idOrSlug });
};

module.exports = {
  generateSlug,
  resolveQuiz
};