/**
 * Utility to extract available metrics from GitHub Copilot 30-day report JSON
 * Dynamically discovers all metrics from the data structure
 */

export interface ExtractedMetric {
  id: string
  name: string
  category: string
  description: string
  icon: string
  dataPath: string // Path to access this metric in the data
  isBreakdown?: boolean // Whether this metric has a breakdown (by IDE, language, etc.)
  breakdownType?: 'ide' | 'feature' | 'language' | 'model' | 'language_feature' | 'language_model' | 'model_feature'
}

export interface MetricCategory {
  id: string
  name: string
  description: string
}

// Mapping of metric keys to human-readable names and icons
const metricNameMapping: Record<string, { name: string; description: string; icon: string }> = {
  // User Activity Metrics
  daily_active_users: { name: 'Daily Active Users', description: 'Users active today', icon: 'Users' },
  weekly_active_users: { name: 'Weekly Active Users', description: 'Users active this week', icon: 'Users' },
  monthly_active_users: { name: 'Monthly Active Users', description: 'Users active this month', icon: 'Users' },
  monthly_active_chat_users: { name: 'Monthly Chat Users', description: 'Users who used chat this month', icon: 'MessageSquare' },
  monthly_active_agent_users: { name: 'Monthly Agent Users', description: 'Users who used agent mode this month', icon: 'Bot' },
  
  // Interaction Metrics
  user_initiated_interaction_count: { name: 'User Interactions', description: 'Total user-initiated interactions', icon: 'MousePointer' },
  code_generation_activity_count: { name: 'Code Generation Activities', description: 'Total code generation events', icon: 'Code' },
  code_acceptance_activity_count: { name: 'Code Acceptance Activities', description: 'Total code acceptance events', icon: 'CheckCircle' },
  
  // Lines of Code Metrics
  loc_suggested_to_add_sum: { name: 'Lines Suggested (Add)', description: 'Lines of code suggested to add', icon: 'Plus' },
  loc_suggested_to_delete_sum: { name: 'Lines Suggested (Delete)', description: 'Lines of code suggested to delete', icon: 'Minus' },
  loc_added_sum: { name: 'Lines Added', description: 'Lines of code actually added', icon: 'FileCode' },
  loc_deleted_sum: { name: 'Lines Deleted', description: 'Lines of code actually deleted', icon: 'FileX' },
  
  // Pull Request Metrics
  total_reviewed: { name: 'PRs Reviewed', description: 'Total pull requests reviewed', icon: 'Eye' },
  total_created: { name: 'PRs Created', description: 'Total pull requests created', icon: 'GitPullRequest' },
  total_created_by_copilot: { name: 'PRs Created by Copilot', description: 'PRs created with Copilot assistance', icon: 'Sparkles' },
  total_reviewed_by_copilot: { name: 'PRs Reviewed by Copilot', description: 'PRs reviewed with Copilot assistance', icon: 'Search' },
  
  // Feature-specific metrics (from totals_by_feature)
  code_completion: { name: 'Code Completions', description: 'Inline code completion usage', icon: 'Lightbulb' },
  agent_edit: { name: 'Agent Edit', description: 'Agent-assisted code editing', icon: 'Bot' },
  chat_panel_ask_mode: { name: 'Chat Ask Mode', description: 'Questions asked in chat panel', icon: 'MessageCircle' },
  chat_panel_agent_mode: { name: 'Chat Agent Mode', description: 'Agent mode in chat panel', icon: 'Bot' },
  chat_panel_custom_mode: { name: 'Chat Custom Mode', description: 'Custom mode in chat panel', icon: 'Settings' },
  
  // IDE-specific
  vscode: { name: 'VS Code Usage', description: 'Usage in Visual Studio Code', icon: 'Code2' },
  visualstudio: { name: 'Visual Studio Usage', description: 'Usage in Visual Studio', icon: 'Monitor' },
  jetbrains: { name: 'JetBrains Usage', description: 'Usage in JetBrains IDEs', icon: 'Monitor' },
  neovim: { name: 'Neovim Usage', description: 'Usage in Neovim', icon: 'Terminal' },
}

