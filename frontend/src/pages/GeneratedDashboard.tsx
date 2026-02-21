import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Settings, 
  Users,
  UserCheck,
  Code,
  Lightbulb,
  CheckCircle,
  Percent,
  FileCode,
  FileCheck,
  MessageSquare,
  MessageCircle,
  Copy,
  Plus,
  Globe,
  GitPullRequest,
  Code2,
  Monitor,
  TrendingUp,
  LineChart as LineChartIcon,
  BarChart as BarChartIcon,
  Building2,
  Building,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Bot,
  MousePointer,
  Minus,
  FileX,
  Search,
  PieChart as PieChartIcon,
  Activity,
  Eye,
  Sparkles,
  Terminal,
  Target,
  Zap,
  Calendar,
  LayoutGrid
} from 'lucide-react'
import { ResponsiveLine } from '@nivo/line'
import { ResponsiveBar } from '@nivo/bar'
import { ResponsivePie } from '@nivo/pie'
import { demoEnterpriseMetrics } from '../data/demoEnterpriseData'
import { getDefaultMetrics, ExtractedMetric } from '../utils/metricExtractor'

// Icon mapping
const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  Users,
  UserCheck,
  Code,
  Lightbulb,
  CheckCircle,
  Percent,
  FileCode,
  FileCheck,
  MessageSquare,
  MessageCircle,
  Copy,
  Plus,
  Globe,
  GitPullRequest,
  Code2,
  Monitor,
  TrendingUp,
  LineChart: LineChartIcon,
  BarChart: BarChartIcon,
  Bot,
  MousePointer,
  Minus,
  FileX,
  Search,
  PieChart: PieChartIcon,
  Activity,
  Eye,
  Sparkles,
  Terminal,
}

// Get available metrics from shared source - ensures consistency with DashboardSetup
const availableMetrics: ExtractedMetric[] = getDefaultMetrics()

