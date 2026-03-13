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
import { useTranslation } from 'react-i18next'
import { useBulkDelete } from '../model/use-bulk-delete'
import { useBulkUpdateRole } from '../model/use-bulk-update-role'
import { BulkActions } from './bulk-actions'
import { getUserListColumns } from './user-list-columns'
import { UserListMobile } from './user-list-mobile'
import { UserListSkeleton } from './user-list-skeleton'
import { UserListTable } from './user-list-table'
import { UserListToolbar } from './user-list-toolbar'

export const UserList = ({
  page = 1,
  limit = 10,
  urlSearch,
  sortBy,
  sortOrder,
  onPageChange,
  onSortChange,
  search,
  onSearchChange,
}: {
  page?: number
  limit?: number
  urlSearch?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  onPageChange?: (newPage: number) => void
  onSortChange?: (sortBy: string | undefined, sortOrder: 'asc' | 'desc') => void
  search: string
  onSearchChange: (value: string) => void
}) => {
  const { data, isPending, isError } = useQuery({
    queryKey: ['users', { page, limit, urlSearch, sortBy, sortOrder }],
    queryFn: () => getUsers({ page, limit, search: urlSearch, sortBy, sortOrder }),
    placeholderData: keepPreviousData,
  })

  const [rowSelection, setRowSelection] = useState({})
  const [expanded, setExpanded] = useState<ExpandedState>({})
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false)

  const defaultData = useMemo(() => [], [])

  const sorting = useMemo(
    () => (sortBy ? [{ id: sortBy, desc: sortOrder === 'desc' }] : []),
    [sortBy, sortOrder]
  )

  const { t } = useTranslation()
  const columns = useMemo(() => getUserListColumns(t), [t])

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: data?.data ?? defaultData,
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

  const pagination = data?.meta ?? { total: 0, page: 1, limit: 10, totalPages: 0 }
  const { total } = pagination

  return (
    <div className="flex flex-col gap-4">
      <UserListToolbar
        search={search}
        onSearchChange={onSearchChange}
        page={page}
        limit={limit}
        total={total}
        onPageChange={onPageChange}
      />

      <UserListMobile table={table} />

      <UserListTable table={table} search={urlSearch} sortBy={sortBy} onSortChange={onSortChange} />

      <div className="flex items-center justify-between px-2">
        <div className="text-muted-foreground text-sm">
          {t('users.pagination.info', {
            from: (page - 1) * limit + 1,
            to: Math.min(page * limit, total),
            total,
          })}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange?.(Math.max(1, page - 1))}
            disabled={page === 1}
          >
            {t('users.pagination.previous')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange?.(page + 1)}
            disabled={page >= pagination.totalPages}
          >
            {t('users.pagination.next')}
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
            <AlertDialogTitle>{t('users.bulk_delete.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('users.bulk_delete.description', { count: selectedCount })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('users.bulk_delete.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? t('users.bulk_delete.deleting') : t('users.bulk_delete.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
