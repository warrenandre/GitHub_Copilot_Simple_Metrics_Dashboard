import { useEffect, useState } from 'react'
import { Zap, Target, LineChart as LineChartIcon, BarChart3, RefreshCw, AlertCircle } from 'lucide-react'
import MetricCard from '../../components/MetricCard'
import LineChart from '../../components/LineChart'
import DateRangeSelector, { DateRange } from '../../components/DateRangeSelector'
import { githubApiService } from '../../services/githubApi'
import { transformGitHubData, calculateAcceptanceRate } from '../../services/dataTransform'
import { CopilotMetricsResponse, LineChartData } from '../../types/metrics'

const LivePerformance = () => {
  const [metrics, setMetrics] = useState<CopilotMetricsResponse | null>(null)
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

  const acceptanceRate = calculateAcceptanceRate(filteredData)
  
  const totalLinesSuggested = filteredData.reduce((sum, d) => sum + d.total_lines_suggested, 0)
  const totalLinesAccepted = filteredData.reduce((sum, d) => sum + d.total_lines_accepted, 0)
  const lineAcceptanceRate = totalLinesSuggested > 0 
    ? ((totalLinesAccepted / totalLinesSuggested) * 100).toFixed(1)
    : '0'
  
  const avgLinesSuggested = Math.round(totalLinesSuggested / filteredData.length)
  const avgLinesAccepted = Math.round(totalLinesAccepted / filteredData.length)
  
  const acceptanceRateData: LineChartData[] = [
    {
      id: 'Acceptance Rate',
      data: filteredData.map(d => ({
        x: d.date.split('-').slice(1).join('/'),
        y: d.total_suggestions_count > 0 
          ? (d.total_acceptances_count / d.total_suggestions_count * 100)
          : 0
      }))
    }
  ]

  const linesData: LineChartData[] = [
    {
      id: 'Lines Suggested',
      data: filteredData.map(d => ({
        x: d.date.split('-').slice(1).join('/'),
        y: d.total_lines_suggested
      }))
    },
    {
      id: 'Lines Accepted',
      data: filteredData.map(d => ({
        x: d.date.split('-').slice(1).join('/'),
        y: d.total_lines_accepted
      }))
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-white dark:text-white light:text-gray-900">Live Performance Analytics</h1>
            <span className="px-3 py-1 bg-green-500 bg-opacity-20 text-green-400 text-xs font-semibold rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              LIVE
            </span>
          </div>
          <p className="text-slate-400 dark:text-slate-400 light:text-gray-600">Real-time acceptance rates and productivity metrics</p>
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
          title="Acceptance Rate"
          value={`${acceptanceRate.toFixed(1)}%`}
          change="Suggestions to acceptances"
          icon={<Target className="w-6 h-6" />}
          trend="up"
        />
        <MetricCard
          title="Line Acceptance Rate"
          value={`${lineAcceptanceRate}%`}
          change="Lines accepted vs suggested"
          icon={<LineChartIcon className="w-6 h-6" />}
          trend="up"
        />
        <MetricCard
          title="Avg Lines Suggested"
          value={avgLinesSuggested.toLocaleString()}
          change="Per day"
          icon={<Zap className="w-6 h-6" />}
          trend="neutral"
        />
        <MetricCard
          title="Avg Lines Accepted"
          value={avgLinesAccepted.toLocaleString()}
          change="Per day"
          icon={<BarChart3 className="w-6 h-6" />}
          trend="up"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6">
        <LineChart
          data={acceptanceRateData}
          title="Acceptance Rate Trend (Last 14 Days)"
        />
        <LineChart
          data={linesData}
          title="Lines of Code Suggested vs Accepted"
        />
      </div>

      {/* Performance Insights */}
      <div className="bg-slate-800 dark:bg-slate-800 light:bg-white rounded-lg p-6 border border-slate-700 dark:border-slate-700 light:border-gray-200">
        <h3 className="text-lg font-semibold text-white dark:text-white light:text-gray-900 mb-4">Performance Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-slate-400 dark:text-slate-400 light:text-gray-600 mb-2">Key Findings</h4>
            <ul className="space-y-2 text-sm text-slate-300 dark:text-slate-300 light:text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Average acceptance rate of {acceptanceRate.toFixed(1)}% indicates strong adoption</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>{avgLinesAccepted.toLocaleString()} lines of code accepted daily on average</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">ℹ</span>
                <span>Line acceptance rate at {lineAcceptanceRate}%</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-slate-400 dark:text-slate-400 light:text-gray-600 mb-2">Recommendations</h4>
            <ul className="space-y-2 text-sm text-slate-300 dark:text-slate-300 light:text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-yellow-400">→</span>
                <span>Monitor acceptance rates to identify areas for improvement</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400">→</span>
                <span>Share best practices with teams showing lower engagement</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400">→</span>
                <span>Track trends to measure the impact of training initiatives</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LivePerformance
