/**
 * Minimal loader component for QuizPilot
 */

export const Loader = ({ size = 'default', className = '' }) => {
  const sizeClasses = {
    small: 'w-5 h-5',
    default: 'w-8 h-8',
    large: 'w-12 h-12'
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizeClasses[size]} relative`}>
        <div className="absolute inset-0 rounded-full border-2 border-primary/20"></div>
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin"></div>
      </div>
    </div>
  )
}

export const PageLoader = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader size="large" />
        <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>
      </div>
    </div>
  )
}

export const InlineLoader = ({ text = 'Loading...' }) => {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="flex items-center gap-3">
        <Loader size="small" />
        <span className="text-sm text-muted-foreground">{text}</span>
      </div>
    </div>
  )
}

export default Loader
