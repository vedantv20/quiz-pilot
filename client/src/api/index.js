import api from './axios'

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
}

// Subject API calls
export const subjectAPI = {
  getAll: () => api.get('/subjects'),
  create: (data) => api.post('/subjects', data),
  delete: (id) => api.delete(`/subjects/${id}`),
}

// Helper to filter out undefined/null params
const cleanParams = (params) => {
  if (!params) return undefined
  const cleaned = {}
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      cleaned[key] = value
    }
  })
  return Object.keys(cleaned).length > 0 ? cleaned : undefined
}

// Quiz API calls
export const quizAPI = {
  getAll: (params) => api.get('/quizzes', { params: cleanParams(params) }),
  getById: (id) => api.get(`/quizzes/${id}`),
  create: (data) => api.post('/quizzes', data),
  update: (id, data) => api.put(`/quizzes/${id}`, data),
  delete: (id) => api.delete(`/quizzes/${id}`),
  togglePublish: (id) => api.post(`/quizzes/${id}/publish`),
  getStats: (id) => api.get(`/quizzes/${id}/stats`),
}

// Question API calls
export const questionAPI = {
  create: (data) => api.post('/questions', data),
  update: (id, data) => api.put(`/questions/${id}`, data),
  delete: (id) => api.delete(`/questions/${id}`),
}

// Attempt API calls
export const attemptAPI = {
  submit: (data) => api.post('/attempts', data),
  getMy: () => api.get('/attempts/my'),
  getByQuiz: (quizId) => api.get(`/attempts/quiz/${quizId}`),
}

// Leaderboard API calls
export const leaderboardAPI = {
  get: (params) => api.get('/leaderboard', { params: cleanParams(params) }),
}

// Survey API calls
export const surveyAPI = {
  submit: (data) => api.post('/surveys', data),
  getMy: () => api.get('/surveys/my'),
  getAll: () => api.get('/surveys'),
  getAnalytics: () => api.get('/surveys/analytics'),
}

// Bookmark API calls
export const bookmarkAPI = {
  add: (questionId) => api.post('/bookmarks', { questionId }),
  remove: (questionId) => api.delete(`/bookmarks/${questionId}`),
  getAll: () => api.get('/bookmarks'),
}

// User API calls
export const userAPI = {
  getAll: (params) => api.get('/users', { params: cleanParams(params) }),
  updateRole: (id, role) => api.put(`/users/${id}/role`, { role }),
  delete: (id) => api.delete(`/users/${id}`),
}

// Onboarding API calls
export const onboardingAPI = {
  getExamCategories: (educationLevel) => api.get('/onboarding/exam-categories', { params: cleanParams({ educationLevel }) }),
  getTargetExams: () => api.get('/onboarding/target-exams'),
  completeOnboarding: (data) => api.post('/onboarding/complete', data),
  getSubjectsByQualification: () => api.get('/onboarding/subjects'),
  getSuggestedQuizzes: (params) => api.get('/onboarding/suggested-quizzes', { params: cleanParams(params) }),
  updateTargetExams: (targetExams) => api.put('/onboarding/target-exams', { targetExams }),
}