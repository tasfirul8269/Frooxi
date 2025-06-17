import { Outlet } from "react-router-dom"
import { AdminNav } from "./AdminNav"
import { MobileNav } from "./MobileNav"

type AdminLayoutProps = {
  children?: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <MobileNav />
      <div className="flex h-[calc(100vh-4rem)]">
        <AdminNav />
        <div className="flex-1 overflow-auto">
          <main className="flex-1 p-4 md:p-8">
            {children || <Outlet />}
          </main>
        </div>
      </div>
    </div>
  )
}
