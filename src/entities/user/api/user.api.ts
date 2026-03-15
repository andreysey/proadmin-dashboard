import { api } from '@/shared/api'
import { userSchema, usersResponseSchema, type UsersResponse, type User } from '../model/schemas'

/**
 * Get paginated list of users.
 * Response is validated at the network boundary with Zod.
 */
export const getUsers = async (params?: {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}): Promise<UsersResponse> => {
  const response = await api.get('/users', { params })

  // Validate response at network boundary
  return usersResponseSchema.parse(response.data)
}

/**
 * Delete a user by ID.
 */
export const deleteUser = async (id: string) => {
  const response = await api.delete(`/users/${id}`)

  return response.data
}

/**
 * Get a single user by ID.
 * Response is validated with Zod schema.
 */
export const getUserById = async (id: string): Promise<User> => {
  const response = await api.get(`/users/${id}`)

  return userSchema.parse(response.data)
}

/**
 * Update a user.
 * Response is validated with Zod schema.
 */
export const updateUser = async (id: string, data: Partial<User>): Promise<User> => {
  const response = await api.patch(`/users/${id}`, data)

  return userSchema.parse(response.data)
}

/**
 * Bulk update user roles.
 */
export const bulkUpdateRole = async (ids: string[], role: User['role']) => {
  const response = await api.patch('/users/bulk-update', { ids, role })

  return response.data
}