// Helper to extract aggregated values from nested data structure
// Supports both standard daily metrics AND 28-day report format
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractMetricFromData(data: Record<string, any>, metricId: string): number {
  if (!data) return 0

  // === 28-day report format fields ===
  // Direct mappings for 28-day report structure
  if (metricId === 'total_active_users' || metricId === 'daily_active_users') {
    return data.daily_active_users || data.total_active_users || 0
  }
  if (metricId === 'total_engaged_users') {
    return data.total_engaged_users || data.monthly_active_users || 0
  }
  if (metricId === 'weekly_active_users') {
    return data.weekly_active_users || 0
  }
  if (metricId === 'monthly_active_users') {
    return data.monthly_active_users || 0
  }
  if (metricId === 'monthly_active_chat_users') {
    return data.monthly_active_chat_users || 0
  }
  if (metricId === 'monthly_active_agent_users') {
    return data.monthly_active_agent_users || 0
  }
  
  // Interaction counts from 28-day report
  if (metricId === 'user_initiated_interaction_count') {
    return data.user_initiated_interaction_count || 0
  }
  if (metricId === 'code_generation_activity_count') {
    return data.code_generation_activity_count || 0
  }
  if (metricId === 'code_acceptance_activity_count') {
    return data.code_acceptance_activity_count || 0
  }
  
  // Lines of code from 28-day report (aggregate from totals_by_ide or totals_by_feature)
  if (['loc_suggested_to_add_sum', 'loc_suggested_to_delete_sum', 'loc_added_sum', 'loc_deleted_sum'].includes(metricId)) {
    // First try totals_by_ide aggregation
    if (data.totals_by_ide && Array.isArray(data.totals_by_ide)) {
      return data.totals_by_ide.reduce((sum: number, ide: any) => sum + (ide[metricId] || 0), 0)
    }
    // Then try totals_by_feature
    if (data.totals_by_feature && Array.isArray(data.totals_by_feature)) {
      return data.totals_by_feature.reduce((sum: number, feat: any) => sum + (feat[metricId] || 0), 0)
    }
    return 0
  }
  
  // === Standard daily metrics format fields ===
  // Code completion metrics from nested structure
  if (metricId === 'completion_engaged_users') {
    return data.copilot_ide_code_completions?.total_engaged_users || 0
  }
  
  // Aggregate code suggestions/acceptances from all editors -> models -> languages
  if (['total_code_suggestions', 'total_code_acceptances', 'total_lines_suggested', 'total_lines_accepted'].includes(metricId)) {
    // First check for 28-day report format
    if (data.code_generation_activity_count !== undefined) {
      if (metricId === 'total_code_suggestions') return data.code_generation_activity_count || 0
      if (metricId === 'total_code_acceptances') return data.code_acceptance_activity_count || 0
      if (metricId === 'total_lines_suggested') {
        return (data.totals_by_ide || []).reduce((sum: number, ide: any) => sum + (ide.loc_suggested_to_add_sum || 0), 0)
      }
      if (metricId === 'total_lines_accepted') {
        return (data.totals_by_ide || []).reduce((sum: number, ide: any) => sum + (ide.loc_added_sum || 0), 0)
      }
    }
    
    // Standard format with nested editors/models/languages
    const completions = data.copilot_ide_code_completions
    if (!completions?.editors) return 0
    
    let total = 0
    const keyMap: Record<string, string> = {
      'total_code_suggestions': 'total_code_suggestions',
      'total_code_acceptances': 'total_code_acceptances',
      'total_lines_suggested': 'total_code_lines_suggested',
      'total_lines_accepted': 'total_code_lines_accepted'
    }
    const dataKey = keyMap[metricId]
    
    for (const editor of completions.editors) {
      if (editor.models) {
        for (const model of editor.models) {
          if (model.languages) {
            for (const lang of model.languages) {
              total += lang[dataKey] || 0
            }
          }
        }
      }
    }
    return total
  }
  
  // Acceptance rate calculated
  if (metricId === 'acceptance_rate') {
    const suggestions = extractMetricFromData(data, 'total_code_suggestions')
    const acceptances = extractMetricFromData(data, 'total_code_acceptances')
    return suggestions > 0 ? (acceptances / suggestions) * 100 : 0
  }
  
  // IDE Chat metrics
  if (metricId === 'ide_chat_engaged_users') {
    return data.copilot_ide_chat?.total_engaged_users || data.monthly_active_chat_users || 0
  }
  
  if (['total_chats', 'chat_insertion_events', 'chat_copy_events'].includes(metricId)) {
    const chat = data.copilot_ide_chat
    if (!chat?.editors) return 0
    
    let total = 0
    const keyMap: Record<string, string> = {
      'total_chats': 'total_chats',
      'chat_insertion_events': 'total_chat_insertion_events',
      'chat_copy_events': 'total_chat_copy_events'
    }
    const dataKey = keyMap[metricId]
    
    for (const editor of chat.editors) {
      if (editor.models) {
        for (const model of editor.models) {
          total += model[dataKey] || 0
        }
      }
    }
    return total
  }
  
  // Dotcom metrics
  if (metricId === 'dotcom_chat_users') {
    return data.copilot_dotcom_chat?.total_engaged_users || 0
  }
  
  if (metricId === 'pr_engaged_users') {
    return data.copilot_dotcom_pull_requests?.total_engaged_users || 0
  }
  
  // PR metrics from 28-day report
  if (metricId.startsWith('pr_')) {
    const prData = data.pull_requests
    if (!prData) return 0
    
    const keyMap: Record<string, string> = {
      'pr_total_reviewed': 'total_reviewed',
      'pr_total_created': 'total_created',
      'pr_total_created_by_copilot': 'total_created_by_copilot',
      'pr_total_reviewed_by_copilot': 'total_reviewed_by_copilot'
    }
    return prData[keyMap[metricId]] || 0
  }
  
  // For breakdown metrics, return 0 (they need chart rendering, not scalar values)
  if (metricId.startsWith('breakdown_')) {
    return 0
  }
  
  return 0
}

interface DashboardConfig {
  name: string
  level: 'enterprise' | 'organization'
  selectedMetrics: string[]
  useDemo: boolean
}

