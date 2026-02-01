import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateUser } from '@/entities/user'
import type { UserRole } from '@/entities/user/model/types'
import { toast } from 'sonner'

export const useBulkUpdateRole = () => {
  const queryClient = useQueryClient()

  // Note: Optimistic UI is handled in UserListTable using the 'UI-driven' pattern via useMutationState.
  return useMutation({
    mutationKey: ['bulkUpdateRole'],
    mutationFn: async ({ ids, role }: { ids: number[]; role: UserRole }) => {
      return Promise.all(ids.map((id) => updateUser(id, { role })))
    },
    onSuccess: (_, { ids, role }) => {
      toast.success(`Successfully updated ${ids.length} users to ${role}`)
    },
    onError: () => {
      toast.error('Bulk role update failed')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
