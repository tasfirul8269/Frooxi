import api from './api';

const API_PREFIX = '/transactions';

// Request interceptor to log requests
api.interceptors.request.use(
  (config) => {
    console.log(`[${config.method?.toUpperCase()}] ${config.url}`, {
      params: config.params,
      data: config.data,
    });
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log(`[${response.status}] ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    const errorMessage = error.response?.data?.message || error.message;
    const statusCode = error.response?.status;
    
    console.error('API Error:', {
      status: statusCode,
      message: errorMessage,
      url: error.config?.url,
      method: error.config?.method,
      data: error.config?.data,
      response: error.response?.data,
    });

    // Handle specific status codes
    if (statusCode === 401) {
      // Handle unauthorized (e.g., redirect to login)
      console.error('Authentication required');
    } else if (statusCode === 404) {
      console.error('Resource not found');
    } else if (statusCode === 500) {
      console.error('Server error occurred');
    }

    return Promise.reject({
      message: errorMessage,
      status: statusCode,
      data: error.response?.data,
    });
  }
);

// Type definitions
export type TransactionType = 'income' | 'expense';

export interface Transaction {
  _id?: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  date: string | Date;
  reference?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
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
  income: number;
  expenses: number;
  balance: number;
  totalTransactions: number;
  monthlyData: Array<{
    month: string;
    income: number;
    expenses: number;
  }>;
  categoryData: Array<{
    name: string;
    value: number;
    type: TransactionType;
  }>;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Category helpers
export const EXPENSE_CATEGORIES = [
  'housing', 'utilities', 'food', 'transportation',
  'healthcare', 'entertainment', 'shopping', 'education',
  'travel', 'other'
] as const;

export const INCOME_CATEGORIES = [
  'salary', 'freelance', 'investment', 'gift', 'other_income'
] as const;

export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES] as const;

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];
export type IncomeCategory = typeof INCOME_CATEGORIES[number];
export type TransactionCategory = ExpenseCategory | IncomeCategory;

// API functions
export const createTransaction = async (data: Omit<Transaction, '_id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const response = await api.post<Transaction>(API_PREFIX, data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to create transaction');
    }
    throw new Error('Network error while creating transaction');
  }
};

export const getTransactions = async (filters: TransactionFilters = {}) => {
  try {
    const response = await api.get<PaginatedResponse<Transaction>>(API_PREFIX, { params: filters });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching transactions:', error);
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch transactions');
    }
    throw new Error('Network error while fetching transactions');
  }
};

export const getTransactionSummary = async (startDate?: string, endDate?: string) => {
  try {
    const response = await api.get<TransactionSummary>(`${API_PREFIX}/summary`, {
      params: { startDate, endDate },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching transaction summary:', error);
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch transaction summary');
    }
    throw new Error('Network error while fetching transaction summary');
  }
};

export const updateTransaction = async (id: string, data: Partial<Transaction>) => {
  try {
    const response = await api.patch<Transaction>(`${API_PREFIX}/${id}`, data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to update transaction');
    }
    throw new Error('Network error while updating transaction');
  }
};

export const deleteTransaction = async (id: string) => {
  try {
    await api.delete(`${API_PREFIX}/${id}`);
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to delete transaction');
    }
    throw new Error('Network error while deleting transaction');
  }
};

// Helper function to format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Helper to get category display name
export const getCategoryDisplayName = (category: string): string => {
  const categoryMap: Record<string, string> = {
    housing: 'Housing',
    utilities: 'Utilities',
    food: 'Food',
    transportation: 'Transportation',
    healthcare: 'Healthcare',
    entertainment: 'Entertainment',
    shopping: 'Shopping',
    education: 'Education',
    travel: 'Travel',
    other: 'Other',
    salary: 'Salary',
    freelance: 'Freelance',
    investment: 'Investment',
    gift: 'Gift',
    other_income: 'Other Income',
  };
  
  return categoryMap[category] || category;
};

// Helper to get category icon (using lucide-react icons)
export const getCategoryIcon = (category: string): string => {
  const iconMap: Record<string, string> = {
    housing: 'home',
    utilities: 'zap',
    food: 'utensils',
    transportation: 'car',
    healthcare: 'heart-pulse',
    entertainment: 'film',
    shopping: 'shopping-bag',
    education: 'graduation-cap',
    travel: 'plane',
    other: 'circle-dot',
    salary: 'dollar-sign',
    freelance: 'briefcase',
    investment: 'trending-up',
    gift: 'gift',
    other_income: 'circle-dollar-sign',
  };
  
  return iconMap[category] || 'dollar-sign';
};
