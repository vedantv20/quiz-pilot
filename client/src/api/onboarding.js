import api from './axios';

// Get exam categories for onboarding
export const getExamCategories = async (educationLevel = null) => {
  const params = educationLevel ? { educationLevel } : {};
  const response = await api.get('/onboarding/exam-categories', { params });
  return response.data;
};

// Get all available target exams
export const getTargetExams = async () => {
  const response = await api.get('/onboarding/target-exams');
  return response.data;
};

// Complete onboarding
export const completeOnboarding = async (data) => {
  const response = await api.post('/onboarding/complete', data);
  return response.data;
};

// Get subjects based on user qualification
export const getSubjectsByQualification = async () => {
  const response = await api.get('/onboarding/subjects');
  return response.data;
};

// Get suggested quizzes based on user qualification
export const getSuggestedQuizzes = async (params = {}) => {
  const response = await api.get('/onboarding/suggested-quizzes', { params });
  return response.data;
};

// Update target exams
export const updateTargetExams = async (targetExams) => {
  const response = await api.put('/onboarding/target-exams', { targetExams });
  return response.data;
};
