import { useState, useMemo } from 'react'
import { Calendar, User, Code, TrendingUp, Sparkles, Cpu, FileCode, Users } from 'lucide-react'
import { ResponsiveLine } from '@nivo/line'
import { ResponsiveBar } from '@nivo/bar'
import { ResponsivePie } from '@nivo/pie'
import DateRangeFilter, { DateRangeType } from '../../../components/DateRangeFilter'
import { filterDataByDateRange } from '../../../utils/dateFilters'
import { demoUser28DayReportData } from '../../../data/demoUser28DayReport'

interface UserDayRecord {
  report_start_day: string
  report_end_day: string
  day: string
  enterprise_id: string
  user_id: number
  user_login: string
  user_initiated_interaction_count: number
  code_generation_activity_count: number
  code_acceptance_activity_count: number
  loc_suggested_to_add_sum: number
  loc_suggested_to_delete_sum: number
  loc_added_sum: number
  loc_deleted_sum: number
  used_agent: boolean
  used_chat: boolean
  totals_by_ide: Array<{
    ide: string
    user_initiated_interaction_count: number
    code_generation_activity_count: number
    code_acceptance_activity_count: number
    loc_suggested_to_add_sum: number
    loc_suggested_to_delete_sum: number
    loc_added_sum: number
    loc_deleted_sum: number
  }>
  totals_by_feature: Array<{
    feature: string
    user_initiated_interaction_count: number
    code_generation_activity_count: number
    code_acceptance_activity_count: number
    loc_suggested_to_add_sum: number
    loc_suggested_to_delete_sum: number
    loc_added_sum: number
    loc_deleted_sum: number
  }>
  totals_by_language_feature: Array<{
    language: string
    feature: string
    code_generation_activity_count: number
    code_acceptance_activity_count: number
    loc_suggested_to_add_sum: number
    loc_suggested_to_delete_sum: number
    loc_added_sum: number
    loc_deleted_sum: number
  }>
  totals_by_language_model: Array<{
    language: string
    model: string
    code_generation_activity_count: number
    code_acceptance_activity_count: number
    loc_suggested_to_add_sum: number
    loc_suggested_to_delete_sum: number
    loc_added_sum: number
    loc_deleted_sum: number
  }>
  totals_by_model_feature: Array<{
    model: string
    feature: string
    user_initiated_interaction_count: number
    code_generation_activity_count: number
    code_acceptance_activity_count: number
    loc_suggested_to_add_sum: number
    loc_suggested_to_delete_sum: number
    loc_added_sum: number
    loc_deleted_sum: number
  }>
}

interface UserReportData {
  report_start_day: string
  report_end_day: string
  enterprise_id: string
  records: UserDayRecord[]
}

