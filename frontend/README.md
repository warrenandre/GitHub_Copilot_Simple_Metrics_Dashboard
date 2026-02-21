# Frontend Application

React-based dashboard for visualizing GitHub Copilot metrics.

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Nivo Charts** - Data visualization
- **React Router** - Navigation

## Getting Started

### Install Dependencies
```bash
npm install
```

### Development
```bash
npm run dev
```
Runs on `http://localhost:5173`

The frontend proxies API requests from `/api/*` to the backend server at `http://localhost:3000` (configured in [vite.config.ts](vite.config.ts)).

### Build
```bash
npm run build
```
Creates optimized production build in `dist/` folder.

### Lint
```bash
npm run lint
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── config/         # API configuration
├── contexts/       # React contexts (theme, etc.)
├── data/           # Demo data
├── hooks/          # Custom React hooks
├── pages/          # Page components
│   ├── enterprise/ # Enterprise-level pages
│   │   ├── demo/   # Demo data views
│   │   └── live/   # Live data views
│   └── org/        # Organization-level pages
│       ├── demo/   # Demo data views
│       └── live/   # Live data views
├── services/       # API services
├── types/          # TypeScript types
└── utils/          # Utility functions
```

## Configuration

The application can be configured via:

1. **Admin UI** (`/admin` route) - Recommended
2. **Local Config File** - `src/config/apiConfig.local.ts`
3. **Environment Variables** - `.env.local` file

See [../docs/API_CONFIGURATION.md](../docs/API_CONFIGURATION.md) for details.

## API Integration

The frontend communicates with the backend proxy server to:
- Fetch GitHub Copilot metrics
- Download 30-day reports (bypassing CORS)
- Retrieve seats and agents data

All API calls are proxied through the backend to avoid CORS issues. See [../docs/BACKEND_PROXY.md](../docs/BACKEND_PROXY.md) for architecture details.
