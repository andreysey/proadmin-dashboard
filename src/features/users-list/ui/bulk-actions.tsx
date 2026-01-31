import { Trash2, Download, X, ShieldAlert } from 'lucide-react'
import { Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui'
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
  if (selectedCount === 0) return null

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 border-border bg-background fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 rounded-full border px-6 py-3 shadow-2xl transition-colors duration-300">
      <div className="border-border flex items-center gap-2 border-r pr-4">
        <span className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold">
          {selectedCount}
        </span>
        <span className="text-foreground text-sm font-medium">Selected</span>
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
        <div className="flex items-center gap-2 border-r pr-4">
          <Select value={selectedRole} onValueChange={(val) => setSelectedRole(val as UserRole)}>
            <SelectTrigger className="h-8 w-32">
              <SelectValue placeholder="Change role..." />
            </SelectTrigger>
            <SelectContent>
              {ROLES.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            disabled={!selectedRole || isUpdatingRole}
            onClick={() => {
              if (selectedRole) onRoleChange(selectedRole)
            }}
          >
            <ShieldAlert className="h-4 w-4" />
            {isUpdatingRole ? 'Updating...' : 'Apply'}
          </Button>
        </div>
      </ProtectedAction>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={onExport}
          disabled={isDeleting || isUpdatingRole}
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
        <ProtectedAction permission="users:delete">
          <Button
            variant="destructive"
            size="sm"
            className="gap-2"
            onClick={onDelete}
            disabled={isDeleting || isUpdatingRole}
          >
            <Trash2 className="h-4 w-4" />
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </ProtectedAction>
      </div>
    </div>
  )
}
