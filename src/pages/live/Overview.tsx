import { useEffect, useState } from 'react'
import { Code, CheckCircle, Users, TrendingUp, RefreshCw, AlertCircle } from 'lucide-react'
import MetricCard from '../../components/MetricCard'
import LineChart from '../../components/LineChart'
import PieChart from '../../components/PieChart'
import MetricsInsights from '../../components/MetricsInsights'
import { githubApiService } from '../../services/githubApi'
import { transformGitHubData, calculateAcceptanceRate, calculateAverageMetrics } from '../../services/dataTransform'
import { CopilotMetricsResponse, LineChartData, ChartData } from '../../types/metrics'

const LiveOverview = () => {
  const [metrics, setMetrics] = useState<CopilotMetricsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState(new Date())

  const loadMetrics = async () => {
    setLoading(true)
    try {
      // Load data from localStorage or local file
      const githubData = await githubApiService.loadData()
      
      if (githubData && githubData.length > 0) {
        // Transform GitHub API format to our internal format
        const transformed = transformGitHubData(githubData)
        setMetrics(transformed)
        setLastRefresh(new Date(githubApiService.getLastSavedTimestamp() || new Date()))
      } else {
        setMetrics(null)
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
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      loadMetrics()
    }, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  if (loading && !metrics) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white text-xl flex items-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin" />
          Loading live metrics...
        </div>
      </div>
    )
  }

  if (!metrics || !metrics.data || metrics.data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="bg-yellow-500 bg-opacity-10 border border-yellow-500 rounded-lg p-6 max-w-md">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-yellow-400 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-400 mb-2">No Data Available</h3>
              <p className="text-sm text-slate-300 mb-3">
                Please download metrics data from the Admin page first.
              </p>
              <a
                href="/admin"
                className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors text-sm font-medium"
              >
                Go to Admin Settings
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const avgMetrics = calculateAverageMetrics(metrics.data)
  const acceptanceRate = calculateAcceptanceRate(metrics.data)
  const totalSuggestions = metrics.data.reduce((sum, d) => sum + d.total_suggestions_count, 0)
  const totalChatTurns = metrics.data.reduce((sum, d) => sum + (d.total_chat_turns || 0), 0)
  
  // Calculate week-over-week growth
  const recentWeek = metrics.data.slice(-7)
  const previousWeek = metrics.data.slice(-14, -7)
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
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-white">Live Dashboard Overview</h1>
            <span className="px-3 py-1 bg-green-500 bg-opacity-20 text-green-400 text-xs font-semibold rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              LIVE
            </span>
          </div>
          <p className="text-slate-400">Real-time metrics from GitHub Copilot API</p>
        </div>
        <button
          onClick={loadMetrics}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3">
        <p className="text-sm text-slate-300">
          <span className="font-semibold text-white">Last updated:</span>{' '}
          {lastRefresh.toLocaleString()} • Auto-refreshes every 5 minutes
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
