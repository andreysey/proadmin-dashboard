import { useQuery } from '@tanstack/react-query'
import { getRecentEvents } from './analytics.api'
import type { DateRangeValue } from '@/features/dashboard-filters'

const REFETCH_INTERVAL = 30_000 // 30 seconds

/**
 * Hook for fetching recent system events.
 * Uses 2-minute stale time (events are more volatile).
 */
export const useRecentEvents = (dateRange: DateRangeValue, autoRefresh = false) => {
  return useQuery({
    queryKey: ['analytics', 'recent', dateRange],
    queryFn: () => getRecentEvents(dateRange),
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchInterval: autoRefresh ? REFETCH_INTERVAL : false,
  })
}
