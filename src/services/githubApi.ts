import { GitHubCopilotMetricsResponse, GitHubCopilotAgentsResponse, APIConfig, DownloadResult } from '../types/metrics'

class GitHubCopilotAPIService {
  private readonly baseUrl = 'https://api.github.com'
  private readonly apiVersion = '2022-11-28'
  private readonly localStorageKey = 'copilot_metrics_data'
  private readonly agentsStorageKey = 'copilot_agents_data'
  private readonly configStorageKey = 'copilot_api_config'
  private readonly dataFolderPath = '/data' // Public folder path for storing data files
  private readonly dataFileName = 'copilot-metrics.json'

  /**
   * Fetch metrics from GitHub Copilot Metrics API
   */
  async fetchFromGitHub(config: APIConfig): Promise<GitHubCopilotMetricsResponse> {
    const { org, token, since, until: untilDate, team_slug } = config

    // DEBUG: Log configuration (without exposing full token)
    console.log('🔍 GitHub Copilot API Debug Info:')
    console.log('  Organization:', org)
    console.log('  Token Present:', !!token)
    console.log('  Token Prefix:', token ? token.substring(0, 4) + '...' : 'none')
    console.log('  Date Range:', { since, until: untilDate })
    console.log('  Team Slug:', team_slug || '(org-wide)')

    // Construct endpoint URL
    const endpoint = team_slug
      ? `${this.baseUrl}/enterprises/${org}/team/${team_slug}/copilot/metrics`
      : `${this.baseUrl}/enterprises/${org}/copilot/metrics`

    // Build query parameters
    const params = new URLSearchParams()
    if (since) params.append('since', since)
    if (untilDate) params.append('until', untilDate)

    const url = params.toString() ? `${endpoint}?${params}` : endpoint

    // DEBUG: Log request details
    console.log('📤 Request URL:', url)
    console.log('📤 Request Headers:', {
      Accept: 'application/vnd.github+json',
      Authorization: 'Bearer [REDACTED]',
      'X-GitHub-Api-Version': this.apiVersion,
    })

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/vnd.github+json',
        'Authorization': `Bearer ${token}`,
        'X-GitHub-Api-Version': this.apiVersion,
      },
    })

    // DEBUG: Log response status
    console.log('📥 Response Status:', response.status, response.statusText)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ API Error Response:', errorText)
      console.error('💡 Troubleshooting:')
      
      if (response.status === 401) {
        console.error('   • Check if token is valid and not expired')
        console.error('   • Verify token has required scopes: manage_billing:copilot, read:org, or read:enterprise')
        console.error('   • Token format should be: ghp_xxx or github_pat_xxx')
      } else if (response.status === 404) {
        console.error('   • Verify organization name is correct (case-sensitive)')
        console.error('   • Check if Copilot is enabled for the organization')
        console.error('   • If using team_slug, verify the team exists')
      } else if (response.status === 403) {
        console.error('   • Ensure you are an organization owner or admin')
        console.error('   • Check if API rate limit has been exceeded')
      } else if (response.status === 422) {
        console.error('   • Check date format (must be YYYY-MM-DD)')
        console.error('   • Verify date range is valid (since < until)')
        console.error('   • Dates should be within last 28 days')
      }
      
      throw new Error(`GitHub API error (${response.status}): ${errorText}`)
    }

    const data: GitHubCopilotMetricsResponse = await response.json()
    
    // DEBUG: Log success
    console.log('✅ Data received successfully!')
    console.log('  Records:', data.length)
    if (data.length > 0) {
      console.log('  Date Range:', {
        from: data[0]?.date,
        to: data[data.length - 1]?.date
      })
      console.log('  Sample Record:', data[0])
    }

    return data
  }

  /**
   * Fetch agents metrics from GitHub Copilot Agents API
   */
  async fetchAgentsFromGitHub(config: APIConfig): Promise<GitHubCopilotAgentsResponse> {
    const { org, token, since, until: untilDate } = config

    // DEBUG: Log configuration
    console.log('🔍 GitHub Copilot Agents API Debug Info:')
    console.log('  Enterprise:', org)
    console.log('  Token Present:', !!token)
    console.log('  Token Prefix:', token ? token.substring(0, 4) + '...' : 'none')
    console.log('  Date Range:', { since, until: untilDate })

    // Construct endpoint URL for agents
    const endpoint = `${this.baseUrl}/enterprises/${org}/copilot/agents`

    // Build query parameters
    const params = new URLSearchParams()
    if (since) params.append('since', since)
    if (untilDate) params.append('until', untilDate)

    const url = params.toString() ? `${endpoint}?${params}` : endpoint

    // DEBUG: Log request details
    console.log('📤 Agents Request URL:', url)
    console.log('📤 Request Headers:', {
      Accept: 'application/vnd.github+json',
      Authorization: 'Bearer [REDACTED]',
      'X-GitHub-Api-Version': this.apiVersion,
    })

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/vnd.github+json',
        'Authorization': `Bearer ${token}`,
        'X-GitHub-Api-Version': this.apiVersion,
      },
    })

    // DEBUG: Log response status
    console.log('📥 Agents Response Status:', response.status, response.statusText)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Agents API Error Response:', errorText)
      console.error('💡 Troubleshooting:')
      
      if (response.status === 401) {
        console.error('   • Check if token is valid and not expired')
        console.error('   • Verify token has required scopes: manage_billing:copilot, read:org, or read:enterprise')
      } else if (response.status === 404) {
        console.error('   • Verify enterprise name is correct (case-sensitive)')
        console.error('   • Check if Copilot Agents are enabled for the enterprise')
        console.error('   • This endpoint may not be available yet - it might be in beta')
      } else if (response.status === 403) {
        console.error('   • Ensure you are an enterprise owner or admin')
        console.error('   • Check if API rate limit has been exceeded')
      }
      
      throw new Error(`GitHub Agents API error (${response.status}): ${errorText}`)
    }

    const data: GitHubCopilotAgentsResponse = await response.json()
    
    // DEBUG: Log success
    console.log('✅ Agents data received successfully!')
    console.log('  Records:', data.length)
    if (data.length > 0) {
      console.log('  Date Range:', {
        from: data[0]?.date,
        to: data[data.length - 1]?.date
      })
      console.log('  Sample Record:', data[0])
    }

    return data
  }

  /**
   * Download agents metrics from GitHub and save to local storage and file
   */
  async downloadAndSaveAgents(config: APIConfig): Promise<DownloadResult> {
    try {
      const data = await this.fetchAgentsFromGitHub(config)

      if (!data || data.length === 0) {
        return {
          success: false,
          message: 'No agents data returned from GitHub API',
        }
      }

      // Save to local storage
      this.saveAgentsToLocalStorage(data)

      // Save to local file
      await this.saveAgentsToLocalFile(data, config.org)

      const dateRange = {
        from: data[0]?.date || 'unknown',
        to: data[data.length - 1]?.date || 'unknown',
      }

      return {
        success: true,
        message: 'Agents data downloaded and saved to localStorage and local file',
        recordCount: data.length,
        dateRange,
      }
    } catch (error) {
      console.error('Agents download error:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        error: error instanceof Error ? error.message : String(error),
      }
    }
  }

  /**
   * Save agents data to local storage
   */
  saveAgentsToLocalStorage(data: GitHubCopilotAgentsResponse): void {
    try {
      const jsonStr = JSON.stringify(data)
      localStorage.setItem(this.agentsStorageKey, jsonStr)
      localStorage.setItem(`${this.agentsStorageKey}_timestamp`, new Date().toISOString())
    } catch (error) {
      console.error('Failed to save agents to local storage:', error)
      throw new Error('Failed to save agents data to local storage')
    }
  }

  /**
   * Save agents data to local file in public/data folder
   */
  async saveAgentsToLocalFile(data: GitHubCopilotAgentsResponse, enterpriseName: string): Promise<void> {
    try {
      const timestamp = new Date().toISOString().split('T')[0]
      const filename = `copilot-agents-${enterpriseName}-${timestamp}.json`
      
      const jsonStr = JSON.stringify({
        metadata: {
          enterprise: enterpriseName,
          downloadedAt: new Date().toISOString(),
          recordCount: data.length,
          dateRange: {
            from: data[0]?.date || 'unknown',
            to: data[data.length - 1]?.date || 'unknown',
          }
        },
        data: data
      }, null, 2)

      // Create blob and download
      const blob = new Blob([jsonStr], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      console.log(`Agents data saved to file: ${filename}`)
    } catch (error) {
      console.error('Failed to save agents to local file:', error)
    }
  }

  /**
   * Load agents data from local storage
   */
  loadAgentsFromLocalStorage(): GitHubCopilotAgentsResponse | null {
    try {
      const jsonStr = localStorage.getItem(this.agentsStorageKey)
      if (!jsonStr) return null
      return JSON.parse(jsonStr) as GitHubCopilotAgentsResponse
    } catch (error) {
      console.error('Failed to load agents from local storage:', error)
      return null
    }
  }

  /**
   * Get agents data statistics
   */
  getAgentsDataStats(): { count: number; dateRange: { from: string; to: string }; totalAgents: number } | null {
    const data = this.loadAgentsFromLocalStorage()
    if (!data || data.length === 0) return null

    const totalAgents = data.reduce((sum, day) => sum + (day.agents?.length || 0), 0)

    return {
      count: data.length,
      dateRange: {
        from: data[0]?.date || 'unknown',
        to: data[data.length - 1]?.date || 'unknown',
      },
      totalAgents,
    }
  }

  /**
   * Clear agents data
   */
  clearAgentsLocalStorage(): void {
    localStorage.removeItem(this.agentsStorageKey)
    localStorage.removeItem(`${this.agentsStorageKey}_timestamp`)
  }

  /**
   * Download metrics from GitHub and save to local storage and file
   */
  async downloadAndSave(config: APIConfig): Promise<DownloadResult> {
    try {
      const data = await this.fetchFromGitHub(config)

      if (!data || data.length === 0) {
        return {
          success: false,
          message: 'No data returned from GitHub API',
        }
      }

      // Save to local storage
      this.saveToLocalStorage(data)

      // Save to local file in public/data folder
      await this.saveToLocalFile(data, config.org)

      // Save config (without token)
      this.saveConfig({
        org: config.org,
        token: '', // Don't save token
        since: config.since,
        until: config.until,
        team_slug: config.team_slug,
      })

      const dateRange = {
        from: data[0]?.date || 'unknown',
        to: data[data.length - 1]?.date || 'unknown',
      }

      return {
        success: true,
        message: 'Data downloaded and saved to localStorage and local file',
        recordCount: data.length,
        dateRange,
      }
    } catch (error) {
      console.error('Download error:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        error: error instanceof Error ? error.message : String(error),
      }
    }
  }

  /**
   * Download metrics and export as JSON file
   */
  async downloadAsFile(config: APIConfig, filename?: string): Promise<DownloadResult> {
    try {
      const data = await this.fetchFromGitHub(config)

      if (!data || data.length === 0) {
        return {
          success: false,
          message: 'No data returned from GitHub API',
        }
      }

      // Create JSON file
      const jsonStr = JSON.stringify(data, null, 2)
      const blob = new Blob([jsonStr], { type: 'application/json' })
      const url = URL.createObjectURL(blob)

      // Create download link
      const link = document.createElement('a')
      link.href = url
      link.download = filename || `copilot-metrics-${config.org}-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      const dateRange = {
        from: data[0]?.date || 'unknown',
        to: data[data.length - 1]?.date || 'unknown',
      }

      return {
        success: true,
        message: 'Data exported successfully',
        recordCount: data.length,
        dateRange,
      }
    } catch (error) {
      console.error('Export error:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        error: error instanceof Error ? error.message : String(error),
      }
    }
  }

  /**
   * Save data to local storage
   */
  saveToLocalStorage(data: GitHubCopilotMetricsResponse): void {
    try {
      const jsonStr = JSON.stringify(data)
      localStorage.setItem(this.localStorageKey, jsonStr)
      localStorage.setItem(`${this.localStorageKey}_timestamp`, new Date().toISOString())
    } catch (error) {
      console.error('Failed to save to local storage:', error)
      throw new Error('Failed to save data to local storage')
    }
  }

  /**
   * Save data to local file in public/data folder
   */
  async saveToLocalFile(data: GitHubCopilotMetricsResponse, orgName: string): Promise<void> {
    try {
      const timestamp = new Date().toISOString().split('T')[0]
      const filename = `copilot-metrics-${orgName}-${timestamp}.json`
      
      const jsonStr = JSON.stringify({
        metadata: {
          organization: orgName,
          downloadedAt: new Date().toISOString(),
          recordCount: data.length,
          dateRange: {
            from: data[0]?.date || 'unknown',
            to: data[data.length - 1]?.date || 'unknown',
          }
        },
        data: data
      }, null, 2)

      // Create blob and download
      const blob = new Blob([jsonStr], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      console.log(`Data saved to file: ${filename}`)
    } catch (error) {
      console.error('Failed to save to local file:', error)
      // Don't throw error, just log it - localStorage save should still succeed
    }
  }

  /**
   * Load data from local file
   */
  async loadFromLocalFile(): Promise<GitHubCopilotMetricsResponse | null> {
    try {
      // Try to load from public/data folder
      const response = await fetch(`${this.dataFolderPath}/${this.dataFileName}`)
      if (!response.ok) {
        console.log('No local data file found')
        return null
      }
      const fileData = await response.json()
      // Handle both direct array format and metadata wrapper format
      return fileData.data || fileData
    } catch (error) {
      console.log('Failed to load from local file:', error)
      return null
    }
  }

  /**
   * Load data from local storage or file (with fallback)
   */
  async loadData(): Promise<GitHubCopilotMetricsResponse | null> {
    // Try localStorage first (faster)
    const localStorageData = this.loadFromLocalStorage()
    if (localStorageData) {
      return localStorageData
    }

    // Fallback to local file
    const fileData = await this.loadFromLocalFile()
    if (fileData) {
      // Save to localStorage for faster access next time
      this.saveToLocalStorage(fileData)
      return fileData
    }

    return null
  }

  /**
   * Load data from local storage
   */
  loadFromLocalStorage(): GitHubCopilotMetricsResponse | null {
    try {
      const jsonStr = localStorage.getItem(this.localStorageKey)
      if (!jsonStr) return null
      return JSON.parse(jsonStr) as GitHubCopilotMetricsResponse
    } catch (error) {
      console.error('Failed to load from local storage:', error)
      return null
    }
  }

  /**
   * Get timestamp of last saved data
   */
  getLastSavedTimestamp(): string | null {
    return localStorage.getItem(`${this.localStorageKey}_timestamp`)
  }

  /**
   * Clear saved data
   */
  clearLocalStorage(): void {
    localStorage.removeItem(this.localStorageKey)
    localStorage.removeItem(`${this.localStorageKey}_timestamp`)
  }

  /**
   * Save API configuration
   */
  saveConfig(config: Partial<APIConfig>): void {
    try {
      localStorage.setItem(this.configStorageKey, JSON.stringify(config))
    } catch (error) {
      console.error('Failed to save config:', error)
    }
  }

  /**
   * Load API configuration
   */
  loadConfig(): Partial<APIConfig> | null {
    try {
      const configStr = localStorage.getItem(this.configStorageKey)
      if (!configStr) return null
      return JSON.parse(configStr)
    } catch (error) {
      console.error('Failed to load config:', error)
      return null
    }
  }

  /**
   * Check if local data exists
   */
  hasLocalData(): boolean {
    return !!localStorage.getItem(this.localStorageKey)
  }

  /**
   * Get data statistics
   */
  getDataStats(): { count: number; dateRange: { from: string; to: string } } | null {
    const data = this.loadFromLocalStorage()
    if (!data || data.length === 0) return null

    return {
      count: data.length,
      dateRange: {
        from: data[0]?.date || 'unknown',
        to: data[data.length - 1]?.date || 'unknown',
      },
    }
  }
}

export const githubApiService = new GitHubCopilotAPIService()
