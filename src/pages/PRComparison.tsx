import { useState, useEffect, useMemo } from 'react'
import { GitCompare, TrendingUp, TrendingDown, Calendar, ArrowRight, AlertCircle, Bot, FileText, AlertTriangle } from 'lucide-react'
import { ResponsiveBar } from '@nivo/bar'
import { demoPRData } from '../data/demoPRData'
import DataSourceToggle from '../components/DataSourceToggle'

interface PullRequest {
  id: number
  number: number
  title: string
  state: 'open' | 'closed'
  user: {
    login: string
    avatar_url: string
  }
  created_at: string
  updated_at: string
  closed_at: string | null
  merged_at: string | null
  draft: boolean
}

interface RepoMetricsData {
  owner: string
  name: string
  pullRequests: PullRequest[]
  fetchedAt: string
  count: number
}

type ComparisonPeriod = 'week' | 'month'

interface PeriodMetrics {
  totalPRs: number
  openPRs: number
  closedPRs: number
  mergedPRs: number
  avgMergeTime: number
  mergeRate: number
  uniqueContributors: number
  draftPRs: number
  readyPRs: number
  botPRs: number
  humanPRs: number
  stalePRs: number
  avgPRAge: number
}

const PRComparison = () => {
  const [repoData, setRepoData] = useState<RepoMetricsData[]>([])
  const [selectedRepo, setSelectedRepo] = useState<string>('')
  const [comparisonPeriod, setComparisonPeriod] = useState<ComparisonPeriod>('week')
  const [isDemo, setIsDemo] = useState(false)

  // Load all repository metrics from localStorage
  useEffect(() => {
    const loadRepoMetrics = () => {
      const allRepos: RepoMetricsData[] = []
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key?.startsWith('repo_metrics_')) {
          try {
            const data = localStorage.getItem(key)
            if (data) {
              const parsed = JSON.parse(data)
              allRepos.push(parsed)
            }
          } catch (error) {
            console.error(`Failed to parse ${key}:`, error)
          }
        }
      }
      
      setRepoData(allRepos)
      if (allRepos.length > 0 && !selectedRepo) {
        setSelectedRepo(`${allRepos[0].owner}_${allRepos[0].name}`)
      }
    }

    loadRepoMetrics()
  }, [selectedRepo])

  const currentRepo = useMemo(() => {
    if (isDemo) {
      return demoPRData
    }
    return repoData.find(r => `${r.owner}_${r.name}` === selectedRepo)
  }, [repoData, selectedRepo, isDemo])

  // Calculate metrics for a specific time period
  const calculatePeriodMetrics = (prs: PullRequest[], startDate: Date, endDate: Date): PeriodMetrics => {
    const periodPRs = prs.filter(pr => {
      const createdDate = new Date(pr.created_at)
      return createdDate >= startDate && createdDate <= endDate
    })

    const openPRs = periodPRs.filter(pr => pr.state === 'open')
    const closedPRs = periodPRs.filter(pr => pr.state === 'closed')
    const mergedPRs = periodPRs.filter(pr => pr.merged_at !== null)
    const draftPRs = periodPRs.filter(pr => pr.draft)
    const readyPRs = periodPRs.filter(pr => !pr.draft)

    // Bot vs Human PRs
    const botPRs = periodPRs.filter(pr => pr.user.login.toLowerCase().includes('bot') || pr.user.login === 'Copilot')
    const humanPRs = periodPRs.filter(pr => !pr.user.login.toLowerCase().includes('bot') && pr.user.login !== 'Copilot')

    // Calculate average merge time
    const mergeTimesInDays = mergedPRs
      .map(pr => {
        const created = new Date(pr.created_at)
        const merged = new Date(pr.merged_at!)
        return (merged.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
      })
      .filter(days => !isNaN(days))

    const avgMergeTime = mergeTimesInDays.length > 0
      ? mergeTimesInDays.reduce((sum, time) => sum + time, 0) / mergeTimesInDays.length
      : 0

    // Calculate merge rate
    const mergeRate = closedPRs.length > 0
      ? (mergedPRs.length / closedPRs.length) * 100
      : 0

    // Calculate PR age metrics for open PRs
    const now = new Date()
    const openPRAges = openPRs.map(pr => {
      const created = new Date(pr.created_at)
      const ageInDays = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
      return ageInDays
    })

    const avgPRAge = openPRAges.length > 0
      ? openPRAges.reduce((sum, age) => sum + age, 0) / openPRAges.length
      : 0

    // Stale PRs (no activity in last 7 days)
    const stalePRs = openPRs.filter(pr => {
      const updated = new Date(pr.updated_at)
      const daysSinceUpdate = (now.getTime() - updated.getTime()) / (1000 * 60 * 60 * 24)
      return daysSinceUpdate > 7
    })

    // Unique contributors
    const contributors = new Set(periodPRs.map(pr => pr.user.login))

    return {
      totalPRs: periodPRs.length,
      openPRs: openPRs.length,
      closedPRs: closedPRs.length,
      mergedPRs: mergedPRs.length,
      avgMergeTime,
      mergeRate,
      uniqueContributors: contributors.size,
      draftPRs: draftPRs.length,
      readyPRs: readyPRs.length,
      botPRs: botPRs.length,
      humanPRs: humanPRs.length,
      stalePRs: stalePRs.length,
      avgPRAge
    }
  }

  // Get date ranges for comparison
  const getDateRanges = () => {
    const now = new Date()
    const ranges = {
      currentStart: new Date(),
      currentEnd: now,
      previousStart: new Date(),
      previousEnd: new Date()
    }

    if (comparisonPeriod === 'week') {
      // This week (Monday to Sunday)
      const dayOfWeek = now.getDay()
      const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
      ranges.currentStart = new Date(now)
      ranges.currentStart.setDate(now.getDate() - daysToMonday)
      ranges.currentStart.setHours(0, 0, 0, 0)

      // Last week
      ranges.previousEnd = new Date(ranges.currentStart)
      ranges.previousEnd.setDate(ranges.previousEnd.getDate() - 1)
      ranges.previousEnd.setHours(23, 59, 59, 999)
      
      ranges.previousStart = new Date(ranges.previousEnd)
      ranges.previousStart.setDate(ranges.previousEnd.getDate() - 6)
      ranges.previousStart.setHours(0, 0, 0, 0)
    } else {
      // This month
      ranges.currentStart = new Date(now.getFullYear(), now.getMonth(), 1)
      
      // Last month
      const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1
      const lastMonthYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear()
      ranges.previousStart = new Date(lastMonthYear, lastMonth, 1)
      ranges.previousEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999)
    }

    return ranges
  }

  const comparison = useMemo(() => {
    if (!currentRepo) return null

    const ranges = getDateRanges()
    const currentMetrics = calculatePeriodMetrics(currentRepo.pullRequests, ranges.currentStart, ranges.currentEnd)
    const previousMetrics = calculatePeriodMetrics(currentRepo.pullRequests, ranges.previousStart, ranges.previousEnd)

    return {
      current: currentMetrics,
      previous: previousMetrics,
      ranges,
      changes: {
        totalPRs: currentMetrics.totalPRs - previousMetrics.totalPRs,
        openPRs: currentMetrics.openPRs - previousMetrics.openPRs,
        closedPRs: currentMetrics.closedPRs - previousMetrics.closedPRs,
        mergedPRs: currentMetrics.mergedPRs - previousMetrics.mergedPRs,
        avgMergeTime: currentMetrics.avgMergeTime - previousMetrics.avgMergeTime,
        mergeRate: currentMetrics.mergeRate - previousMetrics.mergeRate,
        uniqueContributors: currentMetrics.uniqueContributors - previousMetrics.uniqueContributors,
        draftPRs: currentMetrics.draftPRs - previousMetrics.draftPRs,
        readyPRs: currentMetrics.readyPRs - previousMetrics.readyPRs,
        botPRs: currentMetrics.botPRs - previousMetrics.botPRs,
        humanPRs: currentMetrics.humanPRs - previousMetrics.humanPRs,
        stalePRs: currentMetrics.stalePRs - previousMetrics.stalePRs,
        avgPRAge: currentMetrics.avgPRAge - previousMetrics.avgPRAge
      }
    }
  }, [currentRepo, comparisonPeriod])

  // Prepare chart data
  const chartData = useMemo(() => {
    if (!comparison) return []

    const periodLabel = comparisonPeriod === 'week' ? 'Week' : 'Month'
    
    return [
      {
        metric: 'Total PRs',
        [`Previous ${periodLabel}`]: comparison.previous.totalPRs,
        [`Current ${periodLabel}`]: comparison.current.totalPRs
      },
      {
        metric: 'Open',
        [`Previous ${periodLabel}`]: comparison.previous.openPRs,
        [`Current ${periodLabel}`]: comparison.current.openPRs
      },
      {
        metric: 'Closed',
        [`Previous ${periodLabel}`]: comparison.previous.closedPRs,
        [`Current ${periodLabel}`]: comparison.current.closedPRs
      },
      {
        metric: 'Merged',
        [`Previous ${periodLabel}`]: comparison.previous.mergedPRs,
        [`Current ${periodLabel}`]: comparison.current.mergedPRs
      },
      {
        metric: 'Contributors',
        [`Previous ${periodLabel}`]: comparison.previous.uniqueContributors,
        [`Current ${periodLabel}`]: comparison.current.uniqueContributors
      }
    ]
  }, [comparison, comparisonPeriod])

  const formatDateRange = (start: Date, end: Date) => {
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
  }

  const renderChangeIndicator = (value: number, suffix: string = '') => {
    if (value === 0) {
      return <span className="text-slate-400">No change</span>
    }
    
    const isPositive = value > 0
    const Icon = isPositive ? TrendingUp : TrendingDown
    const colorClass = isPositive ? 'text-green-400' : 'text-red-400'
    
    return (
      <div className={`flex items-center gap-1 ${colorClass}`}>
        <Icon className="w-4 h-4" />
        <span className="font-semibold">
          {isPositive ? '+' : ''}{value.toFixed(suffix ? 1 : 0)}{suffix}
        </span>
      </div>
    )
  }

  if (repoData.length === 0 && !isDemo) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <GitCompare className="w-8 h-8 text-blue-500" />
          <div>
            <h1 className="text-3xl font-bold text-white">PR Comparison</h1>
            <p className="text-slate-400 mt-1">Compare pull request metrics across time periods</p>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-12 text-center">
          <AlertCircle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Repository Data Available</h3>
          <p className="text-slate-400 mb-6">
            Configure repositories and fetch metrics from the Repository List page first.
          </p>
          <div className="flex items-center justify-center gap-4">
            <a
              href="/admin/repositories"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Go to Repository List
            </a>
            <button
              onClick={() => setIsDemo(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              View Demo Data
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <GitCompare className="w-8 h-8 text-blue-500" />
          <div>
            <h1 className="text-3xl font-bold text-white">PR Comparison</h1>
            <p className="text-slate-400 mt-1">Compare pull request metrics across time periods</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Demo Data Toggle */}
          <DataSourceToggle isDemo={isDemo} onToggle={setIsDemo} />

          {/* Period Selector */}
          <div className="flex bg-slate-800 border border-slate-700 rounded-lg p-1">
            <button
              onClick={() => setComparisonPeriod('week')}
              className={`px-4 py-2 rounded-md transition-colors ${
                comparisonPeriod === 'week'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setComparisonPeriod('month')}
              className={`px-4 py-2 rounded-md transition-colors ${
                comparisonPeriod === 'month'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
          </div>

          {/* Repo Selector */}
          {repoData.length > 1 && !isDemo && (
            <select
              value={selectedRepo}
              onChange={(e) => setSelectedRepo(e.target.value)}
              className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {repoData.map(repo => (
                <option key={`${repo.owner}_${repo.name}`} value={`${repo.owner}_${repo.name}`}>
                  {repo.owner}/{repo.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {comparison && (
        <>
          {/* Date Range Info */}
          <div className={`border rounded-lg p-4 ${
            isDemo 
              ? 'bg-purple-900/20 border-purple-700/50' 
              : 'bg-blue-900/20 border-blue-700/50'
          }`}>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              {isDemo && (
                <>
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${isDemo ? 'text-purple-200' : 'text-blue-100'}`}>
                      Demo Mode Active
                    </span>
                  </div>
                  <span className={isDemo ? 'text-purple-400' : 'text-blue-400'}>•</span>
                </>
              )}
              <div className="flex items-center gap-2">
                <Calendar className={`w-5 h-5 ${isDemo ? 'text-purple-400' : 'text-blue-400'}`} />
                <span className={`font-semibold ${isDemo ? 'text-purple-100' : 'text-blue-100'}`}>Previous {comparisonPeriod}:</span>
                <span className={isDemo ? 'text-purple-200' : 'text-blue-200'}>{formatDateRange(comparison.ranges.previousStart, comparison.ranges.previousEnd)}</span>
              </div>
              <ArrowRight className={`w-5 h-5 ${isDemo ? 'text-purple-400' : 'text-blue-400'}`} />
              <div className="flex items-center gap-2">
                <Calendar className={`w-5 h-5 ${isDemo ? 'text-purple-400' : 'text-blue-400'}`} />
                <span className={`font-semibold ${isDemo ? 'text-purple-100' : 'text-blue-100'}`}>Current {comparisonPeriod}:</span>
                <span className={isDemo ? 'text-purple-200' : 'text-blue-200'}>{formatDateRange(comparison.ranges.currentStart, comparison.ranges.currentEnd)}</span>
              </div>
            </div>
          </div>

          {/* Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total PRs */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-sm font-medium text-slate-400 mb-3">Total Pull Requests</h3>
              <div className="flex items-baseline justify-between mb-2">
                <div>
                  <p className="text-3xl font-bold text-white">{comparison.current.totalPRs}</p>
                  <p className="text-xs text-slate-500 mt-1">Previous: {comparison.previous.totalPRs}</p>
                </div>
              </div>
              {renderChangeIndicator(comparison.changes.totalPRs)}
            </div>

            {/* Merged PRs */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-sm font-medium text-slate-400 mb-3">Merged PRs</h3>
              <div className="flex items-baseline justify-between mb-2">
                <div>
                  <p className="text-3xl font-bold text-white">{comparison.current.mergedPRs}</p>
                  <p className="text-xs text-slate-500 mt-1">Previous: {comparison.previous.mergedPRs}</p>
                </div>
              </div>
              {renderChangeIndicator(comparison.changes.mergedPRs)}
            </div>

            {/* Merge Rate */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-sm font-medium text-slate-400 mb-3">Merge Rate</h3>
              <div className="flex items-baseline justify-between mb-2">
                <div>
                  <p className="text-3xl font-bold text-white">{comparison.current.mergeRate.toFixed(1)}%</p>
                  <p className="text-xs text-slate-500 mt-1">Previous: {comparison.previous.mergeRate.toFixed(1)}%</p>
                </div>
              </div>
              {renderChangeIndicator(comparison.changes.mergeRate, '%')}
            </div>

            {/* Contributors */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-sm font-medium text-slate-400 mb-3">Contributors</h3>
              <div className="flex items-baseline justify-between mb-2">
                <div>
                  <p className="text-3xl font-bold text-white">{comparison.current.uniqueContributors}</p>
                  <p className="text-xs text-slate-500 mt-1">Previous: {comparison.previous.uniqueContributors}</p>
                </div>
              </div>
              {renderChangeIndicator(comparison.changes.uniqueContributors)}
            </div>
          </div>

          {/* Additional Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Open PRs */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-sm font-medium text-slate-400 mb-3">Open PRs</h3>
              <div className="flex items-baseline justify-between mb-2">
                <div>
                  <p className="text-3xl font-bold text-white">{comparison.current.openPRs}</p>
                  <p className="text-xs text-slate-500 mt-1">Previous: {comparison.previous.openPRs}</p>
                </div>
              </div>
              {renderChangeIndicator(comparison.changes.openPRs)}
            </div>

            {/* Closed PRs */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-sm font-medium text-slate-400 mb-3">Closed PRs</h3>
              <div className="flex items-baseline justify-between mb-2">
                <div>
                  <p className="text-3xl font-bold text-white">{comparison.current.closedPRs}</p>
                  <p className="text-xs text-slate-500 mt-1">Previous: {comparison.previous.closedPRs}</p>
                </div>
              </div>
              {renderChangeIndicator(comparison.changes.closedPRs)}
            </div>

            {/* Avg Merge Time */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-sm font-medium text-slate-400 mb-3">Avg Time to Merge</h3>
              <div className="flex items-baseline justify-between mb-2">
                <div>
                  <p className="text-3xl font-bold text-white">{comparison.current.avgMergeTime.toFixed(1)}</p>
                  <p className="text-xs text-slate-500 mt-1">Previous: {comparison.previous.avgMergeTime.toFixed(1)} days</p>
                </div>
              </div>
              {renderChangeIndicator(comparison.changes.avgMergeTime, ' days')}
            </div>
          </div>

          {/* New Advanced Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Draft PRs */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-medium text-slate-400">Draft PRs</h3>
              </div>
              <div className="flex items-baseline justify-between mb-2">
                <div>
                  <p className="text-3xl font-bold text-white">{comparison.current.draftPRs}</p>
                  <p className="text-xs text-slate-500 mt-1">Previous: {comparison.previous.draftPRs}</p>
                </div>
              </div>
              {renderChangeIndicator(comparison.changes.draftPRs)}
            </div>

            {/* Bot PRs */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-3">
                <Bot className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-medium text-slate-400">Bot PRs</h3>
              </div>
              <div className="flex items-baseline justify-between mb-2">
                <div>
                  <p className="text-3xl font-bold text-white">{comparison.current.botPRs}</p>
                  <p className="text-xs text-slate-500 mt-1">Previous: {comparison.previous.botPRs}</p>
                </div>
              </div>
              {renderChangeIndicator(comparison.changes.botPRs)}
            </div>

            {/* Stale PRs */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <h3 className="text-sm font-medium text-slate-400">Stale PRs</h3>
              </div>
              <div className="flex items-baseline justify-between mb-2">
                <div>
                  <p className="text-3xl font-bold text-white">{comparison.current.stalePRs}</p>
                  <p className="text-xs text-slate-500 mt-1">Previous: {comparison.previous.stalePRs}</p>
                </div>
              </div>
              {renderChangeIndicator(comparison.changes.stalePRs)}
            </div>

            {/* Avg PR Age */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4 text-yellow-400" />
                <h3 className="text-sm font-medium text-slate-400">Avg PR Age</h3>
              </div>
              <div className="flex items-baseline justify-between mb-2">
                <div>
                  <p className="text-3xl font-bold text-white">{comparison.current.avgPRAge.toFixed(1)}</p>
                  <p className="text-xs text-slate-500 mt-1">Previous: {comparison.previous.avgPRAge.toFixed(1)}d</p>
                </div>
              </div>
              {renderChangeIndicator(comparison.changes.avgPRAge, 'd')}
            </div>
          </div>

          {/* Comparison Chart */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Side-by-Side Comparison</h3>
            <div style={{ height: '400px' }}>
              <ResponsiveBar
                data={chartData}
                keys={[`Previous ${comparisonPeriod === 'week' ? 'Week' : 'Month'}`, `Current ${comparisonPeriod === 'week' ? 'Week' : 'Month'}`]}
                indexBy="metric"
                margin={{ top: 20, right: 130, bottom: 50, left: 60 }}
                padding={0.3}
                groupMode="grouped"
                valueScale={{ type: 'linear' }}
                colors={['#6366f1', '#22c55e']}
                axisBottom={{
                  tickRotation: 0,
                  legend: 'Metrics',
                  legendPosition: 'middle',
                  legendOffset: 40
                }}
                axisLeft={{
                  legend: 'Count',
                  legendPosition: 'middle',
                  legendOffset: -50
                }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor="#fff"
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
                    itemTextColor: '#94a3b8',
                    effects: [
                      {
                        on: 'hover',
                        style: {
                          itemOpacity: 1,
                          itemTextColor: '#fff'
                        }
                      }
                    ]
                  }
                ]}
                theme={{
                  axis: {
                    ticks: { text: { fill: '#94a3b8' } },
                    legend: { text: { fill: '#94a3b8' } }
                  },
                  grid: { line: { stroke: '#334155' } },
                  tooltip: {
                    container: {
                      background: '#1e293b',
                      color: '#fff',
                      border: '1px solid #334155'
                    }
                  }
                }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default PRComparison
