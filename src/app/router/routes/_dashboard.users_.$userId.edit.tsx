import { EditUserPage } from '@/pages/edit-user'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/users_/$userId/edit')({
  component: EditUserPage,
})
