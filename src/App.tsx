import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import Layout from './components/Layout'
import Overview from './pages/demo/Overview'
import Usage from './pages/demo/Usage'
import Performance from './pages/demo/Performance'
import Adoption from './pages/demo/Adoption'
import LiveOverview from './pages/live/Overview'
import LiveUsage from './pages/live/Usage'
import LivePerformance from './pages/live/Performance'
import LiveAdoption from './pages/live/Adoption'
import Admin from './pages/Admin'

function App() {
  return (
    <ThemeProvider>
      <Layout>
        <Routes>
          {/* Demo Routes */}
          <Route path="/" element={<Overview />} />
          <Route path="/usage" element={<Usage />} />
          <Route path="/performance" element={<Performance />} />
          <Route path="/adoption" element={<Adoption />} />
          
          {/* Live Routes */}
          <Route path="/live" element={<LiveOverview />} />
          <Route path="/live/usage" element={<LiveUsage />} />
          <Route path="/live/performance" element={<LivePerformance />} />
          <Route path="/live/adoption" element={<LiveAdoption />} />
          
          {/* Admin Route */}
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Layout>
    </ThemeProvider>
  )
}

export default App
