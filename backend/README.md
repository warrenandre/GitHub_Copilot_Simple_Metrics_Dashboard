# Backend API Server

Express.js proxy server for GitHub Copilot metrics API.

## Purpose

The backend server:
- **Proxies GitHub API requests** to avoid CORS restrictions
- **Handles 30-day report downloads** from Azure CDN server-side
- **Serves the built React app** in production mode

## Tech Stack

- **Express.js** - Web server
- **CORS middleware** - Cross-origin support
- **Node.js ES Modules** - Modern JavaScript

## Getting Started

### Install Dependencies
```bash
npm install
```

### Development
```bash
npm run dev
```
Runs on `http://localhost:3000`

### Production
```bash
npm start
```
Serves both API endpoints and the built frontend app.

## API Endpoints

### Health Check
```
GET /api/health
```

### Standard Metrics
```
GET /api/github/metrics?org={org}&level={level}
Authorization: Bearer {token}
```

### 30-Day Reports
```
POST /api/github/metrics/30-day
Content-Type: application/json
Authorization: Bearer {token}

Body:
{
  "org": "organization-name",
  "level": "enterprise|organization",
  "reportType": "usage|team"
}
```

### User Reports
```
POST /api/github/metrics/30-day/users
```

### Seats Data
```
GET /api/github/seats?org={org}&level={level}
Authorization: Bearer {token}
```

### Agents Data
```
GET /api/github/agents?org={org}
Authorization: Bearer {token}
```

## Environment Variables

- `PORT` - Server port (default: 3000)

## Production Deployment

In production mode, the server:
1. Serves API endpoints at `/api/*`
2. Serves static files from `../frontend/dist/`
3. Routes all other requests to `index.html` (SPA routing)

Build the frontend first:
```bash
cd ../frontend
npm run build
cd ../backend
npm start
```

## Documentation

See [../docs/BACKEND_PROXY.md](../docs/BACKEND_PROXY.md) for complete architecture and usage details.
