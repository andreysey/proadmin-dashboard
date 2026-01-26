import { UserList } from '@/features/users-list'
import { Route } from '@/app/router/routes/_dashboard.users'

export const UsersPage = () => {
  const { skip, limit } = Route.useSearch()
  const navigate = Route.useNavigate()

  const handlePageChange = (newSkip: number) => {
    navigate({
      search: (prev) => ({ ...prev, skip: newSkip }),
    })
  }

  return <UserList skip={skip} limit={limit} onPageChange={handlePageChange} />
}
