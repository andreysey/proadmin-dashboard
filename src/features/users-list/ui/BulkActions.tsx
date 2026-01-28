import { Trash2, Download, X, ShieldAlert } from 'lucide-react'
import { Button, Select } from '@/shared/ui'
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
    <div className="animate-in fade-in slide-in-from-bottom-4 fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 rounded-full border border-gray-200 bg-white px-6 py-3 shadow-2xl duration-300">
      <div className="flex items-center gap-2 border-r pr-4">
        <span className="bg-primary flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white">
          {selectedCount}
        </span>
        <span className="text-sm font-medium text-gray-700">Selected</span>
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
          <Select
            className="h-8 w-32"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as UserRole)}
          >
            <option value="" disabled>
              Change role...
            </option>
            {ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
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
