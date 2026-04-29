const mongoose = require('mongoose');
const { Quiz, Question, Subject, Attempt, Bookmark } = require('../models');
const { sendSuccess, sendError } = require('../utils/response');

const formatQuizWithStats = async (quiz) => {
  const questionCount = await Question.countDocuments({ quiz: quiz._id });
  const attemptCount = await Attempt.countDocuments({ quiz: quiz._id });

  return {
    _id: quiz._id,
    title: quiz.title,
    description: quiz.description,
    subject: quiz.subject,
    difficulty: quiz.difficulty,
    timeLimit: quiz.timeLimit,
    isMock: quiz.isMock,
    isPublished: quiz.isPublished,
    totalQuestions: questionCount,
    attemptCount,
    tags: quiz.tags,
    createdBy: quiz.createdBy,
    createdAt: quiz.createdAt
  };
};

/**
 * Get all published quizzes with optional filters
 * GET /api/quizzes?subject=id&difficulty=easy
 */
const getAllQuizzes = async (req, res, next) => {
  try {
    const { subject, difficulty } = req.query;
    
    const filter = { isPublished: true };
    
    if (subject) filter.subject = subject;
    if (difficulty) filter.difficulty = difficulty;

    const quizzes = await Quiz.find(filter)
      .populate('subject', 'name icon')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    // Add question counts and attempt stats
    const quizzesWithStats = await Promise.all(quizzes.map(formatQuizWithStats));

    return sendSuccess(res, 200, 'Quizzes retrieved successfully', quizzesWithStats);
  } catch (error) {
    next(error);
  }
};

/**
 * Get current teacher/admin quizzes (including drafts)
 * GET /api/quizzes/mine
 */
const getMyQuizzes = async (req, res, next) => {
  try {
    const user = req.user;

    const filter = user.role === 'admin' ? {} : { createdBy: user._id };

    const quizzes = await Quiz.find(filter)
      .populate('subject', 'name icon')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    const quizzesWithStats = await Promise.all(quizzes.map(formatQuizWithStats));

    return sendSuccess(res, 200, 'My quizzes retrieved successfully', quizzesWithStats);
  } catch (error) {
    next(error);
  }
};

/**
 * Get quiz by ID with questions
 * GET /api/quizzes/:id
 */
const getQuizById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const quiz = await Quiz.findById(id)
      .populate('subject', 'name icon')
      .populate('createdBy', 'name email');

    if (!quiz) {
      return sendError(res, 404, 'Quiz not found');
    }

    // Check if quiz is published (unless user is teacher/admin or owner)
    const isOwner = quiz.createdBy && quiz.createdBy._id && quiz.createdBy._id.toString() === user._id.toString();
    if (!quiz.isPublished && user.role === 'student' && !isOwner) {
      return sendError(res, 403, 'Quiz not available');
    }

    // Get questions
    let questions = await Question.find({ quiz: id }).sort({ createdAt: 1 });

    // For students: hide correctIndex and explanation during attempt
    // For mock exams: always hide correctIndex and explanation during attempt
    if (user.role === 'student' || quiz.isMock) {
      questions = questions.map(q => ({
        _id: q._id,
        text: q.text,
        options: q.options,
        difficulty: q.difficulty
        // correctIndex and explanation hidden
      }));
    } else {
      // For teachers/admins: show everything
      questions = questions.map(q => ({
        _id: q._id,
        text: q.text,
        options: q.options,
        correctIndex: q.correctIndex,
        explanation: q.explanation,
        difficulty: q.difficulty
      }));
    }

    const quizData = {
      _id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      subject: quiz.subject,
      difficulty: quiz.difficulty,
      timeLimit: quiz.timeLimit,
      isMock: quiz.isMock,
      isPublished: quiz.isPublished,
      totalQuestions: questions.length,
      questions,
      tags: quiz.tags,
      createdBy: quiz.createdBy,
      createdAt: quiz.createdAt
    };

    return sendSuccess(res, 200, 'Quiz retrieved successfully', quizData);
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new quiz (Teacher/Admin only)
 * POST /api/quizzes
 */
const createQuiz = async (req, res, next) => {
  try {
    const { title, description, subject, difficulty, timeLimit, isMock, tags } = req.validatedData;
    const createdBy = req.user._id;

    // Verify subject exists
    const subjectExists = await Subject.findById(subject);
    if (!subjectExists) {
      return sendError(res, 400, 'Invalid subject ID');
    }

    const quiz = new Quiz({
      title,
      description,
      subject,
      createdBy,
      difficulty,
      timeLimit,
      isMock,
      tags,
      createdAt: new Date()
    });

    await quiz.save();
    await quiz.populate('subject', 'name icon');
    await quiz.populate('createdBy', 'name email');

    const quizData = {
      _id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      subject: quiz.subject,
      difficulty: quiz.difficulty,
      timeLimit: quiz.timeLimit,
      isMock: quiz.isMock,
      isPublished: quiz.isPublished,
      totalQuestions: 0,
      tags: quiz.tags,
      createdBy: quiz.createdBy,
      createdAt: quiz.createdAt
    };

    return sendSuccess(res, 201, 'Quiz created successfully', quizData);
  } catch (error) {
    next(error);
  }
};

/**
 * Update a quiz (Owner or Admin only)
 * PUT /api/quizzes/:id
 */
