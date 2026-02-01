import { LogOut, Settings, User as UserIcon } from 'lucide-react'
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
            <Link to="/about" className="flex w-full cursor-pointer items-center">
              <UserIcon className="mr-2 h-4 w-4" />
              <span>{t('header.dropdown.profile', 'Profile')}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/about" className="flex w-full cursor-pointer items-center">
              <Settings className="mr-2 h-4 w-4" />
              <span>{t('header.dropdown.settings', 'Settings')}</span>
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
