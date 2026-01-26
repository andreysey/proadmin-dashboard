import { getUsers } from '@/entities/user'
import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { User } from '@/entities/user/model/types'

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
]

export const UserList = () => {
  const { data, isPending, isError } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  })

  // Memoize data to ensure referential stability and access the correct property
  const tableData = useMemo(() => data?.users ?? [], [data])

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (isPending) {
    return <div className="p-4 text-center">Loading users...</div>
  }

  if (isError) {
    return <div className="p-4 text-center text-red-500">Error loading users</div>
  }

  return (
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
  )
}
