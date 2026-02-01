import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ExportButton } from './export-button'
import { exportToExcel } from '../lib/export-to-excel'
import { exportToPdf } from '../lib/export-to-pdf'
import type { ReactNode } from 'react'

// Mock export functions
vi.mock('../lib/export-to-excel', () => ({
  exportToExcel: vi.fn(),
}))
vi.mock('../lib/export-to-pdf', () => ({
  exportToPdf: vi.fn(),
}))

// ... existing mocks for UI components ...
vi.mock('@/shared/ui', () => ({
  Button: ({
    children,
    onClick,
    disabled,
  }: {
    children: ReactNode
    onClick?: () => void
    disabled?: boolean
  }) => (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
  DropdownMenu: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  DropdownMenuContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  DropdownMenuItem: ({ children, onClick }: { children: ReactNode; onClick?: () => void }) => (
    <div role="menuitem" onClick={onClick}>
      {children}
    </div>
  ),
}))

// ... existing sample data ...
const mockStats = {
  totalUsers: 100,
  activeNow: 20,
  totalRevenue: 5000,
  monthlyGrowth: 5.5,
  eventsCount: 10,
}

const mockEvents = [
  {
    id: '1',
    title: 'New User',
    description: 'User registered',
    type: 'system_alert' as const,
    timestamp: '2023-01-01T12:00:00Z',
  },
]

const defaultProps = {
  stats: mockStats,
  events: mockEvents,
  dateRange: '7d' as const,
}

describe('ExportButton', () => {
  it('should be disabled if stats are missing', () => {
    render(<ExportButton {...defaultProps} stats={undefined} />)
    const button = screen.getByRole('button', { name: /export/i })
    expect(button).toBeDisabled()
  })

  it('should be enabled if data is present', () => {
    render(<ExportButton {...defaultProps} />)
    const button = screen.getByRole('button', { name: /export/i })
    expect(button).toBeEnabled()
  })

  it('should call exportToExcel when Excel option is clicked', async () => {
    render(<ExportButton {...defaultProps} />)

    // Open dropdown
    const button = screen.getByRole('button', { name: /export/i })
    fireEvent.click(button)

    // Click Excel option
    const excelOption = screen.getByText('Export to Excel')
    fireEvent.click(excelOption)

    await waitFor(() => {
      expect(exportToExcel).toHaveBeenCalledTimes(1)
      expect(exportToExcel).toHaveBeenCalledWith(
        expect.objectContaining({
          filename: 'dashboard-export-7d',
          sheets: expect.arrayContaining([
            expect.objectContaining({ name: 'Statistics' }),
            expect.objectContaining({ name: 'Recent Events' }),
          ]),
        })
      )
    })
  })

  it('should call exportToPdf when PDF option is clicked', async () => {
    render(<ExportButton {...defaultProps} />)

    // Open dropdown
    const button = screen.getByRole('button', { name: /export/i })
    fireEvent.click(button)

    // Click PDF option
    const pdfOption = screen.getByText('Export to PDF')
    fireEvent.click(pdfOption)

    await waitFor(() => {
      expect(exportToPdf).toHaveBeenCalledTimes(1)
      expect(exportToPdf).toHaveBeenCalledWith({
        stats: mockStats,
        dateRange: '7d',
      })
    })
  })
})