// Category mapping based on metric patterns
function getCategoryForMetric(metricId: string): string {
  if (metricId.includes('active_users')) return 'user_activity'
  if (metricId.includes('interaction') || metricId.includes('activity_count')) return 'interactions'
  if (metricId.includes('loc_') || metricId.includes('lines')) return 'lines_of_code'
  if (metricId.includes('pr_') || metricId.includes('total_reviewed') || metricId.includes('total_created')) return 'pull_requests'
  if (metricId.includes('chat') || metricId.includes('agent')) return 'chat_agent'
  if (metricId.includes('completion') || metricId.includes('code_completion')) return 'code_completions'
  return 'overview'
}

// Default categories
export const extractedCategories: MetricCategory[] = [
  { id: 'user_activity', name: 'User Activity', description: 'Active user metrics over time' },
  { id: 'interactions', name: 'Interactions', description: 'User interaction counts' },
  { id: 'code_completions', name: 'Code Completions', description: 'AI-powered code suggestion metrics' },
  { id: 'lines_of_code', name: 'Lines of Code', description: 'Code suggestion and acceptance by lines' },
  { id: 'chat_agent', name: 'Chat & Agent', description: 'Chat and agent mode usage' },
  { id: 'pull_requests', name: 'Pull Requests', description: 'PR-related Copilot metrics' },
  { id: 'breakdowns', name: 'Breakdowns', description: 'Usage breakdown by IDE, language, etc.' },
  { id: 'overview', name: 'Overview', description: 'General metrics' },
]

/**
 * Extract metrics from the day_totals structure
 */
function extractDayTotalMetrics(dayTotal: Record<string, unknown>): ExtractedMetric[] {
  const metrics: ExtractedMetric[] = []
  const excludeKeys = ['day', 'totals_by_ide', 'totals_by_feature', 'totals_by_language_feature', 
                       'totals_by_language_model', 'totals_by_model_feature', 'pull_requests']
  
  for (const key of Object.keys(dayTotal)) {
    if (excludeKeys.includes(key)) continue
    if (typeof dayTotal[key] === 'number') {
      const mapping = metricNameMapping[key] || {
        name: formatMetricName(key),
        description: `${formatMetricName(key)} metric`,
        icon: 'Activity'
      }
      
      metrics.push({
        id: key,
        name: mapping.name,
        category: getCategoryForMetric(key),
        description: mapping.description,
        icon: mapping.icon,
        dataPath: `day_totals[].${key}`
      })
    }
  }
  
  return metrics
}

/**
 * Extract pull request metrics
 */
function extractPullRequestMetrics(pullRequests: Record<string, unknown>): ExtractedMetric[] {
  const metrics: ExtractedMetric[] = []
  
  for (const key of Object.keys(pullRequests)) {
    if (typeof pullRequests[key] === 'number') {
      const mapping = metricNameMapping[key] || {
        name: formatMetricName(key),
        description: `${formatMetricName(key)} metric`,
        icon: 'GitPullRequest'
      }
      
      metrics.push({
        id: `pr_${key}`,
        name: mapping.name,
        category: 'pull_requests',
        description: mapping.description,
        icon: mapping.icon,
        dataPath: `day_totals[].pull_requests.${key}`
      })
    }
  }
  
  return metrics
}

/**
 * Extract breakdown metrics (by IDE, feature, etc.)
 */
function extractBreakdownMetrics(
  breakdown: Array<Record<string, unknown>>,
  type: ExtractedMetric['breakdownType'],
  pathPrefix: string
): ExtractedMetric[] {
  const metrics: ExtractedMetric[] = []
  
  if (!Array.isArray(breakdown) || breakdown.length === 0) return metrics
  
  // Get unique dimension values (ide names, feature names, etc.)
  const dimensionKey = type === 'ide' ? 'ide' : 
                       type === 'feature' ? 'feature' :
                       type === 'language' ? 'language' :
                       type === 'model' ? 'model' : 'name'
  
  const dimensions = new Set<string>()
  const metricKeys = new Set<string>()
  
  for (const item of breakdown) {
    if (item[dimensionKey]) {
      dimensions.add(String(item[dimensionKey]))
    }
    // Collect all numeric keys as potential metrics
    for (const key of Object.keys(item)) {
      if (typeof item[key] === 'number' && key !== dimensionKey) {
        metricKeys.add(key)
      }
    }
  }
  
  // Create a single breakdown metric entry
  const typeName = type ? formatMetricName(type) : 'Breakdown'
  metrics.push({
    id: `breakdown_${type}`,
    name: `${typeName} Breakdown`,
    category: 'breakdowns',
    description: `Usage breakdown by ${typeName.toLowerCase()}`,
    icon: 'PieChart',
    dataPath: pathPrefix,
    isBreakdown: true,
    breakdownType: type
  })
  
  return metrics
}

