import { useMemo, useState, useEffect } from 'react'
import { Lightbulb, TrendingUp, AlertCircle, CheckCircle, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react'
import DateRangeFilter, { DateRangeType } from '../../../components/DateRangeFilter'
import { filterDataByDateRange } from '../../../utils/dateFilters'

interface DayTotal {
  day: string
  daily_active_users: number
  weekly_active_users: number
  monthly_active_users: number
  monthly_active_chat_users: number
  user_initiated_interaction_count: number
  code_generation_activity_count: number
  code_acceptance_activity_count: number
  totals_by_feature: Array<{
    feature: string
    user_initiated_interaction_count: number
  }>
}

interface Report28DayData {
  report_start_day: string
  report_end_day: string
  day_totals: DayTotal[]
}

interface MetricsData {
  date: string
  total_active_users: number
  total_engaged_users: number
  code_completions_users: number
  chat_users: number
  user_interactions: number
  code_generations: number
  code_acceptances: number
}

interface Insight {
  type: 'success' | 'warning' | 'info' | 'action'
  title: string
  description: string
  recommendation?: string
  metric?: string
  calculation?: string
}

const Insights = () => {
  const [selectedRange, setSelectedRange] = useState<DateRangeType>('all')
  const [metricsData, setMetricsData] = useState<MetricsData[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedInsights, setExpandedInsights] = useState<Set<number>>(new Set())

  useEffect(() => {
    const loadData = () => {
      try {
        const jsonStr = localStorage.getItem('enterprise_report_data')
        if (jsonStr) {
          const data: Report28DayData = JSON.parse(jsonStr)
          
          // Transform 28-day report data to metrics format
          const transformed: MetricsData[] = data.day_totals.map((day) => {
            // Calculate chat users from totals_by_feature
            const chatUsers = day.totals_by_feature
              .filter(f => f.feature === 'copilot_chat')
              .reduce((sum, f) => sum + f.user_initiated_interaction_count, 0)
            
            // Calculate code completion users from totals_by_feature
            const codeUsers = day.totals_by_feature
              .filter(f => f.feature === 'code_completion')
              .reduce((sum, f) => sum + f.user_initiated_interaction_count, 0)
            
            // Users who had any activity are considered engaged
            const engagedUsers = day.user_initiated_interaction_count > 0 
              ? day.daily_active_users 
              : 0
            
            return {
              date: day.day,
              total_active_users: day.daily_active_users,
              total_engaged_users: engagedUsers,
              code_completions_users: codeUsers,
              chat_users: chatUsers,
              user_interactions: day.user_initiated_interaction_count,
              code_generations: day.code_generation_activity_count,
              code_acceptances: day.code_acceptance_activity_count
            }
          })
          
          setMetricsData(transformed)
        }
      } catch (error) {
        console.error('Failed to load report data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const filteredData = useMemo(() => {
    return filterDataByDateRange(metricsData, selectedRange)
  }, [metricsData, selectedRange])

  const insights = useMemo(() => {
    const results: Insight[] = []
    
    if (filteredData.length === 0) return results

    // Calculate key metrics
    const avgActiveUsers = filteredData.reduce((sum: number, d: MetricsData) => sum + d.total_active_users, 0) / filteredData.length
    const avgEngagedUsers = filteredData.reduce((sum: number, d: MetricsData) => sum + d.total_engaged_users, 0) / filteredData.length
    const engagementRate = (avgEngagedUsers / avgActiveUsers) * 100
    
    const totalCodeCompletions = filteredData.reduce((sum: number, d: MetricsData) => 
      sum + d.code_completions_users, 0)
    const avgCodeCompletionUsers = totalCodeCompletions / filteredData.length
    
    const totalChatUsers = filteredData.reduce((sum: number, d: MetricsData) => 
      sum + d.chat_users, 0)
    const avgChatUsers = totalChatUsers / filteredData.length
    
    const codeAdoptionRate = (avgCodeCompletionUsers / avgActiveUsers) * 100
    const chatAdoptionRate = (avgChatUsers / avgActiveUsers) * 100
    
    // Calculate acceptance rate from code generations vs acceptances
    const totalGenerations = filteredData.reduce((sum: number, d: MetricsData) => sum + d.code_generations, 0)
    const totalAcceptances = filteredData.reduce((sum: number, d: MetricsData) => sum + d.code_acceptances, 0)
    const acceptanceRate = totalGenerations > 0 ? (totalAcceptances / totalGenerations) * 100 : 0

    // 1. Overall Engagement Analysis
    if (engagementRate >= 75) {
      results.push({
        type: 'success',
        title: 'Excellent Engagement Rate',
        description: `Your ${engagementRate.toFixed(1)}% engagement rate is excellent! Users are actively utilizing Copilot features.`,
        recommendation: 'Share success stories and best practices across teams to maintain momentum.',
        metric: `${engagementRate.toFixed(1)}%`,
        calculation: `Engaged Users: ${avgEngagedUsers.toFixed(0)} / Active Users: ${avgActiveUsers.toFixed(0)} × 100 = ${engagementRate.toFixed(1)}%`
      })
    } else if (engagementRate >= 50) {
      results.push({
        type: 'info',
        title: 'Good Engagement, Room for Growth',
        description: `${engagementRate.toFixed(1)}% of users are engaged. There's opportunity to increase adoption.`,
        recommendation: 'Consider running training sessions or creating internal documentation to help inactive users get started.',
        metric: `${engagementRate.toFixed(1)}%`,
        calculation: `Engaged Users: ${avgEngagedUsers.toFixed(0)} / Active Users: ${avgActiveUsers.toFixed(0)} × 100 = ${engagementRate.toFixed(1)}%`
      })
    } else {
      results.push({
        type: 'warning',
        title: 'Low Engagement Detected',
        description: `Only ${engagementRate.toFixed(1)}% of users are actively using Copilot features.`,
        recommendation: 'Investigate barriers to adoption: lack of awareness, training needs, or technical issues. Schedule onboarding sessions.',
        metric: `${engagementRate.toFixed(1)}%`,
        calculation: `Engaged Users: ${avgEngagedUsers.toFixed(0)} / Active Users: ${avgActiveUsers.toFixed(0)} × 100 = ${engagementRate.toFixed(1)}%`
      })
    }

    // 2. Code Completions Adoption
    if (codeAdoptionRate >= 70) {
      results.push({
        type: 'success',
        title: 'Strong Code Completions Adoption',
        description: `${codeAdoptionRate.toFixed(1)}% of users leverage code completions - a core productivity feature.`,
        recommendation: 'Collect feedback on how code completions are improving developer velocity.',
        metric: `${codeAdoptionRate.toFixed(1)}%`,
        calculation: `Code Completion Users: ${avgCodeCompletionUsers.toFixed(0)} / Active Users: ${avgActiveUsers.toFixed(0)} × 100 = ${codeAdoptionRate.toFixed(1)}%`
      })
    } else if (codeAdoptionRate >= 40) {
      results.push({
        type: 'info',
        title: 'Moderate Code Completions Usage',
        description: `${codeAdoptionRate.toFixed(1)}% of users are using code completions.`,
        recommendation: 'Share tips on maximizing code completion effectiveness. Highlight keyboard shortcuts and best practices.',
        metric: `${codeAdoptionRate.toFixed(1)}%`,
        calculation: `Code Completion Users: ${avgCodeCompletionUsers.toFixed(0)} / Active Users: ${avgActiveUsers.toFixed(0)} × 100 = ${codeAdoptionRate.toFixed(1)}%`
      })
    } else {
      results.push({
        type: 'action',
        title: 'Code Completions Underutilized',
        description: `Only ${codeAdoptionRate.toFixed(1)}% adoption for code completions.`,
        recommendation: 'Provide hands-on workshops. Ensure IDE extensions are properly installed and configured.',
        metric: `${codeAdoptionRate.toFixed(1)}%`,
        calculation: `Code Completion Users: ${avgCodeCompletionUsers.toFixed(0)} / Active Users: ${avgActiveUsers.toFixed(0)} × 100 = ${codeAdoptionRate.toFixed(1)}%`
      })
    }

    // 3. Chat Feature Analysis
    if (chatAdoptionRate >= 50) {
      results.push({
        type: 'success',
        title: 'Chat Feature Well Adopted',
        description: `${chatAdoptionRate.toFixed(1)}% of users are leveraging Copilot Chat for complex queries.`,
        recommendation: 'Share advanced chat prompting techniques and use cases (code explanation, refactoring, debugging).',
        metric: `${chatAdoptionRate.toFixed(1)}%`,
        calculation: `Chat Users: ${avgChatUsers.toFixed(0)} / Active Users: ${avgActiveUsers.toFixed(0)} × 100 = ${chatAdoptionRate.toFixed(1)}%`
      })
    } else if (chatAdoptionRate >= 25) {
      results.push({
        type: 'info',
        title: 'Chat Adoption Growing',
        description: `${chatAdoptionRate.toFixed(1)}% chat adoption shows potential for growth.`,
        recommendation: 'Create examples showing how chat can solve complex problems: "explain this code", "refactor for performance", etc.',
        metric: `${chatAdoptionRate.toFixed(1)}%`,
        calculation: `Chat Users: ${avgChatUsers.toFixed(0)} / Active Users: ${avgActiveUsers.toFixed(0)} × 100 = ${chatAdoptionRate.toFixed(1)}%`
      })
    } else {
      results.push({
        type: 'action',
        title: 'Chat Feature Underutilized',
        description: `Only ${chatAdoptionRate.toFixed(1)}% are using Copilot Chat.`,
        recommendation: 'Demonstrate chat capabilities through live demos. Show how it helps with debugging, code reviews, and learning new frameworks.',
        metric: `${chatAdoptionRate.toFixed(1)}%`,
        calculation: `Chat Users: ${avgChatUsers.toFixed(0)} / Active Users: ${avgActiveUsers.toFixed(0)} × 100 = ${chatAdoptionRate.toFixed(1)}%`
      })
    }

    // 4. Code Acceptance Rate Analysis
    if (acceptanceRate >= 25) {
      results.push({
        type: 'success',
        title: 'Strong Code Acceptance Rate',
        description: `${acceptanceRate.toFixed(1)}% of generated code suggestions are accepted by developers.`,
        recommendation: 'High acceptance rate indicates quality suggestions. Continue monitoring and collect feedback on what makes suggestions useful.',
        metric: `${acceptanceRate.toFixed(1)}%`,
        calculation: `Accepted: ${totalAcceptances.toLocaleString()} / Generated: ${totalGenerations.toLocaleString()} × 100 = ${acceptanceRate.toFixed(1)}%`
      })
    } else if (acceptanceRate >= 15) {
      results.push({
        type: 'info',
        title: 'Moderate Code Acceptance',
        description: `${acceptanceRate.toFixed(1)}% acceptance rate is in the typical range.`,
        recommendation: 'Encourage developers to provide feedback on suggestions. Look for patterns in accepted vs. rejected suggestions.',
        metric: `${acceptanceRate.toFixed(1)}%`,
        calculation: `Accepted: ${totalAcceptances.toLocaleString()} / Generated: ${totalGenerations.toLocaleString()} × 100 = ${acceptanceRate.toFixed(1)}%`
      })
    } else if (acceptanceRate > 0) {
      results.push({
        type: 'warning',
        title: 'Low Code Acceptance Rate',
        description: `Only ${acceptanceRate.toFixed(1)}% of suggestions are being accepted.`,
        recommendation: 'Investigate why suggestions are being rejected. Review code quality, context awareness, or language-specific issues.',
        metric: `${acceptanceRate.toFixed(1)}%`,
        calculation: `Accepted: ${totalAcceptances.toLocaleString()} / Generated: ${totalGenerations.toLocaleString()} × 100 = ${acceptanceRate.toFixed(1)}%`
      })
    }

    // 5. Trend Analysis
    if (filteredData.length >= 3) {
      const firstThird = filteredData.slice(0, Math.floor(filteredData.length / 3))
      const lastThird = filteredData.slice(-Math.floor(filteredData.length / 3))
      
      const earlyEngagement = firstThird.reduce((sum: number, d: MetricsData) => sum + d.total_engaged_users, 0) / firstThird.length
      const recentEngagement = lastThird.reduce((sum: number, d: MetricsData) => sum + d.total_engaged_users, 0) / lastThird.length
      const growthRate = ((recentEngagement - earlyEngagement) / earlyEngagement) * 100

      if (growthRate > 10) {
        results.push({
          type: 'success',
          title: 'Positive Growth Trend',
          description: `Engaged users increased by ${growthRate.toFixed(1)}% during this period.`,
          recommendation: 'Current adoption strategies are working. Document and replicate successful approaches.',
          metric: `+${growthRate.toFixed(1)}%`,
          calculation: `Early Period: ${earlyEngagement.toFixed(0)} users → Recent Period: ${recentEngagement.toFixed(0)} users = ${growthRate.toFixed(1)}% growth`
        })
      } else if (growthRate < -10) {
        results.push({
          type: 'warning',
          title: 'Declining Engagement',
          description: `Engaged users decreased by ${Math.abs(growthRate).toFixed(1)}%.`,
          recommendation: 'Survey users to identify pain points. Check for technical issues or changes affecting the experience.',
          metric: `${growthRate.toFixed(1)}%`,
          calculation: `Early Period: ${earlyEngagement.toFixed(0)} users → Recent Period: ${recentEngagement.toFixed(0)} users = ${growthRate.toFixed(1)}% change`
        })
      } else {
        results.push({
          type: 'info',
          title: 'Stable Engagement',
          description: 'Engagement remains relatively stable over this period.',
          recommendation: 'Focus on expanding adoption to inactive users while maintaining current engagement levels.',
          metric: 'Stable',
          calculation: `Early Period: ${earlyEngagement.toFixed(0)} users → Recent Period: ${recentEngagement.toFixed(0)} users = ${growthRate.toFixed(1)}% (stable)`
        })
      }
    }

    // 6. Best Practice Recommendations
    results.push({
      type: 'action',
      title: 'Maximize ROI',
      description: 'GitHub recommends tracking acceptance rates and user feedback alongside usage metrics.',
      recommendation: 'Conduct quarterly surveys. Track code quality metrics. Measure time savings through developer feedback.',
      metric: 'Best Practice'
    })

    if (avgActiveUsers > 100) {
      results.push({
        type: 'info',
        title: 'Large Team Insights',
        description: 'With a large team, segment analysis by department or team can reveal targeted opportunities.',
        recommendation: 'Use team-level metrics to identify high and low performing groups. Share learnings across teams.',
        metric: `${Math.round(avgActiveUsers)} users`
      })
    }

    return results
  }, [filteredData])

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-400" />
      case 'warning':
        return <AlertCircle className="w-6 h-6 text-yellow-400" />
      case 'action':
        return <TrendingUp className="w-6 h-6 text-blue-400" />
      default:
        return <Lightbulb className="w-6 h-6 text-purple-400" />
    }
  }

  const getInsightBorderColor = (type: Insight['type']) => {
    switch (type) {
      case 'success':
        return 'border-green-500'
      case 'warning':
        return 'border-yellow-500'
      case 'action':
        return 'border-blue-500'
      default:
        return 'border-purple-500'
    }
  }

  const toggleInsightExpansion = (index: number) => {
    const newExpanded = new Set(expandedInsights)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedInsights(newExpanded)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading insights...</p>
        </div>
      </div>
    )
  }

  if (metricsData.length === 0) {
    return (
      <div className="bg-slate-800 rounded-lg p-12 border border-slate-700 text-center">
        <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">No Metrics Data Available</h2>
        <p className="text-slate-400 mb-6">
          Download enterprise metrics from the Admin Settings page to view actionable insights.
        </p>
        <a
          href="/admin"
          className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
        >
          <Lightbulb className="w-5 h-5" />
          Go to Admin Settings
        </a>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Lightbulb className="w-8 h-8 text-purple-400" />
          Actionable Insights
        </h1>
        <p className="text-slate-400 mt-2">
          AI-powered analysis and recommendations based on GitHub best practices
        </p>
      </div>

      {/* Date Range Filter */}
      <DateRangeFilter selectedRange={selectedRange} onRangeChange={setSelectedRange} />

      {/* Insights Grid */}
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div
            key={index}
            className={`bg-slate-800 rounded-lg p-6 border ${getInsightBorderColor(insight.type)}`}
          >
            <div className="flex items-start gap-4">
              <div className="mt-1">{getInsightIcon(insight.type)}</div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-semibold text-white">{insight.title}</h3>
                  {insight.metric && (
                    <div className="px-3 py-1 bg-slate-700 rounded-full">
                      <span className="text-sm font-mono text-slate-300">{insight.metric}</span>
                    </div>
                  )}
                </div>
                <p className="text-slate-300 mb-3">{insight.description}</p>
                {insight.recommendation && (
                  <div className="bg-slate-700 bg-opacity-50 rounded-lg p-4 border-l-4 border-purple-500 mb-3">
                    <p className="text-sm text-slate-200">
                      <span className="font-semibold text-purple-400">Recommendation: </span>
                      {insight.recommendation}
                    </p>
                  </div>
                )}
                {insight.calculation && (
                  <div className="mt-3">
                    <button
                      onClick={() => toggleInsightExpansion(index)}
                      className="flex items-center gap-2 text-sm text-slate-400 hover:text-purple-400 transition-colors"
                    >
                      {expandedInsights.has(index) ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                      {expandedInsights.has(index) ? 'Hide' : 'Show'} Calculation
                    </button>
                    {expandedInsights.has(index) && (
                      <div className="mt-2 bg-slate-900 rounded-lg p-3 border border-slate-700">
                        <p className="text-xs font-mono text-slate-300">{insight.calculation}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* GitHub Best Practices */}
      <div className="bg-gradient-to-r from-purple-900 to-blue-900 bg-opacity-20 rounded-lg p-6 border border-purple-500">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-purple-400" />
          GitHub Copilot Metrics Best Practices
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-300">
          <div>
            <h4 className="font-semibold text-purple-300 mb-2">Focus on Engagement</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Track engaged users vs. total seats</li>
              <li>Aim for 70%+ engagement rate</li>
              <li>Monitor daily/weekly active users</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-purple-300 mb-2">Measure Value</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Survey developers on time savings</li>
              <li>Track code acceptance rates</li>
              <li>Measure code quality improvements</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-purple-300 mb-2">Drive Adoption</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Provide training and documentation</li>
              <li>Share success stories internally</li>
              <li>Address technical blockers quickly</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-purple-300 mb-2">Continuous Improvement</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Review metrics monthly or quarterly</li>
              <li>Iterate on enablement programs</li>
              <li>Celebrate wins with teams</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Insights
