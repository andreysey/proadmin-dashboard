import { useQuery } from '@tanstack/react-query'
import { getActivityLogs } from '../api/activity-log.api'

export const useActivityLogs = (skip = 0, take = 50) => {
  return useQuery({
    queryKey: ['activity-log', { skip, take }],
    queryFn: () => getActivityLogs(skip, take),
  })
}
