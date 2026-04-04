import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  BookOpen, 
  Users, 
  TrendingUp, 
  Clock, 
  BarChart3, 
  Eye, 
  Edit, 
  Trash2, 
  MoreVertical,
  Trophy,
  Target
} from 'lucide-react';
import { quizzesApi } from '../api/quizzes';
import { attemptsApi } from '../api/attempts';
import { useAuthStore } from '../store/authStore';
import StatCard from '../components/StatCard';
import QuizCard from '../components/QuizCard';
import BadgeChip from '../components/BadgeChip';

const TeacherDashboard = () => {
  const { user } = useAuthStore();
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');

  // Fetch teacher's quizzes
  const { data: quizzes = [], isLoading: quizzesLoading } = useQuery({
    queryKey: ['teacher-quizzes'],
    queryFn: () => quizzesApi.getByTeacher(user.id)
  });

  // Fetch quiz statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['teacher-stats', selectedTimeframe],
    queryFn: () => attemptsApi.getTeacherStats(user.id, selectedTimeframe)
  });

  // Calculate aggregate stats
  const totalQuizzes = quizzes.length;
  const publishedQuizzes = quizzes.filter(q => q.isPublished).length;
  const totalAttempts = stats?.totalAttempts || 0;
  const averageScore = stats?.averageScore || 0;

  // Get top performing quiz
  const topQuiz = quizzes
    .filter(q => q.attemptCount > 0)
    .sort((a, b) => (b.averageScore || 0) - (a.averageScore || 0))[0];

  // Recent quizzes (last 5)
  const recentQuizzes = quizzes
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Teacher Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your quizzes and track student performance
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-3">
            <Link
              to="/teacher/quiz/new"
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Quiz
            </Link>
          </div>
        </div>

        {/* Timeframe Filter */}
        <div className="mb-8">
          <div className="flex gap-2">
            {[
              { key: 'week', label: 'This Week' },
              { key: 'month', label: 'This Month' },
              { key: 'all', label: 'All Time' }
            ].map((option) => (
              <button
                key={option.key}
                onClick={() => setSelectedTimeframe(option.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedTimeframe === option.key
                    ? 'bg-purple-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 border border-gray-200 dark:border-gray-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<BookOpen className="w-6 h-6 text-blue-600" />}
            title="Total Quizzes"
            value={totalQuizzes}
            subtitle={`${publishedQuizzes} published`}
            className="bg-blue-50 dark:bg-blue-900/20"
          />
          <StatCard
            icon={<Users className="w-6 h-6 text-green-600" />}
            title="Total Attempts"
            value={totalAttempts}
            subtitle={selectedTimeframe !== 'all' ? `In ${selectedTimeframe}` : 'All time'}
            className="bg-green-50 dark:bg-green-900/20"
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6 text-purple-600" />}
            title="Average Score"
            value={`${averageScore.toFixed(1)}%`}
            subtitle="Across all quizzes"
            className="bg-purple-50 dark:bg-purple-900/20"
          />
          <StatCard
            icon={<Target className="w-6 h-6 text-orange-600" />}
            title="Success Rate"
            value={`${stats?.successRate || 0}%`}
            subtitle="Students scoring 70%+"
            className="bg-orange-50 dark:bg-orange-900/20"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Top Performing Quiz */}
            {topQuiz && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Top Performing Quiz
                  </h2>
                </div>
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-700">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {topQuiz.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {topQuiz.subject?.name} • {topQuiz.totalQuestions} questions
                      </p>
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {topQuiz.attemptCount} attempts
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4 text-green-500" />
                          <span className="text-sm font-medium text-green-600 dark:text-green-400">
                            {topQuiz.averageScore}% avg score
                          </span>
                        </div>
                      </div>
                    </div>
                    <BadgeChip text={topQuiz.difficulty} variant={topQuiz.difficulty} />
                  </div>
                </div>
              </div>
            )}

            {/* Recent Quizzes */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Your Quizzes
                  </h2>
                  <Link
                    to="/teacher/quizzes"
                    className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                  >
                    View all
                  </Link>
                </div>
              </div>

              {quizzesLoading ? (
                <div className="p-6">
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                        <div className="flex-1">
                          <div className="w-48 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
                          <div className="w-32 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        </div>
                        <div className="w-20 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : recentQuizzes.length > 0 ? (
                <div className="p-6">
                  <div className="space-y-4">
                    {recentQuizzes.map((quiz) => (
                      <QuizManagementCard key={quiz._id} quiz={quiz} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No quizzes yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Create your first quiz to get started
                  </p>
                  <Link
                    to="/teacher/quiz/new"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Create Quiz
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Stats
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Draft Quizzes</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {totalQuizzes - publishedQuizzes}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Published Quizzes</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {publishedQuizzes}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Questions Created</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {quizzes.reduce((sum, quiz) => sum + (quiz.totalQuestions || 0), 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Student Engagement</span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    {stats?.engagementRate || 0}%
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recent Activity
              </h3>
              <div className="space-y-3">
                {stats?.recentAttempts?.slice(0, 5).map((attempt, index) => (
                  <div key={index} className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-purple-600 rounded-full" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {attempt.studentName} scored {attempt.percentage}% on {attempt.quizTitle}
                    </span>
                  </div>
                )) || (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No recent activity
                  </p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link
                  to="/teacher/quiz/new"
                  className="flex items-center gap-3 w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Create New Quiz
                </Link>
                <Link
                  to="/subjects"
                  className="flex items-center gap-3 w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  Browse Subjects
                </Link>
                <Link
                  to="/leaderboard"
                  className="flex items-center gap-3 w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <BarChart3 className="w-4 h-4" />
                  View Leaderboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Quiz Management Card Component
const QuizManagementCard = ({ quiz }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
      {/* Quiz Icon */}
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
        quiz.isPublished 
          ? 'bg-green-100 dark:bg-green-900/20' 
          : 'bg-yellow-100 dark:bg-yellow-900/20'
      }`}>
        <BookOpen className={`w-6 h-6 ${
          quiz.isPublished 
            ? 'text-green-600 dark:text-green-400' 
            : 'text-yellow-600 dark:text-yellow-400'
        }`} />
      </div>

      {/* Quiz Info */}
      <div className="flex-1">
        <h3 className="font-medium text-gray-900 dark:text-white">
          {quiz.title}
        </h3>
        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
          <span>{quiz.subject?.name}</span>
          <span>•</span>
          <span>{quiz.totalQuestions} questions</span>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {Math.floor(quiz.timeLimit / 60)} min
          </div>
        </div>
      </div>

      {/* Status & Actions */}
      <div className="flex items-center gap-3">
        <BadgeChip 
          text={quiz.isPublished ? 'Published' : 'Draft'} 
          variant={quiz.isPublished ? 'green' : 'yellow'} 
        />
        
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {quiz.attemptCount || 0}
          </span>
        </div>

        {/* Actions Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            <MoreVertical className="w-4 h-4 text-gray-500" />
          </button>

          {showMenu && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
                <Link
                  to={`/quiz/${quiz._id}`}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 first:rounded-t-lg"
                  onClick={() => setShowMenu(false)}
                >
                  <Eye className="w-4 h-4" />
                  View Quiz
                </Link>
                <Link
                  to={`/teacher/quiz/${quiz._id}/edit`}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => setShowMenu(false)}
                >
                  <Edit className="w-4 h-4" />
                  Edit Quiz
                </Link>
                <Link
                  to={`/teacher/quiz/${quiz._id}/stats`}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 last:rounded-b-lg"
                  onClick={() => setShowMenu(false)}
                >
                  <BarChart3 className="w-4 h-4" />
                  View Stats
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;