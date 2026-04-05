export const BadgeChip = ({ 
  variant = 'default', 
  size = 'sm',
  children, 
  className = "",
  ...props 
}) => {
  const getVariantClasses = (variant) => {
    const variants = {
      default: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
      primary: 'bg-primary/10 text-primary dark:bg-primary/20',
      success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      danger: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      hard: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      student: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      teacher: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      admin: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    }
    return variants[variant] || variants.default
  }

  const getSizeClasses = (size) => {
    const sizes = {
      xs: 'px-2 py-0.5 text-xs',
      sm: 'px-2.5 py-0.5 text-xs',
      md: 'px-3 py-1 text-sm',
      lg: 'px-4 py-1 text-base',
    }
    return sizes[size] || sizes.sm
  }

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${getVariantClasses(variant)} ${getSizeClasses(size)} ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}

export default BadgeChip
