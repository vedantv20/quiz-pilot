require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import models
const { User, Subject, Quiz, Question, Attempt, Survey, Bookmark } = require('../models');

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
  console.log('✅ Database cleared');
};

const createUsers = async () => {
  console.log('👥 Creating users...');
  
  const users = [
    {
      name: 'Admin User',
      email: 'admin@quizpilot.com',
      passwordHash: await bcrypt.hash('Admin@123', 12),
      role: 'admin',
      createdAt: new Date('2024-01-15')
    },
    {
      name: 'Dr. Sarah Johnson',
      email: 'teacher@quizpilot.com',
      passwordHash: await bcrypt.hash('Teacher@123', 12),
      role: 'teacher',
      targetExam: 'JEE',
      streak: 15,
      badges: ['first_quiz', 'streak_7'],
      lastActiveDate: new Date(),
      createdAt: new Date('2024-02-01')
    },
    {
      name: 'Rahul Sharma',
      email: 'student1@quizpilot.com',
      passwordHash: await bcrypt.hash('Student@123', 12),
      role: 'student',
      targetExam: 'JEE',
      streak: 7,
      badges: ['first_quiz', 'streak_7'],
      lastActiveDate: new Date(),
      createdAt: new Date('2024-03-01')
    },
    {
      name: 'Priya Patel',
      email: 'student2@quizpilot.com',
      passwordHash: await bcrypt.hash('Student@123', 12),
      role: 'student',
      targetExam: 'NEET',
      streak: 3,
      badges: ['first_quiz', 'perfect_score'],
      lastActiveDate: new Date(),
      createdAt: new Date('2024-03-15')
    },
    {
      name: 'Arjun Kumar',
      email: 'student3@quizpilot.com',
      passwordHash: await bcrypt.hash('Student@123', 12),
      role: 'student',
      targetExam: 'GATE',
      streak: 12,
      badges: ['first_quiz', 'streak_7', 'subject_master_mathematics'],
      lastActiveDate: new Date(),
      createdAt: new Date('2024-02-20')
    }
  ];

  const createdUsers = await User.insertMany(users);
  console.log('✅ Users created');
  return createdUsers;
};

const createSubjects = async (adminUser) => {
  console.log('📚 Creating subjects...');
  
  const subjects = [
    {
      name: 'Mathematics',
      icon: '➕',
      description: 'Pure and applied mathematics including algebra, calculus, geometry',
      createdBy: adminUser._id,
      createdAt: new Date('2024-01-20')
    },
    {
      name: 'Physics',
      icon: '⚛️',
      description: 'Classical and modern physics including mechanics, thermodynamics, electromagnetism',
      createdBy: adminUser._id,
      createdAt: new Date('2024-01-20')
    },
    {
      name: 'Chemistry',
      icon: '🧪',
      description: 'Organic, inorganic, and physical chemistry',
      createdBy: adminUser._id,
      createdAt: new Date('2024-01-20')
    },
    {
      name: 'Biology',
      icon: '🧬',
      description: 'Botany, zoology, genetics, and molecular biology',
      createdBy: adminUser._id,
      createdAt: new Date('2024-01-20')
    },
    {
      name: 'Computer Science',
      icon: '💻',
      description: 'Programming, algorithms, data structures, and computer systems',
      createdBy: adminUser._id,
      createdAt: new Date('2024-01-20')
    },
    {
      name: 'History',
      icon: '📜',
      description: 'World history, Indian history, and historical analysis',
      createdBy: adminUser._id,
      createdAt: new Date('2024-01-20')
    }
  ];

  const createdSubjects = await Subject.insertMany(subjects);
  console.log('✅ Subjects created');
  return createdSubjects;
};

