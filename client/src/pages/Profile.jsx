import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { 
  User, 
  Mail, 
  Calendar, 
  Trophy, 
  Target, 
  Clock,
  Award,
  TrendingUp,
  Eye,
  EyeOff,
  Save,
  Edit3
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { attemptAPI } from '../api'
import { StatCard } from '../components/StatCard'
import { BadgeChip } from '../components/BadgeChip'
import { ScoreRing } from '../components/ScoreRing'
import toast from 'react-hot-toast'

export const Profile = () => {
  const { user, updateUser } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    targetExam: user?.targetExam || '',
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const toArray = (value) => (Array.isArray(value) ? value : [])
  const withId = (item) => ({ ...item, _id: item?._id || item?.id })

  // Fetch user's attempts for stats
  const { data: attempts = [], isLoading: attemptsLoading } = useQuery({
    queryKey: ['attempts', 'my'],
    queryFn: () =>
      attemptAPI
        .getMy()
        .then((res) => toArray(res?.data?.data?.attempts).map(withId)),
  })

  // Calculate user statistics
  const userStats = {
    totalAttempts: attempts.length,
    averageScore: attempts.length ? 
      Math.round(attempts.reduce((acc, attempt) => acc + attempt.percentage, 0) / attempts.length) : 0,
    bestScore: attempts.length ? Math.max(...attempts.map(a => a.percentage)) : 0,
    totalTime: attempts.reduce((acc, attempt) => acc + (attempt.timeTaken || 0), 0),
    currentStreak: user?.streak || 0,
    totalBadges: user?.badges?.length || 0,
    recentActivity: attempts
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
      .slice(0, 10)
  }

  // Calculate performance trend (last 10 attempts)
  const recentScores = userStats.recentActivity.map(a => a.percentage).reverse()
  const trend = recentScores.length >= 2 ? 
    recentScores[recentScores.length - 1] - recentScores[0] : 0

  const getBadgeInfo = (badge) => {
    const badgeMap = {
      'first_quiz': { name: 'First Quiz', icon: '🎯', color: 'blue' },
      'streak_7': { name: '7-Day Streak', icon: '🔥', color: 'orange' },
      'perfect_score': { name: 'Perfect Score', icon: '⭐', color: 'yellow' },
      'top_10': { name: 'Top 10', icon: '🏆', color: 'purple' },
      'subject_master_Mathematics': { name: 'Math Master', icon: '➕', color: 'blue' },
      'subject_master_Physics': { name: 'Physics Master', icon: '⚛️', color: 'purple' },
      'subject_master_Chemistry': { name: 'Chemistry Master', icon: '🧪', color: 'green' },
      'subject_master_Biology': { name: 'Biology Master', icon: '🧬', color: 'red' },
      'subject_master_Computer Science': { name: 'CS Master', icon: '💻', color: 'indigo' },
      'subject_master_History': { name: 'History Master', icon: '📜', color: 'yellow' },
    }
    return badgeMap[badge] || { name: badge.replace(/_/g, ' '), icon: '🎖️', color: 'gray' }
  }

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const handleSaveProfile = () => {
    // In a real app, this would make an API call to update the profile
    updateUser(formData)
    setIsEditing(false)
    toast.success('Profile updated successfully')
  }

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters')
      return
    }
    
    // In a real app, this would make an API call to change the password
    toast.success('Password changed successfully')
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    setShowChangePassword(false)
  }

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  return (
    <div className="page-shell">
      <div className="page-container">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          My Profile
        </h1>
        <p className="text-muted-foreground">
          Manage your account settings and view your learning progress
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-8">
          {/* Basic Information */}
          <div className="surface-card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">
                Basic Information
              </h2>
              <button
                onClick={() => {
                  if (isEditing) {
                    handleSaveProfile()
                  } else {
                    setIsEditing(true)
                  }
                }}
                className="btn-secondary flex items-center space-x-2"
              >
                {isEditing ? (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                ) : (
                  <>
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Avatar */}
              <div className="md:col-span-2 flex items-center space-x-6">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground">
                    {user?.name}
                  </h3>
                  <p className="text-sm text-muted-foreground capitalize">
                    {user?.role}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-muted-foreground">
                      {userStats.totalBadges} badges earned
                    </span>
                  </div>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="input-field"
                  />
                ) : (
                  <div className="flex items-center space-x-2 text-foreground">
                    <User className="w-4 h-4 text-gray-400" />
                    <span>{user?.name}</span>
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <div className="flex items-center space-x-2 text-foreground">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{user?.email}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Email cannot be changed
                </p>
              </div>

              {/* Target Exam */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Target Exam
                </label>
                {isEditing ? (
                  <select
                    value={formData.targetExam}
                    onChange={(e) => setFormData(prev => ({ ...prev, targetExam: e.target.value }))}
                    className="input-field"
                  >
                    <option value="">Select target exam</option>
                    <option value="JEE">JEE Main/Advanced</option>
                    <option value="NEET">NEET</option>
                    <option value="UPSC">UPSC Civil Services</option>
                    <option value="CAT">CAT/MBA</option>
                    <option value="GATE">GATE</option>
                    <option value="BOARD">Board Exams</option>
                    <option value="OTHER">Other</option>
                  </select>
                ) : (
                  <div className="flex items-center space-x-2 text-foreground">
                    <Target className="w-4 h-4 text-gray-400" />
                    <span>{user?.targetExam || 'Not set'}</span>
                  </div>
                )}
              </div>

              {/* Join Date */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Member Since
                </label>
                <div className="flex items-center space-x-2 text-foreground">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>{new Date(user?.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Cancel editing */}
            {isEditing && (
              <div className="mt-4 pt-4 border-t border-border">
                <button
                  onClick={() => {
                    setIsEditing(false)
                    setFormData({
                      name: user?.name || '',
                      targetExam: user?.targetExam || '',
                    })
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Change Password */}
          <div className="surface-card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">
                Security
              </h2>
              <button
                onClick={() => setShowChangePassword(!showChangePassword)}
                className="btn-secondary"
              >
                {showChangePassword ? 'Cancel' : 'Change Password'}
              </button>
            </div>

            {showChangePassword ? (
              <div className="space-y-4">
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className="input-field pr-10"
                      placeholder="Enter current password"
                    />
                    <button
                      onClick={() => togglePasswordVisibility('current')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPasswords.current ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="input-field pr-10"
                      placeholder="Enter new password"
                    />
                    <button
                      onClick={() => togglePasswordVisibility('new')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPasswords.new ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="input-field pr-10"
                      placeholder="Confirm new password"
                    />
                    <button
                      onClick={() => togglePasswordVisibility('confirm')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPasswords.confirm ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleChangePassword}
                  className="btn-primary"
                  disabled={!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                >
                  Update Password
                </button>
              </div>
            ) : (
              <p className="text-muted-foreground">
                Keep your account secure with a strong password
              </p>
            )}
          </div>

          {/* Recent Activity */}
          <div className="surface-card">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              Recent Activity
            </h2>
            
            {userStats.recentActivity.length > 0 ? (
              <div className="space-y-4">
                {userStats.recentActivity.map((attempt) => (
                  <div key={attempt._id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <h4 className="font-medium text-foreground">
                        {attempt.quiz?.title || 'Untitled Quiz'}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(attempt.completedAt).toLocaleDateString()} • {formatTime(attempt.timeTaken)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-semibold ${
                        attempt.percentage >= 80 ? 'text-green-600 dark:text-green-400' :
                        attempt.percentage >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-red-600 dark:text-red-400'
                      }`}>
                        {attempt.percentage}%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {attempt.score}/{attempt.quiz?.totalQuestions}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No quiz attempts yet. Start taking quizzes to see your activity here.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          {/* Performance Overview */}
          <div className="surface-card text-center">
            <h3 className="text-lg font-semibold text-foreground mb-6">
              Overall Performance
            </h3>
            <ScoreRing 
              score={userStats.averageScore} 
              size={120} 
              className="mx-auto mb-6"
            />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Best Score:</span>
                <span className="font-medium text-foreground">
                  {userStats.bestScore}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Trend:</span>
                <span className={`font-medium ${
                  trend > 0 ? 'text-green-600 dark:text-green-400' :
                  trend < 0 ? 'text-red-600 dark:text-red-400' :
                  'text-foreground'
                }`}>
                  {trend > 0 ? '+' : ''}{trend.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <StatCard
              title="Total Quizzes"
              value={userStats.totalAttempts}
              icon={Trophy}
              color="primary"
            />
            <StatCard
              title="Study Time"
              value={formatTime(userStats.totalTime)}
              icon={Clock}
              color="info"
            />
            <StatCard
              title="Current Streak"
              value={`${userStats.currentStreak} days`}
              icon={TrendingUp}
              color="warning"
            />
          </div>

          {/* Badges */}
          <div className="surface-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Achievements
            </h3>
            
            {user?.badges && user.badges.length > 0 ? (
              <div className="space-y-3">
                {user.badges.map((badge, index) => {
                  const badgeInfo = getBadgeInfo(badge)
                  return (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                      <div className="text-2xl">{badgeInfo.icon}</div>
                      <div>
                        <div className="font-medium text-foreground">
                          {badgeInfo.name}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-6">
                <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-muted-foreground text-sm">
                  No badges earned yet. Keep taking quizzes to unlock achievements!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}



