import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AutoRefreshToggle } from './auto-refresh-toggle'

describe('AutoRefreshToggle', () => {
  it('should render correctly', () => {
    render(<AutoRefreshToggle enabled={false} onChange={vi.fn()} />)
    expect(screen.getByLabelText(/auto-refresh/i)).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: /auto-refresh/i })).toBeInTheDocument()
  })

  it('should show checked state when enabled is true', () => {
    render(<AutoRefreshToggle enabled={true} onChange={vi.fn()} />)
    const checkbox = screen.getByRole('checkbox', { name: /auto-refresh/i })
    expect(checkbox).toBeChecked()
  })

  it('should show unchecked state when enabled is false', () => {
    render(<AutoRefreshToggle enabled={false} onChange={vi.fn()} />)
    const checkbox = screen.getByRole('checkbox', { name: /auto-refresh/i })
    expect(checkbox).not.toBeChecked()
  })

  it('should call onChange when clicked', () => {
    const onChange = vi.fn()
    render(<AutoRefreshToggle enabled={false} onChange={onChange} />)

    const checkbox = screen.getByRole('checkbox', { name: /auto-refresh/i })
    fireEvent.click(checkbox)

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('should call onChange with false when clicked while enabled', () => {
    const onChange = vi.fn()
    render(<AutoRefreshToggle enabled={true} onChange={onChange} />)

    const checkbox = screen.getByRole('checkbox', { name: /auto-refresh/i })
    fireEvent.click(checkbox)

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith(false)
  })
})
