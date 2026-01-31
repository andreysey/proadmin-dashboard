import { useQuery } from '@tanstack/react-query'
import { getActivity } from './analytics.api'
import type { DateRangeValue } from '@/features/dashboard-filters'

const REFETCH_INTERVAL = 30_000 // 30 seconds

/**
 * Hook for fetching activity chart data.
 * dateRange in queryKey ensures automatic refetch on filter change.
 */
export const useAnalyticsActivity = (dateRange: DateRangeValue, autoRefresh = false) => {
  return useQuery({
    queryKey: ['analytics', 'activity', dateRange],
    queryFn: () => getActivity(dateRange),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: autoRefresh ? REFETCH_INTERVAL : false,
  })
}
