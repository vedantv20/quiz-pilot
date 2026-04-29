import { useQuery } from '@tanstack/react-query'
import { useParams, Link } from 'react-router-dom'
import { 
  Users, 
  Target, 
  TrendingUp, 
  BarChart3, 
  ChevronLeft,
  Clock
} from 'lucide-react'
import { quizzesApi } from '../api/quizzes'
import { useAuthStore } from '../store/authStore'
import StatCard from '../components/StatCard'

const QuizStats = () => {
  const { id } = useParams()
  const { user } = useAuthStore()
  
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['quiz-stats', id],
    queryFn: () => quizzesApi.getQuizStats(id),
    retry: false
  })

  if (isLoading) {
    return (
      <div className="page-shell flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="page-shell flex justify-center items-center h-64 text-destructive">
        {error?.message || 'Failed to load quiz statistics'}
      </div>
    )
  }

  return (
    <div className="page-shell">
      <div className="page-container">
        <div className="mb-8">
          <Link 
            to={user?.role === 'admin' ? '/admin/quizzes' : '/teacher'}
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-4"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Quizzes
          </Link>
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-foreground">
              {stats.quiz?.title || 'Quiz Statistics'}
            </h1>
            <p className="text-muted-foreground">
              Detailed performance metrics for this quiz.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            title="Total Attempts"
            value={stats.summary?.totalAttempts || 0}
            icon={Users}
            description="Number of times taken"
          />
          <StatCard
            title="Average Score"
            value={`${Math.round(stats.summary?.avgScore || 0)}%`}
            icon={Target}
            description="Across all attempts"
            trend={stats.summary?.avgScore > 75 ? 'positive' : 'neutral'}
          />
          <StatCard
            title="Highest Score"
            value={`${Math.round(stats.summary?.highestScore || 0)}%`}
            icon={TrendingUp}
            description="Best performance"
          />
          <StatCard
            title="Lowest Score"
            value={`${Math.round(stats.summary?.lowestScore || 0)}%`}
            icon={BarChart3}
            description="Needs improvement"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Per Question Breakdown */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="mb-6 text-lg font-semibold text-foreground flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Question Breakdown
            </h2>
            <div className="space-y-4">
              {stats.questionAccuracy?.map((q, index) => (
                <div key={q.questionId} className="border-b border-border/50 pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-sm">Q{index + 1}. {q.questionText}</span>
                    <span className="text-sm font-bold text-primary">{Math.round(q.accuracy || 0)}%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        q.accuracy > 75 ? 'bg-green-500' : 
                        q.accuracy > 50 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${q.accuracy || 0}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                    <span>{q.correctCount} correct</span>
                    <span>{q.totalAttempts} attempts</span>
                  </div>
                </div>
              ))}
              
              {(!stats.questionAccuracy || stats.questionAccuracy.length === 0) && (
                <div className="text-center py-8 text-muted-foreground">
                  No question data available.
                </div>
              )}
            </div>
          </div>

          {/* Recent Attempts */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="mb-6 text-lg font-semibold text-foreground flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Recent Attempts
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-muted-foreground">
                <thead className="border-b border-border text-xs uppercase">
                  <tr>
                    <th className="py-3 font-medium">Student</th>
                    <th className="py-3 font-medium">Score</th>
                    <th className="py-3 font-medium text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {stats.recentAttempts?.map((attempt) => (
                    <tr key={attempt._id}>
                      <td className="py-3 font-medium text-foreground">
                        {attempt.student?.name || 'Unknown Student'}
                      </td>
                      <td className="py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          attempt.percentage >= 80 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                          attempt.percentage >= 60 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                          'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {Math.round(attempt.percentage)}%
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        {new Date(attempt.completedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {(!stats.recentAttempts || stats.recentAttempts.length === 0) && (
                    <tr>
                      <td colSpan="3" className="py-8 text-center">
                        No attempts yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuizStats