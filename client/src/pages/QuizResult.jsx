import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom'
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
  const [searchParams] = useSearchParams()
  const attemptId = searchParams.get('attempt')
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [showReview, setShowReview] = useState(false)

  // Fetch quiz details
  const { data: quiz, isLoading: quizLoading } = useQuery({
    queryKey: ['quiz', id, 'result'],
    queryFn: () => quizAPI.getById(id).then(res => res.data.data),
    enabled: !!id,
  })

  // Fetch attempt details
  const { data: attempt, isLoading: attemptLoading } = useQuery({
    queryKey: ['attempt', attemptId],
    queryFn: async () => {
      const attempts = await attemptAPI.getMy().then(res => res.data.data)
      return attempts.find(a => a._id === attemptId)
    },
    enabled: !!attemptId,
  })

  // Fetch subjects
  const { data: subjects = [] } = useQuery({
    queryKey: ['subjects'],
    queryFn: () => subjectAPI.getAll().then(res => res.data.data),
  })

  // Fetch user's other attempts on this quiz
  const { data: allAttempts = [] } = useQuery({
    queryKey: ['attempts', 'quiz', id, 'all'],
    queryFn: async () => {
      const attempts = await attemptAPI.getMy().then(res => res.data.data)
      return attempts
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
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!quiz || !attempt) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Results Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The quiz results you're looking for don't exist or have been removed.
          </p>
          <button onClick={() => navigate('/dashboard')} className="btn-primary">
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => navigate(`/quiz/${id}`)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          {subject && (
            <Link 
              to={`/subjects/${subject._id}`}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              <span className="text-2xl">{subject.icon}</span>
              <span className="font-medium">{subject.name}</span>
            </Link>
          )}
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Quiz Results
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {quiz.title}
          </p>
        </div>
      </div>

      {/* Results Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Score Display */}
        <div className="lg:col-span-1">
          <div className="card text-center">
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
              <div className="text-gray-600 dark:text-gray-400">
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
          <div className="card mt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Performance Insights
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-gray-600 dark:text-gray-400">Time per question:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {Math.round(stats.timeTaken / stats.totalQuestions)}s average
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-gray-600 dark:text-gray-400">Completion rate:</span>
                <span className="font-medium text-gray-900 dark:text-white">
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
          onClick={() => setShowReview(!showReview)}
          className="btn-secondary flex items-center space-x-2"
        >
          <BookOpen className="w-4 h-4" />
          <span>{showReview ? 'Hide' : 'Review'} Answers</span>
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
          <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Answer Review
            </h2>

            {/* Question Navigation */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center space-x-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <button
                  onClick={goToPreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Question</span>
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
                  <span className="text-sm text-gray-600 dark:text-gray-400">
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
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4 text-center">
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
                        ? 'bg-primary-600 text-white ring-2 ring-primary-600' 
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
                  <span className="text-gray-600 dark:text-gray-400">Correct</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-100 dark:bg-red-900 rounded"></div>
                  <span className="text-gray-600 dark:text-gray-400">Incorrect</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-yellow-100 dark:bg-yellow-900 rounded"></div>
                  <span className="text-gray-600 dark:text-gray-400">Skipped</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="card mt-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          What's Next?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to={`/quiz/${id}`}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all group"
          >
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🔄</div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
                  Retake Quiz
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Practice makes perfect
                </p>
              </div>
            </div>
          </Link>
          
          {subject && (
            <Link
              to={`/subjects/${subject._id}`}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all group"
            >
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{subject.icon}</div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
                    More {subject.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Try other quizzes
                  </p>
                </div>
              </div>
            </Link>
          )}
          
          <Link
            to="/leaderboard"
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all group"
          >
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🏆</div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
                  View Leaderboard
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  See your ranking
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
