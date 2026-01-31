import { createFileRoute } from '@tanstack/react-router'
import { StatsOverview } from '@/widgets/StatsOverview'
import { ActivityChart } from '@/widgets/ActivityChart'
import { RecentActivityFeed } from '@/widgets/RecentActivityFeed'
import { RevenueStream } from '@/widgets/RevenueStream'
import {
  DateRangePicker,
  type DateRangeValue,
  dashboardSearchSchema,
} from '@/features/dashboard-filters'

export const Route = createFileRoute('/_dashboard/')({
  validateSearch: (search) => dashboardSearchSchema.parse(search),
  component: DashboardPage,
})

function DashboardPage() {
  // Step 1: Read URL state
  const { dateRange } = Route.useSearch()
  // Step 2: Get navigate function to update URL
  const navigate = Route.useNavigate()

  // Handler: Update URL when date range changes
  const handleDateRangeChange = (newRange: DateRangeValue) => {
    navigate({
      search: (prev) => ({ ...prev, dateRange: newRange }),
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
        <div className="flex items-center gap-2">
          <DateRangePicker value={dateRange} onChange={handleDateRangeChange} />
          {/* Auto-refresh toggle will go here */}
        </div>
      </div>

      <StatsOverview dateRange={dateRange} />

      <div className="grid gap-6 lg:grid-cols-3">
        <RecentActivityFeed dateRange={dateRange} />
        <RevenueStream dateRange={dateRange} />
        <ActivityChart dateRange={dateRange} />
      </div>
    </div>
  )
}
