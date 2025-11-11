import { useEffect, useState } from 'react'
import { Activity, MessageSquare, Zap } from 'lucide-react'
import MetricCard from '../components/MetricCard'
import LineChart from '../components/LineChart'
import BarChart from '../components/BarChart'
import DateRangeSelector, { DateRange } from '../components/DateRangeSelector'
import { metricsService } from '../services/api'
import { CopilotMetricsResponse, LineChartData } from '../types/metrics'

const Usage = () => {
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
        <div className="text-white dark:text-white light:text-gray-900 text-xl">Loading usage metrics...</div>
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
  const latestMetrics = filteredData[filteredData.length - 1]

  // Chat metrics over time
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

  // User activity data
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

  // Language breakdown
  const languageData = metrics.languages?.slice(0, 10).map(l => ({
    language: l.name,
    users: l.total_engaged_users
  })) || []

  // Mock model usage per day for demo
  const modelUsageData: LineChartData[] = [
    {
      id: 'Default Model',
      data: filteredData.map(d => ({
        x: d.date.split('-').slice(1).join('/'),
        y: Math.floor(d.total_active_users * 0.85) // 85% use default model
      }))
    },
    {
      id: 'Custom Model',
      data: filteredData.map(d => ({
        x: d.date.split('-').slice(1).join('/'),
        y: Math.floor(d.total_active_users * 0.15) // 15% use custom model
      }))
    }
  ]

  const defaultModelUsers = Math.floor(latestMetrics.total_active_users * 0.85)
  const customModelUsers = Math.floor(latestMetrics.total_active_users * 0.15)

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white dark:text-white light:text-gray-900 mb-2">Usage Metrics</h1>
          <p className="text-slate-400 dark:text-slate-400 light:text-gray-600">Detailed analysis of Copilot usage patterns</p>
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
          change={`${customModelUsers} custom`}
          icon={<Zap className="w-6 h-6" />}
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

export default Usage
