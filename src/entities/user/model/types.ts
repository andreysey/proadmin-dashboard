export const ROLES = ['admin', 'user', 'moderator'] as const
export type UserRole = (typeof ROLES)[number]

export interface User {
  id: number
  username: string
  firstName: string
  lastName: string
  email: string
  role: UserRole
  image: string
}
