import { useActivityLogs } from '@/entities/activity-log'
import { formatDateTime } from '@/shared/lib/date'
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/shared/ui'
import { useTranslation } from 'react-i18next'
import {
  UserPlus,
  UserMinus,
  AlertTriangle,
  CreditCard,
  LogIn,
  User,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useState } from 'react'

const eventIcons: Record<string, React.ReactNode> = {
  user_signup: <UserPlus className="h-4 w-4 text-green-500" />,
  user_delete: <UserMinus className="h-4 w-4 text-red-500" />,
  user_login: <LogIn className="h-4 w-4 text-blue-500" />,
  user_updated: <User className="h-4 w-4 text-orange-500" />,
  system_alert: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
  payment_success: <CreditCard className="h-4 w-4 text-blue-500" />,
}

export const ActivityLogPage = () => {
  const { t } = useTranslation()
  const [page, setPage] = useState(0)
  const take = 10
  const skip = page * take

  const { data, isLoading } = useActivityLogs(skip, take)

  const totalPages = data ? Math.ceil(data.total / take) : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('dashboard.activity.full_title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors">
                <th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium whitespace-nowrap">
                  {t('common.date')}
                </th>
                <th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium whitespace-nowrap">
                  {t('common.event')}
                </th>
                <th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium">
                  {t('common.description')}
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="p-4 text-center">
                    {t('common.loading')}
                  </td>
                </tr>
              ) : (
                data?.items.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors"
                  >
                    <td className="p-4 align-middle whitespace-nowrap">
                      {formatDateTime(log.timestamp)}
                    </td>
                    <td className="p-4 align-middle whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {eventIcons[log.type]}
                        <span>{t(`dashboard.activity.events.${log.type}.title`)}</span>
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      {log.description || t(`dashboard.activity.events.${log.type}.description`)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0 || isLoading}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            {t('common.previous')}
          </Button>
          <div className="text-sm font-medium">
            {t('common.page_of', { current: page + 1, total: totalPages })}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= totalPages - 1 || isLoading}
          >
            {t('common.next')}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
