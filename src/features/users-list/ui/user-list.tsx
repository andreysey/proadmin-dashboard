import { getUsers } from '@/entities/user'
import type { UserRole } from '@/entities/user/model/types'
import { downloadCsv } from '@/shared/lib'
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
} from '@/shared/ui'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import {
  type ExpandedState,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { OctagonXIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useBulkDelete } from '../model/use-bulk-delete'
import { useBulkUpdateRole } from '../model/use-bulk-update-role'
import { BulkActions } from './bulk-actions'
import { getUserListColumns } from './user-list-columns'
import { UserListMobile } from './user-list-mobile'
import { UserListSkeleton } from './user-list-skeleton'
import { UserListTable } from './user-list-table'
import { UserListToolbar } from './user-list-toolbar'

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
  const [expanded, setExpanded] = useState<ExpandedState>({})
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false)

  const defaultData = useMemo(() => [], [])

  const sorting = useMemo(
    () => (sortBy ? [{ id: sortBy, desc: order === 'desc' }] : []),
    [sortBy, order]
  )

  const columns = useMemo(() => getUserListColumns(), [])

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: data?.users ?? defaultData,
    columns,
    state: { sorting, rowSelection, expanded },
    onRowSelectionChange: setRowSelection,
    onExpandedChange: setExpanded,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => true,
  })

  const { mutate: bulkDelete, isPending: isDeleting } = useBulkDelete()
  const { mutate: bulkUpdateRole, isPending: isUpdatingRole } = useBulkUpdateRole()

  const selectedRows = table.getSelectedRowModel().rows
  const selectedCount = selectedRows.length

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
    return <UserListSkeleton />
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

  return (
    <div className="flex flex-col gap-4">
      <UserListToolbar
        search={search}
        onSearchChange={onSearchChange}
        skip={skip}
        limit={limit}
        total={total}
        onPageChange={onPageChange}
      />

      <UserListMobile table={table} />

      <UserListTable table={table} q={q} sortBy={sortBy} onSortChange={onSortChange} />

      <div className="flex items-center justify-between px-2">
        <div className="text-muted-foreground text-sm">
          Showing {skip + 1} to {Math.min(skip + limit, total)} of {total} users
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange?.(Math.max(0, skip - limit))}
            disabled={skip === 0}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange?.(skip + limit)}
            disabled={skip + limit >= total}
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
