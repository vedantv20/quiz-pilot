const { User, ExamCategory, Subject, Quiz } = require('../models');
const { z } = require('zod');

// Validation schemas
const onboardingSchema = z.object({
  educationLevel: z.enum([
    'class_11',
    'class_12',
    'undergraduate',
    'postgraduate',
    'working_professional',
    'other'
  ]),
  currentClass: z.string().optional(),
  targetExams: z.array(z.string()).min(1, 'Select at least one target exam'),
  preferredSubjects: z.array(z.string()).optional()
});

const targetExamsUpdateSchema = z.object({
  targetExams: z.array(z.string()).min(1, 'Select at least one target exam')
});

// Complete onboarding - save user's qualification
exports.completeOnboarding = async (req, res, next) => {
  try {
    const validation = onboardingSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.error.errors
      });
    }

    const { educationLevel, currentClass, targetExams, preferredSubjects } = validation.data;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        educationLevel,
        currentClass,
        targetExams,
        preferredSubjects: preferredSubjects || [],
        onboardingCompleted: true
      },
      { new: true }
    ).select('-passwordHash');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Onboarding completed successfully',
      user
    });
  } catch (error) {
    next(error);
  }
};

// Get all exam categories grouped by education level
exports.getExamCategories = async (req, res, next) => {
  try {
    const { educationLevel } = req.query;

    let query = { isActive: true };
    if (educationLevel) {
      query.educationLevel = educationLevel;
    }

    const categories = await ExamCategory.find(query)
      .sort({ displayOrder: 1 })
      .lean();

    // Group categories by education level
    const groupedCategories = categories.reduce((acc, cat) => {
      if (!acc[cat.educationLevel]) {
        acc[cat.educationLevel] = [];
      }
      acc[cat.educationLevel].push(cat);
      return acc;
    }, {});

    res.json({
      success: true,
      categories: groupedCategories,
      all: categories
    });
  } catch (error) {
    next(error);
  }
};

// Get all available target exams
exports.getTargetExams = async (req, res, next) => {
  try {
    const categories = await ExamCategory.find({ isActive: true })
      .select('name targetExams educationLevel stream')
      .lean();

    // Collect unique target exams
    const targetExamsSet = new Set();
    categories.forEach(cat => {
      cat.targetExams.forEach(exam => targetExamsSet.add(exam));
    });

    // Group target exams by education level
    const examsByLevel = {
      school: ['Board Exam', '11th Standard', '12th Standard'],
      entrance: ['JEE Main', 'JEE Advanced', 'NEET UG', 'MHTCET', 'BITSAT', 'VITEEE'],
      engineering: ['GATE CS', 'GATE IT', 'Placement', 'Coding Interview', 'University Exam'],
      professional: ['CA Foundation', 'CS Foundation', 'Certification', 'Senior Interview']
    };

    res.json({
      success: true,
      targetExams: Array.from(targetExamsSet),
      examsByLevel,
      categories
    });
  } catch (error) {
    next(error);
  }
};

// Get subjects based on user's qualification
exports.getSubjectsByQualification = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Build query based on user's education level and target exams
    let query = { isActive: true };
    
    if (user.educationLevel) {
      // Map user education level to subject education levels
      const levelMapping = {
        'class_11': ['class_11'],
        'class_12': ['class_11', 'class_12'],
        'undergraduate': ['undergraduate', 'entrance_exam'],
        'postgraduate': ['undergraduate', 'postgraduate', 'professional'],
        'working_professional': ['undergraduate', 'professional', 'competitive'],
        'other': [] // Show all
      };

      const levels = levelMapping[user.educationLevel] || [];
      if (levels.length > 0) {
        query.educationLevels = { $in: levels };
      }
    }

    if (user.targetExams && user.targetExams.length > 0) {
      query.targetExams = { $in: user.targetExams };
    }

    const subjects = await Subject.find(query)
      .populate('examCategory', 'name slug icon educationLevel')
      .sort({ displayOrder: 1 })
      .lean();

    // Group subjects by exam category
    const groupedSubjects = subjects.reduce((acc, subject) => {
      const categoryName = subject.examCategory?.name || 'General';
      if (!acc[categoryName]) {
        acc[categoryName] = {
          category: subject.examCategory,
          subjects: []
        };
      }
      acc[categoryName].subjects.push(subject);
      return acc;
    }, {});

    res.json({
      success: true,
      subjects,
      groupedSubjects,
      userQualification: {
        educationLevel: user.educationLevel,
        targetExams: user.targetExams
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get suggested quizzes based on user's qualification
exports.getSuggestedQuizzes = async (req, res, next) => {
  try {
    const { limit = 10, difficulty } = req.query;
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // If user hasn't completed onboarding, return empty with message
    if (!user.onboardingCompleted) {
      return res.json({
        success: true,
        quizzes: [],
        message: 'Please complete onboarding to get personalized quiz suggestions',
        requiresOnboarding: true
      });
    }

    // Find relevant subjects based on user's target exams
    let subjectQuery = { isActive: true };
    if (user.targetExams && user.targetExams.length > 0) {
      subjectQuery.targetExams = { $in: user.targetExams };
    }

    const relevantSubjects = await Subject.find(subjectQuery).select('_id');
    const subjectIds = relevantSubjects.map(s => s._id);

    // Build quiz query
    let quizQuery = {
      isPublished: true,
      subject: { $in: subjectIds }
    };

    if (difficulty) {
      quizQuery.difficulty = difficulty;
    }

    // Get quizzes with subject details
    const quizzes = await Quiz.find(quizQuery)
      .populate({
        path: 'subject',
        select: 'name slug icon examCategory targetExams',
        populate: {
          path: 'examCategory',
          select: 'name slug icon'
        }
      })
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .lean();

    // Calculate relevance score for each quiz
    const scoredQuizzes = quizzes.map(quiz => {
      let relevanceScore = 0;
      
      // Higher score if quiz matches user's target exams
      if (quiz.subject?.targetExams) {
        const matchingExams = quiz.subject.targetExams.filter(
          exam => user.targetExams?.includes(exam)
        );
        relevanceScore += matchingExams.length * 10;
      }

      // Add points based on quiz tags matching target exams
      if (quiz.tags) {
        quiz.tags.forEach(tag => {
          if (user.targetExams?.some(exam => 
            exam.toLowerCase().includes(tag.toLowerCase()) ||
            tag.toLowerCase().includes(exam.toLowerCase())
          )) {
            relevanceScore += 5;
          }
        });
      }

      return { ...quiz, relevanceScore };
    });

    // Sort by relevance score
    scoredQuizzes.sort((a, b) => b.relevanceScore - a.relevanceScore);

    // Group quizzes by category
    const groupedQuizzes = scoredQuizzes.reduce((acc, quiz) => {
      const categoryName = quiz.subject?.examCategory?.name || 'General';
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(quiz);
      return acc;
    }, {});

    res.json({
      success: true,
      quizzes: scoredQuizzes,
      groupedQuizzes,
      totalCount: scoredQuizzes.length,
      userProfile: {
        educationLevel: user.educationLevel,
        targetExams: user.targetExams,
        currentClass: user.currentClass
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update user's target exams
exports.updateTargetExams = async (req, res, next) => {
  try {
    const validation = targetExamsUpdateSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.error.errors
      });
    }

    const { targetExams } = validation.data;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { targetExams },
      { new: true }
    ).select('-passwordHash');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Target exams updated successfully',
      user
    });
  } catch (error) {
    next(error);
  }
};
