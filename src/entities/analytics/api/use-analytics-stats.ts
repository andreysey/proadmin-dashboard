import { useQuery } from '@tanstack/react-query'
import { getStats } from './analytics.api'
import type { DateRangeValue } from '@/features/dashboard-filters'

/**
 * Hook for fetching dashboard statistics.
 * Uses 5-minute stale time for caching.
 *
 * Key insight: dateRange in queryKey ensures React Query
 * automatically refetches when the filter changes.
 */
export const useAnalyticsStats = (dateRange: DateRangeValue) => {
  return useQuery({
    queryKey: ['analytics', 'stats', dateRange],
    queryFn: () => getStats(dateRange),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
