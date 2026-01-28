import { DashboardLayout } from '@/widgets/PageLayout'
import { tokenStorage } from '@/shared/lib/auth'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard')({
  beforeLoad() {
    const isAuthenticated = tokenStorage.getAccessToken()
    if (!isAuthenticated) {
      throw redirect({ to: '/login' })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <DashboardLayout />
}
