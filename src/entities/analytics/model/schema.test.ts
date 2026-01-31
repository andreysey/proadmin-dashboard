import { describe, it, expect } from 'vitest'
import { DashboardStatsSchema, RecentEventSchema } from './schema'

describe('Analytics Schemas', () => {
  describe('DashboardStatsSchema', () => {
    it('should validate correct stats', () => {
      const validData = {
        totalUsers: 100,
        activeNow: 10,
        totalRevenue: 5000,
        monthlyGrowth: 15.5,
      }
      expect(DashboardStatsSchema.parse(validData)).toEqual(validData)
    })

    it('should fail on negative numbers for counts', () => {
      const invalidData = {
        totalUsers: -1,
        activeNow: 10,
        totalRevenue: 5000,
        monthlyGrowth: 15.5,
      }
      expect(() => DashboardStatsSchema.parse(invalidData)).toThrow()
    })
  })

  describe('RecentEventSchema', () => {
    it('should validate correct event', () => {
      const validEvent = {
        id: '123',
        type: 'user_signup',
        title: 'New User',
        description: 'John Doe joined',
        timestamp: '2024-01-31T12:00:00Z',
      }
      expect(RecentEventSchema.parse(validEvent)).toEqual(validEvent)
    })

    it('should fail on invalid enum type', () => {
      const invalidEvent = {
        id: '123',
        type: 'invalid_type',
        title: 'New User',
        description: 'John Doe joined',
        timestamp: '2024-01-31T12:00:00Z',
      }
      expect(() => RecentEventSchema.parse(invalidEvent)).toThrow()
    })
  })
})
