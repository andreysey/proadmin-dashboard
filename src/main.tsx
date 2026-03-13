import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Providers } from './app/providers'
import './app/styles/index.css'
import { setForbiddenHandler, setUnauthorizedHandler } from './shared/api'
import { useAuthStore } from './features/auth'
import { router } from './app'
import { initSentry } from './shared/config/sentry'
import './shared/config/i18n'

initSentry()

setUnauthorizedHandler(() => {
  useAuthStore.getState().logout()
})

setForbiddenHandler(() => {
  // For now, just redirect to home. Later we can add a Toast notification.
  router.navigate({
    to: '/',
    search: { dateRange: '7d', autoRefresh: false },
  })
})

async function enableMocking() {
  // Only enable mocks if explicitly requested via env variable
  if (import.meta.env.VITE_ENABLE_MOCKS !== 'true') {
    return
  }

  const { worker } = await import('./app/mocks/browser')

  // On production, we need to register the Service Worker explicitly
  // because Vite's dev server handles it differently.
  return worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: '/mockServiceWorker.js',
    },
  })
}

enableMocking().then(async () => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Providers />
    </StrictMode>
  )
})
