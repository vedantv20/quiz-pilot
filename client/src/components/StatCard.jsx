export const StatCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  trendLabel,
  color = 'primary',
  className = ""
}) => {
  const getColorClasses = (colorName) => {
    const colors = {
      primary: 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400',
      success: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400',
      warning: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400',
      danger: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400',
      info: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400',
      gray: 'bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-400',
    }
    return colors[colorName] || colors.primary
  }

  const getTrendColor = (trendValue) => {
    if (trendValue > 0) return 'text-green-600 dark:text-green-400'
    if (trendValue < 0) return 'text-red-600 dark:text-red-400'
    return 'text-gray-600 dark:text-gray-400'
  }

  const formatValue = (val) => {
    if (typeof val === 'number') {
      if (val >= 1000000) {
        return `${(val / 1000000).toFixed(1)}M`
      }
      if (val >= 1000) {
        return `${(val / 1000).toFixed(1)}K`
      }
      return val.toLocaleString()
    }
    return val
  }

  return (
    <div className={`card ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {formatValue(value)}
          </p>
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-500">
              {subtitle}
            </p>
          )}
          {trend !== undefined && (
            <div className="flex items-center space-x-1 mt-2">
              <span className={`text-sm font-medium ${getTrendColor(trend)}`}>
                {trend > 0 ? '+' : ''}{trend}%
              </span>
              {trendLabel && (
                <span className="text-xs text-gray-500 dark:text-gray-500">
                  {trendLabel}
                </span>
              )}
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg ${getColorClasses(color)}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  )
}