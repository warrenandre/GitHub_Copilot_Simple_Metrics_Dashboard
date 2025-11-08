import { useEffect, useState } from 'react'
import { Activity, MessageSquare } from 'lucide-react'
import MetricCard from '../components/MetricCard'
import LineChart from '../components/LineChart'
import BarChart from '../components/BarChart'
import { metricsService } from '../services/api'
import { CopilotMetricsResponse, LineChartData } from '../types/metrics'

const Usage = () => {
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
        <div className="text-white text-xl">Loading usage metrics...</div>
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

  // Chat metrics over time
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

  // User activity data
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

  // Language breakdown
  const languageData = metrics.languages?.slice(0, 10).map(l => ({
    language: l.name,
    users: l.total_engaged_users
  })) || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Usage Metrics</h1>
        <p className="text-slate-400">Detailed analysis of Copilot usage patterns</p>
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

export default Usage
