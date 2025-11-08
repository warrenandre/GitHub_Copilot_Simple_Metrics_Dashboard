# Debugging GitHub Copilot API Calls

## Quick Debug Checklist

### 1. Check Browser Console
Open Developer Tools (F12) and check the Console tab for:
- API request details
- Response status codes
- Error messages

### 2. Check Network Tab
1. Open Developer Tools (F12)
2. Go to **Network** tab
3. Click "Download & Save Locally" in Admin page
4. Look for request to `api.github.com/enterprises/.../copilot/metrics`
5. Click on the request to see:
   - **Headers** - Check Authorization token
   - **Response** - See actual API response
   - **Status Code** - 200 (success), 401 (auth error), 404 (not found)

### 3. Common Issues & Solutions

#### Issue: 401 Unauthorized
**Error**: `GitHub API error (401): Bad credentials`

**Causes**:
- Invalid or expired personal access token
- Token doesn't have required scopes
- Token format incorrect (should start with `ghp_` or `github_pat_`)

**Solutions**:
```bash
# 1. Verify token format
echo $VITE_GITHUB_TOKEN  # Should start with ghp_ or github_pat_

# 2. Check token scopes in GitHub
# Go to: Settings → Developer settings → Personal access tokens
# Required scopes: manage_billing:copilot OR read:org OR read:enterprise

# 3. Create new token if needed
# https://github.com/settings/tokens
```

#### Issue: 404 Not Found
**Error**: `GitHub API error (404): Not Found`

**Causes**:
- Organization name is incorrect
- Organization doesn't have Copilot enabled
- Team slug is incorrect (if using team-specific metrics)
- API endpoint URL is malformed

**Solutions**:
```bash
# 1. Verify org name (case-sensitive)
# Check: https://github.com/your-org-name

# 2. Verify Copilot is enabled
# Go to: https://github.com/organizations/your-org/settings/copilot

# 3. If using team slug, verify team exists
# Go to: https://github.com/enterprises/your-org/teams
```

#### Issue: 403 Forbidden
**Error**: `GitHub API error (403): Resource not accessible`

**Causes**:
- You're not an organization owner/admin
- Organization has restricted API access
- Rate limit exceeded (5000 requests/hour)

**Solutions**:
```bash
# 1. Check your role in the organization
# Go to: https://github.com/enterprises/your-org/people

# 2. Check rate limits
curl -H "Authorization: Bearer YOUR_TOKEN" https://api.github.com/rate_limit

# 3. Contact org admin to grant access
```

#### Issue: 422 Unprocessable Entity
**Error**: `GitHub API error (422): Validation failed`

**Causes**:
- Invalid date format in `since` or `until` parameters
- Date range is invalid (e.g., since > until)
- Dates are too far in the past (max 28 days)

**Solutions**:
```
# Date format must be: YYYY-MM-DD
Correct:   2025-11-01
Incorrect: 11/01/2025, 01-11-2025, 2025/11/01

# Valid date range:
since: 2025-10-10
until: 2025-11-07  (today or earlier)
```

#### Issue: No Data Returned (Empty Array)
**Error**: `No data returned from GitHub API`

**Causes**:
- No Copilot activity in the date range
- Organization has fewer than 5 active Copilot licenses
- Copilot Metrics API not enabled for your org

**Solutions**:
```bash
# 1. Check if org has active Copilot users
# Go to: https://github.com/organizations/your-org/settings/copilot

# 2. Extend date range (try last 28 days)
since: 2025-10-10
until: 2025-11-07

# 3. Remove team_slug filter to get org-wide data
```

---

## Step-by-Step Debugging Process

### Step 1: Enable Verbose Logging

The app already logs to console. Open Browser DevTools (F12) → Console

You'll see:
```
Fetching GitHub Copilot metrics...
Request URL: https://api.github.com/enterprises/your-org/copilot/metrics?since=2025-10-10
Request Headers: { Authorization: Bearer ghp_***, ... }
```

### Step 2: Test API Connection Manually

#### Using curl (PowerShell):
```powershell
# Set your values
$org = "your-org-name"
$token = "ghp_your_token_here"

# Test basic API access
curl -H "Authorization: Bearer $token" `
     -H "Accept: application/vnd.github+json" `
     -H "X-GitHub-Api-Version: 2022-11-28" `
     "https://api.github.com/enterprises/$org/copilot/metrics"
```

#### Using PowerShell Invoke-RestMethod:
```powershell
$org = "your-org-name"
$token = "ghp_your_token_here"

$headers = @{
    "Authorization" = "Bearer $token"
    "Accept" = "application/vnd.github+json"
    "X-GitHub-Api-Version" = "2022-11-28"
}

Invoke-RestMethod -Uri "https://api.github.com/enterprises/$org/copilot/metrics" `
                  -Headers $headers `
                  -Method Get
```

### Step 3: Verify Environment Variables

Check if `.env` file is loaded correctly:

```powershell
# From project root
cat .env

# Restart dev server after changing .env
npm run dev
```

**Important**: Environment variables in Vite must start with `VITE_`:
```bash
# ✅ Correct
VITE_GITHUB_ORG=my-org
VITE_GITHUB_TOKEN=ghp_xxx

# ❌ Wrong (won't be loaded)
GITHUB_ORG=my-org
GITHUB_TOKEN=ghp_xxx
```

### Step 4: Check API Configuration

Open Browser Console and run:
```javascript
// Check what config is loaded
import { loadApiConfig } from './src/config/apiConfig'
console.log(loadApiConfig())