const createQuestionsForQuiz = async (quiz, subject) => {
  const questionsBySubject = {
    'Mathematics': [
      {
        text: 'What is the derivative of sin(x)?',
        options: ['cos(x)', '-cos(x)', 'sin(x)', '-sin(x)'],
        correctIndex: 0,
        explanation: 'The derivative of sin(x) is cos(x). This is a fundamental rule in calculus.',
        difficulty: 'easy'
      },
      {
        text: 'If f(x) = x³ + 2x² - 5x + 1, what is f\'(x)?',
        options: ['3x² + 4x - 5', '3x² + 4x + 5', 'x² + 4x - 5', '3x + 4'],
        correctIndex: 0,
        explanation: 'Using the power rule, the derivative of x³ is 3x², 2x² becomes 4x, and -5x becomes -5.',
        difficulty: 'medium'
      },
      {
        text: 'What is the value of ∫(2x + 3)dx?',
        options: ['x² + 3x + C', '2x² + 3x + C', 'x² + 3 + C', '2x + 3x + C'],
        correctIndex: 0,
        explanation: 'The integral of 2x is x² and the integral of 3 is 3x, plus constant C.',
        difficulty: 'medium'
      },
      {
        text: 'In a right triangle, if one angle is 30°, what is the other acute angle?',
        options: ['45°', '60°', '90°', '120°'],
        correctIndex: 1,
        explanation: 'In a right triangle, angles sum to 180°. With 90° and 30°, the remaining angle is 60°.',
        difficulty: 'easy'
      },
      {
        text: 'What is the quadratic formula for ax² + bx + c = 0?',
        options: ['x = (-b ± √(b² - 4ac)) / 2a', 'x = (-b ± √(b² + 4ac)) / 2a', 'x = (b ± √(b² - 4ac)) / 2a', 'x = (-b ± √(b² - 4ac)) / a'],
        correctIndex: 0,
        explanation: 'The quadratic formula is x = (-b ± √(b² - 4ac)) / 2a, derived from completing the square.',
        difficulty: 'medium'
      },
      {
        text: 'What is the sum of interior angles of a pentagon?',
        options: ['360°', '540°', '720°', '900°'],
        correctIndex: 1,
        explanation: 'For a polygon with n sides, sum of interior angles = (n-2) × 180°. For pentagon: (5-2) × 180° = 540°.',
        difficulty: 'medium'
      },
      {
        text: 'If log₁₀(x) = 3, what is the value of x?',
        options: ['30', '100', '1000', '10000'],
        correctIndex: 2,
        explanation: 'log₁₀(x) = 3 means 10³ = x, so x = 1000.',
        difficulty: 'easy'
      },
      {
        text: 'What is the determinant of a 2×2 matrix [[a,b],[c,d]]?',
        options: ['ad + bc', 'ad - bc', 'ac - bd', 'ac + bd'],
        correctIndex: 1,
        explanation: 'For a 2×2 matrix [[a,b],[c,d]], the determinant is ad - bc.',
        difficulty: 'medium'
      },
      {
        text: 'What is the probability of getting two heads when flipping two fair coins?',
        options: ['1/2', '1/3', '1/4', '2/3'],
        correctIndex: 2,
        explanation: 'Outcomes: HH, HT, TH, TT. Only HH gives two heads, so probability = 1/4.',
        difficulty: 'easy'
      },
      {
        text: 'What is the limit of (sin x)/x as x approaches 0?',
        options: ['0', '1', '∞', 'undefined'],
        correctIndex: 1,
        explanation: 'This is a fundamental limit in calculus: lim(x→0) (sin x)/x = 1.',
        difficulty: 'hard'
      }
    ],
    
    'Physics': [
      {
        text: 'What is Newton\'s second law of motion?',
        options: ['F = ma', 'F = mv', 'F = ma²', 'F = m/a'],
        correctIndex: 0,
        explanation: 'Newton\'s second law states that Force equals mass times acceleration (F = ma).',
        difficulty: 'easy'
      },
      {
        text: 'What is the unit of electric current?',
        options: ['Volt', 'Ohm', 'Ampere', 'Watt'],
        correctIndex: 2,
        explanation: 'Electric current is measured in Amperes (A), named after André-Marie Ampère.',
        difficulty: 'easy'
      },
      {
        text: 'What is the speed of light in vacuum?',
        options: ['3 × 10⁶ m/s', '3 × 10⁸ m/s', '3 × 10¹⁰ m/s', '3 × 10¹² m/s'],
        correctIndex: 1,
        explanation: 'The speed of light in vacuum is approximately 3 × 10⁸ m/s or 300,000 km/s.',
        difficulty: 'easy'
      },
      {
        text: 'According to Ohm\'s law, V = ?',
        options: ['IR', 'I/R', 'R/I', 'I + R'],
        correctIndex: 0,
        explanation: 'Ohm\'s law states that voltage (V) equals current (I) times resistance (R): V = IR.',
        difficulty: 'easy'
      },
      {
        text: 'What is the gravitational acceleration on Earth?',
        options: ['9.8 m/s', '9.8 m/s²', '98 m/s²', '0.98 m/s²'],
        correctIndex: 1,
        explanation: 'Gravitational acceleration on Earth is approximately 9.8 m/s² or 9.81 m/s².',
        difficulty: 'easy'
      },
      {
        text: 'What happens to kinetic energy when velocity doubles?',
        options: ['Doubles', 'Triples', 'Quadruples', 'Remains same'],
        correctIndex: 2,
        explanation: 'KE = ½mv². When v doubles, KE = ½m(2v)² = 4 × ½mv², so kinetic energy quadruples.',
        difficulty: 'medium'
      },
      {
        text: 'What is the relationship between frequency and wavelength for electromagnetic waves?',
        options: ['f = cλ', 'f = c/λ', 'f = λ/c', 'f = c + λ'],
        correctIndex: 1,
        explanation: 'For electromagnetic waves, c = fλ, so frequency f = c/λ where c is speed of light.',
        difficulty: 'medium'
      },
      {
        text: 'What is the SI unit of energy?',
        options: ['Watt', 'Joule', 'Newton', 'Pascal'],
        correctIndex: 1,
        explanation: 'Energy is measured in Joules (J) in the SI system, named after James Prescott Joule.',
        difficulty: 'easy'
      },
      {
        text: 'What is Planck\'s constant approximately equal to?',
        options: ['6.63 × 10⁻³⁴ J·s', '6.63 × 10³⁴ J·s', '6.63 × 10⁻²³ J·s', '6.63 × 10²³ J·s'],
        correctIndex: 0,
        explanation: 'Planck\'s constant h ≈ 6.63 × 10⁻³⁴ J·s, fundamental in quantum mechanics.',
        difficulty: 'medium'
      },
      {
        text: 'In Young\'s double-slit experiment, what causes the interference pattern?',
        options: ['Diffraction only', 'Interference of light waves', 'Refraction', 'Polarization'],
        correctIndex: 1,
        explanation: 'The interference pattern results from constructive and destructive interference of light waves from two slits.',
        difficulty: 'hard'
      }
    ],

    'Chemistry': [
      {
        text: 'What is the chemical symbol for gold?',
        options: ['Go', 'Gd', 'Au', 'Ag'],
        correctIndex: 2,
        explanation: 'Gold\'s symbol is Au, from the Latin name "aurum" meaning gold.',
        difficulty: 'easy'
      },
      {
        text: 'What is the pH of pure water at 25°C?',
        options: ['6', '7', '8', '14'],
        correctIndex: 1,
        explanation: 'Pure water has a pH of 7 at 25°C, which is considered neutral.',
        difficulty: 'easy'
      },
      {
        text: 'How many electrons can the first electron shell hold?',
        options: ['2', '8', '18', '32'],
        correctIndex: 0,
        explanation: 'The first electron shell (K shell) can hold a maximum of 2 electrons.',
        difficulty: 'easy'
      },
      {
        text: 'What is Avogadro\'s number?',
        options: ['6.02 × 10²³', '6.02 × 10²²', '6.02 × 10²⁴', '6.02 × 10²¹'],
        correctIndex: 0,
        explanation: 'Avogadro\'s number is 6.02 × 10²³, the number of particles in one mole.',
        difficulty: 'medium'
      },
      {
        text: 'Which gas is most abundant in Earth\'s atmosphere?',
        options: ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Argon'],
        correctIndex: 2,
        explanation: 'Nitrogen (N₂) makes up about 78% of Earth\'s atmosphere.',
        difficulty: 'easy'
      },
      {
        text: 'What is the molecular formula of methane?',
        options: ['CH₂', 'CH₃', 'CH₄', 'C₂H₆'],
        correctIndex: 2,
        explanation: 'Methane has the molecular formula CH₄ - one carbon atom bonded to four hydrogen atoms.',
        difficulty: 'easy'
      },
      {
        text: 'What happens to the rate of reaction when temperature increases?',
        options: ['Decreases', 'Increases', 'Remains same', 'Becomes zero'],
        correctIndex: 1,
        explanation: 'Higher temperature increases molecular kinetic energy, leading to more frequent and energetic collisions.',
        difficulty: 'medium'
      },
      {
        text: 'What is the oxidation state of oxygen in H₂O₂?',
        options: ['-2', '-1', '0', '+1'],
        correctIndex: 1,
        explanation: 'In hydrogen peroxide (H₂O₂), oxygen has an oxidation state of -1.',
        difficulty: 'medium'
      },
      {
        text: 'Which type of bond is formed between Na and Cl in NaCl?',
        options: ['Covalent', 'Ionic', 'Metallic', 'Hydrogen'],
        correctIndex: 1,
        explanation: 'Sodium chloride forms ionic bonds due to electron transfer from Na to Cl.',
        difficulty: 'easy'
      },
      {
        text: 'What is the hybridization of carbon in methane (CH₄)?',
        options: ['sp', 'sp²', 'sp³', 'sp³d'],
        correctIndex: 2,
        explanation: 'Carbon in methane undergoes sp³ hybridization to form four equivalent C-H bonds.',
        difficulty: 'hard'
      }
    ],

    'Biology': [
      {
        text: 'What is the powerhouse of the cell?',
        options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Endoplasmic reticulum'],
        correctIndex: 2,
        explanation: 'Mitochondria are called the powerhouse of the cell because they produce ATP through cellular respiration.',
        difficulty: 'easy'
      },
      {
        text: 'What is the basic unit of heredity?',
        options: ['Chromosome', 'Gene', 'DNA', 'RNA'],
        correctIndex: 1,
        explanation: 'Genes are the basic units of heredity, containing instructions for specific traits.',
        difficulty: 'easy'
      },
      {
        text: 'How many chambers does a human heart have?',
        options: ['2', '3', '4', '5'],
        correctIndex: 2,
        explanation: 'The human heart has four chambers: two atria (upper chambers) and two ventricles (lower chambers).',
        difficulty: 'easy'
      },
      {
        text: 'What is the process by which plants make their own food?',
        options: ['Respiration', 'Photosynthesis', 'Transpiration', 'Digestion'],
        correctIndex: 1,
        explanation: 'Photosynthesis is the process where plants use sunlight, CO₂, and water to produce glucose and oxygen.',
        difficulty: 'easy'
      },
      {
        text: 'Which blood type is known as the universal donor?',
        options: ['A', 'B', 'AB', 'O'],
        correctIndex: 3,
        explanation: 'Type O blood lacks A and B antigens, making it compatible with all blood types as a donor.',
        difficulty: 'easy'
      },
      {
        text: 'What is the largest organ in the human body?',
        options: ['Liver', 'Brain', 'Lungs', 'Skin'],
        correctIndex: 3,
        explanation: 'The skin is the largest organ, covering the entire body surface and weighing about 16% of body weight.',
        difficulty: 'easy'
      },
      {
        text: 'Where does protein synthesis occur in a cell?',
        options: ['Nucleus', 'Ribosomes', 'Golgi apparatus', 'Lysosomes'],
        correctIndex: 1,
        explanation: 'Protein synthesis (translation) occurs at ribosomes, either free in cytoplasm or on ER.',
        difficulty: 'medium'
      },
      {
        text: 'What is the normal pH range of human blood?',
        options: ['6.8-7.2', '7.35-7.45', '7.8-8.2', '8.0-8.5'],
        correctIndex: 1,
        explanation: 'Normal blood pH is tightly regulated between 7.35-7.45, slightly alkaline.',
        difficulty: 'medium'
      },
      {
        text: 'Which organelle is responsible for cellular digestion?',
        options: ['Ribosome', 'Lysosome', 'Peroxisome', 'Vacuole'],
        correctIndex: 1,
        explanation: 'Lysosomes contain digestive enzymes that break down waste materials and cellular debris.',
        difficulty: 'medium'
      },
      {
        text: 'What is the function of the Golgi apparatus?',
        options: ['Protein synthesis', 'Energy production', 'Protein modification and packaging', 'DNA replication'],
        correctIndex: 2,
        explanation: 'The Golgi apparatus modifies, packages, and ships proteins received from the endoplasmic reticulum.',
        difficulty: 'hard'
      }
    ],

    'Computer Science': [
      {
        text: 'What does CPU stand for?',
        options: ['Central Processing Unit', 'Computer Personal Unit', 'Central Personal Unit', 'Computer Processing Unit'],
        correctIndex: 0,
        explanation: 'CPU stands for Central Processing Unit, the main component that executes instructions.',
        difficulty: 'easy'
      },
      {
        text: 'Which of the following is a programming language?',
        options: ['HTML', 'HTTP', 'Python', 'URL'],
        correctIndex: 2,
        explanation: 'Python is a high-level programming language. HTML is markup, HTTP is protocol, URL is addressing.',
        difficulty: 'easy'
      },
      {
        text: 'What is the time complexity of binary search?',
        options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
        correctIndex: 1,
        explanation: 'Binary search has O(log n) time complexity as it eliminates half the search space in each step.',
        difficulty: 'medium'
      },
      {
        text: 'Which data structure follows LIFO principle?',
        options: ['Queue', 'Array', 'Stack', 'Linked List'],
        correctIndex: 2,
        explanation: 'Stack follows Last In First Out (LIFO) principle - last element added is first to be removed.',
        difficulty: 'easy'
      },
      {
        text: 'What does SQL stand for?',
        options: ['Structured Query Language', 'Simple Query Language', 'Standard Query Language', 'Sequential Query Language'],
        correctIndex: 0,
        explanation: 'SQL stands for Structured Query Language, used for managing relational databases.',
        difficulty: 'easy'
      },
      {
        text: 'Which sorting algorithm has the best average case time complexity?',
        options: ['Bubble Sort', 'Selection Sort', 'Merge Sort', 'Insertion Sort'],
        correctIndex: 2,
        explanation: 'Merge Sort has O(n log n) average and worst-case complexity, making it efficient for large datasets.',
        difficulty: 'medium'
      },
      {
        text: 'What is the maximum number of nodes at level k in a binary tree?',
        options: ['2^k', '2^(k-1)', '2^(k+1)', 'k^2'],
        correctIndex: 0,
        explanation: 'At level k, a binary tree can have maximum 2^k nodes (assuming root is at level 0).',
        difficulty: 'hard'
      },
      {
        text: 'Which protocol is used for web browsing?',
        options: ['FTP', 'SMTP', 'HTTP', 'TCP'],
        correctIndex: 2,
        explanation: 'HTTP (HyperText Transfer Protocol) is used for web browsing and data transfer on the web.',
        difficulty: 'easy'
      },
      {
        text: 'What is encapsulation in object-oriented programming?',
        options: ['Hiding implementation details', 'Creating multiple objects', 'Inheriting properties', 'Overloading methods'],
        correctIndex: 0,
        explanation: 'Encapsulation is the bundling of data and methods that operate on that data, hiding internal implementation.',
        difficulty: 'medium'
      },
      {
        text: 'Which of the following is NOT a valid IP address?',
        options: ['192.168.1.1', '127.0.0.1', '255.255.255.255', '256.1.1.1'],
        correctIndex: 3,
        explanation: 'IP addresses have octets ranging from 0-255. 256.1.1.1 is invalid as 256 exceeds the maximum.',
        difficulty: 'medium'
      }
    ],

    'History': [
      {
        text: 'In which year did World War II end?',
        options: ['1944', '1945', '1946', '1947'],
        correctIndex: 1,
        explanation: 'World War II ended in 1945 with Japan\'s surrender on September 2, 1945.',
        difficulty: 'easy'
      },
      {
        text: 'Who was the first President of the United States?',
        options: ['Thomas Jefferson', 'John Adams', 'George Washington', 'Benjamin Franklin'],
        correctIndex: 2,
        explanation: 'George Washington served as the first President of the United States from 1789 to 1797.',
        difficulty: 'easy'
      },
      {
        text: 'The Great Wall of China was primarily built to protect against invasions from which direction?',
        options: ['South', 'East', 'West', 'North'],
        correctIndex: 3,
        explanation: 'The Great Wall was built primarily to protect against invasions from northern nomadic tribes.',
        difficulty: 'easy'
      },
      {
        text: 'Which empire was ruled by Julius Caesar?',
        options: ['Greek Empire', 'Roman Empire', 'Persian Empire', 'Byzantine Empire'],
        correctIndex: 1,
        explanation: 'Julius Caesar was a Roman general and dictator who played a critical role in the Roman Republic.',
        difficulty: 'easy'
      },
      {
        text: 'In which year did India gain independence from Britain?',
        options: ['1946', '1947', '1948', '1949'],
        correctIndex: 1,
        explanation: 'India gained independence from British rule on August 15, 1947.',
        difficulty: 'easy'
      },
      {
        text: 'Who wrote "The Communist Manifesto"?',
        options: ['Vladimir Lenin', 'Karl Marx and Friedrich Engels', 'Joseph Stalin', 'Leon Trotsky'],
        correctIndex: 1,
        explanation: 'The Communist Manifesto was written by Karl Marx and Friedrich Engels in 1848.',
        difficulty: 'medium'
      },
      {
        text: 'Which ancient civilization built Machu Picchu?',
        options: ['Aztecs', 'Mayans', 'Incas', 'Olmecs'],
        correctIndex: 2,
        explanation: 'Machu Picchu was built by the Inca civilization in the 15th century in Peru.',
        difficulty: 'medium'
      },
      {
        text: 'The French Revolution began in which year?',
        options: ['1789', '1776', '1799', '1804'],
        correctIndex: 0,
        explanation: 'The French Revolution began in 1789 with the storming of the Bastille on July 14.',
        difficulty: 'medium'
      },
      {
        text: 'Who was the first person to circumnavigate the globe?',
        options: ['Christopher Columbus', 'Vasco da Gama', 'Ferdinand Magellan', 'Captain Cook'],
        correctIndex: 2,
        explanation: 'Ferdinand Magellan\'s expedition (completed by Juan Sebastián Elcano) was first to circumnavigate the globe.',
        difficulty: 'medium'
      },
      {
        text: 'The Renaissance period is generally considered to have begun in which country?',
        options: ['France', 'England', 'Germany', 'Italy'],
        correctIndex: 3,
        explanation: 'The Renaissance began in Italy in the 14th century, particularly in Florence and other Italian city-states.',
        difficulty: 'hard'
      }
    ]
  };

  const questions = questionsBySubject[subject.name];
  if (!questions) return [];

  const quizQuestions = questions.map(q => ({
    quiz: quiz._id,
    subject: subject._id,
    text: q.text,
    options: q.options,
    correctIndex: q.correctIndex,
    explanation: q.explanation,
    difficulty: q.difficulty,
    createdAt: new Date()
  }));

  return await Question.insertMany(quizQuestions);
};

