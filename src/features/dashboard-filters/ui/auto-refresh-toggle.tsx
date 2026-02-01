import { Label } from '@/shared/ui'
import { useTranslation } from 'react-i18next'
import { RefreshCw } from 'lucide-react'

interface AutoRefreshToggleProps {
  enabled: boolean
  onChange: (enabled: boolean) => void
}

/**
 * Toggle for enabling/disabling auto-refresh.
 * Uses native HTML checkbox for simplicity with react-hook-form compatibility.
 *
 * When enabled, data will refetch every 30 seconds.
 */
export const AutoRefreshToggle = ({ enabled, onChange }: AutoRefreshToggleProps) => {
  const { t } = useTranslation()
  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        id="auto-refresh"
        checked={enabled}
        onChange={(e) => onChange(e.target.checked)}
        className="accent-primary h-4 w-4 cursor-pointer"
      />
      <Label htmlFor="auto-refresh" className="flex cursor-pointer items-center gap-1.5 text-sm">
        <RefreshCw className={`h-3.5 w-3.5 ${enabled ? 'animate-spin' : ''}`} />
        {t('dashboard.filters.auto_refresh')}
      </Label>
    </div>
  )
}
