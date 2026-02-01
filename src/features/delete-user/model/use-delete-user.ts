import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteUser } from '@/entities/user'
import { toast } from 'sonner'

export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  // Note: Optimistic UI is handled in UserListTable using the 'UI-driven' pattern via useMutationState.
  return useMutation({
    mutationKey: ['deleteUser'],
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: (_, id) => {
      toast.success(`User #${id} deleted successfully`)
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Failed to delete user')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
