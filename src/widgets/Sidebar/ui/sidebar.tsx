import { useAuthStore } from '@/features/auth'
import { Link } from '@tanstack/react-router'
import { Home, Info, LayoutDashboard, LogOut, Users } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

interface SidebarProps {
  className?: string
  onNavigate?: () => void
}

export const Sidebar = ({ className, onNavigate }: SidebarProps) => {
  const logout = useAuthStore((state) => state.logout)

  const handleNavigate = () => {
    onNavigate?.()
  }

  return (
    <aside className={cn('bg-background border-r transition-transform', className)}>
      <div className="flex h-full flex-col px-3 py-4">
        <div className="mb-10 flex items-center px-2 md:hidden">
          <LayoutDashboard className="text-primary mr-2 h-8 w-8" />
          <span className="text-xl font-bold tracking-tight">ProAdmin</span>
        </div>

        <nav className="flex-1 space-y-1">
          <Link
            to="/"
            search={{ dateRange: '7d', autoRefresh: false }}
            className="group text-foreground hover:bg-accent [&.active]:bg-primary/10 [&.active]:text-primary flex items-center rounded-lg p-2"
            onClick={handleNavigate}
          >
            <Home className="group-hover:text-primary h-5 w-5 transition duration-75" />
            <span className="ml-3">Dashboard</span>
          </Link>

          <Link
            to="/users"
            search={{ skip: 0, limit: 10, order: 'asc' }}
            className="group text-foreground hover:bg-accent [&.active]:bg-primary/10 [&.active]:text-primary flex items-center rounded-lg p-2"
            onClick={handleNavigate}
          >
            <Users className="group-hover:text-primary h-5 w-5 transition duration-75" />
            <span className="ml-3">Users</span>
          </Link>

          <Link
            to="/about"
            className="group text-foreground hover:bg-accent [&.active]:bg-primary/10 [&.active]:text-primary flex items-center rounded-lg p-2"
            onClick={handleNavigate}
          >
            <Info className="group-hover:text-primary h-5 w-5 transition duration-75" />
            <span className="ml-3">About</span>
          </Link>
        </nav>

        <div className="mt-auto border-t pt-4">
          <button
            onClick={() => {
              logout()
              handleNavigate()
            }}
            className="group text-foreground hover:bg-destructive/10 hover:text-destructive flex w-full items-center rounded-lg p-2 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
