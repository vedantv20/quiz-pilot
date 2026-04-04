const express = require('express');
const { getAllSubjects, createSubject, deleteSubject } = require('../controllers/subjectController');
const { authenticate, requireRole, validate, createSubjectSchema } = require('../middleware');

const router = express.Router();

// GET /api/subjects - Public route
router.get('/', getAllSubjects);

// POST /api/subjects - Admin only
router.post('/', 
  authenticate, 
  requireRole('admin'), 
  validate(createSubjectSchema), 
  createSubject
);

// DELETE /api/subjects/:id - Admin only
router.delete('/:id', 
  authenticate, 
  requireRole('admin'), 
  deleteSubject
);

module.exports = router;