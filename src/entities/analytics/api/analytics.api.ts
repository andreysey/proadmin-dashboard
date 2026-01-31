import { api } from '@/shared/api'
import {
  DashboardStatsSchema,
  AnalyticsActivityResponseSchema,
  RecentEventsResponseSchema,
  RevenueResponseSchema,
} from '../model/schema'
import type { DashboardStats, ActivitySeries, RecentEvent, RevenueDataPoint } from '../model/types'
import type { DateRangeValue } from '@/features/dashboard-filters'

/**
 * Get dashboard statistics.
 * Response is validated at the network boundary with Zod.
 */
export const getStats = async (dateRange: DateRangeValue): Promise<DashboardStats> => {
  const { data } = await api.get('/analytics/stats', { params: { dateRange } })
  return DashboardStatsSchema.parse(data)
}

/**
 * Get user activity data for charts.
 * Response is validated with Zod schema.
 */
export const getActivity = async (dateRange: DateRangeValue): Promise<ActivitySeries[]> => {
  const { data } = await api.get('/analytics/activity', { params: { dateRange } })
  return AnalyticsActivityResponseSchema.parse(data)
}

/**
 * Get recent system events.
 * Response is validated with Zod schema.
 */
export const getRecentEvents = async (dateRange: DateRangeValue): Promise<RecentEvent[]> => {
  const { data } = await api.get('/analytics/recent', { params: { dateRange } })
  return RecentEventsResponseSchema.parse(data)
}

/**
 * Get monthly revenue data for bar chart.
 * Response is validated with Zod schema.
 */
export const getRevenueData = async (dateRange: DateRangeValue): Promise<RevenueDataPoint[]> => {
  const { data } = await api.get('/analytics/revenue', { params: { dateRange } })
  return RevenueResponseSchema.parse(data)
}
