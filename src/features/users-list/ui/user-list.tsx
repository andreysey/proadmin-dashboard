import { getUsers } from '@/entities/user'
import { useMemo, useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  Checkbox,
  Input,
  Skeleton,
} from '@/shared/ui'
import { Edit, ArrowUpDown, ChevronUp, ChevronDown, OctagonXIcon } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { User } from '@/entities/user/model/types'
import { DeleteUserButton } from '@/features/delete-user'
import { BulkActions } from './bulk-actions'
import { useBulkDelete } from '../model/use-bulk-delete'
import { useBulkUpdateRole } from '../model/use-bulk-update-role'
import { downloadCsv } from '@/shared/lib'
import type { UserRole } from '@/entities/user'
import { ProtectedAction } from '@/features/auth'

const columnHelper = createColumnHelper<User>()

const columns = [
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
        <img
          src={info.row.original.image}
          alt={info.getValue()}
          className="h-8 w-8 rounded-full object-cover"
        />
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

const UserTableSkeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="border-border bg-card w-full overflow-hidden rounded-lg border shadow-sm">
        <table className="text-muted-foreground w-full text-left text-sm">
          <thead className="bg-muted/50 text-foreground text-xs uppercase">
            <tr>
              {Array.from({ length: 6 }).map((_, i) => (
                <th key={i} className="px-6 py-3">
                  <Skeleton className="h-4 w-20" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-border bg-card divide-y">
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                <td className="px-6 py-4">
                  <Skeleton className="h-4 w-4" />
                </td>
                <td className="px-6 py-4">
                  <Skeleton className="h-4 w-8" />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="flex flex-col gap-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Skeleton className="h-4 w-32" />
                </td>
                <td className="px-6 py-4">
                  <Skeleton className="h-6 w-16 rounded-full" />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export const UserList = ({
  skip = 0,
  limit = 10,
  q,
  sortBy,
  order,
  onPageChange,
  onSortChange,
  search,
  onSearchChange,
}: {
  skip?: number
  limit?: number
  q?: string
  sortBy?: string
  order?: 'asc' | 'desc'
  onPageChange?: (newSkip: number) => void
  onSortChange?: (sortBy: string | undefined, order: 'asc' | 'desc') => void
  search: string
  onSearchChange: (value: string) => void
}) => {
  const { data, isPending, isError } = useQuery({
    queryKey: ['users', { skip, limit, q, sortBy, order }],
    queryFn: () => getUsers({ skip, limit, q, sortBy, order }),
    placeholderData: keepPreviousData,
  })

  const [rowSelection, setRowSelection] = useState({})
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false)

  const defaultData = useMemo(() => [], [])

  const sorting = useMemo(
    () => (sortBy ? [{ id: sortBy, desc: order === 'desc' }] : []),
    [sortBy, order]
  )

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: data?.users ?? defaultData,
    columns,
    state: { sorting, rowSelection },
    onRowSelectionChange: setRowSelection,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
  })

  const { mutate: bulkDelete, isPending: isDeleting } = useBulkDelete()
  const { mutate: bulkUpdateRole, isPending: isUpdatingRole } = useBulkUpdateRole()

  const selectedRows = table.getSelectedRowModel().rows
  const selectedCount = selectedRows.length

  /**
   * Strategy First:
   * We handle success by clearing the selection and invalidating queries.
   * This ensures the UI is consistent with the server state.
   */
  const handleBulkDelete = () => {
    const ids = selectedRows.map((row) => row.original.id)
    bulkDelete(ids, {
      onSuccess: () => {
        setRowSelection({})
        setIsBulkDeleteOpen(false)
      },
    })
  }

  const handleBulkUpdateRole = (role: UserRole) => {
    const ids = selectedRows.map((row) => row.original.id)
    bulkUpdateRole(
      { ids, role },
      {
        onSuccess: () => setRowSelection({}),
      }
    )
  }

  const handleBulkExport = () => {
    const dataToExport = selectedRows.map((row) => row.original)
    downloadCsv(dataToExport, `users-export-${new Date().toISOString().split('T')[0]}.csv`)
  }

  if (isPending) {
    return <UserTableSkeleton />
  }

  if (isError) {
    return (
      <div className="mt-4 flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <div className="bg-destructive/10 text-destructive mb-4 flex h-12 w-12 items-center justify-center rounded-full">
          <OctagonXIcon className="h-6 w-6" />
        </div>
        <h3 className="mb-2 text-lg font-semibold">Failed to load users</h3>
        <p className="text-muted-foreground mb-4 max-w-xs text-sm">
          There was an error connecting to the server. Please check your connection and try again.
        </p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Retry Connection
        </Button>
      </div>
    )
  }

  const total = data?.total ?? 0
  const hasNextPage = skip + limit < total
  const hasPrevPage = skip > 0

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-2">
        <div className="w-72">
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange?.(Math.max(0, skip - limit))}
            disabled={!hasPrevPage}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange?.(skip + limit)}
            disabled={!hasNextPage}
          >
            Next
          </Button>
        </div>
      </div>
      <div className="border-border bg-card w-full overflow-hidden rounded-lg border shadow-sm">
        <table className="text-muted-foreground w-full text-left text-sm">
          <thead className="bg-muted/50 text-foreground border-border border-b text-xs uppercase">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const isSorted = header.column.getIsSorted()
                  return (
                    <th
                      key={header.id}
                      className={
                        header.column.getCanSort()
                          ? 'hover:bg-muted/50 cursor-pointer px-6 py-3 transition-colors select-none'
                          : 'px-6 py-3'
                      }
                      onClick={() => {
                        if (header.column.getCanSort()) {
                          const nextOrder = isSorted === 'asc' ? 'desc' : 'asc'
                          const nextSortBy =
                            isSorted === 'desc' && header.id === sortBy ? undefined : header.id
                          onSortChange?.(nextSortBy, nextOrder as 'asc' | 'desc')
                        }
                      }}
                    >
                      <div className="flex items-center gap-2">
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <span className="text-muted-foreground/40">
                            {isSorted === 'asc' ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : isSorted === 'desc' ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ArrowUpDown className="h-4 w-4 opacity-0 group-hover:opacity-100" />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody className="divide-border bg-card divide-y">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center py-10">
                    <p className="text-muted-foreground text-sm">No users found.</p>
                    {q && (
                      <p className="text-muted-foreground mt-1 text-xs">
                        Try adjusting your search for "{q}"
                      </p>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="text-muted-foreground text-sm">
          Showing {skip + 1} to {Math.min(skip + limit, total)} of {total} users
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange?.(Math.max(0, skip - limit))}
            disabled={!hasPrevPage}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange?.(skip + limit)}
            disabled={!hasNextPage}
          >
            Next
          </Button>
        </div>
      </div>

      <BulkActions
        selectedCount={selectedCount}
        onClearSelection={() => setRowSelection({})}
        onDelete={() => setIsBulkDeleteOpen(true)}
        onExport={handleBulkExport}
        onRoleChange={handleBulkUpdateRole}
        isDeleting={isDeleting}
        isUpdatingRole={isUpdatingRole}
      />

      <AlertDialog open={isBulkDeleteOpen} onOpenChange={setIsBulkDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bulk Delete Users</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedCount} selected users? This action is
              irreversible and will remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Confirm Bulk Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
