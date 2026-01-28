import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteUser } from '@/entities/user'
import { toast } from 'sonner'

export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: (_, id) => {
      // Invalidate users list to trigger refetch
      queryClient.invalidateQueries({ queryKey: ['users'] })

      toast.success(`User #${id} deleted successfully`)
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to delete user')
    },
  })
}
