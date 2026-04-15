import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from './store/authStore'
import { Navbar } from './components/Navbar'
import { ProtectedRoute } from './components/ProtectedRoute'
import { PageLoader } from './components/Loader'

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
  NotFound,
} from './pages/index'

const AppLayout = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  )
}

function App() {
  const { initializeAuth, isLoading, isAuthenticated } = useAuthStore()

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

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
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Landing />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} />

        <Route
          path="/onboarding"
          element={
            <ProtectedRoute skipOnboardingCheck>
              <Onboarding />
            </ProtectedRoute>
          }
        />

        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
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

          <Route
            path="/teacher"
            element={
              <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/quiz/new"
            element={
              <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                <CreateQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/quiz/:id/edit"
            element={
              <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                <EditQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/quiz/:quizId/question/new"
            element={
              <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                <NewQuestion />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/quiz/:id/stats"
            element={
              <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                <QuizStats />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/subjects"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <SubjectManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/surveys"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <SurveyAnalytics />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
