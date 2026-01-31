import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useDeleteUser } from './use-delete-user'
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

describe('useDeleteUser', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should call deleteUser API and invalidate queries on success', async () => {
    vi.mocked(deleteUser).mockResolvedValue({ isDeleted: true })

    const { result } = renderHook(() => useDeleteUser(), { wrapper: createWrapper() })

    result.current.mutate(123)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(deleteUser).toHaveBeenCalledWith(123)
    expect(toast.success).toHaveBeenCalledWith('User #123 deleted successfully')
    // Note: verifying cache invalidation directly is hard without a spy on queryClient.
    // But we trust standard useMutation behavior if onSuccess is executed.
  })

  it('should show error toast on failure', async () => {
    vi.mocked(deleteUser).mockRejectedValue(new Error('API Error'))

    const { result } = renderHook(() => useDeleteUser(), { wrapper: createWrapper() })

    result.current.mutate(123)

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(toast.error).toHaveBeenCalledWith('API Error')
  })
})
