import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useBulkUpdateRole } from './use-bulk-update-role'
import { updateUser } from '@/entities/user'
import { toast } from 'sonner'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'

// Mock dependencies
vi.mock('@/entities/user', () => ({
  updateUser: vi.fn(),
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

describe('useBulkUpdateRole', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should call updateUser for each ID and invalidate queries on success', async () => {
    vi.mocked(updateUser).mockResolvedValue({
      id: 1,
      role: 'admin',
    } as unknown as import('@/entities/user').User)

    const { result } = renderHook(() => useBulkUpdateRole(), { wrapper: createWrapper() })

    result.current.mutate({ ids: [1, 2], role: 'admin' })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(updateUser).toHaveBeenCalledTimes(2)
    expect(updateUser).toHaveBeenCalledWith(1, { role: 'admin' })
    expect(updateUser).toHaveBeenCalledWith(2, { role: 'admin' })
    expect(toast.success).toHaveBeenCalledWith('Successfully updated 2 users to admin')
  })

  it('should show error toast on failure', async () => {
    vi.mocked(updateUser).mockRejectedValueOnce(new Error('API Error'))

    const { result } = renderHook(() => useBulkUpdateRole(), { wrapper: createWrapper() })

    result.current.mutate({ ids: [1], role: 'moderator' })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(toast.error).toHaveBeenCalledWith('Bulk role update failed')
  })
})
