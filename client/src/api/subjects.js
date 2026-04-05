import api from './axios'

const normalizeSubject = (subject) => {
  if (!subject) return subject

  return {
    ...subject,
    _id: subject._id || subject.id,
  }
}

export const subjectsApi = {
  getAll: async () => {
    const response = await api.get('/subjects')
    const subjects = response?.data?.data || []
    return subjects.map(normalizeSubject)
  },

  create: async (payload) => {
    const response = await api.post('/subjects', payload)
    return normalizeSubject(response?.data?.data)
  },

  delete: async (id) => {
    const response = await api.delete(`/subjects/${id}`)
    return response?.data?.data || null
  },
}

export default subjectsApi
