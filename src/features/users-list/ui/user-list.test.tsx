import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { UserList } from './user-list'
import * as reactQuery from '@tanstack/react-query'

// Mock dependencies
vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal<typeof reactQuery>()
  return {
    ...actual,
    useQuery: vi.fn(),
    keepPreviousData: actual.keepPreviousData,
  }
})

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}))

vi.mock('@/features/auth', () => ({
  ProtectedAction: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

vi.mock('../model/use-bulk-delete', () => ({
  useBulkDelete: () => ({ mutate: vi.fn(), isPending: false }),
}))

vi.mock('../model/use-bulk-update-role', () => ({
  useBulkUpdateRole: () => ({ mutate: vi.fn(), isPending: false }),
}))

// Mock Sub-components to simplify test
vi.mock('@/features/delete-user', () => ({
  DeleteUserButton: () => <button>Delete</button>,
}))

vi.mock('./bulk-actions', () => ({
  BulkActions: () => <div>Bulk Actions</div>,
}))

describe('UserList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render skeleton when loading', () => {
    vi.mocked(reactQuery.useQuery).mockReturnValue({
      data: undefined,
      isPending: true,
      isError: false,
    } as unknown as ReturnType<typeof reactQuery.useQuery>)

    render(<UserList search="" onSearchChange={vi.fn()} />)
    // Check for skeleton elements (table structure is rendered in skeleton)
    expect(screen.getAllByRole('row').length).toBeGreaterThan(0)
    // Or check if real data is NOT there.
    expect(screen.queryByText('No users found.')).not.toBeInTheDocument()
  })

  it('should render error state', () => {
    vi.mocked(reactQuery.useQuery).mockReturnValue({
      data: undefined,
      isPending: false,
      isError: true,
    } as unknown as ReturnType<typeof reactQuery.useQuery>)

    render(<UserList search="" onSearchChange={vi.fn()} />)
    expect(screen.getByText('Failed to load users')).toBeInTheDocument()
  })

  it('should render users data', () => {
    const mockUsers = [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        email: 'john@example.com',
        role: 'admin',
        image: '',
      },
      {
        id: 2,
        firstName: 'Jane',
        lastName: 'Smith',
        username: 'janesmith',
        email: 'jane@example.com',
        role: 'user',
        image: '',
      },
    ]

    vi.mocked(reactQuery.useQuery).mockReturnValue({
      data: { users: mockUsers, total: 2 },
      isPending: false,
      isError: false,
    } as unknown as ReturnType<typeof reactQuery.useQuery>)

    render(<UserList search="" onSearchChange={vi.fn()} />)
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('@johndoe')).toBeInTheDocument()
    expect(screen.getByText('admin')).toBeInTheDocument()
  })

  it('should render empty state', () => {
    vi.mocked(reactQuery.useQuery).mockReturnValue({
      data: { users: [], total: 0 },
      isPending: false,
      isError: false,
    } as unknown as ReturnType<typeof reactQuery.useQuery>)

    render(<UserList search="" onSearchChange={vi.fn()} />)
    expect(screen.getByText('No users found.')).toBeInTheDocument()
  })

  it('should handle pagination state', () => {
    vi.mocked(reactQuery.useQuery).mockReturnValue({
      data: { users: [], total: 100 }, // Total 100, current view default skip=0, limit=10
      isPending: false,
      isError: false,
    } as unknown as ReturnType<typeof reactQuery.useQuery>)

    // First page: Prev disabled, Next enabled
    const { rerender } = render(<UserList skip={0} limit={10} search="" onSearchChange={vi.fn()} />)
    const prevBtns = screen.getAllByText('Previous')
    const nextBtns = screen.getAllByText('Next')

    prevBtns.forEach((btn) => expect(btn.closest('button')).toBeDisabled())
    nextBtns.forEach((btn) => expect(btn.closest('button')).toBeEnabled())

    // Middle page: Both enabled
    rerender(<UserList skip={10} limit={10} search="" onSearchChange={vi.fn()} />)
    screen.getAllByText('Previous').forEach((btn) => expect(btn.closest('button')).toBeEnabled())
    screen.getAllByText('Next').forEach((btn) => expect(btn.closest('button')).toBeEnabled())

    // Last page: Next disabled
    rerender(<UserList skip={90} limit={10} search="" onSearchChange={vi.fn()} />)
    screen.getAllByText('Previous').forEach((btn) => expect(btn.closest('button')).toBeEnabled())
    screen.getAllByText('Next').forEach((btn) => expect(btn.closest('button')).toBeDisabled())
  })
})
