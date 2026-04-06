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
    // Physics
    {
      name: 'Physics',
      slug: 'physics-12',
      icon: '⚛️',
      description: 'Class 12 Physics - Motion, Forces, Waves, Modern Physics',
      examCategory: class12Category._id,
      educationLevels: ['class_12'],
      targetExams: ['Class 12 Exams', 'JEE', 'NEET'],
      createdBy: adminUser._id
    },
    // Mathematics
    {
      name: 'Mathematics',
      slug: 'mathematics-12',
      icon: '➕',
      description: 'Class 12 Mathematics - Calculus, Algebra, Coordinate Geometry',
      examCategory: class12Category._id,
      educationLevels: ['class_12'],
      targetExams: ['Class 12 Exams', 'JEE'],
      createdBy: adminUser._id
    },
    // Chemistry
    {
      name: 'Chemistry',
      slug: 'chemistry-12',
      icon: '🧪',
      description: 'Class 12 Chemistry - Organic, Inorganic, Physical Chemistry',
      examCategory: class12Category._id,
      educationLevels: ['class_12'],
      targetExams: ['Class 12 Exams', 'JEE', 'NEET'],
      createdBy: adminUser._id
    },
    // Biology
    {
      name: 'Biology',
      slug: 'biology-12',
      icon: '🧬',
      description: 'Class 12 Biology - Cell Biology, Genetics, Human Physiology',
      examCategory: class12Category._id,
      educationLevels: ['class_12'],
      targetExams: ['Class 12 Exams', 'NEET'],
      createdBy: adminUser._id
    },
    // Computer Science
    {
      name: 'Computer Science',
      slug: 'computer-science-12',
      icon: '💻',
      description: 'Class 12 Computer Science - Programming, Data Structures, Algorithms',
      examCategory: class12Category._id,
      educationLevels: ['class_12'],
      targetExams: ['Class 12 Exams', 'JEE'],
      createdBy: adminUser._id
    },
    // History
    {
      name: 'History',
      slug: 'history-12',
      icon: '📜',
      description: 'Class 12 History - Ancient, Medieval, Modern World History',
      examCategory: class12Category._id,
      educationLevels: ['class_12'],
      targetExams: ['Class 12 Exams', 'UPSC'],
      createdBy: adminUser._id
    }
  ]);
  
  console.log('✅ Subjects created');
  return subjects;
};

const createQuizzes = async (subjects, users) => {
  console.log('📝 Creating quizzes...');
  
  const teacherUser = users.find(u => u.role === 'teacher');
  const adminUser = users.find(u => u.role === 'admin');
  
  // Find subjects
  const physicsSubject = subjects.find(s => s.slug === 'physics-12');
  const mathSubject = subjects.find(s => s.slug === 'mathematics-12');
  const chemistrySubject = subjects.find(s => s.slug === 'chemistry-12');
  const biologySubject = subjects.find(s => s.slug === 'biology-12');
  const csSubject = subjects.find(s => s.slug === 'computer-science-12');
  const historySubject = subjects.find(s => s.slug === 'history-12');

  // Helper function for adaptive timing
  const calculateTimeLimit = (questions, difficulty) => {
    const baseTime = {
      'easy': 45,      // 45 seconds per question
      'medium': 75,    // 75 seconds per question  
      'hard': 105      // 105 seconds per question
    };
    return questions * baseTime[difficulty];
  };
  
  const quizzes = await Quiz.insertMany([
    // PHYSICS QUIZZES
    {
      title: 'Physics Fundamentals',
      description: 'Basic concepts of physics - units, dimensions, and fundamental laws',
      subject: physicsSubject._id,
      createdBy: teacherUser._id,
      difficulty: 'easy',
      timeLimit: calculateTimeLimit(8, 'easy'), // 360s = 6 minutes
      isPublished: true,
      totalQuestions: 8,
      tags: ['fundamentals', 'basics']
    },
    {
      title: 'Motion & Forces',
      description: 'Kinematics, dynamics, and Newton\'s laws of motion',
      subject: physicsSubject._id,
      createdBy: teacherUser._id,
      difficulty: 'medium',
      timeLimit: calculateTimeLimit(10, 'medium'), // 750s = 12.5 minutes
      isPublished: true,
      totalQuestions: 10,
      tags: ['motion', 'forces', 'dynamics']
    },
    {
      title: 'Waves & Modern Physics',
      description: 'Wave motion, electromagnetic waves, and quantum physics',
      subject: physicsSubject._id,
      createdBy: adminUser._id,
      difficulty: 'hard',
      timeLimit: calculateTimeLimit(10, 'hard'), // 1050s = 17.5 minutes
      isPublished: true,
      totalQuestions: 10,
      tags: ['waves', 'quantum', 'modern physics']
    },

    // MATHEMATICS QUIZZES
    {
      title: 'Algebra & Basic Functions',
      description: 'Algebraic operations, functions, and their properties',
      subject: mathSubject._id,
      createdBy: teacherUser._id,
      difficulty: 'easy',
      timeLimit: calculateTimeLimit(8, 'easy'), // 360s = 6 minutes
      isPublished: true,
      totalQuestions: 8,
      tags: ['algebra', 'functions']
    },
    {
      title: 'Calculus Applications',
      description: 'Differentiation, integration, and applications of calculus',
      subject: mathSubject._id,
      createdBy: teacherUser._id,
      difficulty: 'medium',
      timeLimit: calculateTimeLimit(10, 'medium'), // 750s = 12.5 minutes
      isPublished: true,
      totalQuestions: 10,
      tags: ['calculus', 'derivatives', 'integration']
    },
    {
      title: 'Advanced Integration & Differential Equations',
      description: 'Complex integration techniques and solving differential equations',
      subject: mathSubject._id,
      createdBy: adminUser._id,
      difficulty: 'hard',
      timeLimit: calculateTimeLimit(10, 'hard'), // 1050s = 17.5 minutes
      isPublished: true,
      totalQuestions: 10,
      tags: ['integration', 'differential equations', 'advanced']
    },

    // CHEMISTRY QUIZZES
    {
      title: 'Atomic Structure & Periodic Table',
      description: 'Atoms, electronic configuration, and periodic properties',
      subject: chemistrySubject._id,
      createdBy: teacherUser._id,
      difficulty: 'easy',
      timeLimit: calculateTimeLimit(8, 'easy'), // 360s = 6 minutes
      isPublished: true,
      totalQuestions: 8,
      tags: ['atomic structure', 'periodic table']
    },
    {
      title: 'Chemical Bonding & Reactions',
      description: 'Types of bonds, molecular structure, and chemical reactions',
      subject: chemistrySubject._id,
      createdBy: teacherUser._id,
      difficulty: 'medium',
      timeLimit: calculateTimeLimit(10, 'medium'), // 750s = 12.5 minutes
      isPublished: true,
      totalQuestions: 10,
      tags: ['bonding', 'reactions', 'molecular structure']
    },
    {
      title: 'Organic Chemistry Mechanisms',
      description: 'Organic reactions, mechanisms, and synthetic pathways',
      subject: chemistrySubject._id,
      createdBy: adminUser._id,
      difficulty: 'hard',
      timeLimit: calculateTimeLimit(10, 'hard'), // 1050s = 17.5 minutes
      isPublished: true,
      totalQuestions: 10,
      tags: ['organic chemistry', 'mechanisms', 'synthesis']
    },

    // BIOLOGY QUIZZES
    {
      title: 'Cell Biology Basics',
      description: 'Cell structure, organelles, and cellular processes',
      subject: biologySubject._id,
      createdBy: teacherUser._id,
      difficulty: 'easy',
      timeLimit: calculateTimeLimit(8, 'easy'), // 360s = 6 minutes
      isPublished: true,
      totalQuestions: 8,
      tags: ['cell biology', 'organelles']
    },
    {
      title: 'Genetics & Heredity',
      description: 'Mendelian genetics, DNA, RNA, and protein synthesis',
      subject: biologySubject._id,
      createdBy: teacherUser._id,
      difficulty: 'medium',
      timeLimit: calculateTimeLimit(10, 'medium'), // 750s = 12.5 minutes
      isPublished: true,
      totalQuestions: 10,
      tags: ['genetics', 'DNA', 'heredity']
    },
    {
      title: 'Human Physiology',
      description: 'Human organ systems and their functions',
      subject: biologySubject._id,
      createdBy: adminUser._id,
      difficulty: 'hard',
      timeLimit: calculateTimeLimit(10, 'hard'), // 1050s = 17.5 minutes
      isPublished: true,
      totalQuestions: 10,
      tags: ['physiology', 'human body', 'organs']
    },

    // COMPUTER SCIENCE QUIZZES
    {
      title: 'Programming Fundamentals',
      description: 'Basic programming concepts, data types, and control structures',
      subject: csSubject._id,
      createdBy: teacherUser._id,
      difficulty: 'easy',
      timeLimit: calculateTimeLimit(8, 'easy'), // 360s = 6 minutes
      isPublished: true,
      totalQuestions: 8,
      tags: ['programming', 'fundamentals']
    },
    {
      title: 'Data Structures & Algorithms',
      description: 'Arrays, linked lists, stacks, queues, and basic algorithms',
      subject: csSubject._id,
      createdBy: teacherUser._id,
      difficulty: 'medium',
      timeLimit: calculateTimeLimit(10, 'medium'), // 750s = 12.5 minutes
      isPublished: true,
      totalQuestions: 10,
      tags: ['data structures', 'algorithms']
    },
    {
      title: 'System Design & Complexity',
      description: 'Advanced algorithms, complexity analysis, and system design',
      subject: csSubject._id,
      createdBy: adminUser._id,
      difficulty: 'hard',
      timeLimit: calculateTimeLimit(10, 'hard'), // 1050s = 17.5 minutes
      isPublished: true,
      totalQuestions: 10,
      tags: ['system design', 'complexity', 'advanced algorithms']
    },

    // HISTORY QUIZZES
    {
      title: 'Ancient Civilizations',
      description: 'Early human civilizations, empires, and cultural developments',
      subject: historySubject._id,
      createdBy: teacherUser._id,
      difficulty: 'easy',
      timeLimit: calculateTimeLimit(8, 'easy'), // 360s = 6 minutes
      isPublished: true,
      totalQuestions: 8,
      tags: ['ancient history', 'civilizations']
    },
    {
      title: 'World Wars & Modern History',
      description: 'World Wars, colonial period, and 20th century developments',
      subject: historySubject._id,
      createdBy: teacherUser._id,
      difficulty: 'medium',
      timeLimit: calculateTimeLimit(10, 'medium'), // 750s = 12.5 minutes
      isPublished: true,
      totalQuestions: 10,
      tags: ['world wars', 'modern history']
    },
    {
      title: 'Indian Independence Movement',
      description: 'Freedom struggle, leaders, and path to independence',
      subject: historySubject._id,
      createdBy: adminUser._id,
      difficulty: 'hard',
      timeLimit: calculateTimeLimit(10, 'hard'), // 1050s = 17.5 minutes
      isPublished: true,
      totalQuestions: 10,
      tags: ['indian history', 'independence', 'freedom struggle']
    }
  ]);
  
  console.log('✅ Quizzes created');
  return quizzes;
};

const createQuestions = async (quizzes) => {
  console.log('❓ Creating questions...');
  
  const questions = [];
  
  // PHYSICS QUESTIONS
  // Physics Fundamentals (Easy) - Quiz 0
  const physicsBasic = quizzes[0];
  questions.push(...[
    {
      quiz: physicsBasic._id,
      subject: physicsBasic.subject,
      text: 'What is the SI unit of force?',
      options: ['Newton', 'Joule', 'Watt', 'Pascal'],
      correctIndex: 0,
      explanation: 'Newton (N) is the SI unit of force. It is defined as kg⋅m/s².',
      difficulty: 'easy'
    },
    {
      quiz: physicsBasic._id,
      subject: physicsBasic.subject,
      text: 'Which of the following is a scalar quantity?',
      options: ['Velocity', 'Force', 'Temperature', 'Acceleration'],
      correctIndex: 2,
      explanation: 'Temperature is a scalar quantity as it has only magnitude, no direction.',
      difficulty: 'easy'
    },
    {
      quiz: physicsBasic._id,
      subject: physicsBasic.subject,
      text: 'The dimensional formula of energy is:',
      options: ['[ML²T⁻²]', '[MLT⁻²]', '[ML²T⁻¹]', '[M²LT⁻²]'],
      correctIndex: 0,
      explanation: 'Energy has dimensional formula [ML²T⁻²]. This applies to kinetic energy, potential energy, etc.',
      difficulty: 'easy'
    },
    {
      quiz: physicsBasic._id,
      subject: physicsBasic.subject,
      text: 'What is the value of acceleration due to gravity on Earth?',
      options: ['9.8 m/s', '9.8 m/s²', '10 m/s', '10 m/s²'],
      correctIndex: 1,
      explanation: 'Acceleration due to gravity (g) on Earth is approximately 9.8 m/s².',
      difficulty: 'easy'
    },
    {
      quiz: physicsBasic._id,
      subject: physicsBasic.subject,
      text: 'Which law states that every action has an equal and opposite reaction?',
      options: ['First law of motion', 'Second law of motion', 'Third law of motion', 'Law of gravitation'],
      correctIndex: 2,
      explanation: 'Newton\'s third law of motion states that every action has an equal and opposite reaction.',
      difficulty: 'easy'
    },
    {
      quiz: physicsBasic._id,
      subject: physicsBasic.subject,
      text: 'What is the speed of light in vacuum?',
      options: ['3 × 10⁸ m/s', '3 × 10⁶ m/s', '3 × 10¹⁰ m/s', '3 × 10⁴ m/s'],
      correctIndex: 0,
      explanation: 'The speed of light in vacuum is approximately 3 × 10⁸ meters per second.',
      difficulty: 'easy'
    },
    {
      quiz: physicsBasic._id,
      subject: physicsBasic.subject,
      text: 'Which of the following is the smallest unit of matter?',
      options: ['Molecule', 'Atom', 'Proton', 'Electron'],
      correctIndex: 1,
      explanation: 'An atom is the smallest unit of matter that retains chemical properties.',
      difficulty: 'easy'
    },
    {
      quiz: physicsBasic._id,
      subject: physicsBasic.subject,
      text: 'What type of energy does a moving object possess?',
      options: ['Potential energy', 'Kinetic energy', 'Chemical energy', 'Nuclear energy'],
      correctIndex: 1,
      explanation: 'A moving object possesses kinetic energy, given by KE = ½mv².',
      difficulty: 'easy'
    }
  ]);

  // Motion & Forces (Medium) - Quiz 1
  const physicsMotion = quizzes[1];
  questions.push(...[
    {
      quiz: physicsMotion._id,
      subject: physicsMotion.subject,
      text: 'A projectile is thrown at an angle of 30° with initial velocity 20 m/s. What is the maximum height reached?',
      options: ['5 m', '10 m', '15 m', '20 m'],
      correctIndex: 0,
      explanation: 'Maximum height = (u²sin²θ)/(2g) = (20²×sin²30°)/(2×10) = (400×0.25)/20 = 5 m',
      difficulty: 'medium'
    },
    {
      quiz: physicsMotion._id,
      subject: physicsMotion.subject,
      text: 'A car accelerates from rest at 2 m/s² for 10 seconds. What is the distance covered?',
      options: ['100 m', '200 m', '20 m', '40 m'],
      correctIndex: 0,
      explanation: 'Using s = ut + ½at², where u=0, a=2, t=10: s = 0 + ½×2×10² = 100 m',
      difficulty: 'medium'
    },
    {
      quiz: physicsMotion._id,
      subject: physicsMotion.subject,
      text: 'In circular motion, centripetal acceleration is:',
      options: ['v²/r', 'mv²/r', 'v/r²', 'mv/r'],
      correctIndex: 0,
      explanation: 'Centripetal acceleration = v²/r, where v is velocity and r is radius of circular path.',
      difficulty: 'medium'
    },
    {
      quiz: physicsMotion._id,
      subject: physicsMotion.subject,
      text: 'What is the momentum of a 5 kg object moving at 10 m/s?',
      options: ['50 kg⋅m/s', '15 kg⋅m/s', '2 kg⋅m/s', '500 kg⋅m/s'],
      correctIndex: 0,
      explanation: 'Momentum = mass × velocity = 5 kg × 10 m/s = 50 kg⋅m/s',
      difficulty: 'medium'
    },
    {
      quiz: physicsMotion._id,
      subject: physicsMotion.subject,
      text: 'A force of 10 N acts on a 2 kg mass. What is the acceleration?',
      options: ['5 m/s²', '20 m/s²', '12 m/s²', '8 m/s²'],
      correctIndex: 0,
      explanation: 'Using F = ma: a = F/m = 10 N / 2 kg = 5 m/s²',
      difficulty: 'medium'
    },
    {
      quiz: physicsMotion._id,
      subject: physicsMotion.subject,
      text: 'The coefficient of friction between two surfaces is 0.3. What is the maximum static friction if normal force is 100 N?',
      options: ['30 N', '300 N', '0.3 N', '3 N'],
      correctIndex: 0,
      explanation: 'Maximum static friction = μₛ × N = 0.3 × 100 N = 30 N',
      difficulty: 'medium'
    },
    {
      quiz: physicsMotion._id,
      subject: physicsMotion.subject,
      text: 'A spring with spring constant 100 N/m is compressed by 0.1 m. What is the stored potential energy?',
      options: ['0.5 J', '1 J', '10 J', '100 J'],
      correctIndex: 0,
      explanation: 'Elastic potential energy = ½kx² = ½ × 100 × (0.1)² = 0.5 J',
      difficulty: 'medium'
    },
    {
      quiz: physicsMotion._id,
      subject: physicsMotion.subject,
      text: 'What is the escape velocity from Earth\'s surface approximately?',
      options: ['11.2 km/s', '7.9 km/s', '9.8 km/s', '15 km/s'],
      correctIndex: 0,
      explanation: 'Escape velocity from Earth is approximately 11.2 km/s, calculated using v = √(2GM/R).',
      difficulty: 'medium'
    },
    {
      quiz: physicsMotion._id,
      subject: physicsMotion.subject,
      text: 'In uniform circular motion, which quantity remains constant?',
      options: ['Speed', 'Velocity', 'Acceleration', 'Force'],
      correctIndex: 0,
      explanation: 'In uniform circular motion, speed remains constant while velocity direction changes continuously.',
      difficulty: 'medium'
    },
    {
      quiz: physicsMotion._id,
      subject: physicsMotion.subject,
      text: 'Two objects of masses 2 kg and 3 kg are moving with velocities 4 m/s and 2 m/s respectively. What is the total momentum?',
      options: ['14 kg⋅m/s', '10 kg⋅m/s', '8 kg⋅m/s', '6 kg⋅m/s'],
      correctIndex: 0,
      explanation: 'Total momentum = m₁v₁ + m₂v₂ = (2×4) + (3×2) = 8 + 6 = 14 kg⋅m/s',
      difficulty: 'medium'
    }
  ]);

  // Waves & Modern Physics (Hard) - Quiz 2
  const physicsWaves = quizzes[2];
  questions.push(...[
    {
      quiz: physicsWaves._id,
      subject: physicsWaves.subject,
      text: 'The energy of a photon is given by:',
      options: ['E = hf', 'E = mc²', 'E = ½mv²', 'E = mgh'],
      correctIndex: 0,
      explanation: 'Photon energy is given by Planck\'s equation E = hf, where h is Planck\'s constant and f is frequency.',
      difficulty: 'hard'
    },
    {
      quiz: physicsWaves._id,
      subject: physicsWaves.subject,
      text: 'What is the de Broglie wavelength formula?',
      options: ['λ = h/p', 'λ = hf', 'λ = v/f', 'λ = c/f'],
      correctIndex: 0,
      explanation: 'de Broglie wavelength λ = h/p, where h is Planck\'s constant and p is momentum.',
      difficulty: 'hard'
    },
    {
      quiz: physicsWaves._id,
      subject: physicsWaves.subject,
      text: 'In Young\'s double slit experiment, fringe width is:',
      options: ['λD/d', 'λd/D', 'Dd/λ', 'λ/Dd'],
      correctIndex: 0,
      explanation: 'Fringe width β = λD/d, where λ is wavelength, D is screen distance, d is slit separation.',
      difficulty: 'hard'
    },
    {
      quiz: physicsWaves._id,
      subject: physicsWaves.subject,
      text: 'The work function of a metal is 2 eV. What is the threshold frequency? (h = 4.14 × 10⁻¹⁵ eV⋅s)',
      options: ['4.83 × 10¹⁴ Hz', '2.41 × 10¹⁴ Hz', '8.28 × 10¹⁴ Hz', '1.66 × 10¹⁴ Hz'],
      correctIndex: 0,
      explanation: 'Threshold frequency ν₀ = φ/h = 2 eV / (4.14 × 10⁻¹⁵ eV⋅s) = 4.83 × 10¹⁴ Hz',
      difficulty: 'hard'
    },
    {
      quiz: physicsWaves._id,
      subject: physicsWaves.subject,
      text: 'Standing waves are formed when:',
      options: ['Two waves of same frequency travel in opposite directions', 'Two waves of different frequencies interfere', 'A wave reflects from a boundary', 'Wave undergoes diffraction'],
      correctIndex: 0,
      explanation: 'Standing waves form when two waves of same frequency and amplitude travel in opposite directions.',
      difficulty: 'hard'
    },
    {
      quiz: physicsWaves._id,
      subject: physicsWaves.subject,
      text: 'The uncertainty principle states that:',
      options: ['Δx⋅Δp ≥ ℏ/2', 'Δx⋅Δp = ℏ', 'Δx⋅Δp ≤ ℏ/2', 'Δx⋅Δp = 0'],
      correctIndex: 0,
      explanation: 'Heisenberg\'s uncertainty principle: Δx⋅Δp ≥ ℏ/2, where ℏ = h/2π.',
      difficulty: 'hard'
    },
    {
      quiz: physicsWaves._id,
      subject: physicsWaves.subject,
      text: 'X-rays are produced when:',
      options: ['High-energy electrons strike a metal target', 'Light undergoes diffraction', 'Atoms emit visible light', 'Sound waves interfere'],
      correctIndex: 0,
      explanation: 'X-rays are produced when high-energy electrons decelerate upon striking a metal target (bremsstrahlung).',
      difficulty: 'hard'
    },
    {
      quiz: physicsWaves._id,
      subject: physicsWaves.subject,
      text: 'The binding energy of an electron in hydrogen ground state is:',
      options: ['13.6 eV', '1.36 eV', '136 eV', '0.136 eV'],
      correctIndex: 0,
      explanation: 'The binding energy of electron in hydrogen ground state is 13.6 eV (Rydberg constant).',
      difficulty: 'hard'
    },
    {
      quiz: physicsWaves._id,
      subject: physicsWaves.subject,
      text: 'Compton scattering demonstrates:',
      options: ['Particle nature of light', 'Wave nature of light', 'Interference of light', 'Polarization of light'],
      correctIndex: 0,
      explanation: 'Compton scattering shows the particle nature of electromagnetic radiation (photons).',
      difficulty: 'hard'
    },
    {
      quiz: physicsWaves._id,
      subject: physicsWaves.subject,
      text: 'The critical angle for total internal reflection depends on:',
      options: ['Refractive indices of the media', 'Wavelength of light only', 'Amplitude of wave', 'Frequency only'],
      correctIndex: 0,
      explanation: 'Critical angle θc = sin⁻¹(n₂/n₁) depends on refractive indices of both media.',
      difficulty: 'hard'
    }
  ]);

  // MATHEMATICS QUESTIONS
  // Algebra & Basic Functions (Easy) - Quiz 3
  const mathAlgebra = quizzes[3];
  questions.push(...[
    {
      quiz: mathAlgebra._id,
      subject: mathAlgebra.subject,
      text: 'What is the value of x if 2x + 5 = 15?',
      options: ['5', '10', '7.5', '20'],
      correctIndex: 0,
      explanation: '2x + 5 = 15 → 2x = 10 → x = 5',
      difficulty: 'easy'
    },
    {
      quiz: mathAlgebra._id,
      subject: mathAlgebra.subject,
      text: 'The domain of f(x) = 1/(x-2) is:',
      options: ['All real numbers except x = 2', 'All real numbers', 'x ≥ 2', 'x ≤ 2'],
      correctIndex: 0,
      explanation: 'The function is undefined when denominator = 0, i.e., when x = 2.',
      difficulty: 'easy'
    },
    {
      quiz: mathAlgebra._id,
      subject: mathAlgebra.subject,
      text: 'What is the slope of the line passing through points (1,2) and (3,6)?',
      options: ['2', '1', '3', '4'],
      correctIndex: 0,
      explanation: 'Slope = (y₂-y₁)/(x₂-x₁) = (6-2)/(3-1) = 4/2 = 2',
      difficulty: 'easy'
    },
    {
      quiz: mathAlgebra._id,
      subject: mathAlgebra.subject,
      text: 'If f(x) = x² + 3x, what is f(2)?',
      options: ['10', '8', '6', '4'],
      correctIndex: 0,
      explanation: 'f(2) = (2)² + 3(2) = 4 + 6 = 10',
      difficulty: 'easy'
    },
    {
      quiz: mathAlgebra._id,
      subject: mathAlgebra.subject,
      text: 'The roots of x² - 5x + 6 = 0 are:',
      options: ['2 and 3', '1 and 6', '-2 and -3', '5 and 6'],
      correctIndex: 0,
      explanation: 'Factoring: (x-2)(x-3) = 0, so x = 2 or x = 3',
      difficulty: 'easy'
    },
    {
      quiz: mathAlgebra._id,
      subject: mathAlgebra.subject,
      text: 'What is the y-intercept of the line y = 2x + 7?',
      options: ['7', '2', '-7', '0'],
      correctIndex: 0,
      explanation: 'y-intercept occurs when x = 0: y = 2(0) + 7 = 7',
      difficulty: 'easy'
    },
    {
      quiz: mathAlgebra._id,
      subject: mathAlgebra.subject,
      text: 'Which of the following is a quadratic function?',
      options: ['f(x) = x² + 2x + 1', 'f(x) = x³ + 2', 'f(x) = 2x + 5', 'f(x) = 1/x'],
      correctIndex: 0,
      explanation: 'A quadratic function has the highest power of x as 2.',
      difficulty: 'easy'
    },
    {
      quiz: mathAlgebra._id,
      subject: mathAlgebra.subject,
      text: 'The vertex of the parabola y = x² - 4x + 3 is at:',
      options: ['(2, -1)', '(4, 3)', '(-2, 15)', '(0, 3)'],
      correctIndex: 0,
      explanation: 'For y = ax² + bx + c, vertex x-coordinate = -b/(2a) = -(-4)/(2×1) = 2. y = 4 - 8 + 3 = -1',
      difficulty: 'easy'
    }
  ]);

  // Calculus Applications (Medium) - Quiz 4
  const mathCalculus = quizzes[4];
  questions.push(...[
    {
      quiz: mathCalculus._id,
      subject: mathCalculus.subject,
      text: 'What is the limit of (sin x)/x as x approaches 0?',
      options: ['1', '0', '∞', 'Does not exist'],
      correctIndex: 0,
      explanation: 'This is a standard limit: lim(x→0) (sin x)/x = 1',
      difficulty: 'medium'
    },
    {
      quiz: mathCalculus._id,
      subject: mathCalculus.subject,
      text: 'The derivative of x³ is:',
      options: ['3x²', '3x', 'x²', 'x³/3'],
      correctIndex: 0,
      explanation: 'd/dx(x³) = 3x² using the power rule: d/dx(xⁿ) = nxⁿ⁻¹',
      difficulty: 'medium'
    },
    {
      quiz: mathCalculus._id,
      subject: mathCalculus.subject,
      text: 'Find the derivative of ln(x):',
      options: ['1/x', 'x', 'ln(x)', 'e^x'],
      correctIndex: 0,
      explanation: 'd/dx[ln(x)] = 1/x is a standard derivative formula.',
      difficulty: 'medium'
    },
    {
      quiz: mathCalculus._id,
      subject: mathCalculus.subject,
      text: 'The integral of 2x dx is:',
      options: ['x² + C', '2x² + C', 'x²/2 + C', '2 + C'],
      correctIndex: 0,
      explanation: '∫2x dx = 2∫x dx = 2(x²/2) + C = x² + C',
      difficulty: 'medium'
    },
    {
      quiz: mathCalculus._id,
      subject: mathCalculus.subject,
      text: 'At which point does f(x) = x² - 4x + 3 have a minimum?',
      options: ['x = 2', 'x = 0', 'x = 4', 'x = -2'],
      correctIndex: 0,
      explanation: 'f\'(x) = 2x - 4 = 0 gives x = 2. f\'\'(x) = 2 > 0, so x = 2 is a minimum.',
      difficulty: 'medium'
    },
    {
      quiz: mathCalculus._id,
      subject: mathCalculus.subject,
      text: 'The area under y = x from x = 0 to x = 2 is:',
      options: ['2', '4', '1', '8'],
      correctIndex: 0,
      explanation: 'Area = ∫₀² x dx = [x²/2]₀² = 4/2 - 0 = 2',
      difficulty: 'medium'
    },
    {
      quiz: mathCalculus._id,
      subject: mathCalculus.subject,
      text: 'The derivative of e^x is:',
      options: ['e^x', 'xe^(x-1)', '1', 'ln(x)'],
      correctIndex: 0,
      explanation: 'The exponential function e^x is its own derivative: d/dx[e^x] = e^x',
      difficulty: 'medium'
    },
    {
      quiz: mathCalculus._id,
      subject: mathCalculus.subject,
      text: 'Using the product rule, find the derivative of x²⋅sin(x):',
      options: ['2x⋅sin(x) + x²⋅cos(x)', 'x²⋅cos(x)', '2x⋅cos(x)', 'sin(x) + cos(x)'],
      correctIndex: 0,
      explanation: 'Product rule: (uv)\' = u\'v + uv\'. Here: (x²)\' = 2x, (sin x)\' = cos x',
      difficulty: 'medium'
    },
    {
      quiz: mathCalculus._id,
      subject: mathCalculus.subject,
      text: 'The second derivative of x⁴ is:',
      options: ['12x²', '4x³', '24x', '4x²'],
      correctIndex: 0,
      explanation: 'f(x) = x⁴, f\'(x) = 4x³, f\'\'(x) = 12x²',
      difficulty: 'medium'
    },
    {
      quiz: mathCalculus._id,
      subject: mathCalculus.subject,
      text: 'The critical points of f(x) = x³ - 3x occur at:',
      options: ['x = ±1', 'x = ±3', 'x = 0, 3', 'x = 1, -3'],
      correctIndex: 0,
      explanation: 'f\'(x) = 3x² - 3 = 0 gives 3(x² - 1) = 0, so x = ±1',
      difficulty: 'medium'
    }
  ]);

  // Advanced Integration (Hard) - Quiz 5
  const mathAdvanced = quizzes[5];
  questions.push(...[
    {
      quiz: mathAdvanced._id,
      subject: mathAdvanced.subject,
      text: 'The integral ∫x⋅e^x dx using integration by parts is:',
      options: ['(x-1)e^x + C', 'xe^x + C', 'e^x + C', 'x²e^x/2 + C'],
      correctIndex: 0,
      explanation: 'Using integration by parts: u=x, dv=e^x dx. Result: xe^x - ∫e^x dx = xe^x - e^x + C = (x-1)e^x + C',
      difficulty: 'hard'
    },
    {
      quiz: mathAdvanced._id,
      subject: mathAdvanced.subject,
      text: 'The solution to dy/dx = y is:',
      options: ['y = Ce^x', 'y = Cx', 'y = C/x', 'y = C⋅ln(x)'],
      correctIndex: 0,
      explanation: 'This is separable: dy/y = dx. Integrating: ln|y| = x + C₁, so y = Ce^x',
      difficulty: 'hard'
    },
    {
      quiz: mathAdvanced._id,
      subject: mathAdvanced.subject,
      text: 'Using partial fractions, ∫(1/(x²-1)) dx equals:',
      options: ['(1/2)ln|(x-1)/(x+1)| + C', 'ln|x²-1| + C', 'ln|x-1| - ln|x+1| + C', 'x/(x²-1) + C'],
      correctIndex: 0,
      explanation: '1/(x²-1) = 1/((x-1)(x+1)) = (1/2)[1/(x-1) - 1/(x+1)] by partial fractions',
      difficulty: 'hard'
    },
    {
      quiz: mathAdvanced._id,
      subject: mathAdvanced.subject,
      text: 'The Laplace transform of sin(at) is:',
      options: ['a/(s²+a²)', 's/(s²+a²)', '1/(s²+a²)', 'a²/(s²+a²)'],
      correctIndex: 0,
      explanation: 'L{sin(at)} = a/(s²+a²) is a standard Laplace transform formula.',
      difficulty: 'hard'
    },
    {
      quiz: mathAdvanced._id,
      subject: mathAdvanced.subject,
      text: 'The particular solution of y\'\' + 4y = 8 is:',
      options: ['y_p = 2', 'y_p = 2x', 'y_p = 8', 'y_p = 4'],
      correctIndex: 0,
      explanation: 'For constant RHS, try y_p = A. Substituting: 0 + 4A = 8, so A = 2.',
      difficulty: 'hard'
    },
    {
      quiz: mathAdvanced._id,
      subject: mathAdvanced.subject,
      text: 'The integral ∫₀^∞ e^(-x²) dx equals:',
      options: ['√π/2', '√π', 'π/2', '1'],
      correctIndex: 0,
      explanation: 'This is the Gaussian integral: ∫₋∞^∞ e^(-x²) dx = √π, so ∫₀^∞ e^(-x²) dx = √π/2',
      difficulty: 'hard'
    },
    {
      quiz: mathAdvanced._id,
      subject: mathAdvanced.subject,
      text: 'The Fourier series coefficient a₀ for f(x) = x on [-π,π] is:',
      options: ['0', 'π', '2π', '1'],
      correctIndex: 0,
      explanation: 'a₀ = (1/π)∫₋π^π x dx = 0 because x is an odd function on symmetric interval.',
      difficulty: 'hard'
    },
    {
      quiz: mathAdvanced._id,
      subject: mathAdvanced.subject,
      text: 'The general solution of y\'\' - 3y\' + 2y = 0 is:',
      options: ['y = C₁e^x + C₂e^(2x)', 'y = C₁e^(-x) + C₂e^(-2x)', 'y = C₁ + C₂e^x', 'y = C₁x + C₂e^x'],
      correctIndex: 0,
      explanation: 'Characteristic equation: r² - 3r + 2 = 0 gives r = 1, 2. So y = C₁e^x + C₂e^(2x)',
      difficulty: 'hard'
    },
    {
      quiz: mathAdvanced._id,
      subject: mathAdvanced.subject,
      text: 'The radius of convergence of ∑(xⁿ/n!) is:',
      options: ['∞', '1', '0', 'e'],
      correctIndex: 0,
      explanation: 'Using ratio test: lim(aₙ₊₁/aₙ) = lim(1/(n+1)) = 0, so R = ∞. This is the series for e^x.',
      difficulty: 'hard'
    },
    {
      quiz: mathAdvanced._id,
      subject: mathAdvanced.subject,
      text: 'The improper integral ∫₁^∞ (1/x²) dx equals:',
      options: ['1', '∞', '0', '2'],
      correctIndex: 0,
      explanation: '∫₁^∞ (1/x²) dx = lim[t→∞] [-1/x]₁^t = lim[t→∞] (-1/t + 1) = 1',
      difficulty: 'hard'
    }
  ]);

  // Continue with other subjects... (I'll add a few more to demonstrate the pattern)

  // CHEMISTRY QUESTIONS
  // Atomic Structure & Periodic Table (Easy) - Quiz 6
  const chemAtomic = quizzes[6];
  questions.push(...[
    {
      quiz: chemAtomic._id,
      subject: chemAtomic.subject,
      text: 'What is the atomic number of carbon?',
      options: ['6', '12', '14', '8'],
      correctIndex: 0,
      explanation: 'Carbon has atomic number 6, meaning it has 6 protons in its nucleus.',
      difficulty: 'easy'
    },
    {
      quiz: chemAtomic._id,
      subject: chemAtomic.subject,
      text: 'Which of the following has the largest atomic radius?',
      options: ['Na', 'Mg', 'Al', 'Si'],
      correctIndex: 0,
      explanation: 'Atomic radius decreases across a period. Na (sodium) is leftmost, so it has the largest radius.',
      difficulty: 'easy'
    },
    {
      quiz: chemAtomic._id,
      subject: chemAtomic.subject,
      text: 'The electronic configuration of oxygen (O, Z=8) is:',
      options: ['1s² 2s² 2p⁴', '1s² 2s² 2p⁶', '1s² 2s⁴', '2s² 2p⁶'],
      correctIndex: 0,
      explanation: 'Oxygen has 8 electrons: 2 in 1s, 2 in 2s, and 4 in 2p orbitals.',
      difficulty: 'easy'
    },
    {
      quiz: chemAtomic._id,
      subject: chemAtomic.subject,
      text: 'Which group in the periodic table contains noble gases?',
      options: ['Group 18', 'Group 1', 'Group 17', 'Group 2'],
      correctIndex: 0,
      explanation: 'Group 18 (or VIIIA) contains noble gases like He, Ne, Ar, Kr, Xe, Rn.',
      difficulty: 'easy'
    },
    {
      quiz: chemAtomic._id,
      subject: chemAtomic.subject,
      text: 'What is the maximum number of electrons in the 2p subshell?',
      options: ['6', '2', '10', '14'],
      correctIndex: 0,
      explanation: 'p subshell has 3 orbitals, each holding maximum 2 electrons, so 3×2 = 6 electrons maximum.',
      difficulty: 'easy'
    },
    {
      quiz: chemAtomic._id,
      subject: chemAtomic.subject,
      text: 'Which element has the highest electronegativity?',
      options: ['Fluorine', 'Oxygen', 'Nitrogen', 'Chlorine'],
      correctIndex: 0,
      explanation: 'Fluorine has the highest electronegativity (4.0 on Pauling scale) among all elements.',
      difficulty: 'easy'
    },
    {
      quiz: chemAtomic._id,
      subject: chemAtomic.subject,
      text: 'Isotopes have the same:',
      options: ['Number of protons', 'Mass number', 'Number of neutrons', 'Atomic mass'],
      correctIndex: 0,
      explanation: 'Isotopes are atoms with same number of protons but different numbers of neutrons.',
      difficulty: 'easy'
    },
    {
      quiz: chemAtomic._id,
      subject: chemAtomic.subject,
      text: 'The first ionization energy generally:',
      options: ['Increases across a period', 'Decreases across a period', 'Remains constant', 'Varies randomly'],
      correctIndex: 0,
      explanation: 'Ionization energy increases across a period due to increasing nuclear charge.',
      difficulty: 'easy'
    }
  ]);

  // BIOLOGY QUESTIONS
  // Cell Biology Basics (Easy) - Quiz 9
  const bioCells = quizzes[9];
  questions.push(...[
    {
      quiz: bioCells._id,
      subject: bioCells.subject,
      text: 'Which organelle is known as the powerhouse of the cell?',
      options: ['Mitochondria', 'Nucleus', 'Ribosome', 'Golgi apparatus'],
      correctIndex: 0,
      explanation: 'Mitochondria produce ATP through cellular respiration, earning the name "powerhouse of the cell".',
      difficulty: 'easy'
    },
    {
      quiz: bioCells._id,
      subject: bioCells.subject,
      text: 'What is the basic unit of life?',
      options: ['Cell', 'Tissue', 'Organ', 'Molecule'],
      correctIndex: 0,
      explanation: 'The cell is the smallest structural and functional unit of all living organisms.',
      difficulty: 'easy'
    },
    {
      quiz: bioCells._id,
      subject: bioCells.subject,
      text: 'Which of the following is found only in plant cells?',
      options: ['Cell wall', 'Cell membrane', 'Nucleus', 'Mitochondria'],
      correctIndex: 0,
      explanation: 'Cell wall made of cellulose is unique to plant cells, providing structural support.',
      difficulty: 'easy'
    },
    {
      quiz: bioCells._id,
      subject: bioCells.subject,
      text: 'DNA is primarily located in the:',
      options: ['Nucleus', 'Cytoplasm', 'Cell membrane', 'Vacuole'],
      correctIndex: 0,
      explanation: 'DNA is mainly found in the nucleus, though small amounts exist in mitochondria and chloroplasts.',
      difficulty: 'easy'
    },
    {
      quiz: bioCells._id,
      subject: bioCells.subject,
      text: 'The process by which water moves across a semi-permeable membrane is:',
      options: ['Osmosis', 'Diffusion', 'Active transport', 'Endocytosis'],
      correctIndex: 0,
      explanation: 'Osmosis is the movement of water across a semi-permeable membrane from low to high solute concentration.',
      difficulty: 'easy'
    },
    {
      quiz: bioCells._id,
      subject: bioCells.subject,
      text: 'Ribosomes are responsible for:',
      options: ['Protein synthesis', 'DNA replication', 'Photosynthesis', 'Cell division'],
      correctIndex: 0,
      explanation: 'Ribosomes are the sites of protein synthesis, translating mRNA into proteins.',
      difficulty: 'easy'
    },
    {
      quiz: bioCells._id,
      subject: bioCells.subject,
      text: 'Which type of cell lacks a membrane-bound nucleus?',
      options: ['Prokaryotic cell', 'Eukaryotic cell', 'Plant cell', 'Animal cell'],
      correctIndex: 0,
      explanation: 'Prokaryotic cells (bacteria and archaea) lack a membrane-bound nucleus.',
      difficulty: 'easy'
    },
    {
      quiz: bioCells._id,
      subject: bioCells.subject,
      text: 'Photosynthesis primarily occurs in:',
      options: ['Chloroplasts', 'Mitochondria', 'Nucleus', 'Vacuoles'],
      correctIndex: 0,
      explanation: 'Chloroplasts contain chlorophyll and are the site of photosynthesis in plant cells.',
      difficulty: 'easy'
    }
  ]);

  // COMPUTER SCIENCE QUESTIONS
  // Programming Fundamentals (Easy) - Quiz 12
  const csProgramming = quizzes[12];
  questions.push(...[
    {
      quiz: csProgramming._id,
      subject: csProgramming.subject,
      text: 'Which of the following is a programming language?',
      options: ['Python', 'HTML', 'CSS', 'JSON'],
      correctIndex: 0,
      explanation: 'Python is a programming language. HTML, CSS are markup languages, JSON is data format.',
      difficulty: 'easy'
    },
    {
      quiz: csProgramming._id,
      subject: csProgramming.subject,
      text: 'What does "IDE" stand for?',
      options: ['Integrated Development Environment', 'Internet Data Exchange', 'Internal Data Engine', 'Interactive Design Editor'],
      correctIndex: 0,
      explanation: 'IDE stands for Integrated Development Environment, a software application for coding.',
      difficulty: 'easy'
    },
    {
      quiz: csProgramming._id,
      subject: csProgramming.subject,
      text: 'Which data type is used to store whole numbers?',
      options: ['Integer', 'Float', 'String', 'Boolean'],
      correctIndex: 0,
      explanation: 'Integer data type stores whole numbers without decimal points.',
      difficulty: 'easy'
    },
    {
      quiz: csProgramming._id,
      subject: csProgramming.subject,
      text: 'What is the result of 10 % 3 in most programming languages?',
      options: ['1', '3', '10', '0'],
      correctIndex: 0,
      explanation: 'The modulo operator % returns the remainder of division. 10 ÷ 3 = 3 remainder 1.',
      difficulty: 'easy'
    },
    {
      quiz: csProgramming._id,
      subject: csProgramming.subject,
      text: 'Which of these is NOT a loop structure?',
      options: ['Switch', 'For', 'While', 'Do-while'],
      correctIndex: 0,
      explanation: 'Switch is a conditional statement, not a loop. For, while, and do-while are loop structures.',
      difficulty: 'easy'
    },
    {
      quiz: csProgramming._id,
      subject: csProgramming.subject,
      text: 'In most programming languages, arrays are indexed starting from:',
      options: ['0', '1', '-1', 'Any number'],
      correctIndex: 0,
      explanation: 'Most programming languages use zero-based indexing for arrays.',
      difficulty: 'easy'
    },
    {
      quiz: csProgramming._id,
      subject: csProgramming.subject,
      text: 'What does "debugging" mean in programming?',
      options: ['Finding and fixing errors', 'Writing new code', 'Testing performance', 'Adding comments'],
      correctIndex: 0,
      explanation: 'Debugging is the process of finding and fixing bugs (errors) in program code.',
      difficulty: 'easy'
    },
    {
      quiz: csProgramming._id,
      subject: csProgramming.subject,
      text: 'Which symbol is commonly used for comments in Python?',
      options: ['#', '//', '/* */', '<!--'],
      correctIndex: 0,
      explanation: 'Python uses # for single-line comments and """ """ for multi-line comments.',
      difficulty: 'easy'
    }
  ]);

  // HISTORY QUESTIONS
  // Ancient Civilizations (Easy) - Quiz 15
  const historyAncient = quizzes[15];
  questions.push(...[
    {
      quiz: historyAncient._id,
      subject: historyAncient.subject,
      text: 'Which river is associated with ancient Egyptian civilization?',
      options: ['Nile', 'Euphrates', 'Indus', 'Ganges'],
      correctIndex: 0,
      explanation: 'The Nile River was the lifeline of ancient Egyptian civilization, providing water and fertile soil.',
      difficulty: 'easy'
    },
    {
      quiz: historyAncient._id,
      subject: historyAncient.subject,
      text: 'The ancient city of Babylon was located in:',
      options: ['Mesopotamia', 'Egypt', 'India', 'China'],
      correctIndex: 0,
      explanation: 'Babylon was located in Mesopotamia, between the Tigris and Euphrates rivers (modern-day Iraq).',
      difficulty: 'easy'
    },
    {
      quiz: historyAncient._id,
      subject: historyAncient.subject,
      text: 'Who was the founder of the Mauryan Empire?',
      options: ['Chandragupta Maurya', 'Ashoka', 'Bindusara', 'Samudragupta'],
      correctIndex: 0,
      explanation: 'Chandragupta Maurya founded the Mauryan Empire in 321 BCE with help from Chanakya.',
      difficulty: 'easy'
    },
    {
      quiz: historyAncient._id,
      subject: historyAncient.subject,
      text: 'The Great Wall of China was primarily built during which dynasty?',
      options: ['Ming Dynasty', 'Han Dynasty', 'Tang Dynasty', 'Song Dynasty'],
      correctIndex: 0,
      explanation: 'While started earlier, most of the Great Wall as we know it was built during the Ming Dynasty.',
      difficulty: 'easy'
    },
    {
      quiz: historyAncient._id,
      subject: historyAncient.subject,
      text: 'Which ancient wonder was located in Alexandria?',
      options: ['Lighthouse of Alexandria', 'Hanging Gardens', 'Colossus of Rhodes', 'Temple of Artemis'],
      correctIndex: 0,
      explanation: 'The Lighthouse of Alexandria (Pharos) was one of the Seven Wonders of the Ancient World.',
      difficulty: 'easy'
    },
    {
      quiz: historyAncient._id,
      subject: historyAncient.subject,
      text: 'The Indus Valley Civilization is also known as:',
      options: ['Harappan Civilization', 'Vedic Civilization', 'Aryan Civilization', 'Dravidian Civilization'],
      correctIndex: 0,
      explanation: 'The Indus Valley Civilization is called Harappan Civilization after the first excavated site Harappa.',
      difficulty: 'easy'
    },
    {
      quiz: historyAncient._id,
      subject: historyAncient.subject,
      text: 'Ancient Olympic Games were held in honor of:',
      options: ['Zeus', 'Apollo', 'Athena', 'Poseidon'],
      correctIndex: 0,
      explanation: 'The ancient Olympic Games were held in Olympia to honor Zeus, king of the Greek gods.',
      difficulty: 'easy'
    },
    {
      quiz: historyAncient._id,
      subject: historyAncient.subject,
      text: 'The Code of Hammurabi was created in:',
      options: ['Babylon', 'Egypt', 'Greece', 'Rome'],
      correctIndex: 0,
      explanation: 'The Code of Hammurabi was created by King Hammurabi of Babylon around 1750 BCE.',
      difficulty: 'easy'
    }
  ]);

  // Add remaining questions for Chemistry, Biology, CS, and History to reach target numbers
  
  // Chemistry - Chemical Bonding & Reactions (Medium) - Quiz 7
  const chemBonding = quizzes[7];
  questions.push(...[
    {
      quiz: chemBonding._id,
      subject: chemBonding.subject,
      text: 'Which type of bond forms between Na and Cl in NaCl?',
      options: ['Ionic bond', 'Covalent bond', 'Metallic bond', 'Hydrogen bond'],
      correctIndex: 0,
      explanation: 'NaCl forms through ionic bonding: Na loses an electron to become Na⁺, Cl gains it to become Cl⁻.',
      difficulty: 'medium'
    },
    {
      quiz: chemBonding._id,
      subject: chemBonding.subject,
      text: 'The molecular geometry of NH₃ is:',
      options: ['Trigonal pyramidal', 'Tetrahedral', 'Trigonal planar', 'Linear'],
      correctIndex: 0,
      explanation: 'NH₃ has a trigonal pyramidal shape due to the lone pair on nitrogen affecting the geometry.',
      difficulty: 'medium'
    },
    {
      quiz: chemBonding._id,
      subject: chemBonding.subject,
      text: 'Which molecule has the highest boiling point?',
      options: ['HF', 'HCl', 'HBr', 'HI'],
      correctIndex: 0,
      explanation: 'HF has the highest boiling point due to strong hydrogen bonding between HF molecules.',
      difficulty: 'medium'
    },
    {
      quiz: chemBonding._id,
      subject: chemBonding.subject,
      text: 'In the reaction 2H₂ + O₂ → 2H₂O, what type of reaction is this?',
      options: ['Synthesis', 'Decomposition', 'Single displacement', 'Double displacement'],
      correctIndex: 0,
      explanation: 'This is a synthesis reaction where simpler substances combine to form a more complex compound.',
      difficulty: 'medium'
    },
    {
      quiz: chemBonding._id,
      subject: chemBonding.subject,
      text: 'The oxidation state of sulfur in H₂SO₄ is:',
      options: ['+6', '+4', '+2', '-2'],
      correctIndex: 0,
      explanation: 'In H₂SO₄: H is +1, O is -2. For the molecule to be neutral: 2(+1) + S + 4(-2) = 0, so S = +6.',
      difficulty: 'medium'
    },
    {
      quiz: chemBonding._id,
      subject: chemBonding.subject,
      text: 'Which of the following exhibits resonance?',
      options: ['SO₂', 'CH₄', 'NH₃', 'H₂O'],
      correctIndex: 0,
      explanation: 'SO₂ exhibits resonance with multiple valid Lewis structures due to delocalized electrons.',
      difficulty: 'medium'
    },
    {
      quiz: chemBonding._id,
      subject: chemBonding.subject,
      text: 'The hybridization of carbon in methane (CH₄) is:',
      options: ['sp³', 'sp²', 'sp', 'sp³d'],
      correctIndex: 0,
      explanation: 'Carbon in methane undergoes sp³ hybridization to form four equivalent C-H bonds.',
      difficulty: 'medium'
    },
    {
      quiz: chemBonding._id,
      subject: chemBonding.subject,
      text: 'Which intermolecular force is strongest?',
      options: ['Hydrogen bonding', 'Dipole-dipole', 'London dispersion', 'Ion-dipole'],
      correctIndex: 0,
      explanation: 'Among intermolecular forces, hydrogen bonding is generally the strongest.',
      difficulty: 'medium'
    },
    {
      quiz: chemBonding._id,
      subject: chemBonding.subject,
      text: 'The rate of a chemical reaction is affected by:',
      options: ['Temperature, concentration, catalyst', 'Only temperature', 'Only concentration', 'Only pressure'],
      correctIndex: 0,
      explanation: 'Reaction rate depends on temperature, concentration of reactants, presence of catalysts, and surface area.',
      difficulty: 'medium'
    },
    {
      quiz: chemBonding._id,
      subject: chemBonding.subject,
      text: 'Which compound has polar covalent bonds but is nonpolar overall?',
      options: ['CO₂', 'H₂O', 'NH₃', 'HCl'],
      correctIndex: 0,
      explanation: 'CO₂ has polar C=O bonds, but the linear geometry makes the molecule nonpolar overall.',
      difficulty: 'medium'
    }
  ]);

  // Biology - Genetics & Heredity (Medium) - Quiz 10
  const bioGenetics = quizzes[10];
  questions.push(...[
    {
      quiz: bioGenetics._id,
      subject: bioGenetics.subject,
      text: 'What is the basic unit of heredity?',
      options: ['Gene', 'Chromosome', 'DNA', 'Allele'],
      correctIndex: 0,
      explanation: 'A gene is the basic unit of heredity, containing instructions for specific traits.',
      difficulty: 'medium'
    },
    {
      quiz: bioGenetics._id,
      subject: bioGenetics.subject,
      text: 'In Mendel\'s experiments, the F1 generation showed:',
      options: ['Only dominant traits', 'Only recessive traits', 'Mixed traits', 'No specific pattern'],
      correctIndex: 0,
      explanation: 'The F1 generation from purebred parents showed only dominant traits, with recessive traits hidden.',
      difficulty: 'medium'
    },
    {
      quiz: bioGenetics._id,
      subject: bioGenetics.subject,
      text: 'The process of making RNA from DNA is called:',
      options: ['Transcription', 'Translation', 'Replication', 'Transformation'],
      correctIndex: 0,
      explanation: 'Transcription is the process where RNA is synthesized using DNA as a template.',
      difficulty: 'medium'
    },
    {
      quiz: bioGenetics._id,
      subject: bioGenetics.subject,
      text: 'How many chromosomes does a normal human have?',
      options: ['46', '23', '48', '44'],
      correctIndex: 0,
      explanation: 'Humans have 46 chromosomes (23 pairs) in each diploid cell.',
      difficulty: 'medium'
    },
    {
      quiz: bioGenetics._id,
      subject: bioGenetics.subject,
      text: 'A cross between Aa × Aa will produce offspring in the ratio:',
      options: ['1:2:1 (AA:Aa:aa)', '3:1', '1:1', '1:3'],
      correctIndex: 0,
      explanation: 'A monohybrid cross Aa × Aa produces genotype ratio 1 AA : 2 Aa : 1 aa.',
      difficulty: 'medium'
    },
    {
      quiz: bioGenetics._id,
      subject: bioGenetics.subject,
      text: 'Which nitrogenous base is found in RNA but not in DNA?',
      options: ['Uracil', 'Thymine', 'Adenine', 'Guanine'],
      correctIndex: 0,
      explanation: 'RNA contains uracil instead of thymine. DNA has A, T, G, C while RNA has A, U, G, C.',
      difficulty: 'medium'
    },
    {
      quiz: bioGenetics._id,
      subject: bioGenetics.subject,
      text: 'The genetic code is said to be:',
      options: ['Triplet and universal', 'Doublet and specific', 'Quartet and variable', 'Single and unique'],
      correctIndex: 0,
      explanation: 'The genetic code consists of triplets (codons) and is nearly universal across all life forms.',
      difficulty: 'medium'
    },
    {
      quiz: bioGenetics._id,
      subject: bioGenetics.subject,
      text: 'Mutations in which type of cells can be passed to offspring?',
      options: ['Germ cells', 'Somatic cells', 'Nerve cells', 'Muscle cells'],
      correctIndex: 0,
      explanation: 'Only mutations in germ cells (gametes) can be inherited by offspring.',
      difficulty: 'medium'
    },
    {
      quiz: bioGenetics._id,
      subject: bioGenetics.subject,
      text: 'The process of making proteins from RNA is called:',
      options: ['Translation', 'Transcription', 'Replication', 'Translocation'],
      correctIndex: 0,
      explanation: 'Translation is the process where proteins are synthesized using mRNA as a template.',
      difficulty: 'medium'
    },
    {
      quiz: bioGenetics._id,
      subject: bioGenetics.subject,
      text: 'Sickle cell anemia is caused by:',
      options: ['Point mutation', 'Chromosomal deletion', 'Gene duplication', 'Chromosomal inversion'],
      correctIndex: 0,
      explanation: 'Sickle cell anemia results from a point mutation in the β-globin gene.',
      difficulty: 'medium'
    }
  ]);

  // Computer Science - Data Structures & Algorithms (Medium) - Quiz 13
  const csDataStructures = quizzes[13];
  questions.push(...[
    {
      quiz: csDataStructures._id,
      subject: csDataStructures.subject,
      text: 'What is the time complexity of binary search?',
      options: ['O(log n)', 'O(n)', 'O(n²)', 'O(1)'],
      correctIndex: 0,
      explanation: 'Binary search has O(log n) time complexity as it eliminates half the search space each step.',
      difficulty: 'medium'
    },
    {
      quiz: csDataStructures._id,
      subject: csDataStructures.subject,
      text: 'In a stack, elements are added and removed from:',
      options: ['Top only', 'Bottom only', 'Both ends', 'Any position'],
      correctIndex: 0,
      explanation: 'Stack follows LIFO (Last In, First Out) principle - elements added/removed from top only.',
      difficulty: 'medium'
    },
    {
      quiz: csDataStructures._id,
      subject: csDataStructures.subject,
      text: 'Which data structure is best for implementing recursion?',
      options: ['Stack', 'Queue', 'Array', 'Linked List'],
      correctIndex: 0,
      explanation: 'Stack is used to implement recursion, storing function calls and local variables.',
      difficulty: 'medium'
    },
    {
      quiz: csDataStructures._id,
      subject: csDataStructures.subject,
      text: 'What is the worst-case time complexity of QuickSort?',
      options: ['O(n²)', 'O(n log n)', 'O(n)', 'O(log n)'],
      correctIndex: 0,
      explanation: 'QuickSort has O(n²) worst-case complexity when pivot is always the smallest/largest element.',
      difficulty: 'medium'
    },
    {
      quiz: csDataStructures._id,
      subject: csDataStructures.subject,
      text: 'In a binary search tree, the left child is:',
      options: ['Smaller than parent', 'Greater than parent', 'Equal to parent', 'Unrelated to parent'],
      correctIndex: 0,
      explanation: 'In BST, left child is always smaller than parent, right child is greater.',
      difficulty: 'medium'
    },
    {
      quiz: csDataStructures._id,
      subject: csDataStructures.subject,
      text: 'Hash tables provide average-case search time of:',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
      correctIndex: 0,
      explanation: 'Hash tables provide O(1) average-case search, insert, and delete operations.',
      difficulty: 'medium'
    },
    {
      quiz: csDataStructures._id,
      subject: csDataStructures.subject,
      text: 'Which traversal visits nodes level by level?',
      options: ['Breadth-first', 'Depth-first', 'Inorder', 'Preorder'],
      correctIndex: 0,
      explanation: 'Breadth-first traversal (BFS) visits nodes level by level using a queue.',
      difficulty: 'medium'
    },
    {
      quiz: csDataStructures._id,
      subject: csDataStructures.subject,
      text: 'The space complexity of merge sort is:',
      options: ['O(n)', 'O(1)', 'O(log n)', 'O(n²)'],
      correctIndex: 0,
      explanation: 'Merge sort requires O(n) extra space for the temporary arrays used in merging.',
      difficulty: 'medium'
    },
    {
      quiz: csDataStructures._id,
      subject: csDataStructures.subject,
      text: 'Which data structure uses FIFO principle?',
      options: ['Queue', 'Stack', 'Tree', 'Graph'],
      correctIndex: 0,
      explanation: 'Queue follows FIFO (First In, First Out) principle - first element added is first removed.',
      difficulty: 'medium'
    },
    {
      quiz: csDataStructures._id,
      subject: csDataStructures.subject,
      text: 'Dynamic programming optimizes by:',
      options: ['Storing subproblem solutions', 'Using less memory', 'Faster algorithms', 'Parallel processing'],
      correctIndex: 0,
      explanation: 'Dynamic programming optimizes by storing solutions to subproblems to avoid recomputation.',
      difficulty: 'medium'
    }
  ]);

  // History - World Wars & Modern History (Medium) - Quiz 16
  const historyModern = quizzes[16];
  questions.push(...[
    {
      quiz: historyModern._id,
      subject: historyModern.subject,
      text: 'World War I began in which year?',
      options: ['1914', '1916', '1912', '1918'],
      correctIndex: 0,
      explanation: 'World War I began in 1914, triggered by the assassination of Archduke Franz Ferdinand.',
      difficulty: 'medium'
    },
    {
      quiz: historyModern._id,
      subject: historyModern.subject,
      text: 'The Treaty of Versailles was signed in:',
      options: ['1919', '1918', '1920', '1917'],
      correctIndex: 0,
      explanation: 'The Treaty of Versailles was signed on June 28, 1919, ending WWI between Germany and Allies.',
      difficulty: 'medium'
    },
    {
      quiz: historyModern._id,
      subject: historyModern.subject,
      text: 'Which event is considered the start of World War II?',
      options: ['German invasion of Poland', 'Pearl Harbor attack', 'Battle of Britain', 'D-Day landings'],
      correctIndex: 0,
      explanation: 'WWII began on September 1, 1939, when Germany invaded Poland.',
      difficulty: 'medium'
    },
    {
      quiz: historyModern._id,
      subject: historyModern.subject,
      text: 'The Russian Revolution occurred in:',
      options: ['1917', '1914', '1920', '1919'],
      correctIndex: 0,
      explanation: 'The Russian Revolution of 1917 led to the overthrow of the Tsarist regime and rise of Bolsheviks.',
      difficulty: 'medium'
    },
    {
      quiz: historyModern._id,
      subject: historyModern.subject,
      text: 'Who was the leader of Nazi Germany?',
      options: ['Adolf Hitler', 'Heinrich Himmler', 'Joseph Goebbels', 'Hermann Göring'],
      correctIndex: 0,
      explanation: 'Adolf Hitler was the Führer (leader) of Nazi Germany from 1933 to 1945.',
      difficulty: 'medium'
    },
    {
      quiz: historyModern._id,
      subject: historyModern.subject,
      text: 'The Cold War was primarily between:',
      options: ['USA and USSR', 'Germany and Britain', 'Japan and China', 'France and Italy'],
      correctIndex: 0,
      explanation: 'The Cold War (1947-1991) was the geopolitical tension between USA and USSR.',
      difficulty: 'medium'
    },
    {
      quiz: historyModern._id,
      subject: historyModern.subject,
      text: 'Which battle is considered the turning point of WWII in Europe?',
      options: ['Stalingrad', 'Normandy', 'Berlin', 'Kursk'],
      correctIndex: 0,
      explanation: 'The Battle of Stalingrad (1942-43) marked the beginning of German retreat on the Eastern Front.',
      difficulty: 'medium'
    },
    {
      quiz: historyModern._id,
      subject: historyModern.subject,
      text: 'The United Nations was established in:',
      options: ['1945', '1944', '1946', '1947'],
      correctIndex: 0,
      explanation: 'The United Nations was established on October 24, 1945, after WWII.',
      difficulty: 'medium'
    },
    {
      quiz: historyModern._id,
      subject: historyModern.subject,
      text: 'The Berlin Wall fell in:',
      options: ['1989', '1987', '1991', '1985'],
      correctIndex: 0,
      explanation: 'The Berlin Wall fell on November 9, 1989, symbolizing the end of the Cold War.',
      difficulty: 'medium'
    },
    {
      quiz: historyModern._id,
      subject: historyModern.subject,
      text: 'The Marshall Plan was designed to:',
      options: ['Rebuild Europe after WWII', 'Defeat Nazi Germany', 'Establish NATO', 'Create the UN'],
      correctIndex: 0,
      explanation: 'The Marshall Plan (1948) provided economic aid to rebuild Western Europe after WWII.',
      difficulty: 'medium'
    }
  ]);

  const insertedQuestions = await Question.insertMany(questions);
  console.log(`✅ Questions created: ${insertedQuestions.length}`);
  return insertedQuestions;
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