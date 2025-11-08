import { useEffect, useState } from 'react'
import { Activity, MessageSquare, RefreshCw, AlertCircle } from 'lucide-react'
import MetricCard from '../../components/MetricCard'
import LineChart from '../../components/LineChart'
import BarChart from '../../components/BarChart'
import { githubApiService } from '../../services/githubApi'
import { transformGitHubData, calculateAverageMetrics } from '../../services/dataTransform'
import { CopilotMetricsResponse, LineChartData } from '../../types/metrics'

const LiveUsage = () => {
  const [metrics, setMetrics] = useState<CopilotMetricsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState(new Date())

  const loadMetrics = async () => {
    setLoading(true)
    try {
      const githubData = await githubApiService.loadData()
      if (githubData && githubData.length > 0) {
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
    const interval = setInterval(loadMetrics, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  if (loading && !metrics) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white text-xl flex items-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin" />
          Loading live usage metrics...
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
  const latestMetrics = metrics.data[metrics.data.length - 1]

  const chatData: LineChartData[] = [
    {
      id: 'Chat Turns',
      data: metrics.data.slice(-14).map(d => ({
        x: d.date.split('-').slice(1).join('/'),
        y: d.total_chat_turns
      }))
    },
    {
      id: 'Chat Acceptances',
      data: metrics.data.slice(-14).map(d => ({
        x: d.date.split('-').slice(1).join('/'),
        y: d.total_chat_acceptances
      }))
    }
  ]

  const activityData: LineChartData[] = [
    {
      id: 'Active Users',
      data: metrics.data.slice(-14).map(d => ({
        x: d.date.split('-').slice(1).join('/'),
        y: d.total_active_users
      }))
    },
    {
      id: 'Chat Users',
      data: metrics.data.slice(-14).map(d => ({
        x: d.date.split('-').slice(1).join('/'),
        y: d.total_active_chat_users
      }))
    }
  ]

  const languageData = metrics.languages?.slice(0, 10).map(l => ({
    language: l.name,
    users: l.total_engaged_users
  })) || []

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-white">Live Usage Metrics</h1>
            <span className="px-3 py-1 bg-green-500 bg-opacity-20 text-green-400 text-xs font-semibold rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              LIVE
            </span>
          </div>
          <p className="text-slate-400">Real-time usage patterns and activity</p>
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
          {lastRefresh.toLocaleString()}
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
          title="Total Active Users"
          value={latestMetrics.total_active_users}
          change="All features"
          icon={<Activity className="w-6 h-6" />}
          trend="up"
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

      <div className="grid grid-cols-1 gap-6">
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
