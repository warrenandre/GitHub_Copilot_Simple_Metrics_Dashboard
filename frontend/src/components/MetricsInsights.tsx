import { TrendingUp, AlertTriangle, CheckCircle, Info, Target } from 'lucide-react'

interface InsightCardProps {
  type: 'success' | 'warning' | 'info' | 'opportunity'
  title: string
  description: string
  metric?: string
  recommendation?: string
}

const InsightCard = ({ type, title, description, metric, recommendation }: InsightCardProps) => {
  const config = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-500 bg-opacity-10',
      borderColor: 'border-green-500',
      iconColor: 'text-green-400',
      textColor: 'text-green-400',
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-yellow-500 bg-opacity-10',
      borderColor: 'border-yellow-500',
      iconColor: 'text-yellow-400',
      textColor: 'text-yellow-400',
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-500 bg-opacity-10',
      borderColor: 'border-blue-500',
      iconColor: 'text-blue-400',
      textColor: 'text-blue-400',
    },
    opportunity: {
      icon: TrendingUp,
      bgColor: 'bg-purple-500 bg-opacity-10',
      borderColor: 'border-purple-500',
      iconColor: 'text-purple-400',
      textColor: 'text-purple-400',
    },
  }

  const { icon: Icon, bgColor, borderColor, iconColor, textColor } = config[type]

  return (
    <div className={`${bgColor} border ${borderColor} rounded-lg p-4`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${iconColor} mt-0.5 flex-shrink-0`} />
        <div className="flex-1 min-w-0">
          <h4 className={`text-sm font-semibold ${textColor} mb-1`}>{title}</h4>
          {metric && (
            <p className="text-2xl font-bold text-white dark:text-white light:text-gray-900 mb-2">{metric}</p>
          )}
          <p className="text-sm text-slate-300 dark:text-slate-300 light:text-gray-600 mb-2">{description}</p>
          {recommendation && (
            <div className="mt-3 pt-3 border-t border-slate-700 dark:border-slate-700 light:border-gray-300">
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-400 light:text-gray-600 mb-1">💡 Recommendation:</p>
              <p className="text-xs text-slate-300 dark:text-slate-300 light:text-gray-600">{recommendation}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface MetricsInsightsProps {
  acceptanceRate?: number
  activeUsers?: number
  totalUsers?: number
  suggestionCount?: number
  weekOverWeekGrowth?: number
  chatUsage?: number
}

const MetricsInsights = ({
  acceptanceRate = 0,
  activeUsers = 0,
  totalUsers = 0,
  suggestionCount = 0,
  weekOverWeekGrowth = 0,
  chatUsage = 0,
}: MetricsInsightsProps) => {
  const wauRatio = totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0
  const insights = []

  // Overall usage trends insights
  if (acceptanceRate >= 25) {
    insights.push({
      type: 'success' as const,
      title: 'Strong Acceptance Rate',
      metric: `${acceptanceRate.toFixed(1)}%`,
      description: 'A rising acceptance rate suggests increasing trust and usefulness of Copilot suggestions.',
      recommendation: 'Continue monitoring trends. Share success stories with teams showing lower adoption.',
    })
  } else if (acceptanceRate < 20) {
    insights.push({
      type: 'warning' as const,
      title: 'Low Acceptance Rate',
      metric: `${acceptanceRate.toFixed(1)}%`,
      description: 'A declining acceptance rate may indicate mismatched suggestions or workflow friction.',
      recommendation: 'Encourage feedback and verify IDE and extension versions. Consider team-level training sessions.',
    })
  }

  // WAU ratio insights
  if (wauRatio >= 60) {
    insights.push({
      type: 'success' as const,
      title: 'Healthy Weekly Active Usage',
      metric: `${wauRatio.toFixed(0)}%`,
      description: 'A healthy WAU-to-license ratio (>60%) indicates strong ongoing usage across your enterprise.',
      recommendation: 'Maintain momentum by highlighting productivity wins and sharing best practices.',
    })
  } else if (wauRatio > 0 && wauRatio < 40) {
    insights.push({
      type: 'warning' as const,
      title: 'Low Weekly Active Usage',
      metric: `${wauRatio.toFixed(0)}%`,
      description: 'Some teams may not have Copilot Chat enabled or configured correctly.',
      recommendation: 'Verify license assignment and IDE setup. Offer team-level onboarding sessions.',
    })
  }

  // Growth trends
  if (weekOverWeekGrowth > 10) {
    insights.push({
      type: 'success' as const,
      title: 'Sustained Growth',
      metric: `+${weekOverWeekGrowth.toFixed(1)}%`,
      description: 'Sustained daily active user growth signals consistent engagement and adoption.',
      recommendation: 'Document what\'s working well to replicate success across other teams.',
    })
  } else if (weekOverWeekGrowth < -10) {
    insights.push({
      type: 'warning' as const,
      title: 'Declining Usage',
      metric: `${weekOverWeekGrowth.toFixed(1)}%`,
      description: 'Sharp declines may indicate configuration issues or reduced interest.',
      recommendation: 'Investigate potential blockers. Reach out to teams with declining usage for feedback.',
    })
  }

  // Feature adoption insights
  if (chatUsage > 0) {
    const avgChatsPerUser = activeUsers > 0 ? chatUsage / activeUsers : 0
    if (avgChatsPerUser >= 5) {
      insights.push({
        type: 'success' as const,
        title: 'Strong Chat Adoption',
        metric: `${avgChatsPerUser.toFixed(1)} chats/user`,
        description: 'Developers are progressing from basic completions to more advanced Copilot features.',
        recommendation: 'Share advanced chat mode tips (Ask, Edit, Agent) to maximize value.',
      })
    } else if (avgChatsPerUser < 2 && avgChatsPerUser > 0) {
      insights.push({
        type: 'opportunity' as const,
        title: 'Low Chat Feature Usage',
        metric: `${avgChatsPerUser.toFixed(1)} chats/user`,
        description: 'Developers may not be aware of Copilot Chat capabilities beyond code completions.',
        recommendation: 'Share internal demos or success stories showcasing Chat and Agent features.',
      })
    }
  }

  // Productivity insights
  if (suggestionCount > 0) {
    const suggestionsPerUser = activeUsers > 0 ? suggestionCount / activeUsers : 0
    if (suggestionsPerUser >= 100) {
      insights.push({
        type: 'info' as const,
        title: 'High Engagement',
        metric: `${suggestionsPerUser.toFixed(0)} suggestions/user`,
        description: 'Users are actively leveraging Copilot throughout their development workflow.',
        recommendation: 'Consider combining dashboard trends with surveys to measure productivity impact.',
      })
    }
  }

  // General opportunities if few insights
  if (insights.length < 2) {
    insights.push({
      type: 'info' as const,
      title: 'Monitor Key Metrics',
      description: 'Track daily active users (DAU), acceptance rates, and feature adoption to identify trends.',
      recommendation: 'Set up regular review cadence to spot usage patterns and opportunities for improvement.',
    })

    insights.push({
      type: 'opportunity' as const,
      title: 'Maximize Copilot Value',
      description: 'Encourage developers to explore multiple Copilot capabilities: completions, chat (Ask, Edit), and agent features.',
      recommendation: 'Share best practices and conduct enablement sessions for teams with lower engagement.',
    })
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-white dark:text-white light:text-gray-900">Actionable Insights</h3>
      </div>
      <p className="text-sm text-slate-400 dark:text-slate-400 light:text-gray-600 mb-4">
        Based on GitHub's official guidance for interpreting Copilot metrics
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight, index) => (
          <InsightCard key={index} {...insight} />
        ))}
      </div>
    </div>
  )
}

export default MetricsInsights
