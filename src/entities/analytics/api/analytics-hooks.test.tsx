import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'

// Hooks
import { useAnalyticsActivity } from './use-analytics-activity'
import { useAnalyticsStats } from './use-analytics-stats'
import { useRecentEvents } from './use-recent-events'
import { useRevenueData } from './use-revenue-data'

// API
import * as analyticsApi from './analytics.api'

// Mock the API module
vi.mock('./analytics.api', () => ({
  getActivity: vi.fn(),
  getStats: vi.fn(),
  getRecentEvents: vi.fn(),
  getRevenueData: vi.fn(),
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('Analytics Hooks', () => {
  const mockDateRange = '30d'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('useAnalyticsActivity', () => {
    it('should fetch activity data', async () => {
      const mockData = [{ type: 'new_users' as const, data: [] }]
      vi.mocked(analyticsApi.getActivity).mockResolvedValue(mockData)

      const { result } = renderHook(() => useAnalyticsActivity(mockDateRange), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toEqual(mockData)
      expect(analyticsApi.getActivity).toHaveBeenCalledWith(mockDateRange)
    })
  })

  describe('useAnalyticsStats', () => {
    it('should fetch stats data', async () => {
      const mockData = { totalUsers: 100, activeNow: 5, totalRevenue: 5000, monthlyGrowth: 10 }
      vi.mocked(analyticsApi.getStats).mockResolvedValue(mockData)

      const { result } = renderHook(() => useAnalyticsStats(mockDateRange), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toEqual(mockData)
      expect(analyticsApi.getStats).toHaveBeenCalledWith(mockDateRange)
    })
  })

  describe('useRecentEvents', () => {
    it('should fetch recent events', async () => {
      const mockData: import('@/entities/analytics').RecentEvent[] = []
      vi.mocked(analyticsApi.getRecentEvents).mockResolvedValue(mockData)

      const { result } = renderHook(() => useRecentEvents(mockDateRange), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toEqual(mockData)
      expect(analyticsApi.getRecentEvents).toHaveBeenCalledWith(mockDateRange)
    })
  })

  describe('useRevenueData', () => {
    it('should fetch revenue data', async () => {
      const mockData: import('@/entities/analytics').RevenueDataPoint[] = []
      vi.mocked(analyticsApi.getRevenueData).mockResolvedValue(mockData)

      const { result } = renderHook(() => useRevenueData(mockDateRange), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toEqual(mockData)
      expect(analyticsApi.getRevenueData).toHaveBeenCalledWith(mockDateRange)
    })
  })
})