const createQuizzesAndQuestions = async (subjects, teacher) => {
  console.log('📝 Creating quizzes and questions...');
  
  const quizzes = [];
  
  for (const subject of subjects) {
    // Create 3 quizzes per subject with different difficulties
    const difficulties = ['easy', 'medium', 'hard'];
    
    for (let i = 0; i < 3; i++) {
      const quiz = new Quiz({
        title: `${subject.name} ${difficulties[i].charAt(0).toUpperCase() + difficulties[i].slice(1)} Quiz`,
        description: `Comprehensive ${difficulties[i]} level quiz covering key topics in ${subject.name}`,
        subject: subject._id,
        createdBy: teacher._id,
        difficulty: difficulties[i],
        timeLimit: 600 + (i * 300), // 10, 15, 20 minutes
        isMock: i === 2, // Hard quiz is mock exam
        isPublished: true,
        tags: [difficulties[i], subject.name.toLowerCase()],
        createdAt: new Date(`2024-02-${10 + i}`)
      });
      
      await quiz.save();
      
      // Create 10 questions for this quiz
      const questions = await createQuestionsForQuiz(quiz, subject);
      
      // Update quiz with question count
      quiz.totalQuestions = questions.length;
      await quiz.save();
      
      quizzes.push(quiz);
    }
  }
  
  console.log('✅ Quizzes and questions created');
  return quizzes;
};

