require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import models
const { User, Subject, Quiz, Question, Attempt, Survey, Bookmark, ExamCategory } = require('../models');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

const clearDatabase = async () => {
  console.log('🗑️  Clearing existing data...');
  await User.deleteMany({});
  await Subject.deleteMany({});
  await Quiz.deleteMany({});
  await Question.deleteMany({});
  await Attempt.deleteMany({});
  await Survey.deleteMany({});
  await Bookmark.deleteMany({});
  await ExamCategory.deleteMany({});
  console.log('✅ Database cleared');
};

const createUsers = async () => {
  console.log('👥 Creating users...');
  
  const users = await User.insertMany([
    {
      name: 'Admin User',
      email: 'admin@quizpilot.com',
      passwordHash: await bcrypt.hash('Admin@123', 12),
      role: 'admin',
      onboardingCompleted: true
    },
    {
      name: 'Teacher User',
      email: 'teacher@quizpilot.com',
      passwordHash: await bcrypt.hash('Teacher@123', 12),
      role: 'teacher',
      onboardingCompleted: true,
      educationLevel: 'postgraduate',
      targetExams: ['JEE', 'NEET']
    },
    {
      name: 'Student One',
      email: 'student1@quizpilot.com',
      passwordHash: await bcrypt.hash('Student@123', 12),
      role: 'student',
      onboardingCompleted: false
    },
    {
      name: 'Student Two',
      email: 'student2@quizpilot.com',
      passwordHash: await bcrypt.hash('Student@123', 12),
      role: 'student',
      onboardingCompleted: true,
      educationLevel: 'class_12',
      currentClass: '12th',
      targetExams: ['JEE', 'NEET']
    }
  ]);
  
  console.log('✅ Users created');
  return users;
};

const createExamCategories = async () => {
  console.log('📂 Creating exam categories...');
  
  const categories = await ExamCategory.insertMany([
    {
      name: 'Class 11 Science',
      slug: 'class-11-science',
      description: 'Class 11 Science subjects for CBSE/State boards',
      educationLevel: 'class_11',
      stream: 'science',
      targetExams: ['Class 11 Exams', 'JEE', 'NEET'],
      displayOrder: 1
    },
    {
      name: 'Class 12 Science',
      slug: 'class-12-science', 
      description: 'Class 12 Science subjects for CBSE/State boards',
      educationLevel: 'class_12',
      stream: 'science',
      targetExams: ['Class 12 Exams', 'JEE', 'NEET'],
      displayOrder: 2
    },
    {
      name: 'JEE Preparation',
      slug: 'jee-preparation',
      description: 'Engineering entrance exam preparation',
      educationLevel: 'entrance_exam',
      stream: 'engineering',
      targetExams: ['JEE Main', 'JEE Advanced'],
      displayOrder: 3
    }
  ]);
  
  console.log('✅ Exam categories created');
  return categories;
};

const createSubjects = async (categories, users) => {
  console.log('📚 Creating subjects...');
  
  const adminUser = users.find(u => u.role === 'admin');
  const class11Category = categories.find(c => c.slug === 'class-11-science');
  const class12Category = categories.find(c => c.slug === 'class-12-science');
  const jeeCategory = categories.find(c => c.slug === 'jee-preparation');
  
  const subjects = await Subject.insertMany([
    {
      name: 'Physics',
      slug: 'physics-11',
      icon: '⚛️',
      description: 'Class 11 Physics',
      examCategory: class11Category._id,
      educationLevels: ['class_11'],
      targetExams: ['Class 11 Exams', 'JEE', 'NEET'],
      createdBy: adminUser._id
    },
    {
      name: 'Physics',
      slug: 'physics-12',
      icon: '⚛️',
      description: 'Class 12 Physics',
      examCategory: class12Category._id,
      educationLevels: ['class_12'],
      targetExams: ['Class 12 Exams', 'JEE', 'NEET'],
      createdBy: adminUser._id
    },
    {
      name: 'Physics',
      slug: 'physics-jee',
      icon: '⚛️',
      description: 'JEE Physics',
      examCategory: jeeCategory._id,
      educationLevels: ['entrance_exam'],
      targetExams: ['JEE Main', 'JEE Advanced'],
      createdBy: adminUser._id
    },
    {
      name: 'Mathematics',
      slug: 'mathematics-12',
      icon: '➕',
      description: 'Class 12 Mathematics',
      examCategory: class12Category._id,
      educationLevels: ['class_12'],
      targetExams: ['Class 12 Exams', 'JEE'],
      createdBy: adminUser._id
    }
  ]);
  
  console.log('✅ Subjects created');
  return subjects;
};

