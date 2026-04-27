import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export const TrendChart = ({ 
  data = [], 
  className = "",
  title = "Score Trend"
}) => {
  // Transform data for recharts
  const chartData = data.map((item, index) => ({
    name: item.quiz?.title || `Quiz ${index + 1}`,
    score: item.percentage || 0,
    date: new Date(item.completedAt).toLocaleDateString(),
    time: Math.round((item.timeTaken || 0) / 60)
  }))

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-card text-card-foreground p-3 rounded-lg shadow-lg border border-border">
          <p className="font-medium text-foreground text-sm max-w-[200px] truncate" title={data.name}>
            {data.name}
          </p>
          <div className="flex flex-col gap-1 mt-2">
            <p className="text-primary font-semibold">
              Score: {payload[0].value}%
            </p>
            <p className="text-muted-foreground text-xs">
              Date: {data.date}
            </p>
            {data.time > 0 && (
              <p className="text-muted-foreground text-xs">
                Time: {data.time} mins
              </p>
            )}
          </div>
        </div>
      )
    }
    return null
  }

  if (!chartData.length) {
    return (
      <div className={`surface-card flex flex-col ${className}`}>
        <div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground mb-4">Progress over your last 10 attempts</p>
        </div>
        <div className="flex items-center justify-center h-64 bg-muted/20 rounded-lg border border-dashed border-border mt-auto">
          <div className="text-center">
            <div className="text-4xl mb-2 opacity-50">📈</div>
            <p className="text-muted-foreground font-medium">No trend data yet</p>
            <p className="text-sm text-muted-foreground/70 mt-1">Take more quizzes to see your progress</p>
          </div>
        </div>
      </div>
    )
  }

  // If only one data point, recharts LineChart doesn't render a line well. Let's duplicate it for visual purposes or just show a dot.
  // Actually Recharts can handle 1 point but it just shows a dot, which is fine.

  return (
    <div className={`surface-card flex flex-col ${className}`}>
      <div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground mb-6">Progress over your last 10 attempts</p>
      </div>
      <div className="h-64 mt-auto">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" className="opacity-50" />
            <XAxis 
              dataKey="date" 
              tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              dy={10}
              // Hide x-axis ticks if there are too many, or just let recharts handle it
              minTickGap={30}
            />
            <YAxis 
              domain={[0, 100]}
              tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              dx={-10}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--muted)', strokeWidth: 2 }} />
            <Line 
              type="monotone" 
              dataKey="score" 
              name="Score"
              stroke="var(--primary)" 
              strokeWidth={3}
              dot={{ r: 4, fill: 'var(--card)', stroke: 'var(--primary)', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: 'var(--primary)', stroke: 'var(--card)', strokeWidth: 2 }}
              animationDuration={1000}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
