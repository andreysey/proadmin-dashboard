import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Providers } from './app/providers'
import './app/styles/index.css'
import { setForbiddenHandler, setUnauthorizedHandler } from './shared/api'
import { useAuthStore } from './features/auth'
import { router } from './app'

setUnauthorizedHandler(() => {
  useAuthStore.getState().logout()
})

setForbiddenHandler(() => {
  // For now, just redirect to home. Later we can add a Toast notification.
  router.navigate({ to: '/' })
})

async function enableMocking() {
  if (!import.meta.env.DEV) {
    return
  }

  const { worker } = await import('./mocks/browser')

  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and ready to intercept requests.
  return worker.start()
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Providers />
    </StrictMode>
  )
})