const createSampleAttempts = async (students, quizzes) => {
  console.log('📊 Creating sample attempts...');
  
  const attempts = [];
  
  for (const student of students) {
    // Each student attempts some random quizzes
    const studentQuizzes = quizzes.slice(0, Math.floor(Math.random() * 10) + 5); // 5-15 attempts per student
    
    for (const quiz of studentQuizzes) {
      const questions = await Question.find({ quiz: quiz._id }).sort({ createdAt: 1 });
      
      // Generate realistic answers (70-95% accuracy for variety)
      const accuracy = 0.7 + Math.random() * 0.25;
      const answers = [];
      let correctCount = 0;
      
      for (const question of questions) {
        if (Math.random() < accuracy) {
          // Correct answer
          answers.push(question.correctIndex);
          correctCount++;
        } else {
          // Wrong answer (not the correct one)
          let wrongAnswer;
          do {
            wrongAnswer = Math.floor(Math.random() * 4);
          } while (wrongAnswer === question.correctIndex);
          answers.push(wrongAnswer);
        }
      }
      
      const percentage = Math.round((correctCount / questions.length) * 100);
      const timeTaken = Math.floor(Math.random() * quiz.timeLimit * 0.8) + 60; // 60s to 80% of time limit
      
      const attempt = new Attempt({
        student: student._id,
        quiz: quiz._id,
        answers,
        score: correctCount,
        percentage,
        timeTaken,
        completedAt: new Date(`2024-03-${Math.floor(Math.random() * 28) + 1}`)
      });
      
      attempts.push(attempt);
    }
  }
  
  await Attempt.insertMany(attempts);
  console.log('✅ Sample attempts created');
  return attempts;
};

