import { useMemo, useState } from 'react'
import { Zap, MessageSquare, Copy, FileCode, Sparkles } from 'lucide-react'
import { ResponsiveLine } from '@nivo/line'
import DateRangeFilter, { DateRangeType } from '../../components/DateRangeFilter'
import { filterDataByDateRange } from '../../utils/dateFilters'
import { demoEnterpriseMetrics } from '../../data/demoEnterpriseData'

const DemoPerformance = () => {
  const [selectedRange, setSelectedRange] = useState<DateRangeType>('all')

  const metricsData = demoEnterpriseMetrics

  const filteredData = useMemo(() => {
    return filterDataByDateRange(metricsData, selectedRange)
  }, [selectedRange])

  // Calculate performance metrics
  const totalChats = filteredData.reduce((sum, day) => {
    const chats = day.copilot_ide_chat?.editors?.reduce((editorSum, editor) => {
      return editorSum + editor.models.reduce((modelSum, model) => modelSum + model.total_chats, 0)
    }, 0) || 0
    return sum + chats
  }, 0)

  const totalCopyEvents = filteredData.reduce((sum, day) => {
    const copies = day.copilot_ide_chat?.editors?.reduce((editorSum, editor) => {
      return editorSum + editor.models.reduce((modelSum, model) => modelSum + model.total_chat_copy_events, 0)
    }, 0) || 0
    return sum + copies
  }, 0)

  const totalInsertions = filteredData.reduce((sum, day) => {
    const insertions = day.copilot_ide_chat?.editors?.reduce((editorSum, editor) => {
      return editorSum + editor.models.reduce((modelSum, model) => modelSum + model.total_chat_insertion_events, 0)
    }, 0) || 0
    return sum + insertions
  }, 0)

  const avgChatUsers = filteredData.length > 0
    ? Math.round(filteredData.reduce((sum, d) => sum + (d.copilot_ide_chat?.total_engaged_users || 0), 0) / filteredData.length)
    : 0

  // Chart data
  const chatPerformanceData = [
    {
      id: 'Total Chats',
      color: 'hsl(142, 70%, 50%)',
      data: filteredData.map(day => ({
        x: day.date.substring(5),
        y: day.copilot_ide_chat?.editors?.reduce((sum, editor) => {
          return sum + editor.models.reduce((modelSum, model) => modelSum + model.total_chats, 0)
        }, 0) || 0
      }))
    },
    {
      id: 'Copy Events',
      color: 'hsl(271, 70%, 50%)',
      data: filteredData.map(day => ({
        x: day.date.substring(5),
        y: day.copilot_ide_chat?.editors?.reduce((sum, editor) => {
          return sum + editor.models.reduce((modelSum, model) => modelSum + model.total_chat_copy_events, 0)
        }, 0) || 0
      }))
    },
    {
      id: 'Insertions',
      color: 'hsl(24, 70%, 50%)',
      data: filteredData.map(day => ({
        x: day.date.substring(5),
        y: day.copilot_ide_chat?.editors?.reduce((sum, editor) => {
          return sum + editor.models.reduce((modelSum, model) => modelSum + model.total_chat_insertion_events, 0)
        }, 0) || 0
      }))
    }
  ]

  const chatUsersData = [
    {
      id: 'Chat Users',
      color: 'hsl(217, 70%, 50%)',
      data: filteredData.map(day => ({
        x: day.date.substring(5),
        y: day.copilot_ide_chat?.total_engaged_users || 0
      }))
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-white">Performance Metrics</h1>
          <span className="px-3 py-1 bg-yellow-500 bg-opacity-20 text-yellow-400 text-xs font-semibold rounded-full flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" />
            DEMO DATA
          </span>
        </div>
        <p className="text-slate-400">Detailed performance and productivity metrics (Demo Mode)</p>
      </div>

      <DateRangeFilter
        selectedRange={selectedRange}
        onRangeChange={setSelectedRange}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-400">Total Chat Sessions</h3>
            <MessageSquare className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-white">{totalChats.toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-1">All interactions</p>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-400">Copy Events</h3>
            <Copy className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-white">{totalCopyEvents.toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-1">Copied suggestions</p>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-400">Code Insertions</h3>
            <FileCode className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-3xl font-bold text-white">{totalInsertions.toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-1">Accepted insertions</p>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-400">Avg Chat Users</h3>
            <Zap className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-white">{avgChatUsers.toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-1">Daily average</p>
        </div>
      </div>

      {/* Chat Performance Metrics */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-xl font-semibold text-white mb-6">Chat Performance Metrics</h2>
        <div className="h-80">
          <ResponsiveLine
            data={chatPerformanceData}
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
              legend: 'Count',
              legendOffset: -50,
              legendPosition: 'middle'
            }}
            colors={{ datum: 'color' }}
            pointSize={8}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
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
                symbolShape: 'circle'
              }
            ]}
            theme={{
              axis: {
                ticks: { text: { fill: '#94a3b8' } },
                legend: { text: { fill: '#cbd5e1', fontSize: 12 } }
              },
              grid: { line: { stroke: '#334155', strokeWidth: 1 } },
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

      {/* Chat Users Trend */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-xl font-semibold text-white mb-6">Chat Users Trend</h2>
        <div className="h-80">
          <ResponsiveLine
            data={chatUsersData}
            margin={{ top: 20, right: 40, bottom: 60, left: 60 }}
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
              legend: 'Engaged Users',
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
                ticks: { text: { fill: '#94a3b8' } },
                legend: { text: { fill: '#cbd5e1', fontSize: 12 } }
              },
              grid: { line: { stroke: '#334155', strokeWidth: 1 } },
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

      {/* Demo Notice */}
      <div className="bg-yellow-500 bg-opacity-10 border border-yellow-500 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-yellow-400 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-yellow-400 mb-1">Demo Mode</h3>
            <p className="text-sm text-slate-300">
              You're viewing sample performance data. To see real data, download metrics from the Admin Settings page.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DemoPerformance
