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

        // Force clear Zustand persistence
        localStorage.removeItem('auth-storage')

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

          let user
          try {
            user = JSON.parse(userData)
          } catch {
            // Invalid JSON in localStorage, clear it
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            set({ 
              isLoading: false,
              isAuthenticated: false,
              user: null,
              token: null
            })
            return { isAuthenticated: false }
          }

          // Set state immediately with localStorage data to prevent redirect loops
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          })

          // Then verify token with backend in background
          try {
            const response = await api.get('/auth/me')
            const freshUser = response.data.data

            // Only update if there are differences
            if (JSON.stringify(user) !== JSON.stringify(freshUser)) {
              localStorage.setItem('user', JSON.stringify(freshUser))
              set({ user: freshUser })
            }
          } catch (verifyError) {
            // If verification fails, clear auth but don't throw
            console.warn('Token verification failed:', verifyError)
            
            // Only clear auth if it's actually an auth error (401)
            if (verifyError.response?.status === 401) {
              localStorage.removeItem('token')
              localStorage.removeItem('user')
              set({
                user: null,
                token: null,
                isAuthenticated: false,
              })
              return { isAuthenticated: false, error: 'Token expired' }
            }
            // For other errors (network, etc), keep user logged in
          }
          
          return { isAuthenticated: true, user }
        } catch (error) {
          console.error('Auth initialization failed:', error)
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
      onRehydrateStorage: () => (state) => {
        // Sync with localStorage after rehydration
        if (state) {
          const token = localStorage.getItem('token')
          const userData = localStorage.getItem('user')
          
          if (!token || !userData) {
            // Clear persisted state if localStorage is empty
            state.user = null
            state.token = null
            state.isAuthenticated = false
          } else {
            try {
              const user = JSON.parse(userData)
              state.user = user
              state.token = token
              state.isAuthenticated = true
            } catch {
              // Invalid data, clear everything
              localStorage.removeItem('token')
              localStorage.removeItem('user')
              state.user = null
              state.token = null
              state.isAuthenticated = false
            }
          }
        }
      },
    }
  )
)

export { useAuthStore }
export default useAuthStore