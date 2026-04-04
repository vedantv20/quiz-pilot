import { Link } from 'react-router-dom'
import { 
  ArrowRight, 
  BookOpen, 
  Trophy, 
  BarChart3, 
  Users, 
  Star, 
  CheckCircle,
  Play,
  Target,
  Award
} from 'lucide-react'

export const Landing = () => {
  const subjects = [
    { name: 'Mathematics', icon: '➕', count: '150+ Quizzes', color: 'bg-blue-100 text-blue-600' },
    { name: 'Physics', icon: '⚛️', count: '120+ Quizzes', color: 'bg-purple-100 text-purple-600' },
    { name: 'Chemistry', icon: '🧪', count: '100+ Quizzes', color: 'bg-green-100 text-green-600' },
    { name: 'Biology', icon: '🧬', count: '80+ Quizzes', color: 'bg-red-100 text-red-600' },
    { name: 'Computer Science', icon: '💻', count: '90+ Quizzes', color: 'bg-indigo-100 text-indigo-600' },
    { name: 'History', icon: '📜', count: '60+ Quizzes', color: 'bg-yellow-100 text-yellow-600' },
  ]

  const features = [
    {
      icon: Target,
      title: 'Adaptive Learning',
      description: 'AI-powered quizzes that adapt to your learning style and track your progress.'
    },
    {
      icon: Trophy,
      title: 'Gamification',
      description: 'Earn badges, maintain streaks, and climb the leaderboard to stay motivated.'
    },
    {
      icon: BarChart3,
      title: 'Detailed Analytics',
      description: 'Get insights into your performance with comprehensive analytics and reports.'
    },
    {
      icon: Users,
      title: 'Community Learning',
      description: 'Join thousands of students and compete in a friendly learning environment.'
    }
  ]

  const steps = [
    {
      step: '01',
      title: 'Sign Up & Choose Your Path',
      description: 'Create your account and select your target exam or subject area.',
      icon: '🚀'
    },
    {
      step: '02',
      title: 'Take Assessment & Practice',
      description: 'Start with quizzes tailored to your level and practice regularly.',
      icon: '📝'
    },
    {
      step: '03',
      title: 'Track Progress & Excel',
      description: 'Monitor your improvement and achieve your exam goals.',
      icon: '📈'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'JEE Aspirant',
      content: 'QuizPilot helped me identify my weak areas and improved my scores by 40%!',
      rating: 5
    },
    {
      name: 'Raj Patel',
      role: 'NEET Student',
      content: 'The detailed explanations and adaptive learning made all the difference.',
      rating: 5
    },
    {
      name: 'Emily Chen',
      role: 'College Student',
      content: 'Best platform for exam preparation. The analytics are incredibly helpful.',
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-violet-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">QP</span>
              </div>
              <span className="font-bold text-xl text-gray-900 dark:text-white">QuizPilot</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn-primary"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Master Your Exams with{' '}
              <span className="bg-gradient-to-r from-primary-600 to-violet-600 bg-clip-text text-transparent">
                Smart Practice
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              QuizPilot is the ultimate online quiz and exam practice platform. 
              Practice with realistic questions, track your progress, and ace your exams with confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="btn-primary text-lg px-8 py-3 flex items-center justify-center space-x-2"
              >
                <span>Start Learning Free</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <button className="btn-secondary text-lg px-8 py-3 flex items-center justify-center space-x-2">
                <Play className="h-5 w-5" />
                <span>Watch Demo</span>
              </button>
            </div>
          </div>

          {/* Hero Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">10,000+</div>
              <div className="text-gray-600 dark:text-gray-400">Active Students</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">500+</div>
              <div className="text-gray-600 dark:text-gray-400">Practice Quizzes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">95%</div>
              <div className="text-gray-600 dark:text-gray-400">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">4.9★</div>
              <div className="text-gray-600 dark:text-gray-400">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose QuizPilot?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Powerful features designed to accelerate your learning and help you achieve exam success.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg mb-4">
                  <feature.icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Get started in three simple steps and begin your journey to exam success.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-violet-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto">
                    {step.step}
                  </div>
                  <div className="text-4xl mt-4">{step.icon}</div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
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

      {/* Subjects Preview */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Explore Our Subjects
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Practice across multiple subjects with thousands of carefully crafted questions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject, index) => (
              <div key={index} className="card hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-lg ${subject.color} flex items-center justify-center text-2xl`}>
                    {subject.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {subject.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {subject.count}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/register" className="btn-primary">
              Start Practicing Now
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Students Say
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Join thousands of successful students who achieved their goals with QuizPilot.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Survey CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-violet-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">
              Help Us Personalize Your Learning
            </h2>
            <p className="text-primary-100 mb-8 text-lg">
              Take our quick survey to help us understand your study habits and create 
              a personalized learning experience just for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-primary-600 hover:bg-gray-100 font-medium px-8 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <span>Join & Take Survey</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-violet-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">QP</span>
                </div>
                <span className="font-bold text-xl">QuizPilot</span>
              </div>
              <p className="text-gray-300 text-sm">
                The ultimate online quiz and exam practice platform for students worldwide.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link to="/register" className="hover:text-white">Sign Up</Link></li>
                <li><Link to="/login" className="hover:text-white">Sign In</Link></li>
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Community</a></li>
                <li><a href="#" className="hover:text-white">Feedback</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-300">
            <p>&copy; 2024 QuizPilot. All rights reserved. Built for students, by educators.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
