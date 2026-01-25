import { createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { DashboardLayout } from '@/widgets/PageLayout'

export const Route = createRootRoute({
  beforeLoad: async ({ location }) => {
    const isAuthenticated = !!localStorage.getItem('token')

    // Simple mock auth guard: redirect to a "login" route if not authenticated
    // Note: We'll need to create a login route later.
    // For now, let's just log it or allow if there's no login route yet.
    if (!isAuthenticated && location.pathname !== '/login') {
      // For now, we just log a warning until we have a real login page
      console.warn('Authentication required to access:', location.pathname)
      // redirect({ to: '/login' }) // Uncomment when login is ready
    }
  },
  component: () => (
    <>
      <DashboardLayout />
      {import.meta.env.DEV && <TanStackRouterDevtools position="bottom-right" />}
    </>
  ),
})
