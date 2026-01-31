import { createFileRoute } from '@tanstack/react-router'
import { StatsOverview } from '@/widgets/StatsOverview'
import { ActivityChart } from '@/widgets/ActivityChart'
import { RecentActivityFeed } from '@/widgets/RecentActivityFeed'
import { RevenueStream } from '@/widgets/RevenueStream'
import {
  DateRangePicker,
  AutoRefreshToggle,
  type DateRangeValue,
  dashboardSearchSchema,
} from '@/features/dashboard-filters'
import { ExportButton } from '@/features/export-dashboard'
import { useAnalyticsStats, useRecentEvents } from '@/entities/analytics'

export const Route = createFileRoute('/_dashboard/')({
  validateSearch: (search) => dashboardSearchSchema.parse(search),
  component: DashboardPage,
})

function DashboardPage() {
  // Step 1: Read URL state
  const { dateRange, autoRefresh } = Route.useSearch()
  // Step 2: Get navigate function to update URL
  const navigate = Route.useNavigate()

  // Data for export (React Query returns cached data if already fetched)
  const { data: stats } = useAnalyticsStats(dateRange, autoRefresh)
  const { data: events } = useRecentEvents(dateRange, autoRefresh)

  // Handler: Update URL when date range changes
  const handleDateRangeChange = (newRange: DateRangeValue) => {
    navigate({
      search: (prev) => ({ ...prev, dateRange: newRange }),
    })
  }

  // Handler: Update URL when auto-refresh toggle changes
  const handleAutoRefreshChange = (enabled: boolean) => {
    navigate({
      search: (prev) => ({ ...prev, autoRefresh: enabled }),
    })
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header with filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your analytics.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <AutoRefreshToggle enabled={autoRefresh} onChange={handleAutoRefreshChange} />
          <DateRangePicker value={dateRange} onChange={handleDateRangeChange} />
          <ExportButton stats={stats} events={events} dateRange={dateRange} />
        </div>
      </div>

      <StatsOverview dateRange={dateRange} autoRefresh={autoRefresh} />

      <div className="grid gap-6 lg:grid-cols-3">
        <RecentActivityFeed dateRange={dateRange} autoRefresh={autoRefresh} />
        <RevenueStream dateRange={dateRange} autoRefresh={autoRefresh} />
        <ActivityChart dateRange={dateRange} autoRefresh={autoRefresh} />
      </div>
    </div>
  )
}
