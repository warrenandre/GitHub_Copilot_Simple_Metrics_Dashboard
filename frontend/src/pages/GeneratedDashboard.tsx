import { useState, useEffect } from 'react'
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
  LineChart,
  BarChart,
  Building2,
  Building,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { demoEnterpriseMetrics } from '../data/demoEnterpriseData'

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
  LineChart,
  BarChart,
}

// Available metrics definition
const availableMetrics = [
  { id: 'total_active_users', name: 'Total Active Users', icon: 'Users', category: 'usage' },
  { id: 'total_engaged_users', name: 'Total Engaged Users', icon: 'UserCheck', category: 'usage' },
  { id: 'total_suggestions', name: 'Total Suggestions', icon: 'Lightbulb', category: 'performance' },
  { id: 'total_acceptances', name: 'Total Acceptances', icon: 'CheckCircle', category: 'performance' },
  { id: 'total_lines_suggested', name: 'Total Lines Suggested', icon: 'Code', category: 'performance' },
  { id: 'total_lines_accepted', name: 'Total Lines Accepted', icon: 'FileCheck', category: 'performance' },
  { id: 'acceptance_rate', name: 'Acceptance Rate', icon: 'Percent', category: 'adoption', format: 'percent' },
  { id: 'total_chat_turns', name: 'Total Chat Turns', icon: 'MessageSquare', category: 'usage' },
  { id: 'total_chat_insertion_events', name: 'Chat Code Insertions', icon: 'Copy', category: 'usage' },
  { id: 'total_chat_copy_events', name: 'Chat Code Copies', icon: 'Plus', category: 'usage' },
]

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
          // Load from localStorage
          const storageKey = dashboardConfig.level === 'enterprise' 
            ? 'copilot_enterprise_metrics_data' 
            : 'copilot_org_metrics_data'
          
          const cachedData = localStorage.getItem(storageKey)
          if (cachedData) {
            console.log('✅ Loaded cached live data')
            setMetricsData(JSON.parse(cachedData))
          } else {
            console.log('❌ No cached data found')
            setError('No data available. Please go back to setup and download data.')
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

  // Get metric value from data
  const getMetricValue = (metricId: string): number => {
    if (!metricsData || !Array.isArray(metricsData)) return 0
    
    // Get the latest data point (first in array)
    const latestData = metricsData[0]
    if (!latestData) return 0

    // Handle acceptance rate specially
    if (metricId === 'acceptance_rate') {
      const suggestions = latestData.total_suggestions_count || 0
      const acceptances = latestData.total_acceptances_count || 0
      return suggestions > 0 ? (acceptances / suggestions) * 100 : 0
    }

    // Map metric ID to data key
    const dataKey = metricId.replace('total_', 'total_') + (metricId.includes('_count') ? '' : '_count')
    return latestData[dataKey] || latestData[metricId] || 0
  }

  // Get previous metric value for comparison
  const getPreviousMetricValue = (metricId: string): number => {
    if (!metricsData || !Array.isArray(metricsData) || metricsData.length < 2) return 0
    
    const previousData = metricsData[1]
    if (!previousData) return 0

    if (metricId === 'acceptance_rate') {
      const suggestions = previousData.total_suggestions_count || 0
      const acceptances = previousData.total_acceptances_count || 0
      return suggestions > 0 ? (acceptances / suggestions) * 100 : 0
    }

    const dataKey = metricId.replace('total_', 'total_') + (metricId.includes('_count') ? '' : '_count')
    return previousData[dataKey] || previousData[metricId] || 0
  }

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

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-slate-400">{metric.name}</h3>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-3xl font-bold text-white">
                    {formatValue(currentValue, metric.format)}
                  </p>
                  
                  {previousValue > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                      {change >= 0 ? (
                        <>
                          <ArrowUpRight className="w-4 h-4 text-green-400" />
                          <span className="text-green-400">
                            +{formatValue(Math.abs(change), metric.format)} ({changePercent.toFixed(1)}%)
                          </span>
                        </>
                      ) : (
                        <>
                          <ArrowDownRight className="w-4 h-4 text-red-400" />
                          <span className="text-red-400">
                            -{formatValue(Math.abs(change), metric.format)} ({Math.abs(changePercent).toFixed(1)}%)
                          </span>
                        </>
                      )}
                      <span className="text-slate-500">vs previous</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Info Section */}
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
          <p className="text-sm text-slate-400 text-center">
            Showing {config.selectedMetrics.length} selected metrics
            {metricsData && Array.isArray(metricsData) && metricsData.length > 0 && (
              <span className="ml-2">• Latest data from {new Date(metricsData[0]?.date || Date.now()).toLocaleDateString()}</span>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

export default GeneratedDashboard
