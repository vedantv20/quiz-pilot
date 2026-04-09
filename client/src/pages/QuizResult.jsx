import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams, Link, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { 
  ArrowLeft, 
  RotateCcw, 
  Share2, 
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Target,
  Trophy,
  TrendingUp,
  BookOpen,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { quizAPI, attemptAPI, subjectAPI } from '../api'
import { ScoreRing } from '../components/ScoreRing'
import { BadgeChip } from '../components/BadgeChip'
import { QuestionCard } from '../components/QuestionCard'
import { StatCard } from '../components/StatCard'
import toast from 'react-hot-toast'

export const QuizResult = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const attemptId = searchParams.get('attempt') || location.state?.attempt?._id || location.state?.attempt?.id
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [showReview, setShowReview] = useState(true)
  const toArray = (value) => (Array.isArray(value) ? value : [])
  const withId = (item) => ({ ...item, _id: item?._id || item?.id })

  // Fetch quiz details
  const { data: quiz, isLoading: quizLoading } = useQuery({
    queryKey: ['quiz', id, 'result'],
    queryFn: () =>
      quizAPI.getById(id).then((res) => {
        const data = res?.data?.data
        if (!data) return null
        return {
          ...withId(data),
          questions: toArray(data.questions).map((q) => withId(q)),
        }
      }),
    enabled: !!id,
  })

  // Fetch attempt details
  const { data: attempt, isLoading: attemptLoading } = useQuery({
    queryKey: ['attempt', attemptId],
    queryFn: async () => {
      if (location.state?.attempt) return withId(location.state.attempt)
      const attemptsPayload = await attemptAPI.getMy().then((res) => res?.data?.data)
      const attempts = toArray(attemptsPayload?.attempts).map(withId)
      return attempts.find((a) => String(a._id) === String(attemptId))
    },
    enabled: !!attemptId,
  })

  // Fetch subjects
  const { data: subjects = [] } = useQuery({
    queryKey: ['subjects'],
    queryFn: () => subjectAPI.getAll().then((res) => toArray(res?.data?.data).map(withId)),
  })

  // Fetch user's other attempts on this quiz
  const { data: allAttempts = [] } = useQuery({
    queryKey: ['attempts', 'quiz', id, 'all'],
    queryFn: async () => {
      const attemptsPayload = await attemptAPI.getMy().then((res) => res?.data?.data)
      return toArray(attemptsPayload?.attempts)
        .map(withId)
        .filter(a => (a.quiz?._id || a.quiz) === id)
        .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
    },
    enabled: !!id,
  })

  const subject = subjects.find(s => s._id === (quiz?.subject?._id || quiz?.subject))

  // Calculate detailed results
  const detailedResults = quiz?.questions?.map((question, index) => {
    const userAnswer = attempt?.answers?.[index]
    const isCorrect = userAnswer === question.correctIndex
    const isAnswered = userAnswer !== -1 && userAnswer !== undefined

    return {
      question,
      questionIndex: index,
      userAnswer,
      correctAnswer: question.correctIndex,
      isCorrect,
      isAnswered,
      isSkipped: !isAnswered
    }
  }) || []

  const stats = {
    totalQuestions: quiz?.totalQuestions || 0,
    correctAnswers: attempt?.score || 0,
    incorrectAnswers: (attempt?.score !== undefined && quiz?.totalQuestions) ? 
      quiz.totalQuestions - attempt.score : 0,
    skippedQuestions: detailedResults.filter(r => r.isSkipped).length,
    timeTaken: attempt?.timeTaken || 0,
    percentage: attempt?.percentage || 0,
    passingScore: 60 // Default passing score
  }

  const isPassed = stats.percentage >= stats.passingScore
  
  // Get performance comparison
  const previousAttempts = allAttempts.filter(a => a._id !== attemptId)
  const bestScore = previousAttempts.length ? 
    Math.max(...previousAttempts.map(a => a.percentage)) : null
  const improvement = bestScore !== null ? 
    stats.percentage - bestScore : null
  const rank = allAttempts.findIndex((a) => String(a._id) === String(attemptId)) + 1

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600 dark:text-green-400'
    if (percentage >= 60) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const handleRetakeQuiz = () => {
    navigate(`/quiz/${id}`)
  }

  const handleShareResults = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Quiz Results - ${quiz?.title}`,
          text: `I scored ${stats.percentage}% on "${quiz?.title}" quiz!`,
          url: window.location.href
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        toast.success('Link copied to clipboard!')
      }
    } catch (error) {
      toast.error('Failed to share results')
    }
  }

  const goToQuestion = (index) => {
    setCurrentQuestionIndex(Math.max(0, Math.min(index, detailedResults.length - 1)))
  }

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const goToNextQuestion = () => {
    if (currentQuestionIndex < detailedResults.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  if (quizLoading || attemptLoading) {
    return (
      <div className="page-shell">
        <div className="page-container">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-64 bg-muted rounded-lg"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!quiz || !attempt) {
    return (
      <div className="page-shell">
        <div className="page-container">
          <div className="text-center py-12">
            <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Results Not Found
            </h2>
            <p className="text-muted-foreground mb-6">
              The quiz results you're looking for don't exist or have been removed.
            </p>
            <button onClick={() => navigate('/dashboard')} className="btn-primary">
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-shell">
      <div className="page-container">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => navigate(`/quiz/${id}`)}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          {subject && (
            <Link 
              to={`/subjects/${subject._id}`}
              className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <span className="text-2xl">{subject.icon}</span>
              <span className="font-medium">{subject.name}</span>
            </Link>
          )}
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Quiz Results</h1>
          <p className="text-lg text-muted-foreground">{quiz.title}</p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <BadgeChip>{stats.percentage}% score</BadgeChip>
            <BadgeChip>{rank > 0 ? `Rank #${rank}` : 'Rank pending'}</BadgeChip>
          </div>
        </div>
      </div>

      {/* Results Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Score Display */}
        <div className="lg:col-span-1">
          <div className="surface-card text-center">
            <div className="mb-6">
              <ScoreRing 
                score={stats.percentage} 
                size={180} 
                strokeWidth={12}
                className="mx-auto"
              />
            </div>
            <div className="space-y-2">
              <div className={`text-2xl font-bold ${getScoreColor(stats.percentage)}`}>
                {isPassed ? 'Passed!' : 'Try Again'}
              </div>
              <div className="text-muted-foreground">
                {stats.correctAnswers} out of {stats.totalQuestions} correct
              </div>
              {improvement !== null && (
                <div className={`text-sm ${improvement >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {improvement > 0 ? '+' : ''}{improvement.toFixed(1)}% from best score
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              title="Correct"
              value={stats.correctAnswers}
              icon={CheckCircle}
              color="success"
              subtitle={`${((stats.correctAnswers / stats.totalQuestions) * 100).toFixed(1)}%`}
            />
            <StatCard
              title="Incorrect"
              value={stats.incorrectAnswers}
              icon={XCircle}
              color="danger"
              subtitle={`${((stats.incorrectAnswers / stats.totalQuestions) * 100).toFixed(1)}%`}
            />
            <StatCard
              title="Time Taken"
              value={formatTime(stats.timeTaken)}
              icon={Clock}
              color="info"
              subtitle={`${Math.round(stats.timeTaken / stats.totalQuestions)}s avg`}
            />
            <StatCard
              title="Accuracy"
              value={`${stats.percentage}%`}
              icon={Target}
              color="primary"
              subtitle={isPassed ? "Passed" : "Failed"}
            />
          </div>

          {/* Performance Insights */}
          <div className="surface-card mt-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Performance Insights
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-muted-foreground">Time per question:</span>
                <span className="font-medium text-foreground">
                  {Math.round(stats.timeTaken / stats.totalQuestions)}s average
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-muted-foreground">Completion rate:</span>
                <span className="font-medium text-foreground">
                  {((stats.totalQuestions - stats.skippedQuestions) / stats.totalQuestions * 100).toFixed(1)}%
                </span>
              </div>
              {stats.skippedQuestions > 0 && (
                <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <span className="text-yellow-700 dark:text-yellow-300">Questions skipped:</span>
                  <span className="font-medium text-yellow-900 dark:text-yellow-100">
                    {stats.skippedQuestions}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
        <button
          onClick={handleRetakeQuiz}
          className="btn-primary flex items-center space-x-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Retake Quiz</span>
        </button>
        <button
          onClick={() => setShowReview(true)}
          className="btn-secondary flex items-center space-x-2"
        >
          <BookOpen className="w-4 h-4" />
          <span>Review Answers</span>
        </button>
        <button
          onClick={handleShareResults}
          className="btn-secondary flex items-center space-x-2"
        >
          <Share2 className="w-4 h-4" />
          <span>Share Results</span>
        </button>
      </div>

      {/* Question Review */}
      {showReview && detailedResults.length > 0 && (
        <div className="space-y-8">
          <div className="border-t border-border pt-8">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
              Answer Review
            </h2>

            {/* Question Navigation */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center space-x-4 bg-card rounded-lg p-4 shadow-sm border border-border">
                <button
                  onClick={goToPreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Question</span>
                  <select
                    value={currentQuestionIndex}
                    onChange={(e) => goToQuestion(parseInt(e.target.value))}
                    className="input-field py-1 px-2 text-sm min-w-0"
                  >
                    {detailedResults.map((_, index) => (
                      <option key={index} value={index}>
                        {index + 1}
                      </option>
                    ))}
                  </select>
                  <span className="text-sm text-muted-foreground">
                    of {detailedResults.length}
                  </span>
                </div>

                <button
                  onClick={goToNextQuestion}
                  disabled={currentQuestionIndex === detailedResults.length - 1}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Current Question */}
            {detailedResults[currentQuestionIndex] && (
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-center mb-4">
                  <BadgeChip 
                    variant={detailedResults[currentQuestionIndex].isCorrect ? 'success' : 
                            detailedResults[currentQuestionIndex].isSkipped ? 'warning' : 'danger'}
                  >
                    {detailedResults[currentQuestionIndex].isCorrect ? 'Correct' :
                     detailedResults[currentQuestionIndex].isSkipped ? 'Skipped' : 'Incorrect'}
                  </BadgeChip>
                </div>
                
                <QuestionCard
                  question={detailedResults[currentQuestionIndex].question}
                  questionNumber={currentQuestionIndex + 1}
                  totalQuestions={detailedResults.length}
                  selectedAnswer={detailedResults[currentQuestionIndex].userAnswer}
                  showCorrectAnswer={true}
                  showExplanation={true}
                />
              </div>
            )}

            {/* Quick Navigation Grid */}
            <div className="mt-8">
              <h4 className="text-lg font-medium text-foreground mb-4 text-center">
                Quick Navigation
              </h4>
              <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
                {detailedResults.map((result, index) => (
                  <button
                    key={index}
                    onClick={() => goToQuestion(index)}
                    className={`
                      w-12 h-12 rounded-lg text-sm font-medium transition-all
                      ${index === currentQuestionIndex 
                        ? 'bg-primary text-primary-foreground ring-2 ring-primary' 
                        : result.isCorrect 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800' 
                          : result.isSkipped
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-800'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800'
                      }
                    `}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <div className="flex justify-center mt-4 space-x-6 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-100 dark:bg-green-900 rounded"></div>
                  <span className="text-muted-foreground">Correct</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-100 dark:bg-red-900 rounded"></div>
                  <span className="text-muted-foreground">Incorrect</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-yellow-100 dark:bg-yellow-900 rounded"></div>
                  <span className="text-muted-foreground">Skipped</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="surface-card mt-8">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          What's Next?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to={`/quiz/${id}`}
            className="p-4 border border-border rounded-lg hover:shadow-md transition-all group"
          >
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🔄</div>
              <div>
                <h4 className="font-medium text-foreground group-hover:text-primary">
                  Retake Quiz
                </h4>
                <p className="text-sm text-muted-foreground">
                  Practice makes perfect
                </p>
              </div>
            </div>
          </Link>
          
          {subject && (
            <Link
              to={`/subjects/${subject._id}`}
              className="p-4 border border-border rounded-lg hover:shadow-md transition-all group"
            >
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{subject.icon}</div>
                <div>
                  <h4 className="font-medium text-foreground group-hover:text-primary">
                    More {subject.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Try other quizzes
                  </p>
                </div>
              </div>
            </Link>
          )}
          
          <Link
            to="/leaderboard"
            className="p-4 border border-border rounded-lg hover:shadow-md transition-all group"
          >
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🏆</div>
              <div>
                <h4 className="font-medium text-foreground group-hover:text-primary">
                  View Leaderboard
                </h4>
                <p className="text-sm text-muted-foreground">
                  See your ranking
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
      </div>
    </div>
  )
}



