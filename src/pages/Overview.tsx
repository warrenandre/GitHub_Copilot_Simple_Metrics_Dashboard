import { useEffect, useState } from 'react'
import { Code, CheckCircle, Users, TrendingUp } from 'lucide-react'
import MetricCard from '../components/MetricCard'
import LineChart from '../components/LineChart'
import PieChart from '../components/PieChart'
import MetricsInsights from '../components/MetricsInsights'
import { metricsService } from '../services/api'
import { CopilotMetricsResponse, LineChartData, ChartData } from '../types/metrics'

const Overview = () => {
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
        <div className="text-white text-xl">Loading metrics...</div>
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
  const acceptanceRate = avgMetrics.acceptanceRate
  const totalSuggestions = metrics.data.reduce((sum, d) => sum + d.total_suggestions_count, 0)
  
  // Calculate week-over-week growth
  const recentWeek = metrics.data.slice(-7)
  const previousWeek = metrics.data.slice(-14, -7)
  const recentWeekUsers = recentWeek.reduce((sum, d) => sum + d.total_active_users, 0) / 7
  const previousWeekUsers = previousWeek.reduce((sum, d) => sum + d.total_active_users, 0) / 7
  const weekOverWeekGrowth = previousWeekUsers > 0 
    ? ((recentWeekUsers - previousWeekUsers) / previousWeekUsers) * 100 
    : 0
  
  // Prepare line chart data for suggestions vs acceptances
  const suggestionData: LineChartData[] = [
    {
      id: 'Suggestions',
      data: metrics.data.slice(-14).map(d => ({
        x: d.date.split('-').slice(1).join('/'),
        y: d.total_suggestions_count
      }))
    },
    {
      id: 'Acceptances',
      data: metrics.data.slice(-14).map(d => ({
        x: d.date.split('-').slice(1).join('/'),
        y: d.total_acceptances_count
      }))
    }
  ]

  // Prepare pie chart data for editors
  const editorData: ChartData[] = metrics.editors?.map(e => ({
    id: e.name,
    label: e.name,
    value: e.total_engaged_users
  })) || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-slate-400">Key metrics and insights for GitHub Copilot usage</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Avg Daily Suggestions"
          value={avgMetrics.avgSuggestions.toLocaleString()}
          change={`${avgMetrics.acceptanceRate.toFixed(1)}% acceptance rate`}
          icon={<Code className="w-6 h-6" />}
          trend="up"
        />
        <MetricCard
          title="Avg Daily Acceptances"
          value={avgMetrics.avgAcceptances.toLocaleString()}
          change="Last 30 days"
          icon={<CheckCircle className="w-6 h-6" />}
          trend="up"
        />
        <MetricCard
          title="Avg Active Users"
          value={avgMetrics.avgActiveUsers}
          change="Daily average"
          icon={<Users className="w-6 h-6" />}
          trend="neutral"
        />
        <MetricCard
          title="Lines Accepted"
          value={avgMetrics.avgLinesAccepted.toLocaleString()}
          change="Per day"
          icon={<TrendingUp className="w-6 h-6" />}
          trend="up"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart
          data={suggestionData}
          title="Suggestions vs Acceptances (Last 14 Days)"
        />
        <PieChart
          data={editorData}
          title="Users by Editor"
        />
      </div>

      {/* Insights Section */}
      <MetricsInsights
        acceptanceRate={acceptanceRate}
        activeUsers={avgMetrics.avgActiveUsers}
        totalUsers={100}
        suggestionCount={totalSuggestions}
        weekOverWeekGrowth={weekOverWeekGrowth}
        chatUsage={metrics.data.reduce((sum, d) => sum + (d.total_chat_turns || 0), 0)}
      />
    </div>
  )
}

export default Overview
