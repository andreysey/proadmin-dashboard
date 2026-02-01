import { Skeleton } from '@/shared/ui'

export const UserListSkeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="border-border bg-card w-full overflow-hidden rounded-lg border shadow-sm">
        <table className="text-muted-foreground w-full text-left text-sm">
          <thead className="bg-muted/50 text-foreground text-xs uppercase">
            <tr>
              {Array.from({ length: 6 }).map((_, i) => (
                <th key={i} className="px-6 py-3">
                  <Skeleton className="h-4 w-20" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-border bg-card divide-y">
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                <td className="px-6 py-4">
                  <Skeleton className="h-4 w-4" />
                </td>
                <td className="px-6 py-4">
                  <Skeleton className="h-4 w-8" />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="flex flex-col gap-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Skeleton className="h-4 w-32" />
                </td>
                <td className="px-6 py-4">
                  <Skeleton className="h-6 w-16 rounded-full" />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
