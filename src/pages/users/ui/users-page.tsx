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

  const { skip, limit, q, sortBy, order } = Route.useSearch()
  const navigate = Route.useNavigate()
  const [search, setSearch] = useState(q ?? '')
  const [prevQ, setPrevQ] = useState(q)

  // ... (keep previous q sync logic)
  if (q !== prevQ) {
    setPrevQ(q)
    setSearch(q ?? '')
  }

  // ... (keep search debounce logic)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (search === (q ?? '')) return

      navigate({
        search: (prev: import('@/app/router/routes/_dashboard.users').UsersSearch) => ({
          ...prev,
          q: search || undefined,
          skip: 0,
        }), // Reset skip on search
      })
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [search, navigate, q])

  const handlePageChange = (newSkip: number) => {
    navigate({
      search: (prev: import('@/app/router/routes/_dashboard.users').UsersSearch) => ({
        ...prev,
        skip: newSkip,
      }),
    })
  }

  const handleSortChange = (newSortBy: string | undefined, newOrder: 'asc' | 'desc') => {
    navigate({
      search: (prev: import('@/app/router/routes/_dashboard.users').UsersSearch) => ({
        ...prev,
        sortBy: newSortBy,
        order: newOrder,
        skip: 0, // Reset pagination on sort
      }),
    })
  }

  return (
    <div className="relative space-y-4 p-4 md:p-0">
      <RefreshIndicator pullDistance={pullDistance} isRefreshing={isPTR} isDragging={isDragging} />
      <UserList
        skip={skip}
        limit={limit}
        q={q}
        sortBy={sortBy}
        order={order}
        onPageChange={handlePageChange}
        onSortChange={handleSortChange}
        search={search}
        onSearchChange={setSearch}
      />
    </div>
  )
}