const createSampleSurveys = async (students) => {
  console.log('📋 Creating sample surveys...');
  
  const exams = ['JEE', 'NEET', 'GATE'];
  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science'];
  const resources = ['YouTube', 'Coaching', 'Books', 'Mobile Apps', 'Online Tests', 'Study Groups'];
  
  const surveys = [];
  
  for (let i = 0; i < 3; i++) {
    const student = students[i];
    
    const survey = new Survey({
      student: student._id,
      targetExam: exams[i],
      attemptYear: 2024,
      dailyStudyHours: 4 + Math.floor(Math.random() * 6), // 4-10 hours
      weakSubjects: subjects.slice(0, 2 + Math.floor(Math.random() * 2)), // 2-3 weak subjects
      strongSubjects: subjects.slice(-2), // 2 strong subjects
      resourcesUsed: resources.slice(0, 3 + Math.floor(Math.random() * 3)), // 3-5 resources
      stressLevel: 2 + Math.floor(Math.random() * 3), // 2-4
      confidenceLevel: 3 + Math.floor(Math.random() * 3), // 3-5
      submittedAt: new Date(`2024-03-${15 + i}`)
    });
    
    surveys.push(survey);
  }
  
  await Survey.insertMany(surveys);
  console.log('✅ Sample surveys created');
  return surveys;
};

