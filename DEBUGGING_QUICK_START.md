# 🐛 Quick Debug Guide - GitHub Copilot API

## 🚀 Quick Start

### Open Browser DevTools
Press **F12** or **Ctrl+Shift+I** (Windows/Linux) or **Cmd+Option+I** (Mac)

### Check Console Tab
You'll see detailed debug logs like:
```
🔍 GitHub Copilot API Debug Info:
  Organization: your-org
  Token Present: true
  Token Prefix: ghp_...
  Date Range: { since: '2025-10-10', until: '2025-11-07' }
  Team Slug: (org-wide)

📤 Request URL: https://api.github.com/enterprises/your-org/copilot/metrics?since=2025-10-10&until=2025-11-07

📥 Response Status: 200 OK

✅ Data received successfully!
  Records: 28
  Date Range: { from: '2025-10-10', to: '2025-11-07' }
```

---

## ⚠️ Common Errors & Quick Fixes

### ❌ 401 Unauthorized
**Error**: `GitHub API error (401): Bad credentials`

**Fix**:
1. Check token is valid: https://github.com/settings/tokens
2. Token must have scope: `manage_billing:copilot`, `read:org`, or `read:enterprise`
3. Token format: `ghp_xxxxx` or `github_pat_xxxxx`

### ❌ 404 Not Found
**Error**: `GitHub API error (404): Not Found`

**Fix**:
1. Verify org name (case-sensitive): https://github.com/YOUR-ORG
2. Check Copilot is enabled: https://github.com/organizations/YOUR-ORG/settings/copilot
3. If using team, verify team exists: https://github.com/enterprises/YOUR-ORG/teams

### ❌ 403 Forbidden
**Error**: `GitHub API error (403): Resource not accessible`

**Fix**:
1. Verify you're an org owner: https://github.com/enterprises/YOUR-ORG/people
2. Check rate limits: See Console for details
3. Contact org admin for access

### ❌ 422 Invalid
**Error**: `GitHub API error (422): Validation failed`

**Fix**:
1. Use date format: `YYYY-MM-DD` (e.g., `2025-11-07`)
2. Ensure: `since < until`
3. Use dates within last 28 days

### ⚠️ No Data
**Message**: `No data returned from GitHub API`

**Fix**:
1. Extend date range (try last 28 days)
2. Remove team filter (get org-wide data)
3. Verify org has 5+ active Copilot users

---

## 🔍 Debug Steps

### Step 1: Check Console Logs
```
Open DevTools (F12) → Console tab
Look for 🔍 📤 📥 ✅ or ❌ emojis
```

### Step 2: Check Network Request
```
Open DevTools (F12) → Network tab
Click "Download & Save Locally"
Find request to api.github.com
Click to see Headers & Response
```

### Step 3: Verify Configuration
```javascript
// In browser console:
console.log('Org:', import.meta.env.VITE_GITHUB_ORG)
console.log('Has Token:', !!import.meta.env.VITE_GITHUB_TOKEN)
```

### Step 4: Test Manually (PowerShell)
```powershell
$org = "your-org"
$token = "ghp_your_token"

curl -H "Authorization: Bearer $token" `
     -H "Accept: application/vnd.github+json" `
     -H "X-GitHub-Api-Version: 2022-11-28" `
     "https://api.github.com/enterprises/$org/copilot/metrics"
```

---

## 📋 Configuration Checklist

### .env File
```bash
# Must start with VITE_
VITE_GITHUB_ORG=your-org-name
VITE_GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxx
VITE_GITHUB_SINCE=2025-10-10
VITE_GITHUB_UNTIL=2025-11-07
VITE_GITHUB_TEAM_SLUG=
```

### Admin Page Form
```
✅ Organization: your-org-name (required)
✅ Token: ghp_xxx (required)
✅ Since: 2025-10-10 (optional, YYYY-MM-DD)
✅ Until: 2025-11-07 (optional, YYYY-MM-DD)
✅ Team Slug: (optional, leave empty for org-wide)
```

### Token Requirements
```
✅ Must be organization owner or admin
✅ Scopes: manage_billing:copilot OR read:org OR read:enterprise
✅ Organization has Copilot enabled
✅ Organization has 5+ active Copilot licenses
```

---

## 🛠️ Testing Tools

### Test with curl
```powershell
# PowerShell
$headers = @{
    "Authorization" = "Bearer YOUR_TOKEN"
    "Accept" = "application/vnd.github+json"
    "X-GitHub-Api-Version" = "2022-11-28"
}
Invoke-RestMethod -Uri "https://api.github.com/enterprises/YOUR_ORG/copilot/metrics" -Headers $headers
```

### Check Rate Limits
```powershell
curl -H "Authorization: Bearer YOUR_TOKEN" https://api.github.com/rate_limit
```

### Validate Token
```powershell
curl -H "Authorization: Bearer YOUR_TOKEN" https://api.github.com/user
```

---

## 📚 Resources

- **Full Debug Guide**: `docs/DEBUGGING_API.md`
- **API Configuration**: `docs/API_CONFIGURATION.md`
- **Data Storage**: `docs/DATA_STORAGE.md`
- **GitHub API Docs**: https://docs.github.com/en/rest/copilot/copilot-metrics
- **Token Creation**: https://github.com/settings/tokens
- **GitHub Status**: https://www.githubstatus.com/

---

## 💡 Pro Tips

1. **Always check Console first** - Detailed logs show exactly what's happening
2. **Use Network tab** - See actual request/response data
3. **Test with curl** - Verify API works outside the app
4. **Start with org-wide** - Remove team filter to get more data
5. **Use recent dates** - Last 7-28 days usually has most activity
6. **Check GitHub Status** - API issues might be on GitHub's side