/**
 * Format metric key to human-readable name
 */
function formatMetricName(key: string): string {
  return key
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Main function to extract all metrics from a 30-day report JSON
 */
export function extractMetricsFromReport(reportData: Record<string, unknown>): ExtractedMetric[] {
  const metrics: ExtractedMetric[] = []
  const seenIds = new Set<string>()
  
  const dayTotals = reportData.day_totals as Array<Record<string, unknown>>
  if (!Array.isArray(dayTotals) || dayTotals.length === 0) {
    console.warn('No day_totals found in report data')
    return getDefaultMetrics()
  }
  
  // Use first day as template for metrics structure
  const sampleDay = dayTotals[0]
  
  // Extract main day_totals metrics
  const dayMetrics = extractDayTotalMetrics(sampleDay)
  for (const metric of dayMetrics) {
    if (!seenIds.has(metric.id)) {
      seenIds.add(metric.id)
      metrics.push(metric)
    }
  }
  
  // Extract pull request metrics
  if (sampleDay.pull_requests && typeof sampleDay.pull_requests === 'object') {
    const prMetrics = extractPullRequestMetrics(sampleDay.pull_requests as Record<string, unknown>)
    for (const metric of prMetrics) {
      if (!seenIds.has(metric.id)) {
        seenIds.add(metric.id)
        metrics.push(metric)
      }
    }
  }
  
  // Extract breakdown metrics
  const breakdownTypes: Array<{key: string; type: ExtractedMetric['breakdownType']}> = [
    { key: 'totals_by_ide', type: 'ide' },
    { key: 'totals_by_feature', type: 'feature' },
    { key: 'totals_by_language_feature', type: 'language_feature' },
    { key: 'totals_by_language_model', type: 'language_model' },
    { key: 'totals_by_model_feature', type: 'model_feature' },
  ]
  
  for (const { key, type } of breakdownTypes) {
    if (Array.isArray(sampleDay[key])) {
      const breakdownMetrics = extractBreakdownMetrics(
        sampleDay[key] as Array<Record<string, unknown>>,
        type,
        `day_totals[].${key}`
      )
      for (const metric of breakdownMetrics) {
        if (!seenIds.has(metric.id)) {
          seenIds.add(metric.id)
          metrics.push(metric)
        }
      }
    }
  }
  
  return metrics
}

/**
 * Get default metrics if no data is provided
 * These match the known GitHub Copilot 30-day report structure
 */
export function getDefaultMetrics(): ExtractedMetric[] {
  return [
    // User Activity
    { id: 'daily_active_users', name: 'Daily Active Users', category: 'user_activity', description: 'Users active today', icon: 'Users', dataPath: 'day_totals[].daily_active_users' },
    { id: 'weekly_active_users', name: 'Weekly Active Users', category: 'user_activity', description: 'Users active this week', icon: 'Users', dataPath: 'day_totals[].weekly_active_users' },
    { id: 'monthly_active_users', name: 'Monthly Active Users', category: 'user_activity', description: 'Users active this month', icon: 'Users', dataPath: 'day_totals[].monthly_active_users' },
    { id: 'monthly_active_chat_users', name: 'Monthly Chat Users', category: 'user_activity', description: 'Users who used chat this month', icon: 'MessageSquare', dataPath: 'day_totals[].monthly_active_chat_users' },
    { id: 'monthly_active_agent_users', name: 'Monthly Agent Users', category: 'user_activity', description: 'Users who used agent mode this month', icon: 'Bot', dataPath: 'day_totals[].monthly_active_agent_users' },
    
    // Interactions
    { id: 'user_initiated_interaction_count', name: 'User Interactions', category: 'interactions', description: 'Total user-initiated interactions', icon: 'MousePointer', dataPath: 'day_totals[].user_initiated_interaction_count' },
    { id: 'code_generation_activity_count', name: 'Code Generation Activities', category: 'code_completions', description: 'Total code generation events', icon: 'Code', dataPath: 'day_totals[].code_generation_activity_count' },
    { id: 'code_acceptance_activity_count', name: 'Code Acceptance Activities', category: 'code_completions', description: 'Total code acceptance events', icon: 'CheckCircle', dataPath: 'day_totals[].code_acceptance_activity_count' },
    
    // Lines of Code
    { id: 'loc_suggested_to_add_sum', name: 'Lines Suggested (Add)', category: 'lines_of_code', description: 'Lines of code suggested to add', icon: 'Plus', dataPath: 'day_totals[].loc_suggested_to_add_sum' },
    { id: 'loc_suggested_to_delete_sum', name: 'Lines Suggested (Delete)', category: 'lines_of_code', description: 'Lines of code suggested to delete', icon: 'Minus', dataPath: 'day_totals[].loc_suggested_to_delete_sum' },
    { id: 'loc_added_sum', name: 'Lines Added', category: 'lines_of_code', description: 'Lines of code actually added', icon: 'FileCode', dataPath: 'day_totals[].loc_added_sum' },
    { id: 'loc_deleted_sum', name: 'Lines Deleted', category: 'lines_of_code', description: 'Lines of code actually deleted', icon: 'FileX', dataPath: 'day_totals[].loc_deleted_sum' },
    
    // Pull Requests
    { id: 'pr_total_reviewed', name: 'PRs Reviewed', category: 'pull_requests', description: 'Total pull requests reviewed', icon: 'Eye', dataPath: 'day_totals[].pull_requests.total_reviewed' },
    { id: 'pr_total_created', name: 'PRs Created', category: 'pull_requests', description: 'Total pull requests created', icon: 'GitPullRequest', dataPath: 'day_totals[].pull_requests.total_created' },
    { id: 'pr_total_created_by_copilot', name: 'PRs Created by Copilot', category: 'pull_requests', description: 'PRs created with Copilot assistance', icon: 'Sparkles', dataPath: 'day_totals[].pull_requests.total_created_by_copilot' },
    { id: 'pr_total_reviewed_by_copilot', name: 'PRs Reviewed by Copilot', category: 'pull_requests', description: 'PRs reviewed with Copilot assistance', icon: 'Search', dataPath: 'day_totals[].pull_requests.total_reviewed_by_copilot' },
    
    // Breakdowns
    { id: 'breakdown_ide', name: 'IDE Breakdown', category: 'breakdowns', description: 'Usage breakdown by IDE', icon: 'PieChart', dataPath: 'day_totals[].totals_by_ide', isBreakdown: true, breakdownType: 'ide' },
    { id: 'breakdown_feature', name: 'Feature Breakdown', category: 'breakdowns', description: 'Usage breakdown by feature', icon: 'PieChart', dataPath: 'day_totals[].totals_by_feature', isBreakdown: true, breakdownType: 'feature' },
    { id: 'breakdown_language_feature', name: 'Language & Feature Breakdown', category: 'breakdowns', description: 'Usage breakdown by language and feature', icon: 'PieChart', dataPath: 'day_totals[].totals_by_language_feature', isBreakdown: true, breakdownType: 'language_feature' },
    { id: 'breakdown_language_model', name: 'Language & Model Breakdown', category: 'breakdowns', description: 'Usage breakdown by language and model', icon: 'PieChart', dataPath: 'day_totals[].totals_by_language_model', isBreakdown: true, breakdownType: 'language_model' },
    { id: 'breakdown_model_feature', name: 'Model & Feature Breakdown', category: 'breakdowns', description: 'Usage breakdown by model and feature', icon: 'PieChart', dataPath: 'day_totals[].totals_by_model_feature', isBreakdown: true, breakdownType: 'model_feature' },
  ]
}

/**
 * Get report metadata
 */
export interface ReportMetadata {
  reportStartDay: string
  reportEndDay: string
  enterpriseId?: string
  organizationId?: string
  createdAt?: string
  totalDays: number
}

export function extractReportMetadata(reportData: Record<string, unknown>): ReportMetadata {
  const dayTotals = reportData.day_totals as Array<unknown> || []
  
  return {
    reportStartDay: String(reportData.report_start_day || ''),
    reportEndDay: String(reportData.report_end_day || ''),
    enterpriseId: reportData.enterprise_id ? String(reportData.enterprise_id) : undefined,
    organizationId: reportData.organization_id ? String(reportData.organization_id) : undefined,
    createdAt: reportData.created_at ? String(reportData.created_at) : undefined,
    totalDays: dayTotals.length
  }
}
