import { ROLES, type User, type UserRole } from './schemas'

export const PERMISSIONS = [
  'users:view',
  'users:edit',
  'users:delete',
  'users:manage-roles',
] as const

export type Permission = (typeof PERMISSIONS)[number]

export const ROLES_PERMISSIONS: Record<UserRole, Permission[]> = {
  [ROLES.ADMIN]: ['users:view', 'users:edit', 'users:delete', 'users:manage-roles'],
  [ROLES.MODERATOR]: ['users:view', 'users:edit'],
  [ROLES.USER]: ['users:view'],
}

export const checkPermission = (user: User | null, permission: Permission): boolean => {
  if (!user) return false

  return ROLES_PERMISSIONS[user.role as UserRole].includes(permission)
}
