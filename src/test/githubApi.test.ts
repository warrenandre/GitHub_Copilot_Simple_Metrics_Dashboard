import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { githubApiService } from '../../services/githubApi'
import type { APIConfig, GitHubCopilotMetricsResponse } from '../../types/metrics'

// Mock fetch globally
global.fetch = vi.fn()

describe('GitHub API Service', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  const mockConfig: APIConfig = {
    org: 'test-org',
    token: 'ghp_test123',
    since: '2024-01-01',
    until: '2024-01-28',
    team_slug: '',
  }

  const mockMetricsResponse: GitHubCopilotMetricsResponse = [
    {
      date: '2024-01-01',
      total_suggestions_count: 100,
      total_acceptances_count: 80,
      total_lines_suggested: 500,
      total_lines_accepted: 400,
      total_active_users: 10,
      total_chat_acceptances: 20,
      total_chat_turns: 30,
      total_active_chat_users: 5,
      breakdown: [],
    },
    {
      date: '2024-01-02',
      total_suggestions_count: 150,
      total_acceptances_count: 120,
      total_lines_suggested: 600,
      total_lines_accepted: 480,
      total_active_users: 12,
      total_chat_acceptances: 25,
      total_chat_turns: 35,
      total_active_chat_users: 6,
      breakdown: [],
    },
  ]

  describe('fetchFromGitHub', () => {
    it('should fetch enterprise metrics successfully', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockMetricsResponse,
      } as Response)

      const result = await githubApiService.fetchFromGitHub(mockConfig, 'enterprise')

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/enterprises/test-org/copilot/metrics'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Authorization': 'Bearer ghp_test123',
          }),
        })
      )
      expect(result).toEqual(mockMetricsResponse)
    })

    it('should fetch organization metrics successfully', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockMetricsResponse,
      } as Response)

      const result = await githubApiService.fetchFromGitHub(mockConfig, 'organization')

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/orgs/test-org/copilot/metrics'),
        expect.any(Object)
      )
      expect(result).toEqual(mockMetricsResponse)
    })

    it('should include date parameters in request', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockMetricsResponse,
      } as Response)

      await githubApiService.fetchFromGitHub(mockConfig, 'enterprise')

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('since=2024-01-01'),
        expect.any(Object)
      )
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('until=2024-01-28'),
        expect.any(Object)
      )
    })

    it('should include team_slug in endpoint when provided', async () => {
      const configWithTeam = { ...mockConfig, team_slug: 'my-team' }
      
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockMetricsResponse,
      } as Response)

      await githubApiService.fetchFromGitHub(configWithTeam, 'enterprise')

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/team/my-team/copilot/metrics'),
        expect.any(Object)
      )
    })

    it('should handle 401 unauthorized error', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        text: async () => 'Bad credentials',
      } as Response)

      await expect(
        githubApiService.fetchFromGitHub(mockConfig, 'enterprise')
      ).rejects.toThrow('GitHub API error (401)')
    })

    it('should handle 404 not found error', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        text: async () => 'Not found',
      } as Response)

      await expect(
        githubApiService.fetchFromGitHub(mockConfig, 'enterprise')
      ).rejects.toThrow('GitHub API error (404)')
    })

    it('should handle 403 forbidden error', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 403,
        statusText: 'Forbidden',
        text: async () => 'Forbidden',
      } as Response)

      await expect(
        githubApiService.fetchFromGitHub(mockConfig, 'enterprise')
      ).rejects.toThrow('GitHub API error (403)')
    })

    it('should handle network errors', async () => {
      vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'))

      await expect(
        githubApiService.fetchFromGitHub(mockConfig, 'enterprise')
      ).rejects.toThrow('Network error')
    })
  })

  describe('downloadAndSave', () => {
    it('should download and save enterprise metrics', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockMetricsResponse,
      } as Response)

      // Mock the download trigger
      const createElementSpy = vi.spyOn(document, 'createElement')
      const clickSpy = vi.fn()
      
      createElementSpy.mockReturnValue({
        click: clickSpy,
        href: '',
        download: '',
        style: {},
      } as any)

      const result = await githubApiService.downloadAndSave(mockConfig, 'metrics', 'enterprise')

      expect(result.success).toBe(true)
      expect(result.recordCount).toBe(2)
      expect(localStorage.getItem('copilot_enterprise_metrics_data')).toBeTruthy()
    })

    it('should save data to localStorage', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockMetricsResponse,
      } as Response)

      await githubApiService.downloadAndSave(mockConfig, 'metrics', 'enterprise')

      const savedData = localStorage.getItem('copilot_enterprise_metrics_data')
      expect(savedData).toBeTruthy()
      
      const parsed = JSON.parse(savedData!)
      expect(parsed.data).toEqual(mockMetricsResponse)
    })

    it('should return error result on failure', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        text: async () => 'Bad credentials',
      } as Response)

      const result = await githubApiService.downloadAndSave(mockConfig, 'metrics', 'enterprise')

      expect(result.success).toBe(false)
      expect(result.error).toBeTruthy()
    })

    it('should download organization metrics to correct storage key', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockMetricsResponse,
      } as Response)

      await githubApiService.downloadAndSave(mockConfig, 'metrics', 'organization')

      expect(localStorage.getItem('copilot_org_metrics_data')).toBeTruthy()
      expect(localStorage.getItem('copilot_enterprise_metrics_data')).toBeNull()
    })
  })

  describe('clearLocalStorage', () => {
    it('should clear all copilot data from localStorage', () => {
      localStorage.setItem('copilot_enterprise_metrics_data', 'test1')
      localStorage.setItem('copilot_org_metrics_data', 'test2')
      localStorage.setItem('copilot_seats_data', 'test3')
      localStorage.setItem('other_data', 'should-remain')

      githubApiService.clearLocalStorage()

      expect(localStorage.getItem('copilot_enterprise_metrics_data')).toBeNull()
      expect(localStorage.getItem('copilot_org_metrics_data')).toBeNull()
      expect(localStorage.getItem('copilot_seats_data')).toBeNull()
      expect(localStorage.getItem('other_data')).toBe('should-remain')
    })
  })

  describe('getDataStats', () => {
    it('should return null when no data exists', () => {
      const stats = githubApiService.getDataStats()
      expect(stats).toBeNull()
    })

    it('should return stats for enterprise metrics', () => {
      const data = {
        data: mockMetricsResponse,
        timestamp: new Date().toISOString(),
      }
      
      localStorage.setItem('copilot_enterprise_metrics_data', JSON.stringify(data))

      const stats = githubApiService.getDataStats()
      
      expect(stats).toBeTruthy()
      expect(stats?.enterprise?.count).toBe(2)
      expect(stats?.enterprise?.dateRange.from).toBe('2024-01-01')
      expect(stats?.enterprise?.dateRange.to).toBe('2024-01-02')
    })

    it('should handle corrupted data gracefully', () => {
      localStorage.setItem('copilot_enterprise_metrics_data', 'invalid-json')

      const stats = githubApiService.getDataStats()
      expect(stats?.enterprise).toBeNull()
    })

    it('should return stats for multiple data types', () => {
      const enterpriseData = {
        data: mockMetricsResponse,
        timestamp: new Date().toISOString(),
      }
      
      const orgData = {
        data: [mockMetricsResponse[0]],
        timestamp: new Date().toISOString(),
      }
      
      localStorage.setItem('copilot_enterprise_metrics_data', JSON.stringify(enterpriseData))
      localStorage.setItem('copilot_org_metrics_data', JSON.stringify(orgData))

      const stats = githubApiService.getDataStats()
      
      expect(stats?.enterprise?.count).toBe(2)
      expect(stats?.organization?.count).toBe(1)
    })
  })

  describe('getLastSavedTimestamp', () => {
    it('should return null when no data exists', () => {
      const timestamp = githubApiService.getLastSavedTimestamp()
      expect(timestamp).toBeNull()
    })

    it('should return most recent timestamp', () => {
      const now = new Date().toISOString()
      const earlier = new Date(Date.now() - 100000).toISOString()
      
      localStorage.setItem('copilot_enterprise_metrics_data_timestamp', now)
      localStorage.setItem('copilot_org_metrics_data_timestamp', earlier)

      const timestamp = githubApiService.getLastSavedTimestamp()
      expect(timestamp).toBe(now)
    })

    it('should handle single timestamp', () => {
      const now = new Date().toISOString()
      localStorage.setItem('copilot_enterprise_metrics_data_timestamp', now)

      const timestamp = githubApiService.getLastSavedTimestamp()
      expect(timestamp).toBe(now)
    })
  })

  describe('download28DayReport', () => {
    it('should download 28-day report successfully', async () => {
      const mockReportData = {
        report_start_day: '2024-01-01',
        report_end_day: '2024-01-28',
        day_totals: [
          { date: '2024-01-01', total_suggestions_count: 100 },
          { date: '2024-01-02', total_suggestions_count: 150 },
        ],
      }

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockReportData,
      } as Response)

      const result = await githubApiService.download28DayReport(mockConfig)

      expect(result.success).toBe(true)
      expect(result.recordCount).toBe(2)
      expect(localStorage.getItem('enterprise_report_data')).toBeTruthy()
    })

    it('should use correct endpoint for 28-day report', async () => {
      const mockReportData = {
        day_totals: [],
        report_start_day: '2024-01-01',
        report_end_day: '2024-01-28',
      }

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockReportData,
      } as Response)

      await githubApiService.download28DayReport(mockConfig)

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/enterprises/test-org/copilot/report'),
        expect.any(Object)
      )
    })
  })

  describe('downloadUser28DayReport', () => {
    it('should download user 28-day report successfully', async () => {
      const mockUserReportData = `{"user_id":1,"day":"2024-01-01","user_login":"user1"}
{"user_id":2,"day":"2024-01-01","user_login":"user2"}`

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => mockUserReportData,
      } as Response)

      const result = await githubApiService.downloadUser28DayReport(mockConfig)

      expect(result.success).toBe(true)
      expect(localStorage.getItem('user_report_data')).toBeTruthy()
    })

    it('should use correct endpoint for user 28-day report', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => '{"user_id":1,"day":"2024-01-01"}',
      } as Response)

      await githubApiService.downloadUser28DayReport(mockConfig)

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/enterprises/test-org/copilot/report/user'),
        expect.any(Object)
      )
    })
  })
})
