import { jsPDF } from 'jspdf'

interface DashboardStats {
  totalUsers: number
  activeNow: number
  totalRevenue: number
  monthlyGrowth: number
}

interface ExportToPdfOptions {
  stats?: DashboardStats
  dateRange?: string
  t: (key: string, options?: Record<string, unknown>) => string
  title?: string
  table?: {
    headers: string[]
    rows: string[][]
  }
  filename?: string
}

/**
 * Export dashboard stats or generic table to PDF report
 */
export const exportToPdf = ({
  stats,
  dateRange,
  t,
  title,
  table,
  filename,
}: ExportToPdfOptions): void => {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const reportTitle = title || (stats ? t('dashboard.export.report_title') : 'Report')

  // Header
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text(reportTitle, pageWidth / 2, 25, { align: 'center' })

  // Metadata
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100)

  if (dateRange) {
    doc.text(
      t('dashboard.export.date_range', { value: formatDateRange(dateRange, t) }),
      pageWidth / 2,
      35,
      { align: 'center' }
    )
  }

  doc.text(
    t('dashboard.export.generated', { date: new Date().toLocaleString() }),
    pageWidth / 2,
    dateRange ? 42 : 35,
    {
      align: 'center',
    }
  )

  // Divider
  doc.setDrawColor(200)
  doc.line(20, 50, pageWidth - 20, 50)

  let yPosition = 65

  // Stats section (if provided)
  if (stats) {
    doc.setTextColor(0)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text(t('dashboard.export.overview'), 20, yPosition)
    yPosition += 15

    doc.setFontSize(11)

    const statsData = [
      [t('dashboard.export.stats.total_users'), stats.totalUsers.toLocaleString('de-DE')],
      [t('dashboard.export.stats.active_now'), stats.activeNow.toLocaleString('de-DE')],
      [t('dashboard.export.stats.total_revenue'), formatCurrency(stats.totalRevenue)],
      [
        t('dashboard.export.stats.monthly_growth'),
        `${stats.monthlyGrowth > 0 ? '+' : ''}${stats.monthlyGrowth}%`,
      ],
    ]

    statsData.forEach(([label, value]) => {
      doc.setFont('helvetica', 'normal')
      doc.text(label, 25, yPosition)
      doc.setFont('helvetica', 'bold')
      doc.text(value, 100, yPosition)
      yPosition += 12
    })

    yPosition += 10
  }

  // Table section (if provided)
  if (table) {
    doc.setTextColor(0)
    doc.setFontSize(11)

    // Headers
    doc.setFont('helvetica', 'bold')
    const colWidth = (pageWidth - 40) / table.headers.length
    table.headers.forEach((header, i) => {
      doc.text(header, 20 + i * colWidth, yPosition)
    })
    yPosition += 5
    doc.line(20, yPosition, pageWidth - 20, yPosition)
    yPosition += 10

    // Rows
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    table.rows.forEach((row) => {
      // Check for page break
      if (yPosition > 270) {
        doc.addPage()
        yPosition = 25
      }

      row.forEach((cell, i) => {
        const text = String(cell)
        // Truncate if too long (rough safety)
        const truncated = text.length > 25 ? text.substring(0, 22) + '...' : text
        doc.text(truncated, 20 + i * colWidth, yPosition)
      })
      yPosition += 8
    })
  }

  // Footer
  doc.setFontSize(8)
  doc.setTextColor(150)
  doc.text(t('dashboard.export.footer'), pageWidth / 2, 285, { align: 'center' })

  // Save
  doc.save(`${filename || 'report'}.pdf`)
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
