import { useState, useEffect } from 'react'
import { Users, UserCheck, Calendar, Activity, GitBranch, Building, RefreshCw, Download } from 'lucide-react'
import DataSourceToggle from '../../../components/DataSourceToggle'
import { demoSeatsData } from '../../../data/demoSeatsData'

interface SeatData {
  assignee: {
    login: string
    avatar_url: string
    id: number
  }
  assigning_team?: {
    name: string
    slug: string
  }
  created_at: string
  updated_at: string
  pending_cancellation_date?: string | null
  last_activity_at?: string
  last_activity_editor?: string
  plan_type?: string
}

interface EnterpriseSeatsResponse {
  total_seats: number
  seats: SeatData[]
}

const EnterpriseSeats = () => {
  const [seatsData, setSeatsData] = useState<EnterpriseSeatsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [isDemo, setIsDemo] = useState(false)

  const loadSeatsData = () => {
    setLoading(true)
    setError(null)

    try {
      const data = localStorage.getItem('copilot_enterprise_seats_data')
      const timestamp = localStorage.getItem('copilot_enterprise_seats_data_timestamp')

      if (data) {
        const parsedData = JSON.parse(data)
        // Handle both wrapped and unwrapped data formats
        if (parsedData.data) {
          // New format with metadata wrapper
          setSeatsData(parsedData.data)
        } else {
          // Old format without wrapper
          setSeatsData(parsedData)
        }
        setLastUpdated(timestamp)
      } else {
        // Don't auto-switch to demo, just clear data to show no data message
        setSeatsData(null)
        setLastUpdated(null)
      }
    } catch (err) {
      console.error('Error loading seats data:', err)
      setSeatsData(null)
      setError('Failed to load seats data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isDemo) {
      loadSeatsData()
    } else {
      setSeatsData(demoSeatsData)
      setLastUpdated(new Date().toLocaleString())
      setLoading(false)
      setError(null)
    }
  }, [isDemo])

  const handleRefresh = () => {
    loadSeatsData()
  }

  const handleDownload = () => {
    if (!seatsData) return

    const dataStr = JSON.stringify(seatsData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `enterprise-copilot-seats-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-2" />
          <p className="text-slate-400">Loading enterprise seats data...</p>
        </div>
      </div>
    )
  }

  // Show no data message when live mode is selected but no data is available
  if (!isDemo && (error || !seatsData)) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Enterprise Copilot Seats</h1>
            <p className="text-slate-400">Manage and monitor GitHub Copilot seat assignments for your enterprise</p>
          </div>
          <DataSourceToggle isDemo={isDemo} onToggle={setIsDemo} />
        </div>
        <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-200 mb-3 flex items-center gap-2">
            <Building className="w-5 h-5" />
            No Live Data Available
          </h3>
          <p className="text-yellow-100/80 mb-4">
            There is currently no live seats data available. To view enterprise seat assignments:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-yellow-100/80 mb-4 ml-2">
            <li>Go to the <strong>Admin Settings</strong> page</li>
            <li>Configure your GitHub Enterprise access token</li>
            <li>Click the "Download Enterprise Seats" button</li>
            <li>Return to this page to view seat assignment data</li>
          </ol>
          <p className="text-yellow-100/80">
            In the meantime, switch to <strong>Demo</strong> mode using the toggle above to explore the dashboard with sample data.
          </p>
        </div>
      </div>
    )
  }

  if (!seatsData) {
    return <div className="p-6 text-slate-400">Loading seats data...</div>
  }

  const activeSeats = seatsData.seats.filter(seat => !seat.pending_cancellation_date).length
  const pendingCancellation = seatsData.seats.filter(seat => seat.pending_cancellation_date).length
  const businessPlanSeats = seatsData.seats.filter(seat => seat.plan_type === 'business').length
  const enterprisePlanSeats = seatsData.seats.filter(seat => seat.plan_type === 'enterprise').length

  // Calculate editor distribution
  const editorStats = seatsData.seats.reduce((acc, seat) => {
    if (seat.last_activity_editor) {
      acc[seat.last_activity_editor] = (acc[seat.last_activity_editor] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Enterprise Copilot Seats</h1>
          <p className="text-slate-400">Manage and monitor GitHub Copilot seat assignments for your enterprise</p>
        </div>
        <div className="flex gap-2">
          <DataSourceToggle isDemo={isDemo} onToggle={setIsDemo} />
          {!isDemo && (
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          )}
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Data
          </button>
        </div>
      </div>

      {lastUpdated && (
        <div className="text-sm text-slate-400">
          Last updated: {new Date(lastUpdated).toLocaleString()}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-orange-500" />
            <span className="text-xs font-semibold text-orange-500 bg-orange-500/10 px-2 py-1 rounded">
              TOTAL
            </span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{seatsData.total_seats}</div>
          <div className="text-sm text-slate-400">Total Seats</div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <UserCheck className="w-8 h-8 text-green-500" />
            <span className="text-xs font-semibold text-green-500 bg-green-500/10 px-2 py-1 rounded">
              ACTIVE
            </span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{activeSeats}</div>
          <div className="text-sm text-slate-400">Active Seats</div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-8 h-8 text-red-500" />
            <span className="text-xs font-semibold text-red-500 bg-red-500/10 px-2 py-1 rounded">
              PENDING
            </span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{pendingCancellation}</div>
          <div className="text-sm text-slate-400">Pending Cancellation</div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <Building className="w-8 h-8 text-blue-500" />
            <span className="text-xs font-semibold text-blue-500 bg-blue-500/10 px-2 py-1 rounded">
              PLAN
            </span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{enterprisePlanSeats}</div>
          <div className="text-sm text-slate-400">Enterprise Plan</div>
          <div className="text-xs text-slate-500 mt-1">{businessPlanSeats} Business Plan</div>
        </div>
      </div>

      {/* Editor Distribution */}
      {Object.keys(editorStats).length > 0 && (
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-orange-500" />
            Editor Distribution
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(editorStats).map(([editor, count]) => (
              <div key={editor} className="bg-slate-900 rounded-lg p-4">
                <div className="text-2xl font-bold text-white mb-1">{count}</div>
                <div className="text-sm text-slate-400 capitalize">{editor}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Seats Table */}
      <div className="bg-slate-800 rounded-lg border border-slate-700">
        <div className="p-6 border-b border-slate-700">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-orange-500" />
            Seat Assignments ({seatsData.seats.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Assigned Date
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
              {seatsData.seats.map((seat) => (
                <tr key={seat.assignee.id} className="hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={seat.assignee.avatar_url}
                        alt={seat.assignee.login}
                        className="w-8 h-8 rounded-full mr-3"
                      />
                      <div className="text-sm font-medium text-white">{seat.assignee.login}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                    {new Date(seat.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                    {seat.assigning_team?.name || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      seat.plan_type === 'enterprise' 
                        ? 'bg-blue-500/10 text-blue-500' 
                        : 'bg-purple-500/10 text-purple-500'
                    }`}>
                      {seat.plan_type || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                    <div className="flex items-center gap-1">
                      <Activity className="w-4 h-4" />
                      {seat.last_activity_at 
                        ? new Date(seat.last_activity_at).toLocaleDateString()
                        : 'No activity'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                    {seat.last_activity_editor || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {seat.pending_cancellation_date ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-500">
                        Pending Cancel
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-500">
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

export default EnterpriseSeats
