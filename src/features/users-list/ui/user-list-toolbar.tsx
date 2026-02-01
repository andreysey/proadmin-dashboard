import { Button, Input } from '@/shared/ui'

interface UserListToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  skip: number
  limit: number
  total: number
  onPageChange?: (newSkip: number) => void
}

export const UserListToolbar = ({
  search,
  onSearchChange,
  skip,
  limit,
  total,
  onPageChange,
}: UserListToolbarProps) => {
  const hasNextPage = skip + limit < total
  const hasPrevPage = skip > 0

  return (
    <div className="flex items-center justify-between px-2">
      <div className="w-72">
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange?.(Math.max(0, skip - limit))}
          disabled={!hasPrevPage}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange?.(skip + limit)}
          disabled={!hasNextPage}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
