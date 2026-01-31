import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DateRangePicker } from './date-range-picker'
import React from 'react'

// Mock generic UI components to behave like a native select
vi.mock('@/shared/ui', () => ({
  Select: ({
    value,
    onValueChange,
    children,
  }: {
    value: string
    onValueChange: (v: string) => void
    children: React.ReactNode
  }) => (
    <select data-testid="mock-select" value={value} onChange={(e) => onValueChange(e.target.value)}>
      {children}
    </select>
  ),
  SelectContent: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SelectTrigger: () => null,
  SelectValue: () => null,
  SelectItem: ({ value, children }: { value: string; children: React.ReactNode }) => (
    <option value={value}>{children}</option>
  ),
}))

// Mock Icons
vi.mock('lucide-react', () => ({
  Calendar: () => <svg data-testid="calendar-icon" />,
}))

import type { DateRangeValue } from '../model/schema'

describe('DateRangePicker', () => {
  const defaultProps: { value: DateRangeValue; onChange: (v: DateRangeValue) => void } = {
    value: '7d',
    onChange: vi.fn(),
  }

  it('should render correct options', () => {
    render(<DateRangePicker {...defaultProps} value="7d" />)
    const select = screen.getByTestId('mock-select')
    expect(select).toBeInTheDocument()

    expect(screen.getByText('Last 24 Hours')).toBeInTheDocument()
    expect(screen.getByText('Last 7 Days')).toBeInTheDocument()
    expect(screen.getByText('Last 30 Days')).toBeInTheDocument()
  })

  it('should show current value', () => {
    render(<DateRangePicker {...defaultProps} value="30d" />)
    const select = screen.getByTestId('mock-select') as HTMLSelectElement
    expect(select.value).toBe('30d')
  })

  it('should call onChange when value changes', () => {
    render(<DateRangePicker {...defaultProps} />)
    const select = screen.getByTestId('mock-select')

    fireEvent.change(select, { target: { value: '24h' } })

    expect(defaultProps.onChange).toHaveBeenCalledWith('24h')
  })
})
