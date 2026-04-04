import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Search, BookOpen, ChevronRight, Filter } from 'lucide-react'
import { subjectAPI, quizAPI } from '../api'

export const Subjects = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')

  // Fetch subjects
  const { data: subjects = [], isLoading: subjectsLoading } = useQuery({
    queryKey: ['subjects'],
    queryFn: () => subjectAPI.getAll().then(res => res.data.data),
  })

  // Fetch quizzes to get counts per subject
  const { data: quizzes = [] } = useQuery({
    queryKey: ['quizzes', 'all'],
    queryFn: () => quizAPI.getAll().then(res => res.data.data),
  })

  // Calculate quiz counts per subject
  const subjectsWithCounts = subjects.map(subject => {
    const subjectQuizzes = quizzes.filter(quiz => 
      (quiz.subject?._id || quiz.subject) === subject._id && quiz.isPublished
    )
    
    const difficultyCounts = {
      easy: subjectQuizzes.filter(q => q.difficulty === 'easy').length,
      medium: subjectQuizzes.filter(q => q.difficulty === 'medium').length,
      hard: subjectQuizzes.filter(q => q.difficulty === 'hard').length,
    }

    return {
      ...subject,
      quizCount: subjectQuizzes.length,
      difficultyCounts,
      averageQuestions: subjectQuizzes.length ? 
        Math.round(subjectQuizzes.reduce((acc, q) => acc + (q.totalQuestions || 0), 0) / subjectQuizzes.length) : 0
    }
  })

  // Filter subjects based on search and difficulty
  const filteredSubjects = subjectsWithCounts.filter(subject => {
    const matchesSearch = subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (selectedDifficulty === 'all') return matchesSearch
    return matchesSearch && subject.difficultyCounts[selectedDifficulty] > 0
  })

  const totalQuizzes = quizzes.filter(q => q.isPublished).length
  const totalSubjects = subjects.length

  if (subjectsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Explore Subjects
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Choose from {totalSubjects} subjects with {totalQuizzes} practice quizzes
        </p>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search subjects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Difficulty Filter */}
          <div className="relative">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="input-field pr-10 appearance-none"
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
        </div>
      </div>

      {/* Subjects Grid */}
      {filteredSubjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map((subject) => (
            <Link
              key={subject._id}
              to={`/subjects/${subject._id}`}
              className="card hover:shadow-lg transition-all duration-200 group"
            >
              {/* Subject Icon and Title */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="text-4xl">{subject.icon}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {subject.name}
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <BookOpen className="w-4 h-4" />
                    <span>{subject.quizCount} quizzes</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
              </div>

              {/* Description */}
              {subject.description && (
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  {subject.description}
                </p>
              )}

              {/* Stats */}
              <div className="space-y-3">
                {/* Difficulty Distribution */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Difficulty levels:</span>
                  <div className="flex items-center space-x-3">
                    {subject.difficultyCounts.easy > 0 && (
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-gray-600 dark:text-gray-400">{subject.difficultyCounts.easy}</span>
                      </div>
                    )}
                    {subject.difficultyCounts.medium > 0 && (
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        <span className="text-gray-600 dark:text-gray-400">{subject.difficultyCounts.medium}</span>
                      </div>
                    )}
                    {subject.difficultyCounts.hard > 0 && (
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        <span className="text-gray-600 dark:text-gray-400">{subject.difficultyCounts.hard}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Average Questions */}
                {subject.averageQuestions > 0 && (
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Avg. questions per quiz:</span>
                    <span className="font-medium">{subject.averageQuestions}</span>
                  </div>
                )}

                {/* Progress Bar (placeholder for user progress) */}
                <div className="pt-2">
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500 mb-1">
                    <span>Your progress</span>
                    <span>0%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-primary-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No subjects found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchTerm || selectedDifficulty !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'No subjects are available at the moment.'}
          </p>
          {(searchTerm || selectedDifficulty !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedDifficulty('all')
              }}
              className="btn-primary"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Subject Stats Summary */}
      {filteredSubjects.length > 0 && (
        <div className="mt-12 card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Stats
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {totalSubjects}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Subjects
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {quizzes.filter(q => q.difficulty === 'easy' && q.isPublished).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Easy Quizzes
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {quizzes.filter(q => q.difficulty === 'medium' && q.isPublished).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Medium Quizzes
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {quizzes.filter(q => q.difficulty === 'hard' && q.isPublished).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Hard Quizzes
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
