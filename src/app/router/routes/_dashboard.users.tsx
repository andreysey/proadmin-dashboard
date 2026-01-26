import { UsersPage } from '@/pages/users'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const usersSearchSchema = z.object({
  skip: z.number().optional().default(0),
  limit: z.number().optional().default(10),
})

export const Route = createFileRoute('/_dashboard/users')({
  validateSearch: (search) => usersSearchSchema.parse(search),
  component: UsersPage,
})
