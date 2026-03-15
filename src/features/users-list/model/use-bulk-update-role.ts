import { useMutation, useQueryClient } from '@tanstack/react-query'
import { bulkUpdateRole } from '@/entities/user'
import type { UserRole } from '@/entities/user/model/types'
import { toast } from 'sonner'

export const useBulkUpdateRole = () => {
  const queryClient = useQueryClient()

  // Note: Optimistic UI is handled in UserListTable using the 'UI-driven' pattern via useMutationState.
  return useMutation({
    mutationKey: ['bulkUpdateRole'],
    mutationFn: ({ ids, role }: { ids: string[]; role: UserRole }) => bulkUpdateRole(ids, role),
    onSuccess: (_, { ids, role }) => {
      toast.success(`Successfully updated ${ids.length} users to ${role}`)
    },
    onError: () => {
      toast.error('Bulk role update failed')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['analytics', 'recent'] })
    },
  })
}
