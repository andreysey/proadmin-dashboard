import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { UsersPage } from '@/pages/users'

const usersSearchSchema = z.object({
  skip: z.number().optional().default(0),
  limit: z.number().optional().default(10),
  q: z.string().optional(),
  sortBy: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional().default('asc'),
})

export const Route = createFileRoute('/_dashboard/users')({
  validateSearch: (search) => usersSearchSchema.parse(search),
  component: UsersPage,
})
