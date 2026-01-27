import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteUser } from '@/entities/user'

/**
 * Hook to handle bulk deletion of users.
 * Since the API doesn't support bulk delete, we perform multiple parallel requests.
 *
 * Critical Thinking:
 * - What happens if one request fails but others succeed?
 * - In a real app, we would ideally have a /users/batch-delete endpoint.
 * - Here, we perform parallel deletions and invalidate the query once.
 */
export const useBulkDelete = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (ids: number[]) => {
      // Perform all deletions in parallel
      return Promise.all(ids.map((id) => deleteUser(id)))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      console.log('Bulk deletion successful')
    },
    onError: (error) => {
      console.error('Bulk deletion failed:', error)
    },
  })
}
