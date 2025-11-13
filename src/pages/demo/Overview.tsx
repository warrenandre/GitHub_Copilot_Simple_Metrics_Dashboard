import { useEffect, useState } from 'react'
import { Code, CheckCircle, Users, TrendingUp } from 'lucide-react'
import MetricCard from '../../components/MetricCard'
import LineChart from '../../components/LineChart'
import PieChart from '../../components/PieChart'
import MetricsInsights from '../../components/MetricsInsights'
import DateRangeSelector, { DateRange } from '../../components/DateRangeSelector'
import { metricsService } from '../../services/api'
import { CopilotMetricsResponse, LineChartData, ChartData } from '../../types/metrics'

const Overview = () => {
  const [metrics, setMetrics] = useState<CopilotMetricsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState<DateRange>('daily')

  const getDaysToShow = () => {
    switch (dateRange) {
      case 'daily': return 7
      case 'weekly': return 28
      case 'monthly': return 90
    }
  }

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
        <div className="text-white dark:text-white light:text-gray-900 text-xl">Loading metrics...</div>
      </div>
    )
  }

  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white dark:text-white light:text-gray-900 text-xl">Failed to load metrics</div>
      </div>
    )
  }

  const daysToShow = getDaysToShow()
  const filteredData = metrics.data.slice(-daysToShow)

  const avgMetrics = metricsService.calculateAverageMetrics(filteredData)
  const acceptanceRate = avgMetrics.acceptanceRate
  const totalSuggestions = filteredData.reduce((sum, d) => sum + d.total_suggestions_count, 0)
  
  // Calculate week-over-week growth from filtered data
  const recentWeek = filteredData.slice(-7)
  const previousWeek = filteredData.slice(-14, -7).length > 0 ? filteredData.slice(-14, -7) : recentWeek
  const recentWeekUsers = recentWeek.reduce((sum, d) => sum + d.total_active_users, 0) / recentWeek.length
  const previousWeekUsers = previousWeek.reduce((sum, d) => sum + d.total_active_users, 0) / previousWeek.length
  const weekOverWeekGrowth = previousWeekUsers > 0 
    ? ((recentWeekUsers - previousWeekUsers) / previousWeekUsers) * 100 
    : 0
  
  // Prepare line chart data for suggestions vs acceptances
  const suggestionData: LineChartData[] = [
    {
      id: 'Suggestions',
      data: filteredData.map(d => ({
        x: d.date.split('-').slice(1).join('/'),
        y: d.total_suggestions_count
      }))
    },
    {
      id: 'Acceptances',
      data: filteredData.map(d => ({
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
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white dark:text-white light:text-gray-900 mb-2">Dashboard Overview</h1>
          <p className="text-slate-400 dark:text-slate-400 light:text-gray-600">Key metrics and insights for GitHub Copilot usage</p>
        </div>
        <DateRangeSelector
          selectedRange={dateRange}
          onRangeChange={setDateRange}
        />
      </div>

      <div className="bg-slate-800 dark:bg-slate-800 light:bg-blue-50 border border-slate-700 dark:border-slate-700 light:border-blue-200 rounded-lg px-4 py-3">
        <p className="text-sm text-slate-300 dark:text-slate-300 light:text-gray-700">
          <span className="font-semibold text-white dark:text-white light:text-gray-900">Showing {getDaysToShow()} days of demo data</span>
        </p>
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
