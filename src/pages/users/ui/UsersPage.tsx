import { UserList } from '@/features/users-list'
import { Route } from '@/app/router/routes/_dashboard.users'
import { Input } from '@/shared/ui/input'
import { useEffect, useState } from 'react'

export const UsersPage = () => {
  const { skip, limit, q } = Route.useSearch()
  const navigate = Route.useNavigate()
  const [search, setSearch] = useState(q ?? '')
  const [prevQ, setPrevQ] = useState(q)

  // Sync local state with URL param (render-time adjustment)
  // This avoids cascading renders from useEffect
  if (q !== prevQ) {
    setPrevQ(q)
    setSearch(q ?? '')
  }

  // Debounce search update
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

      <UserList skip={skip} limit={limit} q={q} onPageChange={handlePageChange} />
    </div>
  )
}