const updateQuiz = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.validatedData;
    const user = req.user;

    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return sendError(res, 404, 'Quiz not found');
    }

    // Check ownership (admin can edit any quiz)
    if (user.role !== 'admin' && quiz.createdBy.toString() !== user._id.toString()) {
      return sendError(res, 403, 'Not authorized to edit this quiz');
    }

    // Update quiz
    Object.keys(updates).forEach(key => {
      quiz[key] = updates[key];
    });

    await quiz.save();
    await quiz.populate('subject', 'name icon');
    await quiz.populate('createdBy', 'name email');

    const questionCount = await Question.countDocuments({ quiz: id });

    const quizData = {
      _id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      subject: quiz.subject,
      difficulty: quiz.difficulty,
      timeLimit: quiz.timeLimit,
      isMock: quiz.isMock,
      isPublished: quiz.isPublished,
      totalQuestions: questionCount,
      tags: quiz.tags,
      createdBy: quiz.createdBy,
      createdAt: quiz.createdAt
    };

    return sendSuccess(res, 200, 'Quiz updated successfully', quizData);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a quiz (Owner or Admin only)
 * DELETE /api/quizzes/:id
 */
const deleteQuiz = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return sendError(res, 404, 'Quiz not found');
    }

    // Check ownership (admin can delete any quiz)
    if (user.role !== 'admin' && (!quiz.createdBy || quiz.createdBy.toString() !== user._id.toString())) {
      return sendError(res, 403, 'Not authorized to delete this quiz');
    }

    // Find questions to delete their bookmarks
    const questions = await Question.find({ quiz: id });
    const questionIds = questions.map(q => q._id);

    // Delete related bookmarks, questions and attempts
    if (questionIds.length > 0) {
      await mongoose.model('Bookmark').deleteMany({ question: { $in: questionIds } });
    }
    
    await Question.deleteMany({ quiz: id });
    await Attempt.deleteMany({ quiz: id });
    await Quiz.findByIdAndDelete(id);

    return sendSuccess(res, 200, 'Quiz and related data deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle quiz publication status (Owner or Admin only)
 * POST /api/quizzes/:id/publish
 */
const togglePublishQuiz = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return sendError(res, 404, 'Quiz not found');
    }

    // Check ownership (admin can publish any quiz)
    if (user.role !== 'admin' && quiz.createdBy.toString() !== user._id.toString()) {
      return sendError(res, 403, 'Not authorized to publish this quiz');
    }

    // Check if quiz has questions
    const questionCount = await Question.countDocuments({ quiz: id });
    if (questionCount === 0) {
      return sendError(res, 400, 'Cannot publish quiz without questions');
    }

    quiz.isPublished = !quiz.isPublished;
    await quiz.save();

    return sendSuccess(res, 200, `Quiz ${quiz.isPublished ? 'published' : 'unpublished'} successfully`, {
      isPublished: quiz.isPublished
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get quiz attempt statistics (Teacher/Admin only)
 * GET /api/quizzes/:id/stats
 */
const getQuizStats = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return sendError(res, 404, 'Quiz not found');
    }

    // Check ownership (admin can view any quiz stats)
    if (user.role !== 'admin' && quiz.createdBy.toString() !== user._id.toString()) {
      return sendError(res, 403, 'Not authorized to view quiz statistics');
    }

    // Get all attempts for this quiz
    const attempts = await Attempt.find({ quiz: id })
      .populate('student', 'name email')
      .sort({ completedAt: -1 });

    // Calculate statistics
    const totalAttempts = attempts.length;
    const avgScore = totalAttempts > 0 ? attempts.reduce((sum, attempt) => sum + attempt.percentage, 0) / totalAttempts : 0;
    const highestScore = totalAttempts > 0 ? Math.max(...attempts.map(a => a.percentage)) : 0;
    const lowestScore = totalAttempts > 0 ? Math.min(...attempts.map(a => a.percentage)) : 0;

    // Get questions for per-question analysis
    const questions = await Question.find({ quiz: id }).sort({ createdAt: 1 });
    
    // Per question accuracy
    const questionAccuracy = questions.map((question, index) => {
      const correctCount = attempts.filter(attempt => 
        attempt.answers[index] === question.correctIndex
      ).length;
      
      return {
        questionId: question._id,
        questionText: question.text.substring(0, 100) + '...',
        correctCount,
        totalAttempts,
        accuracy: totalAttempts > 0 ? (correctCount / totalAttempts * 100).toFixed(1) : 0
      };
    });

    const stats = {
      quiz: {
        _id: quiz._id,
        title: quiz.title,
        totalQuestions: questions.length
      },
      summary: {
        totalAttempts,
        avgScore: Math.round(avgScore * 10) / 10,
        highestScore,
        lowestScore
      },
      recentAttempts: attempts.slice(0, 10)
        .filter(attempt => attempt.student !== null) // Filter out attempts with deleted students
        .map(attempt => ({
          _id: attempt._id,
          student: attempt.student,
          score: attempt.score,
          percentage: attempt.percentage,
          timeTaken: attempt.timeTaken,
          completedAt: attempt.completedAt
        })),
      questionAccuracy
    };

    return sendSuccess(res, 200, 'Quiz statistics retrieved successfully', stats);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllQuizzes,
  getMyQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  togglePublishQuiz,
  getQuizStats
};
