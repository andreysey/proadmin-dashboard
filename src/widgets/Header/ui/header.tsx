import { LayoutDashboard, Menu, User } from 'lucide-react'
import { useAuthStore } from '@/features/auth'
import {
  LanguageSwitcher,
  ModeToggle,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from '@/shared/ui'
import { Sidebar } from '@/widgets/Sidebar'
import { UserDropdown } from '@/features/user-dropdown'
import { useState } from 'react'

import { useTranslation } from 'react-i18next'

export const Header = () => {
  const user = useAuthStore((state) => state.user)
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()

  return (
    <header className="bg-background/95 sticky top-0 z-50 flex h-16 w-full items-center border-b px-4 backdrop-blur">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center">
          <div className="hidden items-center md:flex md:w-64">
            <LayoutDashboard className="text-primary mr-2 h-6 w-6" />
            <span className="text-xl font-bold tracking-tight">{t('app.title', 'ProAdmin')}</span>
          </div>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button className="mr-4 md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <SheetHeader className="sr-only">
                <SheetTitle>{t('app.title')}</SheetTitle>
                <SheetDescription>Navigation Menu</SheetDescription>
              </SheetHeader>
              <Sidebar className="w-full border-none" onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <ModeToggle />
          <UserDropdown>
            <div className="flex items-center gap-3 border-l pl-4">
              <div className="hidden text-right sm:block">
                <p className="text-sm leading-none font-medium">
                  {user ? `${user.firstName} ${user.lastName}` : t('app.guest', 'Guest User')}
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                  {user?.email ?? 'guest@proadmin.com'}
                </p>
              </div>
              <div className="bg-primary/10 text-primary hover:ring-primary/20 flex h-8 w-8 items-center justify-center overflow-hidden rounded-full transition-shadow hover:ring-2">
                {user?.image ? (
                  <img
                    src={user.image}
                    alt={user.username}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-4 w-4" />
                )}
              </div>
            </div>
          </UserDropdown>
        </div>
      </div>
    </header>
  )
}
