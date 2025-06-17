import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, ArrowDown, Wallet, FileText } from 'lucide-react';

interface TransactionStatsProps {
  income: number;
  expenses: number;
  balance: number;
  totalTransactions: number;
  isLoading: boolean;
}

export function TransactionStats({ 
  income, 
  expenses, 
  balance, 
  totalTransactions, 
  isLoading 
}: TransactionStatsProps) {
  const stats = [
    {
      title: 'Total Income',
      value: income,
      change: 0, // You can calculate this based on previous period
      icon: <ArrowUp className="h-4 w-4 text-green-500" />,
      color: 'text-green-600',
    },
    {
      title: 'Total Expenses',
      value: expenses,
      change: 0, // You can calculate this based on previous period
      icon: <ArrowDown className="h-4 w-4 text-red-500" />,
      color: 'text-red-600',
    },
    {
      title: 'Net Balance',
      value: balance,
      change: 0, // You can calculate this based on previous period
      icon: <Wallet className="h-4 w-4 text-blue-500" />,
      color: balance >= 0 ? 'text-green-600' : 'text-red-600',
    },
    {
      title: 'Transactions',
      value: totalTransactions,
      change: 0, // You can calculate this based on previous period
      icon: <FileText className="h-4 w-4 text-purple-500" />,
      color: 'text-purple-600',
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-20 bg-muted rounded animate-pulse" />
              <div className="h-4 w-4 bg-muted rounded-full" />
            </CardHeader>
            <CardContent>
              <div className="h-6 w-24 bg-muted rounded animate-pulse mb-1" />
              <div className="h-4 w-16 bg-muted rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className="h-4 w-4">{stat.icon}</div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.color}`}>
              {stat.title === 'Transactions' 
                ? stat.value.toLocaleString() 
                : formatCurrency(stat.value)}
            </div>
            <p className="text-xs text-muted-foreground">
              {stat.change >= 0 ? '+' : ''}
              {stat.change}% from last period
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
