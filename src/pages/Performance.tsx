import { useEffect, useState } from 'react'
import { Zap, Target, LineChart as LineChartIcon, BarChart3 } from 'lucide-react'
import MetricCard from '../components/MetricCard'
import LineChart from '../components/LineChart'
import { metricsService } from '../services/api'
import { CopilotMetricsResponse, LineChartData } from '../types/metrics'

const Performance = () => {
  const [metrics, setMetrics] = useState<CopilotMetricsResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const data = await metricsService.fetchMetrics('your-org')
        setMetrics(data)
      } catch (error) {
        console.error('Failed to load metrics:', error)
      } finally {
        setLoading(false)
      }
    }

    loadMetrics()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white text-xl">Loading performance metrics...</div>
      </div>
    )
  }

  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white text-xl">Failed to load metrics</div>
      </div>
    )
  }

  const avgMetrics = metricsService.calculateAverageMetrics(metrics.data)
  
  // Calculate acceptance rate over time
  const acceptanceRateData: LineChartData[] = [
    {
      id: 'Acceptance Rate',
      data: metrics.data.slice(-14).map(d => ({
        x: d.date.split('-').slice(1).join('/'),
        y: metricsService.calculateAcceptanceRate(
          d.total_suggestions_count,
          d.total_acceptances_count
        )
      }))
    }
  ]

  // Lines suggested vs accepted
  const linesData: LineChartData[] = [
    {
      id: 'Lines Suggested',
      data: metrics.data.slice(-14).map(d => ({
        x: d.date.split('-').slice(1).join('/'),
        y: d.total_lines_suggested
      }))
    },
    {
      id: 'Lines Accepted',
      data: metrics.data.slice(-14).map(d => ({
        x: d.date.split('-').slice(1).join('/'),
        y: d.total_lines_accepted
      }))
    }
  ]

  // Calculate line acceptance rate
  const totalLinesSuggested = metrics.data.reduce((sum, d) => sum + d.total_lines_suggested, 0)
  const totalLinesAccepted = metrics.data.reduce((sum, d) => sum + d.total_lines_accepted, 0)
  const lineAcceptanceRate = (totalLinesAccepted / totalLinesSuggested * 100).toFixed(1)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Performance Analytics</h1>
        <p className="text-slate-400">Code acceptance rates and productivity metrics</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Acceptance Rate"
          value={`${avgMetrics.acceptanceRate.toFixed(1)}%`}
          change="Suggestions to acceptances"
          icon={<Target className="w-6 h-6" />}
          trend="up"
        />
        <MetricCard
          title="Line Acceptance Rate"
          value={`${lineAcceptanceRate}%`}
          change="Lines accepted vs suggested"
          icon={<LineChartIcon className="w-6 h-6" />}
          trend="up"
        />
        <MetricCard
          title="Avg Lines Suggested"
          value={avgMetrics.avgLinesSuggested.toLocaleString()}
          change="Per day"
          icon={<Zap className="w-6 h-6" />}
          trend="neutral"
        />
        <MetricCard
          title="Avg Lines Accepted"
          value={avgMetrics.avgLinesAccepted.toLocaleString()}
          change="Per day"
          icon={<BarChart3 className="w-6 h-6" />}
          trend="up"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6">
        <LineChart
          data={acceptanceRateData}
          title="Acceptance Rate Trend (Last 14 Days)"
        />
        <LineChart
          data={linesData}
          title="Lines of Code Suggested vs Accepted"
        />
      </div>

      {/* Performance Insights */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Performance Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-slate-400 mb-2">Key Findings</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Average acceptance rate of {avgMetrics.acceptanceRate.toFixed(1)}% indicates strong adoption</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>{avgMetrics.avgLinesAccepted.toLocaleString()} lines of code accepted daily on average</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">ℹ</span>
                <span>Line acceptance rate at {lineAcceptanceRate}%</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-slate-400 mb-2">Recommendations</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-yellow-400">→</span>
                <span>Monitor acceptance rates to identify areas for improvement</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400">→</span>
                <span>Share best practices with teams showing lower engagement</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400">→</span>
                <span>Track trends to measure the impact of training initiatives</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Performance
