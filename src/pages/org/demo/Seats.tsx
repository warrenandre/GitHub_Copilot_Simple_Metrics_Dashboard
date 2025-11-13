import { Users, UserCheck, Calendar, Activity, GitBranch, Building2, Building } from 'lucide-react'
import { useState } from 'react'

// Demo data for seats
const demoEnterpriseSeats = {
  total_seats: 45,
  seats: [
    {
      created_at: "2024-01-15T10:00:00Z",
      updated_at: "2025-11-12T08:30:00Z",
      assignee: {
        login: "john_developer",
        avatar_url: "https://github.com/github.png",
        html_url: "https://github.com/john_developer",
        type: "User"
      },
      plan_type: "business",
      last_activity_at: "2025-11-12T14:22:00Z",
      last_activity_editor: "vscode/1.95.0/copilot/1.145.0",
      last_authenticated_at: "2025-11-12T09:15:00Z",
      pending_cancellation_date: null,
      assigning_team: {
        name: "Engineering Team",
        slug: "engineering-team",
        description: "Core Engineering Team"
      }
    },
    {
      created_at: "2024-02-20T14:30:00Z",
      updated_at: "2025-11-10T16:45:00Z",
      assignee: {
        login: "sarah_architect",
        avatar_url: "https://github.com/github.png",
        html_url: "https://github.com/sarah_architect",
        type: "User"
      },
      plan_type: "enterprise",
      last_activity_at: "2025-11-11T18:30:00Z",
      last_activity_editor: "vscode/1.94.2/copilot-chat/0.21.2",
      last_authenticated_at: "2025-11-11T07:00:00Z",
      pending_cancellation_date: null,
      assigning_team: {
        name: "Architecture Team",
        slug: "architecture-team",
        description: "Solution Architecture"
      }
    },
    {
      created_at: "2024-03-10T09:00:00Z",
      updated_at: "2025-11-09T12:00:00Z",
      assignee: {
        login: "mike_backend",
        avatar_url: "https://github.com/github.png",
        html_url: "https://github.com/mike_backend",
        type: "User"
      },
      plan_type: "business",
      last_activity_at: "2025-11-09T16:45:00Z",
      last_activity_editor: "jetbrains/2024.2/copilot/1.4.5",
      last_authenticated_at: "2025-11-09T08:30:00Z",
      pending_cancellation_date: "2025-12-01",
      assigning_team: {
        name: "Backend Team",
        slug: "backend-team",
        description: "Backend Development"
      }
    }
  ]
}

const demoOrgSeats = {
  total_seats: 28,
  seats: [
    {
      created_at: "2024-04-05T11:20:00Z",
      updated_at: "2025-11-12T10:00:00Z",
      assignee: {
        login: "emma_frontend",
        avatar_url: "https://github.com/github.png",
        html_url: "https://github.com/emma_frontend",
        type: "User"
      },
      plan_type: "business",
      last_activity_at: "2025-11-12T13:15:00Z",
      last_activity_editor: "vscode/1.95.1/copilot/1.146.1",
      last_authenticated_at: "2025-11-12T08:00:00Z",
      pending_cancellation_date: null,
      assigning_team: {
        name: "Frontend Team",
        slug: "frontend-team",
        description: "UI/UX Development"
      }
    },
    {
      created_at: "2024-05-15T13:45:00Z",
      updated_at: "2025-11-11T15:30:00Z",
      assignee: {
        login: "alex_devops",
        avatar_url: "https://github.com/github.png",
        html_url: "https://github.com/alex_devops",
        type: "User"
      },
      plan_type: "business",
      last_activity_at: "2025-11-11T20:00:00Z",
      last_activity_editor: "vscode/1.94.0/copilot/1.143.0",
      last_authenticated_at: "2025-11-11T06:30:00Z",
      pending_cancellation_date: null,
      assigning_team: {
        name: "DevOps Team",
        slug: "devops-team",
        description: "Infrastructure & Operations"
      }
    }
  ]
}

const Seats = () => {
  const [selectedLevel, setSelectedLevel] = useState<'enterprise' | 'organization'>('enterprise')
  
  const currentSeats = selectedLevel === 'enterprise' ? demoEnterpriseSeats : demoOrgSeats
  
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
          <h1 className="text-3xl font-bold text-white mb-2">Copilot Seats</h1>
          <p className="text-slate-400">View and manage GitHub Copilot seat assignments</p>
        </div>
      </div>

      {/* Level Selector */}
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

export default Seats
