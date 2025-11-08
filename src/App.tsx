import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Overview from './pages/Overview'
import Usage from './pages/Usage'
import Performance from './pages/Performance'
import Adoption from './pages/Adoption'
import LiveOverview from './pages/live/Overview'
import LiveUsage from './pages/live/Usage'
import LivePerformance from './pages/live/Performance'
import LiveAdoption from './pages/live/Adoption'
import Admin from './pages/Admin'

function App() {
  return (
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
  )
}

export default App
