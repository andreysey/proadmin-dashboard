import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteUser } from '@/entities/user/api/user.api'

export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: (_, id) => {
      // Invalidate users list to trigger refetch
      queryClient.invalidateQueries({ queryKey: ['users'] })
      // For now using console, will add toast later
      console.log(`User #${id} deleted successfully`)
    },
    onError: (error) => {
      console.error(error instanceof Error ? error.message : 'Failed to delete user')
    },
  })
}
