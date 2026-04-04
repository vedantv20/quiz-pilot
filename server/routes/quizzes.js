const express = require('express');
const { 
  getAllQuizzes, 
  getQuizById, 
  createQuiz, 
  updateQuiz, 
  deleteQuiz, 
  togglePublishQuiz,
  getQuizStats 
} = require('../controllers/quizController');
const { 
  authenticate, 
  requireRole, 
  validate, 
  createQuizSchema, 
  updateQuizSchema 
} = require('../middleware');

const router = express.Router();

// GET /api/quizzes - Get all published quizzes
router.get('/', getAllQuizzes);

// GET /api/quizzes/:id - Get quiz by ID with questions
router.get('/:id', authenticate, getQuizById);

// POST /api/quizzes - Create quiz (Teacher/Admin)
router.post('/', 
  authenticate, 
  requireRole('teacher', 'admin'), 
  validate(createQuizSchema), 
  createQuiz
);

// PUT /api/quizzes/:id - Update quiz (Owner or Admin)
router.put('/:id', 
  authenticate, 
  requireRole('teacher', 'admin'), 
  validate(updateQuizSchema), 
  updateQuiz
);

// DELETE /api/quizzes/:id - Delete quiz (Owner or Admin)
router.delete('/:id', 
  authenticate, 
  requireRole('teacher', 'admin'), 
  deleteQuiz
);

// POST /api/quizzes/:id/publish - Toggle publish status (Owner or Admin)
router.post('/:id/publish', 
  authenticate, 
  requireRole('teacher', 'admin'), 
  togglePublishQuiz
);

// GET /api/quizzes/:id/stats - Get quiz statistics (Owner or Admin)
router.get('/:id/stats', 
  authenticate, 
  requireRole('teacher', 'admin'), 
  getQuizStats
);

module.exports = router;