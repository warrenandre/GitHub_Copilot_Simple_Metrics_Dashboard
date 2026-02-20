import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Building2, 
  Building, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  LayoutDashboard,
  Github,
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
  Radio,
  Settings,
  Key,
  AlertCircle,
  Eye,
  EyeOff,
  Download
} from 'lucide-react'
import { useDashboard, metricCategories, DashboardLevel } from '../contexts/DashboardContext'
import { loadApiConfig, saveApiConfig } from '../config/apiConfig'
import { githubApiService } from '../services/githubApi'
import '../contexts/ThemeContext'

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

const DashboardSetup = () => {
  const navigate = useNavigate()
  // Theme context removed - using direct Tailwind dark classes
  const { 
    config, 
    setLevel, 
    toggleMetric, 
    setUseDemo, 
    setDashboardName,
    saveDashboard, 
    availableMetrics 
  } = useDashboard()
  
  const [step, setStep] = useState(1)
  const [dashboardNameInput, setDashboardNameInput] = useState(config?.name || 'My Copilot Dashboard')
  
  // API Configuration State
  const [apiConfig, setApiConfig] = useState({
    org: '',
    token: '',
    enterprise: '',
    team_slug: ''
  })
  const [showToken, setShowToken] = useState(false)
  const [apiValidationErrors, setApiValidationErrors] = useState<string[]>([])
  
  // Download state for live data
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState<string | null>(null)
  const [dataDownloaded, setDataDownloaded] = useState(false)

  // Load existing API config on mount
  useEffect(() => {
    const savedConfig = loadApiConfig()
    if (savedConfig) {
      setApiConfig(prev => ({
        ...prev,
        org: savedConfig.org || '',
        token: savedConfig.token || '',
        team_slug: savedConfig.team_slug || ''
      }))
    }
    // Also load enterprise from localStorage if present
    const savedEnterprise = localStorage.getItem('copilot_enterprise_slug')
    if (savedEnterprise) {
      setApiConfig(prev => ({ ...prev, enterprise: savedEnterprise }))
    }
  }, [])

  const handleLevelSelect = (level: DashboardLevel) => {
    setLevel(level)
    setStep(2)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const validateApiDetails = (): boolean => {
    const errors: string[] = []
    
    if (config?.level === 'enterprise') {
      if (!apiConfig.enterprise.trim()) {
        errors.push('Enterprise slug is required')
      }
    } else {
      if (!apiConfig.org.trim()) {
        errors.push('Organization name is required')
      }
    }
    
    if (!apiConfig.token.trim()) {
      errors.push('Personal Access Token is required')
    } else if (!apiConfig.token.startsWith('ghp_') && !apiConfig.token.startsWith('github_pat_')) {
      errors.push('Token should start with "ghp_" or "github_pat_"')
    }
    
    setApiValidationErrors(errors)
    return errors.length === 0
  }

  const handleApiNext = () => {
    if (validateApiDetails()) {
      setStep(3)
    }
  }

  const handleNext = () => {
    if (step === 3 && config?.selectedMetrics && config.selectedMetrics.length > 0) {
      setStep(4)
    }
  }

  const handleDownloadData = async () => {
    setIsDownloading(true)
    setDownloadError(null)
    
    try {
      // Build API config from current setup
      const apiConfigToUse = {
        org: config?.level === 'enterprise' ? apiConfig.enterprise : apiConfig.org,
        token: apiConfig.token,
        team_slug: apiConfig.team_slug
      }
      
      // Fetch data from GitHub API
      console.log('📥 Downloading live data from GitHub API...')
      const data = await githubApiService.fetchFromGitHub(apiConfigToUse, config?.level || 'enterprise')
      
      // Save to localStorage
      const storageKey = config?.level === 'enterprise' 
        ? 'copilot_enterprise_metrics_data' 
        : 'copilot_org_metrics_data'
      
      localStorage.setItem(storageKey, JSON.stringify(data))
      localStorage.setItem('copilot_metrics_timestamp', new Date().toISOString())
      
      setDataDownloaded(true)
      console.log('✅ Data downloaded and cached successfully')
    } catch (error) {
      console.error('❌ Failed to download data:', error)
      setDownloadError(error instanceof Error ? error.message : 'Failed to download data from GitHub API')
    } finally {
      setIsDownloading(false)
    }
  }

  const handleFinish = () => {
    setDashboardName(dashboardNameInput)
    
    // Save API configuration
    const apiConfigToSave = {
      org: config?.level === 'enterprise' ? apiConfig.enterprise : apiConfig.org,
      token: apiConfig.token,
      team_slug: apiConfig.team_slug
    }
    saveApiConfig(apiConfigToSave)
    
    // Save enterprise slug separately for enterprise level
    if (config?.level === 'enterprise') {
      localStorage.setItem('copilot_enterprise_slug', apiConfig.enterprise)
    }
    
    // Save token to session storage (more secure than localStorage)
    sessionStorage.setItem('copilot_api_token', apiConfig.token)
    
    // Save dashboard config
    saveDashboard()
    
    // Navigate to dashboard
    navigate('/dashboard')
  }

  const selectedCount = config?.selectedMetrics?.length || 0

  // Group metrics by category
  const groupedMetrics = metricCategories.map(category => ({
    ...category,
    metrics: availableMetrics.filter(m => m.category === category.id)
  })).filter(cat => cat.metrics.length > 0)

  const selectAllInCategory = (categoryId: string) => {
    const categoryMetrics = availableMetrics.filter(m => m.category === categoryId)
    categoryMetrics.forEach(m => {
      if (!config?.selectedMetrics?.includes(m.id)) {
        toggleMetric(m.id)
      }
    })
  }

  const deselectAllInCategory = (categoryId: string) => {
    const categoryMetrics = availableMetrics.filter(m => m.category === categoryId)
    categoryMetrics.forEach(m => {
      if (config?.selectedMetrics?.includes(m.id)) {
        toggleMetric(m.id)
      }
    })
  }

  return (
    <div className="min-h-screen bg-slate-900 dark:bg-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-lg sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Github className="w-8 h-8 text-blue-500" />
              <div>
                <h1 className="text-xl font-bold text-white">Dashboard Setup</h1>
                <p className="text-sm text-slate-400">Configure your Copilot metrics dashboard</p>
              </div>
            </div>
            {/* Progress Indicator */}
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    step >= s 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-slate-700 text-slate-400'
                  }`}>
                    {step > s ? <Check className="w-4 h-4" /> : s}
                  </div>
                  {s < 4 && (
                    <div className={`w-8 h-0.5 ${step > s ? 'bg-blue-600' : 'bg-slate-700'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Step 1: Select Level */}
        {step === 1 && (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-white">Select Monitoring Level</h2>
              <p className="text-slate-400 max-w-xl mx-auto">
                Choose whether you want to monitor GitHub Copilot metrics at the Enterprise or Organization level.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {/* Enterprise Option */}
              <button
                onClick={() => handleLevelSelect('enterprise')}
                className={`group relative p-8 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                  config?.level === 'enterprise'
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-slate-700 bg-slate-800 hover:border-blue-500/50'
                }`}
              >
                <div className="absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  config?.level === 'enterprise'
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-slate-600'
                }">
                  {config?.level === 'enterprise' && <Check className="w-4 h-4 text-white" />}
                </div>
                <Building2 className="w-16 h-16 text-blue-400 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
                <p className="text-slate-400 text-sm">
                  Monitor Copilot usage across your entire enterprise, including all organizations and teams.
                </p>
                <ul className="mt-4 text-left text-sm text-slate-300 space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" /> Cross-org analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" /> 28-day reports
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" /> Seat management data
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" /> Agents metrics
                  </li>
                </ul>
              </button>

              {/* Organization Option */}
              <button
                onClick={() => handleLevelSelect('organization')}
                className={`group relative p-8 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                  config?.level === 'organization'
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-slate-700 bg-slate-800 hover:border-purple-500/50'
                }`}
              >
                <div className="absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  config?.level === 'organization'
                    ? 'border-purple-500 bg-purple-500'
                    : 'border-slate-600'
                }">
                  {config?.level === 'organization' && <Check className="w-4 h-4 text-white" />}
                </div>
                <Building className="w-16 h-16 text-purple-400 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Organization</h3>
                <p className="text-slate-400 text-sm">
                  Monitor Copilot usage within a specific GitHub organization and its teams.
                </p>
                <ul className="mt-4 text-left text-sm text-slate-300 space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" /> Team-level metrics
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" /> Usage analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" /> Performance insights
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" /> Adoption tracking
                  </li>
                </ul>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: API Configuration */}
        {step === 2 && (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-white">
                {config?.level === 'enterprise' ? 'Enterprise' : 'Organization'} Configuration
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto">
                Enter your GitHub {config?.level === 'enterprise' ? 'Enterprise' : 'Organization'} details to connect to the Copilot API.
              </p>
            </div>

            <div className="max-w-xl mx-auto space-y-6">
              {/* Validation Errors */}
              {apiValidationErrors.length > 0 && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
                    <div>
                      <p className="text-red-400 font-medium">Please fix the following errors:</p>
                      <ul className="mt-2 space-y-1">
                        {apiValidationErrors.map((error, index) => (
                          <li key={index} className="text-red-300 text-sm">• {error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Enterprise/Org Name */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center gap-3 mb-4">
                  {config?.level === 'enterprise' ? (
                    <Building2 className="w-6 h-6 text-blue-400" />
                  ) : (
                    <Building className="w-6 h-6 text-purple-400" />
                  )}
                  <h3 className="text-lg font-semibold text-white">
                    {config?.level === 'enterprise' ? 'Enterprise Slug' : 'Organization Name'}
                  </h3>
                </div>
                <input
                  type="text"
                  value={config?.level === 'enterprise' ? apiConfig.enterprise : apiConfig.org}
                  onChange={(e) => {
                    if (config?.level === 'enterprise') {
                      setApiConfig(prev => ({ ...prev, enterprise: e.target.value }))
                    } else {
                      setApiConfig(prev => ({ ...prev, org: e.target.value }))
                    }
                    setApiValidationErrors([])
                  }}
                  placeholder={config?.level === 'enterprise' ? 'my-enterprise' : 'my-organization'}
                  className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <p className="mt-2 text-sm text-slate-400">
                  {config?.level === 'enterprise' 
                    ? 'The slug of your GitHub Enterprise (from your enterprise URL)'
                    : 'The name of your GitHub Organization'}
                </p>
              </div>

              {/* Personal Access Token */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center gap-3 mb-4">
                  <Key className="w-6 h-6 text-yellow-400" />
                  <h3 className="text-lg font-semibold text-white">Personal Access Token</h3>
                </div>
                <div className="relative">
                  <input
                    type={showToken ? 'text' : 'password'}
                    value={apiConfig.token}
                    onChange={(e) => {
                      setApiConfig(prev => ({ ...prev, token: e.target.value }))
                      setApiValidationErrors([])
                    }}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                    className="w-full px-4 py-3 pr-12 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowToken(!showToken)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showToken ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="mt-2 text-sm text-slate-400">
                  A GitHub PAT with <code className="text-blue-300">copilot</code>, <code className="text-blue-300">manage_billing:copilot</code>, and <code className="text-blue-300">read:org</code> scopes.
                </p>
              </div>

              {/* Team Slug (Optional) */}
              {config?.level === 'organization' && (
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                  <div className="flex items-center gap-3 mb-4">
                    <Users className="w-6 h-6 text-green-400" />
                    <h3 className="text-lg font-semibold text-white">Team Slug <span className="text-slate-400 text-sm font-normal">(Optional)</span></h3>
                  </div>
                  <input
                    type="text"
                    value={apiConfig.team_slug}
                    onChange={(e) => setApiConfig(prev => ({ ...prev, team_slug: e.target.value }))}
                    placeholder="my-team"
                    className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <p className="mt-2 text-sm text-slate-400">
                    Filter metrics for a specific team within your organization.
                  </p>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-center gap-4">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-6 py-3 text-slate-400 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              <button
                onClick={handleApiNext}
                className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Select Metrics */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Select Metrics</h2>
                <p className="text-slate-400">
                  Choose the metrics you want to display on your {config?.level} dashboard.
                  <span className="ml-2 text-blue-400 font-medium">{selectedCount} selected</span>
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={selectedCount === 0}
                  className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                    selectedCount > 0
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Metrics by Category */}
            <div className="space-y-6">
              {groupedMetrics.map(category => {
                const allSelected = category.metrics.every(m => config?.selectedMetrics?.includes(m.id))
                
                return (
                  <div key={category.id} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                        <p className="text-sm text-slate-400">{category.description}</p>
                      </div>
                      <button
                        onClick={() => allSelected ? deselectAllInCategory(category.id) : selectAllInCategory(category.id)}
                        className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        {allSelected ? 'Deselect All' : 'Select All'}
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                      {category.metrics.map(metric => {
                        const isSelected = config?.selectedMetrics?.includes(metric.id)
                        const IconComponent = iconMap[metric.icon] || Lightbulb
                        
                        return (
                          <button
                            key={metric.id}
                            onClick={() => toggleMetric(metric.id)}
                            className={`group flex items-center gap-2 px-4 py-2.5 rounded-full border-2 transition-all duration-200 ${
                              isSelected
                                ? 'border-blue-500 bg-blue-500/20 text-white'
                                : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500'
                            }`}
                          >
                            <IconComponent className={`w-4 h-4 ${isSelected ? 'text-blue-400' : 'text-slate-400'}`} />
                            <span className="text-sm font-medium">{metric.name}</span>
                            {isSelected && (
                              <Check className="w-4 h-4 text-blue-400" />
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Step 4: Configure & Finish */}
        {step === 4 && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Configure Dashboard</h2>
                <p className="text-slate-400">
                  Set up your dashboard preferences and data source.
                </p>
              </div>
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Dashboard Name */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center gap-3 mb-4">
                  <LayoutDashboard className="w-6 h-6 text-blue-400" />
                  <h3 className="text-lg font-semibold text-white">Dashboard Name</h3>
                </div>
                <input
                  type="text"
                  value={dashboardNameInput}
                  onChange={(e) => setDashboardNameInput(e.target.value)}
                  placeholder="Enter dashboard name"
                  className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Data Source */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center gap-3 mb-4">
                  <Radio className="w-6 h-6 text-blue-400" />
                  <h3 className="text-lg font-semibold text-white">Data Source</h3>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setUseDemo(false)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-colors ${
                      !config?.useDemo
                        ? 'border-orange-500 bg-orange-500/20 text-white'
                        : 'border-slate-600 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    <Radio className="w-4 h-4" />
                    Live Data
                  </button>
                  <button
                    onClick={() => setUseDemo(true)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-colors ${
                      config?.useDemo
                        ? 'border-purple-500 bg-purple-500/20 text-white'
                        : 'border-slate-600 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    <Radio className="w-4 h-4" />
                    Demo Data
                  </button>
                </div>
              </div>
            </div>

            {/* Download Data Section - Only show for Live Data */}
            {!config?.useDemo && (
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center gap-3 mb-4">
                  <Download className="w-6 h-6 text-blue-400" />
                  <h3 className="text-lg font-semibold text-white">Download Live Data</h3>
                </div>
                
                {!dataDownloaded ? (
                  <>
                    <p className="text-slate-400 text-sm mb-4">
                      Before creating your dashboard, download the latest metrics from GitHub API.
                    </p>
                    
                    {downloadError && (
                      <div className="mb-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-red-400 font-medium">Download Failed</p>
                            <p className="text-red-300 text-sm mt-1">{downloadError}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <button
                      onClick={handleDownloadData}
                      disabled={isDownloading}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
                    >
                      {isDownloading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Downloading...
                        </>
                      ) : (
                        <>
                          <Download className="w-5 h-5" />
                          Download Data from GitHub
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <div className="p-4 bg-green-500/10 border border-green-500/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="text-green-400 font-medium">Data Downloaded Successfully</p>
                        <p className="text-green-300 text-sm mt-1">You can now create your dashboard</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Summary */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <Settings className="w-6 h-6 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">Dashboard Summary</h3>
              </div>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-slate-400 mb-1">Level</p>
                  <p className="text-white font-medium capitalize flex items-center gap-2">
                    {config?.level === 'enterprise' ? (
                      <Building2 className="w-4 h-4 text-blue-400" />
                    ) : (
                      <Building className="w-4 h-4 text-purple-400" />
                    )}
                    {config?.level}
                  </p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-slate-400 mb-1">Selected Metrics</p>
                  <p className="text-white font-medium">{selectedCount} metrics</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-slate-400 mb-1">Data Source</p>
                  <p className="text-white font-medium">
                    {config?.useDemo ? 'Demo Data' : 'Live Data'}
                  </p>
                </div>
              </div>
              
              {/* Selected Metrics Preview */}
              <div className="mt-4">
                <p className="text-slate-400 text-sm mb-2">Selected Metrics:</p>
                <div className="flex flex-wrap gap-2">
                  {config?.selectedMetrics?.map(metricId => {
                    const metric = availableMetrics.find(m => m.id === metricId)
                    if (!metric) return null
                    return (
                      <span
                        key={metricId}
                        className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium"
                      >
                        {metric.name}
                      </span>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Create Button */}
            <div className="flex justify-center">
              <button
                onClick={handleFinish}
                disabled={!config?.useDemo && !dataDownloaded}
                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 shadow-lg shadow-blue-500/25 disabled:shadow-none"
              >
                <LayoutDashboard className="w-5 h-5" />
                Create Dashboard
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            
            {/* Helper text for disabled button */}
            {!config?.useDemo && !dataDownloaded && (
              <div className="text-center">
                <p className="text-slate-400 text-sm">
                  Please download data before creating the dashboard
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardSetup
