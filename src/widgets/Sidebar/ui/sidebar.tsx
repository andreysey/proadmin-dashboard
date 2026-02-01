import { SOCIAL_LINKS } from '@/shared/config'
import { Home, Info, LayoutDashboard, LogOut, Users, Github, Linkedin } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib/utils'
import { useAuthStore } from '@/features/auth'
import { Link } from '@tanstack/react-router'

interface SidebarProps {
  className?: string
  onNavigate?: () => void
}

export const Sidebar = ({ className, onNavigate }: SidebarProps) => {
  const logout = useAuthStore((state) => state.logout)
  const { t } = useTranslation()

  const handleNavigate = () => {
    onNavigate?.()
  }

  return (
    <aside className={cn('bg-background border-r transition-transform', className)}>
      <div className="flex h-full flex-col px-3 py-4">
        <div className="mb-10 flex items-center px-2 md:hidden">
          <LayoutDashboard className="text-primary mr-2 h-8 w-8" />
          <span className="text-xl font-bold tracking-tight">{t('app.title')}</span>
        </div>

        <nav className="flex-1 space-y-1">
          <Link
            to="/"
            search={{ dateRange: '7d', autoRefresh: false }}
            className="group text-foreground hover:bg-accent [&.active]:bg-primary/10 [&.active]:text-primary flex items-center rounded-lg p-2"
            onClick={handleNavigate}
          >
            <Home className="group-hover:text-primary h-5 w-5 transition duration-75" />
            <span className="ml-3">{t('sidebar.dashboard')}</span>
          </Link>

          <Link
            to="/users"
            search={{ skip: 0, limit: 10, order: 'asc' }}
            className="group text-foreground hover:bg-accent [&.active]:bg-primary/10 [&.active]:text-primary flex items-center rounded-lg p-2"
            onClick={handleNavigate}
          >
            <Users className="group-hover:text-primary h-5 w-5 transition duration-75" />
            <span className="ml-3">{t('sidebar.users')}</span>
          </Link>

          <Link
            to="/about"
            className="group text-foreground hover:bg-accent [&.active]:bg-primary/10 [&.active]:text-primary flex items-center rounded-lg p-2"
            onClick={handleNavigate}
          >
            <Info className="group-hover:text-primary h-5 w-5 transition duration-75" />
            <span className="ml-3">{t('sidebar.about', 'About')}</span>
          </Link>
        </nav>

        <div className="mt-auto border-t pt-4">
          <div className="mb-2 space-y-1 border-b pb-4">
            <a
              href={SOCIAL_LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group text-foreground hover:bg-accent flex w-full items-center rounded-lg p-2 transition-colors"
            >
              <Github className="group-hover:text-primary h-5 w-5 transition-colors" />
              <span className="ml-3">{t('about.connect.github')}</span>
            </a>
            <a
              href={SOCIAL_LINKS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group text-foreground hover:bg-accent flex w-full items-center rounded-lg p-2 transition-colors"
            >
              <Linkedin className="h-5 w-5 transition-colors group-hover:text-[#0077b5]" />
              <span className="ml-3">{t('about.connect.linkedin')}</span>
            </a>
          </div>
          <button
            onClick={() => {
              logout()
              handleNavigate()
            }}
            className="group text-foreground hover:bg-destructive/10 hover:text-destructive flex w-full items-center rounded-lg p-2 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="ml-3">{t('common.logout', 'Logout')}</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
