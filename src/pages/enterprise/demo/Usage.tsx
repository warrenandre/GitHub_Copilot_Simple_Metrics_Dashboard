import { useMemo, useState } from 'react'
import { Activity, TrendingUp, Code, Zap, Sparkles, Calendar } from 'lucide-react'
import { ResponsiveLine } from '@nivo/line'
import DateRangeFilter, { DateRangeType } from '../../../components/DateRangeFilter'
import { filterDataByDateRange } from '../../../utils/dateFilters'
import { demoEnterpriseMetrics } from '../../../data/demoEnterpriseData'

const DemoUsage = () => {
  const [selectedRange, setSelectedRange] = useState<DateRangeType>('all')

  const metricsData = demoEnterpriseMetrics
  
  const dateRange = metricsData.length > 0 ? {
    from: metricsData[0].date,
    to: metricsData[metricsData.length - 1].date
  } : { from: '', to: '' }

  const filteredData = useMemo(() => {
    return filterDataByDateRange(metricsData, selectedRange)
  }, [selectedRange])

  // Calculate usage statistics
  const totalActiveUsers = filteredData.reduce((sum, day) => sum + (day.total_active_users || 0), 0)
  const avgActiveUsers = filteredData.length > 0 ? Math.round(totalActiveUsers / filteredData.length) : 0
  
  const totalEngaged = filteredData.reduce((sum, day) => sum + (day.total_engaged_users || 0), 0)
  const avgEngaged = filteredData.length > 0 ? Math.round(totalEngaged / filteredData.length) : 0

  const codeCompletionUsers = filteredData.reduce((sum, day) => 
    sum + (day.copilot_ide_code_completions?.total_engaged_users || 0), 0
  )
  const avgCodeCompletionUsers = filteredData.length > 0 ? Math.round(codeCompletionUsers / filteredData.length) : 0

  const chatUsers = filteredData.reduce((sum, day) => 
    sum + (day.copilot_ide_chat?.total_engaged_users || 0), 0
  )
  const avgChatUsers = filteredData.length > 0 ? Math.round(chatUsers / filteredData.length) : 0

  // Chart data
  const usageChartData = [
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

  const featureUsageData = [
    {
      id: 'Code Completions',
      color: 'hsl(142, 70%, 50%)',
      data: filteredData.map(day => ({
        x: day.date.substring(5),
        y: day.copilot_ide_code_completions?.total_engaged_users || 0
      }))
    },
    {
      id: 'Chat',
      color: 'hsl(271, 70%, 50%)',
      data: filteredData.map(day => ({
        x: day.date.substring(5),
        y: day.copilot_ide_chat?.total_engaged_users || 0
      }))
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-white">Enterprise Usage Metrics</h1>
            <span className="px-3 py-1 bg-yellow-500 bg-opacity-20 text-yellow-400 text-xs font-semibold rounded-full flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              DEMO DATA
            </span>
          </div>
          <p className="text-slate-400">Code completions, chat usage, and language breakdown</p>
        </div>
        <div className="flex items-center gap-3">
          <DateRangeFilter
            selectedRange={selectedRange}
            onRangeChange={setSelectedRange}
          />
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
            <Activity className="w-8 h-8 text-orange-500" />
            <span className="text-xs font-semibold text-orange-500 bg-orange-500/10 px-2 py-1 rounded">
              ACTIVE
            </span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{avgActiveUsers}</div>
          <div className="text-sm text-slate-400">Avg Active Users/Day</div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-blue-500" />
            <span className="text-xs font-semibold text-blue-500 bg-blue-500/10 px-2 py-1 rounded">
              ENGAGED
            </span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{avgEngaged}</div>
          <div className="text-sm text-slate-400">Avg Engaged Users/Day</div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <Code className="w-8 h-8 text-green-500" />
            <span className="text-xs font-semibold text-green-500 bg-green-500/10 px-2 py-1 rounded">
              CODE
            </span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{avgCodeCompletionUsers}</div>
          <div className="text-sm text-slate-400">Avg Code Users/Day</div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <Zap className="w-8 h-8 text-purple-500" />
            <span className="text-xs font-semibold text-purple-500 bg-purple-500/10 px-2 py-1 rounded">
              CHAT
            </span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{avgChatUsers}</div>
          <div className="text-sm text-slate-400">Avg Chat Users/Day</div>
        </div>
      </div>

      {/* Usage Trends Chart */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Usage Trends</h3>
        <div style={{ height: '300px' }}>
          <ResponsiveLine
            data={usageChartData}
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
              legend: 'Users',
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
              legends: {
                text: { fill: '#cbd5e1' }
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

      {/* Feature Usage */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-xl font-semibold text-white mb-6">Feature Usage Breakdown</h2>
        <div className="h-80">
          <ResponsiveLine
            data={featureUsageData}
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
              legends: {
                text: { fill: '#cbd5e1' }
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

      {/* Demo Notice */}
      <div className="bg-yellow-500 bg-opacity-10 border border-yellow-500 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-yellow-400 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-yellow-400 mb-1">Demo Mode</h3>
            <p className="text-sm text-slate-300">
              You're viewing sample usage data. To see real data, download metrics from the Admin Settings page.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DemoUsage
