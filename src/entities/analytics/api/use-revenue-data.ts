import { useQuery } from '@tanstack/react-query'
import { getRevenueData } from './analytics.api'

/**
 * Hook for fetching monthly revenue data.
 * Uses 5-minute stale time for caching.
 */
export const useRevenueData = () => {
  return useQuery({
    queryKey: ['analytics', 'revenue'],
    queryFn: getRevenueData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
