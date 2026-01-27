import type { UserRole } from './types'

export const PERMISSIONS = ['users:view', 'users:edit', 'users:delete'] as const

export type Permission = (typeof PERMISSIONS)[number]

export const ROLES_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: ['users:view', 'users:edit', 'users:delete'],
  user: ['users:view'],
  moderator: ['users:view', 'users:edit'],
}
