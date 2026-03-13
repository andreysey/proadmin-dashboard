import { UserList } from '@/features/users-list'
import { Route } from '@/app/router/routes/_dashboard.users'
import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { usePullToRefresh } from '@/shared/lib/hooks/use-pull-to-refresh'
import { RefreshIndicator } from '@/shared/ui'

export const UsersPage = () => {
  const queryClient = useQueryClient()
  const {
    pullDistance,
    isRefreshing: isPTR,
    isDragging,
  } = usePullToRefresh({
    onRefresh: async () => {
      await queryClient.refetchQueries({ queryKey: ['users'] })
    },
  })

  const { page, limit, search: q, sortBy, sortOrder } = Route.useSearch()
  const navigate = Route.useNavigate()
  const [search, setSearch] = useState(q ?? '')
  const [prevQ, setPrevQ] = useState(q)

  // Sync state with URL when it changes externally
  if (q !== prevQ) {
    setPrevQ(q)
    setSearch(q ?? '')
  }

  // Debounced search update to URL
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (search === (q ?? '')) return

      navigate({
        search: (prev: import('@/app/router/routes/_dashboard.users').UsersSearch) => ({
          ...prev,
          search: search || undefined,
          page: 1, // Reset to first page
        }),
      })
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [search, navigate, q])

  const handlePageChange = (newPage: number) => {
    navigate({
      search: (prev: import('@/app/router/routes/_dashboard.users').UsersSearch) => ({
        ...prev,
        page: newPage,
      }),
    })
  }

  const handleSortChange = (newSortBy: string | undefined, newSortOrder: 'asc' | 'desc') => {
    navigate({
      search: (prev: import('@/app/router/routes/_dashboard.users').UsersSearch) => ({
        ...prev,
        sortBy: newSortBy,
        sortOrder: newSortOrder,
        page: 1, // Reset to first page
      }),
    })
  }

  return (
    <div className="relative space-y-4 p-4 md:p-0">
      <RefreshIndicator pullDistance={pullDistance} isRefreshing={isPTR} isDragging={isDragging} />
      <UserList
        page={page}
        limit={limit}
        urlSearch={q}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onPageChange={handlePageChange}
        onSortChange={handleSortChange}
        search={search}
        onSearchChange={setSearch}
      />
    </div>
  )
}
