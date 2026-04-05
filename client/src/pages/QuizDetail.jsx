import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { 
  ArrowLeft, 
  Clock, 
  BookOpen, 
  Users, 
  Play,
  Target,
  Zap,
  Award,
  TrendingUp,
  AlertCircle
} from 'lucide-react'
import { quizAPI, attemptAPI, subjectAPI } from '../api'
import { BadgeChip } from '../components/BadgeChip'
import { StatCard } from '../components/StatCard'

export const QuizDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [selectedMode, setSelectedMode] = useState('practice')
  const toArray = (value) => (Array.isArray(value) ? value : [])
  const withId = (item) => ({ ...item, _id: item?._id || item?.id })

  // Fetch quiz details
  const { data: quiz, isLoading: quizLoading, error: quizError } = useQuery({
    queryKey: ['quiz', id],
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

  // Fetch subject details
  const { data: subjects = [] } = useQuery({
    queryKey: ['subjects'],
    queryFn: () => subjectAPI.getAll().then((res) => toArray(res?.data?.data).map(withId)),
  })

  // Fetch user's previous attempts on this quiz
  const { data: userAttempts = [] } = useQuery({
    queryKey: ['attempts', 'quiz', id],
    queryFn: async () => {
      const attempts = await attemptAPI.getMy().then((res) => res?.data?.data)
      return toArray(attempts?.attempts).map(withId).filter(attempt => 
        (attempt.quiz?._id || attempt.quiz) === id
      ).sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
    },
    enabled: !!id,
  })

  const subject = subjects.find(s => s._id === (quiz?.subject?._id || quiz?.subject))

  const handleStartQuiz = () => {
    const queryParams = new URLSearchParams()
    if (selectedMode === 'mock') queryParams.set('mode', 'mock')
    if (selectedMode === 'timed') queryParams.set('mode', 'timed')
    
    const url = `/quiz/${id}/attempt${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    navigate(url)
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`
    }
    return `${minutes}m`
  }

  const getBestScore = () => {
    if (!userAttempts.length) return null
    return Math.max(...userAttempts.map(a => a.percentage))
  }

  const getAverageScore = () => {
    if (!userAttempts.length) return null
    return Math.round(userAttempts.reduce((acc, a) => acc + a.percentage, 0) / userAttempts.length)
  }

  if (quizLoading) {
    return (
      <div className="page-shell">
        <div className="page-container">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-32 bg-muted rounded-lg"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (quizError || !quiz) {
    return (
      <div className="page-shell">
        <div className="page-container">
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Quiz Not Found
            </h2>
            <p className="text-muted-foreground mb-6">
              The quiz you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => navigate('/subjects')}
              className="btn-primary"
            >
              Browse All Quizzes
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
            onClick={() => navigate(-1)}
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

        <div className="surface-card">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <BadgeChip variant={quiz.difficulty}>
                  {quiz.difficulty}
                </BadgeChip>
                {quiz.isMock && (
                  <BadgeChip variant="info">
                    <Zap className="w-3 h-3 mr-1" />
                    Mock Exam
                  </BadgeChip>
                )}
                {quiz.isPublished ? (
                  <BadgeChip variant="success">
                    Published
                  </BadgeChip>
                ) : (
                  <BadgeChip variant="warning">
                    Draft
                  </BadgeChip>
                )}
              </div>

              <h1 className="text-3xl font-bold text-foreground mb-4">
                {quiz.title}
              </h1>

              {quiz.description && (
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  {quiz.description}
                </p>
              )}

              {quiz.tags && quiz.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {quiz.tags.map((tag, index) => (
                    <span
                      key={index}
                        className="px-3 py-1 bg-muted text-foreground rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Quiz Stats */}
            <div className="lg:min-w-[300px]">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg border border-border">
                  <BookOpen className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">
                    {quiz.totalQuestions}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Questions
                  </div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg border border-border">
                  <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">
                    {formatTime(quiz.timeLimit)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Time Limit
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Stats (if user has attempted) */}
      {userAttempts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Best Score"
            value={`${getBestScore()}%`}
            icon={Award}
            color="success"
          />
          <StatCard
            title="Average Score"
            value={`${getAverageScore()}%`}
            icon={TrendingUp}
            color="info"
          />
          <StatCard
            title="Attempts"
            value={userAttempts.length}
            icon={Users}
            color="primary"
            subtitle="Total attempts"
          />
        </div>
      )}

      {/* Mode Selection and Start */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Mode Selection */}
        <div className="surface-card">
          <h3 className="text-xl font-semibold text-foreground mb-6">
            Choose Your Mode
          </h3>
          
          <div className="space-y-4">
            {/* Practice Mode */}
            <label className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
              selectedMode === 'practice' 
                ? 'border-primary bg-primary/10 dark:bg-primary/20' 
                    : 'border-border hover:border-muted-foreground/30'
            }`}>
              <input
                type="radio"
                name="mode"
                value="practice"
                checked={selectedMode === 'practice'}
                onChange={(e) => setSelectedMode(e.target.value)}
                className="sr-only"
              />
              <div className="flex items-start space-x-3">
                <div className="text-2xl">🎯</div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">
                    Practice Mode
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Take your time, see explanations immediately, and learn as you go. 
                    No time pressure.
                  </p>
                </div>
              </div>
            </label>

            {/* Timed Mode */}
            <label className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
              selectedMode === 'timed' 
                ? 'border-primary bg-primary/10 dark:bg-primary/20' 
                    : 'border-border hover:border-muted-foreground/30'
            }`}>
              <input
                type="radio"
                name="mode"
                value="timed"
                checked={selectedMode === 'timed'}
                onChange={(e) => setSelectedMode(e.target.value)}
                className="sr-only"
              />
              <div className="flex items-start space-x-3">
                <div className="text-2xl">⏱️</div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">
                    Timed Mode
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Complete the quiz within the time limit. 
                    Automatic submission when time runs out.
                  </p>
                </div>
              </div>
            </label>

            {/* Mock Exam Mode */}
            {quiz.isMock && (
              <label className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                selectedMode === 'mock' 
                  ? 'border-primary bg-primary/10 dark:bg-primary/20' 
                  : 'border-border hover:border-muted-foreground/30'
              }`}>
                <input
                  type="radio"
                  name="mode"
                  value="mock"
                  checked={selectedMode === 'mock'}
                  onChange={(e) => setSelectedMode(e.target.value)}
                  className="sr-only"
                />
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">🏆</div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1 flex items-center space-x-2">
                      <span>Mock Exam Mode</span>
                      <Zap className="w-4 h-4 text-yellow-500" />
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Simulate real exam conditions. No hints, no explanations until the end. 
                      Full concentration required.
                    </p>
                  </div>
                </div>
              </label>
            )}
          </div>

          <button
            onClick={handleStartQuiz}
            disabled={!quiz.isPublished}
            className="w-full btn-primary mt-6 flex items-center justify-center space-x-2"
          >
            <Play className="w-5 h-5" />
            <span>
              Start {selectedMode === 'mock' ? 'Mock Exam' : 
                     selectedMode === 'timed' ? 'Timed Quiz' : 'Practice'}
            </span>
          </button>

          {!quiz.isPublished && (
            <p className="text-center text-sm text-yellow-600 dark:text-yellow-400 mt-2">
              This quiz is not yet published by the teacher
            </p>
          )}
        </div>

        {/* Previous Attempts */}
        <div className="surface-card">
          <h3 className="text-xl font-semibold text-foreground mb-6">
            Previous Attempts
          </h3>
          
          {userAttempts.length > 0 ? (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {userAttempts.slice(0, 10).map((attempt, index) => (
                <div key={attempt._id} className="p-4 bg-muted rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        Attempt #{userAttempts.length - index}
                      </span>
                      <BadgeChip 
                        variant={attempt.percentage >= 80 ? 'success' : 
                                attempt.percentage >= 60 ? 'warning' : 'danger'}
                        size="xs"
                      >
                        {attempt.percentage}%
                      </BadgeChip>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(attempt.completedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Score:</span>
                      <span className="ml-1 font-medium text-foreground">
                        {attempt.score}/{quiz.totalQuestions}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Time:</span>
                      <span className="ml-1 font-medium text-foreground">
                        {formatTime(attempt.timeTaken)}
                      </span>
                    </div>
                    <div className="text-right">
                      <Link
                        to={`/quiz/${id}/result?attempt=${attempt._id}`}
                        className="text-primary hover:text-primary/80 text-sm"
                      >
                        Review →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                You haven't attempted this quiz yet
              </p>
              <p className="text-sm text-muted-foreground">
                Your attempt history will appear here after you take the quiz
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 surface-card">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Instructions
        </h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>• Read each question carefully before selecting your answer</p>
          <p>• You can change your answers before submitting</p>
          <p>• Use the question navigation to jump between questions</p>
          {selectedMode === 'timed' && (
            <p className="text-orange-600 dark:text-orange-400">
              • Timer will automatically submit when time runs out
            </p>
          )}
          {selectedMode === 'mock' && (
            <p className="text-red-600 dark:text-red-400">
              • No explanations or hints will be shown during the exam
            </p>
          )}
          <p>• Click "Submit Quiz" when you're ready to see your results</p>
        </div>
      </div>
      </div>
    </div>
  )
}



