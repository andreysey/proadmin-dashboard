import { UserList } from '@/features/users-list'
import { Route } from '@/app/router/routes/_dashboard.users'
import { Input } from '@/shared/ui/input'
import { useEffect, useState } from 'react'

export const UsersPage = () => {
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
        search: (prev) => ({ ...prev, q: search || undefined, skip: 0 }), // Reset skip on search
      })
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [search, navigate, q])

  const handlePageChange = (newSkip: number) => {
    navigate({
      search: (prev) => ({ ...prev, skip: newSkip }),
    })
  }

  const handleSortChange = (newSortBy: string | undefined, newOrder: 'asc' | 'desc') => {
    navigate({
      search: (prev) => ({
        ...prev,
        sortBy: newSortBy,
        order: newOrder,
        skip: 0, // Reset pagination on sort
      }),
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <div className="w-72">
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <UserList
        skip={skip}
        limit={limit}
        q={q}
        sortBy={sortBy}
        order={order}
        onPageChange={handlePageChange}
        onSortChange={handleSortChange}
      />
    </div>
  )
}