// Check localStorage
console.log(localStorage.getItem('copilot_api_config'))

// Check environment variables
console.log({
  org: import.meta.env.VITE_GITHUB_ORG,
  hasToken: !!import.meta.env.VITE_GITHUB_TOKEN,
  since: import.meta.env.VITE_GITHUB_SINCE,
  until: import.meta.env.VITE_GITHUB_UNTIL,
})
```

### Step 5: Inspect Network Request

1. Open DevTools → **Network** tab
2. Clear all requests (🚫 icon)
3. Click "Download & Save Locally" in Admin page
4. Find request to `api.github.com`
5. Click on it and check:

**General**:
- Request URL: Should be correct endpoint
- Request Method: GET
- Status Code: 200 (success) or error code

**Request Headers**:
```
Accept: application/vnd.github+json
Authorization: Bearer ghp_*** (check if present)
X-GitHub-Api-Version: 2022-11-28
```

**Response**:
- If 200: JSON array with metrics data
- If error: Error message with details

### Step 6: Test with Sample Data

If API calls fail, test with demo data first:

1. Navigate to `/demo` pages (should work)
2. If demo works but live doesn't, it's an API configuration issue
3. If demo also fails, it's a code/build issue

---

## Advanced Debugging

### Add Custom Logging

Edit `src/services/githubApi.ts` to add detailed logs:

```typescript
async fetchFromGitHub(config: APIConfig): Promise<GitHubCopilotMetricsResponse> {
  const { org, token, since, until: untilDate, team_slug } = config

  // LOG: Configuration
  console.log('🔍 API Config:', {
    org,
    hasToken: !!token,
    tokenPrefix: token?.substring(0, 4),
    since,
    until: untilDate,
    team_slug
  })

  // Construct endpoint URL
  const endpoint = team_slug
    ? `${this.baseUrl}/enterprises/${org}/team/${team_slug}/copilot/metrics`
    : `${this.baseUrl}/enterprises/${org}/copilot/metrics`

  // Build query parameters
  const params = new URLSearchParams()
  if (since) params.append('since', since)
  if (untilDate) params.append('until', untilDate)

  const url = params.toString() ? `${endpoint}?${params}` : endpoint

  // LOG: Request details
  console.log('📤 Request URL:', url)
  console.log('📤 Request Headers:', {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token?.substring(0, 10)}...`,
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

  // LOG: Response status
  console.log('📥 Response Status:', response.status, response.statusText)

  if (!response.ok) {
    const errorText = await response.text()
    console.error('❌ API Error Response:', errorText)
    throw new Error(`GitHub API error (${response.status}): ${errorText}`)
  }

  const data: GitHubCopilotMetricsResponse = await response.json()
  
  // LOG: Success
  console.log('✅ Data received:', {
    recordCount: data.length,
    dateRange: {
      from: data[0]?.date,
      to: data[data.length - 1]?.date
    }
  })

  return data
}
```

### Test API with Postman/Insomnia

**Import into Postman**:
```json
{
  "method": "GET",
  "url": "https://api.github.com/enterprises/{{org}}/copilot/metrics",
  "headers": [
    { "key": "Accept", "value": "application/vnd.github+json" },
    { "key": "Authorization", "value": "Bearer {{token}}" },
    { "key": "X-GitHub-Api-Version", "value": "2022-11-28" }
  ]
}
```

---

## Common Configuration Examples

### Org-wide Metrics (Last 28 Days)
```bash
Organization: microsoft
Token: ghp_xxxxxxxxxxxxxxxxxxxxx
Since: 2025-10-10
Until: 2025-11-07
Team Slug: (leave empty)
```

### Team-specific Metrics
```bash
Organization: microsoft
Token: ghp_xxxxxxxxxxxxxxxxxxxxx
Since: 2025-10-10
Until: 2025-11-07
Team Slug: engineering-team
```

### Custom Date Range (Last Week)
```bash
Organization: microsoft
Token: ghp_xxxxxxxxxxxxxxxxxxxxx
Since: 2025-11-01
Until: 2025-11-07
Team Slug: (leave empty)
```

---

## Troubleshooting Quick Reference

| Error Code | Meaning | Fix |
|------------|---------|-----|
| **200** | ✅ Success | Data downloaded successfully |
| **401** | 🔒 Unauthorized | Check token validity and scopes |
| **403** | 🚫 Forbidden | Check org permissions and role |
| **404** | ❓ Not Found | Verify org name and endpoint |
| **422** | ⚠️ Invalid Data | Check date format and range |
| **500** | 💥 Server Error | GitHub API issue, try again later |

---

## Additional Resources

- **GitHub Copilot Metrics API Docs**: https://docs.github.com/en/rest/copilot/copilot-metrics
- **Creating Personal Access Tokens**: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token
- **API Rate Limits**: https://docs.github.com/en/rest/overview/rate-limits-for-the-rest-api
- **GitHub API Status**: https://www.githubstatus.com/

---

## Getting Help

If you're still having issues:

1. **Check Console Logs**: Look for red error messages in browser console
2. **Check Network Tab**: Inspect the actual API request/response
3. **Test with curl**: Verify API works outside the app
4. **Use Demo Data**: Confirm the app works with mock data
5. **Check GitHub Status**: https://www.githubstatus.com/
6. **Contact Support**: Provide error code and message from console
