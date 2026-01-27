import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateUser } from '@/entities/user/api/user.api'
import type { User } from '@/entities/user/model/types'

export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<User> }) => updateUser(id, data),
    onSuccess: (updatedUser) => {
      // Invalidate the specific user query
      queryClient.invalidateQueries({ queryKey: ['users', updatedUser.id] })
      // Invalidate the users list
      queryClient.invalidateQueries({ queryKey: ['users'] })
      console.log('User updated successfully:', updatedUser)
    },
    onError: (error) => {
      console.error('Failed to update user:', error)
    },
  })
}
