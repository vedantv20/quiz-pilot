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
        set({ 
          user: userData,
          isAuthenticated: true  // Ensure we stay authenticated
        })
      },

      updateUser: (userData) => {
        const updatedUser = { ...get().user, ...userData }
        localStorage.setItem('user', JSON.stringify(updatedUser))
        set({ 
          user: updatedUser,
          isAuthenticated: true  // Ensure we stay authenticated
        })
      },

      initializeAuth: async () => {
        try {
          set({ isLoading: true })
          
          const token = localStorage.getItem('token')
          const userData = localStorage.getItem('user')

          // If either token or user data is missing, clear everything
          if (!token || !userData) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            localStorage.removeItem('auth-storage')
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
            // Validate that user object has required properties
            if (!user || !user._id || !user.email) {
              throw new Error('Invalid user data structure')
            }
          } catch (error) {
            console.error('Invalid user data in localStorage:', error)
            // Invalid JSON or data structure in localStorage, clear everything
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            localStorage.removeItem('auth-storage')
            set({ 
              isLoading: false,
              isAuthenticated: false,
              user: null,
              token: null
            })
            return { isAuthenticated: false }
          }

          // CRITICAL: Only set isAuthenticated=true if we have both valid token AND user
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          })

          console.log('Auth initialized with:', { user: user.name, isAuthenticated: true })

          // Then verify token with backend in background
          try {
            const response = await api.get('/auth/me')
            const freshUser = response.data.data

            // Only update if there are differences
            if (JSON.stringify(user) !== JSON.stringify(freshUser)) {
              console.log('Updating user data from server')
              localStorage.setItem('user', JSON.stringify(freshUser))
              set({ user: freshUser })
            }
          } catch (verifyError) {
            // If verification fails, clear auth but don't throw
            console.warn('Token verification failed:', verifyError)
            
            // Only clear auth if it's actually an auth error (401)
            if (verifyError.response?.status === 401) {
              console.log('Token expired, clearing auth')
              localStorage.removeItem('token')
              localStorage.removeItem('user')
              localStorage.removeItem('auth-storage')
              set({
                user: null,
                token: null,
                isAuthenticated: false,
              })
              return { isAuthenticated: false, error: 'Token expired' }
            }
            // For other errors (network, etc), keep user logged in with local data
            console.log('Network error during verification, keeping local auth')
          }
          
          return { isAuthenticated: true, user }
        } catch (error) {
          console.error('Auth initialization failed:', error)
          // Clear everything on any error
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          localStorage.removeItem('auth-storage')
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
        console.log('Rehydrating auth state:', state)
        // Sync with localStorage after rehydration and validate consistency
        if (state) {
          const token = localStorage.getItem('token')
          const userData = localStorage.getItem('user')
          
          // If localStorage is missing data, clear persisted state
          if (!token || !userData) {
            console.log('localStorage missing auth data, clearing persisted state')
            state.user = null
            state.token = null
            state.isAuthenticated = false
            return
          }

          try {
            const user = JSON.parse(userData)
            // Validate user object structure
            if (!user || !user._id || !user.email) {
              throw new Error('Invalid user structure')
            }
            
            // Only set authenticated if we have both valid token and user
            state.user = user
            state.token = token
            state.isAuthenticated = true
            console.log('Auth state rehydrated successfully:', { user: user.name })
          } catch (error) {
            console.error('Invalid auth data during rehydration:', error)
            // Invalid data, clear everything
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            localStorage.removeItem('auth-storage')
            state.user = null
            state.token = null
            state.isAuthenticated = false
          }
        }
      },
    }
  )
)

export { useAuthStore }
export default useAuthStore