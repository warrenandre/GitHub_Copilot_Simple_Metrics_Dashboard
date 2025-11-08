import { useEffect, useState } from 'react'
import { Users, UserPlus, Percent, TrendingUp, RefreshCw, AlertCircle } from 'lucide-react'
import MetricCard from '../../components/MetricCard'
import LineChart from '../../components/LineChart'
import PieChart from '../../components/PieChart'
import BarChart from '../../components/BarChart'
import { githubApiService } from '../../services/githubApi'
import { transformGitHubData, getAdoptionTrend } from '../../services/dataTransform'
import { CopilotMetricsResponse, LineChartData, ChartData } from '../../types/metrics'

const LiveAdoption = () => {
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
          Loading live adoption metrics...
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

  const adoptionTrend = getAdoptionTrend(metrics.data)
  const latestMetrics = metrics.data[metrics.data.length - 1]
  const avgActiveUsers = Math.round(metrics.data.reduce((sum, d) => sum + d.total_active_users, 0) / metrics.data.length)
  
  const userTrendData: LineChartData[] = [
    {
      id: 'Total Active Users',
      data: metrics.data.slice(-30).map(d => ({
        x: d.date.split('-').slice(1).join('/'),
        y: d.total_active_users
      }))
    },
    {
      id: 'Active Chat Users',
      data: metrics.data.slice(-30).map(d => ({
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
            <h1 className="text-3xl font-bold text-white">Live Adoption Metrics</h1>
            <span className="px-3 py-1 bg-green-500 bg-opacity-20 text-green-400 text-xs font-semibold rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              LIVE
            </span>
          </div>
          <p className="text-slate-400">Real-time user engagement and adoption patterns</p>
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
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Adoption Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-slate-400">Adoption Highlights</h4>
            <div className="space-y-2 text-sm text-slate-300">
              <p><span className="font-semibold text-white">{latestMetrics.total_active_users}</span> developers actively using Copilot</p>
              <p><span className="font-semibold text-white">{chatAdoptionRate}%</span> chat feature adoption rate</p>
              <p><span className="font-semibold text-white">{metrics.editors?.length || 0}</span> different editors in use</p>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-slate-400">Growth Opportunities</h4>
            <ul className="space-y-2 text-sm text-slate-300">
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
            <h4 className="text-sm font-medium text-slate-400">Success Metrics</h4>
            <ul className="space-y-2 text-sm text-slate-300">
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
