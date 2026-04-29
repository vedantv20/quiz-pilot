import api from './axios'
import { quizzesApi } from './quizzes'

const normalizeAttempt = (attempt) => {
  if (!attempt) return attempt

  return {
    ...attempt,
    _id: attempt._id || attempt.id,
  }
}

export const attemptsApi = {
  submit: async (payload) => {
    const response = await api.post('/attempts', payload)
    return response?.data?.data || null
  },

  getMy: async (params = {}) => {
    const response = await api.get('/attempts/my', { params })
    const payload = response?.data?.data || {}
    return {
      attempts: (payload.attempts || []).map(normalizeAttempt),
      pagination: payload.pagination || null,
    }
  },

  getByQuiz: async (quizId, params = {}) => {
    const response = await api.get(`/attempts/quiz/${quizId}`, { params })
    const payload = response?.data?.data || {}
    return {
      quiz: payload.quiz || null,
      attempts: (payload.attempts || []).map(normalizeAttempt),
      pagination: payload.pagination || null,
    }
  },

  getStats: async () => {
    const { attempts } = await attemptsApi.getMy({ page: 1, limit: 1000 })
    const total = attempts.length
    const averageScore = total
      ? Math.round((attempts.reduce((sum, attempt) => sum + (attempt.percentage || 0), 0) / total) * 10) / 10
      : 0
    const todayDate = new Date().toDateString()
    const todayCount = attempts.filter(
      (attempt) => new Date(attempt.completedAt).toDateString() === todayDate
    ).length
    const completionRate = total
      ? Math.round((attempts.filter((attempt) => (attempt.percentage || 0) >= 70).length / total) * 100)
      : 0

    const topAttempt = attempts
      .slice()
      .sort((a, b) => (b.percentage || 0) - (a.percentage || 0))[0]

    return {
      total,
      todayCount,
      averageScore,
      completionRate,
      topPerformer: topAttempt?.quiz?.title ? { name: topAttempt.quiz.title } : null,
    }
  },

  getTeacherStats: async () => {
    const response = await api.get('/attempts/teacher-stats')
    return response?.data?.data || {
      totalAttempts: 0,
      averageScore: 0,
      successRate: 0,
      engagementRate: 0,
      recentAttempts: []
    }
  },
}

export default attemptsApi
