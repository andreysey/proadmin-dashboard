import { Card, CardContent, CardHeader, CardTitle, Skeleton } from '@/shared/ui'
import { useTranslation } from 'react-i18next'
import { useRecentEvents } from '@/entities/analytics'
import type { RecentEvent } from '@/entities/analytics'
import { UserPlus, UserMinus, AlertTriangle, CreditCard } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import type { DateRangeValue } from '@/features/dashboard-filters'

type TranslationFn = (key: string, options?: Record<string, unknown>) => string

const eventIcons: Record<RecentEvent['type'], React.ReactNode> = {
  user_signup: <UserPlus className="h-4 w-4 text-green-500" />,
  user_delete: <UserMinus className="h-4 w-4 text-red-500" />,
  system_alert: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
  payment_success: <CreditCard className="h-4 w-4 text-blue-500" />,
}

const formatRelativeTime = (timestamp: string, t: TranslationFn): string => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMinutes < 1) return t('dashboard.activity.time.just_now')
  if (diffMinutes < 60) return t('dashboard.activity.time.minutes_ago', { count: diffMinutes })
  if (diffHours < 24) return t('dashboard.activity.time.hours_ago', { count: diffHours })
  return t('dashboard.activity.time.days_ago', { count: diffDays })
}

interface EventItemProps {
  event: RecentEvent
  t: TranslationFn
}

const EventItem = ({ event, t }: EventItemProps) => {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="bg-muted mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
        {eventIcons[event.type]}
      </div>
      <div className="flex-1 space-y-1">
        <p className="text-sm leading-none font-medium">
          {t(`dashboard.activity.events.${event.type}.title`)}
        </p>
        <p className="text-muted-foreground text-xs">
          {t(`dashboard.activity.events.${event.type}.description`)}
        </p>
      </div>
      <time className="text-muted-foreground text-xs">
        {formatRelativeTime(event.timestamp, t)}
      </time>
    </div>
  )
}

const RecentActivityFeedSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-32" />
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

interface RecentActivityFeedProps {
  dateRange: DateRangeValue
  autoRefresh?: boolean
}

export const RecentActivityFeed = ({ dateRange, autoRefresh = false }: RecentActivityFeedProps) => {
  const { data, isPending, isError } = useRecentEvents(dateRange, autoRefresh)
  const { t } = useTranslation()

  if (isPending) {
    return <RecentActivityFeedSkeleton />
  }

  if (isError || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.activity.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed">
            <p className="text-muted-foreground">{t('dashboard.activity.error')}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('dashboard.activity.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={cn('divide-y', data.length === 0 && 'py-8 text-center')}>
          {data.length === 0 ? (
            <p className="text-muted-foreground">{t('dashboard.activity.empty')}</p>
          ) : (
            data.map((event) => <EventItem key={event.id} event={event} t={t} />)
          )}
        </div>
      </CardContent>
    </Card>
  )
}
