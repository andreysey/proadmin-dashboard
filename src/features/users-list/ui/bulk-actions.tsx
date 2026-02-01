import { Trash2, Download, X, ShieldAlert } from 'lucide-react'
import { Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui'
import { useTranslation } from 'react-i18next'
import { ROLES, type UserRole } from '@/entities/user/model/types'
import { useState } from 'react'
import { ProtectedAction } from '@/features/auth'

interface BulkActionsProps {
  selectedCount: number
  onClearSelection: () => void
  onDelete: () => void
  onExport: () => void
}
export const BulkActions = ({
  selectedCount,
  onClearSelection,
  onDelete,
  onExport,
  onRoleChange,
  isDeleting,
  isUpdatingRole,
}: BulkActionsProps & {
  isDeleting?: boolean
  isUpdatingRole?: boolean
  onRoleChange: (role: UserRole) => void
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | ''>('')
  const { t } = useTranslation()
  if (selectedCount === 0) return null

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 border-border bg-background fixed bottom-4 left-1/2 z-50 flex w-[95vw] -translate-x-1/2 flex-wrap items-center justify-center gap-2 rounded-xl border px-3 py-2 shadow-2xl transition-colors duration-300 sm:bottom-8 sm:w-auto sm:rounded-full sm:px-6 sm:py-3">
      <div className="border-border flex items-center gap-2 border-r pr-2 sm:pr-4">
        <span className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold">
          {selectedCount}
        </span>
        <span className="text-foreground hidden text-sm font-medium sm:inline">
          {t('users.bulk_actions.selected')}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-full"
          onClick={onClearSelection}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>

      <ProtectedAction permission="users:manage-roles">
        <div className="flex items-center gap-2 border-r pr-2 sm:pr-4">
          <Select value={selectedRole} onValueChange={(val) => setSelectedRole(val as UserRole)}>
            <SelectTrigger className="h-8 w-28 sm:w-32">
              <SelectValue placeholder={t('users.bulk_actions.role_placeholder')} />
            </SelectTrigger>
            <SelectContent>
              {ROLES.map((role) => (
                <SelectItem key={role} value={role}>
                  {t(`users.roles.${role.toLowerCase()}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 px-2 sm:px-3"
            disabled={!selectedRole || isUpdatingRole}
            onClick={() => {
              if (selectedRole) onRoleChange(selectedRole)
            }}
          >
            <ShieldAlert className="h-4 w-4" />
            <span className="hidden sm:inline">
              {isUpdatingRole ? t('users.bulk_actions.updating') : t('users.bulk_actions.apply')}
            </span>
          </Button>
        </div>
      </ProtectedAction>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="gap-2 px-2 sm:px-3"
          onClick={onExport}
          disabled={isDeleting || isUpdatingRole}
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">{t('users.bulk_actions.export')}</span>
        </Button>
        <ProtectedAction permission="users:delete">
          <Button
            variant="destructive"
            size="sm"
            className="gap-2 px-2 sm:px-3"
            onClick={onDelete}
            disabled={isDeleting || isUpdatingRole}
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">
              {isDeleting ? t('users.bulk_actions.deleting') : t('users.bulk_actions.delete')}
            </span>
          </Button>
        </ProtectedAction>
      </div>
    </div>
  )
}
