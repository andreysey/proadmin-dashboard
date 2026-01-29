import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { RouterPendingComponent } from './ui/router-pending'

export const router = createRouter({
  routeTree,
  defaultPendingComponent: RouterPendingComponent,
  defaultPendingMinMs: 200, // Only show if loading takes > 200ms
  defaultPreload: 'intent', // Preload route on hover for instant navigation
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
