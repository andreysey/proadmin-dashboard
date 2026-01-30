import { api } from '@/shared/api'
import {
  DashboardStatsSchema,
  AnalyticsActivityResponseSchema,
  RecentEventsResponseSchema,
  RevenueResponseSchema,
} from '../model/schema'
import type { DashboardStats, ActivitySeries, RecentEvent, RevenueDataPoint } from '../model/types'

/**
 * Get dashboard statistics.
 * Response is validated at the network boundary with Zod.
 */
export const getStats = async (): Promise<DashboardStats> => {
  const { data } = await api.get('/analytics/stats')
  return DashboardStatsSchema.parse(data)
}

/**
 * Get user activity data for charts.
 * Response is validated with Zod schema.
 */
export const getActivity = async (): Promise<ActivitySeries[]> => {
  const { data } = await api.get('/analytics/activity')
  return AnalyticsActivityResponseSchema.parse(data)
}

/**
 * Get recent system events.
 * Response is validated with Zod schema.
 */
export const getRecentEvents = async (): Promise<RecentEvent[]> => {
  const { data } = await api.get('/analytics/recent')
  return RecentEventsResponseSchema.parse(data)
}

/**
 * Get monthly revenue data for bar chart.
 * Response is validated with Zod schema.
 */
export const getRevenueData = async (): Promise<RevenueDataPoint[]> => {
  const { data } = await api.get('/analytics/revenue')
  return RevenueResponseSchema.parse(data)
}