const createQuizzes = async (subjects, users) => {
  console.log('📝 Creating quizzes...');
  
  const teacherUser = users.find(u => u.role === 'teacher');
  const physicsSubject = subjects.find(s => s.slug === 'physics-12');
  const mathSubject = subjects.find(s => s.slug === 'mathematics-12');
  
  const quizzes = await Quiz.insertMany([
    {
      title: 'Class 12 Physics - Motion in a Plane',
      description: 'Test your understanding of projectile motion and circular motion',
      subject: physicsSubject._id,
      createdBy: teacherUser._id,
      difficulty: 'medium',
      timeLimit: 1800, // 30 minutes
      isPublished: true,
      totalQuestions: 10
    },
    {
      title: 'Class 12 Mathematics - Calculus Basics',
      description: 'Limits, derivatives, and basic integration',
      subject: mathSubject._id,
      createdBy: teacherUser._id,
      difficulty: 'medium',
      timeLimit: 1200, // 20 minutes
      isPublished: true,
      totalQuestions: 8
    }
  ]);
  
  console.log('✅ Quizzes created');
  return quizzes;
};

const createQuestions = async (quizzes) => {
  console.log('❓ Creating questions...');
  
  const physicsQuiz = quizzes[0];
  const mathQuiz = quizzes[1];
  
  const questions = await Question.insertMany([
    // Physics questions
    {
      quiz: physicsQuiz._id,
      subject: physicsQuiz.subject,
      text: 'A projectile is thrown at an angle of 30° with the horizontal with initial velocity 20 m/s. What is the maximum height reached?',
      options: ['5 m', '10 m', '15 m', '20 m'],
      correctIndex: 0,
      explanation: 'Maximum height = (u²sin²θ)/(2g) = (20²×sin²30°)/(2×10) = (400×0.25)/20 = 5 m',
      difficulty: 'medium'
    },
    {
      quiz: physicsQuiz._id,
      subject: physicsQuiz.subject,
      text: 'In circular motion, the centripetal acceleration is:',
      options: ['v²/r', 'mv²/r', 'v/r²', 'mv/r'],
      correctIndex: 0,
      explanation: 'Centripetal acceleration = v²/r, where v is velocity and r is radius',
      difficulty: 'easy'
    },
    // Math questions  
    {
      quiz: mathQuiz._id,
      subject: mathQuiz.subject,
      text: 'What is the limit of (sin x)/x as x approaches 0?',
      options: ['0', '1', '∞', 'Does not exist'],
      correctIndex: 1,
      explanation: 'This is a standard limit: lim(x→0) (sin x)/x = 1',
      difficulty: 'medium'
    },
    {
      quiz: mathQuiz._id,
      subject: mathQuiz.subject,
      text: 'The derivative of x³ is:',
      options: ['3x²', '3x', 'x²', 'x³/3'],
      correctIndex: 0,
      explanation: 'd/dx(x³) = 3x² using the power rule',
      difficulty: 'easy'
    }
  ]);
  
  console.log('✅ Questions created');
  return questions;
};

const seed = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    console.log('══════════════════════════════════════════════════');
    
    // Connect to database
    await connectDB();
    
    // Clear existing data
    await clearDatabase();
    
    // Create data
    const users = await createUsers();
    const categories = await createExamCategories();
    const subjects = await createSubjects(categories, users);
    const quizzes = await createQuizzes(subjects, users);
    const questions = await createQuestions(quizzes);
    
    console.log('══════════════════════════════════════════════════');
    console.log('🎉 Seeding completed successfully!');
    console.log(`📊 Created:`);
    console.log(`   - ${users.length} users`);
    console.log(`   - ${categories.length} exam categories`);
    console.log(`   - ${subjects.length} subjects`);
    console.log(`   - ${quizzes.length} quizzes`);
    console.log(`   - ${questions.length} questions`);
    console.log('══════════════════════════════════════════════════');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    console.error(error.stack);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

seed();