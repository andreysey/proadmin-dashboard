import { Button, Input } from '@/shared/ui'
import { useTranslation } from 'react-i18next'
import { ExportButton } from '@/features/export-dashboard'
import { exportUsers } from '@/entities/user'
import { exportToExcel, exportToCSV } from '@/features/export-dashboard/lib/export-to-excel'

interface UserListToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  page: number
  limit: number
  total: number
  onPageChange?: (newPage: number) => void
}

export const UserListToolbar = ({
  search,
  onSearchChange,
  page,
  limit,
  total,
  onPageChange,
}: UserListToolbarProps) => {
  const { t } = useTranslation()
  const hasNextPage = page * limit < total
  const hasPrevPage = page > 1

  const handleExportExcel = async () => {
    const data = await exportUsers()
    exportToExcel({
      filename: `users-export-${new Date().toISOString().split('T')[0]}`,
      sheets: [{ name: t('sidebar.users'), data: data as Record<string, unknown>[] }],
    })
  }

  const handleExportCsv = async () => {
    const data = await exportUsers()
    exportToCSV(
      data as Record<string, unknown>[],
      `users-export-${new Date().toISOString().split('T')[0]}`
    )
  }

  const handleExportPdf = async () => {
    const data = await exportUsers()
    const { exportToPdf } = await import('@/features/export-dashboard/lib/export-to-pdf')

    exportToPdf({
      t,
      title: t('users.title'),
      filename: `users-export-${new Date().toISOString().split('T')[0]}`,
      table: {
        headers: [
          t('users.columns.id'),
          t('users.columns.name'),
          t('users.columns.email'),
          t('users.columns.role'),
        ],
        rows: data.map((u) => [
          String(u.displayId),
          `${u.firstName ?? ''} ${u.lastName ?? ''}`,
          u.email ?? '',
          u.role ?? '',
        ]),
      },
    })
  }

  return (
    <div className="flex flex-col gap-4 px-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="w-full sm:w-72">
          <Input
            aria-label={t('users.search_placeholder')}
            placeholder={t('users.search_placeholder')}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <ExportButton
          onExportExcel={handleExportExcel}
          onExportCsv={handleExportCsv}
          onExportPdf={handleExportPdf}
        />
      </div>
      <div className="flex items-center justify-between gap-2 sm:justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange?.(Math.max(1, page - 1))}
          disabled={!hasPrevPage}
        >
          {t('users.pagination.previous')}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange?.(page + 1)}
          disabled={!hasNextPage}
        >
          {t('users.pagination.next')}
        </Button>
      </div>
    </div>
  )
}
