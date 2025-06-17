import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Loader2, AlertCircle } from 'lucide-react';
import { useTheme } from 'next-themes';
import { format } from 'date-fns';

type DateRangeType = 'day' | 'month' | 'year' | 'all';

interface TransactionChartsProps {
  data: any[];
  categoryData: any[];
  isLoading: boolean;
  dateRangeType: DateRangeType;
}

interface ChartData {
  name: string;
  Income: number;
  Expenses: number;
}

interface CategoryData {
  name: string;
  value: number;
  color?: string;
  glow?: string;
}

// Modern color palette with glow effect support
const CHART_COLORS = {
  INCOME: '#3b82f6',      // Blue-500
  EXPENSE: '#8b5cf6',    // Violet-500
  INCOME_GLOW: 'rgba(59, 130, 246, 0.5)',
  EXPENSE_GLOW: 'rgba(139, 92, 246, 0.5)',
  GRID: '#e5e7eb',
  TEXT: '#6b7280',
  BACKGROUND: '#ffffff',
  CARD_BG: '#ffffff',
  CARD_BORDER: '#e5e7eb',
  // Additional accent colors for categories
  ACCENT_1: '#3b82f6',  // Blue-500
  ACCENT_2: '#8b5cf6',  // Violet-500
  ACCENT_3: '#06b6d4',  // Cyan-500
  ACCENT_4: '#10b981',  // Emerald-500
  ACCENT_5: '#f59e0b',  // Amber-500
} as const;

const DARK_CHART_COLORS = {
  INCOME: '#60a5fa',      // Blue-400
  EXPENSE: '#a78bfa',    // Violet-400
  INCOME_GLOW: 'rgba(96, 165, 250, 0.5)',
  EXPENSE_GLOW: 'rgba(167, 139, 250, 0.5)',
  GRID: '#374151',
  TEXT: '#9ca3af',
  BACKGROUND: '#1f2937',
  CARD_BG: '#1f2937',
  CARD_BORDER: '#374151',
  // Additional accent colors for categories (lighter for dark theme)
  ACCENT_1: '#60a5fa',  // Blue-400
  ACCENT_2: '#a78bfa',  // Violet-400
  ACCENT_3: '#22d3ee',  // Cyan-400
  ACCENT_4: '#34d399',  // Emerald-400
  ACCENT_5: '#fbbf24',  // Amber-400
} as const;

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Skeleton component for loading state
const ChartSkeleton = ({ title }: { title: string }) => (
  <div className="w-full h-full flex flex-col">
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    <div className="flex-1 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
        <p className="text-muted-foreground">Loading chart data...</p>
      </div>
    </div>
  </div>
);

