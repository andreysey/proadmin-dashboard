import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateUser } from '@/entities/user/api/user.api'
import type { User } from '@/entities/user/model/types'
import { toast } from 'sonner'

export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<User> }) => updateUser(id, data),
    onSuccess: (updatedUser) => {
      // Invalidate the specific user query
      queryClient.invalidateQueries({ queryKey: ['users', updatedUser.id] })
      // Invalidate the users list
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success(`User updated successfully: ${updatedUser.username}`)
    },
    onError: () => {
      toast.error('Failed to update user')
    },
  })
}
