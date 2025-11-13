import { useMemo, useState } from 'react'
import { Users, Activity, MessageSquare, Code, TrendingUp, Sparkles } from 'lucide-react'
import { ResponsiveLine } from '@nivo/line'
import DateRangeFilter, { DateRangeType } from '../../components/DateRangeFilter'
import { filterDataByDateRange } from '../../utils/dateFilters'
import { demoEnterpriseMetrics } from '../../data/demoEnterpriseData'

const DemoOverview = () => {
  const [selectedRange, setSelectedRange] = useState<DateRangeType>('all')

  // Use demo data directly
  const metricsData = demoEnterpriseMetrics

  // Filter data based on selected date range
  const filteredData = useMemo(() => {
    return filterDataByDateRange(metricsData, selectedRange)
  }, [selectedRange])

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
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-white">Enterprise Overview</h1>
          <span className="px-3 py-1 bg-yellow-500 bg-opacity-20 text-yellow-400 text-xs font-semibold rounded-full flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" />
            DEMO DATA
          </span>
        </div>
        <p className="text-slate-400">Enterprise-wide GitHub Copilot metrics and insights (Demo Mode)</p>
      </div>

      <DateRangeFilter
        selectedRange={selectedRange}
        onRangeChange={setSelectedRange}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-400">Avg Active Users</h3>
            <Users className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-3xl font-bold text-white">{avgActiveUsers.toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-1">Daily average</p>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-400">Total Chat Sessions</h3>
            <MessageSquare className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-white">{totalChats.toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-1">Across all days</p>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-400">Code Completion Days</h3>
            <Code className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-white">{codeCompletionDays}</p>
          <p className="text-xs text-slate-400 mt-1">Days with activity</p>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-400">Chat Active Days</h3>
            <Activity className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-white">{chatDays}</p>
          <p className="text-xs text-slate-400 mt-1">Days with chat</p>
        </div>
      </div>

      {/* Activity Trends Chart */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-orange-500" />
          <h2 className="text-xl font-semibold text-white">User Activity Trends</h2>
        </div>
        <div className="h-80">
          <ResponsiveLine
            data={activityChartData}
            margin={{ top: 20, right: 120, bottom: 60, left: 60 }}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false }}
            curve="monotoneX"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: -45,
              legend: 'Date',
              legendOffset: 50,
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
            enablePointLabel={false}
            useMesh={true}
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
            theme={{
              axis: {
                ticks: {
                  text: { fill: '#94a3b8' }
                },
                legend: {
                  text: { fill: '#cbd5e1', fontSize: 12 }
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
                  color: '#f1f5f9',
                  fontSize: '12px',
                  borderRadius: '6px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
                }
              }
            }}
          />
        </div>
      </div>

      {/* Chat Activity Chart */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="flex items-center gap-3 mb-6">
          <MessageSquare className="w-6 h-6 text-green-500" />
          <h2 className="text-xl font-semibold text-white">Chat Activity</h2>
        </div>
        <div className="h-80">
          <ResponsiveLine
            data={chatActivityData}
            margin={{ top: 20, right: 120, bottom: 60, left: 60 }}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
            curve="monotoneX"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: -45,
              legend: 'Date',
              legendOffset: 50,
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
            useMesh={true}
            theme={{
              axis: {
                ticks: {
                  text: { fill: '#94a3b8' }
                },
                legend: {
                  text: { fill: '#cbd5e1', fontSize: 12 }
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
                  color: '#f1f5f9',
                  fontSize: '12px',
                  borderRadius: '6px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
                }
              }
            }}
          />
        </div>
      </div>

      {/* Demo Mode Notice */}
      <div className="bg-yellow-500 bg-opacity-10 border border-yellow-500 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-yellow-400 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-yellow-400 mb-1">Demo Mode</h3>
            <p className="text-sm text-slate-300">
              You're viewing sample enterprise metrics data. To see real data, download metrics from the Admin Settings page.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DemoOverview
