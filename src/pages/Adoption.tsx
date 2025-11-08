import { useEffect, useState } from 'react'
import { Users, UserPlus, Percent, TrendingUp } from 'lucide-react'
import MetricCard from '../components/MetricCard'
import LineChart from '../components/LineChart'
import PieChart from '../components/PieChart'
import BarChart from '../components/BarChart'
import { metricsService } from '../services/api'
import { CopilotMetricsResponse, LineChartData, ChartData } from '../types/metrics'

const Adoption = () => {
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
        <div className="text-white text-xl">Loading adoption metrics...</div>
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
  const latestMetrics = metrics.data[metrics.data.length - 1]
  
  // Active users over time
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

  // Editor distribution
  const editorData: ChartData[] = metrics.editors?.map(e => ({
    id: e.name,
    label: e.name,
    value: e.total_engaged_users
  })) || []

  // Language adoption
  const languageData = metrics.languages?.slice(0, 8).map(l => ({
    language: l.name,
    users: l.total_engaged_users
  })) || []

  // Calculate chat adoption rate
  const chatAdoptionRate = latestMetrics.total_active_users > 0
    ? (latestMetrics.total_active_chat_users / latestMetrics.total_active_users * 100).toFixed(1)
    : 0

  // Calculate total engaged users
  const totalEditorUsers = metrics.editors?.reduce((sum, e) => sum + e.total_engaged_users, 0) || 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Adoption Metrics</h1>
        <p className="text-slate-400">User engagement and adoption patterns</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Active Users"
          value={latestMetrics.total_active_users}
          change={`${avgMetrics.avgActiveUsers} avg daily`}
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

export default Adoption
