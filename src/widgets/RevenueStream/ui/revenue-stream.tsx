import { Card, CardContent, CardHeader, CardTitle, Skeleton } from '@/shared/ui'
import { useTranslation } from 'react-i18next'
import { useRevenueData } from '@/entities/analytics'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { DateRangeValue } from '@/features/dashboard-filters'

const RevenueStreamSkeleton = () => {
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

interface RevenueStreamProps {
  dateRange: DateRangeValue
  autoRefresh?: boolean
}

export const RevenueStream = ({ dateRange, autoRefresh = false }: RevenueStreamProps) => {
  const { data, isPending, isError } = useRevenueData(dateRange, autoRefresh)
  const { t } = useTranslation()

  if (isPending) {
    return <RevenueStreamSkeleton />
  }

  if (isError || !data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.revenue.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center rounded-lg border border-dashed">
            <p className="text-muted-foreground">{t('dashboard.revenue.error')}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('dashboard.revenue.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart responsive data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis width="auto" tickFormatter={(value) => `€${value / 1000}k`} />
            <Tooltip
              formatter={(value) => [formatCurrency(Number(value)), t('dashboard.revenue.tooltip')]}
              contentStyle={{
                backgroundColor: 'var(--foreground)',
              }}
              labelStyle={{ color: 'var(--background)' }}
            />
            <Bar dataKey="revenue" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
