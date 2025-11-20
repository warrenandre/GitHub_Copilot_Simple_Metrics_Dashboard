import { useState, useEffect, useMemo } from 'react'
import { GitPullRequest, Users, GitMerge, Clock, TrendingUp, Calendar, User, AlertCircle, FileText, Bot, Hourglass, AlertTriangle } from 'lucide-react'
import { ResponsiveLine } from '@nivo/line'
import { ResponsiveBar } from '@nivo/bar'
import { ResponsivePie } from '@nivo/pie'
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

const RepoMetrics = () => {
  const [repoData, setRepoData] = useState<RepoMetricsData[]>([])
  const [selectedRepo, setSelectedRepo] = useState<string>('')
  const [isDemo, setIsDemo] = useState(false)

  // Load all repository metrics from localStorage
  useEffect(() => {
    const loadRepoMetrics = () => {
      const allRepos: RepoMetricsData[] = []
      
      // Iterate through localStorage to find all repo metrics
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

  // Calculate metrics from PR data
  const metrics = useMemo(() => {
    if (!currentRepo) return null

    const prs = currentRepo.pullRequests
    const openPRs = prs.filter(pr => pr.state === 'open')
    const closedPRs = prs.filter(pr => pr.state === 'closed')
    const mergedPRs = prs.filter(pr => pr.merged_at !== null)
    const draftPRs = prs.filter(pr => pr.draft)
    const readyPRs = prs.filter(pr => !pr.draft)

    // Bot vs Human PRs
    const botPRs = prs.filter(pr => pr.user.login.toLowerCase().includes('bot') || pr.user.login === 'Copilot')
    const humanPRs = prs.filter(pr => !pr.user.login.toLowerCase().includes('bot') && pr.user.login !== 'Copilot')

    // Calculate average time to merge (in days)
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

    // Calculate PR age metrics for open PRs
    const now = new Date()
    const openPRAges = openPRs.map(pr => {
      const created = new Date(pr.created_at)
      const ageInDays = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
      return { pr, ageInDays }
    })

    const avgPRAge = openPRAges.length > 0
      ? openPRAges.reduce((sum, item) => sum + item.ageInDays, 0) / openPRAges.length
      : 0

    // Stale PRs (no activity in last 7 days)
    const stalePRs = openPRs.filter(pr => {
      const updated = new Date(pr.updated_at)
      const daysSinceUpdate = (now.getTime() - updated.getTime()) / (1000 * 60 * 60 * 24)
      return daysSinceUpdate > 7
    })

    // Oldest open PR
    const oldestPR = openPRAges.length > 0
      ? openPRAges.reduce((oldest, current) => 
          current.ageInDays > oldest.ageInDays ? current : oldest
        )
      : null

    // Top contributors
    const contributorCounts: { [key: string]: number } = {}
    prs.forEach(pr => {
      contributorCounts[pr.user.login] = (contributorCounts[pr.user.login] || 0) + 1
    })

    const topContributors = Object.entries(contributorCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)

    // PRs over time (by month)
    const prsByMonth: { [key: string]: number } = {}
    prs.forEach(pr => {
      const date = new Date(pr.created_at)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      prsByMonth[monthKey] = (prsByMonth[monthKey] || 0) + 1
    })

    // Merge rate
    const mergeRate = closedPRs.length > 0
      ? (mergedPRs.length / closedPRs.length) * 100
      : 0

    // Draft vs Ready percentages
    const draftPercentage = prs.length > 0 ? (draftPRs.length / prs.length) * 100 : 0
    const readyPercentage = prs.length > 0 ? (readyPRs.length / prs.length) * 100 : 0

    // Bot vs Human percentages
    const botPercentage = prs.length > 0 ? (botPRs.length / prs.length) * 100 : 0
    const humanPercentage = prs.length > 0 ? (humanPRs.length / prs.length) * 100 : 0

    return {
      total: prs.length,
      open: openPRs.length,
      closed: closedPRs.length,
      merged: mergedPRs.length,
      draft: draftPRs.length,
      ready: readyPRs.length,
      bot: botPRs.length,
      human: humanPRs.length,
      avgMergeTime: avgMergeTime.toFixed(1),
      mergeRate: mergeRate.toFixed(1),
      avgPRAge: avgPRAge.toFixed(1),
      stalePRsCount: stalePRs.length,
      oldestPRAge: oldestPR ? oldestPR.ageInDays.toFixed(1) : '0',
      draftPercentage: draftPercentage.toFixed(1),
      readyPercentage: readyPercentage.toFixed(1),
      botPercentage: botPercentage.toFixed(1),
      humanPercentage: humanPercentage.toFixed(1),
      topContributors,
      prsByMonth
    }
  }, [currentRepo])

  // Prepare chart data for PRs over time
  const timelineData = useMemo(() => {
    if (!metrics) return []

    const sortedMonths = Object.keys(metrics.prsByMonth).sort()
    return [{
      id: 'Pull Requests',
      data: sortedMonths.map(month => ({
        x: month,
        y: metrics.prsByMonth[month]
      }))
    }]
  }, [metrics])

  // Prepare data for state breakdown pie chart
  const stateData = useMemo(() => {
    if (!metrics) return []

    return [
      { id: 'Open', label: 'Open', value: metrics.open, color: 'hsl(207, 90%, 54%)' },
      { id: 'Merged', label: 'Merged', value: metrics.merged, color: 'hsl(142, 70%, 45%)' },
      { id: 'Closed (Not Merged)', label: 'Closed', value: metrics.closed - metrics.merged, color: 'hsl(0, 70%, 50%)' }
    ].filter(item => item.value > 0)
  }, [metrics])

  // Prepare data for top contributors bar chart
  const contributorData = useMemo(() => {
    if (!metrics) return []

    return metrics.topContributors.map(([login, count]) => ({
      contributor: login,
      prs: count
    }))
  }, [metrics])

  if (repoData.length === 0 && !isDemo) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <GitPullRequest className="w-8 h-8 text-blue-500" />
          <div>
            <h1 className="text-3xl font-bold text-white">Repository Metrics</h1>
            <p className="text-slate-400 mt-1">Pull request analytics and insights</p>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-12 text-center">
          <AlertCircle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Repository Data Available</h3>
          <p className="text-slate-400 mb-6">
            Configure repositories and fetch metrics from the Repository List page to view analytics here.
          </p>
          <div className="flex items-center justify-center gap-4">
            <a
              href="/admin/repositories"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              <GitPullRequest className="w-5 h-5" />
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
      {/* Header with Repo Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <GitPullRequest className="w-8 h-8 text-blue-500" />
          <div>
            <h1 className="text-3xl font-bold text-white">Repository Metrics</h1>
            <p className="text-slate-400 mt-1">Pull request analytics and insights</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Demo Data Toggle */}
          <DataSourceToggle isDemo={isDemo} onToggle={setIsDemo} />

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

      {currentRepo && metrics && (
        <>
          {/* Info Banner */}
          <div className={`border rounded-lg p-4 ${
            isDemo 
              ? 'bg-purple-900/20 border-purple-700/50' 
              : 'bg-blue-900/20 border-blue-700/50'
          }`}>
            <div className="flex items-center gap-3">
              <Calendar className={`w-5 h-5 ${isDemo ? 'text-purple-400' : 'text-blue-400'}`} />
              <div className={`text-sm ${isDemo ? 'text-purple-100' : 'text-blue-100'}`}>
                {isDemo ? (
                  <>
                    <span className="font-semibold">Demo Mode Active:</span> Showing sample data •{' '}
                    <span className="font-semibold">Repository:</span> {currentRepo.owner}/{currentRepo.name} •{' '}
                    <span className="font-semibold">Total PRs:</span> {metrics.total}
                  </>
                ) : (
                  <>
                    <span className="font-semibold">Repository:</span> {currentRepo.owner}/{currentRepo.name} •{' '}
                    <span className="font-semibold">Fetched:</span> {new Date(currentRepo.fetchedAt).toLocaleString()} •{' '}
                    <span className="font-semibold">Total PRs:</span> {metrics.total}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <GitPullRequest className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm font-medium text-slate-400">Total Pull Requests</h3>
              </div>
              <p className="text-3xl font-bold text-white">{metrics.total}</p>
              <p className="text-xs text-slate-500 mt-1">
                {metrics.open} open • {metrics.closed} closed
              </p>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <GitMerge className="w-5 h-5 text-green-400" />
                <h3 className="text-sm font-medium text-slate-400">Merge Rate</h3>
              </div>
              <p className="text-3xl font-bold text-white">{metrics.mergeRate}%</p>
              <p className="text-xs text-slate-500 mt-1">
                {metrics.merged} of {metrics.closed} closed PRs merged
              </p>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-medium text-slate-400">Avg Time to Merge</h3>
              </div>
              <p className="text-3xl font-bold text-white">{metrics.avgMergeTime}</p>
              <p className="text-xs text-slate-500 mt-1">days</p>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-orange-400" />
                <h3 className="text-sm font-medium text-slate-400">Contributors</h3>
              </div>
              <p className="text-3xl font-bold text-white">{metrics.topContributors.length}</p>
              <p className="text-xs text-slate-500 mt-1">
                {metrics.draft} draft PRs
              </p>
            </div>
          </div>

          {/* New Additional Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <Hourglass className="w-5 h-5 text-yellow-400" />
                <h3 className="text-sm font-medium text-slate-400">Avg PR Age (Open)</h3>
              </div>
              <p className="text-3xl font-bold text-white">{metrics.avgPRAge}</p>
              <p className="text-xs text-slate-500 mt-1">
                days • Oldest: {metrics.oldestPRAge}d
              </p>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <h3 className="text-sm font-medium text-slate-400">Stale PRs</h3>
              </div>
              <p className="text-3xl font-bold text-white">{metrics.stalePRsCount}</p>
              <p className="text-xs text-slate-500 mt-1">
                No activity &gt;7 days
              </p>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-medium text-slate-400">Draft vs Ready</h3>
              </div>
              <p className="text-3xl font-bold text-white">{metrics.draftPercentage}%</p>
              <p className="text-xs text-slate-500 mt-1">
                {metrics.draft} draft • {metrics.ready} ready
              </p>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <Bot className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-medium text-slate-400">Bot Contribution</h3>
              </div>
              <p className="text-3xl font-bold text-white">{metrics.botPercentage}%</p>
              <p className="text-xs text-slate-500 mt-1">
                {metrics.bot} bot • {metrics.human} human
              </p>
            </div>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* PRs Over Time */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">Pull Requests Over Time</h3>
              </div>
              <div style={{ height: '300px' }}>
                <ResponsiveLine
                  data={timelineData}
                  margin={{ top: 20, right: 20, bottom: 50, left: 50 }}
                  xScale={{ type: 'point' }}
                  yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false }}
                  curve="monotoneX"
                  axisBottom={{
                    tickRotation: -45,
                    legend: 'Month',
                    legendOffset: 45,
                    legendPosition: 'middle'
                  }}
                  axisLeft={{
                    legend: 'Pull Requests',
                    legendOffset: -40,
                    legendPosition: 'middle'
                  }}
                  pointSize={8}
                  pointColor={{ from: 'color' }}
                  pointBorderWidth={2}
                  pointBorderColor={{ from: 'serieColor' }}
                  enableGridX={false}
                  colors={{ scheme: 'nivo' }}
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

            {/* State Breakdown */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <GitPullRequest className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">PR State Distribution</h3>
              </div>
              <div style={{ height: '300px' }}>
                <ResponsivePie
                  data={stateData}
                  margin={{ top: 20, right: 80, bottom: 20, left: 80 }}
                  innerRadius={0.5}
                  padAngle={0.7}
                  cornerRadius={3}
                  activeOuterRadiusOffset={8}
                  colors={{ datum: 'data.color' }}
                  borderWidth={1}
                  borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                  arcLinkLabelsSkipAngle={10}
                  arcLinkLabelsTextColor="#94a3b8"
                  arcLinkLabelsThickness={2}
                  arcLinkLabelsColor={{ from: 'color' }}
                  arcLabelsSkipAngle={10}
                  arcLabelsTextColor="#fff"
                  theme={{
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
          </div>

          {/* Top Contributors Chart */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-orange-400" />
              <h3 className="text-lg font-semibold text-white">Top Contributors</h3>
            </div>
            <div style={{ height: '300px' }}>
              <ResponsiveBar
                data={contributorData}
                keys={['prs']}
                indexBy="contributor"
                margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
                padding={0.3}
                valueScale={{ type: 'linear' }}
                colors={{ scheme: 'nivo' }}
                axisBottom={{
                  tickRotation: -45,
                  legend: 'Contributor',
                  legendPosition: 'middle',
                  legendOffset: 45
                }}
                axisLeft={{
                  legend: 'Pull Requests',
                  legendPosition: 'middle',
                  legendOffset: -50
                }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor="#fff"
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

export default RepoMetrics
