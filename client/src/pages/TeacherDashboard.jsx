import { useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  Plus,
  BookOpen,
  Users,
  TrendingUp,
  Clock,
  BarChart3,
  Edit,
  Eye,
  Globe,
  Lock,
  AlertTriangle,
  ChevronRight,
  Trash2,
} from 'lucide-react'
import { quizzesApi } from '../api/quizzes'
import { attemptsApi } from '../api/attempts'
import { useAuthStore } from '../store/authStore'
import StatCard from '../components/StatCard'
import BadgeChip from '../components/BadgeChip'

const formatDate = (value) => {
  if (!value) return 'N/A'
  return new Date(value).toLocaleDateString()
}

const TeacherDashboard = () => {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()
  const teacherId = user?._id || user?.id

  const { data: quizzes = [], isLoading: quizzesLoading } = useQuery({
    queryKey: ['teacher-quizzes', teacherId],
    queryFn: () => quizzesApi.getByTeacher(teacherId),
    enabled: Boolean(teacherId),
  })

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['teacher-stats', teacherId],
    queryFn: () => attemptsApi.getTeacherStats(teacherId, 'all'),
    enabled: Boolean(teacherId),
  })

  const togglePublishMutation = useMutation({
    mutationFn: (quizId) => quizzesApi.togglePublish(quizId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-quizzes', teacherId] })
      queryClient.invalidateQueries({ queryKey: ['teacher-stats', teacherId] })
    },
  })

  const deleteQuizMutation = useMutation({
    mutationFn: (quizId) => quizzesApi.delete(quizId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-quizzes', teacherId] })
      queryClient.invalidateQueries({ queryKey: ['teacher-stats', teacherId] })
    },
  })

  const handleDeleteQuiz = (quizId, quizTitle) => {
    if (window.confirm(`Are you sure you want to delete the quiz "${quizTitle}"? This will permanently delete the quiz, all its questions, and student attempts. This action cannot be undone.`)) {
      deleteQuizMutation.mutate(quizId)
    }
  }

  const dashboardStats = useMemo(() => {
    const totalQuizzes = quizzes.length
    const publishedQuizzes = quizzes.filter((quiz) => quiz.isPublished).length
    const draftQuizzes = totalQuizzes - publishedQuizzes
    const totalQuestions = quizzes.reduce((sum, quiz) => sum + (quiz.totalQuestions || 0), 0)
    const quizzesWithNoQuestions = quizzes.filter((quiz) => (quiz.totalQuestions || 0) === 0)
    const staleDrafts = quizzes.filter((quiz) => !quiz.isPublished && (quiz.totalQuestions || 0) > 0)

    return {
      totalQuizzes,
      publishedQuizzes,
      draftQuizzes,
      totalQuestions,
      quizzesWithNoQuestions,
      staleDrafts,
    }
  }, [quizzes])

  const sortedQuizzes = useMemo(() => {
    return [...quizzes].sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    )
  }, [quizzes])

  return (
    <div className="page-shell">
      <div className="page-container space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Teaching Workspace</h1>
            <p className="mt-2 text-muted-foreground">
              Create, review, publish, and monitor your quizzes in one place.
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/teacher/quiz/new" className="btn-primary">
              <Plus className="w-4 h-4" />
              New Quiz
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={BookOpen}
            title="Total Quizzes"
            value={dashboardStats.totalQuizzes}
            subtitle={`${dashboardStats.publishedQuizzes} published`}
            color="info"
          />
          <StatCard
            icon={Users}
            title="Student Attempts"
            value={stats?.totalAttempts || 0}
            subtitle="Across your quizzes"
            color="success"
          />
          <StatCard
            icon={TrendingUp}
            title="Average Score"
            value={`${(stats?.averageScore || 0).toFixed(1)}%`}
            subtitle="Learner performance"
            color="primary"
          />
          <StatCard
            icon={Clock}
            title="Question Bank"
            value={dashboardStats.totalQuestions}
            subtitle={`${dashboardStats.draftQuizzes} draft quizzes`}
            color="warning"
          />
        </div>

        {(dashboardStats.quizzesWithNoQuestions.length > 0 || dashboardStats.staleDrafts.length > 0) && (
          <div className="rounded-xl border border-amber-300/50 bg-amber-50 p-5 dark:border-amber-700 dark:bg-amber-900/20">
            <div className="mb-3 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <h2 className="text-lg font-semibold text-foreground">Needs Attention</h2>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              {dashboardStats.quizzesWithNoQuestions.length > 0 && (
                <p>
                  {dashboardStats.quizzesWithNoQuestions.length} quiz(es) have no questions yet and cannot be published.
                </p>
              )}
              {dashboardStats.staleDrafts.length > 0 && (
                <p>
                  {dashboardStats.staleDrafts.length} draft quiz(es) are ready to review and publish.
                </p>
              )}
            </div>
          </div>
        )}

        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border p-6">
            <h2 className="text-xl font-semibold text-foreground">Quiz Manager</h2>
            <Link to="/teacher/quiz/new" className="text-sm font-medium text-primary hover:text-primary/80">
              Create another
            </Link>
          </div>

          {quizzesLoading ? (
            <div className="space-y-3 p-6">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="h-16 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          ) : sortedQuizzes.length === 0 ? (
            <div className="p-12 text-center">
              <BookOpen className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
              <p className="mb-4 text-muted-foreground">You have not created any quizzes yet.</p>
              <Link to="/teacher/quiz/new" className="btn-primary">
                <Plus className="w-4 h-4" />
                Create first quiz
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px]">
                <thead className="bg-muted/40">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Quiz</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Questions</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Attempts</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Created</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedQuizzes.map((quiz) => {
                    const hasQuestions = (quiz.totalQuestions || 0) > 0
                    const isPublishing =
                      togglePublishMutation.isPending && togglePublishMutation.variables === quiz._id

                    return (
                      <tr key={quiz._id} className="border-t border-border">
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-foreground">{quiz.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {quiz.subject?.name || 'Unknown subject'} • {Math.floor((quiz.timeLimit || 0) / 60)} min
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {quiz.isPublished ? (
                            <BadgeChip variant="success">Published</BadgeChip>
                          ) : (
                            <BadgeChip variant="warning">Draft</BadgeChip>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-foreground">{quiz.totalQuestions || 0}</td>
                        <td className="px-6 py-4 text-sm text-foreground">{quiz.attemptCount || 0}</td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{formatDate(quiz.createdAt)}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/teacher/quiz/${quiz._id}/edit`}
                              className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                            >
                              <Edit className="h-3.5 w-3.5" />
                              Edit
                            </Link>
                            <Link
                              to={`/teacher/quiz/${quiz._id}/question/new`}
                              className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                            >
                              <Plus className="h-3.5 w-3.5" />
                              Question
                            </Link>
                            <button
                              type="button"
                              disabled={isPublishing || !hasQuestions}
                              onClick={() => togglePublishMutation.mutate(quiz._id)}
                              className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
                              title={!hasQuestions ? 'Add at least one question to publish' : ''}
                            >
                              {quiz.isPublished ? <Lock className="h-3.5 w-3.5" /> : <Globe className="h-3.5 w-3.5" />}
                              {quiz.isPublished ? 'Unpublish' : 'Publish'}
                            </button>
                            <Link
                              to={`/teacher/quiz/${quiz._id}/stats`}
                              className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                            >
                              <BarChart3 className="h-3.5 w-3.5" />
                              Stats
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleDeleteQuiz(quiz._id, quiz.title)}
                              disabled={deleteQuizMutation.isPending && deleteQuizMutation.variables === quiz._id}
                              className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 text-red-600 px-3 py-1.5 text-xs font-medium hover:bg-red-100 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 disabled:cursor-not-allowed disabled:opacity-60"
                              title="Delete quiz"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Recent Learner Activity</h3>
            {statsLoading ? (
              <div className="space-y-2">
                {[...Array(4)].map((_, idx) => (
                  <div key={idx} className="h-5 animate-pulse rounded bg-muted" />
                ))}
              </div>
            ) : stats?.recentAttempts?.length ? (
              <div className="space-y-3">
                {stats.recentAttempts.slice(0, 6).map((attempt, idx) => (
                  <div key={`${attempt.quizTitle}-${idx}`} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {attempt.studentName} on {attempt.quizTitle}
                    </span>
                    <BadgeChip variant={attempt.percentage >= 70 ? 'success' : 'warning'}>
                      {attempt.percentage}%
                    </BadgeChip>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No learner attempts yet.</p>
            )}
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Teaching Shortcuts</h3>
            <div className="space-y-3">
              <Link
                to="/teacher/quiz/new"
                className="flex items-center justify-between rounded-lg border border-border px-4 py-3 text-sm text-foreground hover:bg-muted"
              >
                <span className="inline-flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Build a new quiz
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
              <Link
                to="/leaderboard"
                className="flex items-center justify-between rounded-lg border border-border px-4 py-3 text-sm text-foreground hover:bg-muted"
              >
                <span className="inline-flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  View public leaderboard
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeacherDashboard
