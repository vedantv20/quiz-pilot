import { Link } from 'react-router-dom'
import { Clock, Users, BookOpen, Play, Eye, Zap } from 'lucide-react'

export const QuizCard = ({ 
  quiz, 
  subject, 
  showSubject = true, 
  showStats = true,
  className = ""
}) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    return `${minutes}m`
  }

  return (
    <div className={`card hover:shadow-lg transition-all duration-200 group ${className}`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          {showSubject && subject && (
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{subject.icon}</span>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {subject.name}
              </span>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <span className={`badge ${getDifficultyColor(quiz.difficulty)}`}>
              {quiz.difficulty}
            </span>
            {quiz.isMock && (
              <span className="badge badge-info flex items-center space-x-1">
                <Zap className="w-3 h-3" />
                <span>Mock</span>
              </span>
            )}
          </div>
        </div>

        {/* Title & Description */}
        <div className="flex-1 mb-4">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {quiz.title}
          </h3>
          {quiz.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {quiz.description}
            </p>
          )}
        </div>

        {/* Stats */}
        {showStats && (
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <BookOpen className="w-4 h-4" />
                <span>{quiz.totalQuestions || 0} questions</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{formatTime(quiz.timeLimit || 600)}</span>
              </div>
            </div>
            {quiz.attemptCount && (
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{quiz.attemptCount} attempts</span>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <Link
            to={`/quiz/${quiz._id}`}
            className="btn-primary flex-1 flex items-center justify-center space-x-2"
          >
            <Play className="w-4 h-4" />
            <span>Start Quiz</span>
          </Link>
          <Link
            to={`/quiz/${quiz._id}`}
            className="btn-secondary p-2"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}

// Add line-clamp utility to CSS if not present
const style = document.createElement('style')
style.textContent = `
  .line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`
if (!document.head.querySelector('style[data-component="line-clamp"]')) {
  style.setAttribute('data-component', 'line-clamp')
  document.head.appendChild(style)
}