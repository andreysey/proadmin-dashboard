import { format, formatDistanceToNow, parseISO, type Locale } from 'date-fns'
import { enUS, de } from 'date-fns/locale'
import i18next from 'i18next'

const locales: Record<string, Locale> = {
  en: enUS,
  de: de,
}

const getLocale = () => {
  const lang = i18next.language?.split('-')[0] || 'en'
  return locales[lang] || enUS
}

/**
 * Formats a date string or object into a human-readable format.
 * @example "Oct 24, 2023" or "24.10.2023" depending on locale
 */
export const formatDate = (date: string | Date, formatStr = 'PP') => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, formatStr, { locale: getLocale() })
}

/**
 * Formats a date as a relative time from now.
 * @example "2 minutes ago", "vor 5 Minuten"
 */
export const formatRelativeTime = (date: string | Date) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return formatDistanceToNow(dateObj, {
    addSuffix: true,
    locale: getLocale(),
  })
}

/**
 * Formats a date with time.
 * @example "Oct 24, 2023, 10:30 AM"
 */
export const formatDateTime = (date: string | Date) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, 'Pp', { locale: getLocale() })
}
