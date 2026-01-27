/**
 * Utility to trigger a CSV file download from an array of objects.
 *
 * Vocabulary Booster:
 * - Data Serialization (die Datenserialisierung) - Converting data into a format that can be stored or transmitted.
 */
export const downloadCsv = <T extends object>(data: T[], filename: string) => {
  if (data.length === 0) return

  const headers = Object.keys(data[0]) as (keyof T)[]
  const csvRows = [
    headers.join(','),
    ...data.map((row) =>
      headers
        .map((header) => {
          const val = row[header]
          const escaped = ('' + val).replace(/"/g, '""')
          return `"${escaped}"`
        })
        .join(',')
    ),
  ]

  const csvContent = csvRows.join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
