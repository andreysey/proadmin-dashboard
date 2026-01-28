import { User } from 'lucide-react'
import { useAuthStore } from '@/features/auth'

export const Header = () => {
  const user = useAuthStore((state) => state.user)

  return (
    <header className="bg-background/95 sticky top-0 z-30 flex h-16 w-full items-center border-b px-4 backdrop-blur">
      <div className="ml-64 flex w-full items-center justify-between">
        <div className="flex items-center" />

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 border-l pl-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm leading-none font-medium">
                {user ? `${user.firstName} ${user.lastName}` : 'Guest User'}
              </p>
              <p className="text-muted-foreground mt-1 text-xs">
                {user?.email ?? 'guest@proadmin.com'}
              </p>
            </div>
            <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center overflow-hidden rounded-full">
              {user?.image ? (
                <img src={user.image} alt={user.username} className="h-full w-full object-cover" />
              ) : (
                <User className="h-4 w-4" />
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
