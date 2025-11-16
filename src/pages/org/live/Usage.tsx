import { useEffect, useState } from 'react'
import { Activity, MessageSquare, RefreshCw, Zap } from 'lucide-react'
import MetricCard from '../../../components/MetricCard'
import LineChart from '../../../components/LineChart'
import BarChart from '../../../components/BarChart'
import DateRangeSelector, { DateRange } from '../../../components/DateRangeSelector'
import DataSourceToggle from '../../../components/DataSourceToggle'
import { githubApiService } from '../../../services/githubApi'
import { metricsService } from '../../../services/api'
import { transformGitHubData, calculateAverageMetrics } from '../../../services/dataTransform'
import { CopilotMetricsResponse, LineChartData, GitHubCopilotMetricsResponse } from '../../../types/metrics'

const LiveUsage = () => {
  const [metrics, setMetrics] = useState<CopilotMetricsResponse | null>(null)
  const [rawData, setRawData] = useState<GitHubCopilotMetricsResponse | null>(null)
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
          setRawData(githubData)
          const transformed = transformGitHubData(githubData)
          setMetrics(transformed)
          setLastRefresh(new Date(githubApiService.getLastSavedTimestamp() || new Date()))
        } else {
          // No live data available, don't auto-switch to demo
          setRawData(null)
          setMetrics(null)
        }
      } else {
        setRawData(null)
        const demoData = await metricsService.fetchMetrics('demo-org')
        setMetrics(demoData)
        setLastRefresh(new Date())
      }
    } catch (error) {
      console.error('Failed to load metrics:', error)
      setRawData(null)
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
            <h1 className="text-2xl font-bold text-white dark:text-white light:text-gray-900 mb-2">Usage Metrics</h1>
            <p className="text-gray-400 dark:text-gray-400 light:text-gray-600">Live usage data from GitHub Copilot API</p>
          </div>
          <DataSourceToggle isDemo={isDemo} onToggle={setIsDemo} />
        </div>
        <div className="bg-yellow-900/20 dark:bg-yellow-900/20 light:bg-yellow-50 border border-yellow-700/50 dark:border-yellow-700/50 light:border-yellow-300 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-200 dark:text-yellow-200 light:text-yellow-800 mb-3 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            No Live Data Available
          </h3>
          <p className="text-yellow-100/80 dark:text-yellow-100/80 light:text-yellow-900 mb-4">
            There is currently no live data available from the GitHub Copilot API. To view live usage metrics:
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
  
  const avgMetrics = calculateAverageMetrics(filteredData)
  const latestMetrics = filteredData[filteredData.length - 1]

  const chatData: LineChartData[] = [
    {
      id: 'Chat Turns',
      data: filteredData.map(d => ({
        x: d.date.split('-').slice(1).join('/'),
        y: d.total_chat_turns
      }))
    },
    {
      id: 'Chat Acceptances',
      data: filteredData.map(d => ({
        x: d.date.split('-').slice(1).join('/'),
        y: d.total_chat_acceptances
      }))
    }
  ]

  const activityData: LineChartData[] = [
    {
      id: 'Active Users',
      data: filteredData.map(d => ({
        x: d.date.split('-').slice(1).join('/'),
        y: d.total_active_users
      }))
    },
    {
      id: 'Chat Users',
      data: filteredData.map(d => ({
        x: d.date.split('-').slice(1).join('/'),
        y: d.total_active_chat_users
      }))
    }
  ]

  const languageData = metrics.languages?.slice(0, 10).map(l => ({
    language: l.name,
    users: l.total_engaged_users
  })) || []

  // Model usage per day from raw GitHub data - filter by date range
  const modelUsageByDay: { [key: string]: { date: string; default: number; custom: number } } = {}
  
  if (rawData) {
    // Get the date range for filtering
    const filteredRawData = rawData.slice(-daysToShow)
    
    filteredRawData.forEach(day => {
      const date = day.date.split('-').slice(1).join('/')
      if (!modelUsageByDay[date]) {
        modelUsageByDay[date] = { date, default: 0, custom: 0 }
      }

      // Count IDE Chat model usage
      if (day.copilot_ide_chat?.editors) {
        day.copilot_ide_chat.editors.forEach(editor => {
          editor.models?.forEach(model => {
            if (model.is_custom_model) {
              modelUsageByDay[date].custom += model.total_engaged_users || 0
            } else {
              modelUsageByDay[date].default += model.total_engaged_users || 0
            }
          })
        })
      }

      // Count IDE Code Completions model usage
      if (day.copilot_ide_code_completions?.editors) {
        day.copilot_ide_code_completions.editors.forEach(editor => {
          editor.models?.forEach(model => {
            if (model.is_custom_model) {
              modelUsageByDay[date].custom += model.total_engaged_users || 0
            } else {
              modelUsageByDay[date].default += model.total_engaged_users || 0
            }
          })
        })
      }
    })
  }

  // Convert to line chart data format
  const modelUsageData: LineChartData[] = [
    {
      id: 'Default Model',
      data: Object.values(modelUsageByDay).map(day => ({
        x: day.date,
        y: day.default
      }))
    }
  ]

  // Only add custom model line if there's any custom model usage
  const hasCustomModel = Object.values(modelUsageByDay).some(day => day.custom > 0)
  if (hasCustomModel) {
    modelUsageData.push({
      id: 'Custom Model',
      data: Object.values(modelUsageByDay).map(day => ({
        x: day.date,
        y: day.custom
      }))
    })
  }

  // Calculate total model engaged users for metric card
  const totalModelUsers = rawData ? rawData[rawData.length - 1] : null
  let defaultModelUsers = 0
  let customModelUsers = 0

  if (totalModelUsers) {
    // Count from IDE chat
    totalModelUsers.copilot_ide_chat?.editors?.forEach(editor => {
      editor.models?.forEach(model => {
        if (model.is_custom_model) {
          customModelUsers += model.total_engaged_users || 0
        } else {
          defaultModelUsers += model.total_engaged_users || 0
        }
      })
    })

    // Count from code completions
    totalModelUsers.copilot_ide_code_completions?.editors?.forEach(editor => {
      editor.models?.forEach(model => {
        if (model.is_custom_model) {
          customModelUsers += model.total_engaged_users || 0
        } else {
          defaultModelUsers += model.total_engaged_users || 0
        }
      })
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-white dark:text-white light:text-gray-900">Live Usage Metrics</h1>
            <span className="px-3 py-1 bg-green-500 bg-opacity-20 text-green-400 text-xs font-semibold rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              LIVE
            </span>
          </div>
          <p className="text-slate-400 dark:text-slate-400 light:text-gray-600">Real-time usage patterns and activity</p>
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
          title="Total Chat Turns"
          value={latestMetrics.total_chat_turns.toLocaleString()}
          change={`${avgMetrics.avgActiveUsers} avg users`}
          icon={<MessageSquare className="w-6 h-6" />}
          trend="up"
        />
        <MetricCard
          title="Chat Acceptances"
          value={latestMetrics.total_chat_acceptances.toLocaleString()}
          change="Today"
          icon={<Activity className="w-6 h-6" />}
          trend="up"
        />
        <MetricCard
          title="Active Chat Users"
          value={latestMetrics.total_active_chat_users}
          change="Last recorded"
          icon={<MessageSquare className="w-6 h-6" />}
          trend="neutral"
        />
        <MetricCard
          title="Model Users"
          value={defaultModelUsers + customModelUsers}
          change={hasCustomModel ? `${customModelUsers} custom` : 'Default only'}
          icon={<Zap className="w-6 h-6" />}
          trend={hasCustomModel ? 'up' : 'neutral'}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart
          data={chatData}
          title="Chat Activity Over Time"
        />
        <LineChart
          data={activityData}
          title="User Activity Trends"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart
          data={modelUsageData}
          title="Model Usage Per Day"
        />
        <BarChart
          data={languageData}
          keys={['users']}
          indexBy="language"
          title="Top Programming Languages by Users"
        />
      </div>
    </div>
  )
}

export default LiveUsage
