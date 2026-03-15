import { Card, CardContent, CardHeader, CardTitle, Skeleton, Button } from '@/shared/ui'
import { useTranslation } from 'react-i18next'
import { useRecentEvents } from '@/entities/analytics'
import type { RecentEvent } from '@/entities/analytics'
import {
  UserPlus,
  UserMinus,
  AlertTriangle,
  CreditCard,
  LogIn,
  User,
  ArrowRight,
} from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import type { DateRangeValue } from '@/features/dashboard-filters'
import { Link } from '@tanstack/react-router'
import { formatRelativeTime } from '@/shared/lib/date'

type TranslationFn = (key: string, options?: Record<string, unknown>) => string

const eventIcons: Record<string, React.ReactNode> = {
  user_signup: <UserPlus className="h-4 w-4 text-green-500" />,
  user_delete: <UserMinus className="h-4 w-4 text-red-500" />,
  user_login: <LogIn className="h-4 w-4 text-blue-500" />,
  user_updated: <User className="h-4 w-4 text-orange-500" />,
  system_alert: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
  payment_success: <CreditCard className="h-4 w-4 text-blue-500" />,
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
          {event.description || t(`dashboard.activity.events.${event.type}.description`)}
        </p>
      </div>
      <time className="text-muted-foreground text-xs">{formatRelativeTime(event.timestamp)}</time>
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
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>{t('dashboard.activity.title')}</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/activity-log">
            {t('dashboard.activity.view_all')}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
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
