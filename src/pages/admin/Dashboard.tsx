import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, LineChart, PieChart, Users, Briefcase, Star, CreditCard, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getDashboardStats } from "@/lib/api/dashboardService"

interface DashboardStats {
  totalPortfolioItems: number;
  activeSubscriptions: number;
  totalTeamMembers: number;
  totalTestimonials: number;
  totalUsers?: number; // Added to match the stats being displayed
}

export default function Dashboard() {
  const navigate = useNavigate()
  
  // Fetch dashboard stats
  const { data: dashboardStats, isLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: getDashboardStats,
  })

  // Handle loading and error states
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  // Handle case when data is not available
  if (!dashboardStats) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Failed to load dashboard data</p>
      </div>
    )
  }

  const stats = [
    { 
      title: "Total Projects", 
      value: dashboardStats?.totalPortfolioItems?.toString() || "0", 
      icon: Briefcase, 
      change: "+0%" 
    },
    { 
      title: "Active Subscriptions", 
      value: dashboardStats?.activeSubscriptions?.toString() || "0", 
      icon: CreditCard, 
      change: "+0%" 
    },
    { 
      title: "Team Members", 
      value: dashboardStats?.totalUsers?.toString() || "0", 
      icon: Users, 
      change: "+0" 
    },
    { 
      title: "Testimonials", 
      value: dashboardStats?.totalTestimonials?.toString() || "0", 
      icon: Star, 
      change: "+0" 
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline">Export Report</Button>
          <Button onClick={() => navigate('/admin/analytics')} variant="outline">
            View Analytics
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <div className="flex items-center justify-center h-full">
              <LineChart className="h-6 w-6 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Revenue chart will be displayed here</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Project Categories</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <div className="flex items-center justify-center h-full">
              <PieChart className="h-6 w-6 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Project categories chart will be displayed here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
