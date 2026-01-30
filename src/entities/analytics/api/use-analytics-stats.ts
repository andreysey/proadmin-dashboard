import { useQuery } from '@tanstack/react-query'
import { getStats } from './analytics.api'

/**
 * Hook for fetching dashboard statistics.
 * Uses 5-minute stale time for caching.
 */
export const useAnalyticsStats = () => {
  return useQuery({
    queryKey: ['analytics', 'stats'],
    queryFn: getStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
