/**
 * GitHub Copilot Metrics API Configuration
 * 
 * Store your API configuration here. This file should be added to .gitignore
 * to prevent accidentally committing sensitive tokens.
 */

export interface APIConfiguration {
  org: string
  token: string
  since?: string
  until?: string
  team_slug?: string
}

/**
 * Default API configuration
 * Update these values with your organization details
 * 
 * Priority order:
 * 1. Values from Admin UI (saved to localStorage)
 * 2. Environment variables (from .env.local)
 * 3. Default empty values
 */
export const defaultApiConfig: APIConfiguration = {
  org: import.meta.env.VITE_GITHUB_ORG || '', // Your GitHub organization name
  token: import.meta.env.VITE_GITHUB_TOKEN || '', // Your GitHub Personal Access Token (keep this secret!)
  since: import.meta.env.VITE_GITHUB_SINCE || '', // Optional: Start date (YYYY-MM-DD)
  until: import.meta.env.VITE_GITHUB_UNTIL || '', // Optional: End date (YYYY-MM-DD)
  team_slug: import.meta.env.VITE_GITHUB_TEAM_SLUG || '', // Optional: Team slug for team-specific metrics
}

/**
 * Load API configuration from localStorage or use default
 */
export const loadApiConfig = (): APIConfiguration => {
  try {
    const stored = localStorage.getItem('copilot_api_config')
    if (stored) {
      const parsed = JSON.parse(stored)
      return { ...defaultApiConfig, ...parsed }
    }
  } catch (error) {
    console.error('Failed to load API config from localStorage:', error)
  }
  return defaultApiConfig
}

/**
 * Save API configuration to localStorage
 */
export const saveApiConfig = (config: Partial<APIConfiguration>): void => {
  try {
    const current = loadApiConfig()
    const updated = { ...current, ...config }
    // Don't save token to localStorage for security
    const { token, ...configWithoutToken } = updated
    localStorage.setItem('copilot_api_config', JSON.stringify(configWithoutToken))
  } catch (error) {
    console.error('Failed to save API config to localStorage:', error)
  }
}

/**
 * Clear API configuration from localStorage
 */
export const clearApiConfig = (): void => {
  try {
    localStorage.removeItem('copilot_api_config')
  } catch (error) {
    console.error('Failed to clear API config:', error)
  }
}

/**
 * Validate API configuration
 */
export const validateApiConfig = (config: APIConfiguration): { valid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (!config.org || config.org.trim() === '') {
    errors.push('Organization name is required')
  }

  if (!config.token || config.token.trim() === '') {
    errors.push('Personal Access Token is required')
  }

  if (config.token && !config.token.startsWith('ghp_') && !config.token.startsWith('github_pat_')) {
    errors.push('Token should start with "ghp_" or "github_pat_"')
  }

  if (config.since && !/^\d{4}-\d{2}-\d{2}$/.test(config.since)) {
    errors.push('Since date must be in YYYY-MM-DD format')
  }

  if (config.until && !/^\d{4}-\d{2}-\d{2}$/.test(config.until)) {
    errors.push('Until date must be in YYYY-MM-DD format')
  }

  if (config.since && config.until && config.since > config.until) {
    errors.push('Since date must be before Until date')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
