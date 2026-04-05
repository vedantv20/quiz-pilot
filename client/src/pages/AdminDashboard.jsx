import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
  Users, 
  BookOpen, 
  ClipboardList, 
  TrendingUp, 
  Settings, 
  Shield,
  Activity,
  Calendar,
  Target,
  Award
} from 'lucide-react';
import { usersApi } from '../api/users';
import { quizzesApi } from '../api/quizzes';
import { attemptsApi } from '../api/attempts';
import { surveysApi } from '../api/surveys';
import StatCard from '../components/StatCard';

const AdminDashboard = () => {
  // Fetch dashboard stats
  const { data: userStats, isLoading: userStatsLoading } = useQuery({
    queryKey: ['admin-user-stats'],
    queryFn: usersApi.getStats
  });

  const { data: quizStats, isLoading: quizStatsLoading } = useQuery({
    queryKey: ['admin-quiz-stats'],
    queryFn: quizzesApi.getStats
  });

  const { data: attemptStats, isLoading: attemptStatsLoading } = useQuery({
    queryKey: ['admin-attempt-stats'],
    queryFn: attemptsApi.getStats
  });

  const { data: surveyStats, isLoading: surveyStatsLoading } = useQuery({
    queryKey: ['admin-survey-stats'],
    queryFn: surveysApi.getStats
  });

  // Fetch recent activity
  const { data: recentUsers = [] } = useQuery({
    queryKey: ['recent-users'],
    queryFn: () => usersApi.getRecent(5)
  });

  const { data: recentQuizzes = [] } = useQuery({
    queryKey: ['recent-quizzes'],
    queryFn: () => quizzesApi.getRecent(5)
  });

  const isLoading = userStatsLoading || quizStatsLoading || attemptStatsLoading || surveyStatsLoading;

  return (
    <div className="page-shell">
      <div className="page-container">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Shield className="w-8 h-8 text-primary" />
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage users, content, and monitor platform analytics
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-3">
            <Link
              to="/admin/users"
              className="btn-primary"
            >
              <Users className="w-4 h-4" />
              Manage Users
            </Link>
            <Link
              to="/admin/subjects"
              className="flex items-center gap-2 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted/80 transition-colors"
            >
              <Settings className="w-4 h-4" />
              Settings
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Users className="w-6 h-6 text-blue-600" />}
            title="Total Users"
            value={isLoading ? '...' : userStats?.total || 0}
            subtitle={`+${userStats?.newThisWeek || 0} this week`}
            className="bg-blue-50 dark:bg-blue-900/20"
          />
          <StatCard
            icon={<BookOpen className="w-6 h-6 text-green-600" />}
            title="Total Quizzes"
            value={isLoading ? '...' : quizStats?.total || 0}
            subtitle={`${quizStats?.published || 0} published`}
            className="bg-green-50 dark:bg-green-900/20"
          />
          <StatCard
            icon={<Activity className="w-6 h-6 text-primary" />}
            title="Quiz Attempts"
            value={isLoading ? '...' : attemptStats?.total || 0}
            subtitle={`+${attemptStats?.todayCount || 0} today`}
            className="bg-primary/10"
          />
          <StatCard
            icon={<ClipboardList className="w-6 h-6 text-orange-600" />}
            title="Survey Responses"
            value={isLoading ? '...' : surveyStats?.total || 0}
            subtitle={`${surveyStats?.completionRate || 0}% completion`}
            className="bg-orange-50 dark:bg-orange-900/20"
          />
        </div>

        {/* User Role Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-card rounded-xl shadow-sm border border-border p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">
                User Distribution
              </h2>
              
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <div className="w-24 h-4 bg-muted rounded animate-pulse" />
                      <div className="w-16 h-4 bg-muted rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                      <span className="font-medium text-foreground">Students</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-foreground">
                        {userStats?.byRole?.student || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {((userStats?.byRole?.student || 0) / (userStats?.total || 1) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                      <span className="font-medium text-foreground">Teachers</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-foreground">
                        {userStats?.byRole?.teacher || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {((userStats?.byRole?.teacher || 0) / (userStats?.total || 1) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-primary/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      <span className="font-medium text-foreground">Admins</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-foreground">
                        {userStats?.byRole?.admin || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {((userStats?.byRole?.admin || 0) / (userStats?.total || 1) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            <div className="bg-card rounded-xl shadow-sm border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Platform Health
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Active Users (7d)</span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    {userStats?.activeLastWeek || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Avg Quiz Score</span>
                  <span className="font-medium text-foreground">
                    {attemptStats?.averageScore || 0}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Quiz Completion Rate</span>
                  <span className="font-medium text-blue-600 dark:text-blue-400">
                    {attemptStats?.completionRate || 0}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Top Performer</span>
                  <span className="font-medium text-yellow-600 dark:text-yellow-400">
                    {attemptStats?.topPerformer?.name || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl shadow-sm border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link
                  to="/admin/users"
                  className="flex items-center gap-3 w-full px-3 py-2 text-left text-sm text-foreground hover:bg-muted/80 rounded-lg transition-colors"
                >
                  <Users className="w-4 h-4" />
                  Manage Users
                </Link>
                <Link
                  to="/admin/subjects"
                  className="flex items-center gap-3 w-full px-3 py-2 text-left text-sm text-foreground hover:bg-muted/80 rounded-lg transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  Manage Subjects
                </Link>
                <Link
                  to="/admin/surveys"
                  className="flex items-center gap-3 w-full px-3 py-2 text-left text-sm text-foreground hover:bg-muted/80 rounded-lg transition-colors"
                >
                  <ClipboardList className="w-4 h-4" />
                  Survey Analytics
                </Link>
                <Link
                  to="/leaderboard"
                  className="flex items-center gap-3 w-full px-3 py-2 text-left text-sm text-foreground hover:bg-muted/80 rounded-lg transition-colors"
                >
                  <TrendingUp className="w-4 h-4" />
                  View Leaderboard
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Users */}
          <div className="bg-card rounded-xl shadow-sm border border-border">
            <div className="p-6 border-b border-border">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-foreground">
                  Recent Users
                </h2>
                <Link
                  to="/admin/users"
                    className="text-primary hover:text-primary/80 text-sm font-medium"
                >
                  View all
                </Link>
              </div>
            </div>

            <div className="p-6">
              {recentUsers.length > 0 ? (
                <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <div key={user._id} className="flex items-center gap-4 p-3 hover:bg-muted/80 rounded-lg transition-colors">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-medium text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-foreground">
                          {user.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {user.email}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground capitalize">
                          {user.role}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-muted-foreground">No recent users</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Quizzes */}
          <div className="bg-card rounded-xl shadow-sm border border-border">
            <div className="p-6 border-b border-border">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-foreground">
                  Recent Quizzes
                </h2>
                <Link
                  to="/subjects"
                    className="text-primary hover:text-primary/80 text-sm font-medium"
                >
                  View all
                </Link>
              </div>
            </div>

            <div className="p-6">
              {recentQuizzes.length > 0 ? (
                <div className="space-y-4">
                  {recentQuizzes.map((quiz) => (
                    <div key={quiz._id} className="flex items-center gap-4 p-3 hover:bg-muted/80 rounded-lg transition-colors">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        quiz.isPublished 
                          ? 'bg-green-100 dark:bg-green-900/30' 
                          : 'bg-yellow-100 dark:bg-yellow-900/30'
                      }`}>
                        <BookOpen className={`w-5 h-5 ${
                          quiz.isPublished 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-yellow-600 dark:text-yellow-400'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-foreground">
                          {quiz.title}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {quiz.subject?.name} • {quiz.totalQuestions} questions
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xs font-medium ${
                          quiz.isPublished 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-yellow-600 dark:text-yellow-400'
                        }`}>
                          {quiz.isPublished ? 'Published' : 'Draft'}
                        </div>
                        <div className="text-xs text-gray-400">
                          by {quiz.createdBy?.name}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-muted-foreground">No recent quizzes</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;


