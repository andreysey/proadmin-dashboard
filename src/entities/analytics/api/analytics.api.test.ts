import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getStats, getActivity, getRecentEvents, getRevenueData } from './analytics.api'
import { api } from '@/shared/api'

// Mock shared API
vi.mock('@/shared/api', () => ({
  api: {
    get: vi.fn(),
  },
}))

describe('Analytics API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const mockDateRange = '7d'

  describe('getStats', () => {
    const mockStats = {
      totalUsers: 100,
      activeNow: 25,
      totalRevenue: 5000,
      monthlyGrowth: 10.5,
    }

    it('should fetch and parse stats successfully', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: mockStats })

      const result = await getStats(mockDateRange)

      expect(api.get).toHaveBeenCalledWith('/analytics/stats', {
        params: { dateRange: mockDateRange },
      })
      expect(result).toEqual(mockStats)
    })

    it('should throw Schema Error if response is invalid', async () => {
      // Missing totalRevenue
      vi.mocked(api.get).mockResolvedValue({ data: { totalUsers: 100, activeNow: 25 } })

      await expect(getStats(mockDateRange)).rejects.toThrow()
    })
  })

  describe('getActivity', () => {
    const mockActivity = [
      {
        type: 'new_users',
        data: [{ timestamp: '2023-01-01T00:00:00Z', value: 10 }],
      },
    ]

    it('should fetch and parse activity successfully', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: mockActivity })

      const result = await getActivity(mockDateRange)

      expect(api.get).toHaveBeenCalledWith('/analytics/activity', {
        params: { dateRange: mockDateRange },
      })
      expect(result).toEqual(mockActivity)
    })
  })

  describe('getRecentEvents', () => {
    const mockEvents = [
      {
        id: '1',
        type: 'user_signup',
        title: 'User Joined',
        description: 'User created account',
        timestamp: '2023-01-01T10:00:00Z',
      },
    ]

    it('should fetch and parse recent events successfully', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: mockEvents })

      const result = await getRecentEvents(mockDateRange)

      expect(api.get).toHaveBeenCalledWith('/analytics/recent', {
        params: { dateRange: mockDateRange },
      })
      expect(result).toEqual(mockEvents)
    })

    it('should throw if event type is unknown', async () => {
      const invalidEvents = [
        {
          id: '1',
          type: 'unknown_type', // Invalid enum
          title: 'Title',
          description: 'Desc',
          timestamp: '2023-01-01',
        },
      ]
      vi.mocked(api.get).mockResolvedValue({ data: invalidEvents })

      await expect(getRecentEvents(mockDateRange)).rejects.toThrow()
    })
  })

  describe('getRevenueData', () => {
    const mockRevenue = [
      {
        month: 'Jan',
        revenue: 5000,
        orders: 120,
      },
    ]

    it('should fetch and parse revenue data successfully', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: mockRevenue })

      const result = await getRevenueData(mockDateRange)

      expect(api.get).toHaveBeenCalledWith('/analytics/revenue', {
        params: { dateRange: mockDateRange },
      })
      expect(result).toEqual(mockRevenue)
    })
  })
})
