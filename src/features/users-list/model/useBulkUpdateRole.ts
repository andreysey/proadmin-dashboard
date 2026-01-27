import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateUser } from '@/entities/user'
import type { UserRole } from '@/entities/user/model/types'

/**
 * Hook to handle bulk role updates.
 *
 * Socratic Method:
 * If we have 100 users to update, is sending 100 parallel requests efficient?
 * Why might a backend engineer prefer a single PATCH endpoint with a list of IDs?
 */
export const useBulkUpdateRole = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ ids, role }: { ids: number[]; role: UserRole }) => {
      return Promise.all(ids.map((id) => updateUser(id, { role })))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      console.log('Bulk role update successful')
    },
    onError: (error) => {
      console.error('Bulk role update failed:', error)
    },
  })
}
