import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { 
  BookOpen, 
  Trophy, 
  Target, 
  TrendingUp, 
  Clock, 
  Award,
  ChevronRight,
  Play
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { attemptAPI, quizAPI, subjectAPI, leaderboardAPI } from '../api'
import { StatCard } from '../components/StatCard'
import { SubjectChart } from '../components/SubjectChart'
import { ScoreRing } from '../components/ScoreRing'
import { QuizCard } from '../components/QuizCard'

export const Dashboard = () => {
  const { user } = useAuthStore()

  // Fetch user's attempt history
  const { data: attempts = [], isLoading: attemptsLoading } = useQuery({
    queryKey: ['attempts', 'my'],
    queryFn: () => attemptAPI.getMy().then(res => res.data.data),
  })

  // Fetch subjects for performance analysis
  const { data: subjects = [] } = useQuery({
    queryKey: ['subjects'],
    queryFn: () => subjectAPI.getAll().then(res => res.data.data),
  })

  // Fetch recent quizzes
  const { data: recentQuizzes = [] } = useQuery({
    queryKey: ['quizzes', 'recent'],
    queryFn: () => quizAPI.getAll({ limit: 6 }).then(res => res.data.data),
  })

  // Fetch leaderboard position
  const { data: leaderboard = [] } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => leaderboardAPI.get().then(res => res.data.data),
  })

  // Calculate dashboard stats
  const stats = {
    totalQuizzes: attempts.length,
    averageScore: attempts.length ? 
      Math.round(attempts.reduce((acc, attempt) => acc + attempt.percentage, 0) / attempts.length) : 0,
    totalTime: attempts.reduce((acc, attempt) => acc + (attempt.timeTaken || 0), 0),
    currentStreak: user?.streak || 0,
    currentRank: leaderboard.findIndex(u => u._id === user?._id) + 1 || 0,
    badgeCount: user?.badges?.length || 0
  }

  // Calculate subject performance
  const subjectPerformance = subjects.map(subject => {
    const subjectAttempts = attempts.filter(attempt => 
      attempt.quiz?.subject === subject._id || 
      attempt.quiz?.subject?._id === subject._id
    )
    
    return {
      subject: subject,
      averageScore: subjectAttempts.length ? 
        Math.round(subjectAttempts.reduce((acc, attempt) => acc + attempt.percentage, 0) / subjectAttempts.length) : 0,
      attempts: subjectAttempts.length
    }
  }).filter(item => item.attempts > 0)

  // Get recent attempts for trend
  const recentAttempts = attempts
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
    .slice(0, 10)
    .reverse()

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  if (attemptsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {getGreeting()}, {user?.name}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Ready to continue your learning journey?
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link
            to="/subjects"
            className="btn-primary flex items-center space-x-2"
          >
            <Play className="w-4 h-4" />
            <span>Take a Quiz</span>
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Quizzes Completed"
          value={stats.totalQuizzes}
          icon={BookOpen}
          color="primary"
          subtitle="All time"
        />
        <StatCard
          title="Average Score"
          value={`${stats.averageScore}%`}
          icon={Target}
          color="success"
          trend={stats.totalQuizzes >= 2 ? 
            Math.round(((recentAttempts[recentAttempts.length - 1]?.percentage || 0) - 
            (recentAttempts[0]?.percentage || 0))) : undefined}
          trendLabel="from last quiz"
        />
        <StatCard
          title="Study Time"
          value={formatTime(stats.totalTime)}
          icon={Clock}
          color="info"
          subtitle="Total time spent"
        />
        <StatCard
          title="Current Streak"
          value={`${stats.currentStreak} days`}
          icon={Trophy}
          color="warning"
          subtitle={stats.currentStreak > 0 ? "Keep it up! 🔥" : "Start your streak today"}
        />
      </div>

      {/* Performance & Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subject Performance Chart */}
        <div className="lg:col-span-2">
          <SubjectChart 
            data={subjectPerformance}
            title="Performance by Subject"
          />
        </div>

        {/* Overall Performance Ring */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Overall Performance
          </h3>
          <div className="flex flex-col items-center space-y-6">
            <ScoreRing 
              score={stats.averageScore} 
              size={140} 
            />
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <Trophy className="w-4 h-4" />
                  <span>Rank #{stats.currentRank || 'Unranked'}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Award className="w-4 h-4" />
                  <span>{stats.badgeCount} badges</span>
                </div>
              </div>
              <Link 
                to="/leaderboard"
                className="text-primary-600 dark:text-primary-400 hover:text-primary-500 text-sm font-medium"
              >
                View Leaderboard →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Attempts */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Activity
            </h3>
            <Link 
              to="/profile"
              className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-500 flex items-center space-x-1"
            >
              <span>View all</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          {recentAttempts.length > 0 ? (
            <div className="space-y-3">
              {recentAttempts.slice(0, 5).map((attempt) => (
                <div key={attempt._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                      {attempt.quiz?.title || 'Untitled Quiz'}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {new Date(attempt.completedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-semibold ${
                      attempt.percentage >= 80 ? 'text-green-600 dark:text-green-400' :
                      attempt.percentage >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
                      'text-red-600 dark:text-red-400'
                    }`}>
                      {attempt.percentage}%
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {attempt.score}/{attempt.quiz?.totalQuestions} correct
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No quiz attempts yet
              </p>
              <Link to="/subjects" className="btn-primary">
                Take Your First Quiz
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Quick Actions
          </h3>
          <div className="space-y-4">
            {/* Survey Prompt */}
            <Link
              to="/survey"
              className="block p-4 bg-gradient-to-r from-primary-50 to-violet-50 dark:from-primary-900/20 dark:to-violet-900/20 rounded-lg border border-primary-200 dark:border-primary-800 hover:shadow-md transition-all"
            >
              <div className="flex items-center space-x-3">
                <div className="text-2xl">📝</div>
                <div>
                  <h4 className="font-medium text-primary-900 dark:text-primary-100">
                    Complete Your Survey
                  </h4>
                  <p className="text-sm text-primary-700 dark:text-primary-300">
                    Help us personalize your learning experience
                  </p>
                </div>
              </div>
            </Link>

            {/* Bookmarks */}
            <Link
              to="/bookmarks"
              className="block p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">🔖</div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Bookmarked Questions
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Review saved questions
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </Link>

            {/* Leaderboard */}
            <Link
              to="/leaderboard"
              className="block p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">🏆</div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Leaderboard
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      See your ranking
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Popular Quizzes */}
      {recentQuizzes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Popular Quizzes
            </h2>
            <Link 
              to="/subjects"
              className="text-primary-600 dark:text-primary-400 hover:text-primary-500 flex items-center space-x-1"
            >
              <span>Browse all</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentQuizzes.slice(0, 6).map((quiz) => {
              const subject = subjects.find(s => s._id === quiz.subject || s._id === quiz.subject?._id)
              return (
                <QuizCard 
                  key={quiz._id} 
                  quiz={quiz} 
                  subject={subject}
                />
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
