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
  const { initializeAuth, isLoading, isAuthenticated, user } = useAuthStore()
  const roleHome = user?.role === 'admin' ? '/admin' : user?.role === 'teacher' ? '/teacher' : '/dashboard'

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
        <Route path="/" element={isAuthenticated ? <Navigate to={roleHome} replace /> : <Landing />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to={roleHome} replace /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to={roleHome} replace /> : <Register />} />

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
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/subjects"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <Subjects />
              </ProtectedRoute>
            }
          />
          <Route
            path="/subjects/:id"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <SubjectDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz/:id"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <QuizDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz/:id/attempt"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <QuizAttempt />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz/:id/result"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <QuizResult />
              </ProtectedRoute>
            }
          />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route
            path="/survey"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <Survey />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookmarks"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <Bookmarks />
              </ProtectedRoute>
            }
          />
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

            {/* Admin Quizzes Routes (same components, different URLs) */}
            <Route
              path="/admin/quizzes"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <TeacherDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/quizzes/new"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <CreateQuiz />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/quizzes/:id/edit"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <EditQuiz />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/quizzes/:quizId/question/new"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <NewQuestion />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/quizzes/:id/stats"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
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
