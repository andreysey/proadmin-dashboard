import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useBulkUpdateRole } from './use-bulk-update-role'
import { bulkUpdateRole, ROLES } from '@/entities/user'
import { toast } from 'sonner'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'

// Mock dependencies
vi.mock('@/entities/user', () => ({
  bulkUpdateRole: vi.fn(),
  ROLES: {
    ADMIN: 'ADMIN',
    USER: 'USER',
    MODERATOR: 'MODERATOR',
  },
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

  it('should call bulkUpdateRole with IDs and role, and invalidate queries on success', async () => {
    vi.mocked(bulkUpdateRole).mockResolvedValue({
      success: true,
    })

    const { result } = renderHook(() => useBulkUpdateRole(), { wrapper: createWrapper() })

    result.current.mutate({ ids: ['1', '2'], role: ROLES.ADMIN })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(bulkUpdateRole).toHaveBeenCalledTimes(1)
    expect(bulkUpdateRole).toHaveBeenCalledWith(['1', '2'], ROLES.ADMIN)
    expect(toast.success).toHaveBeenCalledWith(`Successfully updated 2 users to ${ROLES.ADMIN}`)
  })

  it('should show error toast on failure', async () => {
    vi.mocked(bulkUpdateRole).mockRejectedValueOnce(new Error('API Error'))

    const { result } = renderHook(() => useBulkUpdateRole(), { wrapper: createWrapper() })

    result.current.mutate({ ids: ['1'], role: ROLES.MODERATOR })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(toast.error).toHaveBeenCalledWith('Bulk role update failed')
  })
})
