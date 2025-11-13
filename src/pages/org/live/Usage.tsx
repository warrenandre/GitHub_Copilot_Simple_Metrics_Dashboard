import { useEffect, useState } from 'react'
import { Activity, MessageSquare, RefreshCw, AlertCircle, Zap } from 'lucide-react'
import MetricCard from '../../../components/MetricCard'
import LineChart from '../../../components/LineChart'
import BarChart from '../../../components/BarChart'
import DateRangeSelector, { DateRange } from '../../../components/DateRangeSelector'
import { githubApiService } from '../../../services/githubApi'
import { transformGitHubData, calculateAverageMetrics } from '../../../services/dataTransform'
import { CopilotMetricsResponse, LineChartData, GitHubCopilotMetricsResponse } from '../../../types/metrics'

const LiveUsage = () => {
  const [metrics, setMetrics] = useState<CopilotMetricsResponse | null>(null)
  const [rawData, setRawData] = useState<GitHubCopilotMetricsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [dateRange, setDateRange] = useState<DateRange>('daily')

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
      const githubData = await githubApiService.loadData()
      if (githubData && githubData.length > 0) {
        setRawData(githubData)
        const transformed = transformGitHubData(githubData)
        setMetrics(transformed)
        setLastRefresh(new Date(githubApiService.getLastSavedTimestamp() || new Date()))
      } else {
        setRawData(null)
        setMetrics(null)
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
    const interval = setInterval(loadMetrics, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  if (loading && !metrics) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white dark:text-white light:text-gray-900 text-xl flex items-center gap-3">
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
              <p className="text-sm text-slate-300 dark:text-slate-300 light:text-gray-700 mb-3">
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
          <DateRangeSelector
            selectedRange={dateRange}
            onRangeChange={setDateRange}
          />
          <button
            onClick={loadMetrics}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 dark:bg-slate-700 light:bg-gray-200 hover:bg-slate-600 dark:hover:bg-slate-600 light:hover:bg-gray-300 text-white dark:text-white light:text-gray-900 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      <div className="bg-slate-800 dark:bg-slate-800 light:bg-green-50 border border-slate-700 dark:border-slate-700 light:border-green-200 rounded-lg px-4 py-3">
        <p className="text-sm text-slate-300 dark:text-slate-300 light:text-gray-700">
          <span className="font-semibold text-white dark:text-white light:text-gray-900">Last updated:</span>{' '}
          {lastRefresh.toLocaleString()} • Showing {getDaysToShow()} days of data
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
