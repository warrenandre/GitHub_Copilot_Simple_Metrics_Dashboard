/**
 * GitHub Copilot API Test Utility
 * 
 * Usage: Paste this into your browser console to test API calls
 */

// Test configuration
const testConfig = {
  org: 'YOUR_ORG_NAME',           // Replace with your org
  token: 'YOUR_TOKEN_HERE',       // Replace with your token (ghp_xxx)
  since: '2025-10-10',           // Optional: start date
  until: '2025-11-07',           // Optional: end date
  team_slug: ''                  // Optional: team slug
}

// Quick test function
async function testGitHubCopilotAPI(config = testConfig) {
  console.log('🧪 Testing GitHub Copilot API...')
  console.log('📋 Configuration:', {
    org: config.org,
    hasToken: !!config.token,
    tokenPrefix: config.token?.substring(0, 4),
    dateRange: { since: config.since, until: config.until },
    teamSlug: config.team_slug || '(org-wide)'
  })

  // Build URL
  const baseUrl = 'https://api.github.com'
  const endpoint = config.team_slug
    ? `${baseUrl}/enterprises/${config.org}/team/${config.team_slug}/copilot/metrics`
    : `${baseUrl}/enterprises/${config.org}/copilot/metrics`

  const params = new URLSearchParams()
  if (config.since) params.append('since', config.since)
  if (config.until) params.append('until', config.until)

  const url = params.toString() ? `${endpoint}?${params}` : endpoint

  console.log('📤 Request URL:', url)

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/vnd.github+json',
        'Authorization': `Bearer ${config.token}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
    })

    console.log('📥 Response Status:', response.status, response.statusText)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ API Error:', errorText)
      
      // Provide helpful tips
      if (response.status === 401) {
        console.error('💡 Tips:')
        console.error('   - Verify token is valid and not expired')
        console.error('   - Token must have scope: manage_billing:copilot, read:org, or read:enterprise')
        console.error('   - Check token format: ghp_xxx or github_pat_xxx')
        console.error('   - Create new token: https://github.com/settings/tokens')
      } else if (response.status === 404) {
        console.error('💡 Tips:')
        console.error('   - Verify org name is correct (case-sensitive)')
        console.error('   - Check: https://github.com/' + config.org)
        console.error('   - Verify Copilot is enabled for your org')
        console.error('   - If using team, verify team exists')
      } else if (response.status === 403) {
        console.error('💡 Tips:')
        console.error('   - Ensure you are an organization owner or admin')
        console.error('   - Check: https://github.com/enterprises/' + config.org + '/people')
        console.error('   - Verify API rate limits have not been exceeded')
      } else if (response.status === 422) {
        console.error('💡 Tips:')
        console.error('   - Use date format: YYYY-MM-DD (e.g., 2025-11-07)')
        console.error('   - Ensure: since < until')
        console.error('   - Use dates within last 28 days')
      }
      
      return { success: false, error: errorText, status: response.status }
    }

    const data = await response.json()
    console.log('✅ Success! Data received:')
    console.log('   Records:', data.length)
    
    if (data.length > 0) {
      console.log('   Date Range:', {
        from: data[0]?.date,
        to: data[data.length - 1]?.date
      })
      console.log('   First Record:', data[0])
    } else {
      console.warn('⚠️ No data returned. Tips:')
      console.warn('   - Extend date range (try last 28 days)')
      console.warn('   - Remove team filter to get org-wide data')
      console.warn('   - Verify org has 5+ active Copilot users')
    }

    return { success: true, data, recordCount: data.length }

  } catch (error) {
    console.error('💥 Network Error:', error)
    console.error('💡 Tips:')
    console.error('   - Check internet connection')
    console.error('   - Verify GitHub API is accessible')
    console.error('   - Check GitHub Status: https://www.githubstatus.com/')
    return { success: false, error: error.message }
  }
}

// Quick validation function
function validateConfig(config = testConfig) {
  console.log('🔍 Validating Configuration...')
  const errors = []

  if (!config.org || config.org === 'YOUR_ORG_NAME') {
    errors.push('❌ Organization name is required')
  }

  if (!config.token || config.token === 'YOUR_TOKEN_HERE') {
    errors.push('❌ Personal access token is required')
  } else {
    if (!config.token.startsWith('ghp_') && !config.token.startsWith('github_pat_')) {
      errors.push('⚠️ Token format unusual (should start with ghp_ or github_pat_)')
    }
  }

  if (config.since) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(config.since)) {
      errors.push('❌ "since" date format must be YYYY-MM-DD')
    }
  }

  if (config.until) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(config.until)) {
      errors.push('❌ "until" date format must be YYYY-MM-DD')
    }
  }

  if (config.since && config.until && config.since > config.until) {
    errors.push('❌ "since" date must be before "until" date')
  }

  if (errors.length === 0) {
    console.log('✅ Configuration is valid!')
    return true
  } else {
    console.error('❌ Configuration errors:')
    errors.forEach(err => console.error('  ', err))
    return false
  }
}

// Check rate limits
async function checkRateLimits(token = testConfig.token) {
  console.log('🔍 Checking GitHub API Rate Limits...')
  
  try {
    const response = await fetch('https://api.github.com/rate_limit', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
      }
    })

    if (!response.ok) {
      console.error('❌ Failed to check rate limits')
      return
    }

    const data = await response.json()
    console.log('Rate Limits:', {
      core: {
        limit: data.resources.core.limit,
        remaining: data.resources.core.remaining,
        reset: new Date(data.resources.core.reset * 1000).toLocaleString()
      }
    })

    if (data.resources.core.remaining < 10) {
      console.warn('⚠️ Rate limit is low! Remaining:', data.resources.core.remaining)
    } else {
      console.log('✅ Rate limit OK')
    }

  } catch (error) {
    console.error('💥 Error checking rate limits:', error)
  }
}

// Export for use
console.log('🛠️ GitHub Copilot API Test Utility Loaded!')
console.log('')
console.log('📖 Usage:')
console.log('1. Update testConfig with your values:')
console.log('   testConfig.org = "your-org-name"')
console.log('   testConfig.token = "ghp_your_token"')
console.log('')
console.log('2. Validate configuration:')
console.log('   validateConfig()')
console.log('')
console.log('3. Test API call:')
console.log('   await testGitHubCopilotAPI()')
console.log('')
console.log('4. Check rate limits:')
console.log('   await checkRateLimits()')
console.log('')
console.log('💡 Or test directly:')
console.log('   await testGitHubCopilotAPI({ org: "myorg", token: "ghp_xxx" })')
