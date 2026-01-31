import { describe, it, expect, vi, beforeEach } from 'vitest'
import { login } from './auth.api'
import { api } from '@/shared/api'
import { tokenStorage } from '@/shared/lib/auth'

// Mock dependencies
vi.mock('@/shared/api', () => ({
  api: {
    post: vi.fn(),
  },
}))

vi.mock('@/shared/lib/auth', () => ({
  tokenStorage: {
    setTokens: vi.fn(),
  },
}))

describe('Auth API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const mockCredentials = {
    username: 'testuser',
    password: 'password123',
  }

  const mockValidResponse = {
    data: {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      gender: 'male' as const,
      image: 'https://example.com/avatar.jpg',
      accessToken: 'fake-jwt-token',
      refreshToken: 'fake-refresh-token',
      role: 'admin' as const,
    },
  }

  it('should authenticate user and store tokens on success', async () => {
    vi.mocked(api.post).mockResolvedValue(mockValidResponse)

    const user = await login(mockCredentials)

    expect(api.post).toHaveBeenCalledWith('/auth/login', mockCredentials)
    expect(tokenStorage.setTokens).toHaveBeenCalledWith({
      accessToken: 'fake-jwt-token',
      refreshToken: 'fake-refresh-token',
    })
    expect(user).toEqual(
      expect.objectContaining({
        id: 1,
        username: 'testuser',
        role: 'admin',
      })
    )
  })

  it('should throw error if no token received', async () => {
    const responseWithoutToken = {
      data: {
        ...mockValidResponse.data,
        accessToken: undefined,
        token: undefined,
      },
    }
    vi.mocked(api.post).mockResolvedValue(responseWithoutToken)

    await expect(login(mockCredentials)).rejects.toThrow('No authentication token received')
  })
})
