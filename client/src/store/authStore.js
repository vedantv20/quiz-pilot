import { create } from 'zustand'
import api from '../api/axios'
import toast from 'react-hot-toast'

const AUTH_STORAGE_KEY = 'auth-storage'
const LEGACY_USER_KEY = 'user'
const LEGACY_TOKEN_KEY = 'token'

const isValidUser = (user) => {
  return Boolean(user && typeof user === 'object' && user._id && user.email)
}

const savePersistedAuth = ({ user, token, isAuthenticated }) => {
  localStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify({
      state: { user, token, isAuthenticated },
      version: 0,
    })
  )
}

const loadPersistedAuth = () => {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) {
      const legacyToken = localStorage.getItem(LEGACY_TOKEN_KEY)
      const legacyUserRaw = localStorage.getItem(LEGACY_USER_KEY)

      if (!legacyToken || !legacyUserRaw) {
        return { user: null, token: null, isAuthenticated: false }
      }

      try {
        const legacyUser = JSON.parse(legacyUserRaw)
        if (!isValidUser(legacyUser)) {
          throw new Error('Invalid legacy user')
        }

        const migrated = {
          user: legacyUser,
          token: legacyToken,
          isAuthenticated: true,
        }
        savePersistedAuth(migrated)
        localStorage.removeItem(LEGACY_USER_KEY)
        localStorage.removeItem(LEGACY_TOKEN_KEY)
        return migrated
      } catch {
        localStorage.removeItem(LEGACY_USER_KEY)
        localStorage.removeItem(LEGACY_TOKEN_KEY)
        return { user: null, token: null, isAuthenticated: false }
      }
    }

    const parsed = JSON.parse(raw)
    const state = parsed?.state
    const user = state?.user || null
    const token = state?.token || null

    if (!token || !isValidUser(user)) {
      localStorage.removeItem(AUTH_STORAGE_KEY)
      return { user: null, token: null, isAuthenticated: false }
    }

    return { user, token, isAuthenticated: true }
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    return { user: null, token: null, isAuthenticated: false }
  }
}

const clearAllAuthStorage = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY)
  localStorage.removeItem(LEGACY_USER_KEY)
  localStorage.removeItem(LEGACY_TOKEN_KEY)
}

const bootState = loadPersistedAuth()

const useAuthStore = create((set, get) => ({
  user: bootState.user,
  token: bootState.token,
  isAuthenticated: bootState.isAuthenticated,
  isLoading: false,

  login: async (credentials) => {
    try {
      set({ isLoading: true })

      const response = await api.post('/auth/login', credentials)
      const payload = response?.data?.data
      const token = payload?.token
      const user = payload?.user

      if (!token || !isValidUser(user)) {
        throw new Error('Invalid login response')
      }

      const nextState = {
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      }

      savePersistedAuth(nextState)
      set(nextState)

      toast.success(`Welcome back, ${user.name}!`)
      return { success: true, requiresOnboarding: !user.onboardingCompleted }
    } catch (error) {
      set({ isLoading: false })
      const message = error.response?.data?.message || error.message || 'Login failed'
      toast.error(message)
      return { success: false, message }
    }
  },

  register: async (userData) => {
    try {
      set({ isLoading: true })

      const response = await api.post('/auth/register', userData)
      const payload = response?.data?.data
      const token = payload?.token
      const user = payload?.user

      if (!token || !isValidUser(user)) {
        throw new Error('Invalid registration response')
      }

      const nextState = {
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      }

      savePersistedAuth(nextState)
      set(nextState)

      toast.success(`Welcome to QuizPilot, ${user.name}!`)
      return { success: true, requiresOnboarding: !user.onboardingCompleted }
    } catch (error) {
      set({ isLoading: false })
      const message = error.response?.data?.message || error.message || 'Registration failed'
      toast.error(message)
      return { success: false, message }
    }
  },

  logout: () => {
    clearAllAuthStorage()
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    })

    toast.success('Logged out successfully')
  },

  setUser: (userData) => {
    if (!isValidUser(userData)) {
      return
    }

    const current = get()
    const nextState = {
      user: userData,
      token: current.token,
      isAuthenticated: Boolean(current.token),
    }
    savePersistedAuth(nextState)
    set(nextState)
  },

  updateUser: (userData) => {
    const current = get()
    if (!isValidUser(current.user)) {
      return
    }

    const updatedUser = { ...current.user, ...userData }
    if (!isValidUser(updatedUser)) {
      return
    }

    const nextState = {
      user: updatedUser,
      token: current.token,
      isAuthenticated: Boolean(current.token),
    }
    savePersistedAuth(nextState)
    set(nextState)
  },

  initializeAuth: async () => {
    try {
      set({ isLoading: true })

      const { token, user } = get()
      if (!token || !isValidUser(user)) {
        clearAllAuthStorage()
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        })
        return { isAuthenticated: false }
      }

      set({ isAuthenticated: true })

      try {
        const response = await api.get('/auth/me')
        const freshUser = response?.data?.data

        if (!isValidUser(freshUser)) {
          throw new Error('Invalid user payload from /auth/me')
        }

        const nextState = {
          user: freshUser,
          token,
          isAuthenticated: true,
          isLoading: false,
        }
        savePersistedAuth(nextState)
        set(nextState)
        return { isAuthenticated: true, user: freshUser }
      } catch (verifyError) {
        if (verifyError.response?.status === 401) {
          clearAllAuthStorage()
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          })
          return { isAuthenticated: false, error: 'Token expired' }
        }

        set({ isLoading: false })
        return { isAuthenticated: true, user }
      }
    } catch (error) {
      clearAllAuthStorage()
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      })
      return { isAuthenticated: false, error: error.message }
    }
  },

  skipOnboarding: async () => {
    try {
      const response = await api.post('/onboarding/skip')
      const updatedUser = response?.data?.data?.user

      if (!isValidUser(updatedUser)) {
        throw new Error('Invalid onboarding response')
      }

      get().setUser(updatedUser)
      return { success: true, user: updatedUser }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to skip onboarding'
      toast.error(message)
      return { success: false, message }
    }
  },

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

  needsOnboarding: () => {
    const user = get().user
    return user && !user.onboardingCompleted
  },
}))

export { useAuthStore }
export default useAuthStore
