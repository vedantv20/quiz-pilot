import { useState } from 'react'
import { Bookmark, BookmarkCheck, ChevronLeft, ChevronRight } from 'lucide-react'
import { BadgeChip } from './BadgeChip'

export const QuestionCard = ({ 
  question, 
  questionNumber, 
  totalQuestions,
  selectedAnswer, 
  onAnswerSelect, 
  showCorrectAnswer = false,
  showExplanation = false,
  isBookmarked = false,
  onBookmarkToggle,
  className = ""
}) => {
  const [imageError, setImageError] = useState(false)

  const handleOptionClick = (optionIndex) => {
    if (!showCorrectAnswer && onAnswerSelect) {
      onAnswerSelect(optionIndex)
    }
  }

  const getOptionStyle = (optionIndex) => {
    const baseClasses = "w-full p-4 text-left rounded-lg border-2 transition-all duration-200 flex items-start space-x-3"
    
    if (showCorrectAnswer) {
      if (optionIndex === question.correctIndex) {
        return `${baseClasses} bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300`
      }
      if (selectedAnswer === optionIndex && optionIndex !== question.correctIndex) {
        return `${baseClasses} bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300`
      }
      return `${baseClasses} bg-gray-50 border-gray-200 text-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300`
    }
    
    if (selectedAnswer === optionIndex) {
      return `${baseClasses} bg-primary-50 border-primary-200 text-primary-800 dark:bg-primary-900/20 dark:border-primary-800 dark:text-primary-300`
    }
    
    return `${baseClasses} bg-white border-gray-200 text-gray-900 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 cursor-pointer`
  }

  const getOptionLabel = (index) => {
    return String.fromCharCode(65 + index) // A, B, C, D
  }

  return (
    <div className={`card ${className}`}>
      {/* Question Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <BadgeChip variant="primary">
            Question {questionNumber} of {totalQuestions}
          </BadgeChip>
          {question.difficulty && (
            <BadgeChip variant={question.difficulty}>
              {question.difficulty}
            </BadgeChip>
          )}
        </div>
        {onBookmarkToggle && (
          <button
            onClick={() => onBookmarkToggle(question._id)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title={isBookmarked ? "Remove bookmark" : "Bookmark question"}
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            ) : (
              <Bookmark className="w-5 h-5 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400" />
            )}
          </button>
        )}
      </div>

      {/* Question Text */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white leading-relaxed">
          {question.text}
        </h3>
      </div>

      {/* Question Image (if exists) */}
      {question.image && !imageError && (
        <div className="mb-6">
          <img
            src={question.image}
            alt="Question diagram"
            className="max-w-full h-auto rounded-lg shadow-sm"
            onError={() => setImageError(true)}
          />
        </div>
      )}

      {/* Options */}
      <div className="space-y-3 mb-6">
        {question.options?.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(index)}
            className={getOptionStyle(index)}
            disabled={showCorrectAnswer}
          >
            <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-current flex items-center justify-center font-semibold text-sm">
              {getOptionLabel(index)}
            </div>
            <span className="flex-1 text-left">{option}</span>
            {showCorrectAnswer && index === question.correctIndex && (
              <div className="flex-shrink-0 text-green-600 dark:text-green-400">
                ✓
              </div>
            )}
            {showCorrectAnswer && selectedAnswer === index && index !== question.correctIndex && (
              <div className="flex-shrink-0 text-red-600 dark:text-red-400">
                ✗
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Explanation */}
      {showExplanation && question.explanation && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-400">
          <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
            Explanation
          </h4>
          <p className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  )
}