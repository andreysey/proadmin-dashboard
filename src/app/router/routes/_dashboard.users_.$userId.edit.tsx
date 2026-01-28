import { checkPermission } from '@/entities/user'
import { useAuthStore } from '@/features/auth'
import { EditUserPage } from '@/pages/edit-user'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/users_/$userId/edit')({
  beforeLoad() {
    const user = useAuthStore.getState().user

    if (!checkPermission(user, 'users:edit')) {
      throw redirect({ to: '/' })
    }
  },
  component: EditUserPage,
})
