import { api } from '@/shared/api'
import type { User } from '../model/types'

interface GetUsersResponse {
  users: User[]
  total: number
  skip: number
  limit: number
}

export const getUsers = async () => {
  const response = await api.get<GetUsersResponse>('/users')

  return response.data
}
