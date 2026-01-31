import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getUsers, deleteUser, getUserById, updateUser } from './user.api'
import { api } from '@/shared/api'

// Mock shared API
vi.mock('@/shared/api', () => ({
  api: {
    get: vi.fn(),
    delete: vi.fn(),
    put: vi.fn(),
  },
}))

describe('User API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const mockUser = {
    id: 1,
    username: 'testu',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    image: 'https://example.com/avatar.jpg',
    role: 'user' as const,
  }

  const mockUsersResponse = {
    users: [mockUser],
    total: 100,
    skip: 0,
    limit: 10,
  }

  describe('getUsers', () => {
    it('should fetch users with params', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: mockUsersResponse })
      const params = { skip: 10, limit: 5, q: 'search' }

      const result = await getUsers(params)

      expect(api.get).toHaveBeenCalledWith('/users', { params })
      expect(result).toEqual(mockUsersResponse)
    })
  })

  describe('getUserById', () => {
    it('should fetch single user', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: mockUser })

      const result = await getUserById(1)

      expect(api.get).toHaveBeenCalledWith('/users/1')
      expect(result).toEqual(mockUser)
    })
  })

  describe('deleteUser', () => {
    it('should delete user by id', async () => {
      vi.mocked(api.delete).mockResolvedValue({ data: { isDeleted: true } })

      const result = await deleteUser(1)

      expect(api.delete).toHaveBeenCalledWith('/users/1')
      expect(result).toEqual({ isDeleted: true })
    })
  })

  describe('updateUser', () => {
    it('should update user data', async () => {
      const updateData = { firstName: 'Updated' }
      const updatedUser = { ...mockUser, ...updateData }

      vi.mocked(api.put).mockResolvedValue({ data: updatedUser })

      const result = await updateUser(1, updateData)

      expect(api.put).toHaveBeenCalledWith('/users/1', updateData)
      expect(result).toEqual(updatedUser)
    })
  })
})
