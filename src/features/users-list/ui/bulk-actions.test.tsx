import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BulkActions } from './bulk-actions'
import userEvent from '@testing-library/user-event'

// Mock dependencies
vi.mock('@/features/auth', () => ({
  ProtectedAction: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

vi.mock('@/shared/ui', () => ({
  Button: (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => <button {...props} />,
  Select: ({
    onValueChange,
    children,
  }: {
    onValueChange: (val: string) => void
    children: React.ReactNode
  }) => (
    <div data-testid="select">
      <button data-testid="select-option-admin" onClick={() => onValueChange('admin')}>
        Select Admin
      </button>
      {children}
    </div>
  ),
  SelectTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectValue: () => <span>Select Value</span>,
  SelectContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

describe('BulkActions', () => {
  const defaultProps = {
    selectedCount: 0,
    onClearSelection: vi.fn(),
    onDelete: vi.fn(),
    onExport: vi.fn(),
    onRoleChange: vi.fn(),
    isDeleting: false,
    isUpdatingRole: false,
  }

  it('should not render when selectedCount is 0', () => {
    const { container } = render(<BulkActions {...defaultProps} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('should render when items are selected', () => {
    render(<BulkActions {...defaultProps} selectedCount={2} />)
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('Selected')).toBeInTheDocument()
  })

  it('should call callbacks on button clicks', async () => {
    const user = userEvent.setup()
    render(<BulkActions {...defaultProps} selectedCount={2} />)

    // Export
    await user.click(screen.getByRole('button', { name: /export/i }))
    expect(defaultProps.onExport).toHaveBeenCalled()

    // Delete
    await user.click(screen.getByRole('button', { name: /delete/i }))
    expect(defaultProps.onDelete).toHaveBeenCalled()
  })

  it('should handle role change', async () => {
    const user = userEvent.setup()
    render(<BulkActions {...defaultProps} selectedCount={2} />)

    // Select role using our mock button
    await user.click(screen.getByTestId('select-option-admin'))

    // Click Apply
    await user.click(screen.getByRole('button', { name: /apply/i }))

    expect(defaultProps.onRoleChange).toHaveBeenCalledWith('admin')
  })
})
