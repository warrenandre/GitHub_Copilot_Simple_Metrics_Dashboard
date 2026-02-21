import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// GitHub API configuration
const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_API_VERSION = '2022-11-28';

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * Proxy endpoint for GitHub Copilot Metrics API
 * GET /api/github/metrics
 */
app.get('/api/github/metrics', async (req, res) => {
  try {
    const { org, level, since, until, team_slug } = req.query;
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!org || !token) {
      return res.status(400).json({ error: 'Missing required parameters: org and token' });
    }

    // Construct GitHub API URL
    const baseUrl = level === 'enterprise'
      ? `${GITHUB_API_BASE}/enterprises/${org}/copilot/metrics`
      : `${GITHUB_API_BASE}/orgs/${org}/copilot/metrics`;

    const params = new URLSearchParams();
    if (since) params.append('since', since);
    if (until) params.append('until', until);
    if (team_slug) params.append('team_slug', team_slug);

    const url = `${baseUrl}?${params.toString()}`;

    console.log('📤 Proxying GitHub Metrics API:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/vnd.github+json',
        'Authorization': `Bearer ${token}`,
        'X-GitHub-Api-Version': GITHUB_API_VERSION,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ GitHub API Error:', response.status, errorText);
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    console.log('✅ Metrics data retrieved successfully');

    res.json(data);
  } catch (error) {
    console.error('❌ Proxy Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

/**
 * Proxy endpoint for GitHub Copilot Seats API
 * GET /api/github/seats
 */
app.get('/api/github/seats', async (req, res) => {
  try {
    const { org, level } = req.query;
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!org || !token) {
      return res.status(400).json({ error: 'Missing required parameters: org and token' });
    }

    const url = level === 'enterprise'
      ? `${GITHUB_API_BASE}/enterprises/${org}/copilot/billing/seats`
      : `${GITHUB_API_BASE}/orgs/${org}/copilot/billing/seats`;

    console.log('📤 Proxying GitHub Seats API:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/vnd.github+json',
        'Authorization': `Bearer ${token}`,
        'X-GitHub-Api-Version': GITHUB_API_VERSION,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ GitHub API Error:', response.status, errorText);
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    console.log('✅ Seats data retrieved successfully');

    res.json(data);
  } catch (error) {
    console.error('❌ Proxy Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

/**
 * Proxy endpoint for 30-day report metadata and download
 * POST /api/github/metrics/30-day
 */
app.post('/api/github/metrics/30-day', async (req, res) => {
  try {
    const { org, level } = req.body;
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!org || !token) {
      return res.status(400).json({ error: 'Missing required parameters: org and token' });
    }

    // Step 1: Get report metadata
    const metadataUrl = level === 'enterprise'
      ? `${GITHUB_API_BASE}/enterprises/${org}/copilot/metrics/reports/enterprise-28-day/latest`
      : `${GITHUB_API_BASE}/orgs/${org}/copilot/metrics/reports/organization-28-day/latest`;

    console.log('📤 Requesting 30-day report metadata:', metadataUrl);

    const metadataResponse = await fetch(metadataUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/vnd.github+json',
        'Authorization': `Bearer ${token}`,
        'X-GitHub-Api-Version': GITHUB_API_VERSION,
      },
    });

    if (!metadataResponse.ok) {
      const errorText = await metadataResponse.text();
      console.error('❌ GitHub API Error:', metadataResponse.status, errorText);
      return res.status(metadataResponse.status).json({ error: errorText });
    }

    const metadata = await metadataResponse.json();
    console.log('✅ Report metadata received');

    // Step 2: Extract download URL
    const downloadUrl = metadata.download_links?.[0] || metadata.download_url;
    
    if (!downloadUrl) {
      console.error('❌ No download URL found in metadata');
      return res.status(404).json({ error: 'No download URL found in report metadata' });
    }

    console.log('📥 Downloading metrics data from Azure CDN...');

    // Step 3: Download the actual data (this bypasses CORS)
    const dataResponse = await fetch(downloadUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!dataResponse.ok) {
      const errorText = await dataResponse.text();
      console.error('❌ Download Error:', dataResponse.status, errorText);
      return res.status(dataResponse.status).json({ error: 'Failed to download metrics data' });
    }

    const metricsData = await dataResponse.json();
    console.log('✅ Metrics data downloaded successfully');
    console.log('   Records:', Array.isArray(metricsData) ? metricsData.length : 'N/A');

    // Step 4: Return data with metadata
    res.json({
      success: true,
      data: metricsData,
      metadata: {
        report_start_day: metadata.report_start_day,
        report_end_day: metadata.report_end_day,
        downloadedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('❌ Proxy Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

/**
 * Proxy endpoint for user 30-day report
 * POST /api/github/metrics/30-day/users
 */
app.post('/api/github/metrics/30-day/users', async (req, res) => {
  try {
    const { org } = req.body;
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!org || !token) {
      return res.status(400).json({ error: 'Missing required parameters: org and token' });
    }

    // Step 1: Get report metadata
    const metadataUrl = `${GITHUB_API_BASE}/enterprises/${org}/copilot/metrics/reports/users-28-day/latest`;

    console.log('📤 Requesting user 30-day report metadata:', metadataUrl);

    const metadataResponse = await fetch(metadataUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/vnd.github+json',
        'Authorization': `Bearer ${token}`,
        'X-GitHub-Api-Version': GITHUB_API_VERSION,
      },
    });

    if (!metadataResponse.ok) {
      const errorText = await metadataResponse.text();
      console.error('❌ GitHub API Error:', metadataResponse.status, errorText);
      return res.status(metadataResponse.status).json({ error: errorText });
    }

    const metadata = await metadataResponse.json();
    console.log('✅ User report metadata received');

    // Step 2: Extract download URL
    const downloadUrl = metadata.download_links?.[0] || metadata.download_url;
    
    if (!downloadUrl) {
      console.error('❌ No download URL found in metadata');
      return res.status(404).json({ error: 'No download URL found in report metadata' });
    }

    console.log('📥 Downloading user metrics data from Azure CDN...');

    // Step 3: Download the actual data
    const dataResponse = await fetch(downloadUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!dataResponse.ok) {
      const errorText = await dataResponse.text();
      console.error('❌ Download Error:', dataResponse.status, errorText);
      return res.status(dataResponse.status).json({ error: 'Failed to download user metrics data' });
    }

    const metricsData = await dataResponse.json();
    console.log('✅ User metrics data downloaded successfully');

    // Step 4: Return data with metadata
    res.json({
      success: true,
      data: metricsData,
      metadata: {
        report_start_day: metadata.report_start_day,
        report_end_day: metadata.report_end_day,
        downloadedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('❌ Proxy Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Serve static files from the React app (in production)
app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));

// The "catchall" handler: for any request that doesn't match an API route,
// send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`   API endpoints available at http://localhost:${PORT}/api`);
  console.log(`   Health check: http://localhost:${PORT}/api/health`);
});
