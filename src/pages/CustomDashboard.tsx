import { useState, useEffect } from 'react'
import { 
  LayoutDashboard, 
  Plus, 
  Settings, 
  Save, 
  X, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  AlertCircle,
  Edit2
} from 'lucide-react'
import { ResponsiveBar } from '@nivo/bar'
import { useTheme } from '../contexts/ThemeContext'
import DataSourceToggle from '../components/DataSourceToggle'

interface MetricDefinition {
  id: string
  name: string
  category: 'copilot' | 'pr' | 'general'
  description: string
  unit?: string
}

interface DashboardMetric {
  metricId: string
  visible: boolean
  order: number
}

interface CustomDashboardConfig {
  id: string
  name: string
  metrics: DashboardMetric[]
  createdAt: string
  updatedAt: string
}

interface MetricData {
  id: string
  name: string
  currentWeek: number
  previousWeek: number
  currentMonth: number
  previousMonth: number
  weekChange: number
  weekChangePercent: number
  monthChange: number
  monthChangePercent: number
  monthlyHistory: { month: string; value: number }[]
}

const CustomDashboard = () => {
  const { theme } = useTheme()
  const [isDemo, setIsDemo] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [dashboardName, setDashboardName] = useState('My Dashboard')
  const [currentDashboard, setCurrentDashboard] = useState<CustomDashboardConfig | null>(null)
  const [availableMetrics] = useState<MetricDefinition[]>([
    // Copilot Metrics
    { id: 'acceptances', name: 'Copilot Acceptances', category: 'copilot', description: 'Suggestions accepted', unit: 'count' },
    { id: 'suggestions', name: 'Copilot Suggestions', category: 'copilot', description: 'Total suggestions shown', unit: 'count' },
    { id: 'acceptance_rate', name: 'Acceptance Rate', category: 'copilot', description: 'Percentage accepted', unit: '%' },
    { id: 'active_users', name: 'Active Copilot Users', category: 'copilot', description: 'Users with activity', unit: 'users' },
    { id: 'lines_suggested', name: 'Lines Suggested', category: 'copilot', description: 'Lines by Copilot', unit: 'lines' },
    { id: 'lines_accepted', name: 'Lines Accepted', category: 'copilot', description: 'Lines accepted', unit: 'lines' },
    
    // PR Metrics
    { id: 'pr_total', name: 'Total Pull Requests', category: 'pr', description: 'Total PRs', unit: 'PRs' },
    { id: 'pr_merged', name: 'Merged PRs', category: 'pr', description: 'Successfully merged', unit: 'PRs' },
    { id: 'pr_open', name: 'Open PRs', category: 'pr', description: 'Currently open', unit: 'PRs' },
    { id: 'pr_closed', name: 'Closed PRs', category: 'pr', description: 'Closed without merge', unit: 'PRs' },
    { id: 'pr_merge_time', name: 'Avg Time to Merge', category: 'pr', description: 'Average merge time', unit: 'hours' },
    { id: 'pr_contributors', name: 'PR Contributors', category: 'pr', description: 'Unique contributors', unit: 'users' },
    
    // General Metrics
    { id: 'commits', name: 'Total Commits', category: 'general', description: 'Number of commits', unit: 'commits' },
    { id: 'contributors', name: 'Active Contributors', category: 'general', description: 'Active contributors', unit: 'users' },
    { id: 'code_changes', name: 'Lines Changed', category: 'general', description: 'Lines added/removed', unit: 'lines' },
  ])

  // Load dashboard from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('customDashboard')
    if (saved) {
      try {
        const config: CustomDashboardConfig = JSON.parse(saved)
        setCurrentDashboard(config)
        setDashboardName(config.name)
      } catch (error) {
        console.error('Failed to load dashboard:', error)
        initializeDefaultDashboard()
      }
    } else {
      initializeDefaultDashboard()
    }
  }, [])

  const initializeDefaultDashboard = () => {
    const defaultConfig: CustomDashboardConfig = {
      id: 'default',
      name: 'My Dashboard',
      metrics: [
        { metricId: 'acceptances', visible: true, order: 0 },
        { metricId: 'acceptance_rate', visible: true, order: 1 },
        { metricId: 'pr_merged', visible: true, order: 2 },
        { metricId: 'pr_merge_time', visible: true, order: 3 },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setCurrentDashboard(defaultConfig)
    saveDashboard(defaultConfig)
  }

  const saveDashboard = (config: CustomDashboardConfig) => {
    const updated = {
      ...config,
      updatedAt: new Date().toISOString(),
    }
    localStorage.setItem('customDashboard', JSON.stringify(updated))
    setCurrentDashboard(updated)
  }

  const handleSaveDashboard = () => {
    if (currentDashboard) {
      const updated = {
        ...currentDashboard,
        name: dashboardName,
      }
      saveDashboard(updated)
      setEditMode(false)
      setShowSettings(false)
    }
  }

  const toggleMetric = (metricId: string) => {
    if (!currentDashboard) return

    const existingIndex = currentDashboard.metrics.findIndex(m => m.metricId === metricId)
    let newMetrics: DashboardMetric[]

    if (existingIndex >= 0) {
      // Toggle visibility
      newMetrics = currentDashboard.metrics.map((m, idx) =>
        idx === existingIndex ? { ...m, visible: !m.visible } : m
      )
    } else {
      // Add new metric
      newMetrics = [
        ...currentDashboard.metrics,
        {
          metricId,
          visible: true,
          order: currentDashboard.metrics.length,
        },
      ]
    }

    const updated = { ...currentDashboard, metrics: newMetrics }
    setCurrentDashboard(updated)
  }

  // Generate demo data for metrics
  const generateMetricData = (metricId: string): MetricData => {
    const metric = availableMetrics.find(m => m.id === metricId)
    if (!metric) {
      return {
        id: metricId,
        name: 'Unknown',
        currentWeek: 0,
        previousWeek: 0,
        currentMonth: 0,
        previousMonth: 0,
        weekChange: 0,
        weekChangePercent: 0,
        monthChange: 0,
        monthChangePercent: 0,
        monthlyHistory: [],
      }
    }

    const baseValues: { [key: string]: number } = {
      acceptances: 1250,
      suggestions: 2100,
      acceptance_rate: 59.5,
      active_users: 24,
      lines_suggested: 8400,
      lines_accepted: 5200,
      pr_total: 45,
      pr_merged: 38,
      pr_open: 5,
      pr_closed: 2,
      pr_merge_time: 18.5,
      pr_contributors: 12,
      commits: 320,
      contributors: 18,
      code_changes: 15600,
    }

    const base = baseValues[metricId] || 100
    const weekVariation = (Math.random() - 0.5) * 0.3
    const monthVariation = (Math.random() - 0.5) * 0.4

    const currentWeek = base
    const previousWeek = base * (1 - weekVariation)
    const currentMonth = base * 4
    const previousMonth = currentMonth * (1 - monthVariation)

    const weekChange = currentWeek - previousWeek
    const weekChangePercent = (weekChange / previousWeek) * 100
    const monthChange = currentMonth - previousMonth
    const monthChangePercent = (monthChange / previousMonth) * 100

    // Generate 6 months of historical data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    const monthlyHistory = months.map((month, index) => {
      const variability = (Math.random() - 0.5) * 0.3
      const monthValue = base * 4 * (1 + variability - (index * 0.05)) // Slight trend
      return {
        month,
        value: Math.round(monthValue * 10) / 10
      }
    })

    return {
      id: metricId,
      name: metric.name,
      currentWeek: Math.round(currentWeek * 10) / 10,
      previousWeek: Math.round(previousWeek * 10) / 10,
      currentMonth: Math.round(currentMonth * 10) / 10,
      previousMonth: Math.round(previousMonth * 10) / 10,
      weekChange: Math.round(weekChange * 10) / 10,
      weekChangePercent: Math.round(weekChangePercent * 10) / 10,
      monthChange: Math.round(monthChange * 10) / 10,
      monthChangePercent: Math.round(monthChangePercent * 10) / 10,
      monthlyHistory,
    }
  }

  const getVisibleMetrics = (): MetricData[] => {
    if (!currentDashboard) return []

    return currentDashboard.metrics
      .filter(m => m.visible)
      .sort((a, b) => a.order - b.order)
      .map(m => generateMetricData(m.metricId))
  }

  const isMetricSelected = (metricId: string): boolean => {
    return currentDashboard?.metrics.some(m => m.metricId === metricId && m.visible) || false
  }

  const visibleMetrics = getVisibleMetrics()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LayoutDashboard className="w-8 h-8 text-purple-500" />
          <div>
            {editMode ? (
              <input
                type="text"
                value={dashboardName}
                onChange={(e) => setDashboardName(e.target.value)}
                className="text-3xl font-bold text-white bg-transparent border-b-2 border-purple-500 focus:outline-none"
                placeholder="Dashboard Name"
              />
            ) : (
              <h1 className="text-3xl font-bold text-white">{dashboardName}</h1>
            )}
            <p className="text-slate-400 mt-1">
              {editMode ? 'Editing your custom dashboard' : 'Your personalized metrics view'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <DataSourceToggle isDemo={isDemo} onToggle={setIsDemo} />
          {!editMode ? (
            <>
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Edit2 className="w-5 h-5" />
                Edit Dashboard
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5" />
                Settings
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleSaveDashboard}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <Save className="w-5 h-5" />
                Save Changes
              </button>
              <button
                onClick={() => {
                  setEditMode(false)
                  setDashboardName(currentDashboard?.name || 'My Dashboard')
                }}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {/* Edit Mode Banner */}
      {editMode && (
        <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-100">
              <p className="font-semibold mb-1">Edit Mode Active</p>
              <p className="text-blue-200">
                Select metrics to add or remove from your dashboard. Click the eye icon to toggle visibility, or the trash icon to remove completely.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Demo Mode Banner */}
      {isDemo && !editMode && (
        <div className="bg-purple-900/20 border border-purple-700/50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-purple-100">
              <p className="font-semibold mb-1">Demo Mode Active</p>
              <p className="text-purple-200">
                Viewing sample data. Your dashboard configuration is saved and will be used with live data when connected.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Metric Selection Panel (Edit Mode) */}
      {editMode && (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Metrics to Dashboard
          </h3>
          
          {/* Copilot Metrics */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Copilot Metrics</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {availableMetrics.filter(m => m.category === 'copilot').map(metric => (
                <button
                  key={metric.id}
                  onClick={() => toggleMetric(metric.id)}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                    isMetricSelected(metric.id)
                      ? 'bg-blue-900/30 border-blue-600 text-white'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <div className="text-left">
                    <div className="font-medium text-sm">{metric.name}</div>
                    <div className="text-xs text-slate-400">{metric.description}</div>
                  </div>
                  {isMetricSelected(metric.id) && (
                    <div className="ml-2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* PR Metrics */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Pull Request Metrics</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {availableMetrics.filter(m => m.category === 'pr').map(metric => (
                <button
                  key={metric.id}
                  onClick={() => toggleMetric(metric.id)}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                    isMetricSelected(metric.id)
                      ? 'bg-blue-900/30 border-blue-600 text-white'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <div className="text-left">
                    <div className="font-medium text-sm">{metric.name}</div>
                    <div className="text-xs text-slate-400">{metric.description}</div>
                  </div>
                  {isMetricSelected(metric.id) && (
                    <div className="ml-2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* General Metrics */}
          <div>
            <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">General Metrics</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {availableMetrics.filter(m => m.category === 'general').map(metric => (
                <button
                  key={metric.id}
                  onClick={() => toggleMetric(metric.id)}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                    isMetricSelected(metric.id)
                      ? 'bg-blue-900/30 border-blue-600 text-white'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <div className="text-left">
                    <div className="font-medium text-sm">{metric.name}</div>
                    <div className="text-xs text-slate-400">{metric.description}</div>
                  </div>
                  {isMetricSelected(metric.id) && (
                    <div className="ml-2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Metrics Display */}
      {!editMode && visibleMetrics.length > 0 && isDemo && (
        <>
          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {visibleMetrics.map((metric) => (
              <div key={metric.id} className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-medium text-slate-400">{metric.name}</h3>
                    <p className="text-3xl font-bold text-white mt-2">
                      {metric.currentWeek.toLocaleString()}
                    </p>
                  </div>
                  {metric.weekChange >= 0 ? (
                    <TrendingUp className="w-6 h-6 text-green-400" />
                  ) : (
                    <TrendingDown className="w-6 h-6 text-red-400" />
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Week Change:</span>
                    <span className={`font-semibold ${
                      metric.weekChange >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {metric.weekChange >= 0 ? '+' : ''}{metric.weekChangePercent.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Month Change:</span>
                    <span className={`font-semibold ${
                      metric.monthChange >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {metric.monthChange >= 0 ? '+' : ''}{metric.monthChangePercent.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Weekly Comparison Chart */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                Weekly Comparison - Previous vs Current Week
              </h3>
            </div>
            <div style={{ height: '400px' }}>
              <ResponsiveBar
                data={[
                  {
                    period: 'Previous Week',
                    ...visibleMetrics.slice(0, 4).reduce((acc, metric) => {
                      acc[metric.name] = metric.previousWeek
                      return acc
                    }, {} as Record<string, number>)
                  },
                  {
                    period: 'Current Week',
                    ...visibleMetrics.slice(0, 4).reduce((acc, metric) => {
                      acc[metric.name] = metric.currentWeek
                      return acc
                    }, {} as Record<string, number>)
                  }
                ]}
                keys={visibleMetrics.slice(0, 4).map(m => m.name)}
                indexBy="period"
                margin={{ top: 20, right: 180, bottom: 60, left: 80 }}
                padding={0.3}
                groupMode="stacked"
                colors={['#3b82f6', '#10b981', '#f59e0b', '#ef4444']}
                borderRadius={4}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: 'Period',
                  legendPosition: 'middle',
                  legendOffset: 40,
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  legend: 'Value',
                  legendPosition: 'middle',
                  legendOffset: -60,
                }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor="#ffffff"
                enableLabel={true}
                tooltip={({ id, value, color }) => (
                  <div
                    style={{
                      padding: '12px',
                      background: '#1e293b',
                      border: '1px solid #475569',
                      borderRadius: '4px',
                      color: '#fff',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '12px', height: '12px', backgroundColor: color, borderRadius: '2px' }} />
                      <strong>{id}</strong>
                    </div>
                    <div style={{ marginTop: '4px', fontSize: '14px' }}>
                      Value: <strong>{value.toLocaleString()}</strong>
                    </div>
                  </div>
                )}
                legends={[
                  {
                    dataFrom: 'keys',
                    anchor: 'bottom-right',
                    direction: 'column',
                    justify: false,
                    translateX: 150,
                    translateY: 0,
                    itemsSpacing: 4,
                    itemWidth: 140,
                    itemHeight: 20,
                    itemDirection: 'left-to-right',
                    itemOpacity: 0.85,
                    symbolSize: 16,
                    effects: [
                      {
                        on: 'hover',
                        style: {
                          itemOpacity: 1
                        }
                      }
                    ]
                  }
                ]}
                theme={{
                  axis: {
                    ticks: {
                      text: { fill: theme === 'dark' ? '#cbd5e1' : '#64748b' }
                    },
                    legend: {
                      text: { fill: theme === 'dark' ? '#cbd5e1' : '#64748b' }
                    }
                  },
                  legends: {
                    text: { fill: theme === 'dark' ? '#cbd5e1' : '#64748b' }
                  },
                  grid: {
                    line: {
                      stroke: theme === 'dark' ? '#334155' : '#e2e8f0',
                    }
                  },
                  tooltip: {
                    container: {
                      background: '#1e293b',
                      color: '#fff',
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Monthly Comparison Chart */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-400" />
                Monthly Trend - Last 6 Months
              </h3>
            </div>
            <div style={{ height: '400px' }}>
              <ResponsiveBar
                data={(() => {
                  const months = visibleMetrics[0]?.monthlyHistory?.map(h => h.month) || []
                  return months.map(month => {
                    const dataPoint: Record<string, any> = { month }
                    visibleMetrics.slice(0, 4).forEach(metric => {
                      const monthData = metric.monthlyHistory.find(h => h.month === month)
                      dataPoint[metric.name] = monthData?.value || 0
                    })
                    return dataPoint
                  })
                })()}
                keys={visibleMetrics.slice(0, 4).map(m => m.name)}
                indexBy="month"
                margin={{ top: 20, right: 180, bottom: 60, left: 80 }}
                padding={0.3}
                groupMode="stacked"
                colors={['#3b82f6', '#10b981', '#f59e0b', '#ef4444']}
                borderRadius={4}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: 'Month',
                  legendPosition: 'middle',
                  legendOffset: 40,
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  legend: 'Value',
                  legendPosition: 'middle',
                  legendOffset: -60,
                }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor="#ffffff"
                enableLabel={true}
                tooltip={({ id, value, color }) => (
                  <div
                    style={{
                      padding: '12px',
                      background: '#1e293b',
                      border: '1px solid #475569',
                      borderRadius: '4px',
                      color: '#fff',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '12px', height: '12px', backgroundColor: color, borderRadius: '2px' }} />
                      <strong>{id}</strong>
                    </div>
                    <div style={{ marginTop: '4px', fontSize: '14px' }}>
                      Value: <strong>{value.toLocaleString()}</strong>
                    </div>
                  </div>
                )}
                legends={[
                  {
                    dataFrom: 'keys',
                    anchor: 'bottom-right',
                    direction: 'column',
                    justify: false,
                    translateX: 150,
                    translateY: 0,
                    itemsSpacing: 4,
                    itemWidth: 140,
                    itemHeight: 20,
                    itemDirection: 'left-to-right',
                    itemOpacity: 0.85,
                    symbolSize: 16,
                    effects: [
                      {
                        on: 'hover',
                        style: {
                          itemOpacity: 1
                        }
                      }
                    ]
                  }
                ]}
                theme={{
                  axis: {
                    ticks: {
                      text: { fill: theme === 'dark' ? '#cbd5e1' : '#64748b' }
                    },
                    legend: {
                      text: { fill: theme === 'dark' ? '#cbd5e1' : '#64748b' }
                    }
                  },
                  legends: {
                    text: { fill: theme === 'dark' ? '#cbd5e1' : '#64748b' }
                  },
                  grid: {
                    line: {
                      stroke: theme === 'dark' ? '#334155' : '#e2e8f0',
                    }
                  },
                  tooltip: {
                    container: {
                      background: '#1e293b',
                      color: '#fff',
                    }
                  }
                }}
              />
            </div>
          </div>
        </>
      )}

      {/* Empty State */}
      {!editMode && visibleMetrics.length === 0 && (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-12 text-center">
          <LayoutDashboard className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Metrics Selected</h3>
          <p className="text-slate-400 mb-6">
            Start building your custom dashboard by adding metrics
          </p>
          <button
            onClick={() => setEditMode(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Metrics
          </button>
        </div>
      )}

      {/* Live Mode Empty State */}
      {!isDemo && !editMode && (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-12 text-center">
          <AlertCircle className="w-16 h-16 text-orange-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Live Data Not Available</h3>
          <p className="text-slate-400 mb-6">
            Configure your repositories and fetch metrics to view live data on your custom dashboard.
          </p>
          <button
            onClick={() => setIsDemo(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            View Demo Data
          </button>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Dashboard Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  Dashboard Name
                </label>
                <input
                  type="text"
                  value={dashboardName}
                  onChange={(e) => setDashboardName(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-700">
                <p className="text-sm text-slate-400 mb-2">
                  Metrics Selected: <span className="text-white font-semibold">{currentDashboard?.metrics.filter(m => m.visible).length || 0}</span>
                </p>
                <p className="text-sm text-slate-400">
                  Last Updated: <span className="text-white">{currentDashboard ? new Date(currentDashboard.updatedAt).toLocaleString() : 'Never'}</span>
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSaveDashboard}
                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomDashboard
