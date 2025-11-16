import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Overview from './pages/org/demo/Overview'
import Usage from './pages/org/demo/Usage'
import Performance from './pages/org/demo/Performance'
import Adoption from './pages/org/demo/Adoption'
import LiveOverview from './pages/org/live/Overview'
import LiveUsage from './pages/org/live/Usage'
import LivePerformance from './pages/org/live/Performance'
import LiveAdoption from './pages/org/live/Adoption'
import Admin from './pages/Admin'
import EnterpriseSeats from './pages/enterprise/live/Seats'
import EnterpriseOverview from './pages/enterprise/live/Overview'
import EnterpriseUsage from './pages/enterprise/live/Usage'
import EnterprisePerformance from './pages/enterprise/live/Performance'
import EnterpriseAdoption from './pages/enterprise/live/Adoption'
import EnterpriseReport28Day from './pages/enterprise/live/Report28Day'
import EnterpriseUserReport28Day from './pages/enterprise/live/UserReport28Day'
import EnterpriseInsights from './pages/enterprise/live/Insights'
import EnterpriseDemoSeats from './pages/enterprise/demo/Seats'
import EnterpriseDemoOverview from './pages/enterprise/demo/Overview'
import EnterpriseDemoUsage from './pages/enterprise/demo/Usage'
import EnterpriseDemoPerformance from './pages/enterprise/demo/Performance'
import EnterpriseDemoAdoption from './pages/enterprise/demo/Adoption'
import EnterpriseDemoReport28Day from './pages/enterprise/demo/Report28Day'
import EnterpriseDemoUserReport28Day from './pages/enterprise/demo/UserReport28Day'
import EnterpriseDemoInsights from './pages/enterprise/demo/Insights'

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
          
          {/* Enterprise Routes */}
          <Route path="/enterprise/demo/overview" element={<EnterpriseDemoOverview />} />
          <Route path="/enterprise/demo/usage" element={<EnterpriseDemoUsage />} />
          <Route path="/enterprise/demo/performance" element={<EnterpriseDemoPerformance />} />
          <Route path="/enterprise/demo/adoption" element={<EnterpriseDemoAdoption />} />
          <Route path="/enterprise/demo/insights" element={<EnterpriseDemoInsights />} />
          <Route path="/enterprise/demo/seats" element={<EnterpriseDemoSeats />} />
          <Route path="/enterprise/demo/report" element={<EnterpriseDemoReport28Day />} />
          <Route path="/enterprise/demo/user-report" element={<EnterpriseDemoUserReport28Day />} />
          <Route path="/enterprise/overview" element={<EnterpriseOverview />} />
          <Route path="/enterprise/usage" element={<EnterpriseUsage />} />
          <Route path="/enterprise/performance" element={<EnterprisePerformance />} />
          <Route path="/enterprise/adoption" element={<EnterpriseAdoption />} />
          <Route path="/enterprise/insights" element={<EnterpriseInsights />} />
          <Route path="/enterprise/seats" element={<EnterpriseSeats />} />
          <Route path="/enterprise/report" element={<EnterpriseReport28Day />} />
          <Route path="/enterprise/user-report" element={<EnterpriseUserReport28Day />} />
          
          {/* Admin Route */}
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Layout>
    </ThemeProvider>
  )
}

export default App
