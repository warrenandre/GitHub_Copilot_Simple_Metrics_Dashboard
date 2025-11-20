import { useState, useEffect } from 'react'
import { Save, Trash2, Settings, AlertCircle, CheckCircle, Info } from 'lucide-react'
import { githubApiService } from '../services/githubApi'
import { loadApiConfig, saveApiConfig, validateApiConfig } from '../config/apiConfig'
import { APIConfig, DownloadResult } from '../types/metrics'

const Admin = () => {
  // Check if demo mode is enabled
  const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true'
  
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
  const [enterprise28DayReportResult, setEnterprise28DayReportResult] = useState<DownloadResult | null>(null)
  const [user28DayReportResult, setUser28DayReportResult] = useState<DownloadResult | null>(null)
  const [orgMetricsResult, setOrgMetricsResult] = useState<DownloadResult | null>(null)
  const [orgSeatsResult, setOrgSeatsResult] = useState<DownloadResult | null>(null)
  const [prMetricsResult, setPrMetricsResult] = useState<DownloadResult | null>(null)
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

    const downloadResult = await githubApiService.downloadAndSave(config, 'metrics', 'enterprise')
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

    const downloadResult = await githubApiService.downloadAndSave(config, 'seats', 'enterprise')
    setEnterpriseSeatsResult(downloadResult)
    setLoading(false)

    if (downloadResult.success) {
      saveApiConfig(config)
      updateDataStats()
    }
  }

  const handleDownload28DayReport = async () => {
    // Validate configuration
    const validation = validateApiConfig(config)
    if (!validation.valid) {
      setValidationErrors(validation.errors)
      setEnterprise28DayReportResult({
        success: false,
        message: 'Please fix validation errors before proceeding',
      })
      return
    }

    setLoading(true)
    setEnterprise28DayReportResult(null)
    setValidationErrors([])

    const downloadResult = await githubApiService.download28DayReport(config)
    setEnterprise28DayReportResult(downloadResult)
    setLoading(false)

    if (downloadResult.success) {
      saveApiConfig(config)
      updateDataStats()
    }
  }

  const handleDownloadUser28DayReport = async () => {
    // Validate configuration
    const validation = validateApiConfig(config)
    if (!validation.valid) {
      setValidationErrors(validation.errors)
      setUser28DayReportResult({
        success: false,
        message: 'Please fix validation errors before proceeding',
      })
      return
    }

    setLoading(true)
    setUser28DayReportResult(null)
    setValidationErrors([])

    const downloadResult = await githubApiService.downloadUser28DayReport(config)
    setUser28DayReportResult(downloadResult)
    setLoading(false)

    if (downloadResult.success) {
      saveApiConfig(config)
      updateDataStats()
    }
  }

  const handleUpload28DayReport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const jsonData = JSON.parse(content)
        
        // Check if it's wrapped in metadata or raw data
        const reportData = jsonData.data || jsonData
        
        // Validate it has the expected structure
        if (!reportData.day_totals || !Array.isArray(reportData.day_totals)) {
          setEnterprise28DayReportResult({
            success: false,
            message: 'Invalid file format. Expected a 28-day report with day_totals array.',
          })
          return
        }

        // Save to localStorage
        const storageKey = 'enterprise_report_data'
        localStorage.setItem(storageKey, JSON.stringify(reportData))
        localStorage.setItem(`${storageKey}_timestamp`, new Date().toISOString())

        setEnterprise28DayReportResult({
          success: true,
          message: `28-day report uploaded successfully (${reportData.day_totals.length} days of data)`,
          recordCount: reportData.day_totals.length,
          dateRange: {
            from: reportData.report_start_day || 'unknown',
            to: reportData.report_end_day || 'unknown',
          }
        })
        
        updateDataStats()
      } catch (error) {
        setEnterprise28DayReportResult({
          success: false,
          message: error instanceof Error ? error.message : 'Failed to parse uploaded file',
          error: error instanceof Error ? error.message : String(error),
        })
      }
    }
    reader.readAsText(file)
  }

  const handleUploadUser28DayReport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        
        // Parse NDJSON format (newline-delimited JSON)
        const lines = content.trim().split('\n')
        const userDayRecords = lines.map((line, index) => {
          try {
            return JSON.parse(line)
          } catch (err) {
            throw new Error(`Failed to parse line ${index + 1}: ${err instanceof Error ? err.message : String(err)}`)
          }
        })
        
        // Validate format - each line should have user_id, day, and user_login
        if (userDayRecords.length === 0 || !userDayRecords[0].user_id || !userDayRecords[0].day) {
          setUser28DayReportResult({
            success: false,
            message: 'Invalid file format. Expected NDJSON with user activity records (each line is a JSON object).',
          })
          return
        }

        // Extract metadata from first record
        const firstRecord = userDayRecords[0]
        const reportData = {
          report_start_day: firstRecord.report_start_day,
          report_end_day: firstRecord.report_end_day,
          enterprise_id: firstRecord.enterprise_id,
          records: userDayRecords
        }

        // Get unique users
        const uniqueUsers = new Set(userDayRecords.map(r => r.user_login))

        // Save to localStorage
        const storageKey = 'user_report_data'
        localStorage.setItem(storageKey, JSON.stringify(reportData))
        localStorage.setItem(`${storageKey}_timestamp`, new Date().toISOString())

        setUser28DayReportResult({
          success: true,
          message: `User 28-day report uploaded successfully (${userDayRecords.length} records, ${uniqueUsers.size} unique users)`,
          recordCount: userDayRecords.length,
          dateRange: {
            from: reportData.report_start_day || 'unknown',
            to: reportData.report_end_day || 'unknown',
          }
        })
        
        updateDataStats()
      } catch (error) {
        setUser28DayReportResult({
          success: false,
          message: error instanceof Error ? error.message : 'Failed to parse uploaded file',
          error: error instanceof Error ? error.message : String(error),
        })
      }
    }
    reader.readAsText(file)
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

    const downloadResult = await githubApiService.downloadAndSave(config, 'metrics', 'organization')
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

    const downloadResult = await githubApiService.downloadAndSave(config, 'seats', 'organization')
    setOrgSeatsResult(downloadResult)
    setLoading(false)

    if (downloadResult.success) {
      saveApiConfig(config)
      updateDataStats()
    }
  }

  const handleDownloadPRMetrics = async () => {
    // Validate configuration
    const validation = validateApiConfig(config)
    if (!validation.valid) {
      setValidationErrors(validation.errors)
      setPrMetricsResult({
        success: false,
        message: 'Please fix validation errors before proceeding',
      })
      return
    }

    setLoading(true)
    setPrMetricsResult(null)
    setValidationErrors([])

    try {
      // Fetch enterprise metrics which includes PR data
      const data = await githubApiService.fetchFromGitHub(config, 'enterprise')
      
      if (!data || data.length === 0) {
        setPrMetricsResult({
          success: false,
          message: 'No data returned from GitHub API',
        })
        setLoading(false)
        return
      }

      // Extract PR metrics data
      const prData = data.map(day => ({
        date: day.date,
        total_active_users: day.total_active_users,
        total_engaged_users: day.total_engaged_users,
        copilot_dotcom_pull_requests: day.copilot_dotcom_pull_requests
      })).filter(day => day.copilot_dotcom_pull_requests)

      // Calculate stats
      const totalPRDays = prData.length
      const totalPRUsers = prData.reduce((max, day) => 
        Math.max(max, day.copilot_dotcom_pull_requests?.total_engaged_users || 0), 0
      )

      // Save to localStorage with a specific key for PR metrics
      const prStorageKey = 'copilot_pr_metrics_data'
      localStorage.setItem(prStorageKey, JSON.stringify(prData))
      localStorage.setItem(`${prStorageKey}_timestamp`, new Date().toISOString())

      // Also save to the main enterprise metrics storage (for compatibility)
      githubApiService.saveToLocalStorage(data, 'enterprise')
      saveApiConfig(config)

      setPrMetricsResult({
        success: true,
        message: 'PR metrics data downloaded and saved successfully',
        recordCount: totalPRDays,
        dateRange: {
          from: prData[0]?.date || 'unknown',
          to: prData[prData.length - 1]?.date || 'unknown',
        }
      })

      updateDataStats()
    } catch (error) {
      console.error('PR metrics download error:', error)
      setPrMetricsResult({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        error: error instanceof Error ? error.message : String(error),
      })
    } finally {
      setLoading(false)
    }
  }

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all saved metrics data?')) {
      githubApiService.clearLocalStorage()
      // Also clear PR metrics
      localStorage.removeItem('copilot_pr_metrics_data')
      localStorage.removeItem('copilot_pr_metrics_data_timestamp')
      updateDataStats()
      setEnterpriseMetricsResult({
        success: true,
        message: 'Local data cleared successfully',
      })
      setEnterpriseSeatsResult(null)
      setEnterprise28DayReportResult(null)
      setUser28DayReportResult(null)
      setOrgMetricsResult(null)
      setOrgSeatsResult(null)
      setPrMetricsResult(null)
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
          {isDemoMode && (
            <span className="px-3 py-1 bg-yellow-500 bg-opacity-20 text-yellow-400 text-xs font-semibold rounded-full flex items-center gap-1.5">
              <Info className="w-3 h-3" />
              DEMO MODE
            </span>
          )}
        </div>
        <p className="text-slate-400">
          {isDemoMode 
            ? 'Viewing in demo mode - all controls are disabled'
            : 'Configure and download GitHub Copilot metrics data'}
        </p>
      </div>

      {/* Current Data Status */}
      {dataStats && (
        <div className="bg-blue-500 bg-opacity-10 border border-blue-500 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-400 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-blue-400 mb-2">Local Data Available</h3>
              
              {dataStats.enterprise && (
                <div className="mb-2">
                  <p className="text-sm text-slate-300">
                    <strong>Enterprise:</strong> {dataStats.enterprise.count} days of metrics
                  </p>
                  <p className="text-xs text-slate-400">
                    Date range: {dataStats.enterprise.dateRange.from} to {dataStats.enterprise.dateRange.to}
                  </p>
                </div>
              )}
              
              {dataStats.organization && (
                <div className="mb-2">
                  <p className="text-sm text-slate-300">
                    <strong>Organization:</strong> {dataStats.organization.count} days of metrics
                  </p>
                  <p className="text-xs text-slate-400">
                    Date range: {dataStats.organization.dateRange.from} to {dataStats.organization.dateRange.to}
                  </p>
                </div>
              )}
              
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
              disabled={isDemoMode}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
              disabled={isDemoMode}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
              disabled={isDemoMode}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
                disabled={isDemoMode}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
                disabled={isDemoMode}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
            disabled={isDemoMode || loading || !config.org || !config.token}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-medium rounded-lg transition-colors"
          >
            <Save className="w-5 h-5" />
            {loading ? 'Downloading...' : 'Download Metrics'}
          </button>

          <button
            onClick={handleDownloadEnterpriseSeats}
            disabled={isDemoMode || loading || !config.org || !config.token}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-medium rounded-lg transition-colors"
          >
            <Save className="w-5 h-5" />
            {loading ? 'Downloading...' : 'Download Seats'}
          </button>

          <button
            onClick={handleDownloadPRMetrics}
            disabled={isDemoMode || loading || !config.org || !config.token}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-medium rounded-lg transition-colors"
          >
            <Save className="w-5 h-5" />
            {loading ? 'Downloading...' : 'Download PR Metrics'}
          </button>
        </div>

        <div className="mt-4 text-sm text-slate-400">
          <p><strong>Download Metrics:</strong> Fetches enterprise-level Copilot usage metrics and performance data</p>
          <p className="mt-1"><strong>Download Seats:</strong> Fetches individual seat-level data including per-user usage and productivity stats</p>
          <p className="mt-1"><strong>Download PR Metrics:</strong> Fetches PR review engagement metrics from the Copilot API for visualization on the PR Reviews page</p>
        </div>
      </div>

      {/* Enterprise 28-Day Report */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-xl font-semibold text-white mb-4">Enterprise 28-Day Report</h2>
        
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleDownload28DayReport}
            disabled={isDemoMode || loading || !config.org || !config.token}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-medium rounded-lg transition-colors"
          >
            <Save className="w-5 h-5" />
            {loading ? 'Downloading...' : 'Get Download Link'}
          </button>
          
          <label className={`flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors ${isDemoMode ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
            <Save className="w-5 h-5" />
            Upload Report File
            <input
              type="file"
              accept=".json"
              onChange={handleUpload28DayReport}
              disabled={isDemoMode}
              className="hidden"
            />
          </label>
        </div>

        <div className="mt-4 text-sm text-slate-400">
          <p><strong>Get Download Link:</strong> Fetches the download URL for the 28-day report. Due to CORS restrictions, the file will open in a new tab.</p>
          <p className="mt-1"><strong>Upload Report File:</strong> After downloading the JSON file from the link, upload it here to visualize the data.</p>
          <p className="mt-1 text-xs">Data is stored in <code className="bg-slate-900 px-1 rounded">enterprise_report_data</code> for visualization</p>
        </div>
      </div>

      {/* User 28-Day Report */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-xl font-semibold text-white mb-4">User 28-Day Report</h2>
        
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleDownloadUser28DayReport}
            disabled={isDemoMode || loading || !config.org || !config.token}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-medium rounded-lg transition-colors"
          >
            <Save className="w-5 h-5" />
            {loading ? 'Downloading...' : 'Get Download Link'}
          </button>
          
          <label className={`flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors ${isDemoMode ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
            <Save className="w-5 h-5" />
            Upload Report File
            <input
              type="file"
              accept=".json"
              onChange={handleUploadUser28DayReport}
              disabled={isDemoMode}
              className="hidden"
            />
          </label>
        </div>

        <div className="mt-4 text-sm text-slate-400">
          <p><strong>Get Download Link:</strong> Fetches the download URL for the user 28-day report. Due to CORS restrictions, the file will open in a new tab.</p>
          <p className="mt-1"><strong>Upload Report File:</strong> After downloading the JSON file from the link, upload it here to visualize the data.</p>
          <p className="mt-1 text-xs">Data is stored in <code className="bg-slate-900 px-1 rounded">user_report_data</code> for visualization</p>
        </div>
      </div>

      {/* Organization Metrics */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-xl font-semibold text-white mb-4">Organization Copilot Data</h2>
        
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleDownloadOrgMetrics}
            disabled={isDemoMode || loading || !config.org || !config.token}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-medium rounded-lg transition-colors"
          >
            <Save className="w-5 h-5" />
            {loading ? 'Downloading...' : 'Download Metrics'}
          </button>

          <button
            onClick={handleDownloadOrgSeats}
            disabled={isDemoMode || loading || !config.org || !config.token}
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
          <button
            onClick={handleClearData}
            disabled={isDemoMode || loading}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-medium rounded-lg transition-colors"
          >
            <Trash2 className="w-5 h-5" />
            Clear All Local Data
          </button>
        </div>

        <div className="mt-4 text-sm text-slate-400">
          <p><strong>Clear All Local Data:</strong> Removes all saved metrics and seats data from browser local storage</p>
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

      {/* PR Metrics Result Message */}
      {prMetricsResult && (
        <div className={`rounded-lg p-4 border ${
          prMetricsResult.success
            ? 'bg-green-500 bg-opacity-10 border-green-500'
            : 'bg-red-500 bg-opacity-10 border-red-500'
        }`}>
          <div className="flex items-start gap-3">
            {prMetricsResult.success ? (
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
            )}
            <div className="flex-1">
              <h3 className={`text-sm font-semibold mb-1 ${
                prMetricsResult.success ? 'text-green-400' : 'text-red-400'
              }`}>
                {prMetricsResult.success ? 'PR Metrics Success' : 'PR Metrics Error'}
              </h3>
              <p className="text-sm text-slate-300">{prMetricsResult.message}</p>
              {prMetricsResult.recordCount && (
                <p className="text-sm text-slate-300 mt-1">
                  Days with PR data: <strong>{prMetricsResult.recordCount}</strong>
                </p>
              )}
              {prMetricsResult.dateRange && (
                <p className="text-sm text-slate-300">
                  Date range: <strong>{prMetricsResult.dateRange.from}</strong> to <strong>{prMetricsResult.dateRange.to}</strong>
                </p>
              )}
              {prMetricsResult.error && (
                <p className="text-xs text-slate-400 mt-2 font-mono">{prMetricsResult.error}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Enterprise 28-Day Report Result Message */}
      {enterprise28DayReportResult && (
        <div className={`rounded-lg p-4 border ${
          enterprise28DayReportResult.success
            ? 'bg-purple-500 bg-opacity-10 border-purple-500'
            : 'bg-red-500 bg-opacity-10 border-red-500'
        }`}>
          <div className="flex items-start gap-3">
            {enterprise28DayReportResult.success ? (
              <CheckCircle className="w-5 h-5 text-purple-400 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
            )}
            <div className="flex-1">
              <h3 className={`text-sm font-semibold mb-1 ${
                enterprise28DayReportResult.success ? 'text-purple-400' : 'text-red-400'
              }`}>
                {enterprise28DayReportResult.success ? '28-Day Report Success' : '28-Day Report Error'}
              </h3>
              <p className="text-sm text-slate-300">{enterprise28DayReportResult.message}</p>
              {enterprise28DayReportResult.recordCount && (
                <p className="text-sm text-slate-300 mt-1">
                  Records downloaded: <strong>{enterprise28DayReportResult.recordCount}</strong>
                </p>
              )}
              {enterprise28DayReportResult.dateRange && (
                <p className="text-sm text-slate-300">
                  Date range: <strong>{enterprise28DayReportResult.dateRange.from}</strong> to <strong>{enterprise28DayReportResult.dateRange.to}</strong>
                </p>
              )}
              {enterprise28DayReportResult.error && (
                <p className="text-xs text-slate-400 mt-2 font-mono">{enterprise28DayReportResult.error}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* User 28-Day Report Result Message */}
      {user28DayReportResult && (
        <div className={`rounded-lg p-4 border ${
          user28DayReportResult.success
            ? 'bg-indigo-500 bg-opacity-10 border-indigo-500'
            : 'bg-red-500 bg-opacity-10 border-red-500'
        }`}>
          <div className="flex items-start gap-3">
            {user28DayReportResult.success ? (
              <CheckCircle className="w-5 h-5 text-indigo-400 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
            )}
            <div className="flex-1">
              <h3 className={`text-sm font-semibold mb-1 ${
                user28DayReportResult.success ? 'text-indigo-400' : 'text-red-400'
              }`}>
                {user28DayReportResult.success ? 'User 28-Day Report Success' : 'User 28-Day Report Error'}
              </h3>
              <p className="text-sm text-slate-300">{user28DayReportResult.message}</p>
              {user28DayReportResult.recordCount && (
                <p className="text-sm text-slate-300 mt-1">
                  Records downloaded: <strong>{user28DayReportResult.recordCount}</strong>
                </p>
              )}
              {user28DayReportResult.dateRange && (
                <p className="text-sm text-slate-300">
                  Date range: <strong>{user28DayReportResult.dateRange.from}</strong> to <strong>{user28DayReportResult.dateRange.to}</strong>
                </p>
              )}
              {user28DayReportResult.error && (
                <p className="text-xs text-slate-400 mt-2 font-mono">{user28DayReportResult.error}</p>
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
