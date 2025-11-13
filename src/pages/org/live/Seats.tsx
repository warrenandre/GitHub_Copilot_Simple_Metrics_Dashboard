import { Users, UserCheck, Calendar, Activity, GitBranch, Building2, Building, AlertCircle } from 'lucide-react'
import { useState, useEffect } from 'react'

interface SeatAssignee {
  login: string
  avatar_url: string
  html_url: string
  type: string
}

interface AssigningTeam {
  name: string
  slug: string
  description?: string
}

interface Seat {
  created_at: string
  updated_at: string
  assignee: SeatAssignee
  plan_type: string
  last_activity_at: string | null
  last_activity_editor: string | null
  last_authenticated_at: string | null
  pending_cancellation_date: string | null
  assigning_team?: AssigningTeam
}

interface SeatsData {
  total_seats: number
  seats: Seat[]
}

const LiveSeats = () => {
  const [selectedLevel, setSelectedLevel] = useState<'enterprise' | 'organization'>('enterprise')
  const [enterpriseSeats, setEnterpriseSeats] = useState<SeatsData | null>(null)
  const [orgSeats, setOrgSeats] = useState<SeatsData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    loadSeatsData()
  }, [])

  const loadSeatsData = () => {
    setLoading(true)
    setError(null)
    
    try {
      // Try to load seats data from localStorage
      const enterpriseData = localStorage.getItem('copilot_enterprise_seats_data')
      const orgData = localStorage.getItem('copilot_org_seats_data')
      
      if (enterpriseData) {
        const parsed = JSON.parse(enterpriseData)
        setEnterpriseSeats(parsed.data || parsed)
      }
      
      if (orgData) {
        const parsed = JSON.parse(orgData)
        setOrgSeats(parsed.data || parsed)
      }
      
      if (!enterpriseData && !orgData) {
        setError('No seats data found. Please download seats data from the Admin page first.')
      }
    } catch (err) {
      console.error('Failed to load seats data:', err)
      setError('Failed to load seats data. Please ensure data is downloaded from Admin page.')
    } finally {
      setLoading(false)
    }
  }
  
  const currentSeats = selectedLevel === 'enterprise' ? enterpriseSeats : orgSeats
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white text-xl">Loading seats data...</div>
      </div>
    )
  }

  if (error || !currentSeats) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Copilot Seats - Live Data</h1>
          <p className="text-slate-400">View GitHub Copilot seat assignments from your organization</p>
        </div>
        
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-orange-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-orange-400 mb-2">No Data Available</h3>
              <p className="text-slate-300 mb-4">
                {error || 'No seats data has been downloaded yet.'}
              </p>
              <p className="text-slate-400 text-sm">
                To view live seats data:
              </p>
              <ol className="list-decimal list-inside text-slate-400 text-sm mt-2 space-y-1 ml-4">
                <li>Navigate to the Admin page</li>
                <li>Configure your API credentials (organization name and personal access token)</li>
                <li>Click "Download Seats" for either Enterprise or Organization level</li>
                <li>Return to this page to view the downloaded data</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Level Selector (still shown) */}
        <div className="flex gap-3">
          <button
            onClick={() => setSelectedLevel('enterprise')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              selectedLevel === 'enterprise'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Building className="w-5 h-5" />
            Enterprise Level
          </button>
          <button
            onClick={() => setSelectedLevel('organization')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              selectedLevel === 'organization'
                ? 'bg-green-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Building2 className="w-5 h-5" />
            Organization Level
          </button>
        </div>
      </div>
    )
  }
  
  // Calculate metrics
  const activeSeats = currentSeats.seats.filter(s => !s.pending_cancellation_date).length
  const pendingCancellation = currentSeats.seats.filter(s => s.pending_cancellation_date).length
  const businessPlanCount = currentSeats.seats.filter(s => s.plan_type === 'business').length
  const enterprisePlanCount = currentSeats.seats.filter(s => s.plan_type === 'enterprise').length
  
  // Get unique editors
  const editorStats = currentSeats.seats.reduce((acc, seat) => {
    const editor = seat.last_activity_editor?.split('/')[0] || 'unknown'
    acc[editor] = (acc[editor] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Copilot Seats - Live Data</h1>
          <p className="text-slate-400">View and analyze GitHub Copilot seat assignments</p>
        </div>
        <button
          onClick={loadSeatsData}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Refresh Data
        </button>
      </div>

      {/* Level Selector */}
      <div className="flex gap-3">
        <button
          onClick={() => setSelectedLevel('enterprise')}
          disabled={!enterpriseSeats}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
            selectedLevel === 'enterprise'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          } ${!enterpriseSeats ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Building className="w-5 h-5" />
          Enterprise Level
          {!enterpriseSeats && <span className="text-xs">(No data)</span>}
        </button>
        <button
          onClick={() => setSelectedLevel('organization')}
          disabled={!orgSeats}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
            selectedLevel === 'organization'
              ? 'bg-green-600 text-white'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          } ${!orgSeats ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Building2 className="w-5 h-5" />
          Organization Level
          {!orgSeats && <span className="text-xs">(No data)</span>}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Total Seats</span>
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-white">{currentSeats.total_seats}</div>
          <div className="text-xs text-slate-500 mt-1">Licensed users</div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Active Seats</span>
            <UserCheck className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-white">{activeSeats}</div>
          <div className="text-xs text-slate-500 mt-1">Currently active</div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Pending Cancellation</span>
            <Calendar className="w-5 h-5 text-orange-500" />
          </div>
          <div className="text-3xl font-bold text-white">{pendingCancellation}</div>
          <div className="text-xs text-slate-500 mt-1">To be cancelled</div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Business Plan</span>
            <Activity className="w-5 h-5 text-purple-500" />
          </div>
          <div className="text-3xl font-bold text-white">{businessPlanCount}</div>
          <div className="text-xs text-slate-500 mt-1">Enterprise: {enterprisePlanCount}</div>
        </div>
      </div>

      {/* Editor Distribution */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-blue-500" />
          Editor Distribution
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(editorStats).map(([editor, count]) => (
            <div key={editor} className="bg-slate-900 rounded-lg p-4">
              <div className="text-2xl font-bold text-white">{count}</div>
              <div className="text-sm text-slate-400 capitalize">{editor}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Seats Table */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            Seat Assignments ({currentSeats.seats.length} seats)
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Team
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Plan Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Last Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Editor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {currentSeats.seats.map((seat, index) => (
                <tr key={index} className="hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <img 
                        src={seat.assignee.avatar_url} 
                        alt={seat.assignee.login}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <div className="text-sm font-medium text-white">
                          {seat.assignee.login}
                        </div>
                        <div className="text-xs text-slate-400">
                          Joined {formatDate(seat.created_at)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">{seat.assigning_team?.name || 'N/A'}</div>
                    <div className="text-xs text-slate-400">{seat.assigning_team?.slug || ''}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      seat.plan_type === 'enterprise'
                        ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}>
                      {seat.plan_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">{formatDateTime(seat.last_activity_at)}</div>
                    <div className="text-xs text-slate-400">
                      Auth: {formatDateTime(seat.last_authenticated_at)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-300 font-mono text-xs">
                      {seat.last_activity_editor || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {seat.pending_cancellation_date ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-500/10 text-orange-400 border border-orange-500/20">
                        Pending Cancel
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                        Active
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default LiveSeats
