import { useState, useEffect } from 'react'
import { Save, Trash2, Settings, AlertCircle, CheckCircle, Info } from 'lucide-react'
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
  const [enterpriseMetricsResult, setEnterpriseMetricsResult] = useState<DownloadResult | null>(null)
  const [enterpriseSeatsResult, setEnterpriseSeatsResult] = useState<DownloadResult | null>(null)
  const [orgMetricsResult, setOrgMetricsResult] = useState<DownloadResult | null>(null)
  const [orgSeatsResult, setOrgSeatsResult] = useState<DownloadResult | null>(null)
  const [dataStats, setDataStats] = useState<ReturnType<typeof githubApiService.getDataStats>>(null)
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
    setLastSaved(githubApiService.getLastSavedTimestamp())
  }

  const handleInputChange = (field: keyof APIConfig, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }))
    // Clear validation errors when user makes changes
    setValidationErrors([])
  }

  const handleDownloadEnterpriseMetrics = async () => {
    // Validate configuration
    const validation = validateApiConfig(config)
    if (!validation.valid) {
      setValidationErrors(validation.errors)
      setEnterpriseMetricsResult({
        success: false,
        message: 'Please fix validation errors before proceeding',
      })
      return
    }

    setLoading(true)
    setEnterpriseMetricsResult(null)
    setValidationErrors([])

    const downloadResult = await githubApiService.downloadAndSave(config)
    setEnterpriseMetricsResult(downloadResult)
    setLoading(false)

    if (downloadResult.success) {
      saveApiConfig(config)
      updateDataStats()
    }
  }

  const handleDownloadEnterpriseSeats = async () => {
    // Validate configuration
    const validation = validateApiConfig(config)
    if (!validation.valid) {
      setValidationErrors(validation.errors)
      setEnterpriseSeatsResult({
        success: false,
        message: 'Please fix validation errors before proceeding',
      })
      return
    }

    setLoading(true)
    setEnterpriseSeatsResult(null)
    setValidationErrors([])

    const downloadResult = await githubApiService.downloadAndSave(config)
    setEnterpriseSeatsResult(downloadResult)
    setLoading(false)

    if (downloadResult.success) {
      saveApiConfig(config)
      updateDataStats()
    }
  }

  const handleDownloadOrgMetrics = async () => {
    // Validate configuration
    const validation = validateApiConfig(config)
    if (!validation.valid) {
      setValidationErrors(validation.errors)
      setOrgMetricsResult({
        success: false,
        message: 'Please fix validation errors before proceeding',
      })
      return
    }

    setLoading(true)
    setOrgMetricsResult(null)
    setValidationErrors([])

    const downloadResult = await githubApiService.downloadAndSave(config)
    setOrgMetricsResult(downloadResult)
    setLoading(false)

    if (downloadResult.success) {
      saveApiConfig(config)
      updateDataStats()
    }
  }

  const handleDownloadOrgSeats = async () => {
    // Validate configuration
    const validation = validateApiConfig(config)
    if (!validation.valid) {
      setValidationErrors(validation.errors)
      setOrgSeatsResult({
        success: false,
        message: 'Please fix validation errors before proceeding',
      })
      return
    }

    setLoading(true)
    setOrgSeatsResult(null)
    setValidationErrors([])

    const downloadResult = await githubApiService.downloadAndSave(config)
    setOrgSeatsResult(downloadResult)
    setLoading(false)

    if (downloadResult.success) {
      saveApiConfig(config)
      updateDataStats()
    }
  }

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all saved metrics data?')) {
      githubApiService.clearLocalStorage()
      updateDataStats()
      setEnterpriseMetricsResult({
        success: true,
        message: 'Local data cleared successfully',
      })
      setEnterpriseSeatsResult(null)
      setOrgMetricsResult(null)
      setOrgSeatsResult(null)
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
        <h2 className="text-xl font-semibold text-white mb-4">Enterprise Copilot Data</h2>
        
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleDownloadEnterpriseMetrics}
            disabled={loading || !config.org || !config.token}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-medium rounded-lg transition-colors"
          >
            <Save className="w-5 h-5" />
            {loading ? 'Downloading...' : 'Download Metrics'}
          </button>

          <button
            onClick={handleDownloadEnterpriseSeats}
            disabled={loading || !config.org || !config.token}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-medium rounded-lg transition-colors"
          >
            <Save className="w-5 h-5" />
            {loading ? 'Downloading...' : 'Download Seats'}
          </button>
        </div>

        <div className="mt-4 text-sm text-slate-400">
          <p><strong>Download Metrics:</strong> Fetches enterprise-level Copilot usage metrics and performance data</p>
          <p className="mt-1"><strong>Download Seats:</strong> Fetches individual seat-level data including per-user usage and productivity stats</p>
        </div>
      </div>

      {/* Organization Metrics */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-xl font-semibold text-white mb-4">Organization Copilot Data</h2>
        
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleDownloadOrgMetrics}
            disabled={loading || !config.org || !config.token}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-medium rounded-lg transition-colors"
          >
            <Save className="w-5 h-5" />
            {loading ? 'Downloading...' : 'Download Metrics'}
          </button>

          <button
            onClick={handleDownloadOrgSeats}
            disabled={loading || !config.org || !config.token}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-medium rounded-lg transition-colors"
          >
            <Save className="w-5 h-5" />
            {loading ? 'Downloading...' : 'Download Seats'}
          </button>
        </div>

        <div className="mt-4 text-sm text-slate-400">
          <p><strong>Download Metrics:</strong> Fetches organization-specific Copilot metrics (filtered by organization/team)</p>
          <p className="mt-1"><strong>Download Seats:</strong> Fetches seat-level data for the organization, with optional team filtering</p>
        </div>
      </div>

      {/* Clear Data Actions */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-xl font-semibold text-white mb-4">Data Management</h2>
        
        <div className="flex flex-wrap gap-3">
          {dataStats && (
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
          <p><strong>Clear All Local Data:</strong> Removes all saved metrics data from browser local storage</p>
        </div>
      </div>

      {/* Enterprise Metrics Result Message */}
      {enterpriseMetricsResult && (
        <div className={`rounded-lg p-4 border ${
          enterpriseMetricsResult.success
            ? 'bg-blue-500 bg-opacity-10 border-blue-500'
            : 'bg-red-500 bg-opacity-10 border-red-500'
        }`}>
          <div className="flex items-start gap-3">
            {enterpriseMetricsResult.success ? (
              <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
            )}
            <div className="flex-1">
              <h3 className={`text-sm font-semibold mb-1 ${
                enterpriseMetricsResult.success ? 'text-blue-400' : 'text-red-400'
              }`}>
                {enterpriseMetricsResult.success ? 'Enterprise Metrics Success' : 'Enterprise Metrics Error'}
              </h3>
              <p className="text-sm text-slate-300">{enterpriseMetricsResult.message}</p>
              {enterpriseMetricsResult.recordCount && (
                <p className="text-sm text-slate-300 mt-1">
                  Records downloaded: <strong>{enterpriseMetricsResult.recordCount}</strong>
                </p>
              )}
              {enterpriseMetricsResult.dateRange && (
                <p className="text-sm text-slate-300">
                  Date range: <strong>{enterpriseMetricsResult.dateRange.from}</strong> to <strong>{enterpriseMetricsResult.dateRange.to}</strong>
                </p>
              )}
              {enterpriseMetricsResult.error && (
                <p className="text-xs text-slate-400 mt-2 font-mono">{enterpriseMetricsResult.error}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Enterprise Seats Result Message */}
      {enterpriseSeatsResult && (
        <div className={`rounded-lg p-4 border ${
          enterpriseSeatsResult.success
            ? 'bg-blue-500 bg-opacity-10 border-blue-500'
            : 'bg-red-500 bg-opacity-10 border-red-500'
        }`}>
          <div className="flex items-start gap-3">
            {enterpriseSeatsResult.success ? (
              <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
            )}
            <div className="flex-1">
              <h3 className={`text-sm font-semibold mb-1 ${
                enterpriseSeatsResult.success ? 'text-blue-400' : 'text-red-400'
              }`}>
                {enterpriseSeatsResult.success ? 'Enterprise Seats Success' : 'Enterprise Seats Error'}
              </h3>
              <p className="text-sm text-slate-300">{enterpriseSeatsResult.message}</p>
              {enterpriseSeatsResult.recordCount && (
                <p className="text-sm text-slate-300 mt-1">
                  Records downloaded: <strong>{enterpriseSeatsResult.recordCount}</strong>
                </p>
              )}
              {enterpriseSeatsResult.dateRange && (
                <p className="text-sm text-slate-300">
                  Date range: <strong>{enterpriseSeatsResult.dateRange.from}</strong> to <strong>{enterpriseSeatsResult.dateRange.to}</strong>
                </p>
              )}
              {enterpriseSeatsResult.error && (
                <p className="text-xs text-slate-400 mt-2 font-mono">{enterpriseSeatsResult.error}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Organization Metrics Result Message */}
      {orgMetricsResult && (
        <div className={`rounded-lg p-4 border ${
          orgMetricsResult.success
            ? 'bg-green-500 bg-opacity-10 border-green-500'
            : 'bg-red-500 bg-opacity-10 border-red-500'
        }`}>
          <div className="flex items-start gap-3">
            {orgMetricsResult.success ? (
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
            )}
            <div className="flex-1">
              <h3 className={`text-sm font-semibold mb-1 ${
                orgMetricsResult.success ? 'text-green-400' : 'text-red-400'
              }`}>
                {orgMetricsResult.success ? 'Organization Metrics Success' : 'Organization Metrics Error'}
              </h3>
              <p className="text-sm text-slate-300">{orgMetricsResult.message}</p>
              {orgMetricsResult.recordCount && (
                <p className="text-sm text-slate-300 mt-1">
                  Records downloaded: <strong>{orgMetricsResult.recordCount}</strong>
                </p>
              )}
              {orgMetricsResult.dateRange && (
                <p className="text-sm text-slate-300">
                  Date range: <strong>{orgMetricsResult.dateRange.from}</strong> to <strong>{orgMetricsResult.dateRange.to}</strong>
                </p>
              )}
              {orgMetricsResult.error && (
                <p className="text-xs text-slate-400 mt-2 font-mono">{orgMetricsResult.error}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Organization Seats Result Message */}
      {orgSeatsResult && (
        <div className={`rounded-lg p-4 border ${
          orgSeatsResult.success
            ? 'bg-green-500 bg-opacity-10 border-green-500'
            : 'bg-red-500 bg-opacity-10 border-red-500'
        }`}>
          <div className="flex items-start gap-3">
            {orgSeatsResult.success ? (
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
            )}
            <div className="flex-1">
              <h3 className={`text-sm font-semibold mb-1 ${
                orgSeatsResult.success ? 'text-green-400' : 'text-red-400'
              }`}>
                {orgSeatsResult.success ? 'Organization Seats Success' : 'Organization Seats Error'}
              </h3>
              <p className="text-sm text-slate-300">{orgSeatsResult.message}</p>
              {orgSeatsResult.recordCount && (
                <p className="text-sm text-slate-300 mt-1">
                  Records downloaded: <strong>{orgSeatsResult.recordCount}</strong>
                </p>
              )}
              {orgSeatsResult.dateRange && (
                <p className="text-sm text-slate-300">
                  Date range: <strong>{orgSeatsResult.dateRange.from}</strong> to <strong>{orgSeatsResult.dateRange.to}</strong>
                </p>
              )}
              {orgSeatsResult.error && (
                <p className="text-xs text-slate-400 mt-2 font-mono">{orgSeatsResult.error}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Documentation */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-xl font-semibold text-white mb-4">API Documentation</h2>
        
        <div className="space-y-4">
          {/* Enterprise Section */}
          <div className="space-y-3 text-sm text-slate-300">
            <h3 className="text-lg font-semibold text-white">Enterprise Level</h3>
            
            <div className="ml-4 space-y-3">
              <div>
                <p className="font-semibold text-blue-400">Enterprise Metrics</p>
                <p>
                  <strong>Endpoint:</strong>{' '}
                  <code className="bg-slate-900 px-2 py-1 rounded text-blue-400">
                    GET /enterprises/{'{enterprise}'}/copilot/metrics
                  </code>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2 mt-1">
                  <li>Enterprise-wide usage and adoption trends</li>
                  <li>Aggregate acceptance rates and performance metrics</li>
                  <li>Overall code suggestions and completions</li>
                  <li>Active user counts and engagement statistics</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-blue-400">Enterprise Seats</p>
                <p>
                  <strong>Endpoint:</strong>{' '}
                  <code className="bg-slate-900 px-2 py-1 rounded text-blue-400">
                    GET /enterprises/{'{enterprise}'}/copilot/billing/seats
                  </code>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2 mt-1">
                  <li>Lists all Copilot seat assignments across the enterprise</li>
                  <li>Seat assignments from multiple organizations or enterprise teams</li>
                  <li>Individual user activity and telemetry data</li>
                  <li>Seat status (active, pending cancellation)</li>
                  <li>Last activity editor and authentication timestamps</li>
                  <li>Users counted once even with multiple organization access</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Organization Section */}
          <div className="space-y-3 text-sm text-slate-300 pt-4 border-t border-slate-700">
            <h3 className="text-lg font-semibold text-white">Organization Level</h3>
            
            <div className="ml-4 space-y-3">
              <div>
                <p className="font-semibold text-green-400">Organization Metrics</p>
                <p>
                  <strong>Endpoint:</strong>{' '}
                  <code className="bg-slate-900 px-2 py-1 rounded text-green-400">
                    GET /orgs/{'{org}'}/copilot/metrics
                  </code>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2 mt-1">
                  <li>Organization-level Copilot usage metrics</li>
                  <li>Team-specific data when team_slug parameter is provided</li>
                  <li>Organization-scoped acceptance rates and performance</li>
                  <li>Usage patterns filtered by organization</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-green-400">Organization Seats</p>
                <p>
                  <strong>Endpoint:</strong>{' '}
                  <code className="bg-slate-900 px-2 py-1 rounded text-green-400">
                    GET /orgs/{'{org}'}/copilot/billing/seats
                  </code>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2 mt-1">
                  <li>Lists all Copilot seat assignments for the organization</li>
                  <li>Per-user seat details including activity and status</li>
                  <li>Most recent Copilot activity per assigned user</li>
                  <li>Seat creation, update, and cancellation dates</li>
                  <li>Assigning team information for each seat</li>
                  <li>Supports pagination (page, per_page parameters)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* General Requirements */}
          <div className="pt-4 border-t border-slate-700">
            <p className="font-semibold mb-2">Requirements (All APIs):</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Enterprise must have 5+ members with active Copilot licenses</li>
              <li>Copilot Metrics API access policy must be enabled</li>
              <li>Only enterprise/organization owners can access these endpoints</li>
              <li>Maximum of 100 days of historical data available</li>
            </ul>
          </div>

          {/* Token Permissions */}
          <div className="pt-4 border-t border-slate-700">
            <p className="font-semibold mb-2">Token Permissions:</p>
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
