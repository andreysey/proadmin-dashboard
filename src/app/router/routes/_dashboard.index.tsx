import { createFileRoute } from '@tanstack/react-router'
import { StatsOverview } from '@/widgets/StatsOverview'
import { ActivityChart } from '@/widgets/ActivityChart'
import { RecentActivityFeed } from '@/widgets/RecentActivityFeed'
import { RevenueStream } from '@/widgets/RevenueStream'

export const Route = createFileRoute('/_dashboard/')({
  component: DashboardPage,
})

function DashboardPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your analytics.</p>
      </div>

      <StatsOverview />

      <div className="grid gap-6 lg:grid-cols-3">
        <RecentActivityFeed />

        <RevenueStream />
        <ActivityChart />
      </div>
    </div>
  )
}
