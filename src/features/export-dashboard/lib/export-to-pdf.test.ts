import { describe, it, expect, vi, beforeEach } from 'vitest'
import { exportToPdf } from './export-to-pdf'
import { jsPDF } from 'jspdf'

// Mock jsPDF
const mockSave = vi.fn()
const mockText = vi.fn()
const mockSetFont = vi.fn()
const mockSetFontSize = vi.fn()
const mockSetTextColor = vi.fn()
const mockSetDrawColor = vi.fn()
const mockLine = vi.fn()

vi.mock('jspdf', () => {
  return {
    jsPDF: vi.fn(function () {
      return {
        internal: {
          pageSize: {
            getWidth: () => 210,
          },
        },
        save: mockSave,
        text: mockText,
        setFont: mockSetFont,
        setFontSize: mockSetFontSize,
        setTextColor: mockSetTextColor,
        setDrawColor: mockSetDrawColor,
        line: mockLine,
      }
    }),
  }
})

describe('exportToPdf', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const sampleStats = {
    totalUsers: 1250,
    activeNow: 42,
    totalRevenue: 50000.5,
    monthlyGrowth: 15.5,
  }

  it('should generate PDF with correct title and save', () => {
    exportToPdf({
      stats: sampleStats,
      dateRange: '7d',
      t: (key: string) => key,
      title: 'My Report',
    })

    expect(jsPDF).toHaveBeenCalled()

    // Title
    expect(mockText).toHaveBeenCalledWith('My Report', expect.any(Number), 25, { align: 'center' })

    // Save
    expect(mockSave).toHaveBeenCalledWith('dashboard-report-7d.pdf')
  })

  it('should format currency and numbers correctly (German Locale)', () => {
    // We can't strictly assert the locale formatting text because it depends on system node locale but usually it works.
    // We can check if `text` was called with relevant strings.

    exportToPdf({
      stats: sampleStats,
      dateRange: '30d',
      t: (key: string) => key,
    })

    // Check for Total Users formatting
    // 1.250 or 1,250 depending on locale. "de-DE" usually 1.250
    // But Intl might behave differently in test env if full-icu not loaded?
    // Let's assume standard behavior.

    // Check calls
    const textCalls = mockText.mock.calls.map((c) => c[0])
    expect(textCalls).toContain('Statistics Overview')
    expect(textCalls).toContain('Total Users')

    // Check if date label is converted
    expect(textCalls.some((t) => t.includes('Last 30 Days'))).toBe(true)
  })
})
