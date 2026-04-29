import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  BookOpen, 
  Trophy, 
  BarChart3, 
  Users, 
  Settings,
  Sun,
  Moon,
  Home,
  FileText,
  Bookmark,
  PlusCircle
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains('dark')
  })
  const { user, logout, isAdmin, isTeacherOrAdmin } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()
  const roleHome = user?.role === 'teacher' || user?.role === 'admin' ? '/teacher' : '/dashboard'

  const toggleDarkMode = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    
    if (newTheme) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  const studentLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: Home },
    { to: '/subjects', label: 'Subjects', icon: BookOpen },
    { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { to: '/survey', label: 'Survey', icon: FileText },
    { to: '/bookmarks', label: 'Bookmarks', icon: Bookmark },
  ]

  const teacherLinks = [
    { to: '/teacher', label: 'Teacher Dashboard', icon: BarChart3 },
    { to: '/teacher/quiz/new', label: 'Create Quiz', icon: PlusCircle },
  ]

  const adminLinks = [
    { to: '/admin', label: 'Admin Panel', icon: Settings },
    { to: '/admin/users', label: 'Users', icon: Users },
    { to: '/admin/subjects', label: 'Subjects', icon: BookOpen },
    { to: '/admin/surveys', label: 'Analytics', icon: BarChart3 },
    { to: '/admin/quizzes', label: 'Quizzes', icon: BookOpen },
  ]

  const primaryLinks = user?.role === 'student' ? studentLinks : user?.role === 'admin' ? adminLinks : teacherLinks

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={roleHome} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent-foreground rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-primary-foreground font-bold text-sm">QP</span>
            </div>
            <span className="font-bold text-xl text-foreground">
              QuizPilot
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {primaryLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(to)
                    ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                <Icon size={16} />
                <span>{label}</span>
              </Link>
            ))}

            {user?.role === 'student' && isTeacherOrAdmin() && (
              <>
                <div className="h-4 w-px bg-border mx-2" />
                {teacherLinks.map(({ to, label, icon: Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(to)
                        ? 'bg-primary/10 text-primary dark:bg-primary/20'
                        : 'text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{label}</span>
                  </Link>
                ))}
              </>
            )}

            {/* Admin Navigation */}
            {isAdmin() && user?.role === 'student' && (
              <>
                <div className="h-4 w-px bg-border mx-2" />
                {adminLinks.map(({ to, label, icon: Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(to)
                        ? 'bg-primary/10 text-primary dark:bg-primary/20'
                        : 'text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{label}</span>
                  </Link>
                ))}
              </>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
            className="p-2 rounded-md text-muted-foreground hover:bg-muted transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* User Menu */}
            <div className="relative">
              <div className="flex items-center space-x-3">
                {/* User Avatar */}
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-muted transition-colors"
                >
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-primary-foreground text-sm font-medium">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-sm font-medium text-foreground">
                      {user?.name}
                    </div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {user?.role}
                    </div>
                  </div>
                </Link>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-md text-muted-foreground hover:bg-muted transition-colors"
                  aria-label="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-md text-muted-foreground hover:bg-muted"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
            <div className="md:hidden py-4 border-t border-border">
            <div className="space-y-1">
              {primaryLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                    isActive(to)
                      ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary'
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </Link>
              ))}

              {user?.role === 'student' && isTeacherOrAdmin() && (
                <>
                  <div className="border-t border-border my-2" />
                  {teacherLinks.map(({ to, label, icon: Icon }) => (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                        isActive(to)
                          ? 'bg-primary/10 text-primary dark:bg-primary/20'
                          : 'text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon size={16} />
                      <span>{label}</span>
                    </Link>
                  ))}
                </>
              )}

              {/* Admin Links */}
              {isAdmin() && user?.role === 'student' && (
                <>
                  <div className="border-t border-border my-2" />
                  {adminLinks.map(({ to, label, icon: Icon }) => (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                        isActive(to)
                          ? 'bg-primary/10 text-primary dark:bg-primary/20'
                          : 'text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon size={16} />
                      <span>{label}</span>
                    </Link>
                  ))}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}


