import { ReactNode, useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Github,
  Menu,
  X,
  Settings,
  Sliders,
  RefreshCw,
} from 'lucide-react'
import { initAppMetadata, checkSystemState, startPeriodicValidation, monitorFooterElement } from '../utils/integrity'
import { useFooterProtection } from '../hooks/useFooterProtection'
import { useDashboard } from '../contexts/DashboardContext'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { config, resetDashboard } = useDashboard()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [footerText, setFooterText] = useState('Developed by Warren Joubert - Microsoft Software Engineer')
  const [appReady, setAppReady] = useState(true)

  // Activate footer protection
  useFooterProtection();

  useEffect(() => {
    try {
      if (checkSystemState()) {
        const metadata = initAppMetadata();
        setFooterText(metadata);
        setAppReady(true);
        
        // Start periodic validation and monitoring
        startPeriodicValidation();
        monitorFooterElement();
      } else {
        console.error('System state validation failed');
        setAppReady(false);
      }
    } catch (error) {
      console.error('Configuration error:', error);
      setAppReady(false);
    }
  }, []);

  const handleReconfigureDashboard = () => {
    resetDashboard()
    navigate('/setup')
  }

  if (!appReady) {
    return <div className="flex h-screen w-screen bg-black"></div>;
  }

  return (
    <div className="flex h-screen bg-slate-900 dark:bg-slate-900 light:bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-50 w-64 bg-slate-800 dark:bg-slate-800 light:bg-white light:border-r light:border-gray-200 transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center gap-2 px-6 py-5 border-b border-slate-700 dark:border-slate-700 light:border-gray-200">
            <Github className="w-8 h-8 text-blue-500" />
            <div>
              <h1 className="text-lg font-bold text-white dark:text-white light:text-gray-900">Copilot</h1>
              <p className="text-xs text-slate-400 dark:text-slate-400 light:text-gray-500">Metrics Dashboard</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {/* Dashboard Link */}
            <Link
              to="/dashboard"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                location.pathname === '/dashboard'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 dark:text-slate-300 light:text-gray-700 hover:bg-slate-700 dark:hover:bg-slate-700 light:hover:bg-gray-100 hover:text-white dark:hover:text-white light:hover:text-gray-900'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="font-medium text-sm">Dashboard</span>
            </Link>

            {/* Dashboard Info */}
            {config?.level && (
              <div className="mx-4 mt-4 p-3 bg-slate-700/50 rounded-lg">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Current Dashboard</p>
                <p className="text-sm text-white font-medium">{config?.name || 'My Dashboard'}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {config?.level === 'enterprise' ? 'Enterprise' : 'Organization'} • {config?.selectedMetrics?.length || 0} metrics
                </p>
              </div>
            )}

            <div className="pt-4 border-t border-slate-700 dark:border-slate-700 light:border-gray-200 mt-4"></div>

            {/* Reconfigure Dashboard */}
            <button
              onClick={handleReconfigureDashboard}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors w-full text-left text-slate-300 dark:text-slate-300 light:text-gray-700 hover:bg-slate-700 dark:hover:bg-slate-700 light:hover:bg-gray-100 hover:text-white dark:hover:text-white light:hover:text-gray-900"
            >
              <Sliders className="w-5 h-5" />
              <span className="font-medium text-sm">Configure Dashboard</span>
            </button>

            <div className="pt-4 border-t border-slate-700 dark:border-slate-700 light:border-gray-200 mt-4"></div>

            {/* API Settings Link */}
            <Link
              to="/admin"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                location.pathname === '/admin'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 dark:text-slate-300 light:text-gray-700 hover:bg-slate-700 dark:hover:bg-slate-700 light:hover:bg-gray-100 hover:text-white dark:hover:text-white light:hover:text-gray-900'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium text-sm">API Settings</span>
            </Link>
          </nav>

          {/* Footer */}
          <div className="px-4 py-4 border-t border-slate-700 dark:border-slate-700 light:border-gray-200" data-footer-protected="true">
            <p id="app-footer-attribution" className="text-xs text-slate-500 dark:text-slate-500 light:text-gray-400 text-center">
              {footerText}
            </p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-slate-800 dark:bg-slate-800 light:bg-white border-b border-slate-700 dark:border-slate-700 light:border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-slate-300 dark:text-slate-300 light:text-gray-700 hover:text-white dark:hover:text-white light:hover:text-gray-900"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
                title="Refresh data"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="text-sm hidden sm:inline">Refresh</span>
              </button>
              <div className="text-right">
                <p className="text-sm font-medium text-white dark:text-white light:text-gray-900">Last Updated</p>
                <p className="text-xs text-slate-400 dark:text-slate-400 light:text-gray-500">
                  {new Date().toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-slate-900 dark:bg-slate-900 light:bg-gray-50 p-6">
          {children}
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}

export default Layout
