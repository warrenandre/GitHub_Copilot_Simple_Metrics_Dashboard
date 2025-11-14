import { useState, useMemo } from 'react'
import { Calendar, User, Code, TrendingUp, Sparkles, Cpu, FileCode, Users } from 'lucide-react'
import { ResponsiveLine } from '@nivo/line'
import { ResponsiveBar } from '@nivo/bar'
import { ResponsivePie } from '@nivo/pie'
import DateRangeFilter, { DateRangeType } from '../../../components/DateRangeFilter'
import { filterDataByDateRange } from '../../../utils/dateFilters'

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

const UserReport28Day = () => {
  const [selectedRange, setSelectedRange] = useState<DateRangeType>('all')
  const [selectedUser, setSelectedUser] = useState<string>('all')

  // Load data from localStorage
  const reportData: UserReportData | null = useMemo(() => {
    const data = localStorage.getItem('user_report_data')
    if (!data) return null
    try {
      return JSON.parse(data)
    } catch {
      return null
    }
  }, [])

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

  // Calculate summary metrics
  const summaryMetrics = useMemo(() => {
    if (!filteredData.length) return null

    const totalRecords = filteredData.length
    const uniqueUsers = new Set(filteredData.map(r => r.user_login)).size
    
    const totalCodeGeneration = filteredData.reduce((sum, r) => sum + r.code_generation_activity_count, 0)
    const totalAcceptance = filteredData.reduce((sum, r) => sum + r.code_acceptance_activity_count, 0)
    const totalInteractions = filteredData.reduce((sum, r) => sum + r.user_initiated_interaction_count, 0)
    const totalLinesAdded = filteredData.reduce((sum, r) => sum + r.loc_added_sum, 0)
    
    const agentUsers = filteredData.filter(r => r.used_agent).length
    const chatUsers = filteredData.filter(r => r.used_chat).length
    
    const avgAcceptanceRate = totalCodeGeneration > 0 
      ? ((totalAcceptance / totalCodeGeneration) * 100).toFixed(1)
      : '0.0'

    return {
      totalRecords,
      uniqueUsers,
      totalCodeGeneration,
      avgAcceptanceRate,
      totalInteractions,
      totalLinesAdded,
      agentUsers,
      chatUsers
    }
  }, [filteredData])

  // Prepare chart data - Daily code generation activity
  const dailyActivityData = useMemo(() => {
    if (!filteredData.length) return []

    const grouped = filteredData.reduce((acc, record) => {
      if (!acc[record.day]) {
        acc[record.day] = 0
      }
      acc[record.day] += record.code_generation_activity_count
      return acc
    }, {} as Record<string, number>)

    return [{
      id: 'Code Generation',
      data: Object.entries(grouped)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, count]) => ({ x: date, y: count }))
    }]
  }, [filteredData])

  // Prepare chart data - Feature usage distribution
  const featureUsageData = useMemo(() => {
    if (!filteredData.length) return []

    const featureTotals: Record<string, number> = {}
    
    filteredData.forEach(record => {
      record.totals_by_feature?.forEach(feature => {
        if (!featureTotals[feature.feature]) {
          featureTotals[feature.feature] = 0
        }
        featureTotals[feature.feature] += feature.code_generation_activity_count
      })
    })

    return Object.entries(featureTotals).map(([feature, count]) => ({
      id: feature.replace(/_/g, ' '),
      label: feature.replace(/_/g, ' '),
      value: count
    }))
  }, [filteredData])

  // Prepare chart data - IDE distribution
  const ideDistributionData = useMemo(() => {
    if (!filteredData.length) return []

    const ideTotals: Record<string, number> = {}
    
    filteredData.forEach(record => {
      record.totals_by_ide?.forEach(ide => {
        if (!ideTotals[ide.ide]) {
          ideTotals[ide.ide] = 0
        }
        ideTotals[ide.ide] += ide.code_generation_activity_count
      })
    })

    return Object.entries(ideTotals).map(([ide, count]) => ({
      id: ide,
      label: ide,
      value: count
    }))
  }, [filteredData])

  // Prepare chart data - Model usage
  const modelUsageData = useMemo(() => {
    if (!filteredData.length) return []

    const modelTotals: Record<string, number> = {}
    
    filteredData.forEach(record => {
      record.totals_by_language_model?.forEach(item => {
        if (item.model === 'unknown') return
        if (!modelTotals[item.model]) {
          modelTotals[item.model] = 0
        }
        modelTotals[item.model] += item.code_generation_activity_count
      })
    })

    return Object.entries(modelTotals).map(([model, count]) => ({
      id: model,
      label: model,
      value: count
    }))
  }, [filteredData])

  // Prepare chart data - Top languages
  const topLanguagesData = useMemo(() => {
    if (!filteredData.length) return []

    const languageTotals: Record<string, number> = {}
    
    filteredData.forEach(record => {
      record.totals_by_language_feature?.forEach(item => {
        if (!languageTotals[item.language]) {
          languageTotals[item.language] = 0
        }
        languageTotals[item.language] += item.code_generation_activity_count
      })
    })

    return Object.entries(languageTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([language, count]) => ({
        language,
        count
      }))
  }, [filteredData])

  // Prepare chart data - Lines of code trend
  const locTrendData = useMemo(() => {
    if (!filteredData.length) return []

    const grouped = filteredData.reduce((acc, record) => {
      if (!acc[record.day]) {
        acc[record.day] = { added: 0, deleted: 0 }
      }
      acc[record.day].added += record.loc_added_sum
      acc[record.day].deleted += record.loc_deleted_sum
      return acc
    }, {} as Record<string, { added: number; deleted: number }>)

    const sortedDates = Object.keys(grouped).sort()

    return [
      {
        id: 'Lines Added',
        data: sortedDates.map(date => ({ x: date, y: grouped[date].added }))
      },
      {
        id: 'Lines Deleted',
        data: sortedDates.map(date => ({ x: date, y: grouped[date].deleted }))
      }
    ]
  }, [filteredData])

  if (!reportData) {
    return (
      <div className="p-8">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
            No User Report Data Available
          </h2>
          <p className="text-yellow-700 dark:text-yellow-300 mb-4">
            Please upload a user 28-day report from the Admin page to view visualizations.
          </p>
          <p className="text-sm text-yellow-600 dark:text-yellow-400">
            Go to Admin → User 28-Day Report → Upload JSON file
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          User 28-Day Report
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Detailed user-level metrics and activity analysis
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        {/* User Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            User
          </label>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Users ({uniqueUsers.length})</option>
            {uniqueUsers.map(user => (
              <option key={user} value={user}>{user}</option>
            ))}
          </select>
        </div>

        {/* Date Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Date Range
          </label>
          <DateRangeFilter
            selectedRange={selectedRange}
            onRangeChange={setSelectedRange}
          />
        </div>
      </div>

      {/* Summary Cards */}
      {summaryMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Records</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {summaryMetrics.totalRecords.toLocaleString()}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Unique Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {summaryMetrics.uniqueUsers.toLocaleString()}
                </p>
              </div>
              <Users className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Code Generation</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {summaryMetrics.totalCodeGeneration.toLocaleString()}
                </p>
              </div>
              <Code className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Acceptance Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {summaryMetrics.avgAcceptanceRate}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Interactions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {summaryMetrics.totalInteractions.toLocaleString()}
                </p>
              </div>
              <Sparkles className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Lines Added</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {summaryMetrics.totalLinesAdded.toLocaleString()}
                </p>
              </div>
              <FileCode className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Agent Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {summaryMetrics.agentUsers.toLocaleString()}
                </p>
              </div>
              <Cpu className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Chat Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {summaryMetrics.chatUsers.toLocaleString()}
                </p>
              </div>
              <User className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Daily Code Generation Activity */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Daily Code Generation Activity
          </h3>
          <div className="h-80">
            <ResponsiveLine
              data={dailyActivityData}
              margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
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
                legend: 'Count',
                legendOffset: -50,
                legendPosition: 'middle'
              }}
              colors={{ scheme: 'nivo' }}
              pointSize={8}
              pointBorderWidth={2}
              pointBorderColor={{ from: 'serieColor' }}
              enableArea={true}
              areaOpacity={0.1}
              useMesh={true}
              tooltip={({ point }) => (
                <div style={{
                  background: '#1F2937',
                  padding: '9px 12px',
                  border: '1px solid #374151',
                  borderRadius: '4px'
                }}>
                  <div style={{ color: point.serieColor, fontWeight: 600 }}>
                    {point.serieId}
                  </div>
                  <div style={{ color: '#F9FAFB', marginTop: '4px' }}>
                    Date: {point.data.xFormatted}
                  </div>
                  <div style={{ color: '#F9FAFB' }}>
                    Count: {point.data.yFormatted}
                  </div>
                </div>
              )}
              theme={{
                text: { fill: '#9ca3af' },
                grid: { line: { stroke: '#374151' } }
              }}
            />
          </div>
        </div>

        {/* Feature Usage Distribution */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Feature Usage Distribution
          </h3>
          <div className="h-80">
            <ResponsivePie
              data={featureUsageData}
              margin={{ top: 20, right: 80, bottom: 20, left: 80 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              activeOuterRadiusOffset={8}
              colors={{ scheme: 'nivo' }}
              borderWidth={1}
              borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
              arcLinkLabelsSkipAngle={10}
              arcLinkLabelsTextColor="#9ca3af"
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
                text: { fill: '#9ca3af' }
              }}
            />
          </div>
        </div>

        {/* IDE Distribution */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            IDE Distribution
          </h3>
          <div className="h-80">
            <ResponsivePie
              data={ideDistributionData}
              margin={{ top: 20, right: 80, bottom: 20, left: 80 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              activeOuterRadiusOffset={8}
              colors={{ scheme: 'set2' }}
              borderWidth={1}
              borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
              arcLinkLabelsSkipAngle={10}
              arcLinkLabelsTextColor="#9ca3af"
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
                    {((datum.value / ideDistributionData.reduce((sum, d) => sum + d.value, 0)) * 100).toFixed(1)}%
                  </div>
                </div>
              )}
              theme={{
                text: { fill: '#9ca3af' }
              }}
            />
          </div>
        </div>

        {/* Model Usage */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Model Usage
          </h3>
          <div className="h-80">
            <ResponsivePie
              data={modelUsageData}
              margin={{ top: 20, right: 80, bottom: 20, left: 80 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              activeOuterRadiusOffset={8}
              colors={{ scheme: 'paired' }}
              borderWidth={1}
              borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
              arcLinkLabelsSkipAngle={10}
              arcLinkLabelsTextColor="#9ca3af"
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
                text: { fill: '#9ca3af' }
              }}
            />
          </div>
        </div>

        {/* Top 10 Languages */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Top 10 Languages
          </h3>
          <div className="h-80">
            <ResponsiveBar
              data={topLanguagesData}
              keys={['count']}
              indexBy="language"
              margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
              padding={0.3}
              colors={{ scheme: 'nivo' }}
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
                legend: 'Count',
                legendPosition: 'middle',
                legendOffset: -50
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              tooltip={({ id, value, indexValue, color }) => (
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
                text: { fill: '#9ca3af' },
                grid: { line: { stroke: '#374151' } }
              }}
            />
          </div>
        </div>

        {/* Lines of Code Trend */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Lines of Code Trend
          </h3>
          <div className="h-80">
            <ResponsiveLine
              data={locTrendData}
              margin={{ top: 20, right: 110, bottom: 60, left: 60 }}
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
                legend: 'Lines',
                legendOffset: -50,
                legendPosition: 'middle'
              }}
              colors={{ scheme: 'set2' }}
              pointSize={8}
              pointBorderWidth={2}
              pointBorderColor={{ from: 'serieColor' }}
              useMesh={true}
              tooltip={({ point }) => (
                <div style={{
                  background: '#1F2937',
                  padding: '9px 12px',
                  border: '1px solid #374151',
                  borderRadius: '4px'
                }}>
                  <div style={{ color: point.serieColor, fontWeight: 600 }}>
                    {point.serieId}
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
                text: { fill: '#9ca3af' },
                grid: { line: { stroke: '#374151' } },
                legends: { text: { fill: '#9ca3af' } }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserReport28Day
