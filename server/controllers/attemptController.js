const { Attempt, Quiz, Question, User } = require('../models');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * Calculate and award badges based on attempt
 */
const awardBadges = async (user, attempt, quiz) => {
  const newBadges = [];

  // First quiz badge
  if (!user.badges.includes('first_quiz')) {
    newBadges.push('first_quiz');
  }

  // Perfect score badge
  if (attempt.percentage === 100 && !user.badges.includes('perfect_score')) {
    newBadges.push('perfect_score');
  }

  // Subject mastery badge (average >85% on this subject)
  if (attempt.percentage > 85 && quiz.subject?.name) {
    const subjectAttempts = await Attempt.find({ 
      student: user._id 
    }).populate({
      path: 'quiz',
      populate: { path: 'subject', select: 'name' }
    });

    const sameSubjectAttempts = subjectAttempts.filter(att => 
      att.quiz?.subject?.name === quiz.subject.name
    );

    if (sameSubjectAttempts.length >= 3) {
      const avgPercentage = sameSubjectAttempts.reduce((sum, att) => sum + att.percentage, 0) / sameSubjectAttempts.length;
      const badgeName = `subject_master_${quiz.subject.name.toLowerCase()}`;
      
      if (avgPercentage > 85 && !user.badges.includes(badgeName)) {
        newBadges.push(badgeName);
      }
    }
  }

  // Update user with new badges
  if (newBadges.length > 0) {
    user.badges.push(...newBadges);
    await user.save();
  }

  return newBadges;
};

/**
 * Update user streak
 */
const updateStreak = async (user) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const lastActiveDate = user.lastActiveDate ? new Date(user.lastActiveDate) : null;

  if (!lastActiveDate) {
    // First attempt ever
    user.streak = 1;
  } else {
    const lastActiveDateOnly = new Date(lastActiveDate);
    lastActiveDateOnly.setHours(0, 0, 0, 0);

    if (lastActiveDateOnly.getTime() === yesterday.getTime()) {
      // Consecutive day - increment streak
      user.streak += 1;
      
      // 7-day streak badge
      if (user.streak === 7 && !user.badges.includes('streak_7')) {
        user.badges.push('streak_7');
      }
    } else if (lastActiveDateOnly.getTime() !== today.getTime()) {
      // Gap in streak - reset to 1
      user.streak = 1;
    }
    // If same day, keep current streak
  }

  user.lastActiveDate = new Date();
  await user.save();
};

/**
 * Submit quiz attempt
 * POST /api/attempts
 */
const submitAttempt = async (req, res, next) => {
  try {
    const { quizId, answers, timeTaken } = req.validatedData;
    const student = req.user;

    // Get quiz with questions
    const quiz = await Quiz.findById(quizId)
      .populate('subject', 'name')
      .populate('createdBy', 'name');

    if (!quiz) {
      return sendError(res, 404, 'Quiz not found');
    }

    if (!quiz.isPublished) {
      return sendError(res, 400, 'Quiz is not published');
    }

    // Get all questions for this quiz
    const questions = await Question.find({ quiz: quizId }).sort({ createdAt: 1 });
    
    if (questions.length === 0) {
      return sendError(res, 400, 'Quiz has no questions');
    }

    if (answers.length !== questions.length) {
      return sendError(res, 400, `Expected ${questions.length} answers, got ${answers.length}`);
    }

    // Calculate score
    let correctCount = 0;
    const correctAnswers = [];

    questions.forEach((question, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === question.correctIndex;
      
      if (isCorrect) {
        correctCount++;
      }

      correctAnswers.push({
        questionId: question._id,
        questionText: question.text,
        options: question.options,
        userAnswer: userAnswer,
        correctAnswer: question.correctIndex,
        isCorrect,
        explanation: question.explanation
      });
    });

    const percentage = Math.round((correctCount / questions.length) * 100);

    // Create attempt record
    const attempt = new Attempt({
      student: student._id,
      quiz: quizId,
      answers,
      score: correctCount,
      percentage,
      timeTaken,
      completedAt: new Date()
    });

    await attempt.save();

    // Update user streak
    await updateStreak(student);

    // Award badges
    const newBadges = await awardBadges(student, attempt, quiz);

    // Get updated user data
    const updatedUser = await User.findById(student._id);
    
    // Safely get streak value
    const updatedStreak = updatedUser?.streak || student.streak || 0;

    const result = {
      attemptId: attempt._id,
      quiz: {
        _id: quiz._id,
        title: quiz.title,
        totalQuestions: questions.length
      },
      score: correctCount,
      totalQuestions: questions.length,
      percentage,
      timeTaken,
      correctAnswers,
      newBadges,
      updatedStreak,
      completedAt: attempt.completedAt
    };

    return sendSuccess(res, 201, 'Quiz attempt submitted successfully', result);
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user's attempt history
 * GET /api/attempts/my
 */
const getMyAttempts = async (req, res, next) => {
  try {
    const student = req.user;
    const { page = 1, limit = 20 } = req.query;

    const skip = (page - 1) * limit;

    const attempts = await Attempt.find({ student: student._id })
      .populate({
        path: 'quiz',
        select: 'title difficulty subject',
        populate: { path: 'subject', select: 'name icon' }
      })
      .sort({ completedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalAttempts = await Attempt.countDocuments({ student: student._id });

    const attemptsData = attempts
      .filter(attempt => attempt.quiz !== null) // Filter out attempts with deleted quizzes
      .map(attempt => ({
        _id: attempt._id,
        quiz: {
          _id: attempt.quiz._id,
          title: attempt.quiz.title,
          difficulty: attempt.quiz.difficulty,
          subject: attempt.quiz.subject
        },
        score: attempt.score,
        percentage: attempt.percentage,
        timeTaken: attempt.timeTaken,
        completedAt: attempt.completedAt
      }));

    return sendSuccess(res, 200, 'Attempt history retrieved successfully', {
      attempts: attemptsData,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalAttempts / limit),
        totalAttempts,
        hasNext: skip + limit < totalAttempts,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all attempts for a specific quiz (Teacher/Admin only)
 * GET /api/attempts/quiz/:quizId
 */
const getQuizAttempts = async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const user = req.user;
    const { page = 1, limit = 50 } = req.query;

    // Check if quiz exists and user has permission
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return sendError(res, 404, 'Quiz not found');
    }

    // Check ownership (admin can view any quiz attempts)
    if (user.role !== 'admin' && (!quiz.createdBy || quiz.createdBy.toString() !== user._id.toString())) {
      return sendError(res, 403, 'Not authorized to view quiz attempts');
    }

    const skip = (page - 1) * limit;

    const attempts = await Attempt.find({ quiz: quizId })
      .populate('student', 'name email')
      .sort({ completedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalAttempts = await Attempt.countDocuments({ quiz: quizId });

    const attemptsData = attempts
      .filter(attempt => attempt.student !== null) // Filter out attempts with deleted students
      .map(attempt => ({
        _id: attempt._id,
        student: attempt.student,
        score: attempt.score,
        percentage: attempt.percentage,
        timeTaken: attempt.timeTaken,
        completedAt: attempt.completedAt
      }));

    return sendSuccess(res, 200, 'Quiz attempts retrieved successfully', {
      quiz: {
        _id: quiz._id,
        title: quiz.title
      },
      attempts: attemptsData,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalAttempts / limit),
        totalAttempts,
        hasNext: skip + limit < totalAttempts,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitAttempt,
  getMyAttempts,
  getQuizAttempts
};