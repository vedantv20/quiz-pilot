import api from './axios'

const normalizeUser = (user) => {
  if (!user) return user

  return {
    ...user,
    _id: user._id || user.id,
  }
}

export const usersApi = {
  getAll: async (params = {}) => {
    const response = await api.get('/users', { params })
    const payload = response?.data?.data || {}
    const users = (payload.users || []).map(normalizeUser)
    const pagination = payload.pagination || {}

    return {
      users,
      total: pagination.totalUsers || users.length,
      totalPages: pagination.totalPages || 1,
      page: pagination.currentPage || 1,
      hasNext: Boolean(pagination.hasNext),
      hasPrev: Boolean(pagination.hasPrev),
    }
  },

  updateRole: async (userId, role) => {
    const response = await api.put(`/users/${userId}/role`, { role })
    return normalizeUser(response?.data?.data)
  },

  delete: async (userId) => {
    const response = await api.delete(`/users/${userId}`)
    return response?.data?.data || null
  },

  getStats: async () => {
    const response = await api.get('/users/stats')
    const data = response?.data?.data || {}
    const users = data.users || {}
    const content = data.content || {}

    return {
      total: users.total || 0,
      newThisWeek: users.recentRegistrations || 0,
      byRole: {
        student: users.students || 0,
        teacher: users.teachers || 0,
        admin: users.admins || 0,
      },
      activeLastWeek: users.activeUsers || 0,
      content,
    }
  },

  getRecent: async (limit = 5) => {
    const data = await usersApi.getAll({ page: 1, limit })
    return data.users.slice(0, limit)
  },
}

export default usersApi
