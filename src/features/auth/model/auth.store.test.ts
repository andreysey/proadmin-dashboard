import { describe, it, expect, vi, beforeEach } from 'vitest'
import { act } from '@testing-library/react'
import { useAuthStore } from './auth.store'
import { tokenStorage } from '@/shared/lib/auth'
import { ROLES } from '@/entities/user'

// Mock tokenStorage
vi.mock('@/shared/lib/auth', () => ({
  tokenStorage: {
    clear: vi.fn(),
    get: vi.fn(),
    set: vi.fn(),
  },
}))

describe('Auth Store', () => {
  const mockUser = {
    id: '1',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    username: 'test',
    role: ROLES.ADMIN,
    image: 'https://i.pravatar.cc/150?u=test',
    displayId: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    // Reset store state
    act(() => {
      useAuthStore.setState({ user: null })
    })
  })

  it('should initialize with null user', () => {
    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
  })

  it('should set user on login (setAuth)', () => {
    act(() => {
      useAuthStore.getState().setAuth(mockUser)
    })

    const state = useAuthStore.getState()
    expect(state.user).toEqual(mockUser)
  })

  it('should clear user and token on logout', () => {
    // First set user
    act(() => {
      useAuthStore.getState().setAuth(mockUser)
    })
    expect(useAuthStore.getState().user).not.toBeNull()

    // Then logout
    act(() => {
      useAuthStore.getState().logout()
    })

    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(tokenStorage.clear).toHaveBeenCalledTimes(1)
  })
})
