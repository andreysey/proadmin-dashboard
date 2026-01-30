import { useQuery } from '@tanstack/react-query'
import { getActivity } from './analytics.api'

/**
 * Hook for fetching activity chart data.
 * Uses 5-minute stale time for caching.
 */
export const useAnalyticsActivity = () => {
  return useQuery({
    queryKey: ['analytics', 'activity'],
    queryFn: getActivity,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
