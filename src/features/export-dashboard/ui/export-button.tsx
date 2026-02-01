import { Download, FileSpreadsheet, FileText } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui'

import type { DashboardStats, RecentEvent } from '@/entities/analytics'
import type { DateRangeValue } from '@/features/dashboard-filters'

interface ExportButtonProps {
  stats: DashboardStats | undefined
  events: RecentEvent[] | undefined
  dateRange: DateRangeValue
  disabled?: boolean
}

/**
 * Export button with dropdown menu for Excel and PDF exports.
 *
 * Excel: Exports stats + recent events in separate sheets
 * PDF: Exports branded report with stats summary
 */
export const ExportButton = ({ stats, events, dateRange, disabled }: ExportButtonProps) => {
  const { t } = useTranslation()

  const handleExportExcel = async () => {
    if (!stats) return

    const statsSheet = [
      {
        Metric: t('dashboard.export.stats.total_users'),
        Value: stats.totalUsers,
      },
      {
        Metric: t('dashboard.export.stats.active_now'),
        Value: stats.activeNow,
      },
      {
        Metric: t('dashboard.export.stats.total_revenue'),
        Value: stats.totalRevenue,
      },
      {
        Metric: t('dashboard.export.stats.monthly_growth'),
        Value: stats.monthlyGrowth,
      },
    ]

    const eventsSheet =
      events?.map((event) => ({
        ID: event.id,
        Type: event.type,
        Title: event.title,
        Description: event.description,
        Timestamp: new Date(event.timestamp).toLocaleString('de-DE'),
      })) ?? []

    const { exportToExcel } = await import('../lib/export-to-excel')
    exportToExcel({
      filename: `dashboard-export-${dateRange}`,
      sheets: [
        { name: t('dashboard.export.excel_sheets.stats'), data: statsSheet },
        { name: t('dashboard.export.excel_sheets.events'), data: eventsSheet },
      ],
    })
  }

  const handleExportPdf = async () => {
    if (!stats) return

    const { exportToPdf } = await import('../lib/export-to-pdf')
    exportToPdf({
      stats,
      dateRange,
      t,
    })
  }

  const isDisabled = disabled || !stats || !events

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isDisabled}>
          <Download className="mr-2 h-4 w-4" />
          {t('dashboard.export.button')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleExportExcel}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          {t('dashboard.export.excel')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportPdf}>
          <FileText className="mr-2 h-4 w-4" />
          {t('dashboard.export.pdf')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
