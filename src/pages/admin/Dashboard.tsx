import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Briefcase, Star, CreditCard, Loader2, TrendingUp, TrendingDown, DollarSign, Calendar, CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "@/lib/api/dashboardService";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfYear, 
  endOfYear, 
  subYears, 
  subMonths,
  startOfDay, 
  endOfDay, 
  eachDayOfInterval, 
  eachMonthOfInterval, 
  eachYearOfInterval, 
  parseISO 
} from "date-fns";
import { TransactionCharts } from "@/components/transactions/TransactionCharts";
import { getTransactionSummary, getTransactions, Transaction as TransactionType, TransactionSummary as APITransactionSummary } from "@/lib/api/transactionService";
import { DashboardStats } from "@/lib/api/dashboardService";
import { RevenueChart } from "@/components/admin/RevenueChart"
import { ProjectCategoriesChart } from "@/components/admin/ProjectCategoriesChart"

// Define the transaction summary types for the UI
interface TransactionDataPoint {
  name: string;
  income: number;
  expenses: number;
  date?: number; // For internal sorting
}

interface CategoryDataPoint {
  name: string;
  value: number;
  type?: 'income' | 'expense';
}

// Extend the API TransactionSummary with our UI-specific types
interface TransactionSummary extends Omit<APITransactionSummary, 'monthlyData' | 'categoryData'> {
  data: TransactionDataPoint[];
  categoryData: CategoryDataPoint[];
  monthlyData: APITransactionSummary['monthlyData'];
}

type DateRangeType = 'day' | 'month' | 'year';

// Define date range for transaction charts
const useTransactionCharts = () => {
  const { theme } = useTheme();
  const [dateRangeType, setDateRangeType] = useState<DateRangeType>('month');
  const [dateRange, setDateRange] = useState({
    startDate: format(startOfMonth(subMonths(new Date(), 5)), 'yyyy-MM-dd'),
    endDate: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
  });

  const updateDateRange = (type: DateRangeType) => {
    setDateRangeType(type);
    const now = new Date();
    
    switch (type) {
      case 'day':
        // Show all days of current month
        setDateRange({
          startDate: format(startOfMonth(now), 'yyyy-MM-dd'),
          endDate: format(endOfMonth(now), 'yyyy-MM-dd')
        });
        break;
      case 'month':
        // Show all months of current year
        setDateRange({
          startDate: format(startOfYear(now), 'yyyy-MM-dd'),
          endDate: format(endOfYear(now), 'yyyy-MM-dd')
        });
        break;
      case 'year':
        // Show last 5 years
        setDateRange({
          startDate: format(startOfYear(subYears(now, 4)), 'yyyy-MM-dd'),
          endDate: format(endOfYear(now), 'yyyy-MM-dd')
        });
        break;
    }
  };

    // Initialize default values for transaction summary
  const defaultTransactionSummary: TransactionSummary = {
    data: [],
    categoryData: [],
    income: 0,
    expenses: 0,
    balance: 0,
    monthlyData: [],
    totalTransactions: 0
  };

  // Fetch transaction summary data with proper typing
  const { data: transactionSummary, isLoading: isLoadingTransactions } = useQuery<TransactionSummary>({
    queryKey: ['transactionSummary', dateRange.startDate, dateRange.endDate, dateRangeType],
    queryFn: async (): Promise<TransactionSummary> => {
      try {
        // Fetch transactions for the selected date range
        const transactions = await getTransactions({
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
          limit: 1000 // Adjust based on your needs
        });

        // Generate date ranges based on the selected period
        const startDate = parseISO(dateRange.startDate);
        const endDate = parseISO(dateRange.endDate);
        
        // Create an array of all dates/months/years in the range
        let datePoints: Date[] = [];
        let formatString = '';
        
        if (dateRangeType === 'day') {
          datePoints = eachDayOfInterval({ start: startDate, end: endDate });
          formatString = 'MMM dd';
        } else if (dateRangeType === 'month') {
          datePoints = eachMonthOfInterval({ start: startDate, end: endDate });
          formatString = 'MMM';
        } else { // year
          datePoints = eachYearOfInterval({ 
            start: startDate, 
            end: endDate 
          });
          formatString = 'yyyy';
        }
        
        // Initialize data points with zeros
        const chartData: TransactionDataPoint[] = datePoints.map(date => ({
          name: format(date, formatString),
          income: 0,
          expenses: 0,
          date: date.getTime() // For sorting
        }));
        
        // Fill in actual transaction data
        transactions.data.forEach(transaction => {
          const date = new Date(transaction.date);
          let formattedDate: string;
          
          if (dateRangeType === 'day') {
            formattedDate = format(date, 'MMM dd');
          } else if (dateRangeType === 'month') {
            formattedDate = format(date, 'MMM');
          } else { // year
            formattedDate = format(date, 'yyyy');
          }
          
          const dataPoint = chartData.find(item => item.name === formattedDate);
          if (dataPoint) {
            if (transaction.type === 'income') {
              dataPoint.income += Number(transaction.amount);
            } else {
              dataPoint.expenses += Number(transaction.amount);
            }
          }
        });
        
        // Sort by actual date
        chartData.sort((a, b) => (a.date as number) - (b.date as number));
        
        // Remove temporary date field
        chartData.forEach(item => delete item.date);
        
        // Calculate totals
        const income = chartData.reduce((sum, item) => sum + item.income, 0);
        const expenses = chartData.reduce((sum, item) => sum + item.expenses, 0);
        const balance = income - expenses;
        
        // Format data for the chart
        const monthlyData = chartData.map(item => ({
          month: item.name,
          income: item.income,
          expenses: item.expenses
        }));

        // Calculate category data for both income and expenses
        const expenseCategories = new Map<string, number>();
        const incomeCategories = new Map<string, number>();
        
        transactions.data.forEach(transaction => {
          if (!transaction.category) return;
          
          const amount = Math.abs(Number(transaction.amount));
          const categoryMap = transaction.type === 'income' ? incomeCategories : expenseCategories;
          const current = categoryMap.get(transaction.category) || 0;
          categoryMap.set(transaction.category, current + amount);
        });

        // Convert to array format for the chart with type information
        const categoryData = [
          // Add expense categories with (Expense) suffix
          ...Array.from(expenseCategories.entries()).map(([name, value]) => ({
            name: `${name} (Expense)`,
            value,
            type: 'expense' as const
  })),
          // Add income categories with (Income) suffix
          ...Array.from(incomeCategories.entries()).map(([name, value]) => ({
            name: `${name} (Income)`,
            value,
            type: 'income' as const
  }))
];

        return {
          income,
          expenses,
          balance,
          totalTransactions: transactions.data.length,
          data: chartData,
          categoryData,
          monthlyData
        };
      } catch (error) {
        console.error('Error fetching transaction summary:', error);
        return defaultTransactionSummary;
      }
    },
    placeholderData: defaultTransactionSummary
  });

  // Safely access transaction summary data with defaults
  const summary = (transactionSummary as TransactionSummary) || defaultTransactionSummary;

  return {
    transactionSummary: summary,
    isLoading: isLoadingTransactions,
    dateRange,
    dateRangeType,
    updateDateRange
  };
};

