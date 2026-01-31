import { z } from 'zod'

/**
 * Single Source of Truth for dashboard filters.
 * Types are derived from schemas using z.infer<>.
 *
 * Using .catch() provides fallback for missing or invalid values.
 */

// Date Range
export const dateRangeSchema = z.enum(['24h', '7d', '30d'])
export type DateRangeValue = z.infer<typeof dateRangeSchema>

// Auto-Refresh
export const autoRefreshSchema = z.boolean()
export type AutoRefreshValue = z.infer<typeof autoRefreshSchema>

// Full dashboard search params schema (strict - for reading)
export const dashboardSearchSchema = z.object({
  dateRange: dateRangeSchema.catch('7d'),
  autoRefresh: autoRefreshSchema.catch(false),
})

export type DashboardSearchParams = z.infer<typeof dashboardSearchSchema>

// Partial schema for navigation (optional - for navigation)
export type DashboardSearchInput = Partial<DashboardSearchParams>
