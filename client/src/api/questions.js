import api from './axios'
import { quizzesApi } from './quizzes'

const normalizeQuestion = (question) => {
  if (!question) return question

  return {
    ...question,
    _id: question._id || question.id,
  }
}

export const questionsApi = {
  create: async (payload) => {
    const response = await api.post('/questions', payload)
    return normalizeQuestion(response?.data?.data)
  },

  update: async (id, payload) => {
    const response = await api.put(`/questions/${id}`, payload)
    return normalizeQuestion(response?.data?.data)
  },

  delete: async (id) => {
    const response = await api.delete(`/questions/${id}`)
    return response?.data?.data || null
  },

  getByQuiz: async (quizId) => {
    const quiz = await quizzesApi.getById(quizId)
    return (quiz?.questions || []).map(normalizeQuestion)
  },
}

export default questionsApi
