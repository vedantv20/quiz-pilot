const express = require('express');
const { createBookmark, removeBookmark, getBookmarks } = require('../controllers/bookmarkController');
const { 
  authenticate, 
  validate, 
  createBookmarkSchema 
} = require('../middleware');

const router = express.Router();

// POST /api/bookmarks - Bookmark a question
router.post('/', 
  authenticate, 
  validate(createBookmarkSchema), 
  createBookmark
);

// DELETE /api/bookmarks/:questionId - Remove bookmark
router.delete('/:questionId', 
  authenticate, 
  removeBookmark
);

// GET /api/bookmarks - Get all bookmarked questions
router.get('/', 
  authenticate, 
  getBookmarks
);

module.exports = router;