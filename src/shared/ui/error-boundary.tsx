import { ErrorBoundary as ReactErrorBoundary, type FallbackProps } from 'react-error-boundary'
import type { ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from './button'

/**
 * Fallback UI displayed when an error is caught.
 * Shows error message in dev mode only.
 */
function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error'

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-8">
      <div className="bg-destructive/10 mb-6 rounded-full p-4">
        <AlertTriangle className="text-destructive h-12 w-12" />
      </div>

      <h2 className="text-foreground mb-2 text-xl font-semibold">Something went wrong</h2>

      <p className="text-muted-foreground mb-6 max-w-md text-center">
        An unexpected error occurred. Please try again or contact support if the problem persists.
      </p>

      {import.meta.env.DEV && (
        <pre className="bg-muted mb-6 max-w-lg overflow-auto rounded-md p-4 text-sm">
          {errorMessage}
        </pre>
      )}

      <Button onClick={resetErrorBoundary} variant="outline">
        <RefreshCw className="mr-2 h-4 w-4" />
        Try Again
      </Button>
    </div>
  )
}

interface ErrorBoundaryProps {
  children: ReactNode
}

/**
 * Global Error Boundary wrapper using react-error-boundary.
 * Catches runtime errors in children and displays fallback UI.
 */
export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, info) => {
        // Log to console in dev, could send to monitoring service in production
        console.error('ErrorBoundary caught an error:', error, info)
      }}
    >
      {children}
    </ReactErrorBoundary>
  )
}
