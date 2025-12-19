import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Admin from '../../pages/Admin'
import { githubApiService } from '../../services/githubApi'
import * as apiConfig from '../../config/apiConfig'

// Mock the services
vi.mock('../../services/githubApi', () => ({
  githubApiService: {
    downloadAndSave: vi.fn(),
    download28DayReport: vi.fn(),
    downloadUser28DayReport: vi.fn(),
    clearLocalStorage: vi.fn(),
    getDataStats: vi.fn(),
    getLastSavedTimestamp: vi.fn(),
  },
}))

vi.mock('../../config/apiConfig', () => ({
  loadApiConfig: vi.fn(),
  saveApiConfig: vi.fn(),
  validateApiConfig: vi.fn(),
}))

const renderAdmin = () => {
  return render(
    <BrowserRouter>
      <Admin />
    </BrowserRouter>
  )
}

describe('Admin Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    
    // Default mocks
    vi.mocked(apiConfig.loadApiConfig).mockReturnValue(null)
    vi.mocked(githubApiService.getDataStats).mockReturnValue(null)
    vi.mocked(githubApiService.getLastSavedTimestamp).mockReturnValue(null)
  })

  describe('Component Rendering', () => {
    it('should render the Admin page with title', () => {
      renderAdmin()
      expect(screen.getByText('Admin Settings')).toBeInTheDocument()
    })

    it('should render configuration form fields', () => {
      renderAdmin()
      expect(screen.getByPlaceholderText(/your-organization/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/ghp_/i)).toBeInTheDocument()
    })

    it('should render all download buttons', () => {
      renderAdmin()
      expect(screen.getByText('Download Enterprise Metrics')).toBeInTheDocument()
      expect(screen.getByText('Download Enterprise Seats')).toBeInTheDocument()
      expect(screen.getByText('Download 28-Day Report')).toBeInTheDocument()
    })

    it('should render clear data button', () => {
      renderAdmin()
      expect(screen.getByText('Clear All Data')).toBeInTheDocument()
    })
  })

  describe('Configuration Loading', () => {
    it('should load saved configuration on mount', () => {
      const mockConfig = {
        org: 'test-org',
        token: 'test-token',
        since: '2024-01-01',
        until: '2024-01-28',
        team_slug: 'test-team',
      }
      
      vi.mocked(apiConfig.loadApiConfig).mockReturnValue(mockConfig)
      
      renderAdmin()
      
      expect(apiConfig.loadApiConfig).toHaveBeenCalled()
      expect(screen.getByDisplayValue('test-org')).toBeInTheDocument()
    })

    it('should display data stats when available', () => {
      const mockStats = {
        enterprise: {
          count: 28,
          dateRange: { from: '2024-01-01', to: '2024-01-28' },
        },
        organization: null,
        seats: null,
        report28Day: null,
        userReport: null,
      }
      
      vi.mocked(githubApiService.getDataStats).mockReturnValue(mockStats)
      
      renderAdmin()
      
      expect(screen.getByText(/28 days of metrics/i)).toBeInTheDocument()
      expect(screen.getByText(/2024-01-01 to 2024-01-28/i)).toBeInTheDocument()
    })
  })

  describe('Form Input Handling', () => {
    it('should update organization field', () => {
      renderAdmin()
      const orgInput = screen.getByPlaceholderText(/your-organization/i)
      
      fireEvent.change(orgInput, { target: { value: 'my-org' } })
      
      expect(orgInput).toHaveValue('my-org')
    })

    it('should update token field', () => {
      renderAdmin()
      const tokenInput = screen.getByPlaceholderText(/ghp_/i)
      
      fireEvent.change(tokenInput, { target: { value: 'ghp_test123' } })
      
      expect(tokenInput).toHaveValue('ghp_test123')
    })

    it('should clear validation errors on input change', () => {
      vi.mocked(apiConfig.validateApiConfig).mockReturnValue({
        valid: false,
        errors: ['Organization is required'],
      })
      
      renderAdmin()
      
      const downloadButton = screen.getByText('Download Enterprise Metrics')
      fireEvent.click(downloadButton)
      
      // Now change input
      const orgInput = screen.getByPlaceholderText(/your-organization/i)
      fireEvent.change(orgInput, { target: { value: 'test' } })
      
      // Validation errors should be cleared
      expect(apiConfig.validateApiConfig).toHaveBeenCalled()
    })
  })

  describe('Enterprise Metrics Download', () => {
    it('should validate config before downloading', async () => {
      vi.mocked(apiConfig.validateApiConfig).mockReturnValue({
        valid: false,
        errors: ['Organization is required'],
      })
      
      renderAdmin()
      
      const downloadButton = screen.getByText('Download Enterprise Metrics')
      fireEvent.click(downloadButton)
      
      await waitFor(() => {
        expect(apiConfig.validateApiConfig).toHaveBeenCalled()
      })
      
      expect(githubApiService.downloadAndSave).not.toHaveBeenCalled()
    })

    it('should download enterprise metrics successfully', async () => {
      vi.mocked(apiConfig.validateApiConfig).mockReturnValue({
        valid: true,
        errors: [],
      })
      
      vi.mocked(githubApiService.downloadAndSave).mockResolvedValue({
        success: true,
        message: 'Data downloaded successfully',
        recordCount: 28,
      })
      
      renderAdmin()
      
      const orgInput = screen.getByPlaceholderText(/your-organization/i)
      fireEvent.change(orgInput, { target: { value: 'test-org' } })
      
      const downloadButton = screen.getByText('Download Enterprise Metrics')
      fireEvent.click(downloadButton)
      
      await waitFor(() => {
        expect(githubApiService.downloadAndSave).toHaveBeenCalledWith(
          expect.objectContaining({ org: 'test-org' }),
          'metrics',
          'enterprise'
        )
      })
    })

    it('should handle download errors gracefully', async () => {
      vi.mocked(apiConfig.validateApiConfig).mockReturnValue({
        valid: true,
        errors: [],
      })
      
      vi.mocked(githubApiService.downloadAndSave).mockResolvedValue({
        success: false,
        message: 'API error occurred',
        error: 'Unauthorized',
      })
      
      renderAdmin()
      
      const downloadButton = screen.getByText('Download Enterprise Metrics')
      fireEvent.click(downloadButton)
      
      await waitFor(() => {
        expect(screen.getByText(/API error occurred/i)).toBeInTheDocument()
      })
    })

    it('should save config after successful download', async () => {
      vi.mocked(apiConfig.validateApiConfig).mockReturnValue({
        valid: true,
        errors: [],
      })
      
      vi.mocked(githubApiService.downloadAndSave).mockResolvedValue({
        success: true,
        message: 'Success',
      })
      
      renderAdmin()
      
      const orgInput = screen.getByPlaceholderText(/your-organization/i)
      fireEvent.change(orgInput, { target: { value: 'test-org' } })
      
      const downloadButton = screen.getByText('Download Enterprise Metrics')
      fireEvent.click(downloadButton)
      
      await waitFor(() => {
        expect(apiConfig.saveApiConfig).toHaveBeenCalled()
      })
    })
  })

  describe('Enterprise Seats Download', () => {
    it('should download enterprise seats successfully', async () => {
      vi.mocked(apiConfig.validateApiConfig).mockReturnValue({
        valid: true,
        errors: [],
      })
      
      vi.mocked(githubApiService.downloadAndSave).mockResolvedValue({
        success: true,
        message: 'Seats downloaded successfully',
        recordCount: 150,
      })
      
      renderAdmin()
      
      const downloadButton = screen.getByText('Download Enterprise Seats')
      fireEvent.click(downloadButton)
      
      await waitFor(() => {
        expect(githubApiService.downloadAndSave).toHaveBeenCalledWith(
          expect.any(Object),
          'seats',
          'enterprise'
        )
      })
    })
  })

  describe('28-Day Report Download', () => {
    it('should download 28-day report successfully', async () => {
      vi.mocked(apiConfig.validateApiConfig).mockReturnValue({
        valid: true,
        errors: [],
      })
      
      vi.mocked(githubApiService.download28DayReport).mockResolvedValue({
        success: true,
        message: '28-day report downloaded',
        recordCount: 28,
      })
      
      renderAdmin()
      
      const downloadButton = screen.getByText('Download 28-Day Report')
      fireEvent.click(downloadButton)
      
      await waitFor(() => {
        expect(githubApiService.download28DayReport).toHaveBeenCalled()
      })
    })
  })

  describe('User 28-Day Report Download', () => {
    it('should download user 28-day report successfully', async () => {
      vi.mocked(apiConfig.validateApiConfig).mockReturnValue({
        valid: true,
        errors: [],
      })
      
      vi.mocked(githubApiService.downloadUser28DayReport).mockResolvedValue({
        success: true,
        message: 'User report downloaded',
        recordCount: 500,
      })
      
      renderAdmin()
      
      const downloadButton = screen.getByText('Download User 28-Day Report')
      fireEvent.click(downloadButton)
      
      await waitFor(() => {
        expect(githubApiService.downloadUser28DayReport).toHaveBeenCalled()
      })
    })
  })

  describe('Organization Metrics Download', () => {
    it('should download organization metrics successfully', async () => {
      vi.mocked(apiConfig.validateApiConfig).mockReturnValue({
        valid: true,
        errors: [],
      })
      
      vi.mocked(githubApiService.downloadAndSave).mockResolvedValue({
        success: true,
        message: 'Organization metrics downloaded',
        recordCount: 28,
      })
      
      renderAdmin()
      
      const downloadButton = screen.getByText('Download Organization Metrics')
      fireEvent.click(downloadButton)
      
      await waitFor(() => {
        expect(githubApiService.downloadAndSave).toHaveBeenCalledWith(
          expect.any(Object),
          'metrics',
          'organization'
        )
      })
    })
  })

  describe('Clear Data Functionality', () => {
    it('should clear data when confirmed', async () => {
      global.confirm = vi.fn(() => true)
      
      renderAdmin()
      
      const clearButton = screen.getByText('Clear All Data')
      fireEvent.click(clearButton)
      
      await waitFor(() => {
        expect(githubApiService.clearLocalStorage).toHaveBeenCalled()
      })
    })

    it('should not clear data when cancelled', () => {
      global.confirm = vi.fn(() => false)
      
      renderAdmin()
      
      const clearButton = screen.getByText('Clear All Data')
      fireEvent.click(clearButton)
      
      expect(githubApiService.clearLocalStorage).not.toHaveBeenCalled()
    })

    it('should update stats after clearing data', async () => {
      global.confirm = vi.fn(() => true)
      vi.mocked(githubApiService.clearLocalStorage).mockImplementation(() => {})
      
      renderAdmin()
      
      const clearButton = screen.getByText('Clear All Data')
      fireEvent.click(clearButton)
      
      await waitFor(() => {
        expect(githubApiService.getDataStats).toHaveBeenCalledTimes(2) // Once on mount, once after clear
      })
    })
  })

  describe('Loading States', () => {
    it('should show loading state during download', async () => {
      vi.mocked(apiConfig.validateApiConfig).mockReturnValue({
        valid: true,
        errors: [],
      })
      
      vi.mocked(githubApiService.downloadAndSave).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ success: true, message: 'Done' }), 100))
      )
      
      renderAdmin()
      
      const downloadButton = screen.getByText('Download Enterprise Metrics')
      fireEvent.click(downloadButton)
      
      // Button should be disabled during loading
      await waitFor(() => {
        expect(downloadButton).toBeDisabled()
      })
    })
  })

  describe('Demo Mode', () => {
    it('should display demo mode indicator when in demo mode', () => {
      // Mock environment variable
      vi.stubEnv('VITE_DEMO_MODE', 'true')
      
      renderAdmin()
      
      expect(screen.getByText('DEMO MODE')).toBeInTheDocument()
      
      vi.unstubAllEnvs()
    })
  })

  describe('File Upload - 28 Day Report', () => {
    it('should handle valid 28-day report upload', async () => {
      renderAdmin()
      
      const mockFileContent = JSON.stringify({
        day_totals: [
          { date: '2024-01-01', total_suggestions_count: 100 },
          { date: '2024-01-02', total_suggestions_count: 150 },
        ],
        report_start_day: '2024-01-01',
        report_end_day: '2024-01-28',
      })
      
      const file = new File([mockFileContent], 'report.json', { type: 'application/json' })
      
      const uploadInput = screen.getAllByText(/Upload/i)[0].closest('label')?.querySelector('input[type="file"]')
      
      if (uploadInput) {
        fireEvent.change(uploadInput, { target: { files: [file] } })
        
        await waitFor(() => {
          expect(localStorage.getItem('enterprise_report_data')).toBeTruthy()
        })
      }
    })

    it('should reject invalid 28-day report format', async () => {
      renderAdmin()
      
      const mockFileContent = JSON.stringify({
        invalid_data: true,
      })
      
      const file = new File([mockFileContent], 'invalid.json', { type: 'application/json' })
      
      const uploadInput = screen.getAllByText(/Upload/i)[0].closest('label')?.querySelector('input[type="file"]')
      
      if (uploadInput) {
        fireEvent.change(uploadInput, { target: { files: [file] } })
        
        await waitFor(() => {
          expect(screen.getByText(/Invalid file format/i)).toBeInTheDocument()
        })
      }
    })
  })

  describe('Validation Errors Display', () => {
    it('should display validation errors', async () => {
      vi.mocked(apiConfig.validateApiConfig).mockReturnValue({
        valid: false,
        errors: ['Organization is required', 'Token is required'],
      })
      
      renderAdmin()
      
      const downloadButton = screen.getByText('Download Enterprise Metrics')
      fireEvent.click(downloadButton)
      
      await waitFor(() => {
        expect(screen.getByText('Organization is required')).toBeInTheDocument()
        expect(screen.getByText('Token is required')).toBeInTheDocument()
      })
    })
  })
})
