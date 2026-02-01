import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider } from '@tanstack/react-router'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { useState, useEffect, type ReactNode } from 'react'
import React from 'react'
import ReactDOM from 'react-dom'

import { router } from '../router'
import { Toaster } from '@/shared/ui'
import { ThemeProvider } from '@/shared/lib'

interface ProvidersProps {
  children?: ReactNode
}

export const Providers = ({ children }: ProvidersProps) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 1000 * 60 * 5,
          },
        },
      })
  )

  useEffect(() => {
    if (import.meta.env.DEV) {
      import('@axe-core/react').then((axe) => {
        axe.default(React, ReactDOM, 3000)
      })
    }
  }, [])

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster position="top-center" closeButton richColors />
        <Analytics />
        <SpeedInsights />
        <ReactQueryDevtools />
        {children}
      </QueryClientProvider>
    </ThemeProvider>
  )
}
