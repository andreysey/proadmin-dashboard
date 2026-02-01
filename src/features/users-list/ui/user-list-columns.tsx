import type { User } from '@/entities/user/model/types'
import { ProtectedAction } from '@/features/auth'
import { DeleteUserButton } from '@/features/delete-user'
import { Button, Checkbox } from '@/shared/ui'
import { Link } from '@tanstack/react-router'
import { createColumnHelper } from '@tanstack/react-table'
import { ChevronDown, ChevronUp, Edit } from 'lucide-react'

const columnHelper = createColumnHelper<User>()

export const getUserListColumns = () => [
  columnHelper.display({
    id: 'expander',
    header: () => null,
    cell: ({ row }) => {
      return (
        row.getCanExpand() && (
          <button
            {...{
              onClick: row.getToggleExpandedHandler(),
              style: { cursor: 'pointer' },
            }}
            className="hover:bg-muted flex h-6 w-6 items-center justify-center rounded-sm p-0"
          >
            {row.getIsExpanded() ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </button>
        )
      )
    },
  }),
  columnHelper.display({
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onChange={table.getToggleAllPageRowsSelectedHandler()}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onChange={row.getToggleSelectedHandler()}
        aria-label="Select row"
      />
    ),
  }),
  columnHelper.accessor('id', {
    header: 'ID',
    cell: (info) => info.getValue(),
    enableSorting: true,
  }),
  columnHelper.accessor((row) => `${row.firstName} ${row.lastName}`, {
    id: 'user',
    header: 'User',
    cell: (info) => (
      <div className="flex items-center gap-3">
        {info.row.original.image ? (
          <img
            src={info.row.original.image}
            alt={info.getValue()}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-full">
            <span className="text-muted-foreground text-xs font-medium">
              {info.row.original.firstName[0]}
              {info.row.original.lastName[0]}
            </span>
          </div>
        )}
        <div className="flex flex-col">
          <span className="font-medium">{info.getValue()}</span>
          <span className="text-xs text-gray-500">@{info.row.original.username}</span>
        </div>
      </div>
    ),
    enableSorting: true,
  }),
  columnHelper.accessor('email', {
    header: 'Email',
    cell: (info) => info.getValue(),
    enableSorting: true,
  }),
  columnHelper.accessor('role', {
    header: 'Role',
    cell: (info) => (
      <span className="bg-primary/10 text-primary ring-primary/20 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ring-inset">
        {info.getValue()}
      </span>
    ),
    enableSorting: true,
  }),
  columnHelper.display({
    id: 'actions',
    cell: (info) => (
      <div className="flex items-center justify-end gap-2">
        <ProtectedAction permission="users:edit">
          <Link to="/users/$userId/edit" params={{ userId: info.row.original.id.toString() }}>
            <Button variant="ghost" size="icon">
              <Edit className="text-muted-foreground h-4 w-4" />
            </Button>
          </Link>
        </ProtectedAction>
        <ProtectedAction permission="users:delete">
          <DeleteUserButton userId={info.row.original.id} />
        </ProtectedAction>
      </div>
    ),
  }),
]
