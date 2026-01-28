import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteUser } from '@/entities/user'
import { toast } from 'sonner'

export const useBulkDelete = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (ids: number[]) => {
      // Perform all deletions in parallel
      return Promise.all(ids.map((id) => deleteUser(id)))
    },
    onSuccess: (_, ids) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success(`Successfully deleted ${ids.length} users`)
    },
    onError: () => {
      toast.error('Bulk deletion failed.') // Fixed typo: added period for consistency
    },
  })
}
