import { useEffect, useState } from 'react'
import { Users, UserPlus, Percent, TrendingUp, RefreshCw } from 'lucide-react'
import MetricCard from '../../../components/MetricCard'
import LineChart from '../../../components/LineChart'
import PieChart from '../../../components/PieChart'
import BarChart from '../../../components/BarChart'
import DateRangeSelector, { DateRange } from '../../../components/DateRangeSelector'
import DataSourceToggle from '../../../components/DataSourceToggle'
import { githubApiService } from '../../../services/githubApi'
import { metricsService } from '../../../services/api'
import { transformGitHubData } from '../../../services/dataTransform'
import { CopilotMetricsResponse, LineChartData, ChartData } from '../../../types/metrics'

const LiveAdoption = () => {
  const [metrics, setMetrics] = useState<CopilotMetricsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [dateRange, setDateRange] = useState<DateRange>('daily')
  const [isDemo, setIsDemo] = useState(false)

  const getDaysToShow = () => {
    switch (dateRange) {
      case 'daily': return 7
      case 'weekly': return 28
      case 'monthly': return 90
    }
  }

  const loadMetrics = async () => {
    setLoading(true)
    try {
      if (!isDemo) {
        const githubData = await githubApiService.loadData()
        if (githubData && githubData.length > 0) {
          const transformed = transformGitHubData(githubData)
          setMetrics(transformed)
          setLastRefresh(new Date(githubApiService.getLastSavedTimestamp() || new Date()))
        } else {
          // No live data available, don't auto-switch to demo
          setMetrics(null)
        }
      } else {
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
      const interval = setInterval(loadMetrics, 5 * 60 * 1000)
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
            <h1 className="text-2xl font-bold text-white dark:text-white light:text-gray-900 mb-2">Adoption Metrics</h1>
            <p className="text-gray-400 dark:text-gray-400 light:text-gray-600">Live adoption data from GitHub Copilot API</p>
          </div>
          <DataSourceToggle isDemo={isDemo} onToggle={setIsDemo} />
        </div>
        <div className="bg-yellow-900/20 dark:bg-yellow-900/20 light:bg-yellow-50 border border-yellow-700/50 dark:border-yellow-700/50 light:border-yellow-300 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-200 dark:text-yellow-200 light:text-yellow-800 mb-3 flex items-center gap-2">
            <Users className="w-5 h-5" />
            No Live Data Available
          </h3>
          <p className="text-yellow-100/80 dark:text-yellow-100/80 light:text-yellow-900 mb-4">
            There is currently no live data available from the GitHub Copilot API. To view live adoption metrics:
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

  const daysToShow = getDaysToShow()
  const filteredData = metrics.data.slice(-daysToShow)

  const latestMetrics = filteredData[filteredData.length - 1]
  const avgActiveUsers = Math.round(filteredData.reduce((sum, d) => sum + d.total_active_users, 0) / filteredData.length)
  
  const userTrendData: LineChartData[] = [
    {
      id: 'Total Active Users',
      data: filteredData.map(d => ({
        x: d.date.split('-').slice(1).join('/'),
        y: d.total_active_users
      }))
    },
    {
      id: 'Active Chat Users',
      data: filteredData.map(d => ({
        x: d.date.split('-').slice(1).join('/'),
        y: d.total_active_chat_users
      }))
    }
  ]

  const editorData: ChartData[] = metrics.editors?.map(e => ({
    id: e.name,
    label: e.name,
    value: e.total_engaged_users
  })) || []

  const languageData = metrics.languages?.slice(0, 8).map(l => ({
    language: l.name,
    users: l.total_engaged_users
  })) || []

  const chatAdoptionRate = latestMetrics.total_active_users > 0
    ? (latestMetrics.total_active_chat_users / latestMetrics.total_active_users * 100).toFixed(1)
    : 0

  const totalEditorUsers = metrics.editors?.reduce((sum, e) => sum + e.total_engaged_users, 0) || 0

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-white dark:text-white light:text-gray-900">Live Adoption Metrics</h1>
            <span className="px-3 py-1 bg-green-500 bg-opacity-20 text-green-400 text-xs font-semibold rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              LIVE
            </span>
          </div>
          <p className="text-slate-400 dark:text-slate-400 light:text-gray-600">Real-time user engagement and adoption patterns</p>
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
          {lastRefresh.toLocaleString()} • Showing {getDaysToShow()} days of data
          {!isDemo && ' • Auto-refreshes every 5 minutes'}
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Active Users"
          value={latestMetrics.total_active_users}
          change={`${avgActiveUsers} avg daily`}
          icon={<Users className="w-6 h-6" />}
          trend="up"
        />
        <MetricCard
          title="Chat Users"
          value={latestMetrics.total_active_chat_users}
          change={`${chatAdoptionRate}% adoption rate`}
          icon={<UserPlus className="w-6 h-6" />}
          trend="up"
        />
        <MetricCard
          title="Engaged Users"
          value={totalEditorUsers}
          change="Across all editors"
          icon={<TrendingUp className="w-6 h-6" />}
          trend="neutral"
        />
        <MetricCard
          title="Chat Adoption"
          value={`${chatAdoptionRate}%`}
          change="Of active users"
          icon={<Percent className="w-6 h-6" />}
          trend="up"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6">
        <LineChart
          data={userTrendData}
          title="User Adoption Trend (Last 30 Days)"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PieChart
          data={editorData}
          title="Editor Distribution"
        />
        <BarChart
          data={languageData}
          keys={['users']}
          indexBy="language"
          title="Top Languages by User Engagement"
        />
      </div>

      {/* Adoption Insights */}
      <div className="bg-slate-800 dark:bg-slate-800 light:bg-white rounded-lg p-6 border border-slate-700 dark:border-slate-700 light:border-gray-200">
        <h3 className="text-lg font-semibold text-white dark:text-white light:text-gray-900 mb-4">Adoption Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-slate-400 dark:text-slate-400 light:text-gray-600">Adoption Highlights</h4>
            <div className="space-y-2 text-sm text-slate-300 dark:text-slate-300 light:text-gray-700">
              <p><span className="font-semibold text-white dark:text-white light:text-gray-900">{latestMetrics.total_active_users}</span> developers actively using Copilot</p>
              <p><span className="font-semibold text-white dark:text-white light:text-gray-900">{chatAdoptionRate}%</span> chat feature adoption rate</p>
              <p><span className="font-semibold text-white dark:text-white light:text-gray-900">{metrics.editors?.length || 0}</span> different editors in use</p>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-slate-400 dark:text-slate-400 light:text-gray-600">Growth Opportunities</h4>
            <ul className="space-y-2 text-sm text-slate-300 dark:text-slate-300 light:text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-400">→</span>
                <span>Encourage non-chat users to explore chat features</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">→</span>
                <span>Promote adoption in underutilized editors</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">→</span>
                <span>Provide language-specific training for top languages</span>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-slate-400 dark:text-slate-400 light:text-gray-600">Success Metrics</h4>
            <ul className="space-y-2 text-sm text-slate-300 dark:text-slate-300 light:text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Strong daily active user base</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Diverse editor ecosystem</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Multi-language engagement</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LiveAdoption
