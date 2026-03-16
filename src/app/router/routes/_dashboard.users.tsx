import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { UsersPage } from '@/pages/users'

const usersSearchSchema = z.object({
  page: z.number().optional().default(1),
  limit: z.number().optional().default(10),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
})

export type UsersSearch = z.infer<typeof usersSearchSchema>

export const Route = createFileRoute('/_dashboard/users')({
  validateSearch: (search) => usersSearchSchema.parse(search),
  component: UsersPage,
})
