import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Flag, 
  CheckCircle,
  AlertTriangle,
  Clock,
  Eye
} from 'lucide-react'
import { quizAPI, attemptAPI, bookmarkAPI } from '../api'
import { Timer } from '../components/Timer'
import { QuestionCard } from '../components/QuestionCard'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

export const QuizAttempt = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useAuthStore()
  
  const mode = searchParams.get('mode') || 'practice'
  const isTimedMode = mode === 'timed' || mode === 'mock'
  const isMockMode = mode === 'mock'

  // Quiz state
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({}) // questionIndex -> answerIndex
  const [startTime, setStartTime] = useState(null)
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState(new Set())
  const toArray = (value) => (Array.isArray(value) ? value : [])
  const withId = (item) => ({ ...item, _id: item?._id || item?.id })

  // Fetch quiz and questions
  const { data: quiz, isLoading: quizLoading } = useQuery({
    queryKey: ['quiz', id, 'attempt'],
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

  // Fetch user's bookmarks
  const { data: userBookmarks = [] } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: () =>
      bookmarkAPI.getAll().then((res) => {
        const payload = res?.data?.data
        return toArray(payload?.bookmarks).map((bookmark) => ({
          ...withId(bookmark),
          question: withId(bookmark.question),
        }))
      }),
  })

  // Submit attempt mutation
  const submitAttempt = useMutation({
    mutationFn: (attemptData) => attemptAPI.submit(attemptData),
    onSuccess: (response) => {
      const attempt = response?.data?.data
      if (!attempt) {
        toast.error('Quiz submitted but response was invalid')
        navigate('/dashboard')
        return
      }
      toast.success(`Quiz completed! Score: ${attempt.percentage}%`)
      navigate(`/quiz/${id}/result?attempt=${attempt._id || attempt.id}`, {
        state: { attempt },
        replace: true,
      })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to submit quiz')
    }
  })

  // Bookmark mutation
  const toggleBookmark = useMutation({
    mutationFn: async (questionId) => {
      if (bookmarkedQuestions.has(questionId)) {
        await bookmarkAPI.remove(questionId)
        return { action: 'remove', questionId }
      } else {
        await bookmarkAPI.add(questionId)
        return { action: 'add', questionId }
      }
    },
    onSuccess: ({ action, questionId }) => {
      setBookmarkedQuestions(prev => {
        const next = new Set(prev)
        if (action === 'add') {
          next.add(questionId)
          toast.success('Question bookmarked')
        } else {
          next.delete(questionId)
          toast.success('Bookmark removed')
        }
        return next
      })
    }
  })

  // Initialize bookmarks and start time
  useEffect(() => {
    if (userBookmarks.length > 0 && quiz?.questions) {
      const bookmarkedIds = new Set(
        userBookmarks
          .filter(b => quiz.questions.some(q => q._id === b.question._id))
          .map(b => b.question._id)
      )
      setBookmarkedQuestions(bookmarkedIds)
    }
  }, [userBookmarks, quiz])

  useEffect(() => {
    if (quiz && !startTime) {
      setStartTime(Date.now())
    }
  }, [quiz, startTime])

  // Handle timer completion
  const handleTimeUp = useCallback(() => {
    if (isMockMode || isTimedMode) {
      handleSubmitQuiz()
    }
  }, [isMockMode, isTimedMode])

  // Answer selection
  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }))
  }

  // Navigation
  const goToQuestion = (index) => {
    setCurrentQuestion(Math.max(0, Math.min(index, (quiz?.questions?.length || 1) - 1)))
  }

  const goToPrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const goToNext = () => {
    if (quiz?.questions && currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  // Submit quiz
  const handleSubmitQuiz = () => {
    if (!quiz || !startTime) return

    const timeTaken = Math.floor((Date.now() - startTime) / 1000)
    const submissionAnswers = Array.from({ length: quiz.questions.length }, (_, i) => 
      answers[i] !== undefined ? answers[i] : -1
    )

    submitAttempt.mutate({
      quizId: id,
      answers: submissionAnswers,
      timeTaken
    })
  }

  // Exit confirmation
  const handleExit = () => {
    if (Object.keys(answers).length > 0) {
      const confirmed = window.confirm(
        'Are you sure you want to exit? Your progress will be lost.'
      )
      if (!confirmed) return
    }
    navigate(`/quiz/${id}`)
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goToPrevious()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        goToNext()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        handleExit()
      } else if (e.key >= '1' && e.key <= '4') {
        e.preventDefault()
        const answerIndex = parseInt(e.key) - 1
        handleAnswerSelect(currentQuestion, answerIndex)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentQuestion, quiz])

  // Prevent page refresh/close
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (Object.keys(answers).length > 0) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [answers])

  if (quizLoading) {
    return (
      <div className="page-shell flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading quiz...</p>
        </div>
      </div>
    )
  }

  if (!quiz || !quiz.questions?.length) {
    return (
      <div className="page-shell flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Quiz Not Available
          </h2>
          <p className="text-muted-foreground mb-6">
            This quiz is not available or has no questions.
          </p>
          <button onClick={() => navigate(`/quiz/${id}`)} className="btn-primary">
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const currentQuestionData = quiz.questions[currentQuestion]
  const answeredCount = Object.keys(answers).length
  const progress = (answeredCount / quiz.questions.length) * 100

  return (
    <div className="page-shell flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left: Quiz Info */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleExit}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              title="Exit Quiz"
            >
               <X className="w-5 h-5 text-muted-foreground" />
            </button>
            <div>
              <h1 className="font-semibold text-foreground">
                {quiz.title}
              </h1>
              <p className="text-sm text-muted-foreground">
                {mode === 'mock' ? 'Mock Exam' : 
                 mode === 'timed' ? 'Timed Quiz' : 'Practice Mode'}
              </p>
            </div>
          </div>

          {/* Center: Progress */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </div>
            <div className="w-32 bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              {answeredCount} answered
            </div>
          </div>

          {/* Right: Timer & Submit */}
          <div className="flex items-center space-x-4">
            {isTimedMode && (
              <Timer
                initialTime={quiz.timeLimit}
                onTimeUp={handleTimeUp}
                isRunning={true}
                warningTime={quiz.timeLimit * 0.1} // Warning at 10% remaining
              />
            )}
            <button
              onClick={() => setShowSubmitDialog(true)}
              disabled={submitAttempt.isPending}
              className="btn-primary flex items-center space-x-2"
            >
              <Flag className="w-4 h-4" />
              <span>Submit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Question Navigation Sidebar */}
        <div className="w-64 bg-card border-r border-border p-4 overflow-y-auto">
          <h3 className="font-semibold text-foreground mb-4">
            Questions
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {quiz.questions.map((_, index) => {
              const isAnswered = answers[index] !== undefined
              const isCurrent = index === currentQuestion
              const isBookmarked = bookmarkedQuestions.has(quiz.questions[index]._id)
              
              return (
                <button
                  key={index}
                  onClick={() => goToQuestion(index)}
                  className={`
                    relative w-12 h-12 rounded-lg text-sm font-medium transition-all
                    ${isCurrent 
                      ? 'bg-primary text-primary-foreground ring-2 ring-primary' 
                      : isAnswered 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }
                  `}
                >
                  {index + 1}
                  {isBookmarked && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"></div>
                  )}
                </button>
              )
            })}
          </div>
          
          {/* Legend */}
          <div className="mt-6 space-y-2 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-100 dark:bg-green-900 rounded"></div>
               <span className="text-muted-foreground">Answered</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-muted rounded"></div>
              <span className="text-muted-foreground">Not answered</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-primary rounded"></div>
              <span className="text-muted-foreground">Current</span>
            </div>
          </div>
        </div>

        {/* Question Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <QuestionCard
              question={currentQuestionData}
              questionNumber={currentQuestion + 1}
              totalQuestions={quiz.questions.length}
              selectedAnswer={answers[currentQuestion]}
              onAnswerSelect={(answerIndex) => handleAnswerSelect(currentQuestion, answerIndex)}
              showCorrectAnswer={false}
              showExplanation={false}
              isBookmarked={bookmarkedQuestions.has(currentQuestionData._id)}
              onBookmarkToggle={(questionId) => toggleBookmark.mutate(questionId)}
              className="mb-8"
            />

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between">
              <button
                onClick={goToPrevious}
                disabled={currentQuestion === 0}
                className="btn-secondary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  Use arrow keys to navigate
                </span>
                <span className="text-sm text-muted-foreground">
                  Press 1-4 to select answers
                </span>
              </div>

              {currentQuestion < quiz.questions.length - 1 ? (
                <button
                  onClick={goToNext}
                  className="btn-primary flex items-center space-x-2"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setShowSubmitDialog(true)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Flag className="w-4 h-4" />
                  <span>Submit Quiz</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      {showSubmitDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-card text-card-foreground rounded-lg max-w-md w-full p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Submit Quiz?
            </h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Questions answered:</span>
                <span className="font-medium text-foreground">
                  {answeredCount} of {quiz.questions.length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Unanswered questions:</span>
                <span className="font-medium text-foreground">
                  {quiz.questions.length - answeredCount}
                </span>
              </div>
              {quiz.questions.length - answeredCount > 0 && (
                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                  Unanswered questions will be marked as incorrect.
                </p>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowSubmitDialog(false)}
                className="btn-secondary flex-1"
              >
                Continue Quiz
              </button>
              <button
                onClick={() => {
                  setShowSubmitDialog(false)
                  handleSubmitQuiz()
                }}
                disabled={submitAttempt.isPending}
                className="btn-primary flex-1 flex items-center justify-center space-x-2"
              >
                {submitAttempt.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Submit</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}



