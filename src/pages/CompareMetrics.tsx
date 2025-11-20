import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Calendar, BarChart3, AlertCircle } from 'lucide-react'
import { ResponsiveBar } from '@nivo/bar'
import { ResponsiveLine } from '@nivo/line'
import { useTheme } from '../contexts/ThemeContext'
import DataSourceToggle from '../components/DataSourceToggle'

interface MetricOption {
  id: string
  name: string
  category: 'copilot' | 'pr' | 'general'
  description: string
}

interface ComparisonData {
  metric: string
  current: number
  previous: number
  change: number
  changePercent: number
}

const CompareMetrics = () => {
  const { theme } = useTheme()
  const [isDemo, setIsDemo] = useState(false)
  const [selectedMetric, setSelectedMetric] = useState<string>('acceptances')
  const [comparisonPeriod, setComparisonPeriod] = useState<'week' | 'month'>('week')
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null)

  const metricOptions: MetricOption[] = [
    // Copilot Metrics
    { id: 'acceptances', name: 'Copilot Acceptances', category: 'copilot', description: 'Number of suggestions accepted' },
    { id: 'suggestions', name: 'Copilot Suggestions', category: 'copilot', description: 'Total suggestions shown' },
    { id: 'acceptance_rate', name: 'Acceptance Rate', category: 'copilot', description: 'Percentage of accepted suggestions' },
    { id: 'active_users', name: 'Active Copilot Users', category: 'copilot', description: 'Users with Copilot activity' },
    { id: 'lines_suggested', name: 'Lines Suggested', category: 'copilot', description: 'Total lines suggested by Copilot' },
    { id: 'lines_accepted', name: 'Lines Accepted', category: 'copilot', description: 'Total lines accepted' },
    
    // PR Metrics
    { id: 'pr_total', name: 'Total Pull Requests', category: 'pr', description: 'Total number of PRs' },
    { id: 'pr_merged', name: 'Merged PRs', category: 'pr', description: 'PRs successfully merged' },
    { id: 'pr_open', name: 'Open PRs', category: 'pr', description: 'Currently open PRs' },
    { id: 'pr_closed', name: 'Closed PRs', category: 'pr', description: 'PRs closed without merging' },
    { id: 'pr_merge_time', name: 'Avg Time to Merge', category: 'pr', description: 'Average time from open to merge (hours)' },
    { id: 'pr_contributors', name: 'PR Contributors', category: 'pr', description: 'Unique contributors' },
    
    // General Metrics
    { id: 'commits', name: 'Total Commits', category: 'general', description: 'Number of commits' },
    { id: 'contributors', name: 'Active Contributors', category: 'general', description: 'Contributors with activity' },
    { id: 'code_changes', name: 'Lines Changed', category: 'general', description: 'Total lines added/removed' },
  ]

  // Generate comparison data based on selected metric and period
  useEffect(() => {
    generateComparisonData()
  }, [selectedMetric, comparisonPeriod, isDemo])

  const generateComparisonData = () => {
    if (!isDemo) {
      // In live mode, would fetch real data here
      setComparisonData(null)
      return
    }

    // Demo data generation
    const baseValues: { [key: string]: { current: number, variability: number } } = {
      acceptances: { current: 1250, variability: 0.15 },
      suggestions: { current: 2100, variability: 0.12 },
      acceptance_rate: { current: 59.5, variability: 0.08 },
      active_users: { current: 24, variability: 0.1 },
      lines_suggested: { current: 8400, variability: 0.2 },
      lines_accepted: { current: 5200, variability: 0.18 },
      pr_total: { current: 45, variability: 0.2 },
      pr_merged: { current: 38, variability: 0.15 },
      pr_open: { current: 5, variability: 0.3 },
      pr_closed: { current: 2, variability: 0.5 },
      pr_merge_time: { current: 18.5, variability: 0.25 },
      pr_contributors: { current: 12, variability: 0.15 },
      commits: { current: 320, variability: 0.2 },
      contributors: { current: 18, variability: 0.12 },
      code_changes: { current: 15600, variability: 0.25 },
    }

    const metric = baseValues[selectedMetric] || baseValues.acceptances
    const periodMultiplier = comparisonPeriod === 'month' ? 4 : 1
    
    const current = metric.current * periodMultiplier
    const variation = (Math.random() - 0.5) * 2 * metric.variability
    const previous = current * (1 - variation)
    const change = current - previous
    const changePercent = (change / previous) * 100

    setComparisonData({
      metric: selectedMetric,
      current: Math.round(current * 10) / 10,
      previous: Math.round(previous * 10) / 10,
      change: Math.round(change * 10) / 10,
      changePercent: Math.round(changePercent * 10) / 10,
    })
  }

  const getChartData = () => {
    if (!comparisonData) return []

    const periodLabel = comparisonPeriod === 'week' ? 'Week' : 'Month'
    return [
      {
        period: `Previous ${periodLabel}`,
        value: comparisonData.previous,
        color: theme === 'dark' ? '#64748b' : '#94a3b8',
      },
      {
        period: `Current ${periodLabel}`,
        value: comparisonData.current,
        color: comparisonData.change >= 0 ? '#10b981' : '#ef4444',
      },
    ]
  }

  const getTrendData = () => {
    if (!comparisonData) return []

    const points = comparisonPeriod === 'week' ? 7 : 30
    const data: { x: number; y: number }[] = []
    
    for (let i = 0; i < points; i++) {
      const progress = i / (points - 1)
      const value = comparisonData.previous + (comparisonData.change * progress)
      const noise = (Math.random() - 0.5) * (comparisonData.current * 0.05)
      data.push({ x: i, y: Math.max(0, value + noise) })
    }

    return [
      {
        id: metricOptions.find(m => m.id === selectedMetric)?.name || 'Metric',
        data,
      },
    ]
  }

  const selectedMetricInfo = metricOptions.find(m => m.id === selectedMetric)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-blue-500" />
          <div>
            <h1 className="text-3xl font-bold text-white">Compare Metrics</h1>
            <p className="text-slate-400 mt-1">Compare any metric across time periods</p>
          </div>
        </div>
        <DataSourceToggle isDemo={isDemo} onToggle={setIsDemo} />
      </div>

      {/* Live Mode Banner */}
      {!isDemo && (
        <div className="bg-orange-900/20 border border-orange-700/50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-orange-100">
              <p className="font-semibold mb-1">Live Data Mode</p>
              <p className="text-orange-200">
                Connect your repositories in the Repository List page to view live metric comparisons.
                Switch to Demo Mode to explore with sample data.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Demo Mode Banner */}
      {isDemo && (
        <div className="bg-purple-900/20 border border-purple-700/50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-purple-100">
              <p className="font-semibold mb-1">Demo Mode Active</p>
              <p className="text-purple-200">
                Viewing sample comparison data. Switch to Live mode to compare your actual metrics.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Selection Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Metric Selection */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
            <BarChart3 className="w-4 h-4" />
            Select Metric
          </label>
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <optgroup label="Copilot Metrics">
              {metricOptions.filter(m => m.category === 'copilot').map(option => (
                <option key={option.id} value={option.id}>{option.name}</option>
              ))}
            </optgroup>
            <optgroup label="Pull Request Metrics">
              {metricOptions.filter(m => m.category === 'pr').map(option => (
                <option key={option.id} value={option.id}>{option.name}</option>
              ))}
            </optgroup>
            <optgroup label="General Metrics">
              {metricOptions.filter(m => m.category === 'general').map(option => (
                <option key={option.id} value={option.id}>{option.name}</option>
              ))}
            </optgroup>
          </select>
          {selectedMetricInfo && (
            <p className="text-xs text-slate-400 mt-2">{selectedMetricInfo.description}</p>
          )}
        </div>

        {/* Period Selection */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
            <Calendar className="w-4 h-4" />
            Comparison Period
          </label>
          <div className="flex gap-3">
            <button
              onClick={() => setComparisonPeriod('week')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                comparisonPeriod === 'week'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-700'
              }`}
            >
              Week over Week
            </button>
            <button
              onClick={() => setComparisonPeriod('month')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                comparisonPeriod === 'month'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-700'
              }`}
            >
              Month over Month
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Compare current {comparisonPeriod} with previous {comparisonPeriod}
          </p>
        </div>
      </div>

      {/* Comparison Results */}
      {isDemo && comparisonData && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Current Period */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                <Calendar className="w-4 h-4" />
                Current {comparisonPeriod === 'week' ? 'Week' : 'Month'}
              </div>
              <div className="text-3xl font-bold text-white">
                {comparisonData.current.toLocaleString()}
              </div>
            </div>

            {/* Previous Period */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                <Calendar className="w-4 h-4" />
                Previous {comparisonPeriod === 'week' ? 'Week' : 'Month'}
              </div>
              <div className="text-3xl font-bold text-slate-300">
                {comparisonData.previous.toLocaleString()}
              </div>
            </div>

            {/* Change */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                {comparisonData.change >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                Change
              </div>
              <div className={`text-3xl font-bold ${
                comparisonData.change >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {comparisonData.change >= 0 ? '+' : ''}{comparisonData.change.toLocaleString()}
              </div>
            </div>

            {/* Percent Change */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                {comparisonData.changePercent >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                % Change
              </div>
              <div className={`text-3xl font-bold ${
                comparisonData.changePercent >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {comparisonData.changePercent >= 0 ? '+' : ''}{comparisonData.changePercent}%
              </div>
            </div>
          </div>

          {/* Visualizations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart Comparison */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Period Comparison</h3>
              <div style={{ height: '300px' }}>
                <ResponsiveBar
                  data={getChartData()}
                  keys={['value']}
                  indexBy="period"
                  margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
                  padding={0.3}
                  valueScale={{ type: 'linear' }}
                  colors={(bar) => bar.data.color}
                  borderRadius={4}
                  axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: '',
                    legendPosition: 'middle',
                    legendOffset: 40,
                  }}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: selectedMetricInfo?.name || 'Value',
                    legendPosition: 'middle',
                    legendOffset: -50,
                  }}
                  labelTextColor="#ffffff"
                  theme={{
                    axis: {
                      ticks: {
                        text: { fill: theme === 'dark' ? '#cbd5e1' : '#64748b' }
                      },
                      legend: {
                        text: { fill: theme === 'dark' ? '#cbd5e1' : '#64748b' }
                      }
                    },
                    grid: {
                      line: {
                        stroke: theme === 'dark' ? '#334155' : '#e2e8f0',
                      }
                    }
                  }}
                />
              </div>
            </div>

            {/* Trend Line Chart */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Trend Over Time</h3>
              <div style={{ height: '300px' }}>
                <ResponsiveLine
                  data={getTrendData()}
                  margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
                  xScale={{ type: 'linear', min: 'auto', max: 'auto' }}
                  yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
                  curve="monotoneX"
                  axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: comparisonPeriod === 'week' ? 'Day' : 'Day of Month',
                    legendPosition: 'middle',
                    legendOffset: 40,
                  }}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Value',
                    legendPosition: 'middle',
                    legendOffset: -50,
                  }}
                  colors={['#3b82f6']}
                  lineWidth={3}
                  pointSize={6}
                  pointColor="#3b82f6"
                  pointBorderWidth={2}
                  pointBorderColor={{ from: 'serieColor' }}
                  enableArea={true}
                  areaOpacity={0.1}
                  useMesh={true}
                  theme={{
                    axis: {
                      ticks: {
                        text: { fill: theme === 'dark' ? '#cbd5e1' : '#64748b' }
                      },
                      legend: {
                        text: { fill: theme === 'dark' ? '#cbd5e1' : '#64748b' }
                      }
                    },
                    grid: {
                      line: {
                        stroke: theme === 'dark' ? '#334155' : '#e2e8f0',
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              Insights
            </h3>
            <div className="space-y-3 text-slate-300">
              {comparisonData.changePercent >= 10 && (
                <p className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>
                    Strong growth of <strong className="text-green-400">{comparisonData.changePercent}%</strong> in {selectedMetricInfo?.name.toLowerCase()} compared to last {comparisonPeriod}.
                  </span>
                </p>
              )}
              {comparisonData.changePercent < -10 && (
                <p className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">!</span>
                  <span>
                    Decline of <strong className="text-red-400">{Math.abs(comparisonData.changePercent)}%</strong> in {selectedMetricInfo?.name.toLowerCase()} compared to last {comparisonPeriod}.
                  </span>
                </p>
              )}
              {Math.abs(comparisonData.changePercent) < 10 && (
                <p className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">→</span>
                  <span>
                    Relatively stable performance with <strong>{Math.abs(comparisonData.changePercent)}%</strong> change compared to last {comparisonPeriod}.
                  </span>
                </p>
              )}
              <p className="text-sm text-slate-400 mt-4">
                Track metrics over time to identify trends, measure improvements, and make data-driven decisions about your development workflow.
              </p>
            </div>
          </div>
        </>
      )}

      {/* Empty State for Live Mode */}
      {!isDemo && (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-12 text-center">
          <BarChart3 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Data Available</h3>
          <p className="text-slate-400 mb-6">
            Configure your repositories and fetch metrics to start comparing data.
          </p>
          <button
            onClick={() => setIsDemo(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            View Demo Data
          </button>
        </div>
      )}
    </div>
  )
}

export default CompareMetrics
