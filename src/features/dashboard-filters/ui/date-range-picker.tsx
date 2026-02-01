import { useTranslation } from 'react-i18next'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui'
import { Calendar } from 'lucide-react'
import type { DateRangeValue } from '../model/schema'

interface DateRangePickerProps {
  value: DateRangeValue
  onChange: (value: DateRangeValue) => void
}

/**
 * Date range filter component.
 * Uses shadcn/ui Select (Radix).
 *
 * Note: This is a "controlled" component - parent manages the state.
 * The actual state lives in URL (via TanStack Router).
 */
export const DateRangePicker = ({ value, onChange }: DateRangePickerProps) => {
  const { t } = useTranslation()

  const options: { value: DateRangeValue; label: string }[] = [
    { value: '24h', label: t('dashboard.filters.date_range.24h') },
    { value: '7d', label: t('dashboard.filters.date_range.7d') },
    { value: '30d', label: t('dashboard.filters.date_range.30d') },
  ]

  return (
    <Select value={value} onValueChange={(v) => onChange(v as DateRangeValue)}>
      <SelectTrigger className="w-[180px]">
        <Calendar className="mr-2 h-4 w-4" />
        <SelectValue placeholder={t('dashboard.filters.date_range.placeholder')} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
