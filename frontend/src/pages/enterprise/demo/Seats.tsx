import { useState } from 'react'
import { Users, UserCheck, Calendar, Activity, GitBranch, Building, Download,Sparkles } from 'lucide-react'

// Demo data
const demoSeatsData = {
  total_seats: 150,
  seats: [
    {
      assignee: {
        login: 'sarah.chen',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
        id: 1001
      },
      assigning_team: {
        name: 'Platform Engineering',
        slug: 'platform-eng'
      },
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-11-10T14:22:00Z',
      pending_cancellation_date: null,
      last_activity_at: '2024-11-12T08:45:00Z',
      last_activity_editor: 'vscode/1.95.0',
      plan_type: 'enterprise'
    },
    {
      assignee: {
        login: 'michael.torres',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael',
        id: 1002
      },
      assigning_team: {
        name: 'Data Science',
        slug: 'data-science'
      },
      created_at: '2024-02-01T09:15:00Z',
      updated_at: '2024-11-11T16:30:00Z',
      pending_cancellation_date: null,
      last_activity_at: '2024-11-11T18:20:00Z',
      last_activity_editor: 'jetbrains/2024.2',
      plan_type: 'enterprise'
    },
    {
      assignee: {
        login: 'emma.williams',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
        id: 1003
      },
      assigning_team: {
        name: 'Frontend Team',
        slug: 'frontend'
      },
      created_at: '2024-01-20T11:45:00Z',
      updated_at: '2024-11-12T09:10:00Z',
      pending_cancellation_date: null,
      last_activity_at: '2024-11-12T09:15:00Z',
      last_activity_editor: 'vscode/1.95.0',
      plan_type: 'enterprise'
    },
    {
      assignee: {
        login: 'james.anderson',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james',
        id: 1004
      },
      assigning_team: {
        name: 'DevOps',
        slug: 'devops'
      },
      created_at: '2024-03-10T08:00:00Z',
      updated_at: '2024-11-09T12:00:00Z',
      pending_cancellation_date: '2024-11-30T23:59:59Z',
      last_activity_at: '2024-11-05T14:30:00Z',
      last_activity_editor: 'vscode/1.94.0',
      plan_type: 'enterprise'
    },
    {
      assignee: {
        login: 'olivia.martinez',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=olivia',
        id: 1005
      },
      assigning_team: {
        name: 'Backend Services',
        slug: 'backend'
      },
      created_at: '2024-02-14T13:20:00Z',
      updated_at: '2024-11-11T10:45:00Z',
      pending_cancellation_date: null,
      last_activity_at: '2024-11-11T17:00:00Z',
      last_activity_editor: 'jetbrains/2024.2',
      plan_type: 'enterprise'
    },
    {
      assignee: {
        login: 'david.kim',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david',
        id: 1006
      },
      assigning_team: {
        name: 'Security Team',
        slug: 'security'
      },
      created_at: '2024-01-25T15:30:00Z',
      updated_at: '2024-11-12T07:20:00Z',
      pending_cancellation_date: null,
      last_activity_at: '2024-11-12T07:30:00Z',
      last_activity_editor: 'vscode/1.95.0',
      plan_type: 'enterprise'
    },
    {
      assignee: {
        login: 'sophia.rodriguez',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sophia',
        id: 1007
      },
      assigning_team: {
        name: 'Mobile Team',
        slug: 'mobile'
      },
      created_at: '2024-03-05T10:00:00Z',
      updated_at: '2024-11-10T15:40:00Z',
      pending_cancellation_date: null,
      last_activity_at: '2024-11-10T16:00:00Z',
      last_activity_editor: 'vscode/1.95.0',
      plan_type: 'business'
    },
    {
      assignee: {
        login: 'robert.jackson',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=robert',
        id: 1008
      },
      assigning_team: {
        name: 'QA Team',
        slug: 'qa'
      },
      created_at: '2024-02-20T09:30:00Z',
      updated_at: '2024-11-11T11:15:00Z',
      pending_cancellation_date: null,
      last_activity_at: '2024-11-11T13:45:00Z',
      last_activity_editor: 'neovim/0.9.5',
      plan_type: 'business'
    },
    {
      assignee: {
        login: 'isabella.lee',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=isabella',
        id: 1009
      },
      assigning_team: {
        name: 'Product Team',
        slug: 'product'
      },
      created_at: '2024-01-30T14:00:00Z',
      updated_at: '2024-11-12T08:00:00Z',
      pending_cancellation_date: null,
      last_activity_at: '2024-11-12T08:30:00Z',
      last_activity_editor: 'vscode/1.95.0',
      plan_type: 'enterprise'
    },
    {
      assignee: {
        login: 'william.brown',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=william',
        id: 1010
      },
      assigning_team: {
        name: 'Infrastructure',
        slug: 'infrastructure'
      },
      created_at: '2024-03-01T12:15:00Z',
      updated_at: '2024-11-09T16:20:00Z',
      pending_cancellation_date: null,
      last_activity_at: '2024-11-09T17:00:00Z',
      last_activity_editor: 'jetbrains/2024.1',
      plan_type: 'enterprise'
    }
  ]
}

const EnterpriseDemoSeats = () => {
  const [seatsData] = useState(demoSeatsData)

  const activeSeats = seatsData.seats.filter(seat => !seat.pending_cancellation_date).length
  const pendingCancellation = seatsData.seats.filter(seat => seat.pending_cancellation_date).length
  const businessPlanSeats = seatsData.seats.filter(seat => seat.plan_type === 'business').length
  const enterprisePlanSeats = seatsData.seats.filter(seat => seat.plan_type === 'enterprise').length

  // Calculate editor distribution
  const editorStats = seatsData.seats.reduce((acc, seat) => {
    if (seat.last_activity_editor) {
      const editorName = seat.last_activity_editor.split('/')[0]
      acc[editorName] = (acc[editorName] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>)

  const handleDownload = () => {
    const dataStr = JSON.stringify(seatsData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `enterprise-copilot-seats-demo-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-white">Enterprise Copilot Seats</h1>
            <span className="px-3 py-1 bg-yellow-500 bg-opacity-20 text-yellow-400 text-xs font-semibold rounded-full flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              DEMO DATA
            </span>
          </div>
          <p className="text-slate-400">Demo view of GitHub Copilot seat assignments for enterprise</p>
        </div>
        
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          Download Demo Data
        </button>
      </div>

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
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-orange-500" />
          Editor Distribution
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(editorStats)
            .sort(([, a], [, b]) => b - a)
            .map(([editor, count]) => (
              <div key={editor} className="bg-slate-900 rounded-lg p-4">
                <div className="text-2xl font-bold text-white mb-1">{count}</div>
                <div className="text-sm text-slate-400 capitalize">{editor}</div>
                <div className="text-xs text-slate-500 mt-1">
                  {((count / seatsData.seats.length) * 100).toFixed(1)}%
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Seats Table */}
      <div className="bg-slate-800 rounded-lg border border-slate-700">
        <div className="p-6 border-b border-slate-700">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-orange-500" />
            Seat Assignments ({seatsData.seats.length} shown of {seatsData.total_seats})
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

export default EnterpriseDemoSeats
