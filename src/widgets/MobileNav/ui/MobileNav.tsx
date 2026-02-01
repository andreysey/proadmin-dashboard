import { Link } from '@tanstack/react-router'
import { Home, Users, Info } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib/utils'

interface MobileNavProps {
  className?: string
}

export const MobileNav = ({ className }: MobileNavProps) => {
  const { t } = useTranslation()

  const navItems = [
    {
      to: '/',
      label: t('sidebar.dashboard'),
      icon: Home,
      search: { dateRange: '7d' as const, autoRefresh: false },
    },
    {
      to: '/users',
      label: t('sidebar.users'),
      icon: Users,
      search: { skip: 0, limit: 10, order: 'asc' as const },
    },
    {
      to: '/about',
      label: t('sidebar.about'),
      icon: Info,
    },
  ]

  return (
    <nav
      className={cn(
        'bg-background/80 border-border pb-safe fixed bottom-0 left-0 z-50 flex h-16 w-full items-center justify-around border-t px-2 backdrop-blur-lg md:hidden',
        className
      )}
    >
      {navItems.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          search={item.search}
          className="group relative flex flex-1 flex-col items-center justify-center gap-1 transition-all duration-200 active:scale-95"
        >
          {({ isActive }) => (
            <>
              <div
                className={cn(
                  'flex h-8 w-12 items-center justify-center rounded-full transition-colors duration-300',
                  isActive ? 'bg-primary/20' : 'group-hover:bg-muted'
                )}
              >
                <item.icon
                  className={cn(
                    'h-5 w-5 transition-all duration-300',
                    isActive ? 'text-primary scale-110' : 'text-muted-foreground'
                  )}
                />
              </div>
              <span
                className={cn(
                  'text-[10px] font-medium transition-colors duration-300',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {item.label}
              </span>
              {isActive && (
                <div className="bg-primary absolute -top-[1px] h-[2px] w-6 rounded-full shadow-[0_0_8px_rgba(var(--primary),0.6)]" />
              )}
            </>
          )}
        </Link>
      ))}
    </nav>
  )
}
