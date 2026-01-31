import { Card, CardContent, CardHeader, CardTitle, Skeleton } from '@/shared/ui'
import { useAnalyticsActivity } from '@/entities/analytics'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { DateRangeValue } from '@/features/dashboard-filters'

const ActivityChartSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-32" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[300px] w-full" />
      </CardContent>
    </Card>
  )
}

interface ActivityChartProps {
  dateRange: DateRangeValue
  autoRefresh?: boolean
}

export const ActivityChart = ({ dateRange, autoRefresh = false }: ActivityChartProps) => {
  const { data, isPending, isError } = useAnalyticsActivity(dateRange, autoRefresh)

  if (isPending) {
    return <ActivityChartSkeleton />
  }

  if (isError || !data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center rounded-lg border border-dashed">
            <p className="text-muted-foreground">Failed to load activity data</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Transform data for Recharts
  const chartData = data[0]?.data.map((point) => ({
    date: new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: 'short',
    }).format(new Date(point.timestamp)),
    value: point.value,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart responsive data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis width="auto" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--foreground)',
              }}
              labelStyle={{ color: 'var(--background)' }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--chart-1)"
              strokeWidth={2}
              fill="var(--chart-1)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
