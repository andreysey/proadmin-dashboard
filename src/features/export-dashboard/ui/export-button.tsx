import { Download, FileSpreadsheet, FileText } from 'lucide-react'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui'
import { exportToExcel } from '../lib/export-to-excel'
import { exportToPdf } from '../lib/export-to-pdf'
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
  const handleExportExcel = () => {
    if (!stats) return

    const statsSheet = [
      {
        Metric: 'Total Users',
        Value: stats.totalUsers,
      },
      {
        Metric: 'Active Now',
        Value: stats.activeNow,
      },
      {
        Metric: 'Total Revenue (EUR)',
        Value: stats.totalRevenue,
      },
      {
        Metric: 'Monthly Growth (%)',
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

    exportToExcel({
      filename: `dashboard-export-${dateRange}`,
      sheets: [
        { name: 'Statistics', data: statsSheet },
        { name: 'Recent Events', data: eventsSheet },
      ],
    })
  }

  const handleExportPdf = () => {
    if (!stats) return

    exportToPdf({
      stats,
      dateRange,
    })
  }

  const isDisabled = disabled || !stats || !events

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isDisabled}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleExportExcel}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export to Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportPdf}>
          <FileText className="mr-2 h-4 w-4" />
          Export to PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
