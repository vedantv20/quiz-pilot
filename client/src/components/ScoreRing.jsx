export const ScoreRing = ({ 
  score, 
  maxScore = 100, 
  size = 120, 
  strokeWidth = 8, 
  showLabel = true,
  className = ""
}) => {
  const percentage = Math.min(Math.max((score / maxScore) * 100, 0), 100)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const getColor = (percent) => {
    if (percent >= 80) return '#10b981' // green-500
    if (percent >= 60) return '#f59e0b' // amber-500
    if (percent >= 40) return '#f97316' // orange-500
    return '#ef4444' // red-500
  }

  const color = getColor(percentage)

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg 
        width={size} 
        height={size} 
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-200 dark:text-gray-700"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span 
            className="text-2xl font-bold"
            style={{ color }}
          >
            {Math.round(percentage)}%
          </span>
          <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
            {score}/{maxScore}
          </span>
        </div>
      )}
    </div>
  )
}