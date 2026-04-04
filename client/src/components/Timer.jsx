import { useState, useEffect } from 'react'
import { AlertTriangle, Clock } from 'lucide-react'

export const Timer = ({ 
  initialTime, 
  onTimeUp, 
  isRunning = true, 
  showWarning = true,
  warningTime = 60,
  className = ""
}) => {
  const [timeLeft, setTimeLeft] = useState(initialTime)
  const [isWarning, setIsWarning] = useState(false)

  useEffect(() => {
    setTimeLeft(initialTime)
  }, [initialTime])

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1
        
        // Check for warning state
        if (showWarning && newTime <= warningTime && !isWarning) {
          setIsWarning(true)
        }
        
        // Time up
        if (newTime <= 0) {
          onTimeUp?.()
          return 0
        }
        
        return newTime
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isRunning, timeLeft, onTimeUp, showWarning, warningTime, isWarning])

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getTimerStyle = () => {
    if (timeLeft <= 0) {
      return "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800"
    }
    if (isWarning) {
      return "bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800 animate-pulse"
    }
    return "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
  }

  return (
    <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg border-2 font-mono text-lg font-bold transition-all duration-300 ${getTimerStyle()} ${className}`}>
      {isWarning && timeLeft > 0 ? (
        <AlertTriangle className="w-5 h-5 animate-pulse" />
      ) : (
        <Clock className="w-5 h-5" />
      )}
      <span>{formatTime(timeLeft)}</span>
    </div>
  )
}