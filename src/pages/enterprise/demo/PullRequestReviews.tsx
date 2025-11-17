import { useMemo, useState } from 'react'
import { GitPullRequest, Users, TrendingUp, Calendar, Sparkles } from 'lucide-react'
import { ResponsiveLine } from '@nivo/line'
import { ResponsiveBar } from '@nivo/bar'
import DateRangeFilter, { DateRangeType } from '../../../components/DateRangeFilter'
import { filterDataByDateRange } from '../../../utils/dateFilters'
import { demoEnterpriseMetrics } from '../../../data/demoEnterpriseData'

const DemoPullRequestReviews = () => {
  const [selectedRange, setSelectedRange] = useState<DateRangeType>('all')

  const metricsData = demoEnterpriseMetrics

  const dateRange = metricsData.length > 0 ? {
    from: metricsData[0].date,
    to: metricsData[metricsData.length - 1].date
  } : { from: '', to: '' }

  const filteredData = useMemo(() => {
    return filterDataByDateRange(metricsData, selectedRange)
  }, [selectedRange])

  // Calculate PR metrics
  const totalPRUsers = filteredData.reduce((sum, day) => 
    Math.max(sum, day.copilot_dotcom_pull_requests?.total_engaged_users || 0), 0
  )

  const avgPRUsers = filteredData.length > 0
    ? Math.round(filteredData.reduce((sum, d) => sum + (d.copilot_dotcom_pull_requests?.total_engaged_users || 0), 0) / filteredData.length)
    : 0

  const peakPRDay = filteredData.reduce((max, day) => {
    const users = day.copilot_dotcom_pull_requests?.total_engaged_users || 0
    return users > (max.copilot_dotcom_pull_requests?.total_engaged_users || 0) ? day : max
  }, filteredData[0] || { date: 'N/A', copilot_dotcom_pull_requests: { total_engaged_users: 0 } })

  const growthRate = filteredData.length >= 2
    ? Math.round((
        ((filteredData[filteredData.length - 1].copilot_dotcom_pull_requests?.total_engaged_users || 0) -
        (filteredData[0].copilot_dotcom_pull_requests?.total_engaged_users || 0)) /
        Math.max(filteredData[0].copilot_dotcom_pull_requests?.total_engaged_users || 1, 1)
      ) * 100)
    : 0

  // Chart data - PR Users Over Time
  const prUsersOverTimeData = [
    {
      id: 'PR Review Users',
      color: 'hsl(142, 70%, 50%)',
      data: filteredData.map(day => ({
        x: day.date.substring(5),
        y: day.copilot_dotcom_pull_requests?.total_engaged_users || 0
      }))
    }
  ]

  // Daily breakdown for bar chart
  const dailyPRData = filteredData.slice(-14).map(day => ({
    date: day.date.substring(5),
    'PR Users': day.copilot_dotcom_pull_requests?.total_engaged_users || 0
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-white">Pull Request Reviews</h1>
            <span className="px-3 py-1 bg-yellow-500 bg-opacity-20 text-yellow-400 text-xs font-semibold rounded-full flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              DEMO DATA
            </span>
          </div>
          <p className="text-slate-400">GitHub Copilot pull request review metrics (Demo Mode)</p>
        </div>
        <div className="flex items-center gap-3">
          <DateRangeFilter
            selectedRange={selectedRange}
            onRangeChange={setSelectedRange}
          />
        </div>
      </div>

      {/* Date Range Info */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
        <div className="flex items-center gap-2 text-slate-300">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">
            Showing data from <span className="font-semibold text-white">{dateRange.from}</span> to{' '}
            <span className="font-semibold text-white">{dateRange.to}</span>
            {' '}({filteredData.length} days)
          </span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <GitPullRequest className="w-8 h-8 opacity-80" />
            <span className="text-xs font-semibold bg-white bg-opacity-20 px-2 py-1 rounded">PEAK</span>
          </div>
          <div className="text-3xl font-bold mb-1">{totalPRUsers}</div>
          <div className="text-sm opacity-90">Peak PR Review Users</div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 opacity-80" />
            <span className="text-xs font-semibold bg-white bg-opacity-20 px-2 py-1 rounded">AVG</span>
          </div>
          <div className="text-3xl font-bold mb-1">{avgPRUsers}</div>
          <div className="text-sm opacity-90">Avg Daily PR Users</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-8 h-8 opacity-80" />
            <span className="text-xs font-semibold bg-white bg-opacity-20 px-2 py-1 rounded">DATE</span>
          </div>
          <div className="text-3xl font-bold mb-1">{peakPRDay.date.substring(5)}</div>
          <div className="text-sm opacity-90">Highest Activity Day</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 opacity-80" />
            <span className="text-xs font-semibold bg-white bg-opacity-20 px-2 py-1 rounded">TREND</span>
          </div>
          <div className="text-3xl font-bold mb-1">{growthRate > 0 ? '+' : ''}{growthRate}%</div>
          <div className="text-sm opacity-90">Growth Rate</div>
        </div>
      </div>

      {/* PR Users Over Time Chart */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <GitPullRequest className="w-5 h-5 text-green-400" />
          PR Review Users Over Time
        </h2>
        <div className="h-80">
          <ResponsiveLine
            data={prUsersOverTimeData}
            margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
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
            colors={{ scheme: 'category10' }}
            pointSize={8}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabelYOffset={-12}
            enableArea={true}
            areaOpacity={0.15}
            useMesh={true}
            theme={{
              axis: {
                ticks: { text: { fill: '#94a3b8' } },
                legend: { text: { fill: '#94a3b8' } }
              },
              grid: { line: { stroke: '#334155' } },
              tooltip: {
                container: {
                  background: '#1e293b',
                  color: '#f1f5f9',
                  fontSize: 12,
                  borderRadius: '6px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }
              }
            }}
          />
        </div>
      </div>

      {/* Daily Activity Bar Chart */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          Daily PR Review Activity (Last 14 Days)
        </h2>
        <div className="h-80">
          <ResponsiveBar
            data={dailyPRData}
            keys={['PR Users']}
            indexBy="date"
            margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
            padding={0.3}
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            colors={{ scheme: 'set2' }}
            borderRadius={4}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: -45,
              legend: 'Date',
              legendPosition: 'middle',
              legendOffset: 50
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
            theme={{
              axis: {
                ticks: { text: { fill: '#94a3b8' } },
                legend: { text: { fill: '#94a3b8' } }
              },
              grid: { line: { stroke: '#334155' } },
              tooltip: {
                container: {
                  background: '#1e293b',
                  color: '#f1f5f9',
                  fontSize: 12,
                  borderRadius: '6px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }
              }
            }}
          />
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-blue-500 bg-opacity-10 border border-blue-500 border-opacity-30 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-400 mb-3 flex items-center gap-2">
          <GitPullRequest className="w-5 h-5" />
          About PR Reviews Metrics
        </h3>
        <div className="text-slate-300 space-y-2 text-sm">
          <p>
            <strong className="text-white">PR Review Users:</strong> Number of developers who used GitHub Copilot features 
            while reviewing pull requests on GitHub.com.
          </p>
          <p>
            <strong className="text-white">What's Included:</strong> This metric tracks engagement with Copilot's PR review 
            capabilities including code suggestions, summaries, and AI-assisted reviews.
          </p>
          <p className="text-xs text-slate-400 mt-3">
            📊 Demo data shown above. Connect your GitHub organization in Admin Settings to see real metrics.
          </p>
        </div>
      </div>
    </div>
  )
}

export default DemoPullRequestReviews
