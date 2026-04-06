const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const onboardingController = require('../controllers/onboardingController');

// Save user onboarding data (education level, target exams)
router.post('/complete', authenticate, onboardingController.completeOnboarding);

// Skip onboarding - mark as completed without saving preferences
router.post('/skip', authenticate, onboardingController.skipOnboarding);

// Get exam categories for onboarding selection
router.get('/exam-categories', onboardingController.getExamCategories);

// Get subjects by education level and target exams
router.get('/subjects', authenticate, onboardingController.getSubjectsByQualification);

// Get suggested quizzes based on user's qualification
router.get('/suggested-quizzes', authenticate, onboardingController.getSuggestedQuizzes);

// Get all available target exams
router.get('/target-exams', onboardingController.getTargetExams);

// Update user's target exams
router.put('/target-exams', authenticate, onboardingController.updateTargetExams);

module.exports = router;
