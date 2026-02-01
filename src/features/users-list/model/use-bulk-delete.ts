import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteUser } from '@/entities/user'
import { toast } from 'sonner'

export const useBulkDelete = () => {
  const queryClient = useQueryClient()

  // Note: Optimistic UI is handled in UserListTable using the 'UI-driven' pattern via useMutationState.
  return useMutation({
    mutationKey: ['bulkDelete'],
    mutationFn: async (ids: number[]) => {
      // Perform all deletions in parallel
      return Promise.all(ids.map((id) => deleteUser(id)))
    },
    onSuccess: (_, ids) => {
      toast.success(`Successfully deleted ${ids.length} users`)
    },
    onError: () => {
      toast.error('Bulk deletion failed.')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
