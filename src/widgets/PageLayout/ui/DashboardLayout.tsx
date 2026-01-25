import { Outlet } from '@tanstack/react-router'
import { Header } from '@/widgets/Header'
import { Sidebar } from '@/widgets/Sidebar'

export const DashboardLayout = () => {
  return (
    <div className="bg-muted/30 min-h-screen">
      <Sidebar />
      <div className="flex flex-col">
        <Header />
        <main className="ml-64 p-6 transition-all">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
