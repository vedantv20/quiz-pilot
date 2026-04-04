const express = require('express');
const { addQuestion, updateQuestion, deleteQuestion } = require('../controllers/questionController');
const { 
  authenticate, 
  requireRole, 
  validate, 
  createQuestionSchema, 
  updateQuestionSchema 
} = require('../middleware');

const router = express.Router();

// POST /api/questions - Add question to quiz (Teacher/Admin)
router.post('/', 
  authenticate, 
  requireRole('teacher', 'admin'), 
  validate(createQuestionSchema), 
  addQuestion
);

// PUT /api/questions/:id - Update question (Owner or Admin)
router.put('/:id', 
  authenticate, 
  requireRole('teacher', 'admin'), 
  validate(updateQuestionSchema), 
  updateQuestion
);

// DELETE /api/questions/:id - Delete question (Owner or Admin)
router.delete('/:id', 
  authenticate, 
  requireRole('teacher', 'admin'), 
  deleteQuestion
);

module.exports = router;