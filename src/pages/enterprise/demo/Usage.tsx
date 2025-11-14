import { useMemo, useState } from 'react'
import { TrendingUp, Code, MessageSquare, Sparkles, Calendar, FileCode } from 'lucide-react'
import { ResponsiveBar } from '@nivo/bar'
import { ResponsivePie } from '@nivo/pie'
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

  // Calculate code completion statistics (simulated from demo data)
  const codeStats = useMemo(() => {
    const totalSuggestions = filteredData.reduce((sum, day) => 
      sum + (day.copilot_ide_code_completions?.total_engaged_users || 0) * 150, 0
    )
    const totalAcceptances = Math.round(totalSuggestions * 0.28) // 28% acceptance rate
    const totalLinesSuggested = totalSuggestions * 8
    const totalLinesAccepted = totalAcceptances * 8

    return {
      totalSuggestions,
      totalAcceptances,
      totalLinesSuggested,
      totalLinesAccepted
    }
  }, [filteredData])

  // Calculate chat statistics (simulated from demo data)
  const chatStats = useMemo(() => {
    const totalChats = filteredData.reduce((sum, day) => 
      sum + (day.copilot_ide_chat?.total_engaged_users || 0) * 12, 0
    )
    return {
      totalChats,
      totalCopyEvents: Math.round(totalChats * 0.35),
      totalInsertionEvents: Math.round(totalChats * 0.42)
    }
  }, [filteredData])

  // Language usage data (simulated)
  const languageChartData = useMemo(() => {
    const languages = [
      { id: 'JavaScript', label: 'JavaScript', value: 3245, color: 'hsl(60, 70%, 50%)' },
      { id: 'Python', label: 'Python', value: 2876, color: 'hsl(210, 70%, 50%)' },
      { id: 'TypeScript', label: 'TypeScript', value: 2543, color: 'hsl(200, 70%, 50%)' },
      { id: 'Java', label: 'Java', value: 1987, color: 'hsl(15, 70%, 50%)' },
      { id: 'C#', label: 'C#', value: 1654, color: 'hsl(270, 70%, 50%)' },
      { id: 'Go', label: 'Go', value: 1432, color: 'hsl(180, 70%, 50%)' },
      { id: 'Ruby', label: 'Ruby', value: 1123, color: 'hsl(350, 70%, 50%)' },
      { id: 'PHP', label: 'PHP', value: 987, color: 'hsl(240, 70%, 50%)' },
      { id: 'C++', label: 'C++', value: 876, color: 'hsl(30, 70%, 50%)' },
      { id: 'Rust', label: 'Rust', value: 654, color: 'hsl(20, 70%, 50%)' }
    ]
    
    // Scale based on filtered data
    const scale = filteredData.length / metricsData.length
    return languages.map(lang => ({
      ...lang,
      value: Math.round(lang.value * scale)
    }))
  }, [filteredData, metricsData.length])

  // Daily usage trend data (for bar chart)
  const dailyUsageData = useMemo(() => {
    return filteredData.map(day => ({
      date: day.date.substring(5), // Show only MM-DD
      'Code Suggestions': (day.copilot_ide_code_completions?.total_engaged_users || 0) * 150,
      'Chat Sessions': (day.copilot_ide_chat?.total_engaged_users || 0) * 12
    }))
  }, [filteredData])

  const acceptanceRate = codeStats.totalSuggestions > 0
    ? ((codeStats.totalAcceptances / codeStats.totalSuggestions) * 100).toFixed(1)
    : '0'

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