const DemoUserReport28Day = () => {
  const [selectedRange, setSelectedRange] = useState<DateRangeType>('all')
  const [selectedUser, setSelectedUser] = useState<string>('all')

  // Always use demo data
  const reportData: UserReportData = demoUser28DayReportData

  // Get unique users
  const uniqueUsers = useMemo(() => {
    if (!reportData?.records) return []
    const users = new Set(reportData.records.map(r => r.user_login))
    return Array.from(users).sort()
  }, [reportData])

  // Filter data by user and date range
  const filteredData = useMemo(() => {
    if (!reportData?.records) return []
    
    // Filter by user
    let data = reportData.records
    if (selectedUser !== 'all') {
      data = data.filter(r => r.user_login === selectedUser)
    }

    // Transform data to match the date filter format
    const transformedData = data.map(record => ({
      date: record.day,
      ...record
    }))
    
    return filterDataByDateRange(transformedData, selectedRange)
  }, [reportData, selectedUser, selectedRange])

  // Calculate summary metrics from filtered data
  const summaryMetrics = useMemo(() => {
    if (!filteredData || filteredData.length === 0) {
      return {
        totalRecords: 0,
        uniqueUsers: 0,
        totalInteractions: 0,
        totalCodeGeneration: 0,
        totalCodeAcceptance: 0,
        avgAcceptanceRate: 0,
        totalLinesAdded: 0,
        totalLinesDeleted: 0,
        agentUsers: 0,
        chatUsers: 0
      }
    }

    const totals = filteredData.reduce((acc, record) => {
      return {
        interactions: acc.interactions + record.user_initiated_interaction_count,
        codeGeneration: acc.codeGeneration + record.code_generation_activity_count,
        codeAcceptance: acc.codeAcceptance + record.code_acceptance_activity_count,
        linesAdded: acc.linesAdded + record.loc_added_sum,
        linesDeleted: acc.linesDeleted + record.loc_deleted_sum,
        agentUsers: acc.agentUsers + (record.used_agent ? 1 : 0),
        chatUsers: acc.chatUsers + (record.used_chat ? 1 : 0)
      }
    }, {
      interactions: 0,
      codeGeneration: 0,
      codeAcceptance: 0,
      linesAdded: 0,
      linesDeleted: 0,
      agentUsers: 0,
      chatUsers: 0
    })

    const uniqueUsersInFilter = new Set(filteredData.map(r => r.user_login)).size
    const avgAcceptanceRate = totals.codeGeneration > 0
      ? (totals.codeAcceptance / totals.codeGeneration) * 100
      : 0

    return {
      totalRecords: filteredData.length,
      uniqueUsers: uniqueUsersInFilter,
      totalInteractions: totals.interactions,
      totalCodeGeneration: totals.codeGeneration,
      totalCodeAcceptance: totals.codeAcceptance,
      avgAcceptanceRate,
      totalLinesAdded: totals.linesAdded,
      totalLinesDeleted: totals.linesDeleted,
      agentUsers: totals.agentUsers,
      chatUsers: totals.chatUsers
    }
  }, [filteredData])

  // Daily activity trend data
  const dailyActivityData = useMemo(() => {
    if (!filteredData) return []
    
    // Group by day
    const dayMap = new Map<string, number>()
    filteredData.forEach(record => {
      const current = dayMap.get(record.day) || 0
      dayMap.set(record.day, current + record.code_generation_activity_count)
    })

    const sortedDays = Array.from(dayMap.entries()).sort((a, b) => a[0].localeCompare(b[0]))

    return [{
      id: 'Code Generation',
      data: sortedDays.map(([day, count]) => ({
        x: day,
        y: count
      }))
    }]
  }, [filteredData])

  // Feature usage data
  const featureUsageData = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return []

    const featureTotals: Record<string, number> = {}
    
    filteredData.forEach(record => {
      record.totals_by_feature?.forEach(feature => {
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
    
    filteredData.forEach(record => {
      record.totals_by_language_model?.forEach(lang => {
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
    
    filteredData.forEach(record => {
      record.totals_by_model_feature?.forEach(model => {
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

  // IDE usage data
  const ideUsageData = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return []

    const ideTotals: Record<string, number> = {}
    
    filteredData.forEach(record => {
      record.totals_by_ide?.forEach(ide => {
        if (!ideTotals[ide.ide]) {
          ideTotals[ide.ide] = 0
        }
        ideTotals[ide.ide] += ide.code_generation_activity_count
      })
    })

    return Object.entries(ideTotals)
      .map(([ide, count]) => ({
        id: ide.toUpperCase(),
        label: ide.toUpperCase(),
        value: count
      }))
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value)
  }, [filteredData])

  // Lines of code trend
  const linesOfCodeTrend = useMemo(() => {
    if (!filteredData) return []
    
    // Group by day
    const dayMapAdded = new Map<string, number>()
    const dayMapDeleted = new Map<string, number>()
    filteredData.forEach(record => {
      const currentAdded = dayMapAdded.get(record.day) || 0
      const currentDeleted = dayMapDeleted.get(record.day) || 0
      dayMapAdded.set(record.day, currentAdded + record.loc_added_sum)
      dayMapDeleted.set(record.day, currentDeleted + record.loc_deleted_sum)
    })

    const sortedDays = Array.from(dayMapAdded.keys()).sort((a, b) => a.localeCompare(b))

    return [{
      id: 'Lines Added',
      data: sortedDays.map(day => ({
        x: day,
        y: dayMapAdded.get(day) || 0
      }))
    }, {
      id: 'Lines Deleted',
      data: sortedDays.map(day => ({
        x: day,
        y: dayMapDeleted.get(day) || 0
      }))
    }]
  }, [filteredData])

  const dateRange = {
    from: reportData.report_start_day,
    to: reportData.report_end_day
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-white">User 28-Day Report</h1>
            <span className="px-3 py-1 bg-yellow-500 bg-opacity-20 text-yellow-400 text-xs font-semibold rounded-full flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              DEMO DATA
            </span>
          </div>
          <p className="text-slate-400">Detailed user activity metrics from {dateRange.from} to {dateRange.to}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* User Filter */}
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Users ({uniqueUsers.length})</option>
            {uniqueUsers.map(user => (
              <option key={user} value={user}>{user}</option>
            ))}
          </select>
          
          {/* Date Range Filter */}
          <DateRangeFilter
            selectedRange={selectedRange}
            onRangeChange={setSelectedRange}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Records</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-2">
                {summaryMetrics.totalRecords.toLocaleString()}
              </p>
            </div>
            <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Unique Users</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-2">
                {summaryMetrics.uniqueUsers}
              </p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Code Generations</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-2">
                {summaryMetrics.totalCodeGeneration.toLocaleString()}
              </p>
            </div>
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
              <Code className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Acceptance Rate</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-2">
                {summaryMetrics.avgAcceptanceRate.toFixed(1)}%
              </p>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">User Interactions</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-2">
                {summaryMetrics.totalInteractions.toLocaleString()}
              </p>
            </div>
            <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-lg">
              <User className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Lines Added</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-2">
                {summaryMetrics.totalLinesAdded.toLocaleString()}
              </p>
            </div>
            <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-lg">
              <FileCode className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Agent Users</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-2">
                {summaryMetrics.agentUsers}
              </p>
            </div>
            <div className="bg-pink-100 dark:bg-pink-900/30 p-3 rounded-lg">
              <Cpu className="w-6 h-6 text-pink-600 dark:text-pink-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Chat Users</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-2">
                {summaryMetrics.chatUsers}
              </p>
            </div>
            <div className="bg-cyan-100 dark:bg-cyan-900/30 p-3 rounded-lg">
              <User className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Daily Activity Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Daily Code Generation Activity
        </h2>
        <div className="h-80">
          <ResponsiveLine
            data={dailyActivityData}
            margin={{ top: 20, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false }}
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
              legend: 'Count',
              legendOffset: -50,
              legendPosition: 'middle'
            }}
            colors={{ scheme: 'category10' }}
            pointSize={8}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            enableGridX={false}
            useMesh={true}
            tooltip={({ point }) => (
              <div style={{
                background: '#1F2937',
                padding: '9px 12px',
                border: '1px solid #374151',
                borderRadius: '4px'
              }}>
                <div style={{ color: point.seriesColor, fontWeight: 600 }}>
                  {point.seriesId}
                </div>
                <div style={{ color: '#F9FAFB', marginTop: '4px' }}>
                  Date: {point.data.xFormatted}
                </div>
                <div style={{ color: '#F9FAFB' }}>
                  Count: {point.data.yFormatted}
                </div>
              </div>
            )}
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
                ticks: {
                  text: {
                    fill: '#9CA3AF'
                  }
                },
                legend: {
                  text: {
                    fill: '#9CA3AF'
                  }
                }
              },
              legends: {
                text: {
                  fill: '#9CA3AF'
                }
              },
              tooltip: {
                container: {
                  background: '#1F2937',
                  color: '#F9FAFB'
                }
              }
            }}
          />
        </div>
      </div>

      {/* Feature Usage & IDE Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Feature Usage Distribution
          </h2>
          <div className="h-80">
            {featureUsageData.length > 0 ? (
              <ResponsivePie
                data={featureUsageData}
                margin={{ top: 20, right: 80, bottom: 80, left: 80 }}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                colors={{ scheme: 'nivo' }}
                borderWidth={1}
                borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#9CA3AF"
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: 'color' }}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                tooltip={({ datum }) => (
                  <div style={{
                    background: '#1F2937',
                    padding: '9px 12px',
                    border: '1px solid #374151',
                    borderRadius: '4px'
                  }}>
                    <div style={{ color: datum.color, fontWeight: 600 }}>
                      {datum.label}
                    </div>
                    <div style={{ color: '#F9FAFB', marginTop: '4px' }}>
                      Count: {datum.value.toLocaleString()}
                    </div>
                    <div style={{ color: '#9CA3AF' }}>
                      {((datum.value / featureUsageData.reduce((sum, d) => sum + d.value, 0)) * 100).toFixed(1)}%
                    </div>
                  </div>
                )}
                theme={{
                  tooltip: {
                    container: {
                      background: '#1F2937',
                      color: '#F9FAFB'
                    }
                  }
                }}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                No feature usage data available
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            IDE Distribution
          </h2>
          <div className="h-80">
            {ideUsageData.length > 0 ? (
              <ResponsivePie
                data={ideUsageData}
                margin={{ top: 20, right: 80, bottom: 80, left: 80 }}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                colors={{ scheme: 'set2' }}
                borderWidth={1}
                borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#9CA3AF"
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: 'color' }}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                tooltip={({ datum }) => (
                  <div style={{
                    background: '#1F2937',
                    padding: '9px 12px',
                    border: '1px solid #374151',
                    borderRadius: '4px'
                  }}>
                    <div style={{ color: datum.color, fontWeight: 600 }}>
                      {datum.label}
                    </div>
                    <div style={{ color: '#F9FAFB', marginTop: '4px' }}>
                      Count: {datum.value.toLocaleString()}
                    </div>
                    <div style={{ color: '#9CA3AF' }}>
                      {((datum.value / ideUsageData.reduce((sum, d) => sum + d.value, 0)) * 100).toFixed(1)}%
                    </div>
                  </div>
                )}
                theme={{
                  tooltip: {
                    container: {
                      background: '#1F2937',
                      color: '#F9FAFB'
                    }
                  }
                }}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                No IDE usage data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Model Usage & Language Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Model Usage
          </h2>
          <div className="h-80">
            {modelUsageData.length > 0 ? (
              <ResponsivePie
                data={modelUsageData}
                margin={{ top: 20, right: 80, bottom: 80, left: 80 }}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                colors={{ scheme: 'paired' }}
                borderWidth={1}
                borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#9CA3AF"
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: 'color' }}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                tooltip={({ datum }) => (
                  <div style={{
                    background: '#1F2937',
                    padding: '9px 12px',
                    border: '1px solid #374151',
                    borderRadius: '4px'
                  }}>
                    <div style={{ color: datum.color, fontWeight: 600 }}>
                      {datum.label}
                    </div>
                    <div style={{ color: '#F9FAFB', marginTop: '4px' }}>
                      Count: {datum.value.toLocaleString()}
                    </div>
                    <div style={{ color: '#9CA3AF' }}>
                      {((datum.value / modelUsageData.reduce((sum, d) => sum + d.value, 0)) * 100).toFixed(1)}%
                    </div>
                  </div>
                )}
                theme={{
                  tooltip: {
                    container: {
                      background: '#1F2937',
                      color: '#F9FAFB'
                    }
                  }
                }}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                No model usage data available
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Top 10 Languages
          </h2>
          <div className="h-80">
            {languageUsageData.length > 0 ? (
              <ResponsiveBar
                data={languageUsageData}
                keys={['count']}
                indexBy="language"
                margin={{ top: 20, right: 30, bottom: 50, left: 60 }}
                padding={0.3}
                colors={{ scheme: 'nivo' }}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: -45,
                  legend: 'Language',
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
                tooltip={({ value, indexValue, color }) => (
                  <div style={{
                    background: '#1F2937',
                    padding: '9px 12px',
                    border: '1px solid #374151',
                    borderRadius: '4px'
                  }}>
                    <div style={{ color, fontWeight: 600 }}>
                      {indexValue}
                    </div>
                    <div style={{ color: '#F9FAFB', marginTop: '4px' }}>
                      Count: {value.toLocaleString()}
                    </div>
                  </div>
                )}
                theme={{
                  axis: {
                    ticks: {
                      text: {
                        fill: '#9CA3AF'
                      }
                    },
                    legend: {
                      text: {
                        fill: '#9CA3AF'
                      }
                    }
                  },
                  tooltip: {
                    container: {
                      background: '#1F2937',
                      color: '#F9FAFB'
                    }
                  }
                }}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                No language usage data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lines of Code Trend */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Lines of Code Trend
        </h2>
        <div className="h-80">
          <ResponsiveLine
            data={linesOfCodeTrend}
            margin={{ top: 20, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false }}
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
              legend: 'Lines',
              legendOffset: -50,
              legendPosition: 'middle'
            }}
            colors={{ scheme: 'category10' }}
            pointSize={8}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            enableGridX={false}
            useMesh={true}
            tooltip={({ point }) => (
              <div style={{
                background: '#1F2937',
                padding: '9px 12px',
                border: '1px solid #374151',
                borderRadius: '4px'
              }}>
                <div style={{ color: point.seriesColor, fontWeight: 600 }}>
                  {point.seriesId}
                </div>
                <div style={{ color: '#F9FAFB', marginTop: '4px' }}>
                  Date: {point.data.xFormatted}
                </div>
                <div style={{ color: '#F9FAFB' }}>
                  Lines: {point.data.yFormatted}
                </div>
              </div>
            )}
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
                ticks: {
                  text: {
                    fill: '#9CA3AF'
                  }
                },
                legend: {
                  text: {
                    fill: '#9CA3AF'
                  }
                }
              },
              legends: {
                text: {
                  fill: '#9CA3AF'
                }
              },
              tooltip: {
                container: {
                  background: '#1F2937',
                  color: '#F9FAFB'
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default DemoUserReport28Day