// Format currency helper function
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};

export default function Dashboard() {
  const navigate = useNavigate();
  
  // Fetch dashboard stats
  const { data: dashboardStats, isLoading: isLoadingStats } = useQuery<DashboardStats>({
    queryKey: ['dashboardStats'],
    queryFn: getDashboardStats,
  });

  // Fetch transaction data for charts
  const { 
    transactionSummary, 
    isLoading: isLoadingTransactions, 
    dateRangeType,
    updateDateRange,
    dateRange
  } = useTransactionCharts();

  // Handle loading and error states
  const isLoading = isLoadingStats || isLoadingTransactions;
  
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

  // Prepare stats for display using the transaction summary with proper type assertions
  const summary = transactionSummary as TransactionSummary;
  const balance = summary?.balance ?? 0;
  const monthlyData = summary?.monthlyData ?? [];
  const categoryData = summary?.categoryData ?? [];
  const transactionData = summary?.data ?? [];
  const income = summary?.income ?? 0;
  const expenses = summary?.expenses ?? 0;

  const stats = [
    { 
      title: "Total Income", 
      value: formatCurrency(income), 
      icon: TrendingUp, 
      change: "+0%",
      color: "text-green-600"
    },
    { 
      title: "Total Expenses", 
      value: formatCurrency(Math.abs(expenses)), 
      icon: TrendingDown, 
      change: "+0%",
      color: "text-red-600"
    },
    { 
      title: "Net Balance", 
      value: formatCurrency(balance), 
      icon: DollarSign, 
      change: "+0%",
      color: balance >= 0 ? "text-green-600" : "text-red-600"
    },
    { 
      title: "Total Projects", 
      value: dashboardStats?.stats.portfolioItems?.toString() || "0", 
      icon: Briefcase, 
      change: "+0%",
      color: "text-blue-600"
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
              <stat.icon className={`h-4 w-4 ${stat.color || 'text-muted-foreground'}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Transaction Analytics</CardTitle>
              <Tabs 
                value={dateRangeType} 
                onValueChange={(value) => updateDateRange(value as DateRangeType)}
                className="w-full md:w-auto"
              >
                <TabsList>
                  <TabsTrigger value="day">
                    <Calendar className="h-4 w-4 mr-2" />
                    Day
                  </TabsTrigger>
                  <TabsTrigger value="month">
                    <CalendarDays className="h-4 w-4 mr-2" />
                    Month
                  </TabsTrigger>
                  <TabsTrigger value="year">
                    <CalendarDays className="h-4 w-4 mr-2" />
                    Year
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="text-sm text-muted-foreground">
              {format(new Date(dateRange.startDate), 'MMM d, yyyy')} - {format(new Date(dateRange.endDate), 'MMM d, yyyy')}
            </div>
          </CardHeader>
          <CardContent>
            <div className="mt-6">
              <TransactionCharts 
                data={transactionData}
                categoryData={categoryData}
                isLoading={isLoadingTransactions}
                dateRangeType={dateRangeType}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue (Last 6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart data={dashboardStats?.charts.revenue} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Project Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <ProjectCategoriesChart data={dashboardStats?.charts.projectCategories} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
