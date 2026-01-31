import { Card, CardContent, CardHeader, CardTitle, Skeleton } from '@/shared/ui'
import { useAnalyticsStats } from '@/entities/analytics'
import { Users, Activity, DollarSign, TrendingUp } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import type { DateRangeValue } from '@/features/dashboard-filters'

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  trend?: number
  className?: string
}

const StatCard = ({ title, value, icon, trend, className }: StatCardProps) => {
  return (
    <Card className={cn('transition-shadow hover:shadow-md', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend !== undefined && (
          <p className={cn('text-xs', trend >= 0 ? 'text-green-600' : 'text-red-600')}>
            {trend >= 0 ? '+' : ''}
            {trend}% from last month
          </p>
        )}
      </CardContent>
    </Card>
  )
}

const StatsOverviewSkeleton = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="mb-2 h-8 w-20" />
            <Skeleton className="h-3 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

interface StatsOverviewProps {
  dateRange: DateRangeValue
}

export const StatsOverview = ({ dateRange }: StatsOverviewProps) => {
  const { data, isPending, isError } = useAnalyticsStats(dateRange)

  if (isPending) {
    return <StatsOverviewSkeleton />
  }

  if (isError || !data) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground">Failed to load statistics</p>
      </div>
    )
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('de-DE').format(value)
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Users"
        value={formatNumber(data.totalUsers)}
        icon={<Users className="h-4 w-4" />}
        trend={data.monthlyGrowth}
      />
      <StatCard title="Active Now" value={data.activeNow} icon={<Activity className="h-4 w-4" />} />
      <StatCard
        title="Total Revenue"
        value={formatCurrency(data.totalRevenue)}
        icon={<DollarSign className="h-4 w-4" />}
        trend={8.2}
      />
      <StatCard
        title="Monthly Growth"
        value={`${data.monthlyGrowth}%`}
        icon={<TrendingUp className="h-4 w-4" />}
        trend={data.monthlyGrowth}
      />
    </div>
  )
}
