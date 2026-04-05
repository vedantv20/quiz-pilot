import api from './axios'

const normalizeEntry = (entry) => {
  const user = entry?.user || {}
  const stats = entry?.stats || {}

  return {
    _id: user._id || user.id,
    id: user.id || user._id,
    rank: entry?.rank,
    name: user.name,
    avatar: user.avatar,
    badges: user.badges || [],
    streak: user.streak || 0,
    totalScore: stats.totalScore || 0,
    totalQuizzes: stats.totalAttempts || 0,
    overallAccuracy: stats.overallAccuracy || 0,
    avgPercentage: stats.avgPercentage || 0,
    bestScore: stats.bestScore || 0,
    recentAttempt: stats.recentAttempt || null,
  }
}

export const leaderboardApi = {
  getLeaderboard: async (params = {}) => {
    const response = await api.get('/leaderboard', { params })
    const payload = response?.data?.data || {}
    const leaderboard = payload.leaderboard || []
    return leaderboard.map(normalizeEntry)
  },
}

export default leaderboardApi
