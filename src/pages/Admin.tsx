import { useState, useEffect } from 'react'
import { Download, Save, Trash2, Settings, AlertCircle, CheckCircle, Info } from 'lucide-react'
import { githubApiService } from '../services/githubApi'
import { loadApiConfig, saveApiConfig, validateApiConfig } from '../config/apiConfig'
import { APIConfig, DownloadResult } from '../types/metrics'

const Admin = () => {
  const [config, setConfig] = useState<APIConfig>({
    org: '',
    token: '',
    since: '',
    until: '',
    team_slug: '',
  })
  
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<DownloadResult | null>(null)
  const [agentsResult, setAgentsResult] = useState<DownloadResult | null>(null)
  const [dataStats, setDataStats] = useState<ReturnType<typeof githubApiService.getDataStats>>(null)
  const [agentsStats, setAgentsStats] = useState<ReturnType<typeof githubApiService.getAgentsDataStats>>(null)
  const [lastSaved, setLastSaved] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  useEffect(() => {
    // Load saved config from config file/localStorage
    const savedConfig = loadApiConfig()
    if (savedConfig) {
      setConfig(prev => ({ ...prev, ...savedConfig }))
    }

    // Load data stats
    updateDataStats()
  }, [])

  const updateDataStats = () => {
    setDataStats(githubApiService.getDataStats())
    setAgentsStats(githubApiService.getAgentsDataStats())
    setLastSaved(githubApiService.getLastSavedTimestamp())
  }

  const handleInputChange = (field: keyof APIConfig, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }))
    // Clear validation errors when user makes changes
    setValidationErrors([])
  }

  const handleDownloadAndSave = async () => {
    // Validate configuration
    const validation = validateApiConfig(config)
    if (!validation.valid) {
      setValidationErrors(validation.errors)
      setResult({
        success: false,
        message: 'Please fix validation errors before proceeding',
      })
      return
    }

    setLoading(true)
    setResult(null)
    setValidationErrors([])

    const downloadResult = await githubApiService.downloadAndSave(config)
    setResult(downloadResult)
    setLoading(false)

    if (downloadResult.success) {
      // Save config to config file (without token for security)
      saveApiConfig(config)
      updateDataStats()
    }
  }

  const handleExportToFile = async () => {
    // Validate configuration
    const validation = validateApiConfig(config)
    if (!validation.valid) {
      setValidationErrors(validation.errors)
      setResult({
        success: false,
        message: 'Please fix validation errors before proceeding',
      })
      return
    }

    setLoading(true)
    setResult(null)
    setValidationErrors([])

    const exportResult = await githubApiService.downloadAsFile(config)
    setResult(exportResult)
    setLoading(false)
  }

  const handleDownloadAgents = async () => {
    // Validate configuration
    const validation = validateApiConfig(config)
    if (!validation.valid) {
      setValidationErrors(validation.errors)
      setAgentsResult({
        success: false,
        message: 'Please fix validation errors before proceeding',
      })
      return
    }

    setLoading(true)
    setAgentsResult(null)
    setValidationErrors([])

    const downloadResult = await githubApiService.downloadAndSaveAgents(config)
    setAgentsResult(downloadResult)
    setLoading(false)

    if (downloadResult.success) {
      updateDataStats()
    }
  }

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all saved metrics data?')) {
      githubApiService.clearLocalStorage()
      githubApiService.clearAgentsLocalStorage()
      updateDataStats()
      setResult({
        success: true,
        message: 'Local data cleared successfully',
      })
      setAgentsResult(null)
    }
  }

  const getSinceDefault = () => {
    const date = new Date()
    date.setDate(date.getDate() - 28)
    return date.toISOString().split('T')[0]
  }

  const getUntilDefault = () => {
    const date = new Date()
    date.setDate(date.getDate() - 1)
    return date.toISOString().split('T')[0]
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-white">Admin Settings</h1>
          <span className="px-3 py-1 bg-purple-500 bg-opacity-20 text-purple-400 text-xs font-semibold rounded-full flex items-center gap-1.5">
            <Settings className="w-3 h-3" />
            ADMIN
          </span>
        </div>
        <p className="text-slate-400">Configure and download GitHub Copilot metrics data</p>
      </div>

      {/* Current Data Status */}
      {dataStats && (
        <div className="bg-blue-500 bg-opacity-10 border border-blue-500 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-400 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-blue-400 mb-1">Local Data Available</h3>
              <p className="text-sm text-slate-300">
                <strong>{dataStats.count}</strong> days of metrics stored locally
              </p>
              <p className="text-sm text-slate-300">
                Date range: <strong>{dataStats.dateRange.from}</strong> to <strong>{dataStats.dateRange.to}</strong>
              </p>
              {lastSaved && (
                <p className="text-xs text-slate-400 mt-1">
                  Last saved: {new Date(lastSaved).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Current Agents Data Status */}
      {agentsStats && (
        <div className="bg-purple-500 bg-opacity-10 border border-purple-500 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-purple-400 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-purple-400 mb-1">Agents Data Available</h3>
              <p className="text-sm text-slate-300">
                <strong>{agentsStats.count}</strong> days of agents metrics stored locally
              </p>
              <p className="text-sm text-slate-300">
                Date range: <strong>{agentsStats.dateRange.from}</strong> to <strong>{agentsStats.dateRange.to}</strong>
              </p>
              <p className="text-sm text-slate-300">
                Total agents tracked: <strong>{agentsStats.totalAgents}</strong>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* API Configuration Form */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-xl font-semibold text-white mb-4">GitHub API Configuration</h2>
        
        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="mb-4 bg-red-500 bg-opacity-10 border border-red-500 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-red-400 mb-2">Configuration Errors</h3>
                <ul className="list-disc list-inside space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index} className="text-sm text-slate-300">{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
        
        <div className="space-y-4">
          {/* Organization */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Enterprise <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={config.org}
              onChange={(e) => handleInputChange('org', e.target.value)}
              placeholder="your-enterprise"
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
            <p className="text-xs text-slate-400 mt-1">The GitHub enterprise/organization name (not case sensitive)</p>
          </div>

          {/* Token */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Personal Access Token <span className="text-red-400">*</span>
            </label>
            <input
              type="password"
              value={config.token}
              onChange={(e) => handleInputChange('token', e.target.value)}
              placeholder="ghp_xxxxxxxxxxxx"
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
            <p className="text-xs text-slate-400 mt-1">
              Token needs <code className="bg-slate-900 px-1 rounded">manage_billing:copilot</code>,{' '}
              <code className="bg-slate-900 px-1 rounded">read:org</code>, or{' '}
              <code className="bg-slate-900 px-1 rounded">read:enterprise</code> scope
            </p>
          </div>

          {/* Team Slug (Optional) */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Team Slug (Optional)
            </label>
            <input
              type="text"
              value={config.team_slug}
              onChange={(e) => handleInputChange('team_slug', e.target.value)}
              placeholder="engineering-team"
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
            <p className="text-xs text-slate-400 mt-1">Leave empty to fetch enterprise-wide metrics</p>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Since Date (Optional)
              </label>
              <input
                type="date"
                value={config.since}
                onChange={(e) => handleInputChange('since', e.target.value)}
                placeholder={getSinceDefault()}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
              <p className="text-xs text-slate-400 mt-1">Default: 28 days ago</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Until Date (Optional)
              </label>
              <input
                type="date"
                value={config.until}
                onChange={(e) => handleInputChange('until', e.target.value)}
                placeholder={getUntilDefault()}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
              <p className="text-xs text-slate-400 mt-1">Default: Yesterday</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-xl font-semibold text-white mb-4">Copilot Metrics Actions</h2>
        
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleDownloadAndSave}
            disabled={loading || !config.org || !config.token}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-medium rounded-lg transition-colors"
          >
            <Save className="w-5 h-5" />
            {loading ? 'Downloading...' : 'Download Metrics Data'}
          </button>

          <button
            onClick={handleExportToFile}
            disabled={loading || !config.org || !config.token}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-medium rounded-lg transition-colors"
          >
            <Download className="w-5 h-5" />
            Export Metrics to JSON
          </button>
        </div>

        <div className="mt-4 text-sm text-slate-400">
          <p><strong>Download Metrics Data:</strong> Fetches usage metrics from GitHub API and stores it in browser local storage</p>
          <p className="mt-1"><strong>Export Metrics to JSON:</strong> Downloads the metrics data as a JSON file to your computer</p>
        </div>
      </div>

      {/* Agents Actions */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-xl font-semibold text-white mb-4">Copilot Agents Actions</h2>
        
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleDownloadAgents}
            disabled={loading || !config.org || !config.token}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-medium rounded-lg transition-colors"
          >
            <Save className="w-5 h-5" />
            {loading ? 'Downloading...' : 'Download Agents Data'}
          </button>
        </div>

        <div className="mt-4 text-sm text-slate-400">
          <p><strong>Download Agents Data:</strong> Fetches Copilot Agents metrics from GitHub API and stores it locally</p>
          <p className="mt-1">This includes agent usage, engagement, and adoption metrics across your enterprise</p>
        </div>
      </div>

      {/* Clear Data Actions */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-xl font-semibold text-white mb-4">Data Management</h2>
        
        <div className="flex flex-wrap gap-3">{(dataStats || agentsStats) && (
            <button
              onClick={handleClearData}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-medium rounded-lg transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              Clear All Local Data
            </button>
          )}
        </div>

        <div className="mt-4 text-sm text-slate-400">
          <p><strong>Clear All Local Data:</strong> Removes all saved metrics and agents data from browser local storage</p>
        </div>
      </div>

      {/* Metrics Result Message */}
      {result && (
        <div className={`rounded-lg p-4 border ${
          result.success
            ? 'bg-green-500 bg-opacity-10 border-green-500'
            : 'bg-red-500 bg-opacity-10 border-red-500'
        }`}>
          <div className="flex items-start gap-3">
            {result.success ? (
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
            )}
            <div className="flex-1">
              <h3 className={`text-sm font-semibold mb-1 ${
                result.success ? 'text-green-400' : 'text-red-400'
              }`}>
                {result.success ? 'Success' : 'Error'}
              </h3>
              <p className="text-sm text-slate-300">{result.message}</p>
              {result.recordCount && (
                <p className="text-sm text-slate-300 mt-1">
                  Records downloaded: <strong>{result.recordCount}</strong>
                </p>
              )}
              {result.dateRange && (
                <p className="text-sm text-slate-300">
                  Date range: <strong>{result.dateRange.from}</strong> to <strong>{result.dateRange.to}</strong>
                </p>
              )}
              {result.error && (
                <p className="text-xs text-slate-400 mt-2 font-mono">{result.error}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Agents Result Message */}
      {agentsResult && (
        <div className={`rounded-lg p-4 border ${
          agentsResult.success
            ? 'bg-purple-500 bg-opacity-10 border-purple-500'
            : 'bg-red-500 bg-opacity-10 border-red-500'
        }`}>
          <div className="flex items-start gap-3">
            {agentsResult.success ? (
              <CheckCircle className="w-5 h-5 text-purple-400 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
            )}
            <div className="flex-1">
              <h3 className={`text-sm font-semibold mb-1 ${
                agentsResult.success ? 'text-purple-400' : 'text-red-400'
              }`}>
                {agentsResult.success ? 'Agents Data Success' : 'Agents Data Error'}
              </h3>
              <p className="text-sm text-slate-300">{agentsResult.message}</p>
              {agentsResult.recordCount && (
                <p className="text-sm text-slate-300 mt-1">
                  Records downloaded: <strong>{agentsResult.recordCount}</strong>
                </p>
              )}
              {agentsResult.dateRange && (
                <p className="text-sm text-slate-300">
                  Date range: <strong>{agentsResult.dateRange.from}</strong> to <strong>{agentsResult.dateRange.to}</strong>
                </p>
              )}
              {agentsResult.error && (
                <p className="text-xs text-slate-400 mt-2 font-mono">{agentsResult.error}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Documentation */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-xl font-semibold text-white mb-4">API Documentation</h2>
        
        <div className="space-y-4">
          {/* Metrics API */}
          <div className="space-y-3 text-sm text-slate-300">
            <h3 className="text-lg font-semibold text-white">Copilot Metrics API</h3>
            <p>
              <strong>Endpoint:</strong>{' '}
              <code className="bg-slate-900 px-2 py-1 rounded text-blue-400">
                GET /enterprises/{'{enterprise}'}/copilot/metrics
              </code>
            </p>
            
            <div>
              <p className="font-semibold mb-2">Requirements:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Enterprise must have 5+ members with active Copilot licenses</li>
                <li>Copilot Metrics API access policy must be enabled</li>
                <li>Only enterprise owners can access this endpoint</li>
                <li>Maximum of 100 days of historical data available</li>
              </ul>
            </div>
          </div>

          {/* Agents API */}
          <div className="space-y-3 text-sm text-slate-300 pt-4 border-t border-slate-700">
            <h3 className="text-lg font-semibold text-white">Copilot Agents API</h3>
            <p>
              <strong>Endpoint:</strong>{' '}
              <code className="bg-slate-900 px-2 py-1 rounded text-purple-400">
                GET /enterprises/{'{enterprise}'}/copilot/agents
              </code>
            </p>
            
            <div>
              <p className="font-semibold mb-2">What It Provides:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Agent usage metrics across the enterprise</li>
                <li>Individual agent engagement statistics</li>
                <li>Chat interactions with agents</li>
                <li>Code insertion and copy events from agent suggestions</li>
                <li>Agent adoption trends over time</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold mb-2">Requirements:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Same authentication requirements as Metrics API</li>
                <li>Copilot Agents must be enabled for the enterprise</li>
                <li>Note: This endpoint may be in beta or limited availability</li>
              </ul>
            </div>
          </div>

          {/* Token Permissions */}
          <div className="pt-4 border-t border-slate-700">
            <p className="font-semibold mb-2">Token Permissions (Both APIs):</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><code className="bg-slate-900 px-1 rounded">manage_billing:copilot</code></li>
              <li><code className="bg-slate-900 px-1 rounded">read:org</code></li>
              <li><code className="bg-slate-900 px-1 rounded">read:enterprise</code></li>
            </ul>
          </div>

          <p className="pt-2">
            <a
              href="https://docs.github.com/en/rest/copilot/copilot-metrics"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              View full API documentation →
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Admin
