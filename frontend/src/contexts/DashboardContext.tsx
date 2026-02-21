import { createContext, useContext, useState, useEffect, useMemo, useCallback, ReactNode } from 'react'

// Define available metrics for Enterprise level
export const enterpriseMetrics = [
  // Code Completions
  { id: 'total_active_users', name: 'Total Active Users', category: 'overview', description: 'Users who have been active in Copilot', icon: 'Users' },
  { id: 'total_engaged_users', name: 'Total Engaged Users', category: 'overview', description: 'Users who have engaged with Copilot features', icon: 'UserCheck' },
  { id: 'completion_engaged_users', name: 'Code Completion Users', category: 'code_completions', description: 'Users who have used code completions', icon: 'Code' },
  { id: 'total_code_suggestions', name: 'Code Suggestions', category: 'code_completions', description: 'Total code suggestions generated', icon: 'Lightbulb' },
  { id: 'total_code_acceptances', name: 'Code Acceptances', category: 'code_completions', description: 'Total code suggestions accepted', icon: 'CheckCircle' },
  { id: 'acceptance_rate', name: 'Acceptance Rate', category: 'code_completions', description: 'Percentage of suggestions accepted', icon: 'Percent' },
  { id: 'total_lines_suggested', name: 'Lines Suggested', category: 'code_completions', description: 'Total lines of code suggested', icon: 'FileCode' },
  { id: 'total_lines_accepted', name: 'Lines Accepted', category: 'code_completions', description: 'Total lines of code accepted', icon: 'FileCheck' },
  
  // IDE Chat
  { id: 'ide_chat_engaged_users', name: 'IDE Chat Users', category: 'ide_chat', description: 'Users who have used IDE chat', icon: 'MessageSquare' },
  { id: 'total_chats', name: 'Total Chats', category: 'ide_chat', description: 'Total chat conversations', icon: 'MessageCircle' },
  { id: 'chat_copy_events', name: 'Chat Copy Events', category: 'ide_chat', description: 'Code copied from chat', icon: 'Copy' },
  { id: 'chat_insertion_events', name: 'Chat Insertions', category: 'ide_chat', description: 'Code inserted from chat', icon: 'Plus' },
  
  // Dotcom Chat
  { id: 'dotcom_chat_users', name: 'Dotcom Chat Users', category: 'dotcom_chat', description: 'Users using GitHub.com chat', icon: 'Globe' },
  
  // Pull Requests
  { id: 'pr_engaged_users', name: 'PR Engaged Users', category: 'pull_requests', description: 'Users using Copilot for PRs', icon: 'GitPullRequest' },
  
  // Language & Editor Breakdowns
  { id: 'language_breakdown', name: 'Language Breakdown', category: 'breakdowns', description: 'Usage by programming language', icon: 'Code2' },
  { id: 'editor_breakdown', name: 'Editor Breakdown', category: 'breakdowns', description: 'Usage by IDE/editor', icon: 'Monitor' },
  
  // Trends
  { id: 'daily_active_trend', name: 'Daily Active Trend', category: 'trends', description: 'Daily active users over time', icon: 'TrendingUp' },
  { id: 'acceptance_trend', name: 'Acceptance Trend', category: 'trends', description: 'Acceptance rate over time', icon: 'LineChart' },
  { id: 'suggestions_trend', name: 'Suggestions Trend', category: 'trends', description: 'Suggestions over time', icon: 'BarChart' },
]

// Define available metrics for Organization level
export const organizationMetrics = [
  // Code Completions
  { id: 'total_active_users', name: 'Total Active Users', category: 'overview', description: 'Users who have been active in Copilot', icon: 'Users' },
  { id: 'total_engaged_users', name: 'Total Engaged Users', category: 'overview', description: 'Users who have engaged with Copilot features', icon: 'UserCheck' },
  { id: 'completion_engaged_users', name: 'Code Completion Users', category: 'code_completions', description: 'Users who have used code completions', icon: 'Code' },
  { id: 'total_code_suggestions', name: 'Code Suggestions', category: 'code_completions', description: 'Total code suggestions generated', icon: 'Lightbulb' },
  { id: 'total_code_acceptances', name: 'Code Acceptances', category: 'code_completions', description: 'Total code suggestions accepted', icon: 'CheckCircle' },
  { id: 'acceptance_rate', name: 'Acceptance Rate', category: 'code_completions', description: 'Percentage of suggestions accepted', icon: 'Percent' },
  { id: 'total_lines_suggested', name: 'Lines Suggested', category: 'code_completions', description: 'Total lines of code suggested', icon: 'FileCode' },
  { id: 'total_lines_accepted', name: 'Lines Accepted', category: 'code_completions', description: 'Total lines of code accepted', icon: 'FileCheck' },
  
  // IDE Chat
  { id: 'ide_chat_engaged_users', name: 'IDE Chat Users', category: 'ide_chat', description: 'Users who have used IDE chat', icon: 'MessageSquare' },
  { id: 'total_chats', name: 'Total Chats', category: 'ide_chat', description: 'Total chat conversations', icon: 'MessageCircle' },
  
  // Trends
  { id: 'daily_active_trend', name: 'Daily Active Trend', category: 'trends', description: 'Daily active users over time', icon: 'TrendingUp' },
  { id: 'acceptance_trend', name: 'Acceptance Trend', category: 'trends', description: 'Acceptance rate over time', icon: 'LineChart' },
  
  // Language & Editor Breakdowns
  { id: 'language_breakdown', name: 'Language Breakdown', category: 'breakdowns', description: 'Usage by programming language', icon: 'Code2' },
  { id: 'editor_breakdown', name: 'Editor Breakdown', category: 'breakdowns', description: 'Usage by IDE/editor', icon: 'Monitor' },
]

