import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { 
  LogOut, 
  Moon, 
  Sun, 
  LayoutDashboard, 
  Briefcase, 
  CreditCard, 
  MessageSquare, 
  Users as UsersIcon, 
  UserCog, 
  Settings as SettingsIcon,
  Mail,
  DollarSign
} from "lucide-react"
import { useTheme } from "@/contexts/ThemeContext"

const navItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard
  },
  {
    title: "Portfolio",
    href: "/admin/portfolio",
    icon: Briefcase
  },
  {
    title: "Subscriptions",
    href: "/admin/subscriptions",
    icon: CreditCard
  },
  {
    title: "Testimonials",
    href: "/admin/testimonials",
    icon: MessageSquare
  },
  {
    title: "Messages",
    href: "/admin/messages",
    icon: Mail,
    badge: true
  },
  {
    title: "Team",
    href: "/admin/team",
    icon: UsersIcon
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: UserCog
  },
  {
    title: "Finance",
    href: "/admin/finance",
    icon: DollarSign
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: SettingsIcon
  }
]

export function AdminNav() {
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  
  return (
    <div className="hidden h-full border-r bg-muted/40 md:block">
      <div className="flex h-full flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link to="/admin" className="flex items-center gap-2 font-semibold">
            <span className="text-xl">Frooxi Admin</span>
          </Link>
          <Button variant="outline" size="icon" className="ml-auto h-8 w-8" onClick={toggleTheme}>
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <nav className="grid items-start px-2 py-4 text-sm font-medium lg:px-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  location.pathname === item.href ? "bg-muted text-primary" : ""
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <Button variant="outline" className="w-full justify-start gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}
