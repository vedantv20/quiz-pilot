import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export const SubjectChart = ({ 
  data = [], 
  className = "",
  title = "Performance by Subject"
}) => {
  // Transform data for recharts
  const chartData = data.map(item => ({
    subject: item.subject?.name || item.name || 'Unknown',
    score: item.averageScore || item.score || 0,
    attempts: item.attempts || 0,
    accuracy: item.accuracy || 0
  }))

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card text-card-foreground p-3 rounded-lg shadow-lg border border-border">
          <p className="font-medium text-foreground">{label}</p>
          <p className="text-primary">
            Score: {payload[0].value}%
          </p>
          {payload[0].payload.attempts > 0 && (
            <p className="text-muted-foreground text-sm">
              Attempts: {payload[0].payload.attempts}
            </p>
          )}
        </div>
      )
    }
    return null
  }

  if (!chartData.length) {
    return (
      <div className={`surface-card ${className}`}>
        <h3 className="text-lg font-semibold text-foreground mb-4">
          {title}
        </h3>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <p className="text-muted-foreground">No data available</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`surface-card ${className}`}>
      <h3 className="text-lg font-semibold text-foreground mb-4">
        {title}
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="subject" 
              tick={{ fontSize: 12 }}
              className="text-muted-foreground"
            />
            <YAxis 
              domain={[0, 100]}
              tick={{ fontSize: 12 }}
              className="text-muted-foreground"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey="score" 
              name="Score (%)"
              fill="#7c3aed"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}


