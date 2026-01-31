import { z } from 'zod'

/**
 * Single Source of Truth for dashboard filters.
 * Types are derived from schemas using z.infer<>.
 */

// Date Range
export const dateRangeSchema = z.enum(['24h', '7d', '30d'])
export type DateRangeValue = z.infer<typeof dateRangeSchema>

// Auto-Refresh
export const autoRefreshSchema = z.boolean()
export type AutoRefreshValue = z.infer<typeof autoRefreshSchema>

// Full dashboard search params schema
export const dashboardSearchSchema = z.object({
  dateRange: dateRangeSchema.optional().default('7d'),
  autoRefresh: autoRefreshSchema.optional().default(false),
})

export type DashboardSearchParams = z.infer<typeof dashboardSearchSchema>
