import { Outlet } from '@tanstack/react-router'
import { Header } from '@/widgets/Header'
import { Sidebar } from '@/widgets/Sidebar'
import { ErrorBoundary } from '@/shared/ui'

export const DashboardLayout = () => {
  return (
    <div className="bg-muted/30 min-h-screen">
      <Sidebar className="fixed left-0 z-40 hidden w-64 md:top-16 md:block md:h-[calc(100vh-4rem)]" />
      <div className="flex flex-col">
        <Header />
        <main className="p-6 transition-all md:ml-64">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  )
}
