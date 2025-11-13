import { useState, useMemo } from 'react'
import { Calendar, Users, Code, TrendingUp, Sparkles, Cpu, FileCode } from 'lucide-react'
import { ResponsiveLine } from '@nivo/line'
import { ResponsiveBar } from '@nivo/bar'
import { ResponsivePie } from '@nivo/pie'
import DateRangeFilter, { DateRangeType } from '../../../components/DateRangeFilter'
import { filterDataByDateRange } from '../../../utils/dateFilters'
import { demo28DayReportData } from '../../../data/demo28DayReport'

const DemoReport28Day = () => {
  const [selectedRange, setSelectedRange] = useState<DateRangeType>('all')
  const reportData = demo28DayReportData
  const dateRange = {
    from: reportData.report_start_day,
    to: reportData.report_end_day
  }

  // Filter data by date range
  const filteredData = useMemo(() => {
    if (!reportData?.day_totals) return []
    
    // Transform data to match the filter format
    const transformedData = reportData.day_totals.map(day => ({
      date: day.day,
      ...day
    }))
    
    return filterDataByDateRange(transformedData, selectedRange)
  }, [reportData, selectedRange])

  // Calculate summary metrics from filtered data
  const summaryMetrics = useMemo(() => {
    if (!filteredData || filteredData.length === 0) {
      return {
        avgDailyUsers: 0,
        totalInteractions: 0,
        totalCodeGeneration: 0,
        totalCodeAcceptance: 0,
        avgAcceptanceRate: 0,
        totalLinesAdded: 0,
        totalLinesDeleted: 0,
        monthlyActiveUsers: 0,
        monthlyChatUsers: 0,
        monthlyAgentUsers: 0
      }
    }

    const totals = filteredData.reduce((acc, day) => {
      return {
        dailyUsers: acc.dailyUsers + day.daily_active_users,
        interactions: acc.interactions + day.user_initiated_interaction_count,
        codeGeneration: acc.codeGeneration + day.code_generation_activity_count,
        codeAcceptance: acc.codeAcceptance + day.code_acceptance_activity_count,
        linesAdded: acc.linesAdded + day.loc_added_sum,
        linesDeleted: acc.linesDeleted + day.loc_deleted_sum,
        monthlyUsers: Math.max(acc.monthlyUsers, day.monthly_active_users),
        monthlyChatUsers: Math.max(acc.monthlyChatUsers, day.monthly_active_chat_users),
        monthlyAgentUsers: Math.max(acc.monthlyAgentUsers, day.monthly_active_agent_users)
      }
    }, {
      dailyUsers: 0,
      interactions: 0,
      codeGeneration: 0,
      codeAcceptance: 0,
      linesAdded: 0,
      linesDeleted: 0,
      monthlyUsers: 0,
      monthlyChatUsers: 0,
      monthlyAgentUsers: 0
    })

    const avgAcceptanceRate = totals.codeGeneration > 0
      ? (totals.codeAcceptance / totals.codeGeneration) * 100
      : 0

    return {
      avgDailyUsers: totals.dailyUsers / filteredData.length,
      totalInteractions: totals.interactions,
      totalCodeGeneration: totals.codeGeneration,
      totalCodeAcceptance: totals.codeAcceptance,
      avgAcceptanceRate,
      totalLinesAdded: totals.linesAdded,
      totalLinesDeleted: totals.linesDeleted,
      monthlyActiveUsers: totals.monthlyUsers,
      monthlyChatUsers: totals.monthlyChatUsers,
      monthlyAgentUsers: totals.monthlyAgentUsers
    }
  }, [filteredData])

  // Daily activity trend data
  const dailyActivityData = useMemo(() => {
    if (!filteredData) return []
    
    return [{
      id: 'Active Users',
      data: filteredData.map(day => ({
        x: day.day,
        y: day.daily_active_users
      }))
    }, {
      id: 'Code Generation',
      data: filteredData.map(day => ({
        x: day.day,
        y: day.code_generation_activity_count
      }))
    }]
  }, [filteredData])

  // Feature usage data
  const featureUsageData = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return []

    const featureTotals: Record<string, number> = {}
    
    filteredData.forEach(day => {
      day.totals_by_feature.forEach(feature => {
        if (!featureTotals[feature.feature]) {
          featureTotals[feature.feature] = 0
        }
        featureTotals[feature.feature] += feature.code_generation_activity_count
      })
    })

    return Object.entries(featureTotals)
      .map(([feature, count]) => ({
        id: feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        label: feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        value: count
      }))
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value)
  }, [filteredData])

  // Language usage data
  const languageUsageData = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return []

    const languageTotals: Record<string, number> = {}
    
    filteredData.forEach(day => {
      day.totals_by_language_model.forEach(lang => {
        if (lang.language === 'unknown') return
        if (!languageTotals[lang.language]) {
          languageTotals[lang.language] = 0
        }
        languageTotals[lang.language] += lang.code_generation_activity_count
      })
    })

    return Object.entries(languageTotals)
      .map(([language, count]) => ({
        language: language,
        count: count
      }))
      .filter(item => item.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10) // Top 10 languages
  }, [filteredData])

  // Model usage data
  const modelUsageData = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return []

    const modelTotals: Record<string, number> = {}
    
    filteredData.forEach(day => {
      day.totals_by_model_feature.forEach(model => {
        if (model.model === 'unknown') return
        if (!modelTotals[model.model]) {
          modelTotals[model.model] = 0
        }
        modelTotals[model.model] += model.code_generation_activity_count
      })
    })

    return Object.entries(modelTotals)
      .map(([model, count]) => ({
        id: model,
        label: model,
        value: count
      }))
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value)
  }, [filteredData])

  // Lines of code trend
  const linesOfCodeTrend = useMemo(() => {
    if (!filteredData) return []
    
    return [{
      id: 'Lines Added',
      data: filteredData.map(day => ({
        x: day.day,
        y: day.loc_added_sum
      }))
    }, {
      id: 'Lines Deleted',
      data: filteredData.map(day => ({
        x: day.day,
        y: day.loc_deleted_sum
      }))
    }]
  }, [filteredData])

  if (!reportData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-slate-400 text-lg mb-4">No 28-day report data available</p>
          <p className="text-slate-500 text-sm">Download the report from the Admin page to view this data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Enterprise 28-Day Report</h1>
          <p className="text-slate-400">Comprehensive analysis of Copilot usage and productivity</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500 bg-opacity-20 border border-yellow-500 rounded-lg">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <span className="text-sm font-semibold text-yellow-400">DEMO DATA</span>
          </div>
        </div>
      </div>

      {/* Date Range Filter and Info */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Calendar className="w-4 h-4" />
          <span>Report Period: {dateRange.from} to {dateRange.to}</span>
          <span className="text-slate-500">•</span>
          <span>{filteredData.length} of {reportData.day_totals.length} days shown</span>
        </div>
        <DateRangeFilter
          selectedRange={selectedRange}
          onRangeChange={setSelectedRange}
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-blue-500" />
            <span className="text-xs font-semibold text-blue-500 bg-blue-500/10 px-2 py-1 rounded">
              USERS
            </span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{summaryMetrics.monthlyActiveUsers.toFixed(0)}</div>
          <div className="text-sm text-slate-400">Monthly Active Users</div>
          <div className="text-xs text-slate-500 mt-1">Avg Daily: {summaryMetrics.avgDailyUsers.toFixed(1)}</div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <Sparkles className="w-8 h-8 text-purple-500" />
            <span className="text-xs font-semibold text-purple-500 bg-purple-500/10 px-2 py-1 rounded">
              INTERACTIONS
            </span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{summaryMetrics.totalInteractions.toLocaleString()}</div>
          <div className="text-sm text-slate-400">Total Interactions</div>
          <div className="text-xs text-slate-500 mt-1">Avg: {(summaryMetrics.totalInteractions / filteredData.length).toFixed(0)}/day</div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <Code className="w-8 h-8 text-green-500" />
            <span className="text-xs font-semibold text-green-500 bg-green-500/10 px-2 py-1 rounded">
              CODE GEN
            </span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{summaryMetrics.totalCodeGeneration.toLocaleString()}</div>
          <div className="text-sm text-slate-400">Code Generations</div>
          <div className="text-xs text-slate-500 mt-1">Acceptance Rate: {summaryMetrics.avgAcceptanceRate.toFixed(1)}%</div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <FileCode className="w-8 h-8 text-orange-500" />
            <span className="text-xs font-semibold text-orange-500 bg-orange-500/10 px-2 py-1 rounded">
              LINES
            </span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{summaryMetrics.totalLinesAdded.toLocaleString()}</div>
          <div className="text-sm text-slate-400">Lines Added</div>
          <div className="text-xs text-slate-500 mt-1">Deleted: {summaryMetrics.totalLinesDeleted.toLocaleString()}</div>
        </div>
      </div>

      {/* Additional User Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center gap-3 mb-3">
            <Sparkles className="w-6 h-6 text-cyan-500" />
            <h3 className="text-lg font-semibold text-white">Chat Users</h3>
          </div>
          <div className="text-2xl font-bold text-white">{summaryMetrics.monthlyChatUsers}</div>
          <div className="text-sm text-slate-400 mt-1">Monthly active chat users</div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center gap-3 mb-3">
            <Cpu className="w-6 h-6 text-pink-500" />
            <h3 className="text-lg font-semibold text-white">Agent Users</h3>
          </div>
          <div className="text-2xl font-bold text-white">{summaryMetrics.monthlyAgentUsers}</div>
          <div className="text-sm text-slate-400 mt-1">Monthly active agent users</div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="w-6 h-6 text-yellow-500" />
            <h3 className="text-lg font-semibold text-white">Code Acceptance</h3>
          </div>
          <div className="text-2xl font-bold text-white">{summaryMetrics.totalCodeAcceptance.toLocaleString()}</div>
          <div className="text-sm text-slate-400 mt-1">Total acceptances</div>
        </div>
      </div>

      {/* Daily Activity Trend */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Daily Activity Trend</h3>
        <div style={{ height: '400px' }}>
          <ResponsiveLine
            data={dailyActivityData}
            margin={{ top: 20, right: 120, bottom: 60, left: 60 }}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
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
            colors={{ scheme: 'category10' }}
            pointSize={8}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabelYOffset={-12}
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
                symbolSize: 12,
                symbolShape: 'circle'
              }
            ]}
            theme={{
              axis: {
                ticks: { text: { fill: '#94a3b8' } },
                legend: { text: { fill: '#cbd5e1' } }
              },
              grid: { line: { stroke: '#334155' } },
              legends: { text: { fill: '#cbd5e1' } },
              tooltip: {
                container: {
                  background: '#1e293b',
                  color: '#fff',
                  fontSize: 12,
                  borderRadius: '4px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.25)'
                }
              }
            }}
          />
        </div>
      </div>

      {/* Feature Usage & Model Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feature Usage */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Feature Usage Distribution</h3>
          <div style={{ height: '350px' }}>
            <ResponsivePie
              data={featureUsageData}
              margin={{ top: 20, right: 80, bottom: 80, left: 80 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              colors={{ scheme: 'category10' }}
              borderWidth={1}
              borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
              arcLinkLabelsSkipAngle={10}
              arcLinkLabelsTextColor="#cbd5e1"
              arcLinkLabelsThickness={2}
              arcLinkLabelsColor={{ from: 'color' }}
              arcLabelsSkipAngle={10}
              arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
              theme={{
                labels: { text: { fill: '#cbd5e1' } },
                legends: { text: { fill: '#cbd5e1' } },
                tooltip: {
                  container: {
                    background: '#1e293b',
                    color: '#fff',
                    fontSize: 12,
                    borderRadius: '4px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.25)'
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Model Distribution */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">AI Model Usage</h3>
          <div style={{ height: '350px' }}>
            <ResponsivePie
              data={modelUsageData}
              margin={{ top: 20, right: 80, bottom: 80, left: 80 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              colors={{ scheme: 'set2' }}
              borderWidth={1}
              borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
              arcLinkLabelsSkipAngle={10}
              arcLinkLabelsTextColor="#cbd5e1"
              arcLinkLabelsThickness={2}
              arcLinkLabelsColor={{ from: 'color' }}
              arcLabelsSkipAngle={10}
              arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
              theme={{
                labels: { text: { fill: '#cbd5e1' } },
                legends: { text: { fill: '#cbd5e1' } },
                tooltip: {
                  container: {
                    background: '#1e293b',
                    color: '#fff',
                    fontSize: 12,
                    borderRadius: '4px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.25)'
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Language Usage */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Top Programming Languages</h3>
        <div style={{ height: '400px' }}>
          <ResponsiveBar
            data={languageUsageData}
            keys={['count']}
            indexBy="language"
            margin={{ top: 20, right: 30, bottom: 60, left: 60 }}
            padding={0.3}
            colors={{ scheme: 'nivo' }}
            borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: -45,
              legend: 'Language',
              legendPosition: 'middle',
              legendOffset: 50
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Code Generations',
              legendPosition: 'middle',
              legendOffset: -50
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
            theme={{
              axis: {
                ticks: { text: { fill: '#94a3b8' } },
                legend: { text: { fill: '#cbd5e1' } }
              },
              grid: { line: { stroke: '#334155' } },
              labels: { text: { fill: '#cbd5e1' } },
              tooltip: {
                container: {
                  background: '#1e293b',
                  color: '#fff',
                  fontSize: 12,
                  borderRadius: '4px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.25)'
                }
              }
            }}
          />
        </div>
      </div>

      {/* Lines of Code Trend */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Lines of Code Trend</h3>
        <div style={{ height: '400px' }}>
          <ResponsiveLine
            data={linesOfCodeTrend}
            margin={{ top: 20, right: 120, bottom: 60, left: 60 }}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
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
              legend: 'Lines of Code',
              legendOffset: -50,
              legendPosition: 'middle'
            }}
            colors={{ scheme: 'set1' }}
            pointSize={8}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabelYOffset={-12}
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
                symbolSize: 12,
                symbolShape: 'circle'
              }
            ]}
            theme={{
              axis: {
                ticks: { text: { fill: '#94a3b8' } },
                legend: { text: { fill: '#cbd5e1' } }
              },
              grid: { line: { stroke: '#334155' } },
              legends: { text: { fill: '#cbd5e1' } },
              tooltip: {
                container: {
                  background: '#1e293b',
                  color: '#fff',
                  fontSize: 12,
                  borderRadius: '4px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.25)'
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default DemoReport28Day
