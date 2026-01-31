import { createRootRoute, Outlet, useNavigate, useRouterState } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { useAuthStore } from '@/features/auth'
import { NotFound } from '@/shared/ui'
import { useEffect } from 'react'

const RootComponent = () => {
  const navigate = useNavigate()
  const { location } = useRouterState()
  const user = useAuthStore((state) => state.user)

  useEffect(() => {
    if (!user && location.pathname !== '/login') {
      navigate({ to: '/login', replace: true })
    }
  }, [user, navigate, location.pathname])

  return (
    <>
      <Outlet />
      {import.meta.env.DEV && <TanStackRouterDevtools position="bottom-right" />}
    </>
  )
}

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFound,
})
