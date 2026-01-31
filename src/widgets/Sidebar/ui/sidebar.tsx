import { useAuthStore } from '@/features/auth'
import { Link } from '@tanstack/react-router'
import { Home, Info, LayoutDashboard, LogOut, Users } from 'lucide-react'

export const Sidebar = () => {
  const logout = useAuthStore((state) => state.logout)

  return (
    <aside className="bg-background fixed top-0 left-0 z-40 h-screen w-64 border-r transition-transform">
      <div className="flex h-full flex-col px-3 py-4">
        <div className="mb-10 flex items-center px-2">
          <LayoutDashboard className="text-primary mr-2 h-8 w-8" />
          <span className="text-xl font-bold tracking-tight">ProAdmin</span>
        </div>

        <nav className="flex-1 space-y-1">
          <Link
            to="/"
            search={{ dateRange: '7d', autoRefresh: false }}
            className="group text-foreground hover:bg-accent [&.active]:bg-primary/10 [&.active]:text-primary flex items-center rounded-lg p-2"
          >
            <Home className="group-hover:text-primary h-5 w-5 transition duration-75" />
            <span className="ml-3">Dashboard</span>
          </Link>

          <Link
            to="/users"
            search={{ skip: 0, limit: 10, order: 'asc' }}
            className="group text-foreground hover:bg-accent [&.active]:bg-primary/10 [&.active]:text-primary flex items-center rounded-lg p-2"
          >
            <Users className="group-hover:text-primary h-5 w-5 transition duration-75" />
            <span className="ml-3">Users</span>
          </Link>

          <Link
            to="/about"
            className="group text-foreground hover:bg-accent [&.active]:bg-primary/10 [&.active]:text-primary flex items-center rounded-lg p-2"
          >
            <Info className="group-hover:text-primary h-5 w-5 transition duration-75" />
            <span className="ml-3">About</span>
          </Link>
        </nav>

        <div className="mt-auto border-t pt-4">
          <button
            onClick={() => {
              logout()
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
