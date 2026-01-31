import * as XLSX from 'xlsx'

interface ExportToExcelOptions {
  filename: string
  sheets: Array<{
    name: string
    data: Record<string, unknown>[]
  }>
}

/**
 * Export data to Excel file (.xlsx)
 *
 * Uses xlsx library - chosen for German enterprise compatibility
 * where Excel is the standard format for business reports.
 *
 * @param options - Configuration with filename and sheets data
 */
export const exportToExcel = ({ filename, sheets }: ExportToExcelOptions): void => {
  // Create new workbook
  const workbook = XLSX.utils.book_new()

  // Add each sheet to workbook
  sheets.forEach(({ name, data }) => {
    if (data.length === 0) {
      // Create empty sheet with header message
      const emptySheet = XLSX.utils.aoa_to_sheet([['No data available']])
      XLSX.utils.book_append_sheet(workbook, emptySheet, name)
      return
    }

    // Convert JSON to worksheet
    const worksheet = XLSX.utils.json_to_sheet(data)

    // Auto-size columns (approximate)
    const columnWidths = Object.keys(data[0] || {}).map((key) => ({
      wch: Math.max(key.length, 15),
    }))
    worksheet['!cols'] = columnWidths

    XLSX.utils.book_append_sheet(workbook, worksheet, name)
  })

  // Generate and download file
  XLSX.writeFile(workbook, `${filename}.xlsx`)
}

/**
 * Export single dataset to CSV
 */
export const exportToCSV = (data: Record<string, unknown>[], filename: string): void => {
  if (data.length === 0) {
    console.warn('No data to export')
    return
  }

  const worksheet = XLSX.utils.json_to_sheet(data)
  const csv = XLSX.utils.sheet_to_csv(worksheet)

  // Create blob and download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${filename}.csv`
  link.click()
  URL.revokeObjectURL(link.href)
}
