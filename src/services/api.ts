import { CopilotMetricsResponse } from '../types/metrics'

// Mock data for demonstration
const generateMockData = (): CopilotMetricsResponse => {
  const days = 30
  const data = []
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)
    
    data.push({
      date: date.toISOString().split('T')[0],
      total_suggestions_count: Math.floor(Math.random() * 5000) + 3000,
      total_acceptances_count: Math.floor(Math.random() * 3000) + 2000,
      total_lines_suggested: Math.floor(Math.random() * 15000) + 10000,
      total_lines_accepted: Math.floor(Math.random() * 10000) + 7000,
      total_active_users: Math.floor(Math.random() * 50) + 30,
      total_chat_acceptances: Math.floor(Math.random() * 500) + 200,
      total_chat_turns: Math.floor(Math.random() * 1000) + 500,
      total_active_chat_users: Math.floor(Math.random() * 40) + 20,
      total_pr_summaries_created: Math.floor(Math.random() * 30) + 10,
      total_pr_engaged_users: Math.floor(Math.random() * 15) + 5,
    })
  }

  return {
    data,
    editors: [
      { name: 'VS Code', total_engaged_users: 45 },
      { name: 'JetBrains', total_engaged_users: 28 },
      { name: 'Visual Studio', total_engaged_users: 15 },
      { name: 'Neovim', total_engaged_users: 8 },
    ],
    languages: [
      { name: 'TypeScript', total_engaged_users: 52 },
      { name: 'Python', total_engaged_users: 38 },
      { name: 'JavaScript', total_engaged_users: 35 },
      { name: 'Java', total_engaged_users: 22 },
      { name: 'C#', total_engaged_users: 18 },
      { name: 'Go', total_engaged_users: 12 },
    ],
  }
}

class CopilotMetricsService {
  private baseUrl: string
  private token: string | null

  constructor() {
    this.baseUrl = import.meta.env.VITE_GITHUB_API_URL || 'https://api.github.com'
    this.token = import.meta.env.VITE_GITHUB_TOKEN || null
  }

  async fetchMetrics(org: string, days = 28): Promise<CopilotMetricsResponse> {
    // For demo purposes, return mock data
    // In production, uncomment the API call below
    return new Promise((resolve) => {
      setTimeout(() => resolve(generateMockData()), 500)
    })

    /* Production API call:
    const endpoint = `${this.baseUrl}/enterprises/${org}/copilot/metrics`
    const params = new URLSearchParams({ since: days.toString() })
    
    const response = await fetch(`${endpoint}?${params}`, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch metrics: ${response.statusText}`)
    }

    return await response.json()
    */
  }

  calculateAcceptanceRate(suggestions: number, acceptances: number): number {
    return suggestions > 0 ? (acceptances / suggestions) * 100 : 0
  }

  calculateAverageMetrics(data: CopilotMetricsResponse['data']) {
    const totals = data.reduce(
      (acc, day) => ({
        suggestions: acc.suggestions + day.total_suggestions_count,
        acceptances: acc.acceptances + day.total_acceptances_count,
        linessuggested: acc.linessuggested + day.total_lines_suggested,
        linesAccepted: acc.linesAccepted + day.total_lines_accepted,
        activeUsers: acc.activeUsers + day.total_active_users,
      }),
      { suggestions: 0, acceptances: 0, linessuggested: 0, linesAccepted: 0, activeUsers: 0 }
    )

    const count = data.length || 1

    return {
      avgSuggestions: Math.round(totals.suggestions / count),
      avgAcceptances: Math.round(totals.acceptances / count),
      avgLinesSuggested: Math.round(totals.linessuggested / count),
      avgLinesAccepted: Math.round(totals.linesAccepted / count),
      avgActiveUsers: Math.round(totals.activeUsers / count),
      acceptanceRate: this.calculateAcceptanceRate(totals.suggestions, totals.acceptances),
    }
  }
}

export const metricsService = new CopilotMetricsService()
