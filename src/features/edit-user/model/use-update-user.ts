import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateUser } from '@/entities/user'
import type { User } from '@/entities/user'
import { toast } from 'sonner'

export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) => updateUser(id, data),
    onSuccess: (updatedUser) => {
      // Invalidate the specific user query
      queryClient.invalidateQueries({ queryKey: ['users', updatedUser.id] })
      // Invalidate the users list
      queryClient.invalidateQueries({ queryKey: ['users'] })
      // Invalidate the recent activity feed
      queryClient.invalidateQueries({ queryKey: ['analytics', 'recent'] })
      queryClient.invalidateQueries({ queryKey: ['activity-log'] })
      toast.success(`User updated successfully: ${updatedUser.username}`)
    },
    onError: () => {
      toast.error('Failed to update user')
    },
  })
}
