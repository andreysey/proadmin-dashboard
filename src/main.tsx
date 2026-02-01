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
  if (import.meta.env.PROD && !import.meta.env.VITE_ENABLE_MOCKS) {
    // Optional: Add a flag if we ever want to disable it in prod
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

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Providers />
    </StrictMode>
  )
})
