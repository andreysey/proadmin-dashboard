import { z } from 'zod'

export const ActivityLogItemSchema = z.object({
  id: z.string(),
  type: z.enum([
    'user_signup',
    'user_delete',
    'user_login',
    'user_updated',
    'system_alert',
    'payment_success',
  ]),
  title: z.string(),
  description: z.string(),
  timestamp: z.string().datetime(),
  userId: z.string().optional(),
})

export type ActivityLogItem = z.infer<typeof ActivityLogItemSchema>

export const ActivityLogResponseSchema = z.object({
  items: z.array(ActivityLogItemSchema),
  total: z.number(),
})

export type ActivityLogResponse = z.infer<typeof ActivityLogResponseSchema>
