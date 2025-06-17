import { User } from './user';

export type TransactionType = 'income' | 'expense';

export type TransactionCategory = 
  // Expense categories
  | 'salary' | 'rent' | 'utilities' | 'supplies' | 'marketing' | 'software' | 'hardware' | 'other_expense'
  // Income categories
  | 'project' | 'subscription' | 'consulting' | 'product_sales' | 'other_income';

export interface Transaction {
  _id: string;
  type: TransactionType;
  amount: number;
  category: TransactionCategory;
  description: string;
  reference?: string;
  date: string | Date;
  createdBy: string | User;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface TransactionFilters {
  type?: TransactionType;
  category?: string;
  startDate?: string;
  endDate?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface TransactionSummary {
  summary: {
    income: number;
    expenses: number;
    balance: number;
    totalTransactions: number;
  };
  byCategory: Array<{
    type: TransactionType;
    categories: Array<{
      category: string;
      total: number;
      count: number;
    }>;
    total: number;
  }>;
  monthlySummary: Array<{
    date: string;
    income: number;
    expenses: number;
    profit: number;
    transactions: number;
  }>;
}

export interface TransactionFormData {
  type: TransactionType;
  amount: number | '';
  category: TransactionCategory;
  description: string;
  date: string;
  reference?: string;
}

export interface TransactionTableProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export interface TransactionFormProps {
  initialData?: Partial<TransactionFormData>;
  onSubmit: (data: TransactionFormData) => void;
  isSubmitting?: boolean;
  onCancel?: () => void;
}

export interface TransactionStatsCardProps {
  title: string;
  value: number;
  change: number;
  type: 'income' | 'expense' | 'balance';
  icon: React.ReactNode;
}

export interface TransactionChartData {
  date: string;
  income: number;
  expenses: number;
  profit: number;
}

export interface CategoryDistribution {
  category: string;
  amount: number;
  percentage: number;
  type: TransactionType;
}
