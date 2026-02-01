import type { User } from '@/entities/user/model/types'
import { ProtectedAction } from '@/features/auth'
import { DeleteUserButton } from '@/features/delete-user'
import { Button, Card, CardContent, Checkbox } from '@/shared/ui'
import { Link } from '@tanstack/react-router'
import type { Table } from '@tanstack/react-table'
import { Edit } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib/utils'

interface UserListMobileProps {
  table: Table<User>
}

import { useOptimisticUsers } from '../model/use-optimistic-users'
import { useLongPress } from '@/shared/lib/hooks/use-long-press'

export const UserListMobile = ({ table }: UserListMobileProps) => {
  const { t } = useTranslation()

  // Track pending mutations globally (shared logic via useOptimisticUsers)
  const rows = table.getRowModel().rows
  const rawUsers = useMemo(() => rows.map((r) => r.original), [rows])
  const optimisticUsers = useOptimisticUsers(rawUsers)

  const derivedData = useMemo(() => {
    return rows.map((row, index) => {
      return {
        ...row,
        optimisticData: optimisticUsers[index],
      }
    })
  }, [rows, optimisticUsers])

  return (
    <div className="space-y-4 md:hidden">
      {derivedData.map(({ optimisticData: user, ...row }) => {
        const { isDeleting, isUpdating } = user

        // eslint-disable-next-line react-hooks/rules-of-hooks
        const longPressHandlers = useLongPress({
          onLongPress: () => {
            row.toggleSelected()
            if ('vibrate' in navigator) {
              navigator.vibrate(50) // Subtle haptic feedback
            }
          },
        })

        return (
          <Card
            key={row.id}
            {...longPressHandlers}
            className={cn(
              'relative transition-all duration-300 active:scale-[0.98] active:shadow-inner',
              row.getIsSelected() && 'ring-primary ring-2 ring-offset-2',
              isDeleting &&
                'bg-destructive/10 border-l-destructive border-l-2 opacity-60 grayscale select-none',
              isUpdating && 'bg-primary/5 border-l-primary animate-pulse border-l-2 opacity-80'
            )}
          >
            <CardContent className="space-y-4 p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <Checkbox
                    checked={row.getIsSelected()}
                    onChange={row.getToggleSelectedHandler()}
                    aria-label={t('users.aria.select_row')}
                    className="shrink-0"
                    onClick={(e) => e.stopPropagation()} // Prevent card's future potential click
                  />
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="h-10 w-10 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <div className="bg-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                        <span className="text-muted-foreground text-sm font-medium">
                          {user.firstName[0]}
                          {user.lastName[0]}
                        </span>
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-muted-foreground truncate text-xs">{user.email}</p>
                    </div>
                  </div>
                </div>
                <span className="bg-primary/10 text-primary ring-primary/20 inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ring-inset">
                  {t(`users.roles.${user.role.toLowerCase()}`)}
                </span>
              </div>
              <div className="border-border flex items-center justify-between border-t pt-4">
                <div className="text-muted-foreground text-xs">
                  <span className="font-medium">ID:</span> {user.id}
                </div>
                <div className="flex items-center gap-2">
                  <ProtectedAction permission="users:edit">
                    <Link
                      to="/users/$userId/edit"
                      params={{ userId: user.id.toString() }}
                      className="w-full"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button variant="outline" size="sm" className="h-8 w-full gap-2">
                        <Edit className="h-3.5 w-3.5" />
                        {t('users.edit.save') === 'Save Changes'
                          ? 'Edit'
                          : t('users.edit.title').split(':')[0]}
                      </Button>
                    </Link>
                  </ProtectedAction>
                  <ProtectedAction permission="users:delete">
                    <div
                      role="presentation"
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                    >
                      <DeleteUserButton userId={user.id} />
                    </div>
                  </ProtectedAction>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
