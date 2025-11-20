import { useState, useEffect } from 'react'
import { FolderGit2, Plus, Trash2, Save, Github, Key, User, AlertCircle, Shield, Trash, Download } from 'lucide-react'
import { encrypt, decrypt, resetEncryptionKey } from '../utils/encryption'

interface RepositoryConfig {
  id: string
  owner: string
  name: string
  token: string
}

const RepositoryList = () => {
  const [repositories, setRepositories] = useState<RepositoryConfig[]>([])
  const [showToken, setShowToken] = useState<{ [key: string]: boolean }>({})
  const [fetchingMetrics, setFetchingMetrics] = useState<{ [key: string]: boolean }>({})
  const [fetchStatus, setFetchStatus] = useState<{ [key: string]: { success: boolean; message: string } }>({})
  
  // Check if demo mode is enabled from environment config
  const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true'

  // Load repositories from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('repository_configs')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        // Decrypt tokens when loading
        const decrypted = parsed.map((repo: RepositoryConfig) => ({
          ...repo,
          token: decrypt(repo.token)
        }))
        setRepositories(decrypted)
      } catch (error) {
        console.error('Failed to parse repository configs:', error)
      }
    }
  }, [])

  // Save repositories to localStorage
  const saveRepositories = (repos: RepositoryConfig[]) => {
    // Encrypt tokens before saving
    const encrypted = repos.map(repo => ({
      ...repo,
      token: encrypt(repo.token)
    }))
    localStorage.setItem('repository_configs', JSON.stringify(encrypted))
    setRepositories(repos)
  }

  // Add a new repository configuration
  const addRepository = () => {
    const newRepo: RepositoryConfig = {
      id: `repo_${Date.now()}`,
      owner: '',
      name: '',
      token: ''
    }
    saveRepositories([...repositories, newRepo])
  }

  // Update a repository configuration
  const updateRepository = (id: string, field: keyof RepositoryConfig, value: string) => {
    const updated = repositories.map(repo =>
      repo.id === id ? { ...repo, [field]: value } : repo
    )
    saveRepositories(updated)
  }

  // Remove a repository configuration
  const removeRepository = (id: string) => {
    const filtered = repositories.filter(repo => repo.id !== id)
    saveRepositories(filtered)
  }

  // Toggle token visibility
  const toggleTokenVisibility = (id: string) => {
    setShowToken(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  // Validate repository configuration
  const isValidRepo = (repo: RepositoryConfig): boolean => {
    return repo.owner.trim() !== '' && repo.name.trim() !== '' && repo.token.trim() !== ''
  }

  // Clear all repositories and reset encryption key
  const clearAllRepositories = () => {
    if (repositories.length === 0) return
    
    const confirmed = window.confirm(
      `Are you sure you want to clear all ${repositories.length} repository configuration(s)? This will also reset your encryption key. This action cannot be undone.`
    )
    
    if (confirmed) {
      // Clear repository data
      localStorage.removeItem('repository_configs')
      setRepositories([])
      setShowToken({})
      
      // Reset encryption key
      resetEncryptionKey()
      
      // Show success message
      alert('All repository configurations and encryption key have been cleared successfully.')
    }
  }

  // Fetch pull request metrics from GitHub API
  const fetchRepositoryMetrics = async (repoId: string) => {
    const repo = repositories.find(r => r.id === repoId)
    if (!repo || !isValidRepo(repo)) {
      setFetchStatus({
        ...fetchStatus,
        [repoId]: { success: false, message: 'Please complete all fields before fetching metrics' }
      })
      return
    }

    setFetchingMetrics({ ...fetchingMetrics, [repoId]: true })
    setFetchStatus({ ...fetchStatus, [repoId]: { success: false, message: '' } })

    try {
      const url = `https://api.github.com/repos/${repo.owner}/${repo.name}/pulls?state=all&per_page=100`
      const response = await fetch(url, {
        headers: {
          'Authorization': `token ${repo.token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      })

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      
      // Store metrics in localStorage with repository identifier
      const storageKey = `repo_metrics_${repo.owner}_${repo.name}`
      localStorage.setItem(storageKey, JSON.stringify({
        owner: repo.owner,
        name: repo.name,
        pullRequests: data,
        fetchedAt: new Date().toISOString(),
        count: data.length
      }))

      setFetchStatus({
        ...fetchStatus,
        [repoId]: { 
          success: true, 
          message: `Successfully fetched ${data.length} pull requests` 
        }
      })
    } catch (error) {
      console.error('Error fetching repository metrics:', error)
      setFetchStatus({
        ...fetchStatus,
        [repoId]: { 
          success: false, 
          message: error instanceof Error ? error.message : 'Failed to fetch metrics' 
        }
      })
    } finally {
      setFetchingMetrics({ ...fetchingMetrics, [repoId]: false })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FolderGit2 className="w-8 h-8 text-purple-500" />
          <div>
            <h1 className="text-3xl font-bold text-white">Repository List</h1>
            <p className="text-slate-400 mt-1">Configure GitHub repositories to fetch metrics</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {repositories.length > 0 && (
            <button
              onClick={clearAllRepositories}
              disabled={isDemoMode}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash className="w-5 h-5" />
              Clear All
            </button>
          )}
          <button
            onClick={addRepository}
            disabled={isDemoMode}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5" />
            Add Repository
          </button>
        </div>
      </div>

      {/* Demo Mode Banner */}
      {isDemoMode && (
        <div className="bg-purple-900/20 border border-purple-700/50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-purple-100">
              <p className="font-semibold mb-1">Demo Mode Active</p>
              <p className="text-purple-200">
                Repository management is disabled in demo mode. All input fields and action buttons are read-only.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Info Banner */}
      <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-100">
            <p className="font-semibold mb-1">How to use:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-200">
              <li>Add one or more repository configurations by clicking "Add Repository"</li>
              <li>Enter the repository owner (username or organization)</li>
              <li>Enter the repository name</li>
              <li>Provide a GitHub Personal Access Token with <code className="px-1 py-0.5 bg-blue-950/50 rounded">repo</code> scope</li>
              <li>All configurations are saved automatically to your browser's local storage</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Security Banner */}
      <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-green-100">
            <p className="font-semibold mb-1">Security: Encrypted Storage</p>
            <p className="text-green-200">
              All tokens are encrypted using AES-256 encryption before being stored in your browser's local storage. 
              Your encryption key is unique to your browser and never leaves your device.
            </p>
          </div>
        </div>
      </div>

      {/* Repository List */}
      {repositories.length === 0 ? (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-12 text-center">
          <FolderGit2 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Repositories Configured</h3>
          <p className="text-slate-400 mb-6">
            Get started by adding your first repository configuration
          </p>
          <button
            onClick={addRepository}
            disabled={isDemoMode}
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5" />
            Add Your First Repository
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {repositories.map((repo, index) => (
            <div
              key={repo.id}
              className="bg-slate-800 border border-slate-700 rounded-lg p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-900/30 p-2 rounded-lg">
                    <Github className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Repository #{index + 1}
                    </h3>
                    {isValidRepo(repo) && (
                      <p className="text-sm text-slate-400">
                        {repo.owner}/{repo.name}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => removeRepository(repo.id)}
                  disabled={isDemoMode}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Remove Repository"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Owner Input */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                    <User className="w-4 h-4" />
                    Repository Owner
                  </label>
                  <input
                    type="text"
                    value={repo.owner}
                    onChange={(e) => updateRepository(repo.id, 'owner', e.target.value)}
                    disabled={isDemoMode}
                    placeholder="e.g., octocat or my-org"
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Repository Name Input */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                    <FolderGit2 className="w-4 h-4" />
                    Repository Name
                  </label>
                  <input
                    type="text"
                    value={repo.name}
                    onChange={(e) => updateRepository(repo.id, 'name', e.target.value)}
                    disabled={isDemoMode}
                    placeholder="e.g., my-awesome-repo"
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Token Input */}
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                    <Key className="w-4 h-4" />
                    GitHub Personal Access Token
                  </label>
                  <div className="relative">
                    <input
                      type={showToken[repo.id] ? 'text' : 'password'}
                      value={repo.token}
                      onChange={(e) => updateRepository(repo.id, 'token', e.target.value)}
                      disabled={isDemoMode}
                      placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-24 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                      type="button"
                      onClick={() => toggleTokenVisibility(repo.id)}
                      disabled={isDemoMode}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-xs text-slate-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {showToken[repo.id] ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Required scopes: <code className="px-1 py-0.5 bg-slate-900 rounded">repo</code>
                  </p>
                </div>
              </div>

              {/* Validation Status */}
              {repo.owner && repo.name && repo.token && (
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    {isValidRepo(repo) ? (
                      <div className="flex items-center gap-2 text-green-400">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        Configuration complete
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-yellow-400">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        Please fill all fields
                      </div>
                    )}
                  </div>

                  {/* Fetch Metrics Button */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => fetchRepositoryMetrics(repo.id)}
                      disabled={!isValidRepo(repo) || fetchingMetrics[repo.id] || isDemoMode}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Download className="w-4 h-4" />
                      {fetchingMetrics[repo.id] ? 'Fetching...' : 'Fetch Pull Request Metrics'}
                    </button>
                    
                    {fetchStatus[repo.id] && (
                      <div className={`text-sm ${fetchStatus[repo.id].success ? 'text-green-400' : 'text-red-400'}`}>
                        {fetchStatus[repo.id].message}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Summary Footer */}
      {repositories.length > 0 && (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Save className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-sm font-medium text-white">
                  {repositories.length} {repositories.length === 1 ? 'repository' : 'repositories'} configured
                </p>
                <p className="text-xs text-slate-400">
                  {repositories.filter(isValidRepo).length} ready to use
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-green-400">
              <Shield className="w-4 h-4" />
              <span>Encrypted & Auto-saved</span>
            </div>
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-3">Need Help?</h3>
        <div className="space-y-3 text-sm text-slate-300">
          <div>
            <p className="font-medium text-white mb-1">How to create a Personal Access Token:</p>
            <ol className="list-decimal list-inside space-y-1 text-slate-400 ml-2">
              <li>Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)</li>
              <li>Click "Generate new token" → "Generate new token (classic)"</li>
              <li>Give it a descriptive name and select the <code className="px-1 py-0.5 bg-slate-900 rounded">repo</code> scope</li>
              <li>Click "Generate token" and copy it immediately</li>
            </ol>
          </div>
          <div>
            <p className="font-medium text-white mb-1">What can you do with repository metrics?</p>
            <p className="text-slate-400">
              Access detailed repository insights including commits, contributors, pull requests, 
              issues, and code statistics to better understand your project's health and activity.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RepositoryList
