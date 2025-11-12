import { Link } from 'react-router-dom'
import { Github, BarChart3, TrendingUp, Users, Activity, Database, Zap, Settings, ArrowRight, CheckCircle } from 'lucide-react'

const Home = () => {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <Github className="w-20 h-20 text-blue-500" />
        </div>
        <h1 className="text-4xl font-bold text-white">GitHub Copilot Metrics Dashboard</h1>
        <p className="text-xl text-slate-400 max-w-3xl mx-auto">
          A comprehensive analytics platform for visualizing and analyzing GitHub Copilot usage, 
          performance, and adoption metrics across your enterprise.
        </p>
      </div>

      {/* Quick Start Guide */}
      <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Settings className="w-6 h-6 text-blue-400" />
          <h2 className="text-2xl font-semibold text-white">Quick Start Guide</h2>
        </div>
        <p className="text-slate-300 mb-4">
          Follow these simple steps to start visualizing your GitHub Copilot metrics:
        </p>
        
        <div className="space-y-4">
          {/* Step 1 */}
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              1
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-1">Generate a Personal Access Token</h3>
              <p className="text-sm text-slate-300">
                Go to GitHub Settings → Developer settings → Personal access tokens → Generate new token
              </p>
              <p className="text-sm text-slate-400 mt-1">
                Required scopes: <code className="bg-slate-900 px-2 py-0.5 rounded text-blue-400">manage_billing:copilot</code>,{' '}
                <code className="bg-slate-900 px-2 py-0.5 rounded text-blue-400">read:org</code>, or{' '}
                <code className="bg-slate-900 px-2 py-0.5 rounded text-blue-400">read:enterprise</code>
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              2
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-1">Navigate to Admin Settings</h3>
              <p className="text-sm text-slate-300">
                Click on the{' '}
                <Link to="/admin" className="text-purple-400 hover:text-purple-300 underline inline-flex items-center gap-1">
                  Admin Settings <ArrowRight className="w-3 h-3" />
                </Link>{' '}
                page in the sidebar menu
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              3
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-1">Configure API Settings</h3>
              <p className="text-sm text-slate-300 mb-2">
                Enter your GitHub enterprise name and personal access token
              </p>
              <ul className="text-sm text-slate-400 space-y-1 list-disc list-inside ml-2">
                <li>Optionally set a date range (defaults to last 28 days)</li>
                <li>Optionally specify a team slug for team-specific metrics</li>
              </ul>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              4
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-1">Download Metrics Data</h3>
              <p className="text-sm text-slate-300 mb-2">
                Click "Download Metrics Data" to fetch and store your Copilot usage metrics
              </p>
              <p className="text-sm text-slate-300">
                Optionally download "Agents Data" for Copilot Agents metrics
              </p>
            </div>
          </div>

          {/* Step 5 */}
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              5
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-1">Explore Your Data</h3>
              <p className="text-sm text-slate-300">
                Navigate to the Live Data section to view your metrics with interactive charts and insights
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-blue-500/30">
          <Link 
            to="/admin"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
            Go to Admin Settings
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Org Metrics */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-semibold text-white">Organization Metrics</h2>
          </div>
          <p className="text-slate-300 mb-4">
            Explore demo data or connect to your live GitHub organization to track:
          </p>
          <ul className="space-y-2 text-sm text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
              <span><strong>Demo Data:</strong> Pre-loaded sample metrics for exploration</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
              <span><strong>Live Data:</strong> Real-time metrics from your GitHub organization</span>
            </li>
          </ul>
        </div>

        {/* Enterprise Metrics */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-6 h-6 text-orange-400" />
            <h2 className="text-xl font-semibold text-white">Enterprise Metrics</h2>
          </div>
          <p className="text-slate-300 mb-4">
            Advanced analytics for enterprise-wide insights:
          </p>
          <ul className="space-y-2 text-sm text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
              <span><strong>Usage Analytics:</strong> Comprehensive usage patterns and trends</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
              <span><strong>Agents Metrics:</strong> Track Copilot Agents adoption and engagement</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Available Metrics */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-white mb-4">Available Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Overview Metrics */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-400" />
              <h3 className="font-semibold text-white">Overview</h3>
            </div>
            <ul className="space-y-1 text-sm text-slate-300">
              <li>• Total Suggestions</li>
              <li>• Acceptance Rate</li>
              <li>• Active Users</li>
              <li>• Lines of Code</li>
              <li>• Chat Interactions</li>
            </ul>
          </div>

          {/* Usage Metrics */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-400" />
              <h3 className="font-semibold text-white">Usage</h3>
            </div>
            <ul className="space-y-1 text-sm text-slate-300">
              <li>• Daily Activity</li>
              <li>• Editor Breakdown</li>
              <li>• Language Usage</li>
              <li>• Trends Over Time</li>
              <li>• User Engagement</li>
            </ul>
          </div>

          {/* Performance Metrics */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              <h3 className="font-semibold text-white">Performance</h3>
            </div>
            <ul className="space-y-1 text-sm text-slate-300">
              <li>• Acceptance Trends</li>
              <li>• Lines Suggested</li>
              <li>• Lines Accepted</li>
              <li>• Efficiency Metrics</li>
              <li>• Quality Indicators</li>
            </ul>
          </div>

          {/* Adoption Metrics */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-400" />
              <h3 className="font-semibold text-white">Adoption</h3>
            </div>
            <ul className="space-y-1 text-sm text-slate-300">
              <li>• User Growth</li>
              <li>• Active vs Total Users</li>
              <li>• Team Penetration</li>
              <li>• Feature Adoption</li>
              <li>• Engagement Levels</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Try Demo Data */}
      <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Zap className="w-6 h-6 text-green-400" />
          <h2 className="text-2xl font-semibold text-white">Try Demo Data</h2>
        </div>
        <p className="text-slate-300 mb-4">
          Not ready to connect your GitHub account? Explore the dashboard with pre-loaded demo data 
          to see all available features and visualizations.
        </p>
        <Link 
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
        >
          <Database className="w-5 h-5" />
          View Demo Dashboard
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Requirements */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Requirements</h2>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <span>Enterprise or organization with 5+ active Copilot licenses</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <span>Organization owner or enterprise administrator permissions</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <span>Personal access token with appropriate scopes</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <span>Copilot Metrics API access enabled for your organization</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Home
