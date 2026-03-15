import { api } from '@/shared/api'
import { ActivityLogResponseSchema, type ActivityLogResponse } from '../model/schema'

export const getActivityLogs = async (skip = 0, take = 50): Promise<ActivityLogResponse> => {
  const response = await api.get('/activity-log', {
    params: { skip, take },
  })
  return ActivityLogResponseSchema.parse(response.data)
}
