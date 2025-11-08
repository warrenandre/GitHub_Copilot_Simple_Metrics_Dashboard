import { ReactNode } from 'react'

interface MetricCardProps {
  title: string
  value: string | number
  change?: string
  icon: ReactNode
  trend?: 'up' | 'down' | 'neutral'
}

const MetricCard = ({ title, value, change, icon, trend = 'neutral' }: MetricCardProps) => {
  const trendColors = {
    up: 'text-green-400',
    down: 'text-red-400',
    neutral: 'text-slate-400',
  }

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-blue-500 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-slate-400 text-sm font-medium mb-2">{title}</p>
          <p className="text-3xl font-bold text-white mb-1">{value}</p>
          {change && (
            <p className={`text-sm font-medium ${trendColors[trend]}`}>
              {change}
            </p>
          )}
        </div>
        <div className="bg-blue-500 bg-opacity-10 p-3 rounded-lg">
          <div className="text-blue-500">{icon}</div>
        </div>
      </div>
    </div>
  )
}

export default MetricCard
