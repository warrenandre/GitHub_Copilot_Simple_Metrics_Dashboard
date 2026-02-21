/**
 * Example Local API Configuration
 * 
 * Copy this file to `apiConfig.local.ts` and update with your credentials.
 * The .local.ts file is git-ignored and will not be committed.
 * 
 * Usage:
 * 1. Copy: cp apiConfig.local.example.ts apiConfig.local.ts
 * 2. Edit apiConfig.local.ts with your values
 * 3. Import in apiConfig.ts if you want file-based config
 */

import { APIConfiguration } from './apiConfig'

export const localApiConfig: APIConfiguration = {
  // Your GitHub organization name (required)
  org: 'your-organization-name',
  
  // Your GitHub Personal Access Token (required)
  // Token needs: manage_billing:copilot, read:org, or read:enterprise scope
  // Never commit this file with a real token!
  token: 'ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  
  // Start date for metrics (optional, format: YYYY-MM-DD)
  // If not specified, defaults to 28 days ago
  since: '',
  
  // End date for metrics (optional, format: YYYY-MM-DD)
  // If not specified, defaults to yesterday
  until: '',
  
  // Team slug for team-specific metrics (optional)
  // Leave empty for organization-wide metrics
  team_slug: '',
}

/**
 * Example configurations:
 */

// Example 1: Organization-wide metrics for last 28 days
export const exampleOrgWide: APIConfiguration = {
  org: 'acme-corp',
  token: 'ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
}

// Example 2: Team-specific metrics with custom date range
export const exampleTeamMetrics: APIConfiguration = {
  org: 'acme-corp',
  token: 'ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  since: '2025-10-01',
  until: '2025-10-31',
  team_slug: 'engineering-team',
}

// Example 3: Last 7 days metrics
export const exampleWeekly: APIConfiguration = {
  org: 'acme-corp',
  token: 'ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  since: '2025-10-31',
  until: '2025-11-06',
}
