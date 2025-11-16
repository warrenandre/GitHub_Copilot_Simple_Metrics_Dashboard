import { useState, useEffect, useMemo } from 'react'
import { Code, MessageSquare, TrendingUp, FileCode, RefreshCw, Calendar } from 'lucide-react'
import { ResponsiveBar } from '@nivo/bar'
import { ResponsivePie } from '@nivo/pie'
import DateRangeFilter, { DateRangeType } from '../../../components/DateRangeFilter'
import DataSourceToggle from '../../../components/DataSourceToggle'
import { filterDataByDateRange } from '../../../utils/dateFilters'
import { demoEnterpriseMetrics } from '../../../data/demoEnterpriseData'

interface MetricsData {
  date: string
  copilot_ide_code_completions?: {
    total_engaged_users: number
    languages?: Array<{
      name: string
      total_engaged_users: number
    }>
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
  copilot_ide_chat?: {
    total_engaged_users: number
    editors?: Array<{
      name: string
      models: Array<{
        total_chats: number
        total_chat_copy_events: number
        total_chat_insertion_events: number
      }>
    }>
  }
}

const EnterpriseUsageMetrics = () => {
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
          <p className="text-slate-400">Loading usage metrics...</p>
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
            <h1 className="text-3xl font-bold text-white mb-2">Enterprise Usage Metrics</h1>
            <p className="text-slate-400">Code completion and chat usage statistics</p>
          </div>
          <DataSourceToggle isDemo={isDemo} onToggle={setIsDemo} />
        </div>
        <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-200 mb-3 flex items-center gap-2">
            <Code className="w-5 h-5" />
            No Live Data Available
          </h3>
          <p className="text-yellow-100/80 mb-4">
            There is currently no live data available. To view live enterprise usage metrics:
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

  // Calculate code completion statistics
  const codeStats = filteredData.reduce((acc, day) => {
    day.copilot_ide_code_completions?.editors?.forEach(editor => {
      editor.models?.forEach(model => {
        model.languages?.forEach(lang => {
          acc.totalSuggestions += lang.total_code_suggestions || 0
          acc.totalAcceptances += lang.total_code_acceptances || 0
          acc.totalLinesSuggested += lang.total_code_lines_suggested || 0
          acc.totalLinesAccepted += lang.total_code_lines_accepted || 0
        })
      })
    })
    return acc
  }, { totalSuggestions: 0, totalAcceptances: 0, totalLinesSuggested: 0, totalLinesAccepted: 0 })

  // Calculate chat statistics
  const chatStats = filteredData.reduce((acc, day) => {
    day.copilot_ide_chat?.editors?.forEach(editor => {
      editor.models?.forEach(model => {
        acc.totalChats += model.total_chats || 0
        acc.totalCopyEvents += model.total_chat_copy_events || 0
        acc.totalInsertionEvents += model.total_chat_insertion_events || 0
      })
    })
    return acc
  }, { totalChats: 0, totalCopyEvents: 0, totalInsertionEvents: 0 })

  // Aggregate language usage
  const languageUsage: Record<string, number> = {}
  filteredData.forEach(day => {
    day.copilot_ide_code_completions?.editors?.forEach(editor => {
      editor.models?.forEach(model => {
        model.languages?.forEach(lang => {
          languageUsage[lang.name] = (languageUsage[lang.name] || 0) + lang.total_code_suggestions
        })
      })
    })
  })

  const languageChartData = Object.entries(languageUsage)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, value]) => ({
      id: name,
      label: name,
      value: value,
      color: `hsl(${Math.random() * 360}, 70%, 50%)`
    }))

  // Daily usage trend
  const dailyUsageData = filteredData.map(day => {
    const suggestions = day.copilot_ide_code_completions?.editors?.reduce((sum, editor) => {
      return sum + (editor.models?.reduce((modelSum, model) => {
        return modelSum + (model.languages?.reduce((langSum, lang) => {
          return langSum + lang.total_code_suggestions
        }, 0) || 0)
      }, 0) || 0)
    }, 0) || 0

    const chats = day.copilot_ide_chat?.editors?.reduce((sum, editor) => {
      return sum + (editor.models?.reduce((modelSum, model) => {
        return modelSum + model.total_chats
      }, 0) || 0)
    }, 0) || 0

    return {
      date: day.date.substring(5), // Show only MM-DD
      'Code Suggestions': suggestions,
      'Chat Sessions': chats
    }
  })

  const acceptanceRate = codeStats.totalSuggestions > 0
    ? ((codeStats.totalAcceptances / codeStats.totalSuggestions) * 100).toFixed(1)
    : '0'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Enterprise Usage Metrics</h1>
          <p className="text-slate-400">Code completions, chat usage, and language breakdown</p>
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <Code className="w-8 h-8 text-blue-500" />
            <span className="text-xs font-semibold text-blue-500 bg-blue-500/10 px-2 py-1 rounded">
              SUGGESTIONS
            </span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{codeStats.totalSuggestions.toLocaleString()}</div>
          <div className="text-sm text-slate-400">Total Code Suggestions</div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-green-500" />
            <span className="text-xs font-semibold text-green-500 bg-green-500/10 px-2 py-1 rounded">
              ACCEPTANCE
            </span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{acceptanceRate}%</div>
          <div className="text-sm text-slate-400">Acceptance Rate</div>
          <div className="text-xs text-slate-500 mt-1">{codeStats.totalAcceptances.toLocaleString()} accepted</div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <MessageSquare className="w-8 h-8 text-purple-500" />
            <span className="text-xs font-semibold text-purple-500 bg-purple-500/10 px-2 py-1 rounded">
              CHAT
            </span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{chatStats.totalChats.toLocaleString()}</div>
          <div className="text-sm text-slate-400">Chat Sessions</div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <FileCode className="w-8 h-8 text-orange-500" />
            <span className="text-xs font-semibold text-orange-500 bg-orange-500/10 px-2 py-1 rounded">
              LINES
            </span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{codeStats.totalLinesAccepted.toLocaleString()}</div>
          <div className="text-sm text-slate-400">Lines of Code Accepted</div>
          <div className="text-xs text-slate-500 mt-1">{codeStats.totalLinesSuggested.toLocaleString()} suggested</div>
        </div>
      </div>

      {/* Daily Usage Trend */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Daily Usage Trend</h3>
        <div style={{ height: '350px' }}>
          <ResponsiveBar
            data={dailyUsageData}
            keys={['Code Suggestions', 'Chat Sessions']}
            indexBy="date"
            margin={{ top: 20, right: 130, bottom: 50, left: 60 }}
            padding={0.3}
            valueScale={{ type: 'linear' }}
            colors={['#3b82f6', '#a855f7']}
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
              legend: 'Count',
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
                translateX: 120,
                translateY: 0,
                itemsSpacing: 2,
                itemWidth: 100,
                itemHeight: 20,
                itemDirection: 'left-to-right',
                itemOpacity: 0.85,
                symbolSize: 20,
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemOpacity: 1
                    }
                  }
                ]
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

      {/* Language Distribution */}
      {languageChartData.length > 0 && (
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Language Distribution (Top 10)</h3>
          <div style={{ height: '400px' }}>
            <ResponsivePie
              data={languageChartData}
              margin={{ top: 40, right: 120, bottom: 40, left: 40 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              activeOuterRadiusOffset={8}
              borderWidth={1}
              borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
              arcLinkLabelsSkipAngle={10}
              arcLinkLabelsTextColor="#cbd5e1"
              arcLinkLabelsThickness={2}
              arcLinkLabelsColor={{ from: 'color' }}
              arcLabelsSkipAngle={10}
              arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
              theme={{
                labels: {
                  text: { fill: '#cbd5e1' }
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
              legends={[
                {
                  anchor: 'right',
                  direction: 'column',
                  justify: false,
                  translateX: 100,
                  translateY: 0,
                  itemsSpacing: 4,
                  itemWidth: 80,
                  itemHeight: 18,
                  itemTextColor: '#cbd5e1',
                  itemDirection: 'left-to-right',
                  itemOpacity: 1,
                  symbolSize: 14,
                  symbolShape: 'circle',
                  effects: [
                    {
                      on: 'hover',
                      style: {
                        itemTextColor: '#fff'
                      }
                    }
                  ]
                }
              ]}
            />
          </div>
        </div>
      )}

      {/* Chat Interaction Stats */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Chat Interaction Stats</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 rounded-lg p-4">
            <div className="text-2xl font-bold text-white mb-1">{chatStats.totalChats.toLocaleString()}</div>
            <div className="text-sm text-slate-400">Total Chat Sessions</div>
          </div>
          <div className="bg-slate-900 rounded-lg p-4">
            <div className="text-2xl font-bold text-white mb-1">{chatStats.totalCopyEvents.toLocaleString()}</div>
            <div className="text-sm text-slate-400">Copy Events</div>
          </div>
          <div className="bg-slate-900 rounded-lg p-4">
            <div className="text-2xl font-bold text-white mb-1">{chatStats.totalInsertionEvents.toLocaleString()}</div>
            <div className="text-sm text-slate-400">Code Insertions</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EnterpriseUsageMetrics
