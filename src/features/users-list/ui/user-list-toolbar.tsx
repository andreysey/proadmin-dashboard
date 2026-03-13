import { Button, Input } from '@/shared/ui'
import { useTranslation } from 'react-i18next'

interface UserListToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  page: number
  limit: number
  total: number
  onPageChange?: (newPage: number) => void
}

export const UserListToolbar = ({
  search,
  onSearchChange,
  page,
  limit,
  total,
  onPageChange,
}: UserListToolbarProps) => {
  const { t } = useTranslation()
  const hasNextPage = page * limit < total
  const hasPrevPage = page > 1

  return (
    <div className="flex items-center justify-between px-2">
      <div className="w-72">
        <Input
          aria-label={t('users.search_placeholder')}
          placeholder={t('users.search_placeholder')}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange?.(Math.max(1, page - 1))}
          disabled={!hasPrevPage}
        >
          {t('users.pagination.previous')}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange?.(page + 1)}
          disabled={!hasNextPage}
        >
          {t('users.pagination.next')}
        </Button>
      </div>
    </div>
  )
}
