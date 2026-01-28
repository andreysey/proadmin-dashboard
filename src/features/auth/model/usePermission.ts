import { checkPermission, type Permission } from '@/entities/user'
import { useAuthStore } from './auth.store'

export const usePermission = () => {
  const user = useAuthStore((state) => state.user)

  const hasPermission = (permission: Permission) => {
    return checkPermission(user, permission)
  }

  return { hasPermission, role: user?.role }
}