const createSampleBookmarks = async (students, questions) => {
  console.log('🔖 Creating sample bookmarks...');
  
  const bookmarks = [];
  
  for (const student of students) {
    // Each student bookmarks 3-8 random questions
    const bookmarkCount = 3 + Math.floor(Math.random() * 6);
    const studentQuestions = questions.sort(() => 0.5 - Math.random()).slice(0, bookmarkCount);
    
    for (const question of studentQuestions) {
      const bookmark = new Bookmark({
        student: student._id,
        question: question._id,
        createdAt: new Date(`2024-03-${Math.floor(Math.random() * 28) + 1}`)
      });
      
      bookmarks.push(bookmark);
    }
  }
  
  await Bookmark.insertMany(bookmarks);
  console.log('✅ Sample bookmarks created');
  return bookmarks;
};

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    await connectDB();
    await clearDatabase();
    
    // Create users
    const users = await createUsers();
    const admin = users.find(u => u.role === 'admin');
    const teacher = users.find(u => u.role === 'teacher');
    const students = users.filter(u => u.role === 'student');
    
    // Create subjects
    const subjects = await createSubjects(admin);
    
    // Create quizzes and questions
    const quizzes = await createQuizzesAndQuestions(subjects, teacher);
    
    // Get all questions for bookmarking
    const allQuestions = await Question.find();
    
    // Create sample attempts
    await createSampleAttempts(students, quizzes);
    
    // Create sample surveys
    await createSampleSurveys(students);
    
    // Create sample bookmarks
    await createSampleBookmarks(students, allQuestions);
    
    console.log('✅ Database seeding completed successfully!');
    console.log(`
📊 Seeding Summary:
👥 Users: ${users.length} (1 admin, 1 teacher, 3 students)
📚 Subjects: ${subjects.length}
📝 Quizzes: ${quizzes.length} (3 per subject, all published)
❓ Questions: ${allQuestions.length} (10 per quiz, realistic MCQs)
📊 Sample Attempts: Created for variety in scoring
📋 Sample Surveys: 3 responses with different exam targets
🔖 Sample Bookmarks: Random bookmarks for each student

🔑 Login Credentials:
Admin: admin@quizpilot.com / Admin@123
Teacher: teacher@quizpilot.com / Teacher@123
Students: student1@quizpilot.com / Student@123 (and student2, student3)
    `);
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run seeding
seedDatabase();