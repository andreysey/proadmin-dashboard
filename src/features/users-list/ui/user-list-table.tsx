import type { User } from '@/entities/user/model/types'
import { cn } from '@/shared/lib/utils'
import { flexRender, type Table } from '@tanstack/react-table'
import { ChevronDown, ChevronUp, ArrowUpDown } from 'lucide-react'
import { Fragment } from 'react'

interface UserListTableProps {
  table: Table<User>
  q?: string
  sortBy?: string
  onSortChange?: (sortBy: string | undefined, order: 'asc' | 'desc') => void
}

import { useTranslation } from 'react-i18next'

export const UserListTable = ({ table, q, sortBy, onSortChange }: UserListTableProps) => {
  const { t } = useTranslation()
  return (
    <div className="border-border bg-card hidden w-full overflow-x-auto rounded-lg border shadow-sm md:block">
      <table className="text-muted-foreground w-full text-left text-sm">
        <thead className="bg-muted/50 text-foreground border-border border-b text-xs uppercase">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const isSorted = header.column.getIsSorted()
                return (
                  <th
                    key={header.id}
                    className={cn(
                      header.column.getCanSort()
                        ? 'hover:bg-muted/50 cursor-pointer px-6 py-3 transition-colors select-none'
                        : 'px-6 py-3',
                      header.id === 'id' && 'hidden xl:table-cell',
                      header.id === 'email' && 'hidden lg:table-cell',
                      header.id === 'role' && 'hidden md:table-cell',
                      header.id === 'expander' && 'xl:hidden'
                    )}
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
              <Fragment key={row.id}>
                <tr className="hover:bg-muted/30 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={cn(
                        'px-6 py-4',
                        cell.column.id === 'id' && 'hidden xl:table-cell',
                        cell.column.id === 'email' && 'hidden lg:table-cell',
                        cell.column.id === 'role' && 'hidden md:table-cell',
                        cell.column.id === 'expander' && 'xl:hidden'
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
                {row.getIsExpanded() && (
                  <tr className="bg-muted/30 xl:hidden">
                    <td colSpan={row.getVisibleCells().length} className="px-6 py-4">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-1">
                          <span className="text-muted-foreground text-xs font-medium uppercase">
                            {t('users.columns.id')}
                          </span>
                          <p className="font-medium">{row.original.id}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-muted-foreground text-xs font-medium uppercase">
                            {t('users.columns.email')}
                          </span>
                          <p className="font-medium">{row.original.email}</p>
                        </div>
                        <div className="space-y-1 md:hidden">
                          <span className="text-muted-foreground text-xs font-medium uppercase">
                            {t('users.columns.role')}
                          </span>
                          <p className="bg-primary/10 text-primary inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize">
                            {t(`users.roles.${row.original.role.toLowerCase()}`)}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))
          ) : (
            <tr>
              <td colSpan={table.getAllColumns().length} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center py-10">
                  <p className="text-muted-foreground text-sm">{t('users.state.empty')}</p>
                  {q && (
                    <p className="text-muted-foreground mt-1 text-xs">
                      {t('users.state.empty_search', { query: q })}
                    </p>
                  )}
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
