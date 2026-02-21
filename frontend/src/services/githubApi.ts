import { GitHubCopilotMetricsResponse, GitHubCopilotAgentsResponse, APIConfig, DownloadResult } from '../types/metrics'

class GitHubCopilotAPIService {
  // Use backend proxy in production, or direct API in development if needed
  private readonly proxyBaseUrl = import.meta.env.VITE_API_PROXY_URL || '/api'
  private readonly baseUrl = 'https://api.github.com'
  private readonly apiVersion = '2022-11-28'
  private readonly localStorageKey = 'copilot_metrics_data'
  private readonly enterpriseMetricsKey = 'copilot_enterprise_metrics_data'
  private readonly orgMetricsKey = 'copilot_org_metrics_data'
  private readonly agentsStorageKey = 'copilot_agents_data'
  private readonly configStorageKey = 'copilot_api_config'
  private readonly dataFolderPath = '/data' // Public folder path for storing data files
  private readonly dataFileName = 'copilot-metrics.json'

  /**
   * Fetch metrics from GitHub Copilot Metrics API via backend proxy
   */
  async fetchFromGitHub(config: APIConfig, level: 'enterprise' | 'organization' = 'enterprise'): Promise<GitHubCopilotMetricsResponse> {
    const { org, token, since, until: untilDate, team_slug } = config

    // DEBUG: Log configuration (without exposing full token)
    console.log(`🔍 GitHub Copilot ${level === 'enterprise' ? 'Enterprise' : 'Organization'} Metrics API Debug Info:`)
    console.log('  Organization/Enterprise:', org)
    console.log('  Token Present:', !!token)
    console.log('  Token Prefix:', token ? token.substring(0, 4) + '...' : 'none')
    console.log('  Date Range:', { since, until: untilDate })
    console.log('  Team Slug:', team_slug || '(org-wide)')

    // Build query parameters for proxy
    const params = new URLSearchParams()
    params.append('org', org)
    params.append('level', level)
    if (since) params.append('since', since)
    if (untilDate) params.append('until', untilDate)
    if (team_slug) params.append('team_slug', team_slug)

    const proxyUrl = `${this.proxyBaseUrl}/github/metrics?${params.toString()}`

    // DEBUG: Log request details
    console.log('📤 Proxy Request URL:', proxyUrl)

    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    // DEBUG: Log response status
    console.log('📥 Response Status:', response.status, response.statusText)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
      const errorText = errorData.error || response.statusText
      console.error('❌ API Error Response:', errorText)
      console.error('💡 Troubleshooting:')
      
      if (response.status === 401) {
        console.error('   • Check if token is valid and not expired')
        console.error('   • Verify token has required scopes: manage_billing:copilot, read:org, or read:enterprise')
        console.error('   • Token format should be: ghp_xxx or github_pat_xxx')
      } else if (response.status === 404) {
        console.error(`   • Verify ${level} name is correct (case-sensitive)`)
        console.error(`   • Check if Copilot is enabled for the ${level}`)
        console.error('   • If using team_slug, verify the team exists')
      } else if (response.status === 403) {
        console.error(`   • Ensure you are a ${level} owner or admin`)
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

    console.log('🔍 GitHub Copilot Agents Metrics API Debug Info:')
    console.log('  Enterprise:', org)
    console.log('  Token Present:', !!token)
    console.log('  Date Range:', { since, until: untilDate })

    // Build query parameters for proxy
    const params = new URLSearchParams()
    params.append('org', org)
    if (since) params.append('since', since)
    if (untilDate) params.append('until', untilDate)

    const proxyUrl = `${this.proxyBaseUrl}/github/agents?${params.toString()}`

    console.log('📤 Proxy Request URL:', proxyUrl)

    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    console.log('📥 Agents Response Status:', response.status, response.statusText)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
      const errorText = errorData.error || response.statusText
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
   * Fetch 28-day enterprise report and download the file
   */
  async download28DayReport(config: APIConfig): Promise<DownloadResult> {
    const { org, token } = config

    console.log('🔍 GitHub Copilot 28-Day Report API Debug Info:')
    console.log('  Enterprise:', org)
    console.log('  Token Present:', !!token)

    try {
      // Step 1: Fetch the report metadata with download links
      const reportEndpoint = `${this.baseUrl}/enterprises/${org}/copilot/metrics/reports/enterprise-28-day/latest`
      
      console.log('📤 Report Metadata Request URL:', reportEndpoint)

      const reportResponse = await fetch(reportEndpoint, {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.github+json',
          'Authorization': `Bearer ${token}`,
          'X-GitHub-Api-Version': this.apiVersion,
        },
      })

      console.log('📥 Report Metadata Response Status:', reportResponse.status, reportResponse.statusText)

      if (!reportResponse.ok) {
        const errorText = await reportResponse.text()
        console.error('❌ Report API Error Response:', errorText)
        
        let errorMessage = `GitHub Report API error (${reportResponse.status})`
        
        if (reportResponse.status === 401) {
          errorMessage += ': Invalid or expired token. Please check your Personal Access Token.'
        } else if (reportResponse.status === 404) {
          errorMessage += ': Enterprise not found or 28-day report not available. Verify enterprise name.'
        } else if (reportResponse.status === 403) {
          errorMessage += ': Access denied. Ensure you are an enterprise owner and token has required scopes.'
        } else {
          errorMessage += `: ${errorText}`
        }
        
        throw new Error(errorMessage)
      }

      const reportMetadata = await reportResponse.json()
      console.log('✅ Report metadata received:', reportMetadata)

      // Step 2: Extract download link from response
      let downloadUrl: string | null = null
      
      if (reportMetadata.download_links && Array.isArray(reportMetadata.download_links) && reportMetadata.download_links.length > 0) {
        downloadUrl = reportMetadata.download_links[0]
        console.log('📥 Found download link in download_links array:', downloadUrl)
      } else if (reportMetadata.download_url) {
        downloadUrl = reportMetadata.download_url
        console.log('📥 Found download_url:', downloadUrl)
      }
      
      if (!downloadUrl) {
        console.error('❌ No download link found in response:', reportMetadata)
        throw new Error('No download link found in report response. Response structure may have changed.')
      }

      // Step 3: Open download link in new tab (CORS workaround)
      console.log('📥 Opening download link in new tab:', downloadUrl)
      
      // Open in new tab - user will need to save the file and upload it
      window.open(downloadUrl, '_blank')
      
      console.log('✅ Download link opened in new tab')
      console.log('💡 User should save the JSON file and upload it via the Admin page')

      return {
        success: true,
        message: `28-day report download link opened in new tab. Please save the JSON file and use the "Upload Report File" button to import it.`,
        dateRange: {
          from: reportMetadata.report_start_day || 'unknown',
          to: reportMetadata.report_end_day || 'unknown',
        }
      }
    } catch (error) {
      console.error('❌ 28-day report download error:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred while downloading report',
        error: error instanceof Error ? error.message : String(error),
      }
    }
  }

  /**
   * Fetch 28-day user report and download the file
   */
  async downloadUser28DayReport(config: APIConfig): Promise<DownloadResult> {
    const { org, token } = config

    console.log('🔍 GitHub Copilot User 28-Day Report API Debug Info:')
    console.log('  Enterprise:', org)
    console.log('  Token Present:', !!token)

    try {
      // Step 1: Fetch the report metadata with download links
      const reportEndpoint = `${this.baseUrl}/enterprises/${org}/copilot/metrics/reports/users-28-day/latest`
      
      console.log('📤 User Report Metadata Request URL:', reportEndpoint)

      const reportResponse = await fetch(reportEndpoint, {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.github+json',
          'Authorization': `Bearer ${token}`,
          'X-GitHub-Api-Version': this.apiVersion,
        },
      })

      console.log('📥 User Report Metadata Response Status:', reportResponse.status, reportResponse.statusText)

      if (!reportResponse.ok) {
        const errorText = await reportResponse.text()
        console.error('❌ User Report API Error Response:', errorText)
        
        let errorMessage = `GitHub User Report API error (${reportResponse.status})`
        
        if (reportResponse.status === 401) {
          errorMessage += ': Invalid or expired token. Please check your Personal Access Token.'
        } else if (reportResponse.status === 404) {
          errorMessage += ': Enterprise not found or user 28-day report not available. Verify enterprise name.'
        } else if (reportResponse.status === 403) {
          errorMessage += ': Access denied. Ensure you are an enterprise owner and token has required scopes.'
        } else {
          errorMessage += `: ${errorText}`
        }
        
        throw new Error(errorMessage)
      }

      const reportMetadata = await reportResponse.json()
      console.log('✅ User report metadata received:', reportMetadata)

      // Step 2: Extract download link from response
      let downloadUrl: string | null = null
      
      if (reportMetadata.download_links && Array.isArray(reportMetadata.download_links) && reportMetadata.download_links.length > 0) {
        downloadUrl = reportMetadata.download_links[0]
        console.log('📥 Found download link in download_links array:', downloadUrl)
      } else if (reportMetadata.download_url) {
        downloadUrl = reportMetadata.download_url
        console.log('📥 Found download_url:', downloadUrl)
      }
      
      if (!downloadUrl) {
        console.error('❌ No download link found in response:', reportMetadata)
        throw new Error('No download link found in user report response. Response structure may have changed.')
      }

      // Step 3: Open download link in new tab (CORS workaround)
      console.log('📥 Opening download link in new tab:', downloadUrl)
      
      // Open in new tab - user will need to save the file and upload it
      window.open(downloadUrl, '_blank')
      
      console.log('✅ Download link opened in new tab')
      console.log('💡 User should save the JSON file and upload it via the Admin page')

      return {
        success: true,
        message: `User 28-day report download link opened in new tab. Please save the JSON file and use the "Upload Report File" button to import it.`,
        dateRange: {
          from: reportMetadata.report_start_day || 'unknown',
          to: reportMetadata.report_end_day || 'unknown',
        }
      }
    } catch (error) {
      console.error('❌ User 28-day report download error:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred while downloading user report',
        error: error instanceof Error ? error.message : String(error),
      }
    }
  }

