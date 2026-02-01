import { utils, writeFile } from 'xlsx'

/**
 * Utility to trigger a CSV file download from an array of objects using xlsx.
 *
 * Vocabulary Booster:
 * - Data Serialization (die Datenserialisierung) - Converting data into a format that can be stored or transmitted.
 */
export const downloadCsv = <T extends object>(data: T[], filename: string) => {
  if (data.length === 0) return

  const worksheet = utils.json_to_sheet(data)
  const workbook = utils.book_new()
  utils.book_append_sheet(workbook, worksheet, 'Sheet1')
  writeFile(workbook, filename)
}
