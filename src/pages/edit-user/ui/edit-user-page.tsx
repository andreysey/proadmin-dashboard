import { useNavigate, useParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getUserById } from '@/entities/user/api/user.api'
import { UserForm, useUpdateUser } from '@/features/edit-user'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import type { User } from '@/entities/user/model/types'

export const EditUserPage = () => {
  const { userId } = useParams({ from: '/_dashboard/users_/$userId/edit' })
  const navigate = useNavigate()
  const { mutate: update, isPending: isUpdating } = useUpdateUser()

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['users', Number(userId)],
    queryFn: () => getUserById(Number(userId)),
  })

  const handleSubmit = (data: Partial<User>) => {
    update(
      { id: Number(userId), data },
      {
        onSuccess: () => {
          navigate({
            to: '/users',
            search: {
              skip: 0,
              limit: 10,
              order: 'asc',
            },
          })
        },
      }
    )
  }

  if (isLoading) return <div className="p-8 text-center">Loading user data...</div>
  if (isError) return <div className="text-destructive p-8 text-center">Error loading user</div>

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>
            Edit User: {user?.firstName} {user?.lastName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <UserForm
            initialData={user}
            onSubmit={handleSubmit}
            isLoading={isUpdating}
            onCancel={() =>
              navigate({
                to: '/users',
                search: {
                  skip: 0,
                  limit: 10,
                  order: 'asc',
                  q: undefined,
                },
              })
            }
          />
        </CardContent>
      </Card>
    </div>
  )
}
