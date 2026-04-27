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
          <p className="text-primary font-semibold">
            Score: {payload[0].value}%
          </p>
          {payload[0].payload.attempts > 0 && (
            <p className="text-muted-foreground text-sm mt-1">
              Based on {payload[0].payload.attempts} attempt{payload[0].payload.attempts > 1 ? 's' : ''}
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
        <div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground mb-4">Average score percentage per subject</p>
        </div>
        <div className="flex items-center justify-center h-64 bg-muted/20 rounded-lg border border-dashed border-border">
          <div className="text-center">
            <div className="text-4xl mb-2 opacity-50">📊</div>
            <p className="text-muted-foreground font-medium">No performance data yet</p>
            <p className="text-sm text-muted-foreground/70 mt-1">Complete a quiz to see your stats here</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`surface-card flex flex-col ${className}`}>
      <div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground mb-6">Average score percentage per subject</p>
      </div>
      <div className="h-64 mt-auto">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" className="opacity-50" />
            <XAxis 
              dataKey="subject" 
              tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis 
              domain={[0, 100]}
              tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              dx={-10}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--muted)', opacity: 0.4 }} />
            <Bar 
              dataKey="score" 
              name="Average Score"
              fill="var(--primary)"
              radius={[4, 4, 0, 0]}
              maxBarSize={48}
              animationDuration={1000}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}



