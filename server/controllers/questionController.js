const { Question, Quiz } = require('../models');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * Add a question to a quiz (Teacher/Admin only)
 * POST /api/questions
 */
const addQuestion = async (req, res, next) => {
  try {
    const { quiz, subject, text, options, correctIndex, explanation, difficulty } = req.validatedData;
    const user = req.user;

    // Check if quiz exists and user has permission
    const quizDoc = await Quiz.findById(quiz);
    if (!quizDoc) {
      return sendError(res, 404, 'Quiz not found');
    }

    // Check ownership (admin can add questions to any quiz)
    if (user.role !== 'admin' && quizDoc.createdBy.toString() !== user._id.toString()) {
      return sendError(res, 403, 'Not authorized to add questions to this quiz');
    }

    const question = new Question({
      quiz,
      subject: subject || quizDoc.subject,
      text,
      options,
      correctIndex,
      explanation,
      difficulty,
      createdAt: new Date()
    });

    await question.save();

    // Update quiz totalQuestions count
    const questionCount = await Question.countDocuments({ quiz });
    await Quiz.findByIdAndUpdate(quiz, { totalQuestions: questionCount });

    const questionData = {
      _id: question._id,
      quiz: question.quiz,
      subject: question.subject,
      text: question.text,
      options: question.options,
      correctIndex: question.correctIndex,
      explanation: question.explanation,
      difficulty: question.difficulty,
      createdAt: question.createdAt
    };

    return sendSuccess(res, 201, 'Question added successfully', questionData);
  } catch (error) {
    next(error);
  }
};

/**
 * Update a question (Owner or Admin only)
 * PUT /api/questions/:id
 */
const updateQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.validatedData;
    const user = req.user;

    const question = await Question.findById(id).populate('quiz');
    if (!question) {
      return sendError(res, 404, 'Question not found');
    }

    // Check ownership (admin can edit any question)
    if (user.role !== 'admin' && question.quiz.createdBy.toString() !== user._id.toString()) {
      return sendError(res, 403, 'Not authorized to edit this question');
    }

    // Update question
    Object.keys(updates).forEach(key => {
      question[key] = updates[key];
    });

    await question.save();

    const questionData = {
      _id: question._id,
      quiz: question.quiz._id,
      subject: question.subject,
      text: question.text,
      options: question.options,
      correctIndex: question.correctIndex,
      explanation: question.explanation,
      difficulty: question.difficulty,
      createdAt: question.createdAt
    };

    return sendSuccess(res, 200, 'Question updated successfully', questionData);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a question (Owner or Admin only)
 * DELETE /api/questions/:id
 */
const deleteQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const question = await Question.findById(id).populate('quiz');
    if (!question) {
      return sendError(res, 404, 'Question not found');
    }

    // Check ownership (admin can delete any question)
    if (user.role !== 'admin' && question.quiz.createdBy.toString() !== user._id.toString()) {
      return sendError(res, 403, 'Not authorized to delete this question');
    }

    const quizId = question.quiz._id;
    
    await Question.findByIdAndDelete(id);

    // Update quiz totalQuestions count
    const questionCount = await Question.countDocuments({ quiz: quizId });
    await Quiz.findByIdAndUpdate(quizId, { totalQuestions: questionCount });

    return sendSuccess(res, 200, 'Question deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addQuestion,
  updateQuestion,
  deleteQuestion
};