// Types for GitHub Copilot Metrics API responses

// Real GitHub API response types
export interface LanguageMetric {
  name: string
  total_engaged_users: number
  total_code_suggestions?: number
  total_code_acceptances?: number
  total_code_lines_suggested?: number
  total_code_lines_accepted?: number
}

export interface ModelMetric {
  name: string
  is_custom_model: boolean
  custom_model_training_date: string | null
  total_engaged_users: number
  languages?: LanguageMetric[]
  total_chats?: number
  total_chat_insertion_events?: number
  total_chat_copy_events?: number
}

export interface EditorMetric {
  name: string
  total_engaged_users: number
  models?: ModelMetric[]
}

export interface CopilotIDECodeCompletions {
  total_engaged_users: number
  languages: LanguageMetric[]
  editors: EditorMetric[]
}

export interface CopilotIDEChat {
  total_engaged_users: number
  editors: EditorMetric[]
}

export interface CopilotDotcomChat {
  total_engaged_users: number
  models: ModelMetric[]
}

export interface CopilotDotcomPullRequests {
  total_engaged_users: number
  repositories: Array<{
    name: string
    total_engaged_users: number
    models: ModelMetric[]
  }>
}

export interface DailyMetrics {
  date: string
  total_active_users: number
  total_engaged_users: number
  copilot_ide_code_completions?: CopilotIDECodeCompletions
  copilot_ide_chat?: CopilotIDEChat
  copilot_dotcom_chat?: CopilotDotcomChat
  copilot_dotcom_pull_requests?: CopilotDotcomPullRequests
}

export type GitHubCopilotMetricsResponse = DailyMetrics[]

// Copilot Agents API types
export interface AgentMetric {
  slug: string
  name: string
  description: string
  created_at: string
  updated_at: string
  publisher: {
    type: string
    name: string
    url?: string
  }
  installation_count?: number
  total_engaged_users?: number
  total_chats?: number
  total_chat_insertion_events?: number
  total_chat_copy_events?: number
}

export interface AgentDailyMetrics {
  date: string
  total_engaged_users: number
  agents: AgentMetric[]
}

export type GitHubCopilotAgentsResponse = AgentDailyMetrics[]

// Legacy types for backward compatibility with demo data
export interface TeamMetrics {
  date: string
  total_suggestions_count: number
  total_acceptances_count: number
  total_lines_suggested: number
  total_lines_accepted: number
  total_active_users: number
  total_chat_acceptances: number
  total_chat_turns: number
  total_active_chat_users: number
  total_pr_summaries_created?: number
  total_pr_engaged_users?: number
}

export interface EditorMetrics {
  name: string
  total_engaged_users: number
}

export interface LanguageMetrics {
  name: string
  total_engaged_users: number
}

export interface CopilotMetricsResponse {
  data: TeamMetrics[]
  editors?: EditorMetrics[]
  languages?: LanguageMetrics[]
}

export interface ChartData {
  id: string
  label: string
  value: number
  color?: string
}

export interface TimeSeriesData {
  x: string
  y: number
}

export interface LineChartData {
  id: string
  data: TimeSeriesData[]
}

export interface APIConfig {
  org: string
  token: string
  since?: string
  until?: string
  team_slug?: string
}

export interface DownloadResult {
  success: boolean
  message: string
  recordCount?: number
  dateRange?: {
    from: string
    to: string
  }
  error?: string
}
