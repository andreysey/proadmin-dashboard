import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DeleteUserButton } from './delete-user-button'
import * as useDeleteUserModule from '../model/use-delete-user'

// Mock the hook
vi.mock('../model/use-delete-user', () => ({
  useDeleteUser: vi.fn(),
}))

describe('DeleteUserButton', () => {
  const mockMutate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useDeleteUserModule.useDeleteUser).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as unknown as ReturnType<typeof useDeleteUserModule.useDeleteUser>)
  })

  it('should render trigger button', () => {
    render(<DeleteUserButton userId={1} />)
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
  })

  it('should open dialog on click', async () => {
    const user = userEvent.setup()
    render(<DeleteUserButton userId={1} />)

    await user.click(screen.getByRole('button', { name: /delete/i }))

    expect(screen.getByText('Are you absolutely sure?')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Delete User' })).toBeInTheDocument()
  })

  it('should calls mutate on confirm', async () => {
    const user = userEvent.setup()
    render(<DeleteUserButton userId={123} />)

    // Open User
    await user.click(screen.getByRole('button', { name: /delete/i }))
    // Click Confirm
    await user.click(screen.getByRole('button', { name: 'Delete User' }))

    expect(mockMutate).toHaveBeenCalledWith(123)
  })

  it('should show loading state', async () => {
    vi.mocked(useDeleteUserModule.useDeleteUser).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
    } as unknown as ReturnType<typeof useDeleteUserModule.useDeleteUser>)

    render(<DeleteUserButton userId={1} />)
    const btn = screen.getByRole('button', { name: /delete/i })
    expect(btn).toBeDisabled()
  })
})
