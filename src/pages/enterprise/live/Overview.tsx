import { useState, useEffect, useMemo } from 'react'
import { Users, Activity, MessageSquare, Code, TrendingUp, Calendar, RefreshCw } from 'lucide-react'
import { ResponsiveLine } from '@nivo/line'
import DateRangeFilter, { DateRangeType } from '../../../components/DateRangeFilter'
import { filterDataByDateRange } from '../../../utils/dateFilters'

interface MetricsData {
  date: string
  total_active_users: number
  total_engaged_users: number
  copilot_ide_code_completions?: {
    total_engaged_users: number
    editors?: Array<{
      name: string
      total_engaged_users: number
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

const EnterpriseOverview = () => {
  const [metricsData, setMetricsData] = useState<MetricsData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState({ from: '', to: '' })
  const [selectedRange, setSelectedRange] = useState<DateRangeType>('all')

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
        } else if (Array.isArray(metrics) && metrics.length > 0) {
          setDateRange({
            from: metrics[0].date,
            to: metrics[metrics.length - 1].date
          })
        }
      } else {
        setError('No enterprise metrics data available')
      }
    } catch (err) {
      setError('Failed to load enterprise metrics data')
      console.error('Error loading metrics data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMetricsData()
  }, [])

  // Filter data based on selected date range
  const filteredData = useMemo(() => {
    return filterDataByDateRange(metricsData, selectedRange)
  }, [metricsData, selectedRange])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-2" />
          <p className="text-slate-400">Loading enterprise metrics...</p>
        </div>
      </div>
    )
  }

  if (error || metricsData.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Enterprise Overview</h1>
          <p className="text-slate-400">Enterprise-wide GitHub Copilot metrics and insights</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-8 text-center border border-slate-700">
          <Activity className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Enterprise Data Available</h3>
          <p className="text-slate-400 mb-4">
            Please download enterprise metrics data from the Admin Settings page.
          </p>
        </div>
      </div>
    )
  }

  // Calculate summary statistics
  const totalActiveUsers = filteredData.reduce((sum, day) => sum + (day.total_active_users || 0), 0)
  const avgActiveUsers = filteredData.length > 0 ? Math.round(totalActiveUsers / filteredData.length) : 0
  
  const totalChats = filteredData.reduce((sum, day) => {
    const chats = day.copilot_ide_chat?.editors?.reduce((editorSum, editor) => {
      return editorSum + editor.models.reduce((modelSum, model) => modelSum + model.total_chats, 0)
    }, 0) || 0
    return sum + chats
  }, 0)

  const codeCompletionDays = filteredData.filter(day => 
    day.copilot_ide_code_completions && day.copilot_ide_code_completions.total_engaged_users > 0
  ).length

  const chatDays = filteredData.filter(day => 
    day.copilot_ide_chat && day.copilot_ide_chat.total_engaged_users > 0
  ).length

  // Prepare chart data
  const activityChartData = [
    {
      id: 'Active Users',
      color: 'hsl(24, 70%, 50%)',
      data: filteredData.map(day => ({
        x: day.date.substring(5),
        y: day.total_active_users || 0
      }))
    },
    {
      id: 'Engaged Users',
      color: 'hsl(217, 70%, 50%)',
      data: filteredData.map(day => ({
        x: day.date.substring(5),
        y: day.total_engaged_users || 0
      }))
    }
  ]

  const chatActivityData = [
    {
      id: 'Chat Sessions',
      color: 'hsl(142, 70%, 50%)',
      data: filteredData.map(day => ({
        x: day.date.substring(5),
        y: day.copilot_ide_chat?.editors?.reduce((sum, editor) => {
          return sum + editor.models.reduce((modelSum, model) => modelSum + model.total_chats, 0)
        }, 0) || 0
      }))
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Enterprise Overview</h1>
          <p className="text-slate-400">Enterprise-wide GitHub Copilot metrics and insights</p>
        </div>
        <div className="flex items-center gap-3">
          <DateRangeFilter
            selectedRange={selectedRange}
            onRangeChange={setSelectedRange}
          />
          <button
            onClick={loadMetricsData}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
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
            <Users className="w-8 h-8 text-orange-500" />
            <span className="text-xs font-semibold text-orange-500 bg-orange-500/10 px-2 py-1 rounded">
              USERS
            </span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{avgActiveUsers}</div>
          <div className="text-sm text-slate-400">Avg Active Users/Day</div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <MessageSquare className="w-8 h-8 text-green-500" />
            <span className="text-xs font-semibold text-green-500 bg-green-500/10 px-2 py-1 rounded">
              CHAT
            </span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{totalChats.toLocaleString()}</div>
          <div className="text-sm text-slate-400">Total Chat Sessions</div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <Code className="w-8 h-8 text-blue-500" />
            <span className="text-xs font-semibold text-blue-500 bg-blue-500/10 px-2 py-1 rounded">
              CODE
            </span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{codeCompletionDays}</div>
          <div className="text-sm text-slate-400">Days with Completions</div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-purple-500" />
            <span className="text-xs font-semibold text-purple-500 bg-purple-500/10 px-2 py-1 rounded">
              ACTIVITY
            </span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{chatDays}</div>
          <div className="text-sm text-slate-400">Days with Chat Activity</div>
        </div>
      </div>

      {/* User Activity Trend */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">User Activity Trend</h3>
        <div style={{ height: '300px' }}>
          <ResponsiveLine
            data={activityChartData}
            margin={{ top: 20, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear', min: 0, max: 'auto' }}
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
              legend: 'Users',
              legendOffset: -50,
              legendPosition: 'middle'
            }}
            colors={{ datum: 'color' }}
            pointSize={8}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabelYOffset={-12}
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
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: 'circle',
                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemBackground: 'rgba(0, 0, 0, .03)',
                      itemOpacity: 1
                    }
                  }
                ]
              }
            ]}
          />
        </div>
      </div>

      {/* Chat Activity Trend */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Chat Activity Trend</h3>
        <div style={{ height: '300px' }}>
          <ResponsiveLine
            data={chatActivityData}
            margin={{ top: 20, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear', min: 0, max: 'auto' }}
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
              legend: 'Chat Sessions',
              legendOffset: -50,
              legendPosition: 'middle'
            }}
            colors={{ datum: 'color' }}
            pointSize={8}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabelYOffset={-12}
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
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: 'circle',
                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemBackground: 'rgba(0, 0, 0, .03)',
                      itemOpacity: 1
                    }
                  }
                ]
              }
            ]}
          />
        </div>
      </div>
    </div>
  )
}

export default EnterpriseOverview
