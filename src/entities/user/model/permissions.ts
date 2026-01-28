import type { User, UserRole } from './types'

export const PERMISSIONS = [
  'users:view',
  'users:edit',
  'users:delete',
  'users:manage-roles',
] as const

export type Permission = (typeof PERMISSIONS)[number]

export const ROLES_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: ['users:view', 'users:edit', 'users:delete', 'users:manage-roles'],
  moderator: ['users:view', 'users:edit'],
  user: ['users:view'],
}

export const checkPermission = (user: User | null, permission: Permission): boolean => {
  if (!user) return false

  return ROLES_PERMISSIONS[user.role].includes(permission)
}
