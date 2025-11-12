import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import Layout from './components/Layout'
import Home from './pages/Home'
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
          {/* Home Route */}
          <Route path="/" element={<Home />} />
          
          {/* Demo Routes */}
          <Route path="/demo" element={<Overview />} />
          <Route path="/demo/usage" element={<Usage />} />
          <Route path="/demo/performance" element={<Performance />} />
          <Route path="/demo/adoption" element={<Adoption />} />
          
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