export function TransactionCharts({ data, categoryData, isLoading, dateRangeType }: TransactionChartsProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const chartColors = isDark ? DARK_CHART_COLORS : CHART_COLORS;

  // Define transaction type for better type safety
  interface Transaction {
    date: string | Date;
    amount: number | string;
    type: 'income' | 'expense' | string;
  }

  // Process transaction data for charts
  const processChartData = (): ChartData[] => {
    if (!Array.isArray(data) || data.length === 0) return [];
    
    console.log('Processing transaction data:', JSON.stringify(data, null, 2));
    
    // Convert the data to match the expected format
    const result: ChartData[] = data.map(item => ({
      name: item.name,
      Income: Number(item.income || 0),
      Expenses: Number(item.expenses || 0)
    }));
    
    console.log('Processed chart data result:', result);
    return result;
  };

  // Process category data for income and expenses with modern colors
  const incomeCategories = (Array.isArray(categoryData) ? categoryData : [])
    .filter(item => {
      const isIncome = item && (
        item.type === 'income' || 
        item.type === 'INCOME' || 
        (typeof item.name === 'string' && item.name.includes('(Income)'))
      );
      return isIncome && (item.value > 0 || item.amount > 0);
    })
    .map((item, index) => {
      const name = (item.name || 'Uncategorized').replace(/\(Income\)$/, '').trim();
      // Use different blue shades for income categories
      const incomeColors = [
        '#3b82f6', // Blue-500
        '#60a5fa', // Blue-400
        '#93c5fd', // Blue-300
        '#bfdbfe', // Blue-200
      ];
      const color = item.color || incomeColors[index % incomeColors.length];
      return {
        name: name || 'Uncategorized',
        value: Math.abs(Number(item.value || item.amount || 0)),
        color,
        glow: isDark 
          ? `drop-shadow(0 0 8px ${color}80)`
          : `drop-shadow(0 0 6px ${color}80)`
      };
    });

  const expenseCategories = (Array.isArray(categoryData) ? categoryData : [])
    .filter(item => {
      const isExpense = item && (
        item.type === 'expense' || 
        item.type === 'EXPENSE' || 
        (typeof item.name === 'string' && item.name.includes('(Expense)'))
      );
      return isExpense && (item.value > 0 || item.amount > 0);
    })
    .map((item, index) => {
      const name = (item.name || 'Uncategorized').replace(/\(Expense\)$/, '').trim();
      // Use different purple/violet shades for expense categories
      const expenseColors = [
        '#8b5cf6', // Violet-500
        '#a78bfa', // Violet-400
        '#c4b5fd', // Violet-300
        '#ddd6fe', // Violet-200
      ];
      const color = item.color || expenseColors[index % expenseColors.length];
      return {
        name: name || 'Uncategorized',
        value: Math.abs(Number(item.value || item.amount || 0)),
        color,
        glow: isDark 
          ? `drop-shadow(0 0 8px ${color}80)`
          : `drop-shadow(0 0 6px ${color}80)`
      };
    });
    
  const chartData = processChartData();
  const sortedChartData = [...chartData].sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());
  
  // Debug logging
  console.log('Raw data:', data);
  console.log('Processed chart data:', chartData);
  console.log('Sorted chart data:', sortedChartData);
  console.log('Income categories:', incomeCategories);
  console.log('Expense categories:', expenseCategories);
  
  const totalIncome = incomeCategories.reduce((sum, item) => sum + item.value, 0);
  const totalExpenses = expenseCategories.reduce((sum, item) => sum + item.value, 0);

  const formatXAxisTick = (date: string) => {
    // For month names (Jan, Feb, etc.) just return as is
    if (['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].includes(date)) {
      return date;
    }
    
    // For other date formats, try to parse
    try {
      const dateObj = new Date(date);
      if (dateRangeType === 'year') {
        return dateObj.toLocaleDateString('en-US', { month: 'short' });
      } else if (dateRangeType === 'month' || dateRangeType === 'day') {
        return dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
      }
      return dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    } catch (e) {
      // If date parsing fails, return the original string
      return date;
    }
  };

  interface LabelProps {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
    index: number;
    name?: string;
  }

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
    name,
  }: LabelProps) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          fontSize: '12px',
          fontWeight: 'bold',
          pointerEvents: 'none',
          textShadow: '0 0 3px rgba(0,0,0,0.8)',
        }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const renderCenterText = ({ title, value }: { title: string; value: number }) => {
    return (
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        style={{
          fontSize: '14px',
          fontWeight: 'bold',
          fill: chartColors.TEXT,
        }}
      >
        {title}
        <tspan x="50%" dy="1.2em" style={{ fontSize: '16px', fontWeight: 'bold' }}>
          {formatCurrency(value)}
        </tspan>
      </text>
    );
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartSkeleton title="Income & Expenses Over Time" />
        <ChartSkeleton title="Monthly Summary" />
        <ChartSkeleton title="Income by Category" />
        <ChartSkeleton title="Expenses by Category" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="w-full h-[400px] bg-card rounded-lg p-6 border border-border">
          <h3 className="text-lg font-semibold mb-4">Income & Expenses Over Time</h3>
          {sortedChartData.length > 0 ? (
            <div className="h-[calc(100%-2.5rem)]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sortedChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.GRID} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: chartColors.TEXT }}
                    tickFormatter={formatXAxisTick}
                  />
                  <YAxis 
                    tick={{ fill: chartColors.TEXT }}
                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`$${value.toLocaleString()}`, value > 0 ? 'Income' : 'Expenses']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Legend />
                  <defs>
                    <filter id="incomeGlow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    <filter id="expenseGlow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>
                  <Line 
                    type="monotone" 
                    dataKey="Income" 
                    name="Income" 
                    stroke={chartColors.INCOME} 
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ 
                      r: 8,
                      fill: chartColors.INCOME,
                      stroke: '#fff',
                      strokeWidth: 2,
                      style: { filter: `drop-shadow(0 0 8px ${chartColors.INCOME_GLOW})` }
                    }}
                    style={{
                      filter: `drop-shadow(0 0 6px ${chartColors.INCOME_GLOW})`
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Expenses" 
                    name="Expenses" 
                    stroke={chartColors.EXPENSE} 
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ 
                      r: 8,
                      fill: chartColors.EXPENSE,
                      stroke: '#fff',
                      strokeWidth: 2,
                      style: { filter: `drop-shadow(0 0 8px ${chartColors.EXPENSE_GLOW})` }
                    }}
                    style={{
                      filter: `drop-shadow(0 0 6px ${chartColors.EXPENSE_GLOW})`
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No data available for the selected period
            </div>
          )}
        </div>

        {/* Bar Chart */}
        <div className="w-full h-[400px] bg-card rounded-lg p-6 border border-border">
          <h3 className="text-lg font-semibold mb-4">Monthly Summary</h3>
          {sortedChartData.length > 0 ? (
            <div className="h-[calc(100%-2.5rem)]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sortedChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.GRID} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: chartColors.TEXT }}
                    tickFormatter={formatXAxisTick}
                  />
                  <YAxis 
                    tick={{ fill: chartColors.TEXT }}
                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`$${value.toLocaleString()}`, value > 0 ? 'Income' : 'Expenses']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Legend />
                  <Bar dataKey="Income" name="Income" fill={chartColors.INCOME}>
                    {sortedChartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={chartColors.INCOME}
                        style={{
                          filter: `drop-shadow(0 0 4px ${chartColors.INCOME_GLOW})`,
                          transition: 'all 0.3s ease'
                        }}
                      />
                    ))}
                  </Bar>
                  <Bar dataKey="Expenses" name="Expenses" fill={chartColors.EXPENSE}>
                    {sortedChartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={chartColors.EXPENSE}
                        style={{
                          filter: `drop-shadow(0 0 4px ${chartColors.EXPENSE_GLOW})`,
                          transition: 'all 0.3s ease'
                        }}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No data available for the selected period
            </div>
          )}
        </div>
      </div>

      {/* Pie Charts - Income and Expense Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income by Category */}
        <div className="w-full h-[400px] bg-card rounded-lg p-6 border border-border">
          <h3 className="text-lg font-semibold mb-4">Income by Category</h3>
          {incomeCategories.length > 0 ? (
            <div className="h-[calc(100%-2.5rem)]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={incomeCategories}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={100}
                    innerRadius={60}
                    dataKey="value"
                    paddingAngle={2}
                  >
                    {incomeCategories.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`}
                        fill={entry.color}
                        style={{
                          filter: entry.glow,
                          transition: 'all 0.3s ease',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                          const target = e.currentTarget as SVGPathElement;
                          if (target) {
                            target.style.filter = `${entry.glow}, brightness(1.1)`;
                          }
                        }}
                        onMouseLeave={(e) => {
                          const target = e.currentTarget as SVGPathElement;
                          if (target) {
                            target.style.filter = entry.glow;
                          }
                        }}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Amount']}
                    contentStyle={{
                      backgroundColor: isDark ? '#1f2937' : '#ffffff',
                      border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                      borderRadius: '0.375rem',
                      color: isDark ? '#f9fafb' : '#111827'
                    }}
                  />
                  <g>
                    {renderCenterText({ title: 'Total', value: totalIncome })}
                  </g>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No income data available
            </div>
          )}
        </div>

        {/* Expenses by Category */}
        <div className="w-full h-[400px] bg-card rounded-lg p-6 border border-border">
          <h3 className="text-lg font-semibold mb-4">Expenses by Category</h3>
          {expenseCategories.length > 0 ? (
            <div className="h-[calc(100%-2.5rem)]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseCategories}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={100}
                    innerRadius={60}
                    dataKey="value"
                    paddingAngle={2}
                  >
                    {expenseCategories.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`}
                        fill={entry.color}
                        style={{
                          filter: entry.glow,
                          transition: 'all 0.3s ease',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                          const target = e.currentTarget as SVGPathElement;
                          if (target) {
                            target.style.filter = `${entry.glow}, brightness(1.1)`;
                          }
                        }}
                        onMouseLeave={(e) => {
                          const target = e.currentTarget as SVGPathElement;
                          if (target) {
                            target.style.filter = entry.glow;
                          }
                        }}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Amount']}
                    contentStyle={{
                      backgroundColor: isDark ? '#1f2937' : '#ffffff',
                      border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                      borderRadius: '0.375rem',
                      color: isDark ? '#f9fafb' : '#111827'
                    }}
                  />
                  <g>
                    {renderCenterText({ title: 'Total', value: totalExpenses })}
                  </g>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No expense data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TransactionCharts;
