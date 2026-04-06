import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../api/axios'
import toast from 'react-hot-toast'

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      // Actions
      login: async (credentials) => {
        try {
          set({ isLoading: true })
          
          const response = await api.post('/auth/login', credentials)
          const { token, user } = response.data.data

          // Store token and user
          localStorage.setItem('token', token)
          localStorage.setItem('user', JSON.stringify(user))

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          })

          toast.success(`Welcome back, ${user.name}!`)
          return { success: true, requiresOnboarding: !user.onboardingCompleted }
        } catch (error) {
          set({ isLoading: false })
          const message = error.response?.data?.message || 'Login failed'
          toast.error(message)
          return { success: false, message }
        }
      },

      register: async (userData) => {
        try {
          set({ isLoading: true })
          
          const response = await api.post('/auth/register', userData)
          const { token, user } = response.data.data

          // Store token and user
          localStorage.setItem('token', token)
          localStorage.setItem('user', JSON.stringify(user))

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          })

          toast.success(`Welcome to QuizPilot, ${user.name}!`)
          return { success: true, requiresOnboarding: !user.onboardingCompleted }
        } catch (error) {
          set({ isLoading: false })
          const message = error.response?.data?.message || 'Registration failed'
          toast.error(message)
          return { success: false, message }
        }
      },

      logout: () => {
        // Clear storage
        localStorage.removeItem('token')
        localStorage.removeItem('user')

        // Clear state
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        })

        toast.success('Logged out successfully')
      },

      setUser: (userData) => {
        localStorage.setItem('user', JSON.stringify(userData))
        set({ user: userData })
      },

      updateUser: (userData) => {
        const updatedUser = { ...get().user, ...userData }
        localStorage.setItem('user', JSON.stringify(updatedUser))
        set({ user: updatedUser })
      },

      initializeAuth: async () => {
        try {
          set({ isLoading: true })
          
          const token = localStorage.getItem('token')
          const userData = localStorage.getItem('user')

          if (!token || !userData) {
            set({ 
              isLoading: false,
              isAuthenticated: false,
              user: null,
              token: null
            })
            return { isAuthenticated: false }
          }

          // Verify token with backend
          const response = await api.get('/auth/me')
          const user = response.data.data

          // Update localStorage with fresh user data from server
          localStorage.setItem('user', JSON.stringify(user))

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          })
          
          return { isAuthenticated: true, user }
        } catch (error) {
          console.error('Auth initialization failed:', error)
          // Token is invalid, clear everything
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          })
          return { isAuthenticated: false, error: error.message }
        }
      },

      // Skip onboarding helper
      skipOnboarding: async () => {
        try {
          const response = await api.post('/onboarding/skip')
          const updatedUser = response.data.data.user
          
          // Update both localStorage and state
          localStorage.setItem('user', JSON.stringify(updatedUser))
          set({ user: updatedUser })
          
          return { success: true, user: updatedUser }
        } catch (error) {
          const message = error.response?.data?.message || 'Failed to skip onboarding'
          toast.error(message)
          return { success: false, message }
        }
      },

      // Helper methods
      hasRole: (role) => {
        const user = get().user
        return user?.role === role
      },

      hasAnyRole: (roles) => {
        const user = get().user
        return roles.includes(user?.role)
      },

      isStudent: () => get().hasRole('student'),
      isTeacher: () => get().hasRole('teacher'),
      isAdmin: () => get().hasRole('admin'),
      isTeacherOrAdmin: () => get().hasAnyRole(['teacher', 'admin']),
      
      // Check if user needs onboarding
      needsOnboarding: () => {
        const user = get().user
        return user && !user.onboardingCompleted
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

export { useAuthStore }
export default useAuthStore