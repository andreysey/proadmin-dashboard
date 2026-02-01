import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { FileQuestion, Home } from 'lucide-react'
import { Button } from './button'

/**
 * 404 Not Found page for invalid routes.
 * Displayed by TanStack Router when no route matches.
 */
export function NotFound() {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="bg-muted mb-6 rounded-full p-4">
        <FileQuestion className="text-muted-foreground h-16 w-16" />
      </div>

      <h1 className="text-foreground mb-2 text-4xl font-bold">{t('common.not_found.title')}</h1>

      <h2 className="text-foreground mb-4 text-xl font-semibold">
        {t('common.not_found.subtitle')}
      </h2>

      <p className="text-muted-foreground mb-8 max-w-md text-center">
        {t('common.not_found.desc')}
      </p>

      <Button asChild>
        <Link to="/" search={{ dateRange: '7d', autoRefresh: false }}>
          <Home className="mr-2 h-4 w-4" />
          {t('common.not_found.home')}
        </Link>
      </Button>
    </div>
  )
}
