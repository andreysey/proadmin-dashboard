import React from 'react'
import type { Permission } from '@/entities/user'
import { usePermission } from '../model/usePermission'

interface ProtectedActionProps {
  permission: Permission
  children: React.ReactNode
  fallback?: React.ReactNode
}

export const ProtectedAction = ({
  permission,
  children,
  fallback = null,
}: ProtectedActionProps) => {
  const { hasPermission } = usePermission()

  if (!hasPermission(permission)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
