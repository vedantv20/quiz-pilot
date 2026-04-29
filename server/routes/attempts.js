const express = require('express');
const { submitAttempt, getMyAttempts, getQuizAttempts, getTeacherStats } = require('../controllers/attemptController');
const { 
  authenticate, 
  requireRole, 
  validate, 
  submitAttemptSchema 
} = require('../middleware');

const router = express.Router();

// POST /api/attempts - Submit quiz attempt
router.post('/', 
  authenticate, 
  validate(submitAttemptSchema), 
  submitAttempt
);

// GET /api/attempts/my - Get current user's attempt history
router.get('/my', 
  authenticate, 
  getMyAttempts
);

// GET /api/attempts/teacher-stats - Get stats for all quizzes by teacher
router.get('/teacher-stats', 
  authenticate, 
  requireRole('teacher', 'admin'), 
  getTeacherStats
);

// GET /api/attempts/quiz/:quizId - Get all attempts for a quiz (Teacher/Admin)
router.get('/quiz/:quizId', 
  authenticate, 
  requireRole('teacher', 'admin'), 
  getQuizAttempts
);

module.exports = router;