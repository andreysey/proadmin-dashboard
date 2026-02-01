import { jsPDF } from 'jspdf'

interface DashboardStats {
  totalUsers: number
  activeNow: number
  totalRevenue: number
  monthlyGrowth: number
}

interface ExportToPdfOptions {
  stats: DashboardStats
  dateRange: string
  t: (key: string, options?: Record<string, unknown>) => string
  title?: string
}

/**
 * Export dashboard stats to PDF report
 *
 * Uses jsPDF for lightweight PDF generation.
 * Creates a simple branded report suitable for management review.
 */
export const exportToPdf = ({ stats, dateRange, t, title }: ExportToPdfOptions): void => {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const reportTitle = title || t('dashboard.export.report_title')

  // Header
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text(reportTitle, pageWidth / 2, 25, { align: 'center' })

  // Metadata
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100)
  doc.text(
    t('dashboard.export.date_range', { value: formatDateRange(dateRange, t) }),
    pageWidth / 2,
    35,
    { align: 'center' }
  )
  doc.text(
    t('dashboard.export.generated', { date: new Date().toLocaleString() }),
    pageWidth / 2,
    42,
    {
      align: 'center',
    }
  )

  // Divider
  doc.setDrawColor(200)
  doc.line(20, 50, pageWidth - 20, 50)

  // Stats section
  doc.setTextColor(0)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text(t('dashboard.export.overview'), 20, 65)

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')

  const statsData = [
    [t('dashboard.export.stats.total_users'), stats.totalUsers.toLocaleString('de-DE')],
    [t('dashboard.export.stats.active_now'), stats.activeNow.toLocaleString('de-DE')],
    [t('dashboard.export.stats.total_revenue'), formatCurrency(stats.totalRevenue)],
    [
      t('dashboard.export.stats.monthly_growth'),
      `${stats.monthlyGrowth > 0 ? '+' : ''}${stats.monthlyGrowth}%`,
    ],
  ]

  let yPosition = 80
  statsData.forEach(([label, value]) => {
    doc.setFont('helvetica', 'normal')
    doc.text(label, 25, yPosition)
    doc.setFont('helvetica', 'bold')
    doc.text(value, 100, yPosition)
    yPosition += 12
  })

  // Footer
  doc.setFontSize(8)
  doc.setTextColor(150)
  doc.text(t('dashboard.export.footer'), pageWidth / 2, 280, { align: 'center' })

  // Save
  doc.save(`dashboard-report-${dateRange}.pdf`)
}

// Helpers
function formatDateRange(
  range: string,
  t: (key: string, options?: Record<string, unknown>) => string
): string {
  const labels: Record<string, string> = {
    '24h': t('dashboard.filters.date_range.24h'),
    '7d': t('dashboard.filters.date_range.7d'),
    '30d': t('dashboard.filters.date_range.30d'),
  }
  return labels[range] || range
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(value)
}
