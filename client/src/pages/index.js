import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { 
  BookOpen, 
  Trophy, 
  Users, 
  TrendingUp, 
  Clock, 
  Target,
  ArrowRight,
  CheckCircle,
  Star,
  BarChart3,
  FileText,
  Zap,
  AlertCircle,
  Search
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'

export const Landing = () => {
  const subjects = [
    { name: 'Mathematics', icon: '➕', quizCount: 25 },
    { name: 'Physics', icon: '⚛️', quizCount: 22 },
    { name: 'Chemistry', icon: '🧪', quizCount: 18 },
    { name: 'Biology', icon: '🧬', quizCount: 20 },
    { name: 'Computer Science', icon: '💻', quizCount: 15 },
    { name: 'History', icon: '📜', quizCount: 12 },
  ]

  const features = [
    {
      icon: BookOpen,
      title: 'Comprehensive Quizzes',
      description: 'Access thousands of practice questions across multiple subjects with detailed explanations.'
    },
    {
      icon: Trophy,
      title: 'Leaderboards & Badges',
      description: 'Compete with peers, track your progress, and earn badges for your achievements.'
    },
    {
      icon: BarChart3,
      title: 'Performance Analytics',
      description: 'Get detailed insights into your performance with charts and progress tracking.'
    },
    {
      icon: Clock,
      title: 'Timed Practice',
      description: 'Practice under real exam conditions with customizable time limits and mock tests.'
    },
    {
      icon: Target,
      title: 'Personalized Learning',
      description: 'Bookmark questions, track weak areas, and get personalized recommendations.'
    },
    {
      icon: Users,
      title: 'Teacher Dashboard',
      description: 'Educators can create custom quizzes and track student performance.'
    }
  ]

  const howItWorks = [
    {
      step: '1',
      title: 'Sign Up & Choose Your Path',
      description: 'Create your account and select your target exam or study goals.',
      icon: Target
    },
    {
      step: '2',
      title: 'Practice & Learn',
      description: 'Take quizzes, practice questions, and learn from detailed explanations.',
      icon: BookOpen
    },
    {
      step: '3',
      title: 'Track & Improve',
      description: 'Monitor your progress, compete on leaderboards, and achieve your goals.',
      icon: TrendingUp
    }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">QP</span>
              </div>
              <span className="font-bold text-xl text-gray-900 dark:text-white font-['Plus Jakarta Sans']">
                QuizPilot
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-violet-100 dark:from-gray-900 dark:to-purple-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-purple-600 rounded-full blur-xl opacity-20 animate-pulse"></div>
                <div className="relative w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 font-['Plus Jakarta Sans']">
              Master Your Exams with
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-violet-600">
                QuizPilot
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              The ultimate online quiz and exam preparation platform. Practice with thousands of questions, 
              track your progress, and achieve your academic goals with confidence.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link
                to="/register"
                className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                Start Learning Now
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/subjects"
                className="w-full sm:w-auto border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all"
              >
                Explore Subjects
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-purple-600">1000+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Practice Questions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-purple-600">50+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Quiz Categories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-purple-600">98%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-purple-600">24/7</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Available</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 font-['Plus Jakarta Sans']">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Get started with QuizPilot in three simple steps and begin your journey to academic success.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center relative">
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-purple-300 to-violet-300 dark:from-purple-700 dark:to-violet-700 transform -translate-y-1/2 z-0"></div>
                )}
                
                <div className="relative z-10 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto text-sm font-bold">
                    {step.step}
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 font-['Plus Jakarta Sans']">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 font-['Plus Jakarta Sans']">
              Powerful Features for Success
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to excel in your exams and achieve your academic goals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 font-['Plus Jakarta Sans']">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects Preview Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 font-['Plus Jakarta Sans']">
              Explore Our Subjects
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Choose from a wide range of subjects and start practicing with expert-crafted questions.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
            {subjects.map((subject, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors cursor-pointer group">
                <div className="text-4xl mb-4 text-center">{subject.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {subject.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  {subject.quizCount} Quizzes Available
                </p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/subjects"
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors"
            >
              View All Subjects
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Survey CTA Section */}
      <section className="py-24 bg-gradient-to-br from-purple-600 to-violet-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 lg:p-12">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 font-['Plus Jakarta Sans']">
              Help Us Personalize Your Experience
            </h2>
            
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Take our quick survey to help us understand your study habits and goals. 
              We'll use this to provide personalized recommendations and track progress across our platform.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 text-purple-100">
                <CheckCircle className="w-5 h-5" />
                <span>Only takes 3 minutes</span>
              </div>
              <div className="flex items-center gap-2 text-purple-100">
                <CheckCircle className="w-5 h-5" />
                <span>Completely anonymous</span>
              </div>
              <div className="flex items-center gap-2 text-purple-100">
                <CheckCircle className="w-5 h-5" />
                <span>Helps improve our platform</span>
              </div>
            </div>
            
            <Link
              to="/survey"
              className="inline-flex items-center gap-2 bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 rounded-xl text-lg font-semibold transition-colors"
            >
              Take Survey
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-1">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">QP</span>
                </div>
                <span className="font-bold text-xl text-white font-['Plus Jakarta Sans']">
                  QuizPilot
                </span>
              </div>
              <p className="text-gray-400 mb-6">
                Master your exams with our comprehensive quiz and practice platform.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Platform</h3>
              <ul className="space-y-2">
                <li><Link to="/subjects" className="hover:text-purple-400 transition-colors">Subjects</Link></li>
                <li><Link to="/leaderboard" className="hover:text-purple-400 transition-colors">Leaderboard</Link></li>
                <li><Link to="/survey" className="hover:text-purple-400 transition-colors">Survey</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Account</h3>
              <ul className="space-y-2">
                <li><Link to="/register" className="hover:text-purple-400 transition-colors">Sign Up</Link></li>
                <li><Link to="/login" className="hover:text-purple-400 transition-colors">Sign In</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Features</h3>
              <ul className="space-y-2">
                <li>Practice Quizzes</li>
                <li>Performance Analytics</li>
                <li>Mock Exams</li>
                <li>Progress Tracking</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 QuizPilot. All rights reserved. Built for academic excellence.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/dashboard'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setIsLoading(true)

    try {
      // Basic validation
      if (!formData.email) {
        setErrors(prev => ({ ...prev, email: 'Email is required' }))
        return
      }
      if (!formData.password) {
        setErrors(prev => ({ ...prev, password: 'Password is required' }))
        return
      }

      // Call login API
      await login(formData.email, formData.password)
      navigate(from, { replace: true })
    } catch (error) {
      setErrors({ 
        general: error.response?.data?.message || 'Invalid email or password' 
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 mb-8">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">
              QuizPilot
            </span>
          </Link>
          
          <h2 className="text-3xl font-bold text-foreground">
            Welcome back
          </h2>
          <p className="mt-2 text-muted-foreground">
            Sign in to your account to continue learning
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-card rounded-2xl shadow-lg p-8 border border-border">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* General Error */}
            {errors.general && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-destructive" />
                  <p className="text-sm text-destructive">{errors.general}</p>
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors ${
                  errors.email ? 'border-destructive' : 'border-border'
                }`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors ${
                  errors.password ? 'border-destructive' : 'border-border'
                }`}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 px-4 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium text-muted-foreground mb-2">Demo Credentials:</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p><strong>Student:</strong> student1@quizpilot.com / Student@123</p>
              <p><strong>Teacher:</strong> teacher@quizpilot.com / Teacher@123</p>
              <p><strong>Admin:</strong> admin@quizpilot.com / Admin@123</p>
            </div>
          </div>
        </div>

        {/* Sign up link */}
        <div className="text-center">
          <p className="text-muted-foreground">
            Don't have an account?{' '}
            <Link 
              to="/register" 
              className="font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const { register } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setIsLoading(true)

    try {
      // Validation
      if (!formData.name.trim()) {
        setErrors(prev => ({ ...prev, name: 'Name is required' }))
        return
      }
      if (!formData.email) {
        setErrors(prev => ({ ...prev, email: 'Email is required' }))
        return
      }
      if (!formData.password) {
        setErrors(prev => ({ ...prev, password: 'Password is required' }))
        return
      }
      if (formData.password.length < 6) {
        setErrors(prev => ({ ...prev, password: 'Password must be at least 6 characters' }))
        return
      }
      if (formData.password !== formData.confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }))
        return
      }

      // Call register API
      await register({
        name: formData.name.trim(),
        email: formData.email,
        password: formData.password,
        role: formData.role
      })
      navigate('/dashboard')
    } catch (error) {
      setErrors({ 
        general: error.response?.data?.message || 'Registration failed. Please try again.' 
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 mb-8">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">
              QuizPilot
            </span>
          </Link>
          
          <h2 className="text-3xl font-bold text-foreground">
            Create your account
          </h2>
          <p className="mt-2 text-muted-foreground">
            Join QuizPilot and start your learning journey
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-card rounded-2xl shadow-lg p-8 border border-border">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* General Error */}
            {errors.general && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-destructive" />
                  <p className="text-sm text-destructive">{errors.general}</p>
                </div>
              </div>
            )}

            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors ${
                  errors.name ? 'border-destructive' : 'border-border'
                }`}
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors ${
                  errors.email ? 'border-destructive' : 'border-border'
                }`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                I am a:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className={`relative flex items-center justify-center p-4 rounded-lg border cursor-pointer transition-colors ${
                  formData.role === 'student' 
                    ? 'border-primary bg-primary/5 text-primary' 
                    : 'border-border bg-background text-foreground hover:bg-muted'
                }`}>
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={formData.role === 'student'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <BookOpen className="w-6 h-6 mx-auto mb-2" />
                    <span className="font-medium">Student</span>
                  </div>
                </label>
                
                <label className={`relative flex items-center justify-center p-4 rounded-lg border cursor-pointer transition-colors ${
                  formData.role === 'teacher' 
                    ? 'border-primary bg-primary/5 text-primary' 
                    : 'border-border bg-background text-foreground hover:bg-muted'
                }`}>
                  <input
                    type="radio"
                    name="role"
                    value="teacher"
                    checked={formData.role === 'teacher'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <Users className="w-6 h-6 mx-auto mb-2" />
                    <span className="font-medium">Teacher</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors ${
                  errors.password ? 'border-destructive' : 'border-border'
                }`}
                placeholder="Create a password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors ${
                  errors.confirmPassword ? 'border-destructive' : 'border-border'
                }`}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-destructive">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 px-4 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </button>
          </form>

          {/* Terms */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              By creating an account, you agree to our{' '}
              <a href="#" className="text-primary hover:text-primary/80 transition-colors">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-primary hover:text-primary/80 transition-colors">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>

        {/* Sign in link */}
        <div className="text-center">
          <p className="text-muted-foreground">
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export const Dashboard = () => {
  const { user } = useAuthStore()
  const [stats, setStats] = useState({
    totalQuizzesTaken: 0,
    averageScore: 0,
    currentStreak: 0,
    globalRank: 0,
    loading: true
  })

  // Mock data - in real app, this would come from API
  const recentAttempts = [
    { id: 1, quizTitle: 'Mathematics - Algebra', score: 85, date: '2024-04-01', subject: 'Mathematics' },
    { id: 2, quizTitle: 'Physics - Mechanics', score: 92, date: '2024-03-30', subject: 'Physics' },
    { id: 3, quizTitle: 'Chemistry - Organic', score: 78, date: '2024-03-28', subject: 'Chemistry' },
    { id: 4, quizTitle: 'Biology - Cell Biology', score: 88, date: '2024-03-26', subject: 'Biology' },
  ]

  const subjectPerformance = [
    { subject: 'Mathematics', score: 85, total: 12, color: 'chart-1' },
    { subject: 'Physics', score: 79, total: 8, color: 'chart-2' },
    { subject: 'Chemistry', score: 82, total: 6, color: 'chart-3' },
    { subject: 'Biology', score: 88, total: 10, color: 'chart-4' },
    { subject: 'Computer Science', score: 91, total: 5, color: 'chart-5' },
  ]

  const upcomingQuizzes = [
    { id: 1, title: 'Advanced Calculus', subject: 'Mathematics', difficulty: 'hard', questions: 20 },
    { id: 2, title: 'Thermodynamics', subject: 'Physics', difficulty: 'medium', questions: 15 },
    { id: 3, title: 'Organic Reactions', subject: 'Chemistry', difficulty: 'hard', questions: 25 },
  ]

  const getBadgeColor = (score) => {
    if (score >= 90) return 'bg-chart-1 text-white'
    if (score >= 80) return 'bg-chart-3 text-white'
    if (score >= 70) return 'bg-chart-2 text-white'
    return 'bg-muted text-muted-foreground'
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-chart-1 text-white'
      case 'medium': return 'bg-chart-3 text-white'
      case 'hard': return 'bg-destructive text-destructive-foreground'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Ready to continue your learning journey?
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="text-sm font-medium text-foreground">{user?.streak || 0} day streak</div>
            <div className="text-xs text-muted-foreground">Keep it up!</div>
          </div>
          <div className="w-8 h-8 bg-chart-3 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Quizzes</p>
              <p className="text-2xl font-bold text-foreground">36</p>
            </div>
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-sm">
            <TrendingUp className="w-4 h-4 text-chart-1" />
            <span className="text-chart-1 font-medium">+12%</span>
            <span className="text-muted-foreground">from last month</span>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Average Score</p>
              <p className="text-2xl font-bold text-foreground">84%</p>
            </div>
            <div className="w-10 h-10 bg-chart-1/10 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-chart-1" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-sm">
            <TrendingUp className="w-4 h-4 text-chart-1" />
            <span className="text-chart-1 font-medium">+5.2%</span>
            <span className="text-muted-foreground">improvement</span>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Global Rank</p>
              <p className="text-2xl font-bold text-foreground">#127</p>
            </div>
            <div className="w-10 h-10 bg-chart-3/10 rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-chart-3" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-sm">
            <TrendingUp className="w-4 h-4 text-chart-1" />
            <span className="text-chart-1 font-medium">+23</span>
            <span className="text-muted-foreground">positions</span>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Study Time</p>
              <p className="text-2xl font-bold text-foreground">24h</p>
            </div>
            <div className="w-10 h-10 bg-chart-2/10 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-chart-2" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-sm">
            <span className="text-muted-foreground">This week</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Subject Performance */}
        <div className="lg:col-span-2 bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">Subject Performance</h2>
            <button className="text-sm text-primary hover:text-primary/80 transition-colors">
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {subjectPerformance.map((subject, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center text-lg">
                  {subject.subject === 'Mathematics' && '➕'}
                  {subject.subject === 'Physics' && '⚛️'}
                  {subject.subject === 'Chemistry' && '🧪'}
                  {subject.subject === 'Biology' && '🧬'}
                  {subject.subject === 'Computer Science' && '💻'}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {subject.subject}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {subject.total} quizzes
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor(subject.score)}`}>
                        {subject.score}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full bg-${subject.color}`}
                      style={{ width: `${subject.score}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">Recent Activity</h2>
            <Link to="/profile" className="text-sm text-primary hover:text-primary/80 transition-colors">
              View All
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentAttempts.map((attempt, index) => (
              <div key={attempt.id} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getBadgeColor(attempt.score)}`}>
                  <span className="text-xs font-bold">
                    {attempt.score}
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {attempt.quizTitle}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(attempt.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Quizzes */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Recommended for You</h2>
          <Link to="/subjects" className="text-sm text-primary hover:text-primary/80 transition-colors">
            Browse All
          </Link>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          {upcomingQuizzes.map((quiz, index) => (
            <div key={quiz.id} className="bg-muted/50 rounded-lg p-4 hover:bg-muted transition-colors">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-medium text-foreground">{quiz.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                  {quiz.difficulty}
                </span>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3">
                {quiz.subject} • {quiz.questions} questions
              </p>
              
              <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                Start Quiz
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export const Subjects = () => {
  const [subjects, setSubjects] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  // Mock subjects data - in real app, this would come from API
  const mockSubjects = [
    {
      id: 1,
      name: 'Mathematics',
      icon: '➕',
      description: 'Algebra, Calculus, Geometry, Statistics and more',
      quizCount: 45,
      difficulty: 'All Levels',
      color: 'chart-1',
      topics: ['Algebra', 'Calculus', 'Geometry', 'Statistics']
    },
    {
      id: 2,
      name: 'Physics',
      icon: '⚛️',
      description: 'Mechanics, Thermodynamics, Electromagnetism, Quantum Physics',
      quizCount: 38,
      difficulty: 'All Levels',
      color: 'chart-2',
      topics: ['Mechanics', 'Thermodynamics', 'Waves', 'Quantum']
    },
    {
      id: 3,
      name: 'Chemistry',
      icon: '🧪',
      description: 'Organic, Inorganic, Physical Chemistry and Biochemistry',
      quizCount: 32,
      difficulty: 'All Levels',
      color: 'chart-3',
      topics: ['Organic', 'Inorganic', 'Physical', 'Analytical']
    },
    {
      id: 4,
      name: 'Biology',
      icon: '🧬',
      description: 'Cell Biology, Genetics, Evolution, Ecology',
      quizCount: 29,
      difficulty: 'All Levels',
      color: 'chart-4',
      topics: ['Cell Biology', 'Genetics', 'Evolution', 'Ecology']
    },
    {
      id: 5,
      name: 'Computer Science',
      icon: '💻',
      description: 'Programming, Data Structures, Algorithms, System Design',
      quizCount: 41,
      difficulty: 'All Levels',
      color: 'chart-1',
      topics: ['Programming', 'Data Structures', 'Algorithms', 'Networks']
    },
    {
      id: 6,
      name: 'History',
      icon: '📜',
      description: 'World History, Ancient Civilizations, Modern Era',
      quizCount: 24,
      difficulty: 'All Levels',
      color: 'chart-5',
      topics: ['Ancient', 'Medieval', 'Modern', 'World Wars']
    },
  ]

  useState(() => {
    // Simulate API call
    setTimeout(() => {
      setSubjects(mockSubjects)
      setLoading(false)
    }, 500)
  }, [])

  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted rounded w-64"></div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-muted rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Explore Subjects
          </h1>
          <p className="text-muted-foreground mt-1">
            Choose from our comprehensive collection of subjects
          </p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Search subjects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          />
        </div>
      </div>

      {/* Stats Banner */}
      <div className="bg-gradient-to-r from-primary/10 to-chart-2/10 rounded-2xl p-6 border border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{subjects.length}</div>
            <div className="text-sm text-muted-foreground">Subjects Available</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {subjects.reduce((sum, subject) => sum + subject.quizCount, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Quizzes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">24/7</div>
            <div className="text-sm text-muted-foreground">Access</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">∞</div>
            <div className="text-sm text-muted-foreground">Practice Attempts</div>
          </div>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubjects.map((subject) => (
          <Link
            key={subject.id}
            to={`/subjects/${subject.id}`}
            className="group bg-card rounded-2xl p-6 border border-border hover:shadow-lg hover:border-primary/20 transition-all duration-200"
          >
            {/* Subject Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-200">
                  {subject.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {subject.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-muted-foreground">
                      {subject.quizCount} quizzes
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-chart-3 text-chart-3" />
                      <span className="text-xs text-muted-foreground">4.8</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              {subject.description}
            </p>

            {/* Topics */}
            <div className="flex flex-wrap gap-2 mb-4">
              {subject.topics.slice(0, 3).map((topic, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-muted rounded-md text-xs text-muted-foreground"
                >
                  {topic}
                </span>
              ))}
              {subject.topics.length > 3 && (
                <span className="px-2 py-1 bg-muted rounded-md text-xs text-muted-foreground">
                  +{subject.topics.length - 3}
                </span>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${subject.color}/10 text-${subject.color}`}>
                {subject.difficulty}
              </span>
              <div className="flex items-center gap-1 text-primary group-hover:text-primary/80 transition-colors">
                <span className="text-sm font-medium">Explore</span>
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* No Results */}
      {filteredSubjects.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No subjects found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search terms or browse all subjects.
          </p>
          <button
            onClick={() => setSearchTerm('')}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg transition-colors"
          >
            Clear Search
          </button>
        </div>
      )}
    </div>
  )
}

export const SubjectDetail = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Subject Detail - Coming Soon
      </h1>
    </div>
  )
}

export const QuizDetail = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Quiz Detail - Coming Soon
      </h1>
    </div>
  )
}

export const QuizAttempt = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <h1 className="text-3xl font-bold text-center pt-20 text-gray-900 dark:text-white">
        Quiz Attempt - Coming Soon
      </h1>
    </div>
  )
}

export const QuizResult = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Quiz Result - Coming Soon
      </h1>
    </div>
  )
}

export const Leaderboard = () => {
  const { user } = useAuthStore()
  const [timeFilter, setTimeFilter] = useState('all') // 'all', 'weekly', 'monthly'
  const [subjectFilter, setSubjectFilter] = useState('all')
  const [loading, setLoading] = useState(false)

  // Mock leaderboard data
  const leaderboardData = [
    {
      id: 1,
      name: 'Alice Johnson',
      avatar: null,
      score: 2485,
      quizzesTaken: 127,
      averageScore: 94.2,
      streak: 15,
      badges: ['top_10', 'streak_7', 'perfect_score'],
      rank: 1,
      change: 0
    },
    {
      id: 2,
      name: 'David Chen',
      avatar: null,
      score: 2341,
      quizzesTaken: 98,
      averageScore: 91.8,
      streak: 8,
      badges: ['streak_7', 'subject_master_Physics'],
      rank: 2,
      change: 1
    },
    {
      id: 3,
      name: 'Sarah Williams',
      avatar: null,
      score: 2298,
      quizzesTaken: 89,
      averageScore: 89.5,
      streak: 12,
      badges: ['streak_7', 'perfect_score'],
      rank: 3,
      change: -1
    },
    {
      id: 4,
      name: 'Michael Brown',
      avatar: null,
      score: 2156,
      quizzesTaken: 76,
      averageScore: 87.3,
      streak: 5,
      badges: ['first_quiz'],
      rank: 4,
      change: 2
    },
    {
      id: 5,
      name: 'Emma Davis',
      avatar: null,
      score: 2089,
      quizzesTaken: 84,
      averageScore: 86.1,
      streak: 3,
      badges: ['streak_7'],
      rank: 5,
      change: 0
    }
  ]

  const subjects = [
    { id: 'all', name: 'All Subjects', icon: '📚' },
    { id: 1, name: 'Mathematics', icon: '➕' },
    { id: 2, name: 'Physics', icon: '⚛️' },
    { id: 3, name: 'Chemistry', icon: '🧪' },
    { id: 4, name: 'Biology', icon: '🧬' },
    { id: 5, name: 'Computer Science', icon: '💻' },
  ]

  const getBadgeInfo = (badge) => {
    const badgeMap = {
      'top_10': { label: 'Top 10', color: 'bg-chart-3 text-white', icon: '🏆' },
      'streak_7': { label: '7 Day Streak', color: 'bg-chart-1 text-white', icon: '🔥' },
      'perfect_score': { label: 'Perfect Score', color: 'bg-chart-2 text-white', icon: '⭐' },
      'subject_master_Physics': { label: 'Physics Master', color: 'bg-chart-4 text-white', icon: '⚛️' },
      'first_quiz': { label: 'First Quiz', color: 'bg-muted text-muted-foreground', icon: '🎯' },
    }
    return badgeMap[badge] || { label: badge, color: 'bg-muted text-muted-foreground', icon: '🎖️' }
  }

  const getRankIcon = (rank) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return null
  }

  const getChangeIcon = (change) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-chart-1" />
    if (change < 0) return <TrendingUp className="w-4 h-4 text-destructive rotate-180" />
    return <div className="w-4 h-4 bg-muted-foreground rounded-full"></div>
  }

  // Find current user's position
  const currentUserRank = leaderboardData.findIndex(u => u.name === user?.name) + 1

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            🏆 Leaderboard
          </h1>
          <p className="text-muted-foreground mt-1">
            See how you rank against other students
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Time</option>
            <option value="monthly">This Month</option>
            <option value="weekly">This Week</option>
          </select>
          
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {subjects.map(subject => (
              <option key={subject.id} value={subject.id}>
                {subject.icon} {subject.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Current User Stats */}
      {currentUserRank > 0 && (
        <div className="bg-gradient-to-r from-primary/10 to-chart-2/10 rounded-2xl p-6 border border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground text-lg font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">Your Position</h3>
                <p className="text-muted-foreground">Keep climbing to reach the top!</p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">#{currentUserRank}</div>
              <div className="text-sm text-muted-foreground">Current Rank</div>
            </div>
          </div>
        </div>
      )}

      {/* Top 3 Podium */}
      <div className="bg-card rounded-2xl p-8 border border-border">
        <h2 className="text-xl font-semibold text-foreground mb-6 text-center">
          Top Performers
        </h2>
        
        <div className="flex items-end justify-center gap-4 mb-8">
          {/* 2nd Place */}
          {leaderboardData[1] && (
            <div className="text-center">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-3">
                <span className="text-lg font-bold text-foreground">
                  {leaderboardData[1].name.charAt(0)}
                </span>
              </div>
              <div className="text-4xl mb-2">🥈</div>
              <div className="font-semibold text-foreground">{leaderboardData[1].name}</div>
              <div className="text-sm text-muted-foreground">{leaderboardData[1].score} points</div>
            </div>
          )}
          
          {/* 1st Place */}
          {leaderboardData[0] && (
            <div className="text-center">
              <div className="w-24 h-24 bg-chart-3 rounded-full flex items-center justify-center mb-3 border-4 border-chart-3/20">
                <span className="text-xl font-bold text-white">
                  {leaderboardData[0].name.charAt(0)}
                </span>
              </div>
              <div className="text-5xl mb-2">🥇</div>
              <div className="font-bold text-foreground text-lg">{leaderboardData[0].name}</div>
              <div className="text-sm text-muted-foreground">{leaderboardData[0].score} points</div>
            </div>
          )}
          
          {/* 3rd Place */}
          {leaderboardData[2] && (
            <div className="text-center">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-3">
                <span className="text-lg font-bold text-foreground">
                  {leaderboardData[2].name.charAt(0)}
                </span>
              </div>
              <div className="text-4xl mb-2">🥉</div>
              <div className="font-semibold text-foreground">{leaderboardData[2].name}</div>
              <div className="text-sm text-muted-foreground">{leaderboardData[2].score} points</div>
            </div>
          )}
        </div>
      </div>

      {/* Full Leaderboard */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">
            Complete Rankings
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Rank</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Student</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Score</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Quizzes</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Avg %</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Streak</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Change</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((student, index) => (
                <tr 
                  key={student.id} 
                  className={`border-b border-border hover:bg-muted/30 transition-colors ${
                    student.name === user?.name ? 'bg-primary/5' : ''
                  }`}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">
                        {getRankIcon(student.rank) || `#${student.rank}`}
                      </span>
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-primary-foreground font-semibold text-sm">
                          {student.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{student.name}</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {student.badges.slice(0, 2).map(badge => {
                            const badgeInfo = getBadgeInfo(badge)
                            return (
                              <span
                                key={badge}
                                className={`px-2 py-0.5 rounded-full text-xs font-medium ${badgeInfo.color}`}
                                title={badgeInfo.label}
                              >
                                {badgeInfo.icon}
                              </span>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <span className="font-semibold text-foreground">
                      {student.score.toLocaleString()}
                    </span>
                  </td>
                  
                  <td className="p-4">
                    <span className="text-muted-foreground">{student.quizzesTaken}</span>
                  </td>
                  
                  <td className="p-4">
                    <span className="text-muted-foreground">{student.averageScore}%</span>
                  </td>
                  
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      {student.streak > 0 && <Zap className="w-4 h-4 text-chart-3" />}
                      <span className="text-muted-foreground">{student.streak}</span>
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      {getChangeIcon(student.change)}
                      {student.change !== 0 && (
                        <span className={`text-sm ${student.change > 0 ? 'text-chart-1' : 'text-destructive'}`}>
                          {Math.abs(student.change)}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-card rounded-xl p-6 border border-border text-center">
          <div className="w-12 h-12 bg-chart-1/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-6 h-6 text-chart-1" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">Average Score</h3>
          <div className="text-2xl font-bold text-chart-1 mb-1">89.2%</div>
          <div className="text-sm text-muted-foreground">Across all students</div>
        </div>
        
        <div className="bg-card rounded-xl p-6 border border-border text-center">
          <div className="w-12 h-12 bg-chart-2/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6 text-chart-2" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">Active Students</h3>
          <div className="text-2xl font-bold text-chart-2 mb-1">1,247</div>
          <div className="text-sm text-muted-foreground">This week</div>
        </div>
        
        <div className="bg-card rounded-xl p-6 border border-border text-center">
          <div className="w-12 h-12 bg-chart-3/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Zap className="w-6 h-6 text-chart-3" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">Longest Streak</h3>
          <div className="text-2xl font-bold text-chart-3 mb-1">42 days</div>
          <div className="text-sm text-muted-foreground">Current record</div>
        </div>
      </div>
    </div>
  )
}

export const Survey = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    targetExam: '',
    attemptYear: new Date().getFullYear() + 1,
    dailyStudyHours: 4,
    weakSubjects: [],
    strongSubjects: [],
    resourcesUsed: [],
    stressLevel: 3,
    confidenceLevel: 3
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const navigate = useNavigate()

  const totalSteps = 5

  const examOptions = [
    { id: 'JEE', name: 'JEE (Joint Entrance Examination)', icon: '🏗️' },
    { id: 'NEET', name: 'NEET (Medical Entrance)', icon: '⚕️' },
    { id: 'UPSC', name: 'UPSC Civil Services', icon: '🏛️' },
    { id: 'CAT', name: 'CAT (MBA Entrance)', icon: '💼' },
    { id: 'GATE', name: 'GATE (Engineering)', icon: '⚙️' },
    { id: 'Board', name: 'Board Exams (10th/12th)', icon: '📚' },
    { id: 'Other', name: 'Other', icon: '📖' },
  ]

  const subjectOptions = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science',
    'English', 'History', 'Geography', 'Economics', 'Political Science',
    'Psychology', 'Sociology', 'Philosophy', 'Statistics'
  ]

  const resourceOptions = [
    { id: 'YouTube', name: 'YouTube Videos', icon: '📺' },
    { id: 'Coaching', name: 'Coaching Classes', icon: '🏫' },
    { id: 'Books', name: 'Textbooks', icon: '📚' },
    { id: 'Apps', name: 'Mobile Apps', icon: '📱' },
    { id: 'Online', name: 'Online Tests', icon: '💻' },
    { id: 'Groups', name: 'Study Groups', icon: '👥' },
  ]

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      // Here you would call your API to submit the survey
      // await surveyAPI.submit(formData)
      await new Promise(resolve => setTimeout(resolve, 1000)) // Mock API call
      setIsCompleted(true)
    } catch (error) {
      console.error('Survey submission failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleArrayItem = (field, item) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item]
    }))
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Target Exam'
      case 2: return 'Study Habits'
      case 3: return 'Subject Assessment'
      case 4: return 'Learning Resources'
      case 5: return 'Wellbeing Check'
      default: return 'Survey'
    }
  }

  const getEmojiForLevel = (level, type) => {
    if (type === 'stress') {
      const stressEmojis = ['😌', '😐', '😰', '😫', '😵']
      return stressEmojis[level - 1] || '😐'
    } else {
      const confidenceEmojis = ['😞', '😕', '😐', '😊', '😎']
      return confidenceEmojis[level - 1] || '😐'
    }
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-card rounded-2xl p-8 border border-border">
            <div className="w-16 h-16 bg-chart-1/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-chart-1" />
            </div>
            
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Thank You! 🎉
            </h2>
            
            <p className="text-muted-foreground mb-6">
              Your survey has been submitted successfully. This information will help us 
              personalize your learning experience and improve our platform.
            </p>
            
            <div className="bg-muted rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-foreground mb-2">Your Summary:</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Target: {formData.targetExam}</p>
                <p>Study Hours: {formData.dailyStudyHours}h/day</p>
                <p>Stress Level: {getEmojiForLevel(formData.stressLevel, 'stress')}</p>
                <p>Confidence: {getEmojiForLevel(formData.confidenceLevel, 'confidence')}</p>
              </div>
            </div>
            
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 px-4 rounded-lg font-semibold transition-colors"
            >
              Continue to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Exam Preparation Survey
          </h1>
          <p className="text-muted-foreground">
            Help us understand your learning needs and goals
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm text-muted-foreground">{Math.round((currentStep / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-4">
            {[...Array(totalSteps)].map((_, index) => (
              <div
                key={index}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  index + 1 <= currentStep
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-card rounded-2xl p-8 border border-border">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            {getStepTitle()}
          </h2>

          {/* Step 1: Target Exam */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <p className="text-muted-foreground mb-6">
                Which exam are you preparing for?
              </p>
              <div className="grid grid-cols-1 gap-3">
                {examOptions.map(exam => (
                  <label
                    key={exam.id}
                    className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                      formData.targetExam === exam.id
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border hover:bg-muted'
                    }`}
                  >
                    <input
                      type="radio"
                      name="targetExam"
                      value={exam.id}
                      checked={formData.targetExam === exam.id}
                      onChange={(e) => updateFormData('targetExam', e.target.value)}
                      className="sr-only"
                    />
                    <span className="text-2xl">{exam.icon}</span>
                    <span className="font-medium">{exam.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Study Habits */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-4">
                  Daily Study Hours: {formData.dailyStudyHours} hours
                </label>
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={formData.dailyStudyHours}
                  onChange={(e) => updateFormData('dailyStudyHours', parseInt(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>1h</span>
                  <span>6h</span>
                  <span>12h</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Attempt Year
                </label>
                <input
                  type="number"
                  value={formData.attemptYear}
                  onChange={(e) => updateFormData('attemptYear', parseInt(e.target.value))}
                  min={new Date().getFullYear()}
                  max={new Date().getFullYear() + 5}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          )}

          {/* Step 3: Subject Assessment */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-foreground mb-3">
                  Weak Subjects (Select multiple)
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {subjectOptions.map(subject => (
                    <label
                      key={`weak-${subject}`}
                      className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                        formData.weakSubjects.includes(subject)
                          ? 'border-destructive bg-destructive/5 text-destructive'
                          : 'border-border hover:bg-muted'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.weakSubjects.includes(subject)}
                        onChange={() => toggleArrayItem('weakSubjects', subject)}
                        className="sr-only"
                      />
                      <span className="text-sm font-medium">{subject}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-foreground mb-3">
                  Strong Subjects (Select multiple)
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {subjectOptions.map(subject => (
                    <label
                      key={`strong-${subject}`}
                      className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                        formData.strongSubjects.includes(subject)
                          ? 'border-chart-1 bg-chart-1/5 text-chart-1'
                          : 'border-border hover:bg-muted'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.strongSubjects.includes(subject)}
                        onChange={() => toggleArrayItem('strongSubjects', subject)}
                        className="sr-only"
                      />
                      <span className="text-sm font-medium">{subject}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Resources */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <p className="text-muted-foreground mb-6">
                Which resources do you use for studying? (Select multiple)
              </p>
              <div className="grid grid-cols-2 gap-4">
                {resourceOptions.map(resource => (
                  <label
                    key={resource.id}
                    className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                      formData.resourcesUsed.includes(resource.id)
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border hover:bg-muted'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.resourcesUsed.includes(resource.id)}
                      onChange={() => toggleArrayItem('resourcesUsed', resource.id)}
                      className="sr-only"
                    />
                    <span className="text-xl">{resource.icon}</span>
                    <span className="font-medium">{resource.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Wellbeing */}
          {currentStep === 5 && (
            <div className="space-y-8">
              <div>
                <h3 className="font-medium text-foreground mb-4">
                  Stress Level: {getEmojiForLevel(formData.stressLevel, 'stress')}
                </h3>
                <div className="flex justify-between items-center mb-4">
                  {[1, 2, 3, 4, 5].map(level => (
                    <button
                      key={level}
                      onClick={() => updateFormData('stressLevel', level)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-colors ${
                        formData.stressLevel === level
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      {getEmojiForLevel(level, 'stress')}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Very Low</span>
                  <span>Low</span>
                  <span>Moderate</span>
                  <span>High</span>
                  <span>Very High</span>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-foreground mb-4">
                  Confidence Level: {getEmojiForLevel(formData.confidenceLevel, 'confidence')}
                </h3>
                <div className="flex justify-between items-center mb-4">
                  {[1, 2, 3, 4, 5].map(level => (
                    <button
                      key={level}
                      onClick={() => updateFormData('confidenceLevel', level)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-colors ${
                        formData.confidenceLevel === level
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      {getEmojiForLevel(level, 'confidence')}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Very Low</span>
                  <span>Low</span>
                  <span>Moderate</span>
                  <span>High</span>
                  <span>Very High</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>

            {currentStep < totalSteps ? (
              <button
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && !formData.targetExam) ||
                  (currentStep === 3 && formData.weakSubjects.length === 0 && formData.strongSubjects.length === 0) ||
                  (currentStep === 4 && formData.resourcesUsed.length === 0)
                }
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  'Complete Survey'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export const Bookmarks = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Bookmarks - Coming Soon
      </h1>
    </div>
  )
}

export const Profile = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Profile - Coming Soon
      </h1>
    </div>
  )
}

export const TeacherDashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Teacher Dashboard - Coming Soon
      </h1>
    </div>
  )
}

export const CreateQuiz = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Create Quiz - Coming Soon
      </h1>
    </div>
  )
}

export const EditQuiz = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Edit Quiz - Coming Soon
      </h1>
    </div>
  )
}

export const QuizStats = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Quiz Stats - Coming Soon
      </h1>
    </div>
  )
}

export const AdminDashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Admin Dashboard - Coming Soon
      </h1>
    </div>
  )
}

export const UserManagement = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        User Management - Coming Soon
      </h1>
    </div>
  )
}

export const SubjectManagement = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Subject Management - Coming Soon
      </h1>
    </div>
  )
}

export const SurveyAnalytics = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Survey Analytics - Coming Soon
      </h1>
    </div>
  )
}

export const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="text-center">
        <div className="text-6xl mb-4">📚</div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Page Not Found
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          The page you're looking for doesn't exist.
        </p>
        <button
          onClick={() => window.history.back()}
          className="btn-primary"
        >
          Go Back
        </button>
      </div>
    </div>
  )
}