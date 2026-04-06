import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from './store/authStore'
import { Navbar } from './components/Navbar'
import { ProtectedRoute } from './components/ProtectedRoute'
import { PageLoader } from './components/Loader'

// Public pages
import { 
  Landing,
  Login,
  Register,
  Dashboard,
  Subjects,
  SubjectDetail,
  QuizDetail,
  QuizAttempt,
  QuizResult,
  Leaderboard,
  Survey,
  Bookmarks,
  Profile,
  Onboarding,
  TeacherDashboard,
  CreateQuiz,
  EditQuiz,
  NewQuestion,
  QuizStats,
  AdminDashboard,
  UserManagement,
  SubjectManagement,
  SurveyAnalytics,
  NotFound
} from './pages/index'

function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const { initializeAuth, user, isLoading, isAuthenticated, token } = useAuthStore()

  // Initialize auth on app load
  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  // Handle auth state changes and redirect if needed
  useEffect(() => {
    // Only handle redirects after auth is initialized (not loading)
    if (isLoading) return

    console.log('Auth state check:', { 
      isAuthenticated, 
      user: user ? { 
        name: user.name, 
        onboardingCompleted: user.onboardingCompleted 
      } : null, 
      currentPath: location.pathname 
    })

    // CRITICAL: If isAuthenticated is true but user is null, this is an invalid state
    // Clear auth and let the system re-initialize
    if (isAuthenticated && !user) {
      console.error('Invalid auth state: isAuthenticated=true but user=null, clearing auth')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('auth-storage')
      // Force a reload to restart the auth flow
      window.location.reload()
      return
    }

    // If not authenticated and on a protected route, stay on current route
    // ProtectedRoute will handle the redirect to login
    if (!isAuthenticated) {
      const isProtectedRoute = !['/login', '/register', '/', '/onboarding'].includes(location.pathname)
      if (isProtectedRoute) {
        // Don't redirect here - let ProtectedRoute handle it
        return
      }
    }

    // If authenticated, handle onboarding flow
    if (isAuthenticated && user) {
      const isOnAuthPage = ['/login', '/register', '/'].includes(location.pathname)
      const isOnOnboardingPage = location.pathname === '/onboarding'
      const needsOnboarding = !user.onboardingCompleted

      console.log('Onboarding check:', { 
        needsOnboarding, 
        isOnOnboardingPage, 
        isOnAuthPage,
        onboardingCompleted: user.onboardingCompleted 
      })

      if (needsOnboarding && !isOnOnboardingPage) {
        console.log('Redirecting to onboarding')
        navigate('/onboarding', { replace: true })
      } else if (!needsOnboarding && (isOnAuthPage || isOnOnboardingPage)) {
        console.log('Redirecting to dashboard')
        navigate('/dashboard', { replace: true })
      }
    }
  }, [isAuthenticated, user, location.pathname, navigate, isLoading])

  // Initialize dark mode based on localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  if (isLoading) {
    return <PageLoader />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Routes>
        {/* Public routes */}
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Landing />} 
        />
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} 
        />

        {/* Onboarding route - protected but without navbar */}
        <Route path="/onboarding" element={
          <ProtectedRoute skipOnboardingCheck={true}>
            <Onboarding />
          </ProtectedRoute>
        } />

        {/* Protected routes with navbar */}
        <Route path="/*" element={
          <ProtectedRoute>
            <div className="min-h-screen">
              <Navbar />
              <main className="pt-16">
                <Routes>
                  {/* Student routes */}
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/subjects" element={<Subjects />} />
                  <Route path="/subjects/:id" element={<SubjectDetail />} />
                  <Route path="/quiz/:id" element={<QuizDetail />} />
                  <Route path="/quiz/:id/attempt" element={<QuizAttempt />} />
                  <Route path="/quiz/:id/result" element={<QuizResult />} />
                  <Route path="/leaderboard" element={<Leaderboard />} />
                  <Route path="/survey" element={<Survey />} />
                  <Route path="/bookmarks" element={<Bookmarks />} />
                  <Route path="/profile" element={<Profile />} />

                  {/* Teacher routes */}
                  <Route path="/teacher" element={
                    <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                      <TeacherDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/teacher/quiz/new" element={
                    <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                      <CreateQuiz />
                    </ProtectedRoute>
                  } />
                  <Route path="/teacher/quiz/:id/edit" element={
                    <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                      <EditQuiz />
                    </ProtectedRoute>
                  } />
                  <Route path="/teacher/quiz/:quizId/question/new" element={
                    <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                      <NewQuestion />
                    </ProtectedRoute>
                  } />
                  <Route path="/teacher/quiz/:id/stats" element={
                    <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                      <QuizStats />
                    </ProtectedRoute>
                  } />

                  {/* Admin routes */}
                  <Route path="/admin" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/users" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <UserManagement />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/subjects" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <SubjectManagement />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/surveys" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <SurveyAnalytics />
                    </ProtectedRoute>
                  } />

                  {/* 404 fallback */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  )
}

export default App