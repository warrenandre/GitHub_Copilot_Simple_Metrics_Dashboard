import { Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { DashboardProvider } from './contexts/DashboardContext'
import Layout from './components/Layout'
import DashboardSetup from './pages/DashboardSetup'
import GeneratedDashboard from './pages/GeneratedDashboard'
import Admin from './pages/Admin'

// Wrapper component to check if dashboard is configured
const DashboardRedirect = () => {
  const savedConfig = localStorage.getItem('copilot_dashboard_config')
  if (savedConfig) {
    try {
      const config = JSON.parse(savedConfig)
      if (config.level && config.selectedMetrics?.length > 0) {
        return <Navigate to="/dashboard" replace />
      }
    } catch {
      // Invalid config, go to setup
    }
  }
  return <Navigate to="/setup" replace />
}

function App() {
  return (
    <ThemeProvider>
      <DashboardProvider>
        <Routes>
          {/* Home - redirects to dashboard or setup */}
          <Route path="/" element={<DashboardRedirect />} />
          
          {/* Dashboard Setup Wizard */}
          <Route path="/setup" element={<DashboardSetup />} />
          
          {/* Generated Dashboard */}
          <Route path="/dashboard" element={
            <Layout>
              <GeneratedDashboard />
            </Layout>
          } />
          
          {/* Admin Route for API Configuration */}
          <Route path="/admin" element={
            <Layout>
              <Admin />
            </Layout>
          } />
        </Routes>
      </DashboardProvider>
    </ThemeProvider>
  )
}

export default App
