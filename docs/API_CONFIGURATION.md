# API Configuration Guide

This guide explains how to configure the GitHub Copilot Metrics API for your organization.

## Configuration File

The API configuration is managed through `src/config/apiConfig.ts`. This file provides:

- Default configuration structure
- Configuration validation
- localStorage integration for persistence (excluding sensitive tokens)

## Security Notice

⚠️ **IMPORTANT**: Never commit your GitHub Personal Access Token to version control!

The `.gitignore` file is configured to exclude:
- `src/config/apiConfig.local.ts` - Your local configuration overrides
- `.env` and `.env.local` - Environment variable files

## Setup Options

### Option 1: Using the Admin UI (Recommended)

1. Start the application: `npm run dev`
2. Navigate to `/admin` in your browser
3. Enter your configuration:
   - **Organization Name**: Your GitHub org name
   - **Personal Access Token**: Token with required permissions
   - **Date Range** (optional): Specify since/until dates
   - **Team Slug** (optional): For team-specific metrics
4. Click "Download & Save Locally"

The configuration (excluding the token) will be saved to localStorage for persistence across sessions.

### Option 2: Using a Local Config File

1. Create a file: `src/config/apiConfig.local.ts`

```typescript
import { APIConfiguration } from './apiConfig'

export const localApiConfig: APIConfiguration = {
  org: 'your-organization-name',
  token: 'ghp_your_personal_access_token_here',
  since: '2025-10-01', // Optional
  until: '2025-11-07', // Optional
  team_slug: 'your-team-slug', // Optional
}
```

2. Update `src/config/apiConfig.ts` to import and use local config:

```typescript
// At the top of apiConfig.ts, add:
let localConfig: APIConfiguration | null = null
try {
  localConfig = require('./apiConfig.local').localApiConfig
} catch {
  // Local config not found, use defaults
}

export const defaultApiConfig: APIConfiguration = localConfig || {
  org: '',
  token: '',
  // ... rest of defaults
}
```

### Option 3: Using Environment Variables

1. Create a `.env.local` file in the project root:

```env
VITE_GITHUB_ORG=your-organization-name
VITE_GITHUB_TOKEN=ghp_your_personal_access_token_here
VITE_GITHUB_SINCE=2025-10-01
VITE_GITHUB_UNTIL=2025-11-07
VITE_GITHUB_TEAM_SLUG=your-team-slug
```

2. Update `src/config/apiConfig.ts` to read from environment:

```typescript
export const defaultApiConfig: APIConfiguration = {
  org: import.meta.env.VITE_GITHUB_ORG || '',
  token: import.meta.env.VITE_GITHUB_TOKEN || '',
  since: import.meta.env.VITE_GITHUB_SINCE || '',
  until: import.meta.env.VITE_GITHUB_UNTIL || '',
  team_slug: import.meta.env.VITE_GITHUB_TEAM_SLUG || '',
}
```

## GitHub Personal Access Token

### Required Permissions

Your token needs one of the following scopes:
- `manage_billing:copilot`
- `read:org`
- `read:enterprise`

### Creating a Token

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a descriptive name: "Copilot Metrics Dashboard"
4. Select the required scopes
5. Set an appropriate expiration date
6. Click "Generate token"
7. **Copy the token immediately** - you won't be able to see it again!

## Configuration Validation

The app validates your configuration before making API calls:

✅ **Valid Configuration**:
- Organization name is provided
- Token is provided and starts with `ghp_` or `github_pat_`
- Date formats are YYYY-MM-DD (if provided)
- Since date is before Until date (if both provided)

❌ **Invalid Configuration**:
- Missing required fields
- Invalid token format
- Incorrect date formats
- Invalid date ranges

## API Requirements

- Organization must have **5+ members** with active Copilot licenses
- Copilot Metrics API access policy must be enabled
- Only organization **owners** can access the endpoint
- Maximum of **100 days** of historical data available

## Data Storage

Downloaded metrics are stored in:
- **Browser localStorage**: `copilot_metrics_data` key
- **Timestamp**: `copilot_metrics_data_timestamp` key
- **Config** (without token): `copilot_api_config` key

To clear stored data:
1. Go to Admin page
2. Click "Clear Local Data" button
OR
3. Open browser DevTools → Application → Local Storage → Clear

## Troubleshooting

### "No Data Available" Error

**Cause**: No metrics have been downloaded yet.

**Solution**: 
1. Navigate to `/admin`
2. Configure your API settings
3. Click "Download & Save Locally"

### "401 Unauthorized" Error

**Causes**:
- Invalid or expired token
- Token doesn't have required permissions
- Not an organization owner

**Solution**:
1. Verify token permissions
2. Generate a new token if expired
3. Confirm you're an org owner

### "403 Forbidden" Error

**Causes**:
- Organization has fewer than 5 Copilot licenses
- Metrics API access policy not enabled

**Solution**:
1. Verify org has 5+ active licenses
2. Check GitHub org settings for API access

### "No Data Returned" Error

**Causes**:
- Date range has no activity
- Team slug doesn't exist

**Solution**:
1. Adjust date range
2. Verify team slug is correct
3. Try without team_slug for org-wide data

## Best Practices

1. **Token Security**:
   - Never commit tokens to git
   - Use short expiration periods
   - Rotate tokens regularly
   - Store tokens in environment variables or secure vaults

2. **Data Refresh**:
   - Re-download data daily for fresh insights
   - Use appropriate date ranges (28 days recommended)
   - Schedule automatic downloads if possible

3. **Configuration Management**:
   - Document which approach you're using (UI/file/env)
   - Keep team members informed of configuration changes
   - Use team-wide environment variables for shared setups

## Support

For more information:
- [GitHub Copilot Metrics API Documentation](https://docs.github.com/en/rest/copilot/copilot-metrics)
- Check application logs in browser DevTools Console
- Review network requests in DevTools Network tab
