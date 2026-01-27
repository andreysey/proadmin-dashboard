import { ROLES_PERMISSIONS, type Permission } from '@/entities/user'
import { useAuthStore } from './auth.store'

export const usePermission = () => {
  const user = useAuthStore((state) => state.user)

  const hasPermission = (permission: Permission) => {
    if (!user) return false

    const usersPermissions = ROLES_PERMISSIONS[user.role]

    return usersPermissions.includes(permission)
  }
  return { hasPermission, role: user?.role }
}