// Category definitions
export const metricCategories = [
  { id: 'overview', name: 'Overview', description: 'General user activity metrics' },
  { id: 'code_completions', name: 'Code Completions', description: 'AI-powered code suggestions' },
  { id: 'ide_chat', name: 'IDE Chat', description: 'Chat interactions within IDEs' },
  { id: 'dotcom_chat', name: 'GitHub.com Chat', description: 'Chat on GitHub.com' },
  { id: 'pull_requests', name: 'Pull Requests', description: 'PR-related Copilot usage' },
  { id: 'breakdowns', name: 'Breakdowns', description: 'Usage by language and editor' },
  { id: 'trends', name: 'Trends', description: 'Historical data visualizations' },
]

export type DashboardLevel = 'enterprise' | 'organization' | null

export interface DashboardConfig {
  level: DashboardLevel
  selectedMetrics: string[]
  useDemo: boolean
  createdAt: string
  name: string
}

interface DashboardContextType {
  config: DashboardConfig | null
  setLevel: (level: DashboardLevel) => void
  setSelectedMetrics: (metrics: string[]) => void
  toggleMetric: (metricId: string) => void
  setUseDemo: (useDemo: boolean) => void
  setDashboardName: (name: string) => void
  saveDashboard: () => void
  resetDashboard: () => void
  isConfigured: boolean
  isLoading: boolean
  availableMetrics: typeof enterpriseMetrics | typeof organizationMetrics
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

const STORAGE_KEY = 'copilot_dashboard_config'

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<DashboardConfig | null>(null)
  const [isConfigured, setIsConfigured] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Load config from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setConfig(parsed)
        setIsConfigured(parsed.level && parsed.selectedMetrics?.length > 0)
      } catch (error) {
        console.error('Failed to load dashboard config:', error)
      }
    }
    setIsLoading(false)
  }, [])

  const setLevel = useCallback((level: DashboardLevel) => {
    setConfig(prev => ({
      level,
      selectedMetrics: prev?.selectedMetrics || [],
      useDemo: prev?.useDemo ?? true,
      createdAt: prev?.createdAt || new Date().toISOString(),
      name: prev?.name || 'My Dashboard'
    }))
  }, [])

  const setSelectedMetrics = useCallback((metrics: string[]) => {
    setConfig(prev => prev ? { ...prev, selectedMetrics: metrics } : null)
  }, [])

  const toggleMetric = useCallback((metricId: string) => {
    setConfig(prev => {
      if (!prev) return null
      const metrics = prev.selectedMetrics.includes(metricId)
        ? prev.selectedMetrics.filter(id => id !== metricId)
        : [...prev.selectedMetrics, metricId]
      return { ...prev, selectedMetrics: metrics }
    })
  }, [])

  const setUseDemo = useCallback((useDemo: boolean) => {
    setConfig(prev => prev ? { ...prev, useDemo } : null)
  }, [])

  const setDashboardName = useCallback((name: string) => {
    setConfig(prev => prev ? { ...prev, name } : null)
  }, [])

  const saveDashboard = useCallback(() => {
    if (config) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
      setIsConfigured(config.level !== null && config.selectedMetrics.length > 0)
    }
  }, [config])

  const resetDashboard = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setConfig(null)
    setIsConfigured(false)
  }, [])

  const availableMetrics = useMemo(() => 
    config?.level === 'enterprise' ? enterpriseMetrics : organizationMetrics
  , [config?.level])

  const contextValue = useMemo(() => ({
    config,
    setLevel,
    setSelectedMetrics,
    toggleMetric,
    setUseDemo,
    setDashboardName,
    saveDashboard,
    resetDashboard,
    isConfigured,
    isLoading,
    availableMetrics
  }), [config, setLevel, setSelectedMetrics, toggleMetric, setUseDemo, setDashboardName, saveDashboard, resetDashboard, isConfigured, isLoading, availableMetrics])

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  )
}

export const useDashboard = () => {
  const context = useContext(DashboardContext)
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider')
  }
  return context
}
