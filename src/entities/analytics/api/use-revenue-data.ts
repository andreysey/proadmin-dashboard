import { useQuery } from '@tanstack/react-query'
import { getRevenueData } from './analytics.api'
import type { DateRangeValue } from '@/features/dashboard-filters'

/**
 * Hook for fetching monthly revenue data.
 * Uses 5-minute stale time for caching.
 */
export const useRevenueData = (dateRange: DateRangeValue) => {
  return useQuery({
    queryKey: ['analytics', 'revenue', dateRange],
    queryFn: () => getRevenueData(dateRange),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
