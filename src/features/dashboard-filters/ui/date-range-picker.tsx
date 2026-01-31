import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui'
import { Calendar } from 'lucide-react'
import type { DateRangeValue } from '../model/schema'

interface DateRangePickerProps {
  value: DateRangeValue
  onChange: (value: DateRangeValue) => void
}

const DATE_RANGE_OPTIONS: { value: DateRangeValue; label: string }[] = [
  { value: '24h', label: 'Last 24 Hours' },
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
]

/**
 * Date range filter component.
 * Uses shadcn/ui Select (Radix).
 *
 * Note: This is a "controlled" component - parent manages the state.
 * The actual state lives in URL (via TanStack Router).
 */
export const DateRangePicker = ({ value, onChange }: DateRangePickerProps) => {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as DateRangeValue)}>
      <SelectTrigger className="w-[180px]">
        <Calendar className="mr-2 h-4 w-4" />
        <SelectValue placeholder="Select range" />
      </SelectTrigger>
      <SelectContent>
        {DATE_RANGE_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
