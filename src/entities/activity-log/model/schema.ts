import { z } from 'zod'
// from diff @@ -2,2 +2,6 @@
export const ActivityMetadataSchema = z
  .object({
    userAgent: z.string().optional().nullable(),
    ip: z.string().optional().nullable(),
  })
  .loose()

export type ActivityMetadata = z.infer<typeof ActivityMetadataSchema>

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
  timestamp: z.string().datetime({}),
  userId: z.string().optional().nullable(),
  metadata: ActivityMetadataSchema.optional().nullable(),
})

export type ActivityLogItem = z.infer<typeof ActivityLogItemSchema>

export const ActivityLogResponseSchema = z.object({
  items: z.array(ActivityLogItemSchema),
  total: z.number(),
})

export type ActivityLogResponse = z.infer<typeof ActivityLogResponseSchema>
