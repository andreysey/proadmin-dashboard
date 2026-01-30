import { z } from 'zod'

export const DashboardStatsSchema = z.object({
  totalUsers: z.number().min(0),
  activeNow: z.number().min(0),
  totalRevenue: z.number().min(0),
  monthlyGrowth: z.number(),
})

export const ActivityDataPointSchema = z.object({
  timestamp: z.iso.datetime(),
  value: z.number(),
})

export const ActivityTypeSchema = z.enum(['new_users', 'revenue', 'orders'])

export const ActivitySeriesSchema = z.object({
  type: ActivityTypeSchema,
  data: z.array(ActivityDataPointSchema),
})

export const RecentEventSchema = z.object({
  id: z.string(),
  type: z.enum(['user_signup', 'user_delete', 'system_alert', 'payment_success']),
  title: z.string(),
  description: z.string(),
  timestamp: z.iso.datetime(),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

export const AnalyticsActivityResponseSchema = z.array(ActivitySeriesSchema)
export const RecentEventsResponseSchema = z.array(RecentEventSchema)
