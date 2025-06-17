// Transaction categories
export const TRANSACTION_CATEGORIES = {
  income: [
    { value: 'salary', label: 'Salary' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'investment', label: 'Investment' },
    { value: 'gift', label: 'Gift' },
    { value: 'other_income', label: 'Other Income' },
  ],
  expense: [
    { value: 'housing', label: 'Housing' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'food', label: 'Food & Dining' },
    { value: 'transportation', label: 'Transportation' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'education', label: 'Education' },
    { value: 'travel', label: 'Travel' },
    { value: 'other_expense', label: 'Other Expense' },
  ],
} as const;

// Transaction types
export const TRANSACTION_TYPES = [
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expense' },
] as const;

// Date formats
export const DATE_FORMATS = {
  short: 'MMM d, yyyy',
  medium: 'MMM d, yyyy h:mm a',
  long: 'EEEE, MMMM d, yyyy',
  iso: 'yyyy-MM-dd',
} as const;

// Default pagination settings
export const PAGINATION_DEFAULTS = {
  page: 1,
  limit: 10,
  sortBy: 'date',
  sortOrder: 'desc' as const,
} as const;

// Chart colors
export const CHART_COLORS = [
  '#3b82f6', // blue-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#f59e0b', // amber-500
  '#10b981', // emerald-500
  '#ef4444', // red-500
  '#14b8a6', // teal-500
  '#f97316', // orange-500
  '#6366f1', // indigo-500
  '#ec4899', // pink-500
] as const;
