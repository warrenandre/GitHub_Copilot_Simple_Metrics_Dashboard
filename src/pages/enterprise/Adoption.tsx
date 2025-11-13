import { useState, useEffect, useMemo } from 'react'
import { Users, TrendingUp, Activity, Sparkles, RefreshCw, Calendar } from 'lucide-react'
import { ResponsiveLine } from '@nivo/line'
import { ResponsiveBar } from '@nivo/bar'
import DateRangeFilter, { DateRangeType } from '../../components/DateRangeFilter'
import { filterDataByDateRange } from '../../utils/dateFilters'

interface MetricsData {
  date: string
  total_active_users: number
  total_engaged_users: number
  copilot_ide_code_completions?: {
    total_engaged_users: number
  }
  copilot_ide_chat?: {
    total_engaged_users: number
    editors?: Array<{
      models: Array<{
        total_chats: number
      }>
    }>
  }
  copilot_dotcom_chat?: {
    total_engaged_users: number
  }
  copilot_dotcom_pull_requests?: {
    total_engaged_users: number
  }
}

const EnterpriseAdoption = () => {
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
          <p className="text-slate-400">Loading adoption metrics...</p>
        </div>
      </div>
    )
  }

  if (error || metricsData.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white mb-2">Enterprise Adoption</h1>
        <div className="bg-slate-800 rounded-lg p-8 text-center border border-slate-700">
          <Users className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Data Available</h3>
          <p className="text-slate-400">Please download enterprise metrics from the Admin page.</p>
        </div>
      </div>
    )
  }

  // Calculate adoption metrics
  const adoptionMetrics = filteredData.reduce((acc, day) => {
    acc.totalActiveUsers += day.total_active_users || 0
    acc.totalEngagedUsers += day.total_engaged_users || 0
    acc.codeCompletionUsers += day.copilot_ide_code_completions?.total_engaged_users || 0
    acc.chatUsers += day.copilot_ide_chat?.total_engaged_users || 0
    acc.dotcomChatUsers += day.copilot_dotcom_chat?.total_engaged_users || 0
    acc.prUsers += day.copilot_dotcom_pull_requests?.total_engaged_users || 0
    
    if (day.total_active_users > 0) {
      acc.daysWithUsers++
    }
    
    return acc
  }, {
    totalActiveUsers: 0,
    totalEngagedUsers: 0,
    codeCompletionUsers: 0,
    chatUsers: 0,
    dotcomChatUsers: 0,
    prUsers: 0,
    daysWithUsers: 0
  })

  const avgDailyActiveUsers = adoptionMetrics.daysWithUsers > 0
    ? adoptionMetrics.totalActiveUsers / adoptionMetrics.daysWithUsers
    : 0

  const avgDailyEngagedUsers = adoptionMetrics.daysWithUsers > 0
    ? adoptionMetrics.totalEngagedUsers / adoptionMetrics.daysWithUsers
    : 0

  const engagementRate = avgDailyActiveUsers > 0
    ? (avgDailyEngagedUsers / avgDailyActiveUsers) * 100
    : 0

  // User engagement trend
  const userEngagementTrend = filteredData.map(day => ({
    x: day.date.substring(5),
    y: day.total_engaged_users || 0
  }))

  const activeUsersTrend = filteredData.map(day => ({
    x: day.date.substring(5),
    y: day.total_active_users || 0
  }))

  // Feature adoption comparison
  const featureAdoptionData = [
    {
      feature: 'Code Completions',
      users: adoptionMetrics.codeCompletionUsers,
      color: '#3b82f6'
    },
    {
      feature: 'IDE Chat',
      users: adoptionMetrics.chatUsers,
      color: '#8b5cf6'
    },
    {
      feature: 'Dotcom Chat',
      users: adoptionMetrics.dotcomChatUsers,
      color: '#22c55e'
    },
    {
      feature: 'Pull Requests',
      users: adoptionMetrics.prUsers,
      color: '#f97316'
    }
  ].filter(item => item.users > 0)

  // Daily feature usage
  const dailyFeatureUsage = filteredData.map(day => ({
    date: day.date.substring(5),
    'Code Completions': day.copilot_ide_code_completions?.total_engaged_users || 0,
    'IDE Chat': day.copilot_ide_chat?.total_engaged_users || 0,
    'Dotcom Chat': day.copilot_dotcom_chat?.total_engaged_users || 0,
    'Pull Requests': day.copilot_dotcom_pull_requests?.total_engaged_users || 0
  }))

  // Calculate growth trend
  const firstHalfUsers = filteredData.slice(0, Math.floor(filteredData.length / 2))
    .reduce((sum, day) => sum + (day.total_engaged_users || 0), 0) / Math.max(Math.floor(filteredData.length / 2), 1)
  
  const secondHalfUsers = filteredData.slice(Math.floor(filteredData.length / 2))
    .reduce((sum, day) => sum + (day.total_engaged_users || 0), 0) / Math.max(Math.ceil(filteredData.length / 2), 1)
  
  const growthRate = firstHalfUsers > 0
    ? ((secondHalfUsers - firstHalfUsers) / firstHalfUsers) * 100
    : 0

  const getGrowthIndicator = (rate: number): { label: string; color: string; icon: string } => {
    if (rate > 10) return { label: 'Strong Growth', color: 'text-green-500', icon: '↗' }
    if (rate > 0) return { label: 'Growing', color: 'text-blue-500', icon: '↗' }
    if (rate === 0) return { label: 'Stable', color: 'text-slate-400', icon: '→' }
    return { label: 'Declining', color: 'text-orange-500', icon: '↘' }
  }

  const growthIndicator = getGrowthIndicator(growthRate)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Enterprise Adoption</h1>
          <p className="text-slate-400">User engagement, feature adoption, and growth metrics</p>
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

      {/* Adoption Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-blue-500" />
            <span className="text-xs font-semibold text-blue-500 bg-blue-500/10 px-2 py-1 rounded">
              DAILY AVG
            </span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{avgDailyActiveUsers.toFixed(0)}</div>
          <div className="text-sm text-slate-400">Avg Active Users</div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <Activity className="w-8 h-8 text-green-500" />
            <span className="text-xs font-semibold text-green-500 bg-green-500/10 px-2 py-1 rounded">
              ENGAGEMENT
            </span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{engagementRate.toFixed(1)}%</div>
          <div className="text-sm text-slate-400">Engagement Rate</div>
          <div className="text-xs text-slate-500 mt-1">{avgDailyEngagedUsers.toFixed(0)} engaged/day</div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-purple-500" />
            <span className="text-xs font-semibold text-purple-500 bg-purple-500/10 px-2 py-1 rounded">
              GROWTH
            </span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {growthRate > 0 ? '+' : ''}{growthRate.toFixed(1)}%
          </div>
          <div className="text-sm text-slate-400">Period Growth</div>
          <div className={`text-xs font-semibold mt-2 ${growthIndicator.color}`}>
            {growthIndicator.icon} {growthIndicator.label}
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <Sparkles className="w-8 h-8 text-orange-500" />
            <span className="text-xs font-semibold text-orange-500 bg-orange-500/10 px-2 py-1 rounded">
              FEATURES
            </span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{featureAdoptionData.length}</div>
          <div className="text-sm text-slate-400">Active Features</div>
        </div>
      </div>

      {/* User Engagement Trend */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">User Engagement Trend</h3>
        <div style={{ height: '300px' }}>
          <ResponsiveLine
            data={[
              {
                id: 'Active Users',
                color: '#3b82f6',
                data: activeUsersTrend
              },
              {
                id: 'Engaged Users',
                color: '#22c55e',
                data: userEngagementTrend
              }
            ]}
            margin={{ top: 20, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear', min: 0, stacked: false }}
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
              legend: 'Users',
              legendOffset: -50,
              legendPosition: 'middle'
            }}
            enableGridX={false}
            colors={{ datum: 'color' }}
            lineWidth={3}
            pointSize={8}
            pointColor={{ from: 'color' }}
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
                symbolShape: 'circle',
                symbolBorderColor: 'rgba(0, 0, 0, .5)'
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feature Adoption Comparison */}
        {featureAdoptionData.length > 0 && (
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Feature Adoption</h3>
            <div style={{ height: '300px' }}>
              <ResponsiveBar
                data={featureAdoptionData}
                keys={['users']}
                indexBy="feature"
                margin={{ top: 20, right: 30, bottom: 80, left: 60 }}
                padding={0.3}
                valueScale={{ type: 'linear' }}
                colors={({ data }) => data.color}
                borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: -45,
                  legend: 'Feature',
                  legendPosition: 'middle',
                  legendOffset: 70
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: 'Total Engaged Users',
                  legendPosition: 'middle',
                  legendOffset: -50
                }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor="#ffffff"
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
        )}

        {/* Daily Feature Usage */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Daily Feature Usage</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveBar
              data={dailyFeatureUsage}
              keys={['Code Completions', 'IDE Chat', 'Dotcom Chat', 'Pull Requests']}
              indexBy="date"
              margin={{ top: 20, right: 130, bottom: 50, left: 60 }}
              padding={0.3}
              valueScale={{ type: 'linear' }}
              colors={['#3b82f6', '#8b5cf6', '#22c55e', '#f97316']}
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
                legend: 'Users',
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

      {/* Adoption Statistics */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Adoption Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-1">Code Completion Users</div>
            <div className="text-2xl font-bold text-blue-500">{adoptionMetrics.codeCompletionUsers.toLocaleString()}</div>
          </div>
          <div className="bg-slate-900 rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-1">IDE Chat Users</div>
            <div className="text-2xl font-bold text-purple-500">{adoptionMetrics.chatUsers.toLocaleString()}</div>
          </div>
          <div className="bg-slate-900 rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-1">Dotcom Chat Users</div>
            <div className="text-2xl font-bold text-green-500">{adoptionMetrics.dotcomChatUsers.toLocaleString()}</div>
          </div>
          <div className="bg-slate-900 rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-1">Pull Request Users</div>
            <div className="text-2xl font-bold text-orange-500">{adoptionMetrics.prUsers.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EnterpriseAdoption
