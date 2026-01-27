import { api } from '@/shared/api'
import type { User } from '../model/types'

interface GetUsersResponse {
  users: User[]
  total: number
  skip: number
  limit: number
}

export const getUsers = async (params?: {
  skip?: number
  limit?: number
  q?: string
  sortBy?: string
  order?: 'asc' | 'desc'
}) => {
  const response = await api.get<GetUsersResponse>('/users', { params })

  return response.data
}
export const deleteUser = async (id: number) => {
  const response = await api.delete(`/users/${id}`)

  return response.data
}
export const getUserById = async (id: number) => {
  const response = await api.get<User>(`/users/${id}`)

  return response.data
}

export const updateUser = async (id: number, data: Partial<User>) => {
  const response = await api.put<User>(`/users/${id}`, data)

  return response.data
}
