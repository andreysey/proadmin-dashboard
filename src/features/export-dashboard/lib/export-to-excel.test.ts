import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as XLSX from 'xlsx'
import { exportToExcel, exportToCSV } from './export-to-excel'

// Mock XLSX
vi.mock('xlsx', () => ({
  utils: {
    book_new: vi.fn(() => ({})),
    json_to_sheet: vi.fn(() => ({})),
    aoa_to_sheet: vi.fn(() => ({})),
    book_append_sheet: vi.fn(),
    sheet_to_csv: vi.fn(() => 'col1,col2\nval1,val2'),
  },
  writeFile: vi.fn(),
}))

// Mock URL
globalThis.URL.createObjectURL = vi.fn(() => 'blob:url')
globalThis.URL.revokeObjectURL = vi.fn()

describe('Export Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('exportToExcel', () => {
    it('should create workbook and write file', () => {
      const data = [{ name: 'Test', value: 123 }]
      exportToExcel({
        filename: 'report',
        sheets: [{ name: 'Sheet1', data }],
      })

      expect(XLSX.utils.book_new).toHaveBeenCalled()
      expect(XLSX.utils.json_to_sheet).toHaveBeenCalledWith(data)
      expect(XLSX.utils.book_append_sheet).toHaveBeenCalled()
      expect(XLSX.writeFile).toHaveBeenCalledWith(expect.anything(), 'report.xlsx')
    })

    it('should handle empty data', () => {
      exportToExcel({
        filename: 'empty',
        sheets: [{ name: 'EmptySheet', data: [] }],
      })

      expect(XLSX.utils.aoa_to_sheet).toHaveBeenCalledWith([['No data available']])
      expect(XLSX.utils.book_append_sheet).toHaveBeenCalled()
    })
  })

  describe('exportToCSV', () => {
    it('should trigger download for valid data', () => {
      const data: Record<string, unknown>[] = [{ col: 'val' }]
      const linkClickSpy = vi.fn()

      // Mock document call
      const link = {
        href: '',
        download: '',
        click: linkClickSpy,
      } as unknown as HTMLAnchorElement

      vi.spyOn(document, 'createElement').mockReturnValue(link)

      exportToCSV(data, 'data')

      expect(XLSX.utils.json_to_sheet).toHaveBeenCalledWith(data)
      expect(XLSX.utils.sheet_to_csv).toHaveBeenCalled()
      expect(document.createElement).toHaveBeenCalledWith('a')
      expect(link.download).toBe('data.csv')
      expect(linkClickSpy).toHaveBeenCalled()
      expect(URL.createObjectURL).toHaveBeenCalled()
      expect(URL.revokeObjectURL).toHaveBeenCalled()
    })

    it('should warn if no data', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      exportToCSV([], 'test')
      expect(consoleSpy).toHaveBeenCalledWith('No data to export')
      consoleSpy.mockRestore()
    })
  })
})
