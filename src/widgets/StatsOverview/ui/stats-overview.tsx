import { Card, CardContent, CardHeader, CardTitle, Skeleton } from '@/shared/ui'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
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
            {trend}% {t('dashboard.stats.last_month')}
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
  autoRefresh?: boolean
}

export const StatsOverview = ({ dateRange, autoRefresh = false }: StatsOverviewProps) => {
  const { data, isPending, isError } = useAnalyticsStats(dateRange, autoRefresh)
  const { t } = useTranslation()

  if (isPending) {
    return <StatsOverviewSkeleton />
  }

  if (isError || !data) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground">{t('dashboard.stats.error')}</p>
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
        title={t('dashboard.stats.total_users')}
        value={formatNumber(data.totalUsers)}
        icon={<Users className="h-4 w-4" />}
        trend={data.monthlyGrowth}
      />
      <StatCard
        title={t('dashboard.stats.active_now')}
        value={data.activeNow}
        icon={<Activity className="h-4 w-4" />}
      />
      <StatCard
        title={t('dashboard.stats.total_revenue')}
        value={formatCurrency(data.totalRevenue)}
        icon={<DollarSign className="h-4 w-4" />}
        trend={8.2}
      />
      <StatCard
        title={t('dashboard.stats.monthly_growth')}
        value={`${data.monthlyGrowth}%`}
        icon={<TrendingUp className="h-4 w-4" />}
        trend={data.monthlyGrowth}
      />
    </div>
  )
}
