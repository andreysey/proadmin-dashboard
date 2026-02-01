import type { User } from '@/entities/user/model/types'
import { ProtectedAction } from '@/features/auth'
import { DeleteUserButton } from '@/features/delete-user'
import { Button, Card, CardContent, Checkbox } from '@/shared/ui'
import { Link } from '@tanstack/react-router'
import type { Table } from '@tanstack/react-table'
import { Edit } from 'lucide-react'

interface UserListMobileProps {
  table: Table<User>
}

export const UserListMobile = ({ table }: UserListMobileProps) => {
  return (
    <div className="space-y-4 md:hidden">
      {table.getRowModel().rows.map((row) => (
        <Card key={row.id}>
          <CardContent className="space-y-4 p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <Checkbox
                  checked={row.getIsSelected()}
                  onChange={row.getToggleSelectedHandler()}
                  aria-label="Select row"
                  className="shrink-0"
                />
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  {row.original.image ? (
                    <img
                      src={row.original.image}
                      alt={`${row.original.firstName} ${row.original.lastName}`}
                      className="h-10 w-10 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <div className="bg-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                      <span className="text-muted-foreground text-sm font-medium">
                        {row.original.firstName[0]}
                        {row.original.lastName[0]}
                      </span>
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">
                      {row.original.firstName} {row.original.lastName}
                    </p>
                    <p className="text-muted-foreground truncate text-xs">{row.original.email}</p>
                  </div>
                </div>
              </div>
              <span className="bg-primary/10 text-primary ring-primary/20 inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ring-inset">
                {row.original.role}
              </span>
            </div>
            <div className="border-border flex items-center justify-between border-t pt-4">
              <div className="text-muted-foreground text-xs">
                <span className="font-medium">ID:</span> {row.original.id}
              </div>
              <div className="flex items-center gap-2">
                <ProtectedAction permission="users:edit">
                  <Link
                    to="/users/$userId/edit"
                    params={{ userId: row.original.id.toString() }}
                    className="w-full"
                  >
                    <Button variant="outline" size="sm" className="h-8 w-full gap-2">
                      <Edit className="h-3.5 w-3.5" />
                      Edit
                    </Button>
                  </Link>
                </ProtectedAction>
                <ProtectedAction permission="users:delete">
                  <DeleteUserButton userId={row.original.id} />
                </ProtectedAction>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
