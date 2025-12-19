import { describe, it, expect, beforeEach, vi } from 'vitest'
import { loadApiConfig, saveApiConfig, validateApiConfig } from '../../config/apiConfig'
import type { APIConfig } from '../../types/metrics'

describe('API Configuration', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('loadApiConfig', () => {
    it('should return null when no config exists', () => {
      const config = loadApiConfig()
      expect(config).toBeNull()
    })

    it('should load config from localStorage', () => {
      const mockConfig: APIConfig = {
        org: 'test-org',
        token: 'test-token',
        since: '2024-01-01',
        until: '2024-01-28',
        team_slug: 'test-team',
      }

      localStorage.setItem('copilot_api_config', JSON.stringify(mockConfig))

      const config = loadApiConfig()
      expect(config).toEqual(mockConfig)
    })

    it('should handle corrupted localStorage data', () => {
      localStorage.setItem('copilot_api_config', 'invalid-json')

      const config = loadApiConfig()
      expect(config).toBeNull()
    })

    it('should load partial config without token', () => {
      const mockConfig = {
        org: 'test-org',
        since: '2024-01-01',
        until: '2024-01-28',
      }

      localStorage.setItem('copilot_api_config', JSON.stringify(mockConfig))

      const config = loadApiConfig()
      expect(config).toEqual(mockConfig)
      expect(config?.token).toBeUndefined()
    })
  })

  describe('saveApiConfig', () => {
    it('should save config to localStorage without token', () => {
      const mockConfig: APIConfig = {
        org: 'test-org',
        token: 'ghp_secret123',
        since: '2024-01-01',
        until: '2024-01-28',
        team_slug: 'test-team',
      }

      saveApiConfig(mockConfig)

      const saved = localStorage.getItem('copilot_api_config')
      expect(saved).toBeTruthy()

      const parsed = JSON.parse(saved!)
      expect(parsed.org).toBe('test-org')
      expect(parsed.since).toBe('2024-01-01')
      expect(parsed.until).toBe('2024-01-28')
      expect(parsed.team_slug).toBe('test-team')
      expect(parsed.token).toBeUndefined() // Token should not be saved
    })

    it('should handle empty config', () => {
      const emptyConfig: APIConfig = {
        org: '',
        token: '',
        since: '',
        until: '',
        team_slug: '',
      }

      saveApiConfig(emptyConfig)

      const saved = localStorage.getItem('copilot_api_config')
      expect(saved).toBeTruthy()
    })

    it('should overwrite existing config', () => {
      const config1: APIConfig = {
        org: 'org1',
        token: 'token1',
        since: '2024-01-01',
        until: '2024-01-28',
        team_slug: '',
      }

      const config2: APIConfig = {
        org: 'org2',
        token: 'token2',
        since: '2024-02-01',
        until: '2024-02-28',
        team_slug: 'team2',
      }

      saveApiConfig(config1)
      saveApiConfig(config2)

      const saved = localStorage.getItem('copilot_api_config')
      const parsed = JSON.parse(saved!)
      
      expect(parsed.org).toBe('org2')
      expect(parsed.since).toBe('2024-02-01')
    })
  })

  describe('validateApiConfig', () => {
    it('should validate a complete config as valid', () => {
      const validConfig: APIConfig = {
        org: 'test-org',
        token: 'ghp_test123',
        since: '2024-01-01',
        until: '2024-01-28',
        team_slug: 'test-team',
      }

      const result = validateApiConfig(validConfig)
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should require organization', () => {
      const invalidConfig: APIConfig = {
        org: '',
        token: 'ghp_test123',
        since: '2024-01-01',
        until: '2024-01-28',
        team_slug: '',
      }

      const result = validateApiConfig(invalidConfig)
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Organization is required')
    })

    it('should require token', () => {
      const invalidConfig: APIConfig = {
        org: 'test-org',
        token: '',
        since: '2024-01-01',
        until: '2024-01-28',
        team_slug: '',
      }

      const result = validateApiConfig(invalidConfig)
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('GitHub token is required')
    })

    it('should validate token format', () => {
      const invalidConfig: APIConfig = {
        org: 'test-org',
        token: 'invalid-token',
        since: '2024-01-01',
        until: '2024-01-28',
        team_slug: '',
      }

      const result = validateApiConfig(invalidConfig)
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Token must start with ghp_ or gho_')
    })

    it('should accept ghp_ token prefix', () => {
      const validConfig: APIConfig = {
        org: 'test-org',
        token: 'ghp_validtoken123',
        since: '2024-01-01',
        until: '2024-01-28',
        team_slug: '',
      }

      const result = validateApiConfig(validConfig)
      expect(result.valid).toBe(true)
    })

    it('should accept gho_ token prefix', () => {
      const validConfig: APIConfig = {
        org: 'test-org',
        token: 'gho_validtoken123',
        since: '2024-01-01',
        until: '2024-01-28',
        team_slug: '',
      }

      const result = validateApiConfig(validConfig)
      expect(result.valid).toBe(true)
    })

    it('should allow optional team_slug', () => {
      const validConfig: APIConfig = {
        org: 'test-org',
        token: 'ghp_test123',
        since: '2024-01-01',
        until: '2024-01-28',
        team_slug: '',
      }

      const result = validateApiConfig(validConfig)
      expect(result.valid).toBe(true)
    })

    it('should validate date format for since', () => {
      const invalidConfig: APIConfig = {
        org: 'test-org',
        token: 'ghp_test123',
        since: 'invalid-date',
        until: '2024-01-28',
        team_slug: '',
      }

      const result = validateApiConfig(invalidConfig)
      expect(result.valid).toBe(false)
      expect(result.errors.some(e => e.includes('since'))).toBe(true)
    })

    it('should validate date format for until', () => {
      const invalidConfig: APIConfig = {
        org: 'test-org',
        token: 'ghp_test123',
        since: '2024-01-01',
        until: 'invalid-date',
        team_slug: '',
      }

      const result = validateApiConfig(invalidConfig)
      expect(result.valid).toBe(false)
      expect(result.errors.some(e => e.includes('until'))).toBe(true)
    })

    it('should validate that until is after since', () => {
      const invalidConfig: APIConfig = {
        org: 'test-org',
        token: 'ghp_test123',
        since: '2024-02-01',
        until: '2024-01-01',
        team_slug: '',
      }

      const result = validateApiConfig(invalidConfig)
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Until date must be after since date')
    })

    it('should return multiple errors when multiple validations fail', () => {
      const invalidConfig: APIConfig = {
        org: '',
        token: '',
        since: '',
        until: '',
        team_slug: '',
      }

      const result = validateApiConfig(invalidConfig)
      expect(result.valid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(1)
    })

    it('should allow same date for since and until', () => {
      const validConfig: APIConfig = {
        org: 'test-org',
        token: 'ghp_test123',
        since: '2024-01-15',
        until: '2024-01-15',
        team_slug: '',
      }

      const result = validateApiConfig(validConfig)
      expect(result.valid).toBe(true)
    })
  })
})
