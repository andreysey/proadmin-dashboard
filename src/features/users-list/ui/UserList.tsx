import { getUsers } from '@/entities/user'
import { useMemo } from 'react'
import { Button } from '@/shared/ui/button'
import { Edit } from 'lucide-react'
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

const columnHelper = createColumnHelper<User>()

const columns = [
  columnHelper.accessor('id', {
    header: 'ID',
    cell: (info) => info.getValue(),
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
  }),
  columnHelper.accessor('email', {
    header: 'Email',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('role', {
    header: 'Role',
    cell: (info) => (
      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 capitalize">
        {info.getValue()}
      </span>
    ),
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
  onPageChange,
}: {
  skip?: number
  limit?: number
  q?: string
  onPageChange?: (newSkip: number) => void
}) => {
  const { data, isPending, isError } = useQuery({
    queryKey: ['users', { skip, limit, q }],
    queryFn: () => getUsers({ skip, limit, q }),
    placeholderData: keepPreviousData,
  })

  const defaultData = useMemo(() => [], [])

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: data?.users ?? defaultData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

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
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-6 py-3">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
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
    </div>
  )
}
