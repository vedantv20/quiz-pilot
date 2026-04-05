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

  getTeacherStats: async (teacherId, timeframe = 'all') => {
    const quizzes = await quizzesApi.getByTeacher(teacherId)
    const quizAttemptResults = await Promise.all(
      quizzes.map((quiz) => attemptsApi.getByQuiz(quiz._id, { page: 1, limit: 1000 }))
    )

    const timeframeDays = timeframe === 'week' ? 7 : timeframe === 'month' ? 30 : null
    const now = new Date()
    const filteredAttempts = quizAttemptResults
      .flatMap((entry) => (entry.attempts || []).map((attempt) => ({ ...attempt, quiz: entry.quiz })))
      .filter((attempt) => {
        if (!timeframeDays) return true
        const daysAgo = (now.getTime() - new Date(attempt.completedAt).getTime()) / (1000 * 60 * 60 * 24)
        return daysAgo <= timeframeDays
      })

    const totalAttempts = filteredAttempts.length
    const averageScore = totalAttempts
      ? filteredAttempts.reduce((sum, attempt) => sum + (attempt.percentage || 0), 0) / totalAttempts
      : 0
    const successRate = totalAttempts
      ? Math.round((filteredAttempts.filter((attempt) => (attempt.percentage || 0) >= 70).length / totalAttempts) * 100)
      : 0
    const engagementRate = quizzes.length ? Math.round((totalAttempts / quizzes.length) * 10) / 10 : 0

    const recentAttempts = filteredAttempts
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
      .slice(0, 10)
      .map((attempt) => ({
        studentName: attempt.student?.name || 'Student',
        percentage: attempt.percentage || 0,
        quizTitle: attempt.quiz?.title || 'Quiz',
      }))

    return {
      totalAttempts,
      averageScore,
      successRate,
      engagementRate,
      recentAttempts,
    }
  },
}

export default attemptsApi