const GeneratedDashboard = () => {
  const navigate = useNavigate()
  
  // Simple state
  const [config, setConfig] = useState<DashboardConfig | null>(null)
  const [metricsData, setMetricsData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load everything once on mount - no dependencies to avoid loops
  useEffect(() => {
    console.log('🔄 GeneratedDashboard: Initial load effect running')
    
    const loadDashboard = () => {
      try {
        // Load config from localStorage
        const savedConfig = localStorage.getItem('copilot_dashboard_config')
        if (!savedConfig) {
          console.log('❌ No config found, redirecting to setup')
          navigate('/setup')
          return
        }

        const dashboardConfig: DashboardConfig = JSON.parse(savedConfig)
        console.log('✅ Loaded config:', dashboardConfig)
        
        // Validate config
        if (!dashboardConfig.level || !dashboardConfig.selectedMetrics || dashboardConfig.selectedMetrics.length === 0) {
          console.log('❌ Invalid config, redirecting to setup')
          navigate('/setup')
          return
        }

        setConfig(dashboardConfig)

        // Load data based on useDemo setting
        if (dashboardConfig.useDemo) {
          console.log('📊 Using demo data')
          setMetricsData(demoEnterpriseMetrics)
        } else {
          // Load from localStorage - try multiple storage keys
          const storageKeys = dashboardConfig.level === 'enterprise' 
            ? ['copilot_enterprise_metrics_data', 'enterprise_report_data'] 
            : ['copilot_org_metrics_data', 'org_report_data']
          
          let parsedData = null
          for (const key of storageKeys) {
            const cachedData = localStorage.getItem(key)
            if (cachedData) {
              console.log(`✅ Found data in localStorage key: ${key}`)
              try {
                const jsonData = JSON.parse(cachedData)
                // Handle both wrapped (day_totals) and direct array formats
                if (jsonData.day_totals && Array.isArray(jsonData.day_totals)) {
                  console.log('📊 Data format: day_totals wrapper')
                  parsedData = jsonData.day_totals
                } else if (Array.isArray(jsonData)) {
                  console.log('📊 Data format: direct array')
                  parsedData = jsonData
                } else if (jsonData.data && Array.isArray(jsonData.data)) {
                  console.log('📊 Data format: data wrapper')
                  parsedData = jsonData.data
                } else {
                  console.log('📊 Data format: unknown, using as-is')
                  parsedData = jsonData
                }
                break
              } catch (e) {
                console.error(`❌ Failed to parse data from ${key}:`, e)
              }
            }
          }
          
          if (parsedData) {
            console.log('✅ Loaded cached live data, records:', Array.isArray(parsedData) ? parsedData.length : 'N/A')
            setMetricsData(parsedData)
          } else {
            console.log('❌ No cached data found in any storage key')
            setError('No data available. Please go to Admin page and download metrics data first.')
          }
        }

        setLoading(false)
      } catch (err) {
        console.error('❌ Error loading dashboard:', err)
        setError('Failed to load dashboard configuration')
        setLoading(false)
      }
    }

    loadDashboard()
  }, [navigate]) // Only navigate as dependency

  // Helper to format numbers
  const formatValue = (value: number, format?: string): string => {
    if (format === 'percent') {
      return `${value.toFixed(1)}%`
    }
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`
    }
    return value.toString()
  }

  // Get metric value from data using the extraction helper
  const getMetricValue = (metricId: string): number => {
    if (!metricsData || !Array.isArray(metricsData)) return 0
    
    // Get the latest data point (first in array)
    const latestData = metricsData[0]
    if (!latestData) return 0

    return extractMetricFromData(latestData, metricId)
  }

  // Get previous metric value for comparison
  const getPreviousMetricValue = (metricId: string): number => {
    if (!metricsData || !Array.isArray(metricsData) || metricsData.length < 2) return 0
    
    const previousData = metricsData[1]
    if (!previousData) return 0

    return extractMetricFromData(previousData, metricId)
  }

  // Chart data transformations
  const userActivityTrendData = useMemo(() => {
    if (!metricsData || !Array.isArray(metricsData)) return []
    
    // Reverse to show oldest to newest, take last 14 days
    const sortedData = [...metricsData].reverse().slice(-14)
    
    return [{
      id: 'Daily Active Users',
      color: 'hsl(210, 70%, 50%)',
      data: sortedData.map((day: any) => ({
        x: (day.date || day.day || '').slice(-5), // Show MM-DD
        y: day.daily_active_users || day.total_active_users || 0
      }))
    }, {
      id: 'Monthly Active Users',
      color: 'hsl(150, 70%, 50%)',
      data: sortedData.map((day: any) => ({
        x: (day.date || day.day || '').slice(-5),
        y: day.monthly_active_users || day.total_engaged_users || 0
      }))
    }]
  }, [metricsData])

  const codeActivityTrendData = useMemo(() => {
    if (!metricsData || !Array.isArray(metricsData)) return []
    
    const sortedData = [...metricsData].reverse().slice(-14)
    
    return [{
      id: 'Code Generated',
      color: 'hsl(45, 70%, 50%)',
      data: sortedData.map((day: any) => ({
        x: (day.date || day.day || '').slice(-5),
        y: day.code_generation_activity_count || extractMetricFromData(day, 'total_code_suggestions') || 0
      }))
    }, {
      id: 'Code Accepted',
      color: 'hsl(120, 70%, 50%)',
      data: sortedData.map((day: any) => ({
        x: (day.date || day.day || '').slice(-5),
        y: day.code_acceptance_activity_count || extractMetricFromData(day, 'total_code_acceptances') || 0
      }))
    }]
  }, [metricsData])

  const ideBreakdownData = useMemo(() => {
    if (!metricsData || !Array.isArray(metricsData) || metricsData.length === 0) return []
    
    const latestDay = metricsData[0]
    
    // Try totals_by_ide first (28-day format)
    if (latestDay.totals_by_ide && Array.isArray(latestDay.totals_by_ide)) {
      return latestDay.totals_by_ide.map((ide: any) => ({
        id: ide.ide?.toUpperCase() || 'Unknown',
        label: ide.ide?.toUpperCase() || 'Unknown',
        value: ide.code_generation_activity_count || ide.user_initiated_interaction_count || 0,
        color: ide.ide === 'vscode' ? 'hsl(210, 70%, 50%)' : 
               ide.ide === 'jetbrains' ? 'hsl(340, 70%, 50%)' :
               ide.ide === 'vim' ? 'hsl(120, 70%, 50%)' : 'hsl(45, 70%, 50%)'
      }))
    }
    
    // Try editors from copilot_ide_code_completions (daily format)
    const completions = latestDay.copilot_ide_code_completions
    if (completions?.editors) {
      return completions.editors.map((editor: any) => ({
        id: editor.name?.toUpperCase() || 'Unknown',
        label: editor.name?.toUpperCase() || 'Unknown',
        value: editor.total_engaged_users || 0,
        color: editor.name === 'vscode' ? 'hsl(210, 70%, 50%)' : 
               editor.name === 'jetbrains' ? 'hsl(340, 70%, 50%)' :
               editor.name === 'vim' ? 'hsl(120, 70%, 50%)' : 'hsl(45, 70%, 50%)'
      }))
    }
    
    return []
  }, [metricsData])

  const featureBreakdownData = useMemo(() => {
    if (!metricsData || !Array.isArray(metricsData) || metricsData.length === 0) return []
    
    const latestDay = metricsData[0]
    
    // Try totals_by_feature (28-day format)
    if (latestDay.totals_by_feature && Array.isArray(latestDay.totals_by_feature)) {
      return latestDay.totals_by_feature.map((feat: any) => ({
        feature: feat.feature?.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || 'Unknown',
        'Code Generated': feat.code_generation_activity_count || 0,
        'Code Accepted': feat.code_acceptance_activity_count || 0
      }))
    }
    
    // Fallback: extract from completions and chat
    const data = []
    const completions = latestDay.copilot_ide_code_completions
    if (completions) {
      data.push({
        feature: 'Code Completion',
        'Code Generated': extractMetricFromData(latestDay, 'total_code_suggestions'),
        'Code Accepted': extractMetricFromData(latestDay, 'total_code_acceptances')
      })
    }
    const chat = latestDay.copilot_ide_chat
    if (chat) {
      data.push({
        feature: 'IDE Chat',
        'Code Generated': extractMetricFromData(latestDay, 'total_chats'),
        'Code Accepted': extractMetricFromData(latestDay, 'chat_insertion_events')
      })
    }
    return data
  }, [metricsData])

  // Summary statistics
  const summaryStats = useMemo(() => {
    if (!metricsData || !Array.isArray(metricsData) || metricsData.length === 0) {
      return { totalUsers: 0, totalGenerated: 0, totalAccepted: 0, acceptanceRate: 0, avgDaily: 0, trend: 0 }
    }
    
    const latestDay = metricsData[0]
    const totalUsers = latestDay.monthly_active_users || latestDay.total_engaged_users || extractMetricFromData(latestDay, 'monthly_active_users')
    const totalGenerated = latestDay.code_generation_activity_count || extractMetricFromData(latestDay, 'total_code_suggestions')
    const totalAccepted = latestDay.code_acceptance_activity_count || extractMetricFromData(latestDay, 'total_code_acceptances')
    const acceptanceRate = totalGenerated > 0 ? (totalAccepted / totalGenerated) * 100 : 0
    
    // Calculate average daily users over last 7 days
    const last7Days = metricsData.slice(0, 7)
    const avgDaily = last7Days.reduce((sum: number, day: any) => 
      sum + (day.daily_active_users || day.total_active_users || 0), 0) / last7Days.length
    
    // Calculate trend (compare last 7 days avg to previous 7 days)
    let trend = 0
    if (metricsData.length >= 14) {
      const prev7Days = metricsData.slice(7, 14)
      const prevAvg = prev7Days.reduce((sum: number, day: any) => 
        sum + (day.daily_active_users || day.total_active_users || 0), 0) / prev7Days.length
      trend = prevAvg > 0 ? ((avgDaily - prevAvg) / prevAvg) * 100 : 0
    }
    
    return { totalUsers, totalGenerated, totalAccepted, acceptanceRate, avgDaily: Math.round(avgDaily), trend }
  }, [metricsData])

  // Reset dashboard
  const handleReset = () => {
    localStorage.removeItem('copilot_dashboard_config')
    navigate('/setup')
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !config || !metricsData) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 max-w-md">
          <div className="flex items-start gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Error Loading Dashboard</h2>
              <p className="text-slate-300">{error || 'Configuration or data is missing'}</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/setup')}
            className="w-full mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Go to Setup
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {config.level === 'enterprise' ? (
                <Building2 className="w-8 h-8 text-blue-400" />
              ) : (
                <Building className="w-8 h-8 text-purple-400" />
              )}
              <div>
                <h1 className="text-2xl font-bold text-white">{config.name || 'Dashboard'}</h1>
                <p className="text-slate-400 capitalize">
                  {config.level} • {config.useDemo ? 'Demo Data' : 'Live Data'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4" />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-5 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-blue-200" />
              <span className="text-sm text-blue-200">Total Users</span>
            </div>
            <p className="text-3xl font-bold text-white">{formatValue(summaryStats.totalUsers)}</p>
            {summaryStats.trend !== 0 && (
              <p className={`text-sm mt-1 ${summaryStats.trend >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                {summaryStats.trend >= 0 ? '↑' : '↓'} {Math.abs(summaryStats.trend).toFixed(1)}% vs prev week
              </p>
            )}
          </div>
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-5 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-purple-200" />
              <span className="text-sm text-purple-200">Code Generated</span>
            </div>
            <p className="text-3xl font-bold text-white">{formatValue(summaryStats.totalGenerated)}</p>
            <p className="text-sm text-purple-200 mt-1">Total suggestions</p>
          </div>
          <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-5 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-200" />
              <span className="text-sm text-green-200">Code Accepted</span>
            </div>
            <p className="text-3xl font-bold text-white">{formatValue(summaryStats.totalAccepted)}</p>
            <p className="text-sm text-green-200 mt-1">Total acceptances</p>
          </div>
          <div className="bg-gradient-to-br from-amber-600 to-amber-800 rounded-xl p-5 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-amber-200" />
              <span className="text-sm text-amber-200">Acceptance Rate</span>
            </div>
            <p className="text-3xl font-bold text-white">{summaryStats.acceptanceRate.toFixed(1)}%</p>
            <p className="text-sm text-amber-200 mt-1">Avg daily: {summaryStats.avgDaily} users</p>
          </div>
        </div>

        {/* Trend Charts */}
        {(userActivityTrendData.length > 0 || codeActivityTrendData.length > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Activity Trend */}
            {userActivityTrendData.length > 0 && userActivityTrendData[0].data.length > 1 && (
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-blue-400" />
                  <h3 className="text-lg font-semibold text-white">User Activity Trend</h3>
                </div>
                <div className="h-64">
                  <ResponsiveLine
                    data={userActivityTrendData}
                    margin={{ top: 20, right: 110, bottom: 50, left: 60 }}
                    xScale={{ type: 'point' }}
                    yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false }}
                    curve="monotoneX"
                    axisBottom={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: -45,
                      legend: 'Date',
                      legendOffset: 40,
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
                    colors={{ scheme: 'category10' }}
                    pointSize={8}
                    pointColor={{ theme: 'background' }}
                    pointBorderWidth={2}
                    pointBorderColor={{ from: 'serieColor' }}
                    enableArea={true}
                    areaOpacity={0.1}
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
                        symbolBorderColor: 'rgba(0, 0, 0, .5)',
                        itemTextColor: '#94a3b8'
                      }
                    ]}
                    theme={{
                      axis: { ticks: { text: { fill: '#94a3b8' } }, legend: { text: { fill: '#94a3b8' } } },
                      grid: { line: { stroke: '#334155' } },
                      crosshair: { line: { stroke: '#60a5fa' } }
                    }}
                  />
                </div>
              </div>
            )}

            {/* Code Activity Trend */}
            {codeActivityTrendData.length > 0 && codeActivityTrendData[0].data.length > 1 && (
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center gap-2 mb-4">
                  <Code className="w-5 h-5 text-green-400" />
                  <h3 className="text-lg font-semibold text-white">Code Activity Trend</h3>
                </div>
                <div className="h-64">
                  <ResponsiveLine
                    data={codeActivityTrendData}
                    margin={{ top: 20, right: 110, bottom: 50, left: 60 }}
                    xScale={{ type: 'point' }}
                    yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false }}
                    curve="monotoneX"
                    axisBottom={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: -45,
                      legend: 'Date',
                      legendOffset: 40,
                      legendPosition: 'middle'
                    }}
                    axisLeft={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: 'Count',
                      legendOffset: -50,
                      legendPosition: 'middle'
                    }}
                    enableGridX={false}
                    colors={['#f59e0b', '#22c55e']}
                    pointSize={8}
                    pointColor={{ theme: 'background' }}
                    pointBorderWidth={2}
                    pointBorderColor={{ from: 'serieColor' }}
                    enableArea={true}
                    areaOpacity={0.1}
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
                        symbolBorderColor: 'rgba(0, 0, 0, .5)',
                        itemTextColor: '#94a3b8'
                      }
                    ]}
                    theme={{
                      axis: { ticks: { text: { fill: '#94a3b8' } }, legend: { text: { fill: '#94a3b8' } } },
                      grid: { line: { stroke: '#334155' } },
                      crosshair: { line: { stroke: '#22c55e' } }
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Distribution Charts */}
        {(ideBreakdownData.length > 0 || featureBreakdownData.length > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* IDE Distribution */}
            {ideBreakdownData.length > 0 && (
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center gap-2 mb-4">
                  <LayoutGrid className="w-5 h-5 text-purple-400" />
                  <h3 className="text-lg font-semibold text-white">IDE Distribution</h3>
                </div>
                <div className="h-64">
                  <ResponsivePie
                    data={ideBreakdownData}
                    margin={{ top: 20, right: 80, bottom: 20, left: 80 }}
                    innerRadius={0.5}
                    padAngle={2}
                    cornerRadius={4}
                    activeOuterRadiusOffset={8}
                    colors={{ scheme: 'set2' }}
                    borderWidth={1}
                    borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                    arcLinkLabelsSkipAngle={10}
                    arcLinkLabelsTextColor="#94a3b8"
                    arcLinkLabelsThickness={2}
                    arcLinkLabelsColor={{ from: 'color' }}
                    arcLabelsSkipAngle={10}
                    arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                    legends={[
                      {
                        anchor: 'bottom',
                        direction: 'row',
                        justify: false,
                        translateX: 0,
                        translateY: 20,
                        itemsSpacing: 10,
                        itemWidth: 60,
                        itemHeight: 18,
                        itemTextColor: '#94a3b8',
                        itemDirection: 'left-to-right',
                        itemOpacity: 1,
                        symbolSize: 12,
                        symbolShape: 'circle'
                      }
                    ]}
                  />
                </div>
              </div>
            )}

            {/* Feature Breakdown */}
            {featureBreakdownData.length > 0 && (
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center gap-2 mb-4">
                  <BarChartIcon className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-semibold text-white">Feature Breakdown</h3>
                </div>
                <div className="h-64">
                  <ResponsiveBar
                    data={featureBreakdownData}
                    keys={['Code Generated', 'Code Accepted']}
                    indexBy="feature"
                    margin={{ top: 20, right: 100, bottom: 50, left: 60 }}
                    padding={0.3}
                    groupMode="grouped"
                    colors={['#f59e0b', '#22c55e']}
                    borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: -20,
                      legend: 'Feature',
                      legendPosition: 'middle',
                      legendOffset: 40
                    }}
                    axisLeft={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: 'Count',
                      legendPosition: 'middle',
                      legendOffset: -50
                    }}
                    labelSkipWidth={12}
                    labelSkipHeight={12}
                    labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                    legends={[
                      {
                        dataFrom: 'keys',
                        anchor: 'bottom-right',
                        direction: 'column',
                        justify: false,
                        translateX: 100,
                        translateY: 0,
                        itemsSpacing: 2,
                        itemWidth: 80,
                        itemHeight: 20,
                        itemDirection: 'left-to-right',
                        itemOpacity: 0.85,
                        symbolSize: 12,
                        itemTextColor: '#94a3b8'
                      }
                    ]}
                    theme={{
                      axis: { ticks: { text: { fill: '#94a3b8' } }, legend: { text: { fill: '#94a3b8' } } },
                      grid: { line: { stroke: '#334155' } }
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Selected Metrics Grid */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-slate-400" />
            <h3 className="text-lg font-semibold text-white">Selected Metrics</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {config.selectedMetrics.map(metricId => {
            const metric = availableMetrics.find(m => m.id === metricId)
            if (!metric) return null

            const Icon = iconMap[metric.icon] || Code
            const currentValue = getMetricValue(metricId)
            const previousValue = getPreviousMetricValue(metricId)
            const change = currentValue - previousValue
            const changePercent = previousValue > 0 ? (change / previousValue) * 100 : 0

            return (
              <div
                key={metricId}
                className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50 hover:border-slate-500 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-blue-500/10 rounded">
                    <Icon className="w-4 h-4 text-blue-400" />
                  </div>
                  <h3 className="text-xs font-medium text-slate-400 truncate">{metric.name}</h3>
                </div>

                <div className="space-y-1">
                  <p className="text-2xl font-bold text-white">
                    {formatValue(currentValue)}
                  </p>
                  
                  {previousValue > 0 && (
                    <div className="flex items-center gap-1 text-xs">
                      {change >= 0 ? (
                        <>
                          <ArrowUpRight className="w-3 h-3 text-green-400" />
                          <span className="text-green-400">
                            +{changePercent.toFixed(1)}%
                          </span>
                        </>
                      ) : (
                        <>
                          <ArrowDownRight className="w-3 h-3 text-red-400" />
                          <span className="text-red-400">
                            -{Math.abs(changePercent).toFixed(1)}%
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
          <p className="text-sm text-slate-400 text-center">
            Showing {config.selectedMetrics.length} selected metrics
            {metricsData && Array.isArray(metricsData) && metricsData.length > 0 && (
              <span className="ml-2">• Latest data from {new Date(metricsData[0]?.date || metricsData[0]?.day || Date.now()).toLocaleDateString()}</span>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

export default GeneratedDashboard
