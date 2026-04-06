import axios from 'axios'
import toast from 'react-hot-toast'

// Get base URL from environment or use default
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create axios instance
const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle network errors
    if (!error.response) {
      toast.error('Network error. Please check your connection.')
      return Promise.reject(error)
    }

    const { status, data } = error.response

    // Handle authentication errors
    if (status === 401) {
      // Clear auth data from both localStorage and store
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('auth-storage') // Zustand persist storage
      
      // Only redirect if not already on login page to prevent loops
      const currentPath = window.location.pathname
      if (currentPath !== '/login' && currentPath !== '/register' && currentPath !== '/') {
        toast.error('Session expired. Please login again.')
        // Use replace to prevent back button issues
        window.location.replace('/login')
      }
      
      return Promise.reject(error)
    }

    // Handle other errors with toast notifications
    const message = data?.message || 'An unexpected error occurred'
    
    switch (status) {
      case 400:
        // Don't show toast for validation errors in forms
        if (!data?.errors) {
          toast.error(message)
        }
        break
      case 403:
        toast.error('Access denied. Insufficient permissions.')
        break
      case 404:
        // Only show for non-silent requests
        if (!error.config?.silent) {
          toast.error('Resource not found.')
        }
        break
      case 422:
        // Validation errors - let components handle these
        break
      case 500:
        toast.error('Server error. Please try again later.')
        break
      default:
        if (status >= 500) {
          toast.error('Server error. Please try again later.')
        } else {
          toast.error(message)
        }
    }

    return Promise.reject(error)
  }
)

export default api