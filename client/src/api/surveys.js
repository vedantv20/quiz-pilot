import api from './axios'

export const surveysApi = {
  submit: async (payload) => {
    const response = await api.post('/surveys', payload)
    return response?.data?.data || null
  },

  getMy: async () => {
    const response = await api.get('/surveys/my')
    return response?.data?.data || null
  },

  getAll: async (params = {}) => {
    const response = await api.get('/surveys', { params })
    const payload = response?.data?.data || {}
    return {
      surveys: payload.surveys || [],
      pagination: payload.pagination || null,
    }
  },

  getAnalytics: async () => {
    const response = await api.get('/surveys/analytics')
    const payload = response?.data?.data || {}

    const examDistribution = (payload.examDistribution || []).map((item) => ({
      name: item.exam,
      count: item.count,
    }))

    const studyHoursDistribution = (payload.studyHoursByExam || []).map((item) => ({
      hours: item.avgHours,
      count: item.count,
      exam: item.exam,
    }))

    const weakSubjects = payload.weakSubjectsFrequency || []
    const strongSubjects = payload.strongSubjectsFrequency || []
    const resourcesUsed = payload.resourcesFrequency || []

    const wellbeing = payload.wellbeingStats || {}
    const totalResponses = wellbeing.totalResponses || 0

    return {
      totalResponses,
      completionRate: 100,
      examDistribution,
      studyHoursDistribution,
      weakSubjects,
      strongSubjects,
      resourcesUsed,
      averageStressLevel: wellbeing.avgStress || 0,
      averageConfidenceLevel: wellbeing.avgConfidence || 0,
      recentSubmissions: [],
    }
  },

  getStats: async () => {
    const analytics = await surveysApi.getAnalytics()
    return {
      total: analytics.totalResponses || 0,
      completionRate: analytics.completionRate || 0,
    }
  },
}

export default surveysApi
