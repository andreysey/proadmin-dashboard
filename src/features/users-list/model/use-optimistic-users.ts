import { useMutationState } from '@tanstack/react-query'
import type { User, UserRole } from '@/entities/user/model/types'
import { useMemo } from 'react'

export interface OptimisticUser extends User {
  isDeleting: boolean
  isUpdating: boolean
}

/**
 * ARCHITECTURAL PATTERN: UI-Driven Optimistic Updates (Concurrent-Safe)
 * Instead of manual cache manipulation in hooks (onMutate), we derive the
 * view state globally using useMutationState. This natively handles
 * simultaneous mutations and avoids race conditions.
 * @see https://tkdodo.eu/blog/concurrent-optimistic-updates-in-react-query
 */
export const useOptimisticUsers = (users: User[]) => {
  const pendingDeletions = useMutationState({
    filters: { mutationKey: ['deleteUser'], status: 'pending' },
    select: (mutation) => mutation.state.variables as number,
  })

  const pendingBulkDeletions = useMutationState({
    filters: { mutationKey: ['bulkDelete'], status: 'pending' },
    select: (mutation) => mutation.state.variables as number[],
  }).flat()

  const pendingRoleUpdates = useMutationState({
    filters: { mutationKey: ['bulkUpdateRole'], status: 'pending' },
    select: (mutation) => mutation.state.variables as { ids: number[]; role: UserRole },
  })

  return useMemo(() => {
    return users.map((user) => {
      const isDeleting =
        pendingDeletions.includes(user.id) || pendingBulkDeletions.includes(user.id)

      const pendingUpdate = [...pendingRoleUpdates]
        .reverse()
        .find((update) => update.ids.includes(user.id))

      return {
        ...user,
        role: pendingUpdate ? (pendingUpdate.role as UserRole) : user.role,
        isDeleting,
        isUpdating: !!pendingUpdate,
      } as OptimisticUser
    })
  }, [users, pendingDeletions, pendingBulkDeletions, pendingRoleUpdates])
}
