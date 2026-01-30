import { useQuery } from '@tanstack/react-query'
import { getRecentEvents } from './analytics.api'

/**
 * Hook for fetching recent system events.
 * Uses 2-minute stale time (events are more volatile).
 */
export const useRecentEvents = () => {
  return useQuery({
    queryKey: ['analytics', 'recent'],
    queryFn: getRecentEvents,
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}
