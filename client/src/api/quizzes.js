import api from './axios'

const normalizeId = (item) => {
  if (!item) return item
  return {
    ...item,
    _id: item._id || item.id,
  }
}

const normalizeQuiz = (quiz) => {
  if (!quiz) return quiz

  const normalized = normalizeId(quiz)
  const subject = normalizeId(normalized.subject)
  const createdBy = normalizeId(normalized.createdBy)
  const questions = Array.isArray(normalized.questions)
    ? normalized.questions.map((question) => normalizeId(question))
    : []

  return {
    ...normalized,
    subject,
    createdBy,
    questions,
  }
}

export const quizzesApi = {
  getAll: async (params = {}) => {
    const response = await api.get('/quizzes', { params })
    const quizzes = response?.data?.data || []
    return quizzes.map(normalizeQuiz)
  },

  getById: async (id) => {
    const response = await api.get(`/quizzes/${id}`)
    return normalizeQuiz(response?.data?.data)
  },

  create: async (payload) => {
    const response = await api.post('/quizzes', payload)
    return normalizeQuiz(response?.data?.data)
  },

  update: async (id, payload) => {
    const response = await api.put(`/quizzes/${id}`, payload)
    return normalizeQuiz(response?.data?.data)
  },

  delete: async (id) => {
    const response = await api.delete(`/quizzes/${id}`)
    return response?.data?.data || null
  },

  togglePublish: async (id) => {
    const response = await api.post(`/quizzes/${id}/publish`)
    return response?.data?.data || null
  },

  getQuizStats: async (id) => {
    const response = await api.get(`/quizzes/${id}/stats`)
    return response?.data?.data || null
  },

  getByTeacher: async (teacherId) => {
    const response = await api.get('/quizzes/mine')
    const quizzes = response?.data?.data || []
    const normalized = quizzes.map(normalizeQuiz)

    if (!teacherId) {
      return normalized
    }

    return normalized.filter((quiz) => (quiz.createdBy?._id || quiz.createdBy?.id) === teacherId)
  },

  getStats: async () => {
    const quizzes = await quizzesApi.getAll()
    return {
      total: quizzes.length,
      published: quizzes.filter((quiz) => quiz.isPublished).length,
      drafts: quizzes.filter((quiz) => !quiz.isPublished).length,
    }
  },

  getRecent: async (limit = 5) => {
    const quizzes = await quizzesApi.getAll()
    return quizzes
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, limit)
  },
}

export default quizzesApi
