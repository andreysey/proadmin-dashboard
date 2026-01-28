import { LoginPage } from '@/pages/login'
import { tokenStorage } from '@/shared/lib/auth'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  beforeLoad() {
    const isAuthenticated = tokenStorage.getAccessToken()

    if (isAuthenticated) {
      throw redirect({ to: '/' })
    }
  },
  component: LoginPage,
})
