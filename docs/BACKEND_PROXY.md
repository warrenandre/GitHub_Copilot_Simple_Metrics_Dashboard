# Backend Proxy Server

## Overview

The backend proxy server eliminates CORS issues when fetching GitHub Copilot metrics data, particularly for 30-day reports that are hosted on Azure CDN.

Previously, the application used a workaround where users had to:
1. Request a download link
2. Open the link in a new tab
3. Save the JSON file
4. Upload it back to the application

With the backend proxy, users can now:
1. Click "Download 30-Day Metrics"
2. Data is fetched automatically via the backend proxy
3. No manual file download/upload required

## Architecture

```
Frontend (React + Vite)
    ↓
Vite Dev Server (Port 5173)
    ↓ (Proxy /api/* → http://localhost:3000)
Backend Proxy Server (Express on Port 3000)
    ↓
GitHub API + Azure CDN
```

The proxy server runs on `localhost:3000` and handles all API calls server-side, bypassing CORS restrictions that browsers enforce.

## Endpoints

### Health Check
- **GET** `/api/health`
- Returns: `{ status: "ok", timestamp: "..." }`

### Standard Metrics
- **GET** `/api/github/metrics?org={org}&level={level}&token={token}`
- Fetches standard Copilot metrics from GitHub API
- Query Parameters:
  - `org`: Organization or enterprise name
  - `level`: "enterprise" or "organization"
  - `token`: GitHub Personal Access Token (can also be in Authorization header)
  - `since`: Optional start date (YYYY-MM-DD)
  - `until`: Optional end date (YYYY-MM-DD)
  - `team_slug`: Optional team slug for team-level metrics

### 30-Day Metrics
- **POST** `/api/github/metrics/30-day`
- Fetches 30-day report from GitHub API and downloads data from Azure CDN
- Request Body:
  ```json
  {
    "org": "your-org",
    "level": "enterprise"
  }
  ```
- Authorization Header: `Bearer YOUR_GITHUB_TOKEN`
- Response:
  ```json
  {
    "success": true,
    "data": [...], // Array of metrics data
    "metadata": {
      "report_start_day": "2026-01-01",
      "report_end_day": "2026-01-28"
    }
  }
  ```

### User 30-Day Metrics
- **POST** `/api/github/metrics/30-day/users`
- Similar to above but for user-level 30-day reports

### Seats API
- **GET** `/api/github/seats?org={org}&level={level}&token={token}`
- Fetches Copilot billing seats data

### Agents API
- **GET** `/api/github/agents?org={org}&token={token}`
- Fetches Copilot agents metrics (enterprise only)
- Query Parameters:
  - `since`, `until`: Optional date range

## Running the Server

### Development Mode

#### Frontend Only
```bash
npm run dev:frontend
# Or: cd frontend && npm run dev
```
Frontend runs on `http://localhost:5173`

#### Backend Only
```bash
npm run dev:backend
# Or: cd backend && npm run dev
```
Backend runs on `http://localhost:3000`

#### Frontend + Backend Together
```bash
npm run dev
```

### Production Mode

```bash
# Build the React app (creates frontend/dist/)
npm run build

# Start the production server (serves both API and static files)
npm start
```

The server will serve:
- API endpoints at `http://localhost:3000/api/*`
- Built React app at `http://localhost:3000`

# Start the production server (serves both API and static files)
npm start
```

## Environment Variables

The backend server supports the following environment variables:

- `PORT` - Server port (default: 3000)

The frontend uses:

- `VITE_API_PROXY_URL` - Backend proxy URL (default: "/api" for dev, can be full URL for production)

## How It Works

### 30-Day Metrics Flow

1. **Frontend** calls `githubApiService.fetch30DayMetrics(config, level)`
2. **API Service** sends POST request to `/api/github/metrics/30-day` with authorization header
3. **Backend Proxy**:
   - Receives request with GitHub token
   - Calls GitHub API to get report metadata
   - Extracts download URL from metadata
   - Fetches actual data from Azure CDN (server-side, no CORS)
   - Returns data directly to frontend
4. **Frontend** receives data and saves to localStorage

### Standard Metrics Flow

1. **Frontend** calls `githubApiService.fetchFromGitHub(config, level)`
2. **API Service** sends GET request to `/api/github/metrics?...` with authorization header
3. **Backend Proxy**:
   - Receives request with GitHub token
   - Calls GitHub API
   - Returns data to frontend
4. **Frontend** receives data

## Benefits

1. **No CORS Issues**: Server-side fetching bypasses browser CORS restrictions
2. **Simplified UX**: Single-click download instead of manual file handling
3. **Consistent Flow**: All API calls go through the same proxy
4. **Production Ready**: Serves both API and static files in production

## Security Considerations

- GitHub tokens are passed via Authorization headers, not stored on the server
- CORS is configured to only allow requests from the frontend origin
- No persistent storage of credentials
- Rate limiting can be added if needed

## Troubleshooting

### Backend Server Not Starting

Check if port 3000 is already in use:
```bash
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess
```

### CORS Errors in Production

Make sure the frontend URL is included in the CORS configuration in `server.js`

### 30-Day Metrics Download Failing

1. Check GitHub token has required scopes: `manage_billing:copilot`
2. Verify organization/enterprise name is correct
3. Check backend server logs for detailed error messages

## File Structure

- `/server.js` - Express backend proxy server
- `/src/services/githubApi.ts` - Frontend API service (calls proxy)
- `/vite.config.ts` - Vite proxy configuration
- `/package.json` - Scripts for running backend + frontend

## Future Enhancements

- [ ] Add caching for frequently requested metrics
- [ ] Implement rate limiting
- [ ] Add authentication middleware
- [ ] Support for webhook notifications when new metrics are available
- [ ] Auto-refresh for live dashboards
