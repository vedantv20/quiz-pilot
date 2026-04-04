import { Crown, Medal, Trophy, Award } from 'lucide-react'

export const LeaderboardTable = ({ 
  users = [], 
  currentUserId = null,
  showBadges = true,
  className = ""
}) => {
  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />
      case 3:
        return <Trophy className="w-5 h-5 text-amber-600" />
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-600 dark:text-gray-400">#{rank}</span>
    }
  }

  const getBadgeColor = (badge) => {
    const badgeColors = {
      'first_quiz': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'streak_7': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      'perfect_score': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'top_10': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'subject_master_Mathematics': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'subject_master_Physics': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'subject_master_Chemistry': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'subject_master_Biology': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      'subject_master_Computer Science': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
      'subject_master_History': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    }
    return badgeColors[badge] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  }

  const formatBadgeName = (badge) => {
    if (badge.startsWith('subject_master_')) {
      return badge.replace('subject_master_', '') + ' Master'
    }
    return badge.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  if (!users.length) {
    return (
      <div className="text-center py-8">
        <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">No leaderboard data available</p>
      </div>
    )
  }

  return (
    <div className={`card overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Score
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Streak
              </th>
              {showBadges && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Badges
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {users.map((user, index) => {
              const rank = index + 1
              const isCurrentUser = user._id === currentUserId
              
              return (
                <tr 
                  key={user._id} 
                  className={`${
                    isCurrentUser 
                      ? 'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                  } transition-colors`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getRankIcon(rank)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-violet-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {user.name?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {user.name}
                          {isCurrentUser && (
                            <span className="ml-2 text-xs text-primary-600 dark:text-primary-400 font-medium">
                              (You)
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {user.targetExam || 'General'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {user.totalScore || 0}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {user.totalQuizzes || 0} quizzes
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
                        {user.streak || 0}
                      </span>
                      <span className="text-orange-600 dark:text-orange-400">🔥</span>
                    </div>
                  </td>
                  {showBadges && (
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {user.badges?.slice(0, 3).map((badge, badgeIndex) => (
                          <span
                            key={badgeIndex}
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor(badge)}`}
                            title={formatBadgeName(badge)}
                          >
                            <Award className="w-3 h-3 mr-1" />
                            {formatBadgeName(badge)}
                          </span>
                        )) || (
                          <span className="text-sm text-gray-400 dark:text-gray-600">
                            No badges
                          </span>
                        )}
                        {user.badges?.length > 3 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            +{user.badges.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}