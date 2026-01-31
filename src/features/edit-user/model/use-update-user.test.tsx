import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useUpdateUser } from './use-update-user'
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

describe('useUpdateUser', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const mockUser = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    image: 'img.jpg',
    role: 'user',
  }

  it('should call updateUser API and invalidate queries on success', async () => {
    vi.mocked(updateUser).mockResolvedValue(mockUser as unknown as import('@/entities/user').User)

    const { result } = renderHook(() => useUpdateUser(), { wrapper: createWrapper() })

    result.current.mutate({ id: 1, data: { firstName: 'Updated' } })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(updateUser).toHaveBeenCalledWith(1, { firstName: 'Updated' })
    expect(toast.success).toHaveBeenCalledWith(`User updated successfully: ${mockUser.username}`)
  })

  it('should show error toast on failure', async () => {
    vi.mocked(updateUser).mockRejectedValue(new Error('API Error'))

    const { result } = renderHook(() => useUpdateUser(), { wrapper: createWrapper() })

    result.current.mutate({ id: 1, data: { firstName: 'Updated' } })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(toast.error).toHaveBeenCalledWith('Failed to update user')
  })
})
