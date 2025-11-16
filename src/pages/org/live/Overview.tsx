import { useEffect, useState } from 'react'
import { Code, CheckCircle, Users, TrendingUp, RefreshCw } from 'lucide-react'
import MetricCard from '../../../components/MetricCard'
import LineChart from '../../../components/LineChart'
import PieChart from '../../../components/PieChart'
import MetricsInsights from '../../../components/MetricsInsights'
import DateRangeSelector, { DateRange } from '../../../components/DateRangeSelector'
import DataSourceToggle from '../../../components/DataSourceToggle'
import { githubApiService } from '../../../services/githubApi'
import { metricsService } from '../../../services/api'
import { transformGitHubData, calculateAcceptanceRate, calculateAverageMetrics } from '../../../services/dataTransform'
import { CopilotMetricsResponse, LineChartData, ChartData } from '../../../types/metrics'

const LiveOverview = () => {
  const [metrics, setMetrics] = useState<CopilotMetricsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [dateRange, setDateRange] = useState<DateRange>('daily')
  const [isDemo, setIsDemo] = useState(false)

  const loadMetrics = async () => {
    setLoading(true)
    try {
      if (!isDemo) {
        // Load data from localStorage or local file
        const githubData = await githubApiService.loadData()
        
        if (githubData && githubData.length > 0) {
          // Transform GitHub API format to our internal format
          const transformed = transformGitHubData(githubData)
          setMetrics(transformed)
          setLastRefresh(new Date(githubApiService.getLastSavedTimestamp() || new Date()))
        } else {
          // No live data available, don't auto-switch to demo
          setMetrics(null)
        }
      } else {
        // Load demo data
        const demoData = await metricsService.fetchMetrics('demo-org')
        setMetrics(demoData)
        setLastRefresh(new Date())
      }
    } catch (error) {
      console.error('Failed to load metrics:', error)
      setMetrics(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMetrics()
  }, [isDemo])

  useEffect(() => {
    if (!isDemo) {
      // Auto-refresh every 5 minutes only for live data
      const interval = setInterval(() => {
        loadMetrics()
      }, 5 * 60 * 1000)

      return () => clearInterval(interval)
    }
  }, [isDemo])

  if (loading && !metrics) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white dark:text-white light:text-gray-900 text-xl flex items-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin" />
          Loading metrics...
        </div>
      </div>
    )
  }

  // Show no data message when live mode is selected but no data is available
  if (!isDemo && (!metrics || !metrics.data || metrics.data.length === 0)) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white dark:text-white light:text-gray-900 mb-2">Organization Overview</h1>
            <p className="text-gray-400 dark:text-gray-400 light:text-gray-600">Live metrics from GitHub Copilot API</p>
          </div>
          <DataSourceToggle isDemo={isDemo} onToggle={setIsDemo} />
        </div>
        <div className="bg-yellow-900/20 dark:bg-yellow-900/20 light:bg-yellow-50 border border-yellow-700/50 dark:border-yellow-700/50 light:border-yellow-300 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-200 dark:text-yellow-200 light:text-yellow-800 mb-3 flex items-center gap-2">
            <Code className="w-5 h-5" />
            No Live Data Available
          </h3>
          <p className="text-yellow-100/80 dark:text-yellow-100/80 light:text-yellow-900 mb-4">
            There is currently no live data available from the GitHub Copilot API. To view live organization metrics:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-yellow-100/80 dark:text-yellow-100/80 light:text-yellow-900 mb-4 ml-2">
            <li>Go to the <strong>Admin Settings</strong> page</li>
            <li>Configure your GitHub Personal Access Token (PAT) with <code className="px-1 py-0.5 bg-yellow-950/30 dark:bg-yellow-950/30 light:bg-yellow-200 rounded text-sm">copilot</code> scope</li>
            <li>Enter your organization name</li>
            <li>Click "Save Settings" and then "Fetch Data"</li>
            <li>Wait for the data to be retrieved (this may take a few moments)</li>
          </ol>
          <p className="text-yellow-100/80 dark:text-yellow-100/80 light:text-yellow-900">
            In the meantime, switch to <strong>Demo</strong> mode using the toggle above to explore the dashboard with sample data.
          </p>
        </div>
      </div>
    )
  }

  if (!metrics || !metrics.data || metrics.data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white dark:text-white light:text-gray-900 text-xl flex items-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin" />
          Loading demo data...
        </div>
      </div>
    )
  }

  // Determine how many days to show based on date range
  const getDaysToShow = () => {
    switch (dateRange) {
      case 'daily':
        return 7
      case 'weekly':
        return 28
      case 'monthly':
        return 90
      default:
        return 7
    }
  }

  const daysToShow = getDaysToShow()
  const filteredData = metrics.data.slice(-daysToShow)

  const avgMetrics = calculateAverageMetrics(filteredData)
  const acceptanceRate = calculateAcceptanceRate(filteredData)
  const totalSuggestions = filteredData.reduce((sum, d) => sum + d.total_suggestions_count, 0)
  const totalChatTurns = filteredData.reduce((sum, d) => sum + (d.total_chat_turns || 0), 0)
  
  // Calculate week-over-week growth
  const recentWeek = filteredData.slice(-7)
  const previousWeek = filteredData.slice(-14, -7)
  const recentWeekUsers = recentWeek.length > 0 
    ? recentWeek.reduce((sum, d) => sum + d.total_active_users, 0) / recentWeek.length 
    : 0
  const previousWeekUsers = previousWeek.length > 0
    ? previousWeek.reduce((sum, d) => sum + d.total_active_users, 0) / previousWeek.length
    : 0
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
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-white dark:text-white light:text-gray-900">Live Dashboard Overview</h1>
            <span className="px-3 py-1 bg-green-500 bg-opacity-20 text-green-400 text-xs font-semibold rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              LIVE
            </span>
          </div>
          <p className="text-slate-400 dark:text-slate-400 light:text-gray-600">Real-time metrics from GitHub Copilot API</p>
        </div>
        <div className="flex items-center gap-4">
          <DataSourceToggle isDemo={isDemo} onToggle={setIsDemo} />
          <DateRangeSelector
            selectedRange={dateRange}
            onRangeChange={setDateRange}
          />
          {!isDemo && (
            <button
              onClick={loadMetrics}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 dark:bg-slate-700 light:bg-gray-200 hover:bg-slate-600 dark:hover:bg-slate-600 light:hover:bg-gray-300 text-white dark:text-white light:text-gray-900 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          )}
        </div>
      </div>

      <div className="bg-slate-800 dark:bg-slate-800 light:bg-green-50 border border-slate-700 dark:border-slate-700 light:border-green-200 rounded-lg px-4 py-3">
        <p className="text-sm text-slate-300 dark:text-slate-300 light:text-gray-700">
          <span className="font-semibold text-white dark:text-white light:text-gray-900">Last updated:</span>{' '}
          {lastRefresh.toLocaleString()} {!isDemo && '• Auto-refreshes every 5 minutes'} • Showing {getDaysToShow()} days of data
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Avg Daily Suggestions"
          value={avgMetrics.avgSuggestions.toLocaleString()}
          change={`${acceptanceRate.toFixed(1)}% acceptance rate`}
          icon={<Code className="w-6 h-6" />}
          trend="up"
        />
        <MetricCard
          title="Avg Daily Acceptances"
          value={avgMetrics.avgAcceptances.toLocaleString()}
          change={`${metrics.data.length} days of data`}
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
          title="Avg Chat Users"
          value={avgMetrics.avgChatConversations}
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
        chatUsage={totalChatTurns}
      />
    </div>
  )
}

export default LiveOverview
