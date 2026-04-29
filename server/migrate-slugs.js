require('dotenv').config();
const mongoose = require('mongoose');
const { Quiz } = require('./models');
const connectDB = require('./config/database');
const { generateSlug } = require('./utils/slugHelper');

async function migrateSlugs() {
  try {
    await connectDB();
    
    const quizzes = await Quiz.find({ slug: { $exists: false } });
    console.log(`Found ${quizzes.length} quizzes needing slugs.`);
    
    for (const quiz of quizzes) {
      quiz.slug = await generateSlug(quiz.title, quiz._id);
      await quiz.save();
      console.log(`Updated quiz '${quiz.title}' with slug: ${quiz.slug}`);
    }
    
    // Also, let's fix any quizzes that have empty strings as slugs
    const emptySlugs = await Quiz.find({ slug: "" });
    for (const quiz of emptySlugs) {
      quiz.slug = await generateSlug(quiz.title, quiz._id);
      await quiz.save();
      console.log(`Updated quiz '${quiz.title}' with slug: ${quiz.slug}`);
    }

    console.log('Migration complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

migrateSlugs();