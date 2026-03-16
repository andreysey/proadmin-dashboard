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

import { toast } from 'sonner'

interface ExportButtonProps {
  stats?: DashboardStats | undefined
  events?: RecentEvent[] | undefined
  dateRange?: DateRangeValue
  disabled?: boolean
  onExportExcel?: () => void | Promise<void>
  onExportCsv?: () => void | Promise<void>
  onExportPdf?: () => void | Promise<void>
  filename?: string
}

/**
 * Export button with dropdown menu for Excel, CSV and PDF exports.
 */
export const ExportButton = ({
  stats,
  events,
  dateRange,
  disabled,
  onExportExcel,
  onExportCsv,
  onExportPdf,
  filename,
}: ExportButtonProps) => {
  const { t } = useTranslation()

  const handleExportExcel = async () => {
    try {
      toast.info(t('common.loading'), { description: 'Generating Excel...' })
      if (onExportExcel) {
        await onExportExcel()
        toast.success('Excel generated successfully')
        return
      }

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
        filename: filename || `dashboard-export-${dateRange}`,
        sheets: [
          { name: t('dashboard.export.excel_sheets.stats'), data: statsSheet },
          { name: t('dashboard.export.excel_sheets.events'), data: eventsSheet },
        ],
      })
      toast.success('Excel generated successfully')
    } catch (error) {
      console.error('Excel export failed:', error)
      toast.error(t('common.error'), { description: 'Failed to generate Excel' })
    }
  }

  const handleExportCsv = async () => {
    try {
      toast.info(t('common.loading'), { description: 'Generating CSV...' })
      if (onExportCsv) {
        await onExportCsv()
        toast.success('CSV generated successfully')
        return
      }

      if (!stats) return

      const statsData = [
        { Metric: t('dashboard.export.stats.total_users'), Value: stats.totalUsers },
        { Metric: t('dashboard.export.stats.active_now'), Value: stats.activeNow },
        { Metric: t('dashboard.export.stats.total_revenue'), Value: stats.totalRevenue },
        { Metric: t('dashboard.export.stats.monthly_growth'), Value: stats.monthlyGrowth },
      ]

      const { exportToCSV } = await import('../lib/export-to-excel')
      exportToCSV(statsData, filename || `dashboard-stats-${dateRange}`)
      toast.success('CSV generated successfully')
    } catch (error) {
      console.error('CSV export failed:', error)
      toast.error(t('common.error'), { description: 'Failed to generate CSV' })
    }
  }

  const handleExportPdf = async () => {
    try {
      toast.info(t('common.loading'), { description: 'Generating PDF...' })
      if (onExportPdf) {
        await onExportPdf()
        toast.success('PDF generated successfully')
        return
      }

      if (!stats) return

      const { exportToPdf } = await import('../lib/export-to-pdf')
      exportToPdf({
        stats,
        dateRange: dateRange || '7d',
        t,
        filename: filename || `dashboard-report-${dateRange}`,
      })
      toast.success('PDF generated successfully')
    } catch (error) {
      console.error('PDF export failed:', error)
      toast.error(t('common.error'), { description: 'Failed to generate PDF' })
    }
  }

  // Button is disabled if it's explicitly disabled or if NO export options are available
  const canExportExcel = !!onExportExcel || !!stats
  const canExportCsv = !!onExportCsv || !!stats
  const canExportPdf = !!onExportPdf || !!stats

  const isDisabled = disabled || (!canExportExcel && !canExportCsv && !canExportPdf)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isDisabled}>
          <Download className="mr-2 h-4 w-4" />
          {t('dashboard.export.button')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {canExportExcel && (
          <DropdownMenuItem onClick={handleExportExcel}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            {t('dashboard.export.excel')}
          </DropdownMenuItem>
        )}
        {canExportCsv && (
          <DropdownMenuItem onClick={handleExportCsv}>
            <FileText className="mr-2 h-4 w-4" />
            {t('dashboard.export.csv')}
          </DropdownMenuItem>
        )}
        {canExportPdf && (
          <DropdownMenuItem onClick={handleExportPdf}>
            <FileText className="mr-2 h-4 w-4" />
            {t('dashboard.export.pdf')}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
