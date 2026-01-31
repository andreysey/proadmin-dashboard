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
  Select: (props: React.SelectHTMLAttributes<HTMLSelectElement>) => <select {...props} />,
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

    // Clear Selection
    // The code uses an X icon button. We can find by icon or class or index.
    // It's the first button with "ghost" variant.
    // Let's use getByRole('button') logic.
    // There are multiple buttons.
    // 1. Clear (X icon)
    // 2. Apply Role
    // 3. Export
    // 4. Delete

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

    // Logic: Select role -> Click Apply
    // The component uses <Select>...<option>...
    // If it's a native select, we use user.selectOptions
    // If it's a custom component that accepts children options but renders custom UI, we might need specific tests.
    // Assuming it acts like a select with accessible role "combobox" or similar.
    // The code uses: <Select ... onChange={(e) => ...}>
    // This strongly implies it wraps a native <select> because custom Radix selects use onValueChange.

    // Let's try finding the generic combobox or select element.
    // If it's native select, we can find by role 'combobox'.
    const select = screen.getByRole('combobox') // Shadcn `Select` trigger also has this role usually? No, shadcn uses a div/button trigger.
    // IF it is native select, `userEvent.selectOptions` works.
    // The verify: `value={selectedRole} onChange={(e) => ...}` standard React input pattern.

    await user.selectOptions(select, 'admin')

    // Click Apply
    await user.click(screen.getByRole('button', { name: /apply/i }))

    expect(defaultProps.onRoleChange).toHaveBeenCalledWith('admin')
  })
})
