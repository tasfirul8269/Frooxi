import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { PanelLeft, X } from "lucide-react"
import { useTheme } from "@/contexts/ThemeContext"

const navItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: "LayoutDashboard"
  },
  {
    title: "Portfolio",
    href: "/admin/portfolio",
    icon: "Briefcase"
  },
  {
    title: "Subscriptions",
    href: "/admin/subscriptions",
    icon: "CreditCard"
  },
  {
    title: "Testimonials",
    href: "/admin/testimonials",
    icon: "Star"
  },
  {
    title: "Team",
    href: "/admin/team",
    icon: "Users"
  },
  {
    title: "Admins",
    href: "/admin/users",
    icon: "UserCog"
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: "Settings"
  }
]

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6 md:hidden">
      <Button
        variant="outline"
        size="icon"
        className="shrink-0 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <PanelLeft className="h-5 w-5" />
        )}
        <span className="sr-only">Toggle navigation menu</span>
      </Button>
      
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
          <div 
            className="fixed left-0 top-0 h-full w-3/4 border-r bg-background p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-semibold">Frooxi Admin</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-5 w-5" />
                <span className="sr-only">Close menu</span>
              </Button>
            </div>
            <nav className="grid gap-1">
              {navItems.map((item) => {
                const Icon = require(`lucide-react`)[item.icon] || 'div'
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                      location.pathname === item.href ? "bg-muted text-primary" : ""
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                )
              })}
            </nav>
            <div className="mt-8">
              <Button variant="outline" className="w-full justify-start gap-2" onClick={toggleTheme}>
                {theme === 'dark' ? (
                  <>
                    <span className="h-4 w-4">☀️</span>
                    Light Mode
                  </>
                ) : (
                  <>
                    <span className="h-4 w-4">🌙</span>
                    Dark Mode
                  </>
                )}
              </Button>
              <Button variant="outline" className="mt-2 w-full justify-start gap-2">
                <span className="h-4 w-4">🚪</span>
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
