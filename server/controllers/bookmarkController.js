const { Bookmark, Question } = require('../models');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * Bookmark a question
 * POST /api/bookmarks
 */
const createBookmark = async (req, res, next) => {
  try {
    const { questionId } = req.validatedData;
    const student = req.user;

    // Check if question exists
    const question = await Question.findById(questionId);
    if (!question) {
      return sendError(res, 404, 'Question not found');
    }

    // Check if bookmark already exists
    const existingBookmark = await Bookmark.findOne({ 
      student: student._id, 
      question: questionId 
    });

    if (existingBookmark) {
      return sendError(res, 400, 'Question already bookmarked');
    }

    // Create bookmark
    const bookmark = new Bookmark({
      student: student._id,
      question: questionId,
      createdAt: new Date()
    });

    await bookmark.save();

    return sendSuccess(res, 201, 'Question bookmarked successfully', {
      bookmarkId: bookmark._id,
      questionId,
      createdAt: bookmark.createdAt
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove bookmark
 * DELETE /api/bookmarks/:questionId
 */
const removeBookmark = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const student = req.user;

    const bookmark = await Bookmark.findOneAndDelete({ 
      student: student._id, 
      question: questionId 
    });

    if (!bookmark) {
      return sendError(res, 404, 'Bookmark not found');
    }

    return sendSuccess(res, 200, 'Bookmark removed successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get all bookmarked questions for current user
 * GET /api/bookmarks
 */
const getBookmarks = async (req, res, next) => {
  try {
    const student = req.user;
    const { page = 1, limit = 20, subject } = req.query;

    const skip = (page - 1) * limit;

    // Build query
    const matchQuery = { student: student._id };

    const bookmarks = await Bookmark.find(matchQuery)
      .populate({
        path: 'question',
        select: 'text options correctIndex explanation difficulty quiz subject',
        populate: [
          {
            path: 'quiz',
            select: 'title difficulty',
            match: subject ? { subject } : {}
          },
          {
            path: 'subject',
            select: 'name icon'
          }
        ]
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Filter out bookmarks where quiz doesn't match subject filter
    const filteredBookmarks = bookmarks.filter(bookmark => bookmark.question.quiz !== null);

    const totalBookmarks = subject 
      ? filteredBookmarks.length 
      : await Bookmark.countDocuments(matchQuery);

    const bookmarksData = filteredBookmarks.map(bookmark => ({
      _id: bookmark._id,
      question: {
        _id: bookmark.question._id,
        text: bookmark.question.text,
        options: bookmark.question.options,
        correctIndex: bookmark.question.correctIndex,
        explanation: bookmark.question.explanation,
        difficulty: bookmark.question.difficulty,
        quiz: bookmark.question.quiz,
        subject: bookmark.question.subject
      },
      createdAt: bookmark.createdAt
    }));

    return sendSuccess(res, 200, 'Bookmarks retrieved successfully', {
      bookmarks: bookmarksData,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalBookmarks / limit),
        totalBookmarks: subject ? filteredBookmarks.length : totalBookmarks,
        hasNext: skip + limit < totalBookmarks,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBookmark,
  removeBookmark,
  getBookmarks
};