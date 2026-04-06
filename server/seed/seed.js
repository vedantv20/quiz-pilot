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
    },
    {
      name: 'Computer Science Fundamentals',
      slug: 'cs-fundamentals',
      description: 'Core Computer Science concepts for students',
      educationLevel: 'undergraduate',
      stream: 'computer_science',
      targetExams: ['GATE CS', 'University Exam', 'Campus Placement'],
      displayOrder: 4
    },
    {
      name: 'Software Engineering & Development',
      slug: 'software-engineering',
      description: 'Software development, engineering practices, and web technologies',
      educationLevel: 'professional',
      stream: 'software',
      targetExams: ['Placement Interview', 'Coding Interview', 'Professional Certification'],
      displayOrder: 5
    },
    {
      name: 'Interview Preparation',
      slug: 'interview-prep',
      description: 'Technical interview preparation for software roles',
      educationLevel: 'professional',
      stream: 'interview',
      targetExams: ['Coding Interview', 'Technical Interview', 'Campus Placement'],
      displayOrder: 6
    },
    {
      name: 'Advanced Computing',
      slug: 'advanced-computing',
      description: 'Advanced topics in machine learning, cloud computing, and cybersecurity',
      educationLevel: 'postgraduate',
      stream: 'advanced_cs',
      targetExams: ['Professional Certification', 'Industry Interview', 'Specialization'],
      displayOrder: 7
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
  const csFundamentalsCategory = categories.find(c => c.slug === 'cs-fundamentals');
  const softwareEngCategory = categories.find(c => c.slug === 'software-engineering');
  const interviewPrepCategory = categories.find(c => c.slug === 'interview-prep');
  const advancedComputingCategory = categories.find(c => c.slug === 'advanced-computing');
  
  const subjects = await Subject.insertMany([
    // Science Subjects
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
    {
      name: 'History',
      slug: 'history-12',
      icon: '📜',
      description: 'Class 12 History - Ancient, Medieval, Modern World History',
      examCategory: class12Category._id,
      educationLevels: ['class_12'],
      targetExams: ['Class 12 Exams', 'UPSC'],
      createdBy: adminUser._id
    },

    // Core Computer Science Subjects
    {
      name: 'Data Structures & Algorithms',
      slug: 'dsa',
      icon: '🔗',
      description: 'Arrays, Trees, Graphs, Sorting, Searching, Dynamic Programming',
      examCategory: csFundamentalsCategory._id,
      educationLevels: ['undergraduate', 'professional'],
      targetExams: ['GATE CS', 'Coding Interview', 'Campus Placement'],
      createdBy: adminUser._id
    },
    {
      name: 'Operating Systems',
      slug: 'operating-systems',
      icon: '💻',
      description: 'Process Management, Memory Management, File Systems, Synchronization',
      examCategory: csFundamentalsCategory._id,
      educationLevels: ['undergraduate', 'professional'],
      targetExams: ['GATE CS', 'Technical Interview', 'University Exam'],
      createdBy: adminUser._id
    },
    {
      name: 'Database Management Systems',
      slug: 'dbms',
      icon: '🗄️',
      description: 'SQL, Normalization, Transactions, Indexing, Query Optimization',
      examCategory: csFundamentalsCategory._id,
      educationLevels: ['undergraduate', 'professional'],
      targetExams: ['GATE CS', 'Technical Interview', 'Professional Certification'],
      createdBy: adminUser._id
    },
    {
      name: 'Computer Networks',
      slug: 'computer-networks',
      icon: '🌐',
      description: 'OSI Model, TCP/IP, Routing, Network Security, Protocols',
      examCategory: csFundamentalsCategory._id,
      educationLevels: ['undergraduate', 'professional'],
      targetExams: ['GATE CS', 'Technical Interview', 'Network Certification'],
      createdBy: adminUser._id
    },
    {
      name: 'Object-Oriented Programming',
      slug: 'oop',
      icon: '🧩',
      description: 'Classes, Objects, Inheritance, Polymorphism, Design Patterns',
      examCategory: csFundamentalsCategory._id,
      educationLevels: ['undergraduate', 'professional'],
      targetExams: ['University Exam', 'Coding Interview', 'Campus Placement'],
      createdBy: adminUser._id
    },

    // Software Engineering & Development
    {
      name: 'Web Development',
      slug: 'web-development',
      icon: '🌍',
      description: 'HTML, CSS, JavaScript, React, Node.js, Full Stack Development',
      examCategory: softwareEngCategory._id,
      educationLevels: ['professional', 'undergraduate'],
      targetExams: ['Technical Interview', 'Professional Certification', 'Freelance'],
      createdBy: adminUser._id
    },
    {
      name: 'Software Engineering',
      slug: 'software-engineering',
      icon: '⚙️',
      description: 'SDLC, Design Patterns, Testing, Agile, DevOps Principles',
      examCategory: softwareEngCategory._id,
      educationLevels: ['professional', 'postgraduate'],
      targetExams: ['Technical Interview', 'Professional Certification', 'Industry Interview'],
      createdBy: adminUser._id
    },

    // Advanced Computing
    {
      name: 'Cybersecurity Fundamentals',
      slug: 'cybersecurity',
      icon: '🔒',
      description: 'Security Principles, Cryptography, Network Security, Ethical Hacking',
      examCategory: advancedComputingCategory._id,
      educationLevels: ['professional', 'postgraduate'],
      targetExams: ['Security Certification', 'Ethical Hacking', 'Professional Certification'],
      createdBy: adminUser._id
    },
    {
      name: 'Machine Learning Basics',
      slug: 'machine-learning',
      icon: '🤖',
      description: 'Supervised Learning, Unsupervised Learning, Neural Networks, Python',
      examCategory: advancedComputingCategory._id,
      educationLevels: ['professional', 'postgraduate'],
      targetExams: ['Data Science Interview', 'ML Certification', 'Research'],
      createdBy: adminUser._id
    },
    {
      name: 'Cloud Computing',
      slug: 'cloud-computing',
      icon: '☁️',
      description: 'AWS, Azure, Google Cloud, Serverless, Containers, DevOps',
      examCategory: advancedComputingCategory._id,
      educationLevels: ['professional', 'postgraduate'],
      targetExams: ['Cloud Certification', 'DevOps Interview', 'Professional Certification'],
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
  const historySubject = subjects.find(s => s.slug === 'history-12');
  
  // CS Subjects
  const dsaSubject = subjects.find(s => s.slug === 'dsa');
  const osSubject = subjects.find(s => s.slug === 'operating-systems');
  const dbmsSubject = subjects.find(s => s.slug === 'dbms');
  const networksSubject = subjects.find(s => s.slug === 'computer-networks');
  const oopSubject = subjects.find(s => s.slug === 'oop');
  const webDevSubject = subjects.find(s => s.slug === 'web-development');
  const softwareEngSubject = subjects.find(s => s.slug === 'software-engineering');
  const cybersecuritySubject = subjects.find(s => s.slug === 'cybersecurity');
  const mlSubject = subjects.find(s => s.slug === 'machine-learning');
  const cloudSubject = subjects.find(s => s.slug === 'cloud-computing');

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
      timeLimit: calculateTimeLimit(8, 'easy'),
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
      timeLimit: calculateTimeLimit(10, 'medium'),
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
      timeLimit: calculateTimeLimit(10, 'hard'),
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
      timeLimit: calculateTimeLimit(8, 'easy'),
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
      timeLimit: calculateTimeLimit(10, 'medium'),
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
      timeLimit: calculateTimeLimit(10, 'hard'),
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
      timeLimit: calculateTimeLimit(8, 'easy'),
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
      timeLimit: calculateTimeLimit(10, 'medium'),
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
      timeLimit: calculateTimeLimit(10, 'hard'),
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
      timeLimit: calculateTimeLimit(8, 'easy'),
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
      timeLimit: calculateTimeLimit(10, 'medium'),
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
      timeLimit: calculateTimeLimit(10, 'hard'),
      isPublished: true,
      totalQuestions: 10,
      tags: ['physiology', 'human body', 'organs']
    },

    // HISTORY QUIZZES
    {
      title: 'Ancient Civilizations',
      description: 'Early human civilizations, empires, and cultural developments',
      subject: historySubject._id,
      createdBy: teacherUser._id,
      difficulty: 'easy',
      timeLimit: calculateTimeLimit(8, 'easy'),
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
      timeLimit: calculateTimeLimit(10, 'medium'),
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
      timeLimit: calculateTimeLimit(10, 'hard'),
      isPublished: true,
      totalQuestions: 10,
      tags: ['indian history', 'independence', 'freedom struggle']
    },

    // DATA STRUCTURES & ALGORITHMS QUIZZES
    {
      title: 'Arrays & Strings Fundamentals',
      description: 'Array operations, string manipulation, basic algorithms',
      subject: dsaSubject._id,
      createdBy: teacherUser._id,
      difficulty: 'easy',
      timeLimit: calculateTimeLimit(10, 'easy'),
      isPublished: true,
      totalQuestions: 10,
      tags: ['arrays', 'strings', 'basic algorithms']
    },
    {
      title: 'Trees & Graphs',
      description: 'Binary trees, BST, graph traversal, shortest path algorithms',
      subject: dsaSubject._id,
      createdBy: teacherUser._id,
      difficulty: 'medium',
      timeLimit: calculateTimeLimit(12, 'medium'),
      isPublished: true,
      totalQuestions: 12,
      tags: ['trees', 'graphs', 'traversal']
    },
    {
      title: 'Dynamic Programming & Greedy Algorithms',
      description: 'DP optimization, greedy approach, complex problem solving',
      subject: dsaSubject._id,
      createdBy: adminUser._id,
      difficulty: 'hard',
      timeLimit: calculateTimeLimit(12, 'hard'),
      isPublished: true,
      totalQuestions: 12,
      tags: ['dynamic programming', 'greedy', 'optimization']
    },
    {
      title: 'Sorting & Searching Algorithms',
      description: 'Comparison-based sorting, binary search, hash tables',
      subject: dsaSubject._id,
      createdBy: adminUser._id,
      difficulty: 'medium',
      timeLimit: calculateTimeLimit(10, 'medium'),
      isPublished: true,
      totalQuestions: 10,
      tags: ['sorting', 'searching', 'hash tables']
    },

    // OPERATING SYSTEMS QUIZZES
    {
      title: 'Process Management',
      description: 'Process scheduling, context switching, inter-process communication',
      subject: osSubject._id,
      createdBy: teacherUser._id,
      difficulty: 'easy',
      timeLimit: calculateTimeLimit(10, 'easy'),
      isPublished: true,
      totalQuestions: 10,
      tags: ['processes', 'scheduling', 'IPC']
    },
    {
      title: 'Memory Management',
      description: 'Virtual memory, paging, segmentation, memory allocation',
      subject: osSubject._id,
      createdBy: teacherUser._id,
      difficulty: 'medium',
      timeLimit: calculateTimeLimit(10, 'medium'),
      isPublished: true,
      totalQuestions: 10,
      tags: ['memory', 'paging', 'virtual memory']
    },
    {
      title: 'File Systems & Synchronization',
      description: 'File allocation, directories, deadlocks, synchronization primitives',
      subject: osSubject._id,
      createdBy: adminUser._id,
      difficulty: 'hard',
      timeLimit: calculateTimeLimit(10, 'hard'),
      isPublished: true,
      totalQuestions: 10,
      tags: ['file systems', 'synchronization', 'deadlocks']
    },

    // DATABASE MANAGEMENT SYSTEMS QUIZZES
    {
      title: 'SQL Fundamentals',
      description: 'Basic SQL queries, joins, subqueries, data manipulation',
      subject: dbmsSubject._id,
      createdBy: teacherUser._id,
      difficulty: 'easy',
      timeLimit: calculateTimeLimit(10, 'easy'),
      isPublished: true,
      totalQuestions: 10,
      tags: ['SQL', 'queries', 'joins']
    },
    {
      title: 'Database Design & Normalization',
      description: 'ER diagrams, normalization forms, database design principles',
      subject: dbmsSubject._id,
      createdBy: teacherUser._id,
      difficulty: 'medium',
      timeLimit: calculateTimeLimit(10, 'medium'),
      isPublished: true,
      totalQuestions: 10,
      tags: ['database design', 'normalization', 'ER diagrams']
    },
    {
      title: 'Transactions & Concurrency Control',
      description: 'ACID properties, isolation levels, locking mechanisms',
      subject: dbmsSubject._id,
      createdBy: adminUser._id,
      difficulty: 'hard',
      timeLimit: calculateTimeLimit(10, 'hard'),
      isPublished: true,
      totalQuestions: 10,
      tags: ['transactions', 'concurrency', 'ACID']
    },

    // COMPUTER NETWORKS QUIZZES
    {
      title: 'Network Fundamentals',
      description: 'OSI model, TCP/IP stack, network topologies',
      subject: networksSubject._id,
      createdBy: teacherUser._id,
      difficulty: 'easy',
      timeLimit: calculateTimeLimit(10, 'easy'),
      isPublished: true,
      totalQuestions: 10,
      tags: ['OSI', 'TCP/IP', 'topologies']
    },
    {
      title: 'Routing & Switching',
      description: 'Routing algorithms, switching techniques, network protocols',
      subject: networksSubject._id,
      createdBy: teacherUser._id,
      difficulty: 'medium',
      timeLimit: calculateTimeLimit(10, 'medium'),
      isPublished: true,
      totalQuestions: 10,
      tags: ['routing', 'switching', 'protocols']
    },
    {
      title: 'Network Security & Applications',
      description: 'Security protocols, firewalls, web technologies, email systems',
      subject: networksSubject._id,
      createdBy: adminUser._id,
      difficulty: 'hard',
      timeLimit: calculateTimeLimit(10, 'hard'),
      isPublished: true,
      totalQuestions: 10,
      tags: ['security', 'applications', 'web protocols']
    },

    // OBJECT-ORIENTED PROGRAMMING QUIZZES
    {
      title: 'OOP Fundamentals',
      description: 'Classes, objects, encapsulation, basic OOP principles',
      subject: oopSubject._id,
      createdBy: teacherUser._id,
      difficulty: 'easy',
      timeLimit: calculateTimeLimit(10, 'easy'),
      isPublished: true,
      totalQuestions: 10,
      tags: ['classes', 'objects', 'encapsulation']
    },
    {
      title: 'Inheritance & Polymorphism',
      description: 'Inheritance hierarchies, method overriding, polymorphic behavior',
      subject: oopSubject._id,
      createdBy: teacherUser._id,
      difficulty: 'medium',
      timeLimit: calculateTimeLimit(10, 'medium'),
      isPublished: true,
      totalQuestions: 10,
      tags: ['inheritance', 'polymorphism', 'overriding']
    },
    {
      title: 'Design Patterns & Advanced OOP',
      description: 'Singleton, Factory, Observer patterns, SOLID principles',
      subject: oopSubject._id,
      createdBy: adminUser._id,
      difficulty: 'hard',
      timeLimit: calculateTimeLimit(10, 'hard'),
      isPublished: true,
      totalQuestions: 10,
      tags: ['design patterns', 'SOLID', 'architecture']
    },

    // WEB DEVELOPMENT QUIZZES
    {
      title: 'HTML & CSS Fundamentals',
      description: 'HTML structure, CSS styling, responsive design basics',
      subject: webDevSubject._id,
      createdBy: teacherUser._id,
      difficulty: 'easy',
      timeLimit: calculateTimeLimit(10, 'easy'),
      isPublished: true,
      totalQuestions: 10,
      tags: ['HTML', 'CSS', 'responsive design']
    },
    {
      title: 'JavaScript & DOM Manipulation',
      description: 'JavaScript fundamentals, DOM operations, event handling',
      subject: webDevSubject._id,
      createdBy: teacherUser._id,
      difficulty: 'medium',
      timeLimit: calculateTimeLimit(12, 'medium'),
      isPublished: true,
      totalQuestions: 12,
      tags: ['JavaScript', 'DOM', 'events']
    },
    {
      title: 'React & Modern Web Development',
      description: 'React components, hooks, state management, modern frameworks',
      subject: webDevSubject._id,
      createdBy: adminUser._id,
      difficulty: 'medium',
      timeLimit: calculateTimeLimit(12, 'medium'),
      isPublished: true,
      totalQuestions: 12,
      tags: ['React', 'components', 'modern web']
    },
    {
      title: 'Full Stack Development',
      description: 'Node.js, APIs, databases, deployment, full stack concepts',
      subject: webDevSubject._id,
      createdBy: adminUser._id,
      difficulty: 'hard',
      timeLimit: calculateTimeLimit(12, 'hard'),
      isPublished: true,
      totalQuestions: 12,
      tags: ['full stack', 'APIs', 'backend']
    },

    // SOFTWARE ENGINEERING QUIZZES
    {
      title: 'Software Development Life Cycle',
      description: 'SDLC models, Agile, Scrum, project management principles',
      subject: softwareEngSubject._id,
      createdBy: teacherUser._id,
      difficulty: 'easy',
      timeLimit: calculateTimeLimit(10, 'easy'),
      isPublished: true,
      totalQuestions: 10,
      tags: ['SDLC', 'Agile', 'project management']
    },
    {
      title: 'Testing & Quality Assurance',
      description: 'Testing methodologies, unit testing, integration testing, QA practices',
      subject: softwareEngSubject._id,
      createdBy: teacherUser._id,
      difficulty: 'medium',
      timeLimit: calculateTimeLimit(10, 'medium'),
      isPublished: true,
      totalQuestions: 10,
      tags: ['testing', 'QA', 'unit testing']
    },
    {
      title: 'DevOps & Deployment',
      description: 'CI/CD, containerization, cloud deployment, DevOps practices',
      subject: softwareEngSubject._id,
      createdBy: adminUser._id,
      difficulty: 'hard',
      timeLimit: calculateTimeLimit(10, 'hard'),
      isPublished: true,
      totalQuestions: 10,
      tags: ['DevOps', 'CI/CD', 'deployment']
    },

    // CYBERSECURITY QUIZZES
    {
      title: 'Security Fundamentals',
      description: 'Security principles, threats, vulnerabilities, basic cryptography',
      subject: cybersecuritySubject._id,
      createdBy: teacherUser._id,
      difficulty: 'easy',
      timeLimit: calculateTimeLimit(10, 'easy'),
      isPublished: true,
      totalQuestions: 10,
      tags: ['security principles', 'cryptography', 'threats']
    },
    {
      title: 'Network Security',
      description: 'Firewalls, VPNs, intrusion detection, network security protocols',
      subject: cybersecuritySubject._id,
      createdBy: teacherUser._id,
      difficulty: 'medium',
      timeLimit: calculateTimeLimit(10, 'medium'),
      isPublished: true,
      totalQuestions: 10,
      tags: ['network security', 'firewalls', 'VPN']
    },
    {
      title: 'Ethical Hacking & Penetration Testing',
      description: 'Penetration testing, vulnerability assessment, ethical hacking techniques',
      subject: cybersecuritySubject._id,
      createdBy: adminUser._id,
      difficulty: 'hard',
      timeLimit: calculateTimeLimit(10, 'hard'),
      isPublished: true,
      totalQuestions: 10,
      tags: ['ethical hacking', 'penetration testing', 'vulnerability']
    },

    // MACHINE LEARNING QUIZZES
    {
      title: 'ML Fundamentals',
      description: 'Introduction to ML, supervised vs unsupervised learning, basic concepts',
      subject: mlSubject._id,
      createdBy: teacherUser._id,
      difficulty: 'easy',
      timeLimit: calculateTimeLimit(10, 'easy'),
      isPublished: true,
      totalQuestions: 10,
      tags: ['ML basics', 'supervised learning', 'concepts']
    },
    {
      title: 'Algorithms & Models',
      description: 'Linear regression, decision trees, clustering, evaluation metrics',
      subject: mlSubject._id,
      createdBy: teacherUser._id,
      difficulty: 'medium',
      timeLimit: calculateTimeLimit(10, 'medium'),
      isPublished: true,
      totalQuestions: 10,
      tags: ['algorithms', 'regression', 'clustering']
    },
    {
      title: 'Deep Learning & Neural Networks',
      description: 'Neural networks, backpropagation, deep learning frameworks',
      subject: mlSubject._id,
      createdBy: adminUser._id,
      difficulty: 'hard',
      timeLimit: calculateTimeLimit(10, 'hard'),
      isPublished: true,
      totalQuestions: 10,
      tags: ['deep learning', 'neural networks', 'AI']
    },

    // CLOUD COMPUTING QUIZZES
    {
      title: 'Cloud Fundamentals',
      description: 'Cloud service models, deployment models, basic cloud concepts',
      subject: cloudSubject._id,
      createdBy: teacherUser._id,
      difficulty: 'easy',
      timeLimit: calculateTimeLimit(10, 'easy'),
      isPublished: true,
      totalQuestions: 10,
      tags: ['cloud basics', 'service models', 'deployment']
    },
    {
      title: 'AWS & Cloud Services',
      description: 'AWS services, EC2, S3, databases, cloud architecture patterns',
      subject: cloudSubject._id,
      createdBy: teacherUser._id,
      difficulty: 'medium',
      timeLimit: calculateTimeLimit(10, 'medium'),
      isPublished: true,
      totalQuestions: 10,
      tags: ['AWS', 'cloud services', 'architecture']
    },
    {
      title: 'DevOps & Container Technologies',
      description: 'Docker, Kubernetes, microservices, cloud-native development',
      subject: cloudSubject._id,
      createdBy: adminUser._id,
      difficulty: 'hard',
      timeLimit: calculateTimeLimit(10, 'hard'),
      isPublished: true,
      totalQuestions: 10,
      tags: ['containers', 'Kubernetes', 'microservices']
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

  // ============================
  // CS DOMAIN QUESTIONS START HERE
  // ============================

  // DSA QUESTIONS
  // Array & String Fundamentals (Easy) - Quiz 18
  const dsaBasics = quizzes[18];
  questions.push(...[
    {
      quiz: dsaBasics._id,
      subject: dsaBasics.subject,
      text: 'What is the time complexity of accessing an element in an array by index?',
      options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
      correctIndex: 0,
      explanation: 'Array access by index is O(1) constant time as it uses direct memory addressing.',
      difficulty: 'easy'
    },
    {
      quiz: dsaBasics._id,
      subject: dsaBasics.subject,
      text: 'Which of the following is NOT a valid way to declare an array in C++?',
      options: ['int arr[10];', 'int arr[] = {1,2,3};', 'int arr = new int[10];', 'vector<int> arr(10);'],
      correctIndex: 2,
      explanation: 'In C++, use "int* arr = new int[10];" for dynamic allocation. The syntax shown is incorrect.',
      difficulty: 'easy'
    },
    {
      quiz: dsaBasics._id,
      subject: dsaBasics.subject,
      text: 'What is the maximum number of characters that can be stored in a string of length n?',
      options: ['n', 'n-1', 'n+1', 'unlimited'],
      correctIndex: 1,
      explanation: 'A string of length n can store n-1 characters, as one position is reserved for null terminator.',
      difficulty: 'easy'
    },
    {
      quiz: dsaBasics._id,
      subject: dsaBasics.subject,
      text: 'Which operation is most efficient on a dynamic array?',
      options: ['Insert at beginning', 'Insert at end', 'Insert at middle', 'All have same complexity'],
      correctIndex: 1,
      explanation: 'Inserting at the end is O(1) amortized, while other operations require shifting elements.',
      difficulty: 'easy'
    },
    {
      quiz: dsaBasics._id,
      subject: dsaBasics.subject,
      text: 'What is the space complexity of storing n integers in an array?',
      options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
      correctIndex: 1,
      explanation: 'Storing n integers requires O(n) space proportional to the number of elements.',
      difficulty: 'easy'
    },
    {
      quiz: dsaBasics._id,
      subject: dsaBasics.subject,
      text: 'In a 2D array arr[m][n], how do you access the element in row i and column j?',
      options: ['arr[i,j]', 'arr[i][j]', 'arr(i,j)', 'arr[i*j]'],
      correctIndex: 1,
      explanation: 'In most programming languages, 2D arrays are accessed using arr[i][j] syntax.',
      difficulty: 'easy'
    },
    {
      quiz: dsaBasics._id,
      subject: dsaBasics.subject,
      text: 'Which of the following string operations has O(n) time complexity?',
      options: ['Length calculation', 'Character access', 'Concatenation', 'All of the above'],
      correctIndex: 2,
      explanation: 'String concatenation is O(n) as it may need to copy all characters to a new location.',
      difficulty: 'easy'
    },
    {
      quiz: dsaBasics._id,
      subject: dsaBasics.subject,
      text: 'What happens when you try to access an array element outside its bounds?',
      options: ['Returns 0', 'Returns null', 'Undefined behavior', 'Throws exception'],
      correctIndex: 2,
      explanation: 'In C/C++, accessing out-of-bounds elements results in undefined behavior.',
      difficulty: 'easy'
    }
  ]);

  // Linked Lists & Stack/Queue (Medium) - Quiz 19
  const dsaLinkedLists = quizzes[19];
  questions.push(...[
    {
      quiz: dsaLinkedLists._id,
      subject: dsaLinkedLists.subject,
      text: 'What is the time complexity of inserting a node at the beginning of a singly linked list?',
      options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
      correctIndex: 0,
      explanation: 'Insertion at the beginning of a linked list is O(1) as it only requires updating pointers.',
      difficulty: 'medium'
    },
    {
      quiz: dsaLinkedLists._id,
      subject: dsaLinkedLists.subject,
      text: 'Which data structure follows LIFO (Last In First Out) principle?',
      options: ['Queue', 'Stack', 'Array', 'Linked List'],
      correctIndex: 1,
      explanation: 'Stack follows LIFO principle - the last element added is the first one to be removed.',
      difficulty: 'medium'
    },
    {
      quiz: dsaLinkedLists._id,
      subject: dsaLinkedLists.subject,
      text: 'In a queue implementation using linked list, where should new elements be added?',
      options: ['At the front', 'At the rear', 'At the middle', 'Anywhere'],
      correctIndex: 1,
      explanation: 'In a queue, new elements are added at the rear (enqueue) and removed from front (dequeue).',
      difficulty: 'medium'
    },
    {
      quiz: dsaLinkedLists._id,
      subject: dsaLinkedLists.subject,
      text: 'What is the main advantage of doubly linked list over singly linked list?',
      options: ['Uses less memory', 'Faster insertion', 'Bidirectional traversal', 'Simpler implementation'],
      correctIndex: 2,
      explanation: 'Doubly linked lists allow traversal in both directions due to prev and next pointers.',
      difficulty: 'medium'
    },
    {
      quiz: dsaLinkedLists._id,
      subject: dsaLinkedLists.subject,
      text: 'Which operation is NOT typically supported by a stack?',
      options: ['Push', 'Pop', 'Peek/Top', 'Random access'],
      correctIndex: 3,
      explanation: 'Stacks do not support random access to elements; you can only access the top element.',
      difficulty: 'medium'
    },
    {
      quiz: dsaLinkedLists._id,
      subject: dsaLinkedLists.subject,
      text: 'How do you detect a cycle in a linked list efficiently?',
      options: ['Use extra space to store visited nodes', 'Floyd\'s cycle detection algorithm', 'Reverse the list', 'Count total nodes'],
      correctIndex: 1,
      explanation: 'Floyd\'s algorithm uses two pointers (slow and fast) to detect cycles in O(1) space.',
      difficulty: 'medium'
    },
    {
      quiz: dsaLinkedLists._id,
      subject: dsaLinkedLists.subject,
      text: 'What is the space complexity of implementing a queue using two stacks?',
      options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
      correctIndex: 1,
      explanation: 'Queue using two stacks requires O(n) space to store n elements across both stacks.',
      difficulty: 'medium'
    },
    {
      quiz: dsaLinkedLists._id,
      subject: dsaLinkedLists.subject,
      text: 'In a circular linked list, the last node points to:',
      options: ['NULL', 'The first node', 'The previous node', 'Itself'],
      correctIndex: 1,
      explanation: 'In a circular linked list, the last node points back to the first node, forming a circle.',
      difficulty: 'medium'
    }
  ]);

  // Trees & Graphs (Medium) - Quiz 20
  const dsaTrees = quizzes[20];
  questions.push(...[
    {
      quiz: dsaTrees._id,
      subject: dsaTrees.subject,
      text: 'What is the maximum number of nodes in a binary tree of height h?',
      options: ['2^h', '2^h - 1', '2^(h+1) - 1', '2^(h-1)'],
      correctIndex: 2,
      explanation: 'A complete binary tree of height h has maximum 2^(h+1) - 1 nodes.',
      difficulty: 'medium'
    },
    {
      quiz: dsaTrees._id,
      subject: dsaTrees.subject,
      text: 'Which traversal of a BST gives elements in sorted order?',
      options: ['Preorder', 'Inorder', 'Postorder', 'Level order'],
      correctIndex: 1,
      explanation: 'Inorder traversal (left-root-right) of a BST gives elements in ascending sorted order.',
      difficulty: 'medium'
    },
    {
      quiz: dsaTrees._id,
      subject: dsaTrees.subject,
      text: 'What is the time complexity of searching in a balanced BST?',
      options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
      correctIndex: 2,
      explanation: 'Searching in a balanced BST is O(log n) as we eliminate half the search space at each step.',
      difficulty: 'medium'
    },
    {
      quiz: dsaTrees._id,
      subject: dsaTrees.subject,
      text: 'Which algorithm is used to find the shortest path in an unweighted graph?',
      options: ['DFS', 'BFS', 'Dijkstra', 'Floyd-Warshall'],
      correctIndex: 1,
      explanation: 'BFS finds the shortest path in unweighted graphs by exploring nodes level by level.',
      difficulty: 'medium'
    },
    {
      quiz: dsaTrees._id,
      subject: dsaTrees.subject,
      text: 'What is the space complexity of DFS traversal using recursion?',
      options: ['O(1)', 'O(V)', 'O(E)', 'O(V + E)'],
      correctIndex: 1,
      explanation: 'Recursive DFS uses O(V) space due to the call stack depth equal to the number of vertices.',
      difficulty: 'medium'
    },
    {
      quiz: dsaTrees._id,
      subject: dsaTrees.subject,
      text: 'In which type of tree is every node either a leaf or has exactly two children?',
      options: ['Complete binary tree', 'Full binary tree', 'Perfect binary tree', 'Balanced binary tree'],
      correctIndex: 1,
      explanation: 'A full binary tree has every internal node with exactly two children and all leaves at same level.',
      difficulty: 'medium'
    },
    {
      quiz: dsaTrees._id,
      subject: dsaTrees.subject,
      text: 'What data structure is typically used to implement BFS?',
      options: ['Stack', 'Queue', 'Priority Queue', 'Array'],
      correctIndex: 1,
      explanation: 'BFS uses a queue to store nodes to be visited, following FIFO principle.',
      difficulty: 'medium'
    },
    {
      quiz: dsaTrees._id,
      subject: dsaTrees.subject,
      text: 'Which of the following is true for a Red-Black tree?',
      options: ['All nodes are red', 'All nodes are black', 'Root is always black', 'Leaves are always red'],
      correctIndex: 2,
      explanation: 'In a Red-Black tree, the root node is always colored black as per the tree properties.',
      difficulty: 'medium'
    }
  ]);

  // Dynamic Programming & Greedy (Hard) - Quiz 21
  const dsaDP = quizzes[21];
  questions.push(...[
    {
      quiz: dsaDP._id,
      subject: dsaDP.subject,
      text: 'What is the key principle behind dynamic programming?',
      options: ['Divide and conquer', 'Optimal substructure', 'Greedy choice', 'Backtracking'],
      correctIndex: 1,
      explanation: 'Dynamic programming relies on optimal substructure - optimal solution contains optimal solutions to subproblems.',
      difficulty: 'hard'
    },
    {
      quiz: dsaDP._id,
      subject: dsaDP.subject,
      text: 'In the 0/1 Knapsack problem, what does the DP table dp[i][w] represent?',
      options: ['Weight of item i', 'Value of item i', 'Maximum value with first i items and weight limit w', 'Number of items'],
      correctIndex: 2,
      explanation: 'dp[i][w] represents the maximum value achievable using first i items with weight limit w.',
      difficulty: 'hard'
    },
    {
      quiz: dsaDP._id,
      subject: dsaDP.subject,
      text: 'Which problem can be solved optimally using a greedy approach?',
      options: ['0/1 Knapsack', 'Longest Common Subsequence', 'Activity Selection', 'Edit Distance'],
      correctIndex: 2,
      explanation: 'Activity Selection problem has the greedy choice property - selecting earliest finishing activity is always optimal.',
      difficulty: 'hard'
    },
    {
      quiz: dsaDP._id,
      subject: dsaDP.subject,
      text: 'What is the time complexity of the standard DP solution for Longest Common Subsequence?',
      options: ['O(m)', 'O(n)', 'O(mn)', 'O(m²n)'],
      correctIndex: 2,
      explanation: 'LCS DP solution uses a 2D table of size m×n, resulting in O(mn) time complexity.',
      difficulty: 'hard'
    },
    {
      quiz: dsaDP._id,
      subject: dsaDP.subject,
      text: 'In memoization, where are the computed results typically stored?',
      options: ['Stack', 'Queue', 'Hash table/Array', 'Tree'],
      correctIndex: 2,
      explanation: 'Memoization stores computed results in a hash table or array for quick lookup and reuse.',
      difficulty: 'hard'
    },
    {
      quiz: dsaDP._id,
      subject: dsaDP.subject,
      text: 'Which condition must be satisfied for a greedy algorithm to work correctly?',
      options: ['Optimal substructure only', 'Overlapping subproblems only', 'Both optimal substructure and greedy choice property', 'Neither'],
      correctIndex: 2,
      explanation: 'Greedy algorithms require both optimal substructure and the greedy choice property to guarantee optimal solutions.',
      difficulty: 'hard'
    },
    {
      quiz: dsaDP._id,
      subject: dsaDP.subject,
      text: 'What is the space complexity of the optimized DP solution for Fibonacci sequence?',
      options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
      correctIndex: 0,
      explanation: 'Fibonacci can be computed in O(1) space by storing only the last two values instead of the entire array.',
      difficulty: 'hard'
    },
    {
      quiz: dsaDP._id,
      subject: dsaDP.subject,
      text: 'In which scenario would tabulation be preferred over memoization?',
      options: ['When recursion depth is limited', 'When iterative approach is more efficient', 'When memory is unlimited', 'Never'],
      correctIndex: 1,
      explanation: 'Tabulation (bottom-up) avoids recursion overhead and is often more efficient than memoization (top-down).',
      difficulty: 'hard'
    }
  ]);

  // Sorting & Searching (Medium) - Quiz 22
  const dsaSorting = quizzes[22];
  questions.push(...[
    {
      quiz: dsaSorting._id,
      subject: dsaSorting.subject,
      text: 'What is the worst-case time complexity of Quick Sort?',
      options: ['O(n log n)', 'O(n²)', 'O(n)', 'O(log n)'],
      correctIndex: 1,
      explanation: 'Quick Sort has O(n²) worst-case complexity when the pivot is always the smallest or largest element.',
      difficulty: 'medium'
    },
    {
      quiz: dsaSorting._id,
      subject: dsaSorting.subject,
      text: 'Which sorting algorithm is stable and has O(n log n) guaranteed time complexity?',
      options: ['Quick Sort', 'Heap Sort', 'Merge Sort', 'Selection Sort'],
      correctIndex: 2,
      explanation: 'Merge Sort is stable and always runs in O(n log n) time regardless of input distribution.',
      difficulty: 'medium'
    },
    {
      quiz: dsaSorting._id,
      subject: dsaSorting.subject,
      text: 'Binary search requires the array to be:',
      options: ['Unsorted', 'Sorted', 'Partially sorted', 'Of fixed size'],
      correctIndex: 1,
      explanation: 'Binary search only works on sorted arrays as it relies on the ordering to eliminate half the search space.',
      difficulty: 'medium'
    },
    {
      quiz: dsaSorting._id,
      subject: dsaSorting.subject,
      text: 'What is the best-case time complexity of Bubble Sort?',
      options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(1)'],
      correctIndex: 0,
      explanation: 'Bubble Sort\'s best case is O(n) when the array is already sorted and optimized with early termination.',
      difficulty: 'medium'
    },
    {
      quiz: dsaSorting._id,
      subject: dsaSorting.subject,
      text: 'Which data structure is commonly used to implement a priority queue?',
      options: ['Array', 'Linked List', 'Hash Table', 'Heap'],
      correctIndex: 3,
      explanation: 'Heaps are ideal for priority queues as they provide O(log n) insertion and O(1) access to maximum/minimum.',
      difficulty: 'medium'
    },
    {
      quiz: dsaSorting._id,
      subject: dsaSorting.subject,
      text: 'In a max heap, what is the relationship between parent and child nodes?',
      options: ['Parent < Child', 'Parent > Child', 'Parent = Child', 'No relationship'],
      correctIndex: 1,
      explanation: 'In a max heap, every parent node has a value greater than or equal to its children.',
      difficulty: 'medium'
    },
    {
      quiz: dsaSorting._id,
      subject: dsaSorting.subject,
      text: 'What is the space complexity of in-place Quick Sort?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
      correctIndex: 1,
      explanation: 'In-place Quick Sort uses O(log n) space for the recursion stack in average case.',
      difficulty: 'medium'
    },
    {
      quiz: dsaSorting._id,
      subject: dsaSorting.subject,
      text: 'Which search technique has the best average-case performance for unsorted data?',
      options: ['Linear Search', 'Binary Search', 'Hash Table Search', 'Tree Search'],
      correctIndex: 2,
      explanation: 'Hash tables provide O(1) average-case search time, making them fastest for unsorted data.',
      difficulty: 'medium'
    }
  ]);

  // OPERATING SYSTEMS QUESTIONS
  // Process Management (Easy) - Quiz 23
  const osProcesses = quizzes[23];
  questions.push(...[
    {
      quiz: osProcesses._id,
      subject: osProcesses.subject,
      text: 'What is a process in an operating system?',
      options: ['A program in execution', 'A file on disk', 'A memory location', 'A CPU instruction'],
      correctIndex: 0,
      explanation: 'A process is a program in execution, including the program code, data, and execution context.',
      difficulty: 'easy'
    },
    {
      quiz: osProcesses._id,
      subject: osProcesses.subject,
      text: 'Which of the following is NOT a process state?',
      options: ['Running', 'Ready', 'Waiting', 'Sleeping'],
      correctIndex: 3,
      explanation: 'The main process states are Running, Ready, Waiting (Blocked), and Terminated. "Sleeping" is not a standard state.',
      difficulty: 'easy'
    },
    {
      quiz: osProcesses._id,
      subject: osProcesses.subject,
      text: 'What happens during a context switch?',
      options: ['CPU is turned off', 'Memory is cleared', 'Process state is saved and restored', 'Hard disk is accessed'],
      correctIndex: 2,
      explanation: 'Context switch involves saving the current process state and restoring the state of the next process.',
      difficulty: 'easy'
    },
    {
      quiz: osProcesses._id,
      subject: osProcesses.subject,
      text: 'Which scheduling algorithm gives the shortest average waiting time?',
      options: ['FCFS', 'SJF', 'Round Robin', 'Priority'],
      correctIndex: 1,
      explanation: 'Shortest Job First (SJF) scheduling algorithm provides the minimum average waiting time.',
      difficulty: 'easy'
    },
    {
      quiz: osProcesses._id,
      subject: osProcesses.subject,
      text: 'What is the purpose of the Process Control Block (PCB)?',
      options: ['Control CPU speed', 'Store process information', 'Manage memory allocation', 'Handle interrupts'],
      correctIndex: 1,
      explanation: 'PCB stores all information about a process including process state, program counter, CPU registers, etc.',
      difficulty: 'easy'
    },
    {
      quiz: osProcesses._id,
      subject: osProcesses.subject,
      text: 'In Round Robin scheduling, what happens when a process\'s time quantum expires?',
      options: ['Process terminates', 'Process is blocked', 'Process is preempted', 'Process gets higher priority'],
      correctIndex: 2,
      explanation: 'When time quantum expires in Round Robin, the process is preempted and moved to ready queue.',
      difficulty: 'easy'
    },
    {
      quiz: osProcesses._id,
      subject: osProcesses.subject,
      text: 'What is the main advantage of multithreading?',
      options: ['Reduced memory usage', 'Better resource utilization', 'Simpler programming', 'Faster CPU'],
      correctIndex: 1,
      explanation: 'Multithreading allows better resource utilization by enabling concurrent execution within a process.',
      difficulty: 'easy'
    },
    {
      quiz: osProcesses._id,
      subject: osProcesses.subject,
      text: 'Which IPC mechanism is fastest?',
      options: ['Pipes', 'Message Queues', 'Shared Memory', 'Sockets'],
      correctIndex: 2,
      explanation: 'Shared memory is the fastest IPC mechanism as it avoids data copying between processes.',
      difficulty: 'easy'
    }
  ]);

  // Memory Management (Medium) - Quiz 24
  const osMemory = quizzes[24];
  questions.push(...[
    {
      quiz: osMemory._id,
      subject: osMemory.subject,
      text: 'What is the main purpose of virtual memory?',
      options: ['Increase CPU speed', 'Provide larger address space than physical memory', 'Reduce power consumption', 'Simplify programming'],
      correctIndex: 1,
      explanation: 'Virtual memory provides illusion of larger memory space than physically available through demand paging.',
      difficulty: 'medium'
    },
    {
      quiz: osMemory._id,
      subject: osMemory.subject,
      text: 'In paging, what is a page fault?',
      options: ['CPU error', 'Memory corruption', 'Request for page not in memory', 'Page size mismatch'],
      correctIndex: 2,
      explanation: 'Page fault occurs when a process references a page that is not currently in physical memory.',
      difficulty: 'medium'
    },
    {
      quiz: osMemory._id,
      subject: osMemory.subject,
      text: 'Which page replacement algorithm may suffer from Belady\'s anomaly?',
      options: ['LRU', 'FIFO', 'Optimal', 'Clock'],
      correctIndex: 1,
      explanation: 'FIFO page replacement can suffer from Belady\'s anomaly where more frames lead to more page faults.',
      difficulty: 'medium'
    },
    {
      quiz: osMemory._id,
      subject: osMemory.subject,
      text: 'What is the difference between internal and external fragmentation?',
      options: ['No difference', 'Internal occurs within allocated blocks, external between blocks', 'External occurs within allocated blocks, internal between blocks', 'Both are same concept'],
      correctIndex: 1,
      explanation: 'Internal fragmentation is wasted space within allocated memory blocks; external is unusable space between allocated blocks.',
      difficulty: 'medium'
    },
    {
      quiz: osMemory._id,
      subject: osMemory.subject,
      text: 'Which memory allocation strategy reduces external fragmentation?',
      options: ['First Fit', 'Best Fit', 'Worst Fit', 'Compaction'],
      correctIndex: 3,
      explanation: 'Compaction reduces external fragmentation by moving allocated partitions to create one large free block.',
      difficulty: 'medium'
    },
    {
      quiz: osMemory._id,
      subject: osMemory.subject,
      text: 'In segmentation, what is a segment?',
      options: ['Fixed-size memory block', 'Variable-size logical unit', 'Physical page', 'CPU register'],
      correctIndex: 1,
      explanation: 'A segment is a variable-size logical unit that represents a logical grouping like code, data, or stack.',
      difficulty: 'medium'
    },
    {
      quiz: osMemory._id,
      subject: osMemory.subject,
      text: 'What is thrashing in virtual memory systems?',
      options: ['Fast page access', 'Excessive paging activity', 'Memory optimization', 'CPU overclocking'],
      correctIndex: 1,
      explanation: 'Thrashing occurs when system spends more time paging than executing due to insufficient memory.',
      difficulty: 'medium'
    },
    {
      quiz: osMemory._id,
      subject: osMemory.subject,
      text: 'Which technique is used to speed up address translation in paging?',
      options: ['Cache memory', 'Translation Lookaside Buffer (TLB)', 'Faster CPU', 'Larger RAM'],
      correctIndex: 1,
      explanation: 'TLB is a high-speed cache that stores recent page table entries to speed up address translation.',
      difficulty: 'medium'
    }
  ]);

  // File Systems & Synchronization (Hard) - Quiz 25
  const osFileSystems = quizzes[25];
  questions.push(...[
    {
      quiz: osFileSystems._id,
      subject: osFileSystems.subject,
      text: 'What is the main advantage of indexed allocation in file systems?',
      options: ['No external fragmentation', 'Direct access to any block', 'Minimal metadata overhead', 'Sequential access only'],
      correctIndex: 1,
      explanation: 'Indexed allocation allows direct access to any file block through the index block, supporting random access efficiently.',
      difficulty: 'hard'
    },
    {
      quiz: osFileSystems._id,
      subject: osFileSystems.subject,
      text: 'In the Banker\'s algorithm for deadlock avoidance, what does the "safe sequence" represent?',
      options: ['Order of process termination', 'Order in which processes can complete without deadlock', 'Priority of processes', 'Memory allocation order'],
      correctIndex: 1,
      explanation: 'A safe sequence is an ordering of processes where each can obtain needed resources and complete without causing deadlock.',
      difficulty: 'hard'
    },
    {
      quiz: osFileSystems._id,
      subject: osFileSystems.subject,
      text: 'Which condition is NOT necessary for deadlock to occur?',
      options: ['Mutual exclusion', 'Hold and wait', 'No preemption', 'Circular dependency'],
      correctIndex: 3,
      explanation: 'The four necessary conditions are: mutual exclusion, hold and wait, no preemption, and circular wait (not circular dependency).',
      difficulty: 'hard'
    },
    {
      quiz: osFileSystems._id,
      subject: osFileSystems.subject,
      text: 'What is the purpose of journaling in file systems?',
      options: ['Increase read speed', 'Provide crash recovery', 'Reduce file size', 'Encrypt data'],
      correctIndex: 1,
      explanation: 'Journaling maintains a log of file system changes to enable recovery after system crashes.',
      difficulty: 'hard'
    },
    {
      quiz: osFileSystems._id,
      subject: osFileSystems.subject,
      text: 'In semaphores, what happens when a process calls wait() on a semaphore with value 0?',
      options: ['Process continues execution', 'Process is blocked', 'Semaphore value becomes -1', 'System crashes'],
      correctIndex: 1,
      explanation: 'When wait() is called on a semaphore with value 0, the calling process is blocked until the semaphore becomes positive.',
      difficulty: 'hard'
    },
    {
      quiz: osFileSystems._id,
      subject: osFileSystems.subject,
      text: 'Which directory structure provides the most flexibility but highest overhead?',
      options: ['Single-level', 'Two-level', 'Tree-structured', 'Acyclic graph'],
      correctIndex: 3,
      explanation: 'Acyclic graph directory structure allows sharing of files/directories but requires complex algorithms to maintain acyclicity.',
      difficulty: 'hard'
    },
    {
      quiz: osFileSystems._id,
      subject: osFileSystems.subject,
      text: 'What is the key difference between monitors and semaphores?',
      options: ['Monitors are hardware-based', 'Monitors provide higher-level synchronization construct', 'Semaphores are faster', 'No difference'],
      correctIndex: 1,
      explanation: 'Monitors provide a higher-level synchronization construct with automatic mutual exclusion and condition variables.',
      difficulty: 'hard'
    },
    {
      quiz: osFileSystems._id,
      subject: osFileSystems.subject,
      text: 'In RAID 5, how is fault tolerance achieved?',
      options: ['Mirroring all data', 'Using parity information', 'Triple redundancy', 'Error correction codes only'],
      correctIndex: 1,
      explanation: 'RAID 5 achieves fault tolerance through distributed parity information, allowing recovery from single disk failure.',
      difficulty: 'hard'
    }
  ]);

  // DATABASE MANAGEMENT SYSTEMS QUESTIONS
  // SQL Fundamentals (Easy) - Quiz 26
  const dbmsSql = quizzes[26];
  questions.push(...[
    {
      quiz: dbmsSql._id,
      subject: dbmsSql.subject,
      text: 'Which SQL command is used to retrieve data from a database?',
      options: ['GET', 'SELECT', 'RETRIEVE', 'FETCH'],
      correctIndex: 1,
      explanation: 'SELECT is the SQL command used to query and retrieve data from database tables.',
      difficulty: 'easy'
    },
    {
      quiz: dbmsSql._id,
      subject: dbmsSql.subject,
      text: 'What does the WHERE clause do in a SQL query?',
      options: ['Sorts the results', 'Filters rows based on conditions', 'Groups related rows', 'Joins tables'],
      correctIndex: 1,
      explanation: 'The WHERE clause filters rows from the result set based on specified conditions.',
      difficulty: 'easy'
    },
    {
      quiz: dbmsSql._id,
      subject: dbmsSql.subject,
      text: 'Which JOIN returns all rows from both tables, matching where possible?',
      options: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL OUTER JOIN'],
      correctIndex: 3,
      explanation: 'FULL OUTER JOIN returns all rows from both tables, with NULLs where no match exists.',
      difficulty: 'easy'
    },
    {
      quiz: dbmsSql._id,
      subject: dbmsSql.subject,
      text: 'What is the purpose of the GROUP BY clause?',
      options: ['Sort data', 'Filter rows', 'Group rows with same values', 'Join tables'],
      correctIndex: 2,
      explanation: 'GROUP BY groups rows that have the same values in specified columns, often used with aggregate functions.',
      difficulty: 'easy'
    },
    {
      quiz: dbmsSql._id,
      subject: dbmsSql.subject,
      text: 'Which function counts the number of rows in a table?',
      options: ['SUM()', 'AVG()', 'COUNT()', 'MAX()'],
      correctIndex: 2,
      explanation: 'COUNT() is an aggregate function that returns the number of rows in a result set.',
      difficulty: 'easy'
    },
    {
      quiz: dbmsSql._id,
      subject: dbmsSql.subject,
      text: 'What does NULL represent in SQL?',
      options: ['Zero value', 'Empty string', 'Unknown or missing value', 'False'],
      correctIndex: 2,
      explanation: 'NULL represents unknown, undefined, or missing values in SQL databases.',
      difficulty: 'easy'
    },
    {
      quiz: dbmsSql._id,
      subject: dbmsSql.subject,
      text: 'Which command is used to add new rows to a table?',
      options: ['ADD', 'INSERT', 'CREATE', 'UPDATE'],
      correctIndex: 1,
      explanation: 'INSERT command is used to add new rows of data into a database table.',
      difficulty: 'easy'
    },
    {
      quiz: dbmsSql._id,
      subject: dbmsSql.subject,
      text: 'What is a primary key?',
      options: ['A key that opens locks', 'The first column in a table', 'A unique identifier for table rows', 'A password'],
      correctIndex: 2,
      explanation: 'A primary key uniquely identifies each row in a database table and cannot contain NULL values.',
      difficulty: 'easy'
    }
  ]);

  // Database Design & Normalization (Medium) - Quiz 27
  const dbmsDesign = quizzes[27];
  questions.push(...[
    {
      quiz: dbmsDesign._id,
      subject: dbmsDesign.subject,
      text: 'What is the main purpose of database normalization?',
      options: ['Increase storage space', 'Reduce data redundancy', 'Slow down queries', 'Add more tables'],
      correctIndex: 1,
      explanation: 'Database normalization reduces data redundancy and dependency by organizing data into well-structured tables.',
      difficulty: 'medium'
    },
    {
      quiz: dbmsDesign._id,
      subject: dbmsDesign.subject,
      text: 'A table is in First Normal Form (1NF) if:',
      options: ['It has a primary key', 'All attributes contain atomic values', 'It has no partial dependencies', 'It has no transitive dependencies'],
      correctIndex: 1,
      explanation: '1NF requires that all attributes contain atomic (indivisible) values - no repeating groups or arrays.',
      difficulty: 'medium'
    },
    {
      quiz: dbmsDesign._id,
      subject: dbmsDesign.subject,
      text: 'What type of relationship exists between Customer and Order in an e-commerce system?',
      options: ['One-to-One', 'One-to-Many', 'Many-to-Many', 'Many-to-One'],
      correctIndex: 1,
      explanation: 'One customer can place many orders, but each order belongs to one customer - this is One-to-Many relationship.',
      difficulty: 'medium'
    },
    {
      quiz: dbmsDesign._id,
      subject: dbmsDesign.subject,
      text: 'Which normal form eliminates transitive dependencies?',
      options: ['1NF', '2NF', '3NF', 'BCNF'],
      correctIndex: 2,
      explanation: 'Third Normal Form (3NF) eliminates transitive dependencies where non-key attributes depend on other non-key attributes.',
      difficulty: 'medium'
    },
    {
      quiz: dbmsDesign._id,
      subject: dbmsDesign.subject,
      text: 'In an ER diagram, what does a diamond shape represent?',
      options: ['Entity', 'Attribute', 'Relationship', 'Primary key'],
      correctIndex: 2,
      explanation: 'Diamond shapes in ER diagrams represent relationships between entities.',
      difficulty: 'medium'
    },
    {
      quiz: dbmsDesign._id,
      subject: dbmsDesign.subject,
      text: 'What is a foreign key?',
      options: ['A key from another database', 'A column that references primary key of another table', 'An encrypted key', 'A backup key'],
      correctIndex: 1,
      explanation: 'A foreign key is a column that creates a link between tables by referencing the primary key of another table.',
      difficulty: 'medium'
    },
    {
      quiz: dbmsDesign._id,
      subject: dbmsDesign.subject,
      text: 'Which type of attribute can have multiple values for a single entity?',
      options: ['Simple', 'Composite', 'Multivalued', 'Derived'],
      correctIndex: 2,
      explanation: 'Multivalued attributes can have multiple values for a single entity instance (e.g., multiple phone numbers).',
      difficulty: 'medium'
    },
    {
      quiz: dbmsDesign._id,
      subject: dbmsDesign.subject,
      text: 'What is denormalization?',
      options: ['Removing all keys', 'Deliberately introducing redundancy for performance', 'Deleting tables', 'Encrypting data'],
      correctIndex: 1,
      explanation: 'Denormalization deliberately introduces redundancy into normalized database to improve query performance.',
      difficulty: 'medium'
    }
  ]);

  // Transactions & Concurrency (Hard) - Quiz 28
  const dbmsTransactions = quizzes[28];
  questions.push(...[
    {
      quiz: dbmsTransactions._id,
      subject: dbmsTransactions.subject,
      text: 'Which property ensures that database transactions are processed reliably?',
      options: ['Availability', 'Consistency', 'Isolation', 'All ACID properties together'],
      correctIndex: 3,
      explanation: 'All ACID properties (Atomicity, Consistency, Isolation, Durability) work together to ensure reliable transaction processing.',
      difficulty: 'hard'
    },
    {
      quiz: dbmsTransactions._id,
      subject: dbmsTransactions.subject,
      text: 'What is a dirty read in database transactions?',
      options: ['Reading from a corrupted disk', 'Reading uncommitted changes from another transaction', 'Reading deleted data', 'Reading encrypted data'],
      correctIndex: 1,
      explanation: 'A dirty read occurs when a transaction reads data that has been written by another uncommitted transaction.',
      difficulty: 'hard'
    },
    {
      quiz: dbmsTransactions._id,
      subject: dbmsTransactions.subject,
      text: 'Which isolation level prevents dirty reads but allows phantom reads?',
      options: ['READ UNCOMMITTED', 'READ COMMITTED', 'REPEATABLE READ', 'SERIALIZABLE'],
      correctIndex: 1,
      explanation: 'READ COMMITTED prevents dirty reads by only reading committed data, but phantom reads can still occur.',
      difficulty: 'hard'
    },
    {
      quiz: dbmsTransactions._id,
      subject: dbmsTransactions.subject,
      text: 'What is the purpose of two-phase locking (2PL)?',
      options: ['Improve performance', 'Ensure serializability', 'Reduce memory usage', 'Speed up queries'],
      correctIndex: 1,
      explanation: 'Two-phase locking ensures serializability by having growing and shrinking phases for lock acquisition.',
      difficulty: 'hard'
    },
    {
      quiz: dbmsTransactions._id,
      subject: dbmsTransactions.subject,
      text: 'In optimistic concurrency control, when are conflicts detected?',
      options: ['Before transaction starts', 'During transaction execution', 'At commit time', 'Never'],
      correctIndex: 2,
      explanation: 'Optimistic concurrency control detects conflicts at commit time, assuming conflicts are rare.',
      difficulty: 'hard'
    },
    {
      quiz: dbmsTransactions._id,
      subject: dbmsTransactions.subject,
      text: 'What is a phantom read?',
      options: ['Reading non-existent data', 'Reading deleted records', 'New rows appearing between reads in same transaction', 'Reading corrupted data'],
      correctIndex: 2,
      explanation: 'Phantom reads occur when new rows matching a query condition appear between multiple reads in the same transaction.',
      difficulty: 'hard'
    },
    {
      quiz: dbmsTransactions._id,
      subject: dbmsTransactions.subject,
      text: 'Which recovery technique uses both undo and redo operations?',
      options: ['Immediate update', 'Deferred update', 'Shadow paging', 'Checkpoint'],
      correctIndex: 0,
      explanation: 'Immediate update recovery requires both undo (for uncommitted transactions) and redo (for committed transactions) operations.',
      difficulty: 'hard'
    },
    {
      quiz: dbmsTransactions._id,
      subject: dbmsTransactions.subject,
      text: 'What is the main disadvantage of strict two-phase locking?',
      options: ['Poor concurrency', 'High memory usage', 'Complex implementation', 'Data inconsistency'],
      correctIndex: 0,
      explanation: 'Strict 2PL holds locks until transaction end, reducing concurrency and potentially causing deadlocks.',
      difficulty: 'hard'
    }
  ]);

  // COMPUTER NETWORKS QUESTIONS
  // Network Fundamentals (Easy) - Quiz 29
  const networksFundamentals = quizzes[29];
  questions.push(...[
    {
      quiz: networksFundamentals._id,
      subject: networksFundamentals.subject,
      text: 'What does OSI stand for?',
      options: ['Open System Interconnection', 'Operating System Interface', 'Open Source Initiative', 'Online System Integration'],
      correctIndex: 0,
      explanation: 'OSI stands for Open System Interconnection, a conceptual model with 7 layers for network communication.',
      difficulty: 'easy'
    },
    {
      quiz: networksFundamentals._id,
      subject: networksFundamentals.subject,
      text: 'Which layer of the OSI model handles routing?',
      options: ['Physical', 'Data Link', 'Network', 'Transport'],
      correctIndex: 2,
      explanation: 'The Network layer (Layer 3) is responsible for routing packets between different networks.',
      difficulty: 'easy'
    },
    {
      quiz: networksFundamentals._id,
      subject: networksFundamentals.subject,
      text: 'What is the standard port number for HTTP?',
      options: ['21', '23', '80', '443'],
      correctIndex: 2,
      explanation: 'HTTP (HyperText Transfer Protocol) uses port 80 as its standard port number.',
      difficulty: 'easy'
    },
    {
      quiz: networksFundamentals._id,
      subject: networksFundamentals.subject,
      text: 'Which protocol is used to translate domain names to IP addresses?',
      options: ['DHCP', 'DNS', 'FTP', 'SMTP'],
      correctIndex: 1,
      explanation: 'DNS (Domain Name System) translates human-readable domain names to IP addresses.',
      difficulty: 'easy'
    },
    {
      quiz: networksFundamentals._id,
      subject: networksFundamentals.subject,
      text: 'What type of cable is most commonly used in modern Ethernet networks?',
      options: ['Coaxial', 'Twisted pair', 'Fiber optic', 'Ribbon cable'],
      correctIndex: 1,
      explanation: 'Twisted pair cables (like Cat5e, Cat6) are most commonly used in modern Ethernet networks.',
      difficulty: 'easy'
    },
    {
      quiz: networksFundamentals._id,
      subject: networksFundamentals.subject,
      text: 'Which device operates at the Physical layer of the OSI model?',
      options: ['Router', 'Switch', 'Hub', 'Gateway'],
      correctIndex: 2,
      explanation: 'Hubs operate at the Physical layer (Layer 1) by simply repeating electrical signals.',
      difficulty: 'easy'
    },
    {
      quiz: networksFundamentals._id,
      subject: networksFundamentals.subject,
      text: 'What does MAC stand for in networking?',
      options: ['Machine Access Control', 'Media Access Control', 'Memory Access Controller', 'Message Authentication Code'],
      correctIndex: 1,
      explanation: 'MAC stands for Media Access Control, referring to the unique identifier assigned to network interfaces.',
      difficulty: 'easy'
    },
    {
      quiz: networksFundamentals._id,
      subject: networksFundamentals.subject,
      text: 'Which IP address class has the range 192.0.0.0 to 223.255.255.255?',
      options: ['Class A', 'Class B', 'Class C', 'Class D'],
      correctIndex: 2,
      explanation: 'Class C IP addresses range from 192.0.0.0 to 223.255.255.255 with default subnet mask 255.255.255.0.',
      difficulty: 'easy'
    }
  ]);

  // TCP/IP & Protocols (Medium) - Quiz 30
  const networksTCP = quizzes[30];
  questions.push(...[
    {
      quiz: networksTCP._id,
      subject: networksTCP.subject,
      text: 'What is the main difference between TCP and UDP?',
      options: ['TCP is faster', 'TCP is reliable, UDP is unreliable', 'UDP has more features', 'No difference'],
      correctIndex: 1,
      explanation: 'TCP provides reliable, connection-oriented communication while UDP is unreliable but faster.',
      difficulty: 'medium'
    },
    {
      quiz: networksTCP._id,
      subject: networksTCP.subject,
      text: 'How many steps are in the TCP three-way handshake?',
      options: ['2', '3', '4', '5'],
      correctIndex: 1,
      explanation: 'TCP three-way handshake involves: SYN, SYN-ACK, ACK - exactly 3 steps to establish connection.',
      difficulty: 'medium'
    },
    {
      quiz: networksTCP._id,
      subject: networksTCP.subject,
      text: 'What is the maximum size of a TCP segment?',
      options: ['1024 bytes', '1500 bytes', '65535 bytes', 'No limit'],
      correctIndex: 2,
      explanation: 'TCP segment size is limited by the 16-bit length field, giving maximum size of 65535 bytes.',
      difficulty: 'medium'
    },
    {
      quiz: networksTCP._id,
      subject: networksTCP.subject,
      text: 'Which field in the IP header prevents infinite loops?',
      options: ['Version', 'TTL (Time To Live)', 'Checksum', 'Protocol'],
      correctIndex: 1,
      explanation: 'TTL field decrements at each hop and prevents packets from looping infinitely in the network.',
      difficulty: 'medium'
    },
    {
      quiz: networksTCP._id,
      subject: networksTCP.subject,
      text: 'What happens when TCP receives an out-of-order segment?',
      options: ['Discards it', 'Buffers it until missing segments arrive', 'Sends it to application immediately', 'Requests retransmission'],
      correctIndex: 1,
      explanation: 'TCP buffers out-of-order segments and delivers them to the application in correct order.',
      difficulty: 'medium'
    },
    {
      quiz: networksTCP._id,
      subject: networksTCP.subject,
      text: 'Which protocol is used by DHCP for communication?',
      options: ['TCP', 'UDP', 'ICMP', 'ARP'],
      correctIndex: 1,
      explanation: 'DHCP uses UDP as its transport protocol, with client using port 68 and server using port 67.',
      difficulty: 'medium'
    },
    {
      quiz: networksTCP._id,
      subject: networksTCP.subject,
      text: 'What is the purpose of ARP (Address Resolution Protocol)?',
      options: ['Translate IP to MAC addresses', 'Route packets', 'Assign IP addresses', 'Encrypt data'],
      correctIndex: 0,
      explanation: 'ARP translates IP addresses to MAC addresses for communication within the same network segment.',
      difficulty: 'medium'
    },
    {
      quiz: networksTCP._id,
      subject: networksTCP.subject,
      text: 'In TCP flow control, what does the window size indicate?',
      options: ['Network bandwidth', 'Number of bytes receiver can accept', 'Packet size', 'Connection timeout'],
      correctIndex: 1,
      explanation: 'TCP window size indicates the number of bytes the receiver is willing to accept without acknowledgment.',
      difficulty: 'medium'
    }
  ]);

  // Network Security & Routing (Hard) - Quiz 31
  const networksSecurity = quizzes[31];
  questions.push(...[
    {
      quiz: networksSecurity._id,
      subject: networksSecurity.subject,
      text: 'Which routing algorithm is used by OSPF?',
      options: ['Distance Vector', 'Link State', 'Path Vector', 'Static Routing'],
      correctIndex: 1,
      explanation: 'OSPF (Open Shortest Path First) uses Link State routing algorithm with Dijkstra\'s algorithm.',
      difficulty: 'hard'
    },
    {
      quiz: networksSecurity._id,
      subject: networksSecurity.subject,
      text: 'What type of attack involves flooding a network with traffic to make it unavailable?',
      options: ['Man-in-the-middle', 'DDoS', 'Phishing', 'SQL Injection'],
      correctIndex: 1,
      explanation: 'DDoS (Distributed Denial of Service) attacks flood networks with traffic to disrupt normal operations.',
      difficulty: 'hard'
    },
    {
      quiz: networksSecurity._id,
      subject: networksSecurity.subject,
      text: 'In BGP, what is an Autonomous System (AS)?',
      options: ['A single router', 'A collection of networks under single administrative control', 'An automatic system', 'A backup system'],
      correctIndex: 1,
      explanation: 'An Autonomous System is a collection of networks under single administrative and routing control.',
      difficulty: 'hard'
    },
    {
      quiz: networksSecurity._id,
      subject: networksSecurity.subject,
      text: 'What is the main purpose of a firewall?',
      options: ['Speed up network', 'Control network access based on security rules', 'Store network data', 'Route packets'],
      correctIndex: 1,
      explanation: 'Firewalls control network access by filtering traffic based on predefined security rules.',
      difficulty: 'hard'
    },
    {
      quiz: networksSecurity._id,
      subject: networksSecurity.subject,
      text: 'Which encryption method is used by WPA2?',
      options: ['WEP', 'AES', 'DES', 'RSA'],
      correctIndex: 1,
      explanation: 'WPA2 uses AES (Advanced Encryption Standard) for strong wireless network security.',
      difficulty: 'hard'
    },
    {
      quiz: networksSecurity._id,
      subject: networksSecurity.subject,
      text: 'What is NAT (Network Address Translation) primarily used for?',
      options: ['Increase network speed', 'Convert private IP addresses to public IP addresses', 'Encrypt data', 'Route packets'],
      correctIndex: 1,
      explanation: 'NAT translates private IP addresses to public IP addresses, enabling multiple devices to share one public IP.',
      difficulty: 'hard'
    },
    {
      quiz: networksSecurity._id,
      subject: networksSecurity.subject,
      text: 'In IPSec, what is the difference between Transport and Tunnel mode?',
      options: ['No difference', 'Transport encrypts payload only, Tunnel encrypts entire packet', 'Tunnel is faster', 'Transport is more secure'],
      correctIndex: 1,
      explanation: 'Transport mode encrypts only the payload, while Tunnel mode encrypts the entire original packet.',
      difficulty: 'hard'
    },
    {
      quiz: networksSecurity._id,
      subject: networksSecurity.subject,
      text: 'What metric does RIP use for routing decisions?',
      options: ['Bandwidth', 'Delay', 'Hop count', 'Cost'],
      correctIndex: 2,
      explanation: 'RIP (Routing Information Protocol) uses hop count as its routing metric, with maximum of 15 hops.',
      difficulty: 'hard'
    }
  ]);

  // OBJECT-ORIENTED PROGRAMMING QUESTIONS  
  // OOP Fundamentals (Easy) - Quiz 32
  const oopFundamentals = quizzes[32];
  questions.push(...[
    {
      quiz: oopFundamentals._id,
      subject: oopFundamentals.subject,
      text: 'What are the four main principles of Object-Oriented Programming?',
      options: ['Abstraction, Inheritance, Polymorphism, Encapsulation', 'Classes, Objects, Methods, Variables', 'Public, Private, Protected, Static', 'Create, Read, Update, Delete'],
      correctIndex: 0,
      explanation: 'The four pillars of OOP are Abstraction, Inheritance, Polymorphism, and Encapsulation.',
      difficulty: 'easy'
    },
    {
      quiz: oopFundamentals._id,
      subject: oopFundamentals.subject,
      text: 'What is encapsulation in OOP?',
      options: ['Creating multiple objects', 'Hiding internal implementation details', 'Inheriting from parent class', 'Using many forms'],
      correctIndex: 1,
      explanation: 'Encapsulation is the bundling of data and methods together while hiding internal implementation details.',
      difficulty: 'easy'
    },
    {
      quiz: oopFundamentals._id,
      subject: oopFundamentals.subject,
      text: 'What is the difference between a class and an object?',
      options: ['No difference', 'Class is a template, object is an instance', 'Object is a template, class is an instance', 'Both are same concept'],
      correctIndex: 1,
      explanation: 'A class is a blueprint or template, while an object is a specific instance created from that class.',
      difficulty: 'easy'
    },
    {
      quiz: oopFundamentals._id,
      subject: oopFundamentals.subject,
      text: 'Which access modifier makes a member accessible only within the same class?',
      options: ['public', 'private', 'protected', 'internal'],
      correctIndex: 1,
      explanation: 'Private access modifier restricts access to members only within the same class.',
      difficulty: 'easy'
    },
    {
      quiz: oopFundamentals._id,
      subject: oopFundamentals.subject,
      text: 'What is inheritance in OOP?',
      options: ['Creating new objects', 'Acquiring properties from another class', 'Hiding data', 'Method overloading'],
      correctIndex: 1,
      explanation: 'Inheritance allows a class to acquire properties and methods from another class (parent/base class).',
      difficulty: 'easy'
    },
    {
      quiz: oopFundamentals._id,
      subject: oopFundamentals.subject,
      text: 'What is a constructor?',
      options: ['A destructor method', 'A special method to initialize objects', 'A static method', 'A private method'],
      correctIndex: 1,
      explanation: 'A constructor is a special method that is automatically called when an object is created to initialize it.',
      difficulty: 'easy'
    },
    {
      quiz: oopFundamentals._id,
      subject: oopFundamentals.subject,
      text: 'What does the "this" keyword refer to?',
      options: ['The parent class', 'The current object instance', 'The next object', 'The class definition'],
      correctIndex: 1,
      explanation: 'The "this" keyword refers to the current object instance within a class method.',
      difficulty: 'easy'
    },
    {
      quiz: oopFundamentals._id,
      subject: oopFundamentals.subject,
      text: 'Which principle allows the same interface to be used for different data types?',
      options: ['Encapsulation', 'Inheritance', 'Polymorphism', 'Abstraction'],
      correctIndex: 2,
      explanation: 'Polymorphism allows objects of different types to be treated through the same interface.',
      difficulty: 'easy'
    }
  ]);

  // Advanced OOP & Design Patterns (Medium) - Quiz 33  
  const oopAdvanced = quizzes[33];
  questions.push(...[
    {
      quiz: oopAdvanced._id,
      subject: oopAdvanced.subject,
      text: 'What is method overriding?',
      options: ['Creating multiple methods with same name', 'Redefining a parent class method in child class', 'Calling parent method', 'Deleting a method'],
      correctIndex: 1,
      explanation: 'Method overriding is redefining a parent class method in the child class with same signature.',
      difficulty: 'medium'
    },
    {
      quiz: oopAdvanced._id,
      subject: oopAdvanced.subject,
      text: 'What is the Singleton design pattern used for?',
      options: ['Creating multiple instances', 'Ensuring only one instance of a class exists', 'Inheriting from multiple classes', 'Abstract class creation'],
      correctIndex: 1,
      explanation: 'Singleton pattern ensures that a class has only one instance and provides global access to it.',
      difficulty: 'medium'
    },
    {
      quiz: oopAdvanced._id,
      subject: oopAdvanced.subject,
      text: 'What is an abstract class?',
      options: ['A class with no methods', 'A class that cannot be instantiated', 'A class with only static methods', 'A final class'],
      correctIndex: 1,
      explanation: 'An abstract class cannot be instantiated directly and typically contains abstract methods to be implemented by subclasses.',
      difficulty: 'medium'
    },
    {
      quiz: oopAdvanced._id,
      subject: oopAdvanced.subject,
      text: 'What is the difference between composition and inheritance?',
      options: ['No difference', 'Composition is "has-a", inheritance is "is-a"', 'Inheritance is "has-a", composition is "is-a"', 'Both are same'],
      correctIndex: 1,
      explanation: 'Composition represents "has-a" relationship (object contains another), inheritance represents "is-a" relationship.',
      difficulty: 'medium'
    },
    {
      quiz: oopAdvanced._id,
      subject: oopAdvanced.subject,
      text: 'What is the Factory design pattern?',
      options: ['A pattern for destroying objects', 'A pattern for creating objects without specifying exact class', 'A pattern for copying objects', 'A pattern for comparing objects'],
      correctIndex: 1,
      explanation: 'Factory pattern creates objects without specifying the exact class, providing a common interface for object creation.',
      difficulty: 'medium'
    },
    {
      quiz: oopAdvanced._id,
      subject: oopAdvanced.subject,
      text: 'What is late binding (dynamic binding)?',
      options: ['Binding at compile time', 'Binding at runtime', 'No binding occurs', 'Binding before compilation'],
      correctIndex: 1,
      explanation: 'Late binding (dynamic binding) resolves method calls at runtime, enabling polymorphism.',
      difficulty: 'medium'
    },
    {
      quiz: oopAdvanced._id,
      subject: oopAdvanced.subject,
      text: 'What is the Observer design pattern?',
      options: ['Watching other classes', 'A pattern where objects notify observers of state changes', 'A debugging pattern', 'A testing pattern'],
      correctIndex: 1,
      explanation: 'Observer pattern defines a one-to-many dependency where objects notify observers about state changes.',
      difficulty: 'medium'
    },
    {
      quiz: oopAdvanced._id,
      subject: oopAdvanced.subject,
      text: 'What is multiple inheritance and why is it problematic?',
      options: ['Inheriting from one class', 'Inheriting from multiple classes, can cause diamond problem', 'Creating multiple objects', 'No inheritance'],
      correctIndex: 1,
      explanation: 'Multiple inheritance allows inheriting from multiple classes but can cause diamond problem and ambiguity.',
      difficulty: 'medium'
    }
  ]);

  // WEB DEVELOPMENT QUESTIONS
  // Frontend Basics (HTML/CSS/JS) (Easy) - Quiz 34
  const webFrontend = quizzes[34];
  questions.push(...[
    {
      quiz: webFrontend._id,
      subject: webFrontend.subject,
      text: 'What does HTML stand for?',
      options: ['Hyper Text Markup Language', 'Home Tool Markup Language', 'Hyperlinks Text Mark Language', 'Hyper Tool Multi Language'],
      correctIndex: 0,
      explanation: 'HTML stands for HyperText Markup Language, used for creating web page structure.',
      difficulty: 'easy'
    },
    {
      quiz: webFrontend._id,
      subject: webFrontend.subject,
      text: 'Which CSS property is used to change text color?',
      options: ['font-color', 'text-color', 'color', 'foreground-color'],
      correctIndex: 2,
      explanation: 'The CSS "color" property is used to set the color of text content.',
      difficulty: 'easy'
    },
    {
      quiz: webFrontend._id,
      subject: webFrontend.subject,
      text: 'What is the correct way to declare a JavaScript variable?',
      options: ['var x;', 'variable x;', 'declare x;', 'x variable;'],
      correctIndex: 0,
      explanation: 'In JavaScript, variables can be declared using "var", "let", or "const" keywords.',
      difficulty: 'easy'
    },
    {
      quiz: webFrontend._id,
      subject: webFrontend.subject,
      text: 'Which HTML tag is used to create a hyperlink?',
      options: ['<link>', '<href>', '<a>', '<url>'],
      correctIndex: 2,
      explanation: 'The <a> (anchor) tag is used to create hyperlinks in HTML.',
      difficulty: 'easy'
    },
    {
      quiz: webFrontend._id,
      subject: webFrontend.subject,
      text: 'What is the box model in CSS?',
      options: ['A 3D modeling technique', 'Content, padding, border, margin structure', 'A layout algorithm', 'A design pattern'],
      correctIndex: 1,
      explanation: 'CSS box model consists of content, padding, border, and margin areas around HTML elements.',
      difficulty: 'easy'
    },
    {
      quiz: webFrontend._id,
      subject: webFrontend.subject,
      text: 'Which JavaScript method adds an element to the end of an array?',
      options: ['push()', 'add()', 'append()', 'insert()'],
      correctIndex: 0,
      explanation: 'The push() method adds one or more elements to the end of an array.',
      difficulty: 'easy'
    },
    {
      quiz: webFrontend._id,
      subject: webFrontend.subject,
      text: 'What does DOM stand for?',
      options: ['Document Object Model', 'Data Object Management', 'Dynamic Object Method', 'Document Operation Mode'],
      correctIndex: 0,
      explanation: 'DOM stands for Document Object Model, representing the HTML document as a tree structure.',
      difficulty: 'easy'
    },
    {
      quiz: webFrontend._id,
      subject: webFrontend.subject,
      text: 'Which CSS property is used to make text bold?',
      options: ['text-weight', 'font-weight', 'bold', 'weight'],
      correctIndex: 1,
      explanation: 'The font-weight CSS property is used to make text bold or specify text thickness.',
      difficulty: 'easy'
    }
  ]);

  // Backend & APIs (Medium) - Quiz 35
  const webBackend = quizzes[35];
  questions.push(...[
    {
      quiz: webBackend._id,
      subject: webBackend.subject,
      text: 'What does REST stand for?',
      options: ['Reliable State Transfer', 'Representational State Transfer', 'Remote System Transfer', 'Robust Service Technology'],
      correctIndex: 1,
      explanation: 'REST stands for Representational State Transfer, an architectural style for web services.',
      difficulty: 'medium'
    },
    {
      quiz: webBackend._id,
      subject: webBackend.subject,
      text: 'Which HTTP method is used to update existing data?',
      options: ['GET', 'POST', 'PUT', 'DELETE'],
      correctIndex: 2,
      explanation: 'PUT is typically used to update existing resources, while PATCH is used for partial updates.',
      difficulty: 'medium'
    },
    {
      quiz: webBackend._id,
      subject: webBackend.subject,
      text: 'What is the purpose of middleware in web frameworks?',
      options: ['Store data', 'Process requests between client and server', 'Design user interfaces', 'Manage databases'],
      correctIndex: 1,
      explanation: 'Middleware functions execute between receiving a request and sending a response, often for authentication, logging, etc.',
      difficulty: 'medium'
    },
    {
      quiz: webBackend._id,
      subject: webBackend.subject,
      text: 'What is JSON?',
      options: ['Java Standard Object Notation', 'JavaScript Object Notation', 'Just Simple Object Names', 'Java Serialized Object Network'],
      correctIndex: 1,
      explanation: 'JSON (JavaScript Object Notation) is a lightweight data interchange format.',
      difficulty: 'medium'
    },
    {
      quiz: webBackend._id,
      subject: webBackend.subject,
      text: 'Which status code indicates a successful HTTP request?',
      options: ['404', '500', '200', '301'],
      correctIndex: 2,
      explanation: 'HTTP status code 200 indicates a successful request (OK).',
      difficulty: 'medium'
    },
    {
      quiz: webBackend._id,
      subject: webBackend.subject,
      text: 'What is CORS?',
      options: ['Cross-Origin Resource Sharing', 'Client-Origin Request System', 'Cross-Object Resource Security', 'Client-Object Request Sharing'],
      correctIndex: 0,
      explanation: 'CORS (Cross-Origin Resource Sharing) allows web applications to make requests to different domains.',
      difficulty: 'medium'
    },
    {
      quiz: webBackend._id,
      subject: webBackend.subject,
      text: 'What is the difference between SQL and NoSQL databases?',
      options: ['No difference', 'SQL is relational, NoSQL is non-relational', 'NoSQL is relational, SQL is non-relational', 'Both are same type'],
      correctIndex: 1,
      explanation: 'SQL databases are relational with structured schemas, NoSQL databases are non-relational with flexible schemas.',
      difficulty: 'medium'
    },
    {
      quiz: webBackend._id,
      subject: webBackend.subject,
      text: 'What is JWT?',
      options: ['Java Web Token', 'JavaScript Web Technology', 'JSON Web Token', 'Java Web Technology'],
      correctIndex: 2,
      explanation: 'JWT (JSON Web Token) is a compact way to transmit information securely between parties.',
      difficulty: 'medium'
    }
  ]);

  // Modern Web Technologies (Hard) - Quiz 36
  const webModern = quizzes[36];
  questions.push(...[
    {
      quiz: webModern._id,
      subject: webModern.subject,
      text: 'What is Server-Side Rendering (SSR)?',
      options: ['Rendering on client browser', 'Rendering HTML on the server before sending to client', 'Rendering images on server', 'Rendering CSS on server'],
      correctIndex: 1,
      explanation: 'SSR renders HTML on the server before sending it to the client, improving SEO and initial load performance.',
      difficulty: 'hard'
    },
    {
      quiz: webModern._id,
      subject: webModern.subject,
      text: 'What is a Service Worker?',
      options: ['A server process', 'A browser script that runs in background', 'A database worker', 'A CSS processor'],
      correctIndex: 1,
      explanation: 'Service Workers are scripts that run in the background, enabling features like offline functionality and push notifications.',
      difficulty: 'hard'
    },
    {
      quiz: webModern._id,
      subject: webModern.subject,
      text: 'What is the Virtual DOM?',
      options: ['A physical DOM copy', 'An in-memory representation of real DOM', 'A server-side DOM', 'A database for DOM elements'],
      correctIndex: 1,
      explanation: 'Virtual DOM is a programming concept where a virtual representation of the UI is kept in memory and synced with the real DOM.',
      difficulty: 'hard'
    },
    {
      quiz: webModern._id,
      subject: webModern.subject,
      text: 'What is GraphQL?',
      options: ['A graph database', 'A query language and runtime for APIs', 'A graph visualization tool', 'A SQL extension'],
      correctIndex: 1,
      explanation: 'GraphQL is a query language for APIs that allows clients to request exactly the data they need.',
      difficulty: 'hard'
    },
    {
      quiz: webModern._id,
      subject: webModern.subject,
      text: 'What is the main benefit of Progressive Web Apps (PWAs)?',
      options: ['Better SEO only', 'Native app-like experience in browsers', 'Faster development only', 'Cheaper hosting'],
      correctIndex: 1,
      explanation: 'PWAs provide native app-like experiences in web browsers, including offline functionality and device integration.',
      difficulty: 'hard'
    },
    {
      quiz: webModern._id,
      subject: webModern.subject,
      text: 'What is code splitting in web development?',
      options: ['Dividing developers into teams', 'Breaking code into smaller chunks loaded on demand', 'Splitting CSS from JavaScript', 'Dividing backend from frontend'],
      correctIndex: 1,
      explanation: 'Code splitting breaks the application code into smaller chunks that can be loaded on demand, improving performance.',
      difficulty: 'hard'
    },
    {
      quiz: webModern._id,
      subject: webModern.subject,
      text: 'What is the purpose of WebSockets?',
      options: ['Store web data', 'Enable real-time bidirectional communication', 'Secure web connections', 'Optimize web images'],
      correctIndex: 1,
      explanation: 'WebSockets provide full-duplex communication channels over a single TCP connection, enabling real-time features.',
      difficulty: 'hard'
    },
    {
      quiz: webModern._id,
      subject: webModern.subject,
      text: 'What is micro-frontend architecture?',
      options: ['Small frontend applications', 'Decomposing frontend into smaller, independent parts', 'Minimalist UI design', 'Mobile-first design'],
      correctIndex: 1,
      explanation: 'Micro-frontend architecture decomposes frontend applications into smaller, independently deployable parts.',
      difficulty: 'hard'
    }
  ]);

  // SOFTWARE ENGINEERING QUESTIONS
  // SDLC & Methodologies (Easy) - Quiz 37
  const sweSdlc = quizzes[37];
  questions.push(...[
    {
      quiz: sweSdlc._id,
      subject: sweSdlc.subject,
      text: 'What does SDLC stand for?',
      options: ['Software Development Life Cycle', 'System Design Life Cycle', 'Software Design Learning Course', 'System Development Learning Cycle'],
      correctIndex: 0,
      explanation: 'SDLC stands for Software Development Life Cycle, the process of developing software applications.',
      difficulty: 'easy'
    },
    {
      quiz: sweSdlc._id,
      subject: sweSdlc.subject,
      text: 'Which phase comes first in the traditional SDLC?',
      options: ['Design', 'Implementation', 'Requirements Gathering', 'Testing'],
      correctIndex: 2,
      explanation: 'Requirements Gathering is typically the first phase where project needs and specifications are identified.',
      difficulty: 'easy'
    },
    {
      quiz: sweSdlc._id,
      subject: sweSdlc.subject,
      text: 'What is the main characteristic of Agile methodology?',
      options: ['Detailed documentation', 'Iterative development', 'Fixed requirements', 'No customer interaction'],
      correctIndex: 1,
      explanation: 'Agile methodology emphasizes iterative development with frequent releases and adaptability to change.',
      difficulty: 'easy'
    },
    {
      quiz: sweSdlc._id,
      subject: sweSdlc.subject,
      text: 'What is a sprint in Scrum?',
      options: ['A running exercise', 'A time-boxed iteration', 'A project milestone', 'A testing phase'],
      correctIndex: 1,
      explanation: 'A sprint is a time-boxed iteration in Scrum, typically lasting 1-4 weeks, where specific work is completed.',
      difficulty: 'easy'
    },
    {
      quiz: sweSdlc._id,
      subject: sweSdlc.subject,
      text: 'What is the waterfall model?',
      options: ['A sequential development process', 'An iterative process', 'A testing methodology', 'A design pattern'],
      correctIndex: 0,
      explanation: 'Waterfall model is a sequential development process where each phase must be completed before the next begins.',
      difficulty: 'easy'
    },
    {
      quiz: sweSdlc._id,
      subject: sweSdlc.subject,
      text: 'Who is responsible for defining user stories in Agile?',
      options: ['Developers', 'Product Owner', 'Scrum Master', 'Testers'],
      correctIndex: 1,
      explanation: 'The Product Owner is responsible for defining user stories and maintaining the product backlog.',
      difficulty: 'easy'
    },
    {
      quiz: sweSdlc._id,
      subject: sweSdlc.subject,
      text: 'What is the main purpose of version control systems?',
      options: ['Run applications', 'Track changes to code over time', 'Test software', 'Design interfaces'],
      correctIndex: 1,
      explanation: 'Version control systems track changes to code over time, enabling collaboration and maintaining history.',
      difficulty: 'easy'
    },
    {
      quiz: sweSdlc._id,
      subject: sweSdlc.subject,
      text: 'What does MVP stand for in software development?',
      options: ['Most Valuable Player', 'Minimum Viable Product', 'Maximum Value Proposition', 'Multi-Version Platform'],
      correctIndex: 1,
      explanation: 'MVP stands for Minimum Viable Product - the simplest version that provides value to users.',
      difficulty: 'easy'
    }
  ]);

  // Testing & Quality Assurance (Medium) - Quiz 38
  const sweTesting = quizzes[38];
  questions.push(...[
    {
      quiz: sweTesting._id,
      subject: sweTesting.subject,
      text: 'What is unit testing?',
      options: ['Testing entire application', 'Testing individual components in isolation', 'Testing user interface', 'Testing database connections'],
      correctIndex: 1,
      explanation: 'Unit testing involves testing individual components or modules in isolation to ensure they work correctly.',
      difficulty: 'medium'
    },
    {
      quiz: sweTesting._id,
      subject: sweTesting.subject,
      text: 'What is the difference between black box and white box testing?',
      options: ['No difference', 'Black box tests functionality, white box tests internal structure', 'White box tests functionality, black box tests structure', 'Both test the same thing'],
      correctIndex: 1,
      explanation: 'Black box testing focuses on functionality without knowledge of internal structure; white box testing examines internal logic.',
      difficulty: 'medium'
    },
    {
      quiz: sweTesting._id,
      subject: sweTesting.subject,
      text: 'What is regression testing?',
      options: ['Testing new features only', 'Re-testing existing functionality after changes', 'Performance testing', 'Security testing'],
      correctIndex: 1,
      explanation: 'Regression testing ensures that existing functionality still works correctly after code changes or new feature additions.',
      difficulty: 'medium'
    },
    {
      quiz: sweTesting._id,
      subject: sweTesting.subject,
      text: 'What is Test-Driven Development (TDD)?',
      options: ['Writing tests after code', 'Writing tests before code', 'Testing by developers only', 'Automated testing only'],
      correctIndex: 1,
      explanation: 'TDD is a development approach where tests are written before the actual code implementation.',
      difficulty: 'medium'
    },
    {
      quiz: sweTesting._id,
      subject: sweTesting.subject,
      text: 'What is a mock object in testing?',
      options: ['A real object', 'A simulated object that mimics real object behavior', 'A broken object', 'A database object'],
      correctIndex: 1,
      explanation: 'Mock objects simulate the behavior of real objects, allowing isolated testing of components.',
      difficulty: 'medium'
    },
    {
      quiz: sweTesting._id,
      subject: sweTesting.subject,
      text: 'What is code coverage?',
      options: ['Number of lines of code', 'Percentage of code exercised by tests', 'Code documentation level', 'Code complexity measure'],
      correctIndex: 1,
      explanation: 'Code coverage measures the percentage of code that is executed during testing.',
      difficulty: 'medium'
    },
    {
      quiz: sweTesting._id,
      subject: sweTesting.subject,
      text: 'What is integration testing?',
      options: ['Testing individual units', 'Testing interaction between components', 'Testing user interface only', 'Testing performance only'],
      correctIndex: 1,
      explanation: 'Integration testing verifies that different components work correctly when integrated together.',
      difficulty: 'medium'
    },
    {
      quiz: sweTesting._id,
      subject: sweTesting.subject,
      text: 'What is the purpose of load testing?',
      options: ['Test loading speed only', 'Test application behavior under expected load', 'Test data loading', 'Test file uploads'],
      correctIndex: 1,
      explanation: 'Load testing evaluates how an application performs under expected user load and usage patterns.',
      difficulty: 'medium'
    }
  ]);

  // Software Architecture (Hard) - Quiz 39
  const sweArchitecture = quizzes[39];
  questions.push(...[
    {
      quiz: sweArchitecture._id,
      subject: sweArchitecture.subject,
      text: 'What is microservices architecture?',
      options: ['Small applications only', 'Architectural pattern with loosely coupled services', 'Single large application', 'Client-server architecture only'],
      correctIndex: 1,
      explanation: 'Microservices architecture structures applications as collections of loosely coupled, independently deployable services.',
      difficulty: 'hard'
    },
    {
      quiz: sweArchitecture._id,
      subject: sweArchitecture.subject,
      text: 'What is the SOLID principle in software design?',
      options: ['A coding standard', 'Five design principles for maintainable code', 'A testing framework', 'A database design rule'],
      correctIndex: 1,
      explanation: 'SOLID consists of five design principles: Single Responsibility, Open-Closed, Liskov Substitution, Interface Segregation, Dependency Inversion.',
      difficulty: 'hard'
    },
    {
      quiz: sweArchitecture._id,
      subject: sweArchitecture.subject,
      text: 'What is Domain-Driven Design (DDD)?',
      options: ['Database design approach', 'Approach focusing on business domain modeling', 'User interface design method', 'Testing strategy'],
      correctIndex: 1,
      explanation: 'DDD is an approach to software development that focuses on modeling the business domain and its logic.',
      difficulty: 'hard'
    },
    {
      quiz: sweArchitecture._id,
      subject: sweArchitecture.subject,
      text: 'What is the purpose of an API Gateway in microservices?',
      options: ['Store data', 'Single entry point for client requests', 'Process payments', 'Generate reports'],
      correctIndex: 1,
      explanation: 'API Gateway serves as a single entry point for client requests, handling routing, authentication, and cross-cutting concerns.',
      difficulty: 'hard'
    },
    {
      quiz: sweArchitecture._id,
      subject: sweArchitecture.subject,
      text: 'What is event-driven architecture?',
      options: ['Architecture based on user events only', 'Architecture where components communicate through events', 'Web-only architecture', 'Database-centric architecture'],
      correctIndex: 1,
      explanation: 'Event-driven architecture uses events as the primary mechanism for communication between decoupled services.',
      difficulty: 'hard'
    },
    {
      quiz: sweArchitecture._id,
      subject: sweArchitecture.subject,
      text: 'What is technical debt?',
      options: ['Money owed for software', 'Cost of additional work caused by choosing easy solution', 'Hardware costs', 'Licensing fees'],
      correctIndex: 1,
      explanation: 'Technical debt represents the future cost of additional work required due to choosing quick/easy solutions over better approaches.',
      difficulty: 'hard'
    },
    {
      quiz: sweArchitecture._id,
      subject: sweArchitecture.subject,
      text: 'What is the Command Query Responsibility Segregation (CQRS) pattern?',
      options: ['A database pattern', 'Separating read and write operations', 'A testing pattern', 'A security pattern'],
      correctIndex: 1,
      explanation: 'CQRS separates read and write operations, using different models for querying and updating data.',
      difficulty: 'hard'
    },
    {
      quiz: sweArchitecture._id,
      subject: sweArchitecture.subject,
      text: 'What is the Circuit Breaker pattern?',
      options: ['Hardware failure protection', 'Pattern to prevent cascading failures in distributed systems', 'Database connection pattern', 'UI design pattern'],
      correctIndex: 1,
      explanation: 'Circuit Breaker pattern prevents cascading failures by monitoring service calls and stopping requests to failing services.',
      difficulty: 'hard'
    }
  ]);

  // CYBERSECURITY QUESTIONS
  // Security Fundamentals (Easy) - Quiz 40
  const cyberFundamentals = quizzes[40];
  questions.push(...[
    {
      quiz: cyberFundamentals._id,
      subject: cyberFundamentals.subject,
      text: 'What are the three pillars of information security (CIA Triad)?',
      options: ['Confidentiality, Integrity, Availability', 'Control, Identity, Access', 'Cyber, Information, Assurance', 'Computer, Internet, Application'],
      correctIndex: 0,
      explanation: 'The CIA Triad consists of Confidentiality, Integrity, and Availability - the core principles of information security.',
      difficulty: 'easy'
    },
    {
      quiz: cyberFundamentals._id,
      subject: cyberFundamentals.subject,
      text: 'What is malware?',
      options: ['Good software', 'Malicious software designed to harm systems', 'Hardware component', 'Network protocol'],
      correctIndex: 1,
      explanation: 'Malware (malicious software) is designed to disrupt, damage, or gain unauthorized access to computer systems.',
      difficulty: 'easy'
    },
    {
      quiz: cyberFundamentals._id,
      subject: cyberFundamentals.subject,
      text: 'What is a firewall?',
      options: ['A wall made of fire', 'A network security device that monitors traffic', 'An antivirus software', 'A backup system'],
      correctIndex: 1,
      explanation: 'A firewall is a network security device that monitors and controls incoming and outgoing network traffic.',
      difficulty: 'easy'
    },
    {
      quiz: cyberFundamentals._id,
      subject: cyberFundamentals.subject,
      text: 'What is phishing?',
      options: ['Catching fish', 'Fraudulent attempt to obtain sensitive information', 'Network scanning', 'Data encryption'],
      correctIndex: 1,
      explanation: 'Phishing is a fraudulent attempt to obtain sensitive information by disguising as a trustworthy entity.',
      difficulty: 'easy'
    },
    {
      quiz: cyberFundamentals._id,
      subject: cyberFundamentals.subject,
      text: 'What is two-factor authentication (2FA)?',
      options: ['Using two passwords', 'Security process using two different authentication factors', 'Two security guards', 'Two antivirus programs'],
      correctIndex: 1,
      explanation: '2FA is a security process where users provide two different authentication factors to verify their identity.',
      difficulty: 'easy'
    },
    {
      quiz: cyberFundamentals._id,
      subject: cyberFundamentals.subject,
      text: 'What is encryption?',
      options: ['Making data unreadable without proper key', 'Compressing files', 'Backing up data', 'Sharing files'],
      correctIndex: 0,
      explanation: 'Encryption converts data into an unreadable format that requires a key to decrypt and access.',
      difficulty: 'easy'
    },
    {
      quiz: cyberFundamentals._id,
      subject: cyberFundamentals.subject,
      text: 'What is social engineering?',
      options: ['Building social networks', 'Manipulating people to divulge confidential information', 'Engineering social media', 'Creating social apps'],
      correctIndex: 1,
      explanation: 'Social engineering manipulates people psychologically to divulge confidential information or perform actions that compromise security.',
      difficulty: 'easy'
    },
    {
      quiz: cyberFundamentals._id,
      subject: cyberFundamentals.subject,
      text: 'What is a vulnerability?',
      options: ['A security strength', 'A weakness that can be exploited by threats', 'A type of malware', 'A network protocol'],
      correctIndex: 1,
      explanation: 'A vulnerability is a weakness in a system that can be exploited by threats to gain unauthorized access or cause harm.',
      difficulty: 'easy'
    }
  ]);

  // Network Security & Cryptography (Medium) - Quiz 41
  const cyberNetwork = quizzes[41];
  questions.push(...[
    {
      quiz: cyberNetwork._id,
      subject: cyberNetwork.subject,
      text: 'What is the difference between symmetric and asymmetric encryption?',
      options: ['No difference', 'Symmetric uses same key, asymmetric uses public/private key pair', 'Asymmetric uses same key, symmetric uses different keys', 'Both are identical'],
      correctIndex: 1,
      explanation: 'Symmetric encryption uses the same key for encryption and decryption; asymmetric uses a public/private key pair.',
      difficulty: 'medium'
    },
    {
      quiz: cyberNetwork._id,
      subject: cyberNetwork.subject,
      text: 'What is a VPN?',
      options: ['Very Private Network', 'Virtual Private Network', 'Verified Public Network', 'Visual Programming Network'],
      correctIndex: 1,
      explanation: 'VPN (Virtual Private Network) creates a secure, encrypted connection over the internet.',
      difficulty: 'medium'
    },
    {
      quiz: cyberNetwork._id,
      subject: cyberNetwork.subject,
      text: 'What is SSL/TLS?',
      options: ['Programming language', 'Cryptographic protocols for secure communication', 'Database system', 'Operating system'],
      correctIndex: 1,
      explanation: 'SSL/TLS are cryptographic protocols that provide secure communication over computer networks.',
      difficulty: 'medium'
    },
    {
      quiz: cyberNetwork._id,
      subject: cyberNetwork.subject,
      text: 'What is a man-in-the-middle attack?',
      options: ['Physical attack', 'Intercepting communications between two parties', 'Database attack', 'Social engineering'],
      correctIndex: 1,
      explanation: 'Man-in-the-middle attack intercepts and potentially alters communications between two parties without their knowledge.',
      difficulty: 'medium'
    },
    {
      quiz: cyberNetwork._id,
      subject: cyberNetwork.subject,
      text: 'What is hashing in cybersecurity?',
      options: ['Encrypting data', 'Creating fixed-size output from variable input', 'Compressing files', 'Scanning networks'],
      correctIndex: 1,
      explanation: 'Hashing creates a fixed-size output (hash) from variable-size input, commonly used for data integrity verification.',
      difficulty: 'medium'
    },
    {
      quiz: cyberNetwork._id,
      subject: cyberNetwork.subject,
      text: 'What is an intrusion detection system (IDS)?',
      options: ['System to create intrusions', 'System that monitors network for suspicious activities', 'Antivirus software', 'Backup system'],
      correctIndex: 1,
      explanation: 'IDS monitors network or system activities for malicious activities or policy violations.',
      difficulty: 'medium'
    },
    {
      quiz: cyberNetwork._id,
      subject: cyberNetwork.subject,
      text: 'What is the purpose of digital certificates?',
      options: ['Store passwords', 'Verify identity and establish secure connections', 'Compress data', 'Scan for malware'],
      correctIndex: 1,
      explanation: 'Digital certificates verify the identity of entities and help establish secure, encrypted connections.',
      difficulty: 'medium'
    },
    {
      quiz: cyberNetwork._id,
      subject: cyberNetwork.subject,
      text: 'What is penetration testing?',
      options: ['Breaking into buildings', 'Authorized testing of system security', 'Installing software', 'Network configuration'],
      correctIndex: 1,
      explanation: 'Penetration testing is authorized simulated cyber attacks to evaluate system security.',
      difficulty: 'medium'
    }
  ]);

  // Advanced Threats & Incident Response (Hard) - Quiz 42  
  const cyberIncident = quizzes[42];
  questions.push(...[
    {
      quiz: cyberIncident._id,
      subject: cyberIncident.subject,
      text: 'What is an Advanced Persistent Threat (APT)?',
      options: ['Quick malware attack', 'Long-term stealthy cyber attack campaign', 'Antivirus software', 'Network protocol'],
      correctIndex: 1,
      explanation: 'APT is a prolonged and targeted cyber attack where intruders gain access and remain undetected for extended periods.',
      difficulty: 'hard'
    },
    {
      quiz: cyberIncident._id,
      subject: cyberIncident.subject,
      text: 'What is zero-day vulnerability?',
      options: ['A vulnerability with no impact', 'Unknown vulnerability with no available patch', 'A vulnerability discovered today', 'A patched vulnerability'],
      correctIndex: 1,
      explanation: 'Zero-day vulnerability is an unknown security flaw that has no available patch or fix.',
      difficulty: 'hard'
    },
    {
      quiz: cyberIncident._id,
      subject: cyberIncident.subject,
      text: 'What is the first step in incident response?',
      options: ['Eradication', 'Recovery', 'Identification', 'Lessons learned'],
      correctIndex: 2,
      explanation: 'Identification is the first step in incident response - detecting and determining if an incident has occurred.',
      difficulty: 'hard'
    },
    {
      quiz: cyberIncident._id,
      subject: cyberIncident.subject,
      text: 'What is ransomware?',
      options: ['Free software', 'Malware that encrypts data and demands payment', 'Antivirus software', 'Network monitoring tool'],
      correctIndex: 1,
      explanation: 'Ransomware encrypts victim\'s files and demands payment for the decryption key.',
      difficulty: 'hard'
    },
    {
      quiz: cyberIncident._id,
      subject: cyberIncident.subject,
      text: 'What is digital forensics?',
      options: ['Creating digital art', 'Investigation and analysis of digital evidence', 'Software development', 'Network design'],
      correctIndex: 1,
      explanation: 'Digital forensics involves investigation, recovery, and analysis of digital evidence from computing devices.',
      difficulty: 'hard'
    },
    {
      quiz: cyberIncident._id,
      subject: cyberIncident.subject,
      text: 'What is threat modeling?',
      options: ['Creating 3D models', 'Systematic approach to identifying security threats', 'Modeling network topology', 'Creating user models'],
      correctIndex: 1,
      explanation: 'Threat modeling is a structured approach to identifying, categorizing, and analyzing potential security threats.',
      difficulty: 'hard'
    },
    {
      quiz: cyberIncident._id,
      subject: cyberIncident.subject,
      text: 'What is the MITRE ATT&CK framework?',
      options: ['Antivirus software', 'Knowledge base of adversary tactics and techniques', 'Programming language', 'Database system'],
      correctIndex: 1,
      explanation: 'MITRE ATT&CK is a globally accessible knowledge base of adversary tactics and techniques based on real-world observations.',
      difficulty: 'hard'
    },
    {
      quiz: cyberIncident._id,
      subject: cyberIncident.subject,
      text: 'What is a honeypot in cybersecurity?',
      options: ['Sweet trap for hackers', 'Decoy system to detect and analyze attacks', 'Password storage', 'Backup system'],
      correctIndex: 1,
      explanation: 'A honeypot is a decoy system designed to attract and detect unauthorized access attempts.',
      difficulty: 'hard'
    }
  ]);

  // MACHINE LEARNING QUESTIONS
  // ML Fundamentals (Easy) - Quiz 43
  const mlFundamentals = quizzes[43];
  questions.push(...[
    {
      quiz: mlFundamentals._id,
      subject: mlFundamentals.subject,
      text: 'What is Machine Learning?',
      options: ['Programming machines manually', 'Algorithms that learn patterns from data', 'Building physical machines', 'Network configuration'],
      correctIndex: 1,
      explanation: 'Machine Learning is a subset of AI where algorithms learn patterns from data to make predictions or decisions.',
      difficulty: 'easy'
    },
    {
      quiz: mlFundamentals._id,
      subject: mlFundamentals.subject,
      text: 'What are the three main types of machine learning?',
      options: ['Fast, Medium, Slow', 'Supervised, Unsupervised, Reinforcement', 'Easy, Medium, Hard', 'Simple, Complex, Advanced'],
      correctIndex: 1,
      explanation: 'The three main types are Supervised (labeled data), Unsupervised (unlabeled data), and Reinforcement learning.',
      difficulty: 'easy'
    },
    {
      quiz: mlFundamentals._id,
      subject: mlFundamentals.subject,
      text: 'What is supervised learning?',
      options: ['Learning without data', 'Learning from labeled training data', 'Learning by trial and error', 'Learning from unlabeled data'],
      correctIndex: 1,
      explanation: 'Supervised learning uses labeled training data to learn a mapping from inputs to outputs.',
      difficulty: 'easy'
    },
    {
      quiz: mlFundamentals._id,
      subject: mlFundamentals.subject,
      text: 'What is the difference between classification and regression?',
      options: ['No difference', 'Classification predicts categories, regression predicts continuous values', 'Regression predicts categories, classification predicts values', 'Both are same'],
      correctIndex: 1,
      explanation: 'Classification predicts discrete categories/classes, while regression predicts continuous numerical values.',
      difficulty: 'easy'
    },
    {
      quiz: mlFundamentals._id,
      subject: mlFundamentals.subject,
      text: 'What is training data?',
      options: ['Data for testing', 'Data used to train machine learning models', 'Data for validation', 'Production data'],
      correctIndex: 1,
      explanation: 'Training data is the dataset used to train machine learning algorithms to learn patterns.',
      difficulty: 'easy'
    },
    {
      quiz: mlFundamentals._id,
      subject: mlFundamentals.subject,
      text: 'What is overfitting?',
      options: ['Model performs well on all data', 'Model memorizes training data but performs poorly on new data', 'Model is too simple', 'Model trains too quickly'],
      correctIndex: 1,
      explanation: 'Overfitting occurs when a model learns the training data too well, including noise, leading to poor generalization.',
      difficulty: 'easy'
    },
    {
      quiz: mlFundamentals._id,
      subject: mlFundamentals.subject,
      text: 'What is a feature in machine learning?',
      options: ['A bug in code', 'An individual measurable property of an observed phenomenon', 'A type of algorithm', 'A programming language'],
      correctIndex: 1,
      explanation: 'A feature is an individual measurable property or characteristic of the data being analyzed.',
      difficulty: 'easy'
    },
    {
      quiz: mlFundamentals._id,
      subject: mlFundamentals.subject,
      text: 'What is the purpose of splitting data into training and testing sets?',
      options: ['To use less data', 'To evaluate model performance on unseen data', 'To speed up training', 'To reduce complexity'],
      correctIndex: 1,
      explanation: 'Data is split to train the model on one set and evaluate its performance on unseen test data.',
      difficulty: 'easy'
    }
  ]);

  // CLOUD COMPUTING QUESTIONS
  // Cloud Fundamentals (Easy) - Quiz 44
  const cloudFundamentals = quizzes[44];
  questions.push(...[
    {
      quiz: cloudFundamentals._id,
      subject: cloudFundamentals.subject,
      text: 'What is cloud computing?',
      options: ['Computing in the sky', 'Delivery of computing services over the internet', 'Local computer processing', 'Weather prediction'],
      correctIndex: 1,
      explanation: 'Cloud computing is the delivery of computing services (servers, storage, databases, etc.) over the internet.',
      difficulty: 'easy'
    },
    {
      quiz: cloudFundamentals._id,
      subject: cloudFundamentals.subject,
      text: 'What are the three main cloud service models?',
      options: ['IaaS, PaaS, SaaS', 'AWS, Azure, GCP', 'Public, Private, Hybrid', 'Small, Medium, Large'],
      correctIndex: 0,
      explanation: 'The three service models are Infrastructure as a Service (IaaS), Platform as a Service (PaaS), and Software as a Service (SaaS).',
      difficulty: 'easy'
    },
    {
      quiz: cloudFundamentals._id,
      subject: cloudFundamentals.subject,
      text: 'What is SaaS?',
      options: ['Software as a Service', 'Security as a Service', 'Storage as a Service', 'System as a Service'],
      correctIndex: 0,
      explanation: 'SaaS (Software as a Service) delivers software applications over the internet on a subscription basis.',
      difficulty: 'easy'
    },
    {
      quiz: cloudFundamentals._id,
      subject: cloudFundamentals.subject,
      text: 'What is the main advantage of cloud computing?',
      options: ['More expensive', 'Scalability and flexibility', 'Slower performance', 'Local control only'],
      correctIndex: 1,
      explanation: 'Cloud computing offers scalability, flexibility, cost-effectiveness, and accessibility from anywhere.',
      difficulty: 'easy'
    },
    {
      quiz: cloudFundamentals._id,
      subject: cloudFundamentals.subject,
      text: 'What is a public cloud?',
      options: ['Government cloud only', 'Cloud services available to general public over internet', 'Free cloud services', 'Local network cloud'],
      correctIndex: 1,
      explanation: 'Public cloud provides services to multiple customers over the internet, shared among many organizations.',
      difficulty: 'easy'
    },
    {
      quiz: cloudFundamentals._id,
      subject: cloudFundamentals.subject,
      text: 'What is virtualization?',
      options: ['Making things virtual', 'Creating virtual versions of physical resources', 'Internet connection', 'Cloud storage'],
      correctIndex: 1,
      explanation: 'Virtualization creates virtual versions of physical computing resources like servers, storage, and networks.',
      difficulty: 'easy'
    },
    {
      quiz: cloudFundamentals._id,
      subject: cloudFundamentals.subject,
      text: 'What does elasticity mean in cloud computing?',
      options: ['Flexible payment', 'Ability to scale resources up or down based on demand', 'Rubber-like properties', 'Network flexibility'],
      correctIndex: 1,
      explanation: 'Elasticity is the ability to automatically scale computing resources up or down based on current demand.',
      difficulty: 'easy'
    },
    {
      quiz: cloudFundamentals._id,
      subject: cloudFundamentals.subject,
      text: 'Which of the following is a major cloud service provider?',
      options: ['Microsoft Excel', 'Amazon Web Services', 'Adobe Photoshop', 'Google Chrome'],
      correctIndex: 1,
      explanation: 'Amazon Web Services (AWS) is one of the major cloud service providers, along with Microsoft Azure and Google Cloud.',
      difficulty: 'easy'
    }
  ]);

  // Advanced Cloud Services (Medium) - Quiz 45
  const cloudAdvanced = quizzes[45];
  questions.push(...[
    {
      quiz: cloudAdvanced._id,
      subject: cloudAdvanced.subject,
      text: 'What is containerization?',
      options: ['Shipping containers', 'Packaging applications with their dependencies', 'Storage method', 'Network protocol'],
      correctIndex: 1,
      explanation: 'Containerization packages applications and their dependencies into lightweight, portable containers.',
      difficulty: 'medium'
    },
    {
      quiz: cloudAdvanced._id,
      subject: cloudAdvanced.subject,
      text: 'What is Kubernetes?',
      options: ['A programming language', 'Container orchestration platform', 'Database system', 'Web browser'],
      correctIndex: 1,
      explanation: 'Kubernetes is an open-source container orchestration platform for automating deployment, scaling, and management of containerized applications.',
      difficulty: 'medium'
    },
    {
      quiz: cloudAdvanced._id,
      subject: cloudAdvanced.subject,
      text: 'What is serverless computing?',
      options: ['Computing without servers', 'Cloud execution model where provider manages servers', 'Local computing only', 'Manual server management'],
      correctIndex: 1,
      explanation: 'Serverless computing is a cloud execution model where the cloud provider manages server infrastructure automatically.',
      difficulty: 'medium'
    },
    {
      quiz: cloudAdvanced._id,
      subject: cloudAdvanced.subject,
      text: 'What is a CDN?',
      options: ['Cloud Data Network', 'Content Delivery Network', 'Central Database Node', 'Customer Data Network'],
      correctIndex: 1,
      explanation: 'CDN (Content Delivery Network) is a distributed network of servers that delivers content to users from nearby locations.',
      difficulty: 'medium'
    },
    {
      quiz: cloudAdvanced._id,
      subject: cloudAdvanced.subject,
      text: 'What is load balancing?',
      options: ['Balancing server weight', 'Distributing incoming requests across multiple servers', 'Checking server balance', 'Financial load management'],
      correctIndex: 1,
      explanation: 'Load balancing distributes incoming network traffic across multiple servers to ensure high availability and performance.',
      difficulty: 'medium'
    },
    {
      quiz: cloudAdvanced._id,
      subject: cloudAdvanced.subject,
      text: 'What is auto-scaling?',
      options: ['Manual scaling', 'Automatically adjusting resources based on demand', 'Fixed scaling', 'No scaling'],
      correctIndex: 1,
      explanation: 'Auto-scaling automatically adjusts computing resources up or down based on current demand and predefined rules.',
      difficulty: 'medium'
    },
    {
      quiz: cloudAdvanced._id,
      subject: cloudAdvanced.subject,
      text: 'What is multi-cloud strategy?',
      options: ['Using one cloud provider', 'Using multiple cloud providers', 'Avoiding cloud entirely', 'Using only private clouds'],
      correctIndex: 1,
      explanation: 'Multi-cloud strategy involves using services from multiple cloud providers to avoid vendor lock-in and improve resilience.',
      difficulty: 'medium'
    },
    {
      quiz: cloudAdvanced._id,
      subject: cloudAdvanced.subject,
      text: 'What is Infrastructure as Code (IaC)?',
      options: ['Writing infrastructure manually', 'Managing infrastructure through code', 'Infrastructure documentation', 'Hardware coding'],
      correctIndex: 1,
      explanation: 'IaC manages and provisions infrastructure through machine-readable definition files rather than manual processes.',
      difficulty: 'medium'
    }
  ]);

  // DevOps & Cloud Architecture (Hard) - Quiz 46
  const cloudDevOps = quizzes[46];
  questions.push(...[
    {
      quiz: cloudDevOps._id,
      subject: cloudDevOps.subject,
      text: 'What is the main principle of DevOps?',
      options: ['Separate development and operations', 'Collaboration between development and operations teams', 'Focus only on development', 'Focus only on operations'],
      correctIndex: 1,
      explanation: 'DevOps emphasizes collaboration and communication between development and operations teams throughout the software lifecycle.',
      difficulty: 'hard'
    },
    {
      quiz: cloudDevOps._id,
      subject: cloudDevOps.subject,
      text: 'What is CI/CD?',
      options: ['Continuous Integration/Continuous Deployment', 'Computer Integration/Computer Deployment', 'Cloud Integration/Cloud Development', 'Code Integration/Code Deployment'],
      correctIndex: 0,
      explanation: 'CI/CD stands for Continuous Integration and Continuous Deployment, automating the software delivery pipeline.',
      difficulty: 'hard'
    },
    {
      quiz: cloudDevOps._id,
      subject: cloudDevOps.subject,
      text: 'What is a microservice architecture in cloud context?',
      options: ['Small applications', 'Architecture with many small, independent services', 'Single large service', 'Hardware architecture'],
      correctIndex: 1,
      explanation: 'Microservice architecture structures applications as collections of loosely coupled, independently deployable services.',
      difficulty: 'hard'
    },
    {
      quiz: cloudDevOps._id,
      subject: cloudDevOps.subject,
      text: 'What is blue-green deployment?',
      options: ['Color-coded deployment', 'Deployment strategy with two identical environments', 'Deployment during day and night', 'Deployment by two teams'],
      correctIndex: 1,
      explanation: 'Blue-green deployment uses two identical production environments, switching traffic between them for zero-downtime deployments.',
      difficulty: 'hard'
    },
    {
      quiz: cloudDevOps._id,
      subject: cloudDevOps.subject,
      text: 'What is immutable infrastructure?',
      options: ['Infrastructure that never changes', 'Infrastructure replaced rather than modified', 'Infrastructure that can\'t be deleted', 'Fixed-size infrastructure'],
      correctIndex: 1,
      explanation: 'Immutable infrastructure is replaced entirely rather than being modified in place, improving consistency and reliability.',
      difficulty: 'hard'
    },
    {
      quiz: cloudDevOps._id,
      subject: cloudDevOps.subject,
      text: 'What is service mesh?',
      options: ['Network of services', 'Infrastructure layer handling service communication', 'Database connections', 'User interface pattern'],
      correctIndex: 1,
      explanation: 'Service mesh is a dedicated infrastructure layer that handles service-to-service communication in microservices architectures.',
      difficulty: 'hard'
    },
    {
      quiz: cloudDevOps._id,
      subject: cloudDevOps.subject,
      text: 'What is observability in cloud systems?',
      options: ['Visual monitoring only', 'Ability to understand system internal state from external outputs', 'Manual inspection', 'Code review process'],
      correctIndex: 1,
      explanation: 'Observability is the ability to understand the internal state of systems through external outputs like metrics, logs, and traces.',
      difficulty: 'hard'
    },
    {
      quiz: cloudDevOps._id,
      subject: cloudDevOps.subject,
      text: 'What is chaos engineering?',
      options: ['Random programming', 'Deliberately introducing failures to test system resilience', 'Disorganized development', 'Breaking systems permanently'],
      correctIndex: 1,
      explanation: 'Chaos engineering deliberately introduces failures into systems to test and improve their resilience and reliability.',
      difficulty: 'hard'
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