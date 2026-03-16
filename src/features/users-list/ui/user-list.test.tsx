import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UserList } from './user-list'
import * as reactQuery from '@tanstack/react-query'

// Mock dependencies
vi.mock('@tanstack/react-query', async (importOriginal) => {
  await import('react')
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
    // Mock window.location.reload
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { reload: vi.fn() },
    })
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
        id: '1',
        displayId: 'USR-001',
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        email: 'john@example.com',
        role: 'admin',
        image: '',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      },
      {
        id: '2',
        displayId: 'USR-002',
        firstName: 'Jane',
        lastName: 'Smith',
        username: 'janesmith',
        email: 'jane@example.com',
        role: 'user',
        image: '',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      },
    ]

    vi.mocked(reactQuery.useQuery).mockReturnValue({
      data: { data: mockUsers, meta: { total: 2, page: 1, limit: 10, totalPages: 1 } },
      isPending: false,
      isError: false,
    } as unknown as ReturnType<typeof reactQuery.useQuery>)

    render(<UserList search="" onSearchChange={vi.fn()} />)
    expect(screen.getAllByText('John Doe')[0]).toBeInTheDocument()
    expect(screen.getAllByText('Jane Smith')[0]).toBeInTheDocument()
    expect(screen.getAllByText('@johndoe')[0]).toBeInTheDocument()
    // The role translation might be 'admin' or something depending on mock
    expect(screen.getAllByText('Admin')[0]).toBeInTheDocument()
  })

  it('should render empty state', () => {
    vi.mocked(reactQuery.useQuery).mockReturnValue({
      data: { data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } },
      isPending: false,
      isError: false,
    } as unknown as ReturnType<typeof reactQuery.useQuery>)

    render(<UserList search="" onSearchChange={vi.fn()} />)
    expect(screen.getByText('No users found.')).toBeInTheDocument()
  })

  it('should handle pagination state', () => {
    vi.mocked(reactQuery.useQuery).mockReturnValue({
      data: { data: [], meta: { total: 100, page: 1, limit: 10, totalPages: 10 } },
      isPending: false,
      isError: false,
    } as unknown as ReturnType<typeof reactQuery.useQuery>)

    // First page: Prev disabled, Next enabled
    const { rerender } = render(<UserList page={1} limit={10} search="" onSearchChange={vi.fn()} />)
    const prevBtns = screen.getAllByText('Previous')
    const nextBtns = screen.getAllByText('Next')

    prevBtns.forEach((btn) => expect(btn.closest('button')).toBeDisabled())
    nextBtns.forEach((btn) => expect(btn.closest('button')).toBeEnabled())

    // Middle page: Both enabled
    vi.mocked(reactQuery.useQuery).mockReturnValue({
      data: { data: [], meta: { total: 100, page: 2, limit: 10, totalPages: 10 } },
      isPending: false,
      isError: false,
    } as unknown as ReturnType<typeof reactQuery.useQuery>)
    rerender(<UserList page={2} limit={10} search="" onSearchChange={vi.fn()} />)
    screen.getAllByText('Previous').forEach((btn) => expect(btn.closest('button')).toBeEnabled())
    screen.getAllByText('Next').forEach((btn) => expect(btn.closest('button')).toBeEnabled())

    // Last page: Next disabled
    vi.mocked(reactQuery.useQuery).mockReturnValue({
      data: { data: [], meta: { total: 100, page: 10, limit: 10, totalPages: 10 } },
      isPending: false,
      isError: false,
    } as unknown as ReturnType<typeof reactQuery.useQuery>)
    rerender(<UserList page={10} limit={10} search="" onSearchChange={vi.fn()} />)
    screen.getAllByText('Previous').forEach((btn) => expect(btn.closest('button')).toBeEnabled())
    screen.getAllByText('Next').forEach((btn) => expect(btn.closest('button')).toBeDisabled())
  })
  it('should call onPageChange when clicking next/prev', async () => {
    vi.mocked(reactQuery.useQuery).mockReturnValue({
      data: { data: [], meta: { total: 100, page: 1, limit: 10, totalPages: 10 } },
      isPending: false,
      isError: false,
    } as unknown as ReturnType<typeof reactQuery.useQuery>)

    const onPageChange = vi.fn()
    render(
      <UserList
        page={1}
        limit={10}
        search=""
        onSearchChange={vi.fn()}
        onPageChange={onPageChange}
      />
    )

    const nextBtn = screen.getAllByText('Next')[0]
    fireEvent.click(nextBtn.closest('button')!)
    expect(onPageChange).toHaveBeenCalledWith(2)

    onPageChange.mockClear()
    cleanup()

    // Re-render with skip > 0 to test Previous
    vi.mocked(reactQuery.useQuery).mockReturnValue({
      data: { data: [], meta: { total: 100, page: 2, limit: 10, totalPages: 10 } },
      isPending: false,
      isError: false,
    } as unknown as ReturnType<typeof reactQuery.useQuery>)
    render(
      <UserList
        page={2}
        limit={10}
        search=""
        onSearchChange={vi.fn()}
        onPageChange={onPageChange}
      />
    )
    const prevBtn = screen.getAllByText('Previous')[0]
    expect(prevBtn.closest('button')).toBeEnabled()
    fireEvent.click(prevBtn)
    expect(onPageChange).toHaveBeenCalledWith(1)
  })

  it('should call onSortChange when clicking table headers', async () => {
    vi.mocked(reactQuery.useQuery).mockReturnValue({
      data: { data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } },
      isPending: false,
      isError: false,
    } as unknown as ReturnType<typeof reactQuery.useQuery>)

    const onSortChange = vi.fn()
    render(
      <UserList
        search=""
        onSearchChange={vi.fn()}
        onSortChange={onSortChange}
        sortBy="id"
        sortOrder="desc"
      />
    )

    // Click ID column header
    const idHeader = screen.getByText('ID')
    await userEvent.click(idHeader)
    expect(onSortChange).toHaveBeenCalled()
  })

  it('should call onSearchChange when typing', async () => {
    vi.mocked(reactQuery.useQuery).mockReturnValue({
      data: { data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } },
      isPending: false,
      isError: false,
    } as unknown as ReturnType<typeof reactQuery.useQuery>)

    const onSearchChange = vi.fn()
    render(<UserList search="" onSearchChange={onSearchChange} />)

    const input = screen.getByPlaceholderText('Search users...')
    await userEvent.type(input, 't')
    expect(onSearchChange).toHaveBeenCalledWith('t')
  })
})
