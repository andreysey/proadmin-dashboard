export interface DashboardStats {
  totalUsers: number
  activeNow: number
  totalRevenue: number
  monthlyGrowth: number // percentage
}

export interface ActivityDataPoint {
  timestamp: string
  value: number
}

export type ActivityType = 'new_users' | 'revenue' | 'orders'

export interface ActivitySeries {
  type: ActivityType
  data: ActivityDataPoint[]
}

export interface RecentEvent {
  id: string
  type: 'user_signup' | 'user_delete' | 'system_alert' | 'payment_success'
  title: string
  description: string
  timestamp: string
  metadata?: Record<string, unknown>
}

export interface RevenueDataPoint {
  month: string
  revenue: number
  orders: number
}
