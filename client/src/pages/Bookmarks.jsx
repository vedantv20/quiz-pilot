import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  Bookmark, 
  Search, 
  Filter, 
  BookOpen, 
  Trash2, 
  ExternalLink,
  SortAsc
} from 'lucide-react'
import { bookmarkAPI, subjectAPI } from '../api'
import { QuestionCard } from '../components/QuestionCard'
import { BadgeChip } from '../components/BadgeChip'
import toast from 'react-hot-toast'

export const Bookmarks = () => {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [sortBy, setSortBy] = useState('recent') // recent, subject, difficulty
  const [selectedQuestions, setSelectedQuestions] = useState(new Set())

  // Fetch bookmarked questions
  const { data: bookmarks = [], isLoading: bookmarksLoading } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: () => bookmarkAPI.getAll().then(res => res.data.data),
  })

  // Fetch subjects for filtering
  const { data: subjects = [] } = useQuery({
    queryKey: ['subjects'],
    queryFn: () => subjectAPI.getAll().then(res => res.data.data),
  })

  // Remove bookmark mutation
  const removeBookmark = useMutation({
    mutationFn: (questionId) => bookmarkAPI.remove(questionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] })
      toast.success('Bookmark removed')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to remove bookmark')
    }
  })

  // Bulk remove bookmarks
  const bulkRemoveBookmarks = useMutation({
    mutationFn: async (questionIds) => {
      await Promise.all(questionIds.map(id => bookmarkAPI.remove(id)))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] })
      setSelectedQuestions(new Set())
      toast.success('Selected bookmarks removed')
    },
    onError: (error) => {
      toast.error('Failed to remove some bookmarks')
    }
  })

  // Filter and sort bookmarks
  const filteredBookmarks = bookmarks
    .filter(bookmark => {
      const question = bookmark.question
      const matchesSearch = question.text.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesSubject = selectedSubject === 'all' || 
        (question.subject?._id === selectedSubject || question.subject === selectedSubject)
      
      const matchesDifficulty = selectedDifficulty === 'all' || 
        question.difficulty === selectedDifficulty
      
      return matchesSearch && matchesSubject && matchesDifficulty
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.createdAt) - new Date(a.createdAt)
        case 'subject':
          const subjectA = subjects.find(s => s._id === (a.question.subject?._id || a.question.subject))?.name || 'Unknown'
          const subjectB = subjects.find(s => s._id === (b.question.subject?._id || b.question.subject))?.name || 'Unknown'
          return subjectA.localeCompare(subjectB)
        case 'difficulty':
          const difficultyOrder = { easy: 1, medium: 2, hard: 3 }
          return (difficultyOrder[a.question.difficulty] || 0) - (difficultyOrder[b.question.difficulty] || 0)
        default:
          return 0
      }
    })

  const handleQuestionSelect = (questionId, isSelected) => {
    setSelectedQuestions(prev => {
      const next = new Set(prev)
      if (isSelected) {
        next.add(questionId)
      } else {
        next.delete(questionId)
      }
      return next
    })
  }

  const handleSelectAll = () => {
    if (selectedQuestions.size === filteredBookmarks.length) {
      setSelectedQuestions(new Set())
    } else {
      setSelectedQuestions(new Set(filteredBookmarks.map(b => b.question._id)))
    }
  }

  const handleBulkRemove = () => {
    if (selectedQuestions.size === 0) return
    
    const confirmed = window.confirm(
      `Are you sure you want to remove ${selectedQuestions.size} bookmark${selectedQuestions.size === 1 ? '' : 's'}?`
    )
    
    if (confirmed) {
      bulkRemoveBookmarks.mutate(Array.from(selectedQuestions))
    }
  }

  if (bookmarksLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Bookmark className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Bookmarked Questions
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Review your saved questions and practice them again
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search bookmarked questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>

        {/* Subject Filter */}
        <div className="relative">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="input-field pr-10 appearance-none min-w-[150px]"
          >
            <option value="all">All Subjects</option>
            {subjects.map(subject => (
              <option key={subject._id} value={subject._id}>
                {subject.name}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <Filter className="h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Difficulty Filter */}
        <div className="relative">
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="input-field pr-10 appearance-none min-w-[140px]"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <Filter className="h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Sort */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field pr-10 appearance-none min-w-[120px]"
          >
            <option value="recent">Most Recent</option>
            <option value="subject">By Subject</option>
            <option value="difficulty">By Difficulty</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <SortAsc className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {filteredBookmarks.length > 0 && (
        <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedQuestions.size === filteredBookmarks.length}
                onChange={handleSelectAll}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Select All ({filteredBookmarks.length})
              </span>
            </label>
            {selectedQuestions.size > 0 && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {selectedQuestions.size} selected
              </span>
            )}
          </div>
          {selectedQuestions.size > 0 && (
            <button
              onClick={handleBulkRemove}
              disabled={bulkRemoveBookmarks.isPending}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              <span>Remove Selected</span>
            </button>
          )}
        </div>
      )}

      {/* Bookmarked Questions */}
      {filteredBookmarks.length > 0 ? (
        <div className="space-y-6">
          {filteredBookmarks.map((bookmark, index) => {
            const question = bookmark.question
            const subject = subjects.find(s => 
              s._id === (question.subject?._id || question.subject)
            )
            const isSelected = selectedQuestions.has(question._id)

            return (
              <div key={bookmark._id} className="relative">
                {/* Selection Checkbox */}
                <div className="absolute top-4 left-4 z-10">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => handleQuestionSelect(question._id, e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </div>

                {/* Question Card with Actions */}
                <div className="relative pl-12">
                  <div className="card">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <BadgeChip variant="primary" size="xs">
                          Question {index + 1}
                        </BadgeChip>
                        {subject && (
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{subject.icon}</span>
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                              {subject.name}
                            </span>
                          </div>
                        )}
                        {question.difficulty && (
                          <BadgeChip variant={question.difficulty} size="xs">
                            {question.difficulty}
                          </BadgeChip>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        {/* Link to original quiz */}
                        {question.quiz && (
                          <Link
                            to={`/quiz/${question.quiz._id || question.quiz}`}
                            className="p-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                            title="View original quiz"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        )}
                        
                        {/* Remove bookmark */}
                        <button
                          onClick={() => removeBookmark.mutate(question._id)}
                          disabled={removeBookmark.isPending}
                          className="p-2 text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
                          title="Remove bookmark"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Question Content */}
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white leading-relaxed mb-4">
                        {question.text}
                      </h3>

                      {/* Options */}
                      <div className="space-y-2">
                        {question.options?.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className={`p-3 rounded-lg border ${
                              optionIndex === question.correctIndex
                                ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300'
                                : 'bg-gray-50 border-gray-200 text-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-current flex items-center justify-center font-semibold text-sm">
                                {String.fromCharCode(65 + optionIndex)}
                              </div>
                              <span className="flex-1">{option}</span>
                              {optionIndex === question.correctIndex && (
                                <div className="flex-shrink-0 text-green-600 dark:text-green-400">
                                  ✓
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Explanation */}
                    {question.explanation && (
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-400">
                        <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
                          Explanation
                        </h4>
                        <p className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">
                          {question.explanation}
                        </p>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="text-sm text-gray-500 dark:text-gray-500">
                        Bookmarked on {new Date(bookmark.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Results Count */}
          <div className="text-center text-sm text-gray-600 dark:text-gray-400 pt-6">
            Showing {filteredBookmarks.length} of {bookmarks.length} bookmarked questions
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <Bookmark className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {bookmarks.length === 0 ? 'No bookmarked questions yet' : 'No questions found'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {bookmarks.length === 0 
              ? 'Start taking quizzes and bookmark questions you want to review later.'
              : 'Try adjusting your search or filter criteria.'
            }
          </p>
          
          {bookmarks.length === 0 ? (
            <Link to="/subjects" className="btn-primary">
              Browse Quizzes
            </Link>
          ) : (
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedSubject('all')
                setSelectedDifficulty('all')
              }}
              className="btn-primary"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  )
}
