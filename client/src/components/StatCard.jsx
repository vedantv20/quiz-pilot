import React from 'react';

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
      primary: 'bg-primary/15 text-primary',
      success: 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400',
      warning: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/40 dark:text-yellow-400',
      danger: 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400',
      info: 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400',
      gray: 'bg-muted text-muted-foreground',
    }
    return colors[colorName] || colors.primary
  }

  const getTrendColor = (trendValue) => {
    if (trendValue > 0) return 'text-green-600 dark:text-green-400'
    if (trendValue < 0) return 'text-red-600 dark:text-red-400'
    return 'text-muted-foreground'
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
    <div className={`surface-card ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-foreground mb-1">
            {formatValue(value)}
          </p>
          {subtitle && (
            <p className="text-sm text-muted-foreground">
              {subtitle}
            </p>
          )}
          {trend !== undefined && (
            <div className="flex items-center space-x-1 mt-2">
              <span className={`text-sm font-medium ${getTrendColor(trend)}`}>
                {trend > 0 ? '+' : ''}{trend}%
              </span>
              {trendLabel && (
                <span className="text-xs text-muted-foreground">
                  {trendLabel}
                </span>
              )}
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg ${getColorClasses(color)}`}>
            {typeof Icon === 'function' || typeof Icon === 'object' && Icon.$$typeof ? (
              // If Icon is a React component type or element
              React.isValidElement(Icon) ? (
                Icon
              ) : (
                <Icon className="w-6 h-6" />
              )
            ) : (
              Icon
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default StatCard


