import { useState, useEffect, useMemo } from 'react'
import { Gauge, TrendingUp, Target, Zap, RefreshCw, Calendar } from 'lucide-react'
import { ResponsiveLine } from '@nivo/line'
import { ResponsiveBar } from '@nivo/bar'
import DateRangeFilter, { DateRangeType } from '../../../components/DateRangeFilter'
import DataSourceToggle from '../../../components/DataSourceToggle'
import { filterDataByDateRange } from '../../../utils/dateFilters'
import { demoEnterpriseMetrics } from '../../../data/demoEnterpriseData'

interface MetricsData {
  date: string
  total_active_users: number
  copilot_ide_code_completions?: {
    total_engaged_users: number
    editors?: Array<{
      name: string
      models: Array<{
        languages?: Array<{
          name: string
          total_code_suggestions: number
          total_code_acceptances: number
          total_code_lines_suggested: number
          total_code_lines_accepted: number
        }>
      }>
    }>
  }
}

const EnterprisePerformance = () => {
  const [metricsData, setMetricsData] = useState<MetricsData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState({ from: '', to: '' })
  const [selectedRange, setSelectedRange] = useState<DateRangeType>('all')
  const [isDemo, setIsDemo] = useState(false)

  const loadMetricsData = () => {
    setLoading(true)
    setError(null)

    try {
      const data = localStorage.getItem('copilot_enterprise_metrics_data')
      
      if (data) {
        const parsedData = JSON.parse(data)
        const metrics = parsedData.data || parsedData
        setMetricsData(Array.isArray(metrics) ? metrics : [])
        
        if (parsedData.metadata?.dateRange) {
          setDateRange(parsedData.metadata.dateRange)
        }
      } else {
        // Don't auto-switch to demo, just clear data to show no data message
        setMetricsData([])
      }
    } catch (err) {
      console.error('Error loading metrics data:', err)
      setMetricsData([])
      setError('Failed to load metrics data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isDemo) {
      loadMetricsData()
    } else {
      // Use demo data
      setMetricsData(demoEnterpriseMetrics as unknown as MetricsData[])
      setDateRange({
        from: demoEnterpriseMetrics[0]?.date || '',
        to: demoEnterpriseMetrics[demoEnterpriseMetrics.length - 1]?.date || ''
      })
      setLoading(false)
      setError(null)
    }
  }, [isDemo])

  // Filter data based on selected date range
  const filteredData = useMemo(() => {
    return filterDataByDateRange(metricsData, selectedRange)
  }, [metricsData, selectedRange])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-2" />
          <p className="text-slate-400">Loading performance metrics...</p>
        </div>
      </div>
    )
  }

  // Show no data message when live mode is selected but no data is available
  if (!isDemo && (error || metricsData.length === 0)) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Enterprise Performance</h1>
            <p className="text-slate-400">Acceptance rates and performance analytics</p>
          </div>
          <DataSourceToggle isDemo={isDemo} onToggle={setIsDemo} />
        </div>
        <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-200 mb-3 flex items-center gap-2">
            <Gauge className="w-5 h-5" />
            No Live Data Available
          </h3>
          <p className="text-yellow-100/80 mb-4">
            There is currently no live data available. To view live enterprise performance metrics:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-yellow-100/80 mb-4 ml-2">
            <li>Go to the <strong>Admin Settings</strong> page</li>
            <li>Configure your GitHub Enterprise access token</li>
            <li>Download enterprise metrics data using the "Download Data" button</li>
            <li>Return to this page to view your live metrics</li>
          </ol>
          <p className="text-yellow-100/80">
            In the meantime, switch to <strong>Demo</strong> mode using the toggle above to explore the dashboard with sample data.
          </p>
        </div>
      </div>
    )
  }

  // Calculate performance metrics
  const performanceMetrics = filteredData.reduce((acc, day) => {
    let daySuggestions = 0
    let dayAcceptances = 0
    let dayLinesSuggested = 0
    let dayLinesAccepted = 0

    day.copilot_ide_code_completions?.editors?.forEach(editor => {
      editor.models?.forEach(model => {
        model.languages?.forEach(lang => {
          daySuggestions += lang.total_code_suggestions || 0
          dayAcceptances += lang.total_code_acceptances || 0
          dayLinesSuggested += lang.total_code_lines_suggested || 0
          dayLinesAccepted += lang.total_code_lines_accepted || 0
        })
      })
    })

    acc.totalSuggestions += daySuggestions
    acc.totalAcceptances += dayAcceptances
    acc.totalLinesSuggested += dayLinesSuggested
    acc.totalLinesAccepted += dayLinesAccepted

    if (daySuggestions > 0) {
      acc.daysWithActivity++
    }

    return acc
  }, {
    totalSuggestions: 0,
    totalAcceptances: 0,
    totalLinesSuggested: 0,
    totalLinesAccepted: 0,
    daysWithActivity: 0
  })

  const overallAcceptanceRate = performanceMetrics.totalSuggestions > 0
    ? ((performanceMetrics.totalAcceptances / performanceMetrics.totalSuggestions) * 100)
    : 0

  const lineAcceptanceRate = performanceMetrics.totalLinesSuggested > 0
    ? ((performanceMetrics.totalLinesAccepted / performanceMetrics.totalLinesSuggested) * 100)
    : 0

  const avgSuggestionsPerActiveDay = performanceMetrics.daysWithActivity > 0
    ? performanceMetrics.totalSuggestions / performanceMetrics.daysWithActivity
    : 0

  const avgAcceptancesPerActiveDay = performanceMetrics.daysWithActivity > 0
    ? performanceMetrics.totalAcceptances / performanceMetrics.daysWithActivity
    : 0

  // Daily acceptance rate trend
  const acceptanceRateTrend = filteredData.map(day => {
    let daySuggestions = 0
    let dayAcceptances = 0

    day.copilot_ide_code_completions?.editors?.forEach(editor => {
      editor.models?.forEach(model => {
        model.languages?.forEach(lang => {
          daySuggestions += lang.total_code_suggestions || 0
          dayAcceptances += lang.total_code_acceptances || 0
        })
      })
    })

    const rate = daySuggestions > 0 ? (dayAcceptances / daySuggestions) * 100 : 0

    return {
      x: day.date.substring(5),
      y: parseFloat(rate.toFixed(2))
    }
  })

  // Productivity trend (suggestions per user)
  const productivityTrend = filteredData.map(day => {
    let daySuggestions = 0

    day.copilot_ide_code_completions?.editors?.forEach(editor => {
      editor.models?.forEach(model => {
        model.languages?.forEach(lang => {
          daySuggestions += lang.total_code_suggestions || 0
        })
      })
    })

    const suggestionsPerUser = day.total_active_users > 0
      ? daySuggestions / day.total_active_users
      : 0

    return {
      x: day.date.substring(5),
      y: parseFloat(suggestionsPerUser.toFixed(2))
    }
  })

  // Lines accepted vs suggested per day
  const linesComparisonData = filteredData.map(day => {
    let linesSuggested = 0
    let linesAccepted = 0

    day.copilot_ide_code_completions?.editors?.forEach(editor => {
      editor.models?.forEach(model => {
        model.languages?.forEach(lang => {
          linesSuggested += lang.total_code_lines_suggested || 0
          linesAccepted += lang.total_code_lines_accepted || 0
        })
      })
    })

    return {
      date: day.date.substring(5),
      'Lines Suggested': linesSuggested,
      'Lines Accepted': linesAccepted
    }
  })

  const getPerformanceRating = (rate: number): { label: string; color: string } => {
    if (rate >= 80) return { label: 'Excellent', color: 'text-green-500' }
    if (rate >= 60) return { label: 'Good', color: 'text-blue-500' }
    if (rate >= 40) return { label: 'Fair', color: 'text-yellow-500' }
    return { label: 'Needs Improvement', color: 'text-orange-500' }
  }

  const performanceRating = getPerformanceRating(overallAcceptanceRate)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Enterprise Performance</h1>
          <p className="text-slate-400">Acceptance rates, productivity, and efficiency metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <DataSourceToggle isDemo={isDemo} onToggle={setIsDemo} />
          <DateRangeFilter
            selectedRange={selectedRange}
            onRangeChange={setSelectedRange}
          />
          {!isDemo && (
            <button
              onClick={loadMetricsData}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          )}
        </div>
      </div>

      {/* Date Range */}
      {dateRange.from && dateRange.to && (
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Calendar className="w-4 h-4" />
          <span>Data from {dateRange.from} to {dateRange.to}</span>
          <span className="text-slate-500">•</span>
          <span>{filteredData.length} of {metricsData.length} days shown</span>
        </div>
      )}

      {/* Performance Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <Target className="w-8 h-8 text-green-500" />
            <span className="text-xs font-semibold text-green-500 bg-green-500/10 px-2 py-1 rounded">
              OVERALL
            </span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{overallAcceptanceRate.toFixed(1)}%</div>
          <div className="text-sm text-slate-400">Acceptance Rate</div>
          <div className={`text-xs font-semibold mt-2 ${performanceRating.color}`}>
            {performanceRating.label}
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <Gauge className="w-8 h-8 text-blue-500" />
            <span className="text-xs font-semibold text-blue-500 bg-blue-500/10 px-2 py-1 rounded">
              LINES
            </span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{lineAcceptanceRate.toFixed(1)}%</div>
          <div className="text-sm text-slate-400">Line Acceptance Rate</div>
          <div className="text-xs text-slate-500 mt-1">
            {performanceMetrics.totalLinesAccepted.toLocaleString()} / {performanceMetrics.totalLinesSuggested.toLocaleString()}
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <Zap className="w-8 h-8 text-purple-500" />
            <span className="text-xs font-semibold text-purple-500 bg-purple-500/10 px-2 py-1 rounded">
              DAILY AVG
            </span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{avgSuggestionsPerActiveDay.toFixed(0)}</div>
          <div className="text-sm text-slate-400">Suggestions Per Active Day</div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-orange-500" />
            <span className="text-xs font-semibold text-orange-500 bg-orange-500/10 px-2 py-1 rounded">
              PRODUCTIVITY
            </span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{avgAcceptancesPerActiveDay.toFixed(0)}</div>
          <div className="text-sm text-slate-400">Acceptances Per Active Day</div>
        </div>
      </div>

      {/* Acceptance Rate Trend */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Daily Acceptance Rate Trend</h3>
        <div style={{ height: '300px' }}>
          <ResponsiveLine
            data={[
              {
                id: 'Acceptance Rate',
                color: '#10b981',
                data: acceptanceRateTrend
              }
            ]}
            margin={{ top: 20, right: 30, bottom: 50, left: 60 }}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear', min: 0, max: 100, stacked: false }}
            curve="monotoneX"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: -45,
              legend: 'Date',
              legendOffset: 45,
              legendPosition: 'middle'
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Acceptance Rate (%)',
              legendOffset: -50,
              legendPosition: 'middle',
              format: (value) => `${value}%`
            }}
            enableGridX={false}
            colors={{ scheme: 'category10' }}
            lineWidth={3}
            pointSize={8}
            pointColor={{ from: 'color' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            enablePointLabel={false}
            useMesh={true}
            theme={{
              axis: {
                ticks: {
                  text: { fill: '#94a3b8' }
                },
                legend: {
                  text: { fill: '#cbd5e1' }
                }
              },
              grid: {
                line: {
                  stroke: '#334155',
                  strokeWidth: 1
                }
              },
              tooltip: {
                container: {
                  background: '#1e293b',
                  color: '#fff',
                  fontSize: 12,
                  borderRadius: '4px',
                  boxShadow: '0 3px 9px rgba(0, 0, 0, 0.5)',
                  padding: '9px 12px'
                }
              }
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productivity Trend */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Suggestions Per User</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveLine
              data={[
                {
                  id: 'Suggestions/User',
                  color: '#8b5cf6',
                  data: productivityTrend
                }
              ]}
              margin={{ top: 20, right: 30, bottom: 50, left: 60 }}
              xScale={{ type: 'point' }}
              yScale={{ type: 'linear', min: 'auto', stacked: false }}
              curve="monotoneX"
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: -45,
                legend: 'Date',
                legendOffset: 45,
                legendPosition: 'middle'
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Suggestions',
                legendOffset: -50,
                legendPosition: 'middle'
              }}
              enableGridX={false}
              colors={{ scheme: 'category10' }}
              lineWidth={3}
              pointSize={8}
              pointColor={{ from: 'color' }}
              pointBorderWidth={2}
              pointBorderColor={{ from: 'serieColor' }}
              useMesh={true}
              theme={{
                axis: {
                  ticks: {
                    text: { fill: '#94a3b8' }
                  },
                  legend: {
                    text: { fill: '#cbd5e1' }
                  }
                },
                grid: {
                  line: {
                    stroke: '#334155',
                    strokeWidth: 1
                  }
                },
                tooltip: {
                  container: {
                    background: '#1e293b',
                    color: '#fff',
                    fontSize: 12,
                    borderRadius: '4px',
                    boxShadow: '0 3px 9px rgba(0, 0, 0, 0.5)',
                    padding: '9px 12px'
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Lines Comparison */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Lines: Suggested vs Accepted</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveBar
              data={linesComparisonData}
              keys={['Lines Suggested', 'Lines Accepted']}
              indexBy="date"
              margin={{ top: 20, right: 110, bottom: 50, left: 60 }}
              padding={0.3}
              valueScale={{ type: 'linear' }}
              colors={['#64748b', '#22c55e']}
              borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: -45,
                legend: 'Date',
                legendPosition: 'middle',
                legendOffset: 45
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Lines of Code',
                legendPosition: 'middle',
                legendOffset: -50
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelTextColor="#ffffff"
              legends={[
                {
                  dataFrom: 'keys',
                  anchor: 'bottom-right',
                  direction: 'column',
                  justify: false,
                  translateX: 100,
                  translateY: 0,
                  itemsSpacing: 2,
                  itemWidth: 90,
                  itemHeight: 20,
                  itemDirection: 'left-to-right',
                  itemOpacity: 0.85,
                  symbolSize: 20
                }
              ]}
              theme={{
                axis: {
                  ticks: {
                    text: { fill: '#94a3b8' }
                  },
                  legend: {
                    text: { fill: '#cbd5e1' }
                  }
                },
                grid: {
                  line: {
                    stroke: '#334155',
                    strokeWidth: 1
                  }
                },
                legends: {
                  text: { fill: '#cbd5e1' }
                },
                tooltip: {
                  container: {
                    background: '#1e293b',
                    color: '#fff',
                    fontSize: 12,
                    borderRadius: '4px',
                    boxShadow: '0 3px 9px rgba(0, 0, 0, 0.5)',
                    padding: '9px 12px'
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Performance Indicators */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Performance Indicators</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-1">Total Suggestions</div>
            <div className="text-2xl font-bold text-white">{performanceMetrics.totalSuggestions.toLocaleString()}</div>
          </div>
          <div className="bg-slate-900 rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-1">Total Acceptances</div>
            <div className="text-2xl font-bold text-white">{performanceMetrics.totalAcceptances.toLocaleString()}</div>
          </div>
          <div className="bg-slate-900 rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-1">Active Days</div>
            <div className="text-2xl font-bold text-white">{performanceMetrics.daysWithActivity}</div>
          </div>
          <div className="bg-slate-900 rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-1">Avg Acceptance/Day</div>
            <div className="text-2xl font-bold text-white">{avgAcceptancesPerActiveDay.toFixed(0)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EnterprisePerformance