  /**
   * Fetch 30-day metrics directly from backend proxy
   * Backend handles downloading from Azure CDN to avoid CORS issues
   */
  async fetch30DayMetrics(config: APIConfig, level: 'enterprise' | 'organization' = 'enterprise'): Promise<DownloadResult> {
    const { org, token } = config

    console.log(`🔍 GitHub Copilot 30-Day Metrics Proxy Request (${level}):`)
    console.log('  Organization/Enterprise:', org)
    console.log('  Token Present:', !!token)

    try {
      const proxyUrl = `${this.proxyBaseUrl}/github/metrics/30-day`
      
      console.log('📤 Proxy Request URL:', proxyUrl)

      const response = await fetch(proxyUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ org, level }),
      })

      console.log('📥 Proxy Response Status:', response.status, response.statusText)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        const errorText = errorData.error || response.statusText
        console.error('❌ 30-Day Metrics Proxy Error:', errorText)
        
        throw new Error(`Backend proxy error (${response.status}): ${errorText}`)
      }

      const result = await response.json()
      
      if (!result.success || !result.data) {
        throw new Error('Invalid response from backend proxy')
      }

      console.log('✅ 30-Day metrics received from proxy!')
      console.log('  Records:', result.data.length)

      // Save to localStorage
      const storageKey = level === 'enterprise' 
        ? 'copilot_enterprise_metrics_data' 
        : 'copilot_org_metrics_data'
      
      localStorage.setItem(storageKey, JSON.stringify(result.data))
      localStorage.setItem(`${storageKey}_timestamp`, new Date().toISOString())
      
      console.log(`✅ Data saved to localStorage: ${storageKey}`)

      // Get date range
      const dateRange = {
        from: result.metadata?.report_start_day || result.data[0]?.date || 'unknown',
        to: result.metadata?.report_end_day || result.data[result.data.length - 1]?.date || 'unknown',
      }

      return {
        success: true,
        message: `Successfully downloaded ${result.data.length} records of 30-day metrics`,
        recordCount: result.data.length,
        dateRange,
      }

    } catch (error) {
      console.error('❌ 30-Day Metrics Fetch Error:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred while fetching 30-day metrics',
        error: error instanceof Error ? error.message : String(error),
      }
    }
  }

  /**
   * Fetch seats data from GitHub Copilot API via backend proxy
   */
  async fetchSeatsFromGitHub(config: APIConfig, level: 'enterprise' | 'organization'): Promise<any> {
    const { org, token } = config

    console.log(`🔍 GitHub Copilot ${level === 'enterprise' ? 'Enterprise' : 'Organization'} Seats API Debug Info:`)
    console.log('  Organization/Enterprise:', org)
    console.log('  Token Present:', !!token)

    // Build query parameters for proxy
    const params = new URLSearchParams()
    params.append('org', org)
    params.append('level', level)

    const proxyUrl = `${this.proxyBaseUrl}/github/seats?${params.toString()}`

    console.log('📤 Proxy Request URL:', proxyUrl)

    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    console.log('📥 Seats Response Status:', response.status, response.statusText)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
      const errorText = errorData.error || response.statusText
      console.error('❌ Seats API Error Response:', errorText)
      console.error('💡 Troubleshooting:')
      
      if (response.status === 401) {
        console.error('   • Check if token is valid and not expired')
        console.error('   • Verify token has required scopes: manage_billing:copilot or read:org')
      } else if (response.status === 404) {
        console.error(`   • Verify ${level} name is correct (case-sensitive)`)
        console.error(`   • Check if Copilot is enabled for the ${level}`)
      } else if (response.status === 403) {
        console.error(`   • Ensure you are a ${level} owner or admin`)
        console.error('   • Check if API rate limit has been exceeded')
      }
      
      throw new Error(`GitHub Seats API error (${response.status}): ${errorText}`)
    }

    const data = await response.json()
    
    console.log('✅ Seats data received successfully!')
    console.log('  Total Seats:', data.total_seats)
    console.log('  Seats Array Length:', data.seats?.length || 0)

    return data
  }

  /**
   * Download metrics from GitHub and save to local storage and file
   */
  async downloadAndSave(config: APIConfig, dataType: 'metrics' | 'seats' = 'metrics', level: 'enterprise' | 'organization' = 'enterprise'): Promise<DownloadResult> {
    try {
      let data: any
      let filename: string
      
      if (dataType === 'seats') {
        // Fetch seats data
        data = await this.fetchSeatsFromGitHub(config, level)
        
        if (!data || !data.seats || data.seats.length === 0) {
          return {
            success: false,
            message: 'No seats data returned from GitHub API',
          }
        }

        // Create filename for seats
        const timestamp = new Date().toISOString().split('T')[0]
        filename = `copilot-seats-${level}-${config.org}-${timestamp}.json`

        // Save seats to file
        const jsonStr = JSON.stringify({
          metadata: {
            type: 'seats',
            level: level,
            organization: config.org,
            downloadedAt: new Date().toISOString(),
            totalSeats: data.total_seats,
            seatsCount: data.seats.length,
          },
          data: data
        }, null, 2)

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

        // Also save to localStorage for live page
        const storageKey = level === 'enterprise' ? 'copilot_enterprise_seats_data' : 'copilot_org_seats_data'
        localStorage.setItem(storageKey, jsonStr)
        localStorage.setItem(`${storageKey}_timestamp`, new Date().toISOString())

        return {
          success: true,
          message: `${level.charAt(0).toUpperCase() + level.slice(1)} seats data downloaded and saved to file`,
          recordCount: data.seats.length,
          dateRange: {
            from: 'N/A (seats snapshot)',
            to: 'N/A (seats snapshot)',
          }
        }
      } else {
        // Fetch metrics data
        data = await this.fetchFromGitHub(config, level)

        if (!data || data.length === 0) {
          return {
            success: false,
            message: 'No data returned from GitHub API',
          }
        }

        // Save to local storage with level parameter
        this.saveToLocalStorage(data, level)

        // Save to local file with level in filename
        const timestamp = new Date().toISOString().split('T')[0]
        const filename = `copilot-metrics-${level}-${config.org}-${timestamp}.json`
        
        const jsonStr = JSON.stringify({
          metadata: {
            type: 'metrics',
            level: level,
            organization: config.org,
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
          message: `${level.charAt(0).toUpperCase() + level.slice(1)} metrics data downloaded and saved to file`,
          recordCount: data.length,
          dateRange,
        }
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
  saveToLocalStorage(data: GitHubCopilotMetricsResponse, level: 'enterprise' | 'organization' = 'enterprise'): void {
    try {
      const jsonStr = JSON.stringify(data)
      const storageKey = level === 'enterprise' ? this.enterpriseMetricsKey : this.orgMetricsKey
      
      // Save to level-specific key
      localStorage.setItem(storageKey, jsonStr)
      localStorage.setItem(`${storageKey}_timestamp`, new Date().toISOString())
      
      // Also save to legacy key for backward compatibility (use enterprise as default)
      if (level === 'enterprise') {
        localStorage.setItem(this.localStorageKey, jsonStr)
        localStorage.setItem(`${this.localStorageKey}_timestamp`, new Date().toISOString())
      }
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
  loadFromLocalStorage(level?: 'enterprise' | 'organization'): GitHubCopilotMetricsResponse | null {
    try {
      let storageKey = this.localStorageKey
      
      // If level specified, use level-specific key
      if (level === 'enterprise') {
        storageKey = this.enterpriseMetricsKey
      } else if (level === 'organization') {
        storageKey = this.orgMetricsKey
      }
      
      const jsonStr = localStorage.getItem(storageKey)
      if (!jsonStr) {
        // Fallback to legacy key if level-specific not found
        if (level) {
          const legacyData = localStorage.getItem(this.localStorageKey)
          if (legacyData) return JSON.parse(legacyData) as GitHubCopilotMetricsResponse
        }
        return null
      }
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
    // Clear legacy metrics data
    localStorage.removeItem(this.localStorageKey)
    localStorage.removeItem(`${this.localStorageKey}_timestamp`)
    
    // Clear enterprise metrics data
    localStorage.removeItem(this.enterpriseMetricsKey)
    localStorage.removeItem(`${this.enterpriseMetricsKey}_timestamp`)
    
    // Clear organization metrics data
    localStorage.removeItem(this.orgMetricsKey)
    localStorage.removeItem(`${this.orgMetricsKey}_timestamp`)
    
    // Clear agents data
    localStorage.removeItem(this.agentsStorageKey)
    localStorage.removeItem(`${this.agentsStorageKey}_timestamp`)
    
    // Clear seats data (enterprise and organization)
    localStorage.removeItem('copilot_enterprise_seats_data')
    localStorage.removeItem('copilot_enterprise_seats_data_timestamp')
    localStorage.removeItem('copilot_org_seats_data')
    localStorage.removeItem('copilot_org_seats_data_timestamp')
    
    // Clear 28-day report data
    localStorage.removeItem('enterprise_report_data')
    localStorage.removeItem('enterprise_report_data_timestamp')
    localStorage.removeItem('user_report_data')
    localStorage.removeItem('user_report_data_timestamp')
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
    return !!localStorage.getItem(this.localStorageKey) || 
           !!localStorage.getItem(this.enterpriseMetricsKey) ||
           !!localStorage.getItem(this.orgMetricsKey)
  }

  /**
   * Get data statistics
   */
  getDataStats(): { 
    enterprise?: { count: number; dateRange: { from: string; to: string } }
    organization?: { count: number; dateRange: { from: string; to: string } }
    count: number
    dateRange: { from: string; to: string }
  } | null {
    const enterpriseData = this.loadFromLocalStorage('enterprise')
    const orgData = this.loadFromLocalStorage('organization')
    
    if (!enterpriseData && !orgData) return null

    const result: any = {}
    
    if (enterpriseData && enterpriseData.length > 0) {
      result.enterprise = {
        count: enterpriseData.length,
        dateRange: {
          from: enterpriseData[0]?.date || 'unknown',
          to: enterpriseData[enterpriseData.length - 1]?.date || 'unknown',
        }
      }
    }
    
    if (orgData && orgData.length > 0) {
      result.organization = {
        count: orgData.length,
        dateRange: {
          from: orgData[0]?.date || 'unknown',
          to: orgData[orgData.length - 1]?.date || 'unknown',
        }
      }
    }
    
    // For backward compatibility, use enterprise data as default
    const defaultData = enterpriseData || orgData
    if (defaultData && defaultData.length > 0) {
      result.count = defaultData.length
      result.dateRange = {
        from: defaultData[0]?.date || 'unknown',
        to: defaultData[defaultData.length - 1]?.date || 'unknown',
      }
    }
    
    return result
  }
}

export const githubApiService = new GitHubCopilotAPIService()
