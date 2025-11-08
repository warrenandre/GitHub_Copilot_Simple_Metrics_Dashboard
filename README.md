# GitHub Copilot Metrics Dashboard

A modern, responsive React application for visualizing GitHub Copilot metrics and analytics. Built with React, TypeScript, Vite, and Nivo charts.

![GitHub Copilot Dashboard](https://img.shields.io/badge/React-18.2-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue) ![Vite](https://img.shields.io/badge/Vite-5.0-purple)

## Features

✨ **Modern UI** - Clean, dark-themed interface with smooth transitions
📊 **Rich Visualizations** - Interactive charts using Nivo (Line, Bar, Pie charts)
📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
🎯 **Multiple Dashboards** - Organized by metric categories:
  - **Overview** - Key metrics and high-level insights
  - **Usage Metrics** - Detailed usage patterns and trends
  - **Performance** - Acceptance rates and productivity metrics
  - **Adoption** - User engagement and adoption analytics

## Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Nivo** - Beautiful, responsive charts
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **Lucide React** - Modern icon library

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd GHCPDashboardApp
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### API Configuration

The app supports multiple ways to configure the GitHub Copilot Metrics API:

**Option 1: Admin UI (Recommended)**
1. Navigate to `/admin` in the app
2. Enter your GitHub organization name and personal access token
3. Configure date ranges and team settings
4. Download metrics data

**Option 2: Local Config File**
```bash
# Copy the example config
cp src/config/apiConfig.local.example.ts src/config/apiConfig.local.ts

# Edit with your credentials (this file is git-ignored)
# Update apiConfig.ts to import your local config
```

**Option 3: Environment Variables**
```bash
# Create .env.local file
echo "VITE_GITHUB_ORG=your-org" >> .env.local
echo "VITE_GITHUB_TOKEN=ghp_your_token" >> .env.local

# Update src/config/apiConfig.ts to read from env
```

📖 For detailed configuration instructions, see [docs/API_CONFIGURATION.md](docs/API_CONFIGURATION.md)

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main layout with sidebar
│   ├── MetricCard.tsx  # Metric display cards
│   ├── LineChart.tsx   # Line chart component
│   ├── BarChart.tsx    # Bar chart component
│   └── PieChart.tsx    # Pie chart component
├── config/             # Configuration files
│   ├── apiConfig.ts    # API configuration with validation
│   └── apiConfig.local.example.ts  # Example local config
├── pages/              # Page components
│   ├── Overview.tsx    # Dashboard overview
│   ├── Usage.tsx       # Usage metrics
│   ├── Performance.tsx # Performance analytics
│   ├── Adoption.tsx    # Adoption metrics
│   ├── Admin.tsx       # API configuration page
│   └── live/           # Live data pages
├── services/           # API and services
│   ├── api.ts          # Mock data service
│   ├── githubApi.ts    # GitHub API integration
│   └── dataTransform.ts # Data transformation
├── types/              # TypeScript type definitions
│   └── metrics.ts      # Metrics data types
├── App.tsx             # Main app component
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## GitHub Copilot API Integration

The app integrates with the GitHub Copilot Metrics API to display real-time metrics for your organization.

### Features

- **Demo Data Mode** - Explore the dashboard with mock data
- **Live Data Mode** - Connect to real GitHub API for your org metrics
- **Admin Console** - Easy configuration interface with validation
- **Secure Storage** - API config stored securely (tokens never committed)
- **Auto-Refresh** - Live pages refresh automatically every 5 minutes
- **Dual Storage** - Data saved to both localStorage and local files for persistence

### Setting Up

1. **Get a Personal Access Token**:
   - Go to GitHub Settings → Developer settings → Personal access tokens
   - Create a token with `manage_billing:copilot`, `read:org`, or `read:enterprise` scope
   - You must be an organization owner

2. **Configure in the App**:
   - Navigate to `/admin`
   - Enter your org name and token
   - Set optional date range and team slug
   - Click "Download & Save Locally"

3. **Save Data File** (Optional for persistence):
   - A JSON file will be downloaded to your Downloads folder
   - Move it to `public/data/` folder in the project
   - Rename to `copilot-metrics.json`
   - The app will automatically load from this file if localStorage is empty

4. **View Live Metrics**:
   - Navigate to Live Data pages
   - Data automatically loads from localStorage or local file
   - Refresh anytime or wait for auto-refresh

### Data Storage

The app uses a dual-storage approach:

1. **localStorage** (Primary) - Fast, immediate access for current browser session
2. **Local File** (Backup) - `/public/data/copilot-metrics.json` for persistence across sessions

When you download data from Admin page:
- Data is saved to localStorage automatically
- A JSON file is downloaded to your Downloads folder
- Manually move this file to `public/data/copilot-metrics.json` for automatic loading

The live pages will:
1. Check localStorage first (fastest)
2. Fall back to loading from `/public/data/copilot-metrics.json` if localStorage is empty
3. Save file data to localStorage for faster subsequent access

### Requirements

- Organization with 5+ active Copilot licenses
- Organization owner permissions
- Personal access token with correct scopes
- Copilot Metrics API access enabled

For detailed documentation: [docs/API_CONFIGURATION.md](docs/API_CONFIGURATION.md)

API Documentation: [GitHub Copilot Metrics API](https://docs.github.com/en/rest/copilot/copilot-metrics)

### Debugging API Issues

If you encounter issues calling the GitHub Copilot API:

📖 **Quick Start**: See [DEBUGGING_QUICK_START.md](DEBUGGING_QUICK_START.md) for common errors and quick fixes

📖 **Full Guide**: See [docs/DEBUGGING_API.md](docs/DEBUGGING_API.md) for comprehensive debugging steps

**Quick Debug Checklist:**
1. Open Browser DevTools (F12) → Console tab
2. Look for detailed debug logs (🔍 📤 📥 ✅ or ❌ emojis)
3. Check Network tab for API request/response
4. Verify token has correct scopes
5. Test with curl to isolate issues

## Customization

### Themes

Edit `tailwind.config.js` to customize colors:
```js
theme: {
  extend: {
    colors: {
      primary: { /* your colors */ }
    }
  }
}
```

### Charts

Chart configurations are in individual component files (`src/components/*Chart.tsx`). Modify Nivo chart props to customize appearance and behavior.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your own purposes.

## Acknowledgments

- GitHub Copilot for powering AI-assisted development
- Nivo for excellent chart components
- The React and Vite communities
