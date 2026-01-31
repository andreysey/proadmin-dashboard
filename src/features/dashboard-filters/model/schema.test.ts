import { describe, it, expect } from 'vitest'
import { dateRangeSchema, dashboardSearchSchema } from './schema'

describe('Dashboard Filters Schema', () => {
  describe('dateRangeSchema', () => {
    it('should parse valid date ranges', () => {
      expect(dateRangeSchema.parse('24h')).toBe('24h')
      expect(dateRangeSchema.parse('7d')).toBe('7d')
      expect(dateRangeSchema.parse('30d')).toBe('30d')
    })

    it('should throw error for invalid value (pure enum)', () => {
      // Zod's enum schema throws on invalid input if not wrapped in catch
      expect(() => dateRangeSchema.parse('1y')).toThrow()
    })
  })

  describe('dashboardSearchSchema', () => {
    it('should validate complete params', () => {
      const input = { dateRange: '30d', autoRefresh: true }
      expect(dashboardSearchSchema.parse(input)).toEqual(input)
    })

    it('should provide default fallbacks for invalid or missing values', () => {
      // Empty input
      expect(dashboardSearchSchema.parse({})).toEqual({
        dateRange: '7d',
        autoRefresh: false,
      })

      // Invalid inputs
      expect(dashboardSearchSchema.parse({ dateRange: '1y', autoRefresh: 'invalid' })).toEqual({
        dateRange: '7d', // Fallback
        autoRefresh: false, // Fallback (boolean schema might fail hard if type mismatched, but let's see catch behavior)
      })
    })

    it('should handle boolean type mismatch via catch', () => {
      // If boolean schema receives string, it usually throws. .catch() should handle it.
      const result = dashboardSearchSchema.parse({ autoRefresh: 'invalid' })
      expect(result.autoRefresh).toBe(false)
    })
  })
})
