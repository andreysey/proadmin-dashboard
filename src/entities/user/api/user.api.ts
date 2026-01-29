import { api } from '@/shared/api'
import { userSchema, usersResponseSchema, type UsersResponse, type User } from '../model/schemas'

/**
 * Get paginated list of users.
 * Response is validated at the network boundary with Zod.
 */
export const getUsers = async (params?: {
  skip?: number
  limit?: number
  q?: string
  sortBy?: string
  order?: 'asc' | 'desc'
}): Promise<UsersResponse> => {
  const response = await api.get('/users', { params })

  // Validate response at network boundary
  return usersResponseSchema.parse(response.data)
}

/**
 * Delete a user by ID.
 */
export const deleteUser = async (id: number) => {
  const response = await api.delete(`/users/${id}`)

  return response.data
}

/**
 * Get a single user by ID.
 * Response is validated with Zod schema.
 */
export const getUserById = async (id: number): Promise<User> => {
  const response = await api.get(`/users/${id}`)

  return userSchema.parse(response.data)
}

/**
 * Update a user.
 * Response is validated with Zod schema.
 */
export const updateUser = async (id: number, data: Partial<User>): Promise<User> => {
  const response = await api.put(`/users/${id}`, data)

  return userSchema.parse(response.data)
}
