import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  SortAsc, 
  BookOpen, 
  Clock,
  Users,
  TrendingUp
} from 'lucide-react'
import { subjectAPI, quizAPI, attemptAPI } from '../api'
import { QuizCard } from '../components/QuizCard'
import { StatCard } from '../components/StatCard'

export const SubjectDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [sortBy, setSortBy] = useState('recent') // recent, popular, difficulty

  // Fetch subject details
  const { data: subject, isLoading: subjectLoading } = useQuery({
    queryKey: ['subjects', id],
    queryFn: async () => {
      const subjects = await subjectAPI.getAll().then(res => res.data.data)
      return subjects.find(s => s._id === id)
    },
    enabled: !!id,
  })

  // Fetch quizzes for this subject
  const { data: allQuizzes = [], isLoading: quizzesLoading } = useQuery({
    queryKey: ['quizzes', 'subject', id],
    queryFn: () => quizAPI.getAll({ subject: id }).then(res => res.data.data),
    enabled: !!id,
  })

  // Fetch user's attempts for this subject
  const { data: userAttempts = [] } = useQuery({
    queryKey: ['attempts', 'my', 'subject', id],
    queryFn: async () => {
      const attempts = await attemptAPI.getMy().then(res => res.data.data)
      return attempts.filter(attempt => 
        (attempt.quiz?.subject?._id || attempt.quiz?.subject) === id
      )
    },
    enabled: !!id,
  })

  // Filter and sort quizzes
  const filteredQuizzes = allQuizzes
    .filter(quiz => quiz.isPublished) // Only show published quizzes
    .filter(quiz => {
      const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.description?.toLowerCase().includes(searchTerm.toLowerCase())
      
      if (selectedDifficulty === 'all') return matchesSearch
      return matchesSearch && quiz.difficulty === selectedDifficulty
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.createdAt) - new Date(a.createdAt)
        case 'popular':
          return (b.attemptCount || 0) - (a.attemptCount || 0)
        case 'difficulty':
          const difficultyOrder = { easy: 1, medium: 2, hard: 3 }
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
        default:
          return 0
      }
    })

  // Calculate subject stats
  const subjectStats = {
    totalQuizzes: allQuizzes.filter(q => q.isPublished).length,
    userAttempts: userAttempts.length,
    averageScore: userAttempts.length ? 
      Math.round(userAttempts.reduce((acc, attempt) => acc + attempt.percentage, 0) / userAttempts.length) : 0,
    completionRate: allQuizzes.length ? 
      Math.round((new Set(userAttempts.map(a => a.quiz?._id || a.quiz)).size / allQuizzes.filter(q => q.isPublished).length) * 100) : 0
  }

  const difficultyCounts = {
    easy: allQuizzes.filter(q => q.difficulty === 'easy' && q.isPublished).length,
    medium: allQuizzes.filter(q => q.difficulty === 'medium' && q.isPublished).length,
    hard: allQuizzes.filter(q => q.difficulty === 'hard' && q.isPublished).length,
  }

  if (subjectLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!subject) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Subject Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The subject you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate('/subjects')}
            className="btn-primary"
          >
            Browse All Subjects
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
            onClick={() => navigate('/subjects')}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div className="flex items-center space-x-4">
            <div className="text-4xl">{subject.icon}</div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {subject.name}
              </h1>
              {subject.description && (
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {subject.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Subject Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Quizzes"
            value={subjectStats.totalQuizzes}
            icon={BookOpen}
            color="primary"
          />
          <StatCard
            title="Your Attempts"
            value={subjectStats.userAttempts}
            icon={TrendingUp}
            color="info"
          />
          <StatCard
            title="Average Score"
            value={`${subjectStats.averageScore}%`}
            icon={Users}
            color="success"
            subtitle={subjectStats.userAttempts > 0 ? "Your performance" : "No attempts yet"}
          />
          <StatCard
            title="Completion"
            value={`${subjectStats.completionRate}%`}
            icon={Clock}
            color="warning"
            subtitle="Quizzes completed"
          />
        </div>

        {/* Difficulty Distribution */}
        <div className="card mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Difficulty Distribution
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {difficultyCounts.easy}
              </div>
              <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                Easy
              </div>
            </div>
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {difficultyCounts.medium}
              </div>
              <div className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">
                Medium
              </div>
            </div>
            <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {difficultyCounts.hard}
              </div>
              <div className="text-sm text-red-600 dark:text-red-400 font-medium">
                Hard
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search quizzes..."
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
            className="input-field pr-10 appearance-none min-w-[140px]"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy ({difficultyCounts.easy})</option>
            <option value="medium">Medium ({difficultyCounts.medium})</option>
            <option value="hard">Hard ({difficultyCounts.hard})</option>
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
            <option value="popular">Most Popular</option>
            <option value="difficulty">By Difficulty</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <SortAsc className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Quizzes Grid */}
      {quizzesLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : filteredQuizzes.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map((quiz) => (
              <QuizCard 
                key={quiz._id} 
                quiz={quiz} 
                subject={subject}
                showSubject={false}
              />
            ))}
          </div>
          
          {/* Results Count */}
          <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredQuizzes.length} of {subjectStats.totalQuizzes} quizzes
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No quizzes found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchTerm || selectedDifficulty !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'No quizzes are available for this subject yet.'}
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

      {/* Breadcrumb Navigation */}
      <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <Link to="/subjects" className="hover:text-primary-600 dark:hover:text-primary-400">
            All Subjects
          </Link>
          <span>›</span>
          <span className="text-gray-900 dark:text-white font-medium">
            {subject.name}
          </span>
        </nav>
      </div>
    </div>
  )
}
