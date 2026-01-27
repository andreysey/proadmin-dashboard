import { getUsers } from '@/entities/user'
import { useMemo, useState } from 'react'
import { Button, Checkbox } from '@/shared/ui'
import { Edit, ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react'
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
import { BulkActions } from './BulkActions'
import { useBulkDelete } from '../model/useBulkDelete'
import { downloadCsv } from '@/shared/lib/downloadCsv'

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
      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 capitalize">
        {info.getValue()}
      </span>
    ),
    enableSorting: true,
  }),
  columnHelper.display({
    id: 'actions',
    cell: (info) => (
      <div className="flex items-center justify-end gap-2">
        <Link to="/users/$userId/edit" params={{ userId: info.row.original.id.toString() }}>
          <Button variant="ghost" size="icon">
            <Edit className="text-muted-foreground h-4 w-4" />
          </Button>
        </Link>
        <DeleteUserButton userId={info.row.original.id} />
      </div>
    ),
  }),
]

export const UserList = ({
  skip = 0,
  limit = 10,
  q,
  sortBy,
  order,
  onPageChange,
  onSortChange,
}: {
  skip?: number
  limit?: number
  q?: string
  sortBy?: string
  order?: 'asc' | 'desc'
  onPageChange?: (newSkip: number) => void
  onSortChange?: (sortBy: string | undefined, order: 'asc' | 'desc') => void
}) => {
  const { data, isPending, isError } = useQuery({
    queryKey: ['users', { skip, limit, q, sortBy, order }],
    queryFn: () => getUsers({ skip, limit, q, sortBy, order }),
    placeholderData: keepPreviousData,
  })

  const [rowSelection, setRowSelection] = useState({})

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

  const selectedRows = table.getSelectedRowModel().rows
  const selectedCount = selectedRows.length

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedCount} users?`)) {
      const ids = selectedRows.map((row) => row.original.id)
      bulkDelete(ids, {
        onSuccess: () => setRowSelection({}),
      })
    }
  }

  const handleBulkExport = () => {
    const dataToExport = selectedRows.map((row) => row.original)
    downloadCsv(dataToExport, `users-export-${new Date().toISOString().split('T')[0]}.csv`)
  }

  if (isPending) {
    return <div className="p-4 text-center">Loading users...</div>
  }

  if (isError) {
    return <div className="p-4 text-center text-red-500">Error loading users</div>
  }

  const total = data?.total ?? 0
  const hasNextPage = skip + limit < total
  const hasPrevPage = skip > 0

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full overflow-hidden rounded-lg border border-gray-200 shadow-sm">
        <table className="w-full text-left text-sm text-gray-500">
          <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const isSorted = header.column.getIsSorted()
                  return (
                    <th
                      key={header.id}
                      className={
                        header.column.getCanSort()
                          ? 'cursor-pointer px-6 py-3 transition-colors select-none hover:bg-gray-100'
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
                          <span className="text-gray-400">
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
          <tbody className="divide-y divide-gray-200 bg-white">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-gray-500">
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
        onDelete={handleBulkDelete}
        onExport={handleBulkExport}
        isDeleting={isDeleting}
      />
    </div>
  )
}
