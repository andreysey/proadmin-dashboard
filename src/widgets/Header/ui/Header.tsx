import { Bell, Search, User } from 'lucide-react'

export const Header = () => {
  return (
    <header className="bg-background/95 sticky top-0 z-30 flex h-16 w-full items-center border-b px-4 backdrop-blur">
      <div className="ml-64 flex w-full items-center justify-between">
        <div className="flex items-center">
          <div className="relative hidden md:block">
            <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
            <input
              type="search"
              placeholder="Search..."
              className="bg-muted focus:ring-primary/50 h-9 w-64 rounded-md border pr-4 pl-9 text-sm focus:ring-2 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-muted-foreground hover:bg-accent hover:text-foreground relative rounded-full p-2">
            <Bell className="h-5 w-5" />
            <span className="bg-destructive absolute top-2 right-2 h-2 w-2 rounded-full"></span>
          </button>

          <div className="flex items-center gap-3 border-l pl-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm leading-none font-medium">Admin User</p>
              <p className="text-muted-foreground mt-1 text-xs">admin@proadmin.com</p>
            </div>
            <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full">
              <User className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
