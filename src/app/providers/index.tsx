import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'

interface ProvidersProps {
  children: ReactNode
}

/**
 * Providers (Global Providers)
 *
 * In FSD, the app layer is responsible for initializing global logic.
 * This component wraps the app in all necessary contexts.
 */
export const Providers = ({ children }: ProvidersProps) => {
  // We initialize the QueryClient here ensuring it's only created once
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Sensible defaults for a dashboard
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 1000 * 60 * 5, // 5 minutes
          },
        },
      })
  )

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
