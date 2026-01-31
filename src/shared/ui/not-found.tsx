import { Link } from '@tanstack/react-router'
import { FileQuestion, Home } from 'lucide-react'
import { Button } from './button'

/**
 * 404 Not Found page for invalid routes.
 * Displayed by TanStack Router when no route matches.
 */
export function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="bg-muted mb-6 rounded-full p-4">
        <FileQuestion className="text-muted-foreground h-16 w-16" />
      </div>

      <h1 className="text-foreground mb-2 text-4xl font-bold">404</h1>

      <h2 className="text-foreground mb-4 text-xl font-semibold">Page not found</h2>

      <p className="text-muted-foreground mb-8 max-w-md text-center">
        The page you're looking for doesn't exist or has been moved.
      </p>

      <Button asChild>
        <Link to="/" search={{ dateRange: '7d', autoRefresh: false }}>
          <Home className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>
    </div>
  )
}
