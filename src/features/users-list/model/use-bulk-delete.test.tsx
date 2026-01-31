import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useBulkDelete } from './use-bulk-delete'
import { deleteUser } from '@/entities/user'
import { toast } from 'sonner'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'

// Mock dependencies
vi.mock('@/entities/user', () => ({
  deleteUser: vi.fn(),
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

// Wrapper for TanStack Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useBulkDelete', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should call deleteUser for each ID and invalidate queries on success', async () => {
    vi.mocked(deleteUser).mockResolvedValue({ isDeleted: true })

    const { result } = renderHook(() => useBulkDelete(), { wrapper: createWrapper() })

    result.current.mutate([1, 2, 3])

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(deleteUser).toHaveBeenCalledTimes(3)
    expect(deleteUser).toHaveBeenCalledWith(1)
    expect(deleteUser).toHaveBeenCalledWith(2)
    expect(deleteUser).toHaveBeenCalledWith(3)
    expect(toast.success).toHaveBeenCalledWith('Successfully deleted 3 users')
  })

  it('should show error toast on failure', async () => {
    vi.mocked(deleteUser).mockRejectedValueOnce(new Error('API Error'))

    const { result } = renderHook(() => useBulkDelete(), { wrapper: createWrapper() })

    result.current.mutate([1, 2])

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(toast.error).toHaveBeenCalledWith('Bulk deletion failed.')
  })
})
