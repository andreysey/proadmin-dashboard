import { LogOut, LayoutDashboard, Users, ClipboardList, Info } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/features/auth'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import { Link } from '@tanstack/react-router'

interface UserDropdownProps {
  children: React.ReactNode
}

export const UserDropdown = ({ children }: UserDropdownProps) => {
  const { t } = useTranslation()
  const { user, logout } = useAuthStore()

  if (!user) return <>{children}</>

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-3 transition-opacity outline-none hover:opacity-80">
          {children}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm leading-none font-medium">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-muted-foreground text-xs leading-none">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link
              to="/"
              search={{ dateRange: '7d', autoRefresh: false }}
              className="flex w-full cursor-pointer items-center"
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>{t('sidebar.dashboard')}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              to="/users"
              search={{ page: 1, limit: 10, sortOrder: 'desc' }}
              className="flex w-full cursor-pointer items-center"
            >
              <Users className="mr-2 h-4 w-4" />
              <span>{t('sidebar.users')}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/activity-log" className="flex w-full cursor-pointer items-center">
              <ClipboardList className="mr-2 h-4 w-4" />
              <span>{t('sidebar.activity_log')}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/about" className="flex w-full cursor-pointer items-center">
              <Info className="mr-2 h-4 w-4" />
              <span>{t('sidebar.about', 'About')}</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
          onClick={() => logout()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t('header.dropdown.logout', 'Log out')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
