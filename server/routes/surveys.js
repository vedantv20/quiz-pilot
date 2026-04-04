const express = require('express');
const { 
  submitSurvey, 
  getMySurvey, 
  getAllSurveys, 
  getSurveyAnalytics 
} = require('../controllers/surveyController');
const { 
  authenticate, 
  requireRole, 
  validate, 
  submitSurveySchema 
} = require('../middleware');

const router = express.Router();

// POST /api/surveys - Submit survey (student, one per user - upsert)
router.post('/', 
  authenticate, 
  requireRole('student'), 
  validate(submitSurveySchema), 
  submitSurvey
);

// GET /api/surveys/my - Get current user's survey
router.get('/my', 
  authenticate, 
  requireRole('student'), 
  getMySurvey
);

// GET /api/surveys/analytics - Get survey analytics (admin only)
router.get('/analytics', 
  authenticate, 
  requireRole('admin'), 
  getSurveyAnalytics
);

// GET /api/surveys - Get all surveys (admin only)
router.get('/', 
  authenticate, 
  requireRole('admin'), 
  getAllSurveys
);

module.exports = router;