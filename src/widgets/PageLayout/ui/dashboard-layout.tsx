import { Outlet } from '@tanstack/react-router'
import { Header } from '@/widgets/Header'
import { Sidebar } from '@/widgets/Sidebar'
import { MobileNav } from '@/widgets/MobileNav'
import { ErrorBoundary } from '@/shared/ui'

export const DashboardLayout = () => {
  return (
    <div className="bg-muted/30 min-h-screen touch-pan-y overscroll-y-none">
      <Sidebar className="fixed left-0 z-40 hidden w-64 md:top-16 md:block md:h-[calc(100vh-4rem)]" />
      <div className="flex flex-col">
        <Header />
        <main className="p-2 pb-20 transition-all md:ml-64 md:p-6">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
        <MobileNav />
      </div>
    </div>
  )
}
