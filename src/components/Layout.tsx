import { ReactNode, useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Activity,
  TrendingUp,
  Users,
  Github,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Database,
  Zap,
  Settings,
  Building2,
  Building,
  BarChart3,
} from 'lucide-react'
import { initAppMetadata, checkSystemState } from '../utils/integrity'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [orgMetricsExpanded, setOrgMetricsExpanded] = useState(true)
  const [demoExpanded, setDemoExpanded] = useState(true)
  const [liveExpanded, setLiveExpanded] = useState(false)
  const [enterpriseExpanded, setEnterpriseExpanded] = useState(true)
  const [footerText, setFooterText] = useState('Developed by Warren Joubert - Microsoft Software Engineer')
  const [appReady, setAppReady] = useState(true)

  useEffect(() => {
    try {
      if (checkSystemState()) {
        const metadata = initAppMetadata();
        setFooterText(metadata);
        setAppReady(true);
      } else {
        console.error('System state validation failed');
        setAppReady(false);
      }
    } catch (error) {
      console.error('Configuration error:', error);
      setAppReady(false);
    }
  }, []);

  if (!appReady) {
    return <div className="flex h-screen w-screen bg-black"></div>;
  }

  const menuCategories = [
    { path: '/', label: 'Overview', icon: LayoutDashboard },
    { path: '/usage', label: 'Usage Metrics', icon: Activity },
    { path: '/performance', label: 'Performance', icon: TrendingUp },
    { path: '/adoption', label: 'Adoption', icon: Users },
  ]

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
            {/* Org Metrics Section */}
            <div>
              <button
                onClick={() => setOrgMetricsExpanded(!orgMetricsExpanded)}
                className="flex items-center justify-between w-full px-4 py-2 text-slate-400 dark:text-slate-400 light:text-gray-600 hover:text-white dark:hover:text-white light:hover:text-gray-900 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  <span className="font-semibold text-sm uppercase tracking-wider">Org Metrics</span>
                </div>
                {orgMetricsExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
              {orgMetricsExpanded && (
                <div className="mt-1 space-y-2 ml-2">
                  {/* Demo Section */}
                  <div>
                    <button
                      onClick={() => setDemoExpanded(!demoExpanded)}
                      className="flex items-center justify-between w-full px-4 py-2 text-slate-400 dark:text-slate-400 light:text-gray-600 hover:text-white dark:hover:text-white light:hover:text-gray-900 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Database className="w-5 h-5" />
                        <span className="font-semibold text-sm uppercase tracking-wider">Demo Data</span>
                      </div>
                      {demoExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                    {demoExpanded && (
                      <div className="mt-1 space-y-1 ml-2">
                        {menuCategories.map((item) => {
                          const Icon = item.icon
                          const isActive = location.pathname === item.path
                          return (
                            <Link
                              key={item.path}
                              to={item.path}
                              onClick={() => setSidebarOpen(false)}
                              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                                isActive
                                  ? 'bg-blue-600 text-white'
                                  : 'text-slate-300 dark:text-slate-300 light:text-gray-700 hover:bg-slate-700 dark:hover:bg-slate-700 light:hover:bg-gray-100 hover:text-white dark:hover:text-white light:hover:text-gray-900'
                              }`}
                            >
                              <Icon className="w-5 h-5" />
                              <span className="font-medium text-sm">{item.label}</span>
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  {/* Live Section */}
                  <div className="pt-2">
                    <button
                      onClick={() => setLiveExpanded(!liveExpanded)}
                      className="flex items-center justify-between w-full px-4 py-2 text-slate-400 dark:text-slate-400 light:text-gray-600 hover:text-white dark:hover:text-white light:hover:text-gray-900 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        <span className="font-semibold text-sm uppercase tracking-wider">Live Data</span>
                      </div>
                      {liveExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                    {liveExpanded && (
                      <div className="mt-1 space-y-1 ml-2">
                        {menuCategories.map((item) => {
                          const Icon = item.icon
                          const livePath = `/live${item.path === '/' ? '' : item.path}`
                          const isActive = location.pathname === livePath
                          return (
                            <Link
                              key={livePath}
                              to={livePath}
                              onClick={() => setSidebarOpen(false)}
                              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                                isActive
                                  ? 'bg-green-600 text-white'
                                  : 'text-slate-300 dark:text-slate-300 light:text-gray-700 hover:bg-slate-700 dark:hover:bg-slate-700 light:hover:bg-gray-100 hover:text-white dark:hover:text-white light:hover:text-gray-900'
                              }`}
                            >
                              <Icon className="w-5 h-5" />
                              <span className="font-medium text-sm">{item.label}</span>
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Enterprise Metrics Section */}
            <div className="pt-2">
              <button
                onClick={() => setEnterpriseExpanded(!enterpriseExpanded)}
                className="flex items-center justify-between w-full px-4 py-2 text-slate-400 dark:text-slate-400 light:text-gray-600 hover:text-white dark:hover:text-white light:hover:text-gray-900 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  <span className="font-semibold text-sm uppercase tracking-wider">Enterprise Metrics</span>
                </div>
                {enterpriseExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
              {enterpriseExpanded && (
                <div className="mt-1 space-y-1 ml-2">
                  <Link
                    to="/enterprise/usage-analytics"
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                      location.pathname === '/enterprise/usage-analytics'
                        ? 'bg-orange-600 text-white'
                        : 'text-slate-300 dark:text-slate-300 light:text-gray-700 hover:bg-slate-700 dark:hover:bg-slate-700 light:hover:bg-gray-100 hover:text-white dark:hover:text-white light:hover:text-gray-900'
                    }`}
                  >
                    <BarChart3 className="w-5 h-5" />
                    <span className="font-medium text-sm">Usage Analytics</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Admin Section */}
            <div className="pt-4 mt-4 border-t border-slate-700 dark:border-slate-700 light:border-gray-200">
              <Link
                to="/admin"
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                  location.pathname === '/admin'
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-300 dark:text-slate-300 light:text-gray-700 hover:bg-slate-700 dark:hover:bg-slate-700 light:hover:bg-gray-100 hover:text-white dark:hover:text-white light:hover:text-gray-900'
                }`}
              >
                <Settings className="w-5 h-5" />
                <span className="font-medium text-sm">Admin Settings</span>
              </Link>
            </div>
          </nav>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-700 dark:border-slate-700 light:border-gray-200">
            <p className="text-xs text-slate-400 dark:text-slate-400 light:text-gray-500">
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
            <div className="text-right">
              <p className="text-sm font-medium text-white dark:text-white light:text-gray-900">Last Updated</p>
              <p className="text-xs text-slate-400 dark:text-slate-400 light:text-gray-500">
                {new Date().toLocaleString()}
              </p>
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
