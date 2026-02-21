import { GitHubCopilotMetricsResponse, DailyMetrics as GitHubDailyMetrics, CopilotMetricsResponse, TeamMetrics } from '../types/metrics'

// Internal transformed metrics format for charts
export interface TransformedDailyMetrics {
  date: string
  activeUsers: number
  suggestions: number
  acceptances: number
  linesAccepted: number
  chatConversations: number
  chatInsertions: number
  averageResponseTime: number
  languageBreakdown: Record<string, number>
  editorBreakdown: Record<string, number>
}

/**
 * Transform GitHub API response to our internal metrics format
 */
export const transformGitHubData = (githubData: GitHubCopilotMetricsResponse): CopilotMetricsResponse => {
  const teamMetrics: TeamMetrics[] = githubData.map((day: GitHubDailyMetrics) => {
    // Calculate totals from nested structures
    const totalSuggestions = (day.copilot_ide_code_completions?.languages || [])
      .reduce((sum, lang) => sum + (lang.total_code_suggestions || 0), 0)
    
    const totalAcceptances = (day.copilot_ide_code_completions?.languages || [])
      .reduce((sum, lang) => sum + (lang.total_code_acceptances || 0), 0)
    
    const totalLinesAccepted = (day.copilot_ide_code_completions?.languages || [])
      .reduce((sum, lang) => sum + (lang.total_code_lines_accepted || 0), 0)

    const totalLinesSuggested = (day.copilot_ide_code_completions?.languages || [])
      .reduce((sum, lang) => sum + (lang.total_code_lines_suggested || 0), 0)

    const totalChatInsertions = (day.copilot_ide_chat?.editors || [])
      .reduce((sum, editor) => {
        return sum + (editor.models || [])
          .reduce((modelSum, model) => modelSum + (model.total_chat_insertion_events || 0), 0)
      }, 0)

    const totalChatTurns = (day.copilot_ide_chat?.editors || [])
      .reduce((sum, editor) => {
        return sum + (editor.models || [])
          .reduce((modelSum, model) => modelSum + (model.total_chats || 0), 0)
      }, 0)

    // Extract PR metrics from dotcom pull requests
    const totalPREngagedUsers = day.copilot_dotcom_pull_requests?.total_engaged_users || 0

    return {
      date: day.date,
      total_active_users: day.total_active_users || 0,
      total_suggestions_count: totalSuggestions,
      total_acceptances_count: totalAcceptances,
      total_lines_suggested: totalLinesSuggested,
      total_lines_accepted: totalLinesAccepted,
      total_chat_acceptances: totalChatInsertions,
      total_chat_turns: totalChatTurns,
      total_active_chat_users: day.copilot_ide_chat?.total_engaged_users || 0,
      total_pr_summaries_created: totalPREngagedUsers, // Using engaged users as proxy for summaries
      total_pr_engaged_users: totalPREngagedUsers,
    }
  })

  return {
    data: teamMetrics,
    editors: extractEditorMetrics(githubData),
    languages: extractLanguageMetrics(githubData),
  }
}

/**
 * Extract aggregated editor metrics
 */
const extractEditorMetrics = (githubData: GitHubCopilotMetricsResponse) => {
  const editorMap = new Map<string, number>()

  githubData.forEach(day => {
    const editors = day.copilot_ide_code_completions?.editors || []
    editors.forEach(editor => {
      const current = editorMap.get(editor.name) || 0
      editorMap.set(editor.name, Math.max(current, editor.total_engaged_users))
    })
  })

  return Array.from(editorMap.entries()).map(([name, total_engaged_users]) => ({
    name,
    total_engaged_users,
  }))
}

/**
 * Extract aggregated language metrics
 */
const extractLanguageMetrics = (githubData: GitHubCopilotMetricsResponse) => {
  const languageMap = new Map<string, number>()

  githubData.forEach(day => {
    const languages = day.copilot_ide_code_completions?.languages || []
    languages.forEach(lang => {
      const current = languageMap.get(lang.name) || 0
      languageMap.set(lang.name, Math.max(current, lang.total_engaged_users))
    })
  })

  return Array.from(languageMap.entries()).map(([name, total_engaged_users]) => ({
    name,
    total_engaged_users,
  }))
}

/**
 * Calculate acceptance rate from team metrics
 */
export const calculateAcceptanceRate = (metrics: TeamMetrics[]): number => {
  const totalSuggestions = metrics.reduce((sum, day) => sum + day.total_suggestions_count, 0)
  const totalAcceptances = metrics.reduce((sum, day) => sum + day.total_acceptances_count, 0)
  
  return totalSuggestions > 0 ? (totalAcceptances / totalSuggestions) * 100 : 0
}

/**
 * Calculate average metrics across all days
 */
export const calculateAverageMetrics = (metrics: TeamMetrics[]) => {
  const count = metrics.length
  
  if (count === 0) {
    return {
      avgActiveUsers: 0,
      avgSuggestions: 0,
      avgAcceptances: 0,
      avgChatConversations: 0,
    }
  }

  return {
    avgActiveUsers: Math.round(metrics.reduce((sum, day) => sum + day.total_active_users, 0) / count),
    avgSuggestions: Math.round(metrics.reduce((sum, day) => sum + day.total_suggestions_count, 0) / count),
    avgAcceptances: Math.round(metrics.reduce((sum, day) => sum + day.total_acceptances_count, 0) / count),
    avgChatConversations: Math.round(metrics.reduce((sum, day) => sum + day.total_active_chat_users, 0) / count),
  }
}

/**
 * Get adoption trend (week-over-week comparison)
 */
export const getAdoptionTrend = (metrics: TeamMetrics[]): { current: number; previous: number; change: number } => {
  if (metrics.length < 7) {
    return { current: 0, previous: 0, change: 0 }
  }

  const lastWeek = metrics.slice(-7)
  const previousWeek = metrics.slice(-14, -7)

  const currentAvg = lastWeek.reduce((sum, day) => sum + day.total_active_users, 0) / 7
  const previousAvg = previousWeek.reduce((sum, day) => sum + day.total_active_users, 0) / 7

  const change = previousAvg > 0 ? ((currentAvg - previousAvg) / previousAvg) * 100 : 0

  return {
    current: Math.round(currentAvg),
    previous: Math.round(previousAvg),
    change: Math.round(change),
  }
}
