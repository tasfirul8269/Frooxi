import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TransactionForm, type TransactionFormValues } from '@/components/transactions/TransactionForm';
import { TransactionTable } from '@/components/transactions/TransactionTable';

import * as transactionService from '@/lib/api/transactionService';
import type { 
  Transaction, 
  TransactionSummary
} from '@/lib/api/transactionService';

type TransactionType = 'income' | 'expense';

interface FiltersType {
  startDate: string;
  endDate: string;
  type: TransactionType | '';
  category: string;
  sort: string;
  page: number;
  limit: number;
  [key: string]: any; // Allow additional properties
}
import { Plus } from 'lucide-react';

export default function FinancePage() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<FiltersType>({
    startDate: format(startOfMonth(subMonths(new Date(), 6)), 'yyyy-MM-dd'),
    endDate: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
    type: '' as TransactionType | '',
    category: '',
    sort: '-date',
    page: 1,
    limit: 10
  });
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Fetch transactions and summary
  const { data: transactionsResponse, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ['transactions', filters],
    queryFn: () => {
      // Create a new object with only the fields that the API expects
      const apiFilters: any = { 
        startDate: filters.startDate,
        endDate: filters.endDate,
        sort: filters.sort,
        page: filters.page,
        limit: filters.limit
      };
      
      // Only include type if it's not empty
      if (filters.type) {
        apiFilters.type = filters.type;
      }
      
      // Only include category if it's not empty
      if (filters.category) {
        apiFilters.category = filters.category;
      }
      
      return transactionService.getTransactions(apiFilters);
    },
  });

  const { data: summaryData, isLoading: isLoadingSummary } = useQuery({
    queryKey: ['transactionSummary', filters.startDate, filters.endDate],
    queryFn: () => transactionService.getTransactionSummary(
      filters.startDate,
      filters.endDate
    ),
    select: (data: TransactionSummary | undefined) => ({
      ...data || {},
      // Ensure we have default values if any of these are undefined
      income: data?.income ?? 0,
      expenses: data?.expenses ?? 0,
      balance: data?.balance ?? 0,
      totalTransactions: data?.totalTransactions ?? 0,
      monthlyData: data?.monthlyData ?? [],
      categoryData: data?.categoryData ?? []
    })
  });

  const transactions = transactionsResponse?.data || [];

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: Omit<TransactionFormValues, 'id'>) => {
      // Convert form data to match Transaction type
      const createData: Omit<Transaction, '_id' | 'createdAt' | 'updatedAt'> = {
        type: data.type as 'income' | 'expense',
        category: data.category || '',
        amount: parseFloat(data.amount || '0'),
        description: data.description || '',
        date: data.date || new Date().toISOString(),
        reference: data.reference,
      };
      return transactionService.createTransaction(createData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transactionSummary'] });
      toast.success('Transaction created successfully');
      setIsFormOpen(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create transaction');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Omit<TransactionFormValues, 'id'> }) => {
      // Convert form data to match Transaction type
      const updateData: Omit<Transaction, '_id' | 'createdAt' | 'updatedAt'> = {
        type: data.type as 'income' | 'expense',
        category: data.category || '',
        amount: parseFloat(data.amount || '0'),
        description: data.description || '',
        date: data.date || new Date().toISOString(),
        reference: data.reference,
      };
      return transactionService.updateTransaction(id, updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transactionSummary'] });
      toast.success('Transaction updated successfully');
      setEditingTransaction(null);
      setIsFormOpen(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update transaction');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => transactionService.deleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transactionSummary'] });
      toast.success('Transaction deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete transaction');
    },
  });

  // Handlers
  const handleSubmit = (data: TransactionFormValues) => {
    // Ensure all required fields are present and properly typed
    const transactionData = {
      type: data.type as 'income' | 'expense',
      category: data.category || '',
      amount: data.amount, // Keep as string for the form
      description: data.description || '',
      date: data.date || new Date().toISOString(),
      reference: data.reference,
    };

    if (editingTransaction) {
      // For update, we need to include the ID and only changed fields
      updateMutation.mutate({
        id: editingTransaction._id!,
        data: {
          type: transactionData.type,
          category: transactionData.category,
          amount: transactionData.amount,
          description: transactionData.description,
          date: transactionData.date,
          reference: transactionData.reference,
        },
      });
    } else {
      // For create, we need to ensure all required fields are present
      createMutation.mutate({
        type: transactionData.type,
        category: transactionData.category,
        amount: transactionData.amount,
        description: transactionData.description,
        date: transactionData.date,
        reference: transactionData.reference,
      });
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleFiltersChange = (newFilters: Partial<FiltersType>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1, // Reset to first page when filters change
    }));
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as TransactionType | '';
    setFilters(prev => ({
      ...prev,
      type: value,
    }));
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Finance</h1>
          <p className="text-sm text-muted-foreground">
            Manage your income and expenses
          </p>
        </div>
        <Button onClick={() => {
          setEditingTransaction(null);
          setIsFormOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Transaction Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <div className="flex space-x-2">
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <span className="flex items-center">to</span>
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <select
                  value={filters.type}
                  onChange={handleTypeChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">All Types</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
                <select
                  value={filters.sort}
                  onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="-date">Newest First</option>
                  <option value="date">Oldest First</option>
                  <option value="amount">Amount (Low to High)</option>
                  <option value="-amount">Amount (High to Low)</option>
                </select>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Income</p>
                <p className="text-2xl font-bold">
                  ${(summaryData?.income || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Expenses</p>
                <p className="text-2xl font-bold">
                  ${(summaryData?.expenses || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Balance</p>
                <p className="text-2xl font-bold">
                  ${(summaryData?.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionTable
              transactions={transactions}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isLoading={isLoadingTransactions}
            />
          </CardContent>
        </Card>
      </div>

      {/* Transaction Form Dialog */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
            </h2>
            <TransactionForm
              initialData={editingTransaction ? {
                ...editingTransaction,
                amount: editingTransaction.amount.toString(),
                date: typeof editingTransaction.date === 'string' 
                  ? editingTransaction.date.split('T')[0] 
                  : format(editingTransaction.date, 'yyyy-MM-dd')
              } : undefined}
              onSubmit={handleSubmit}
              isSubmitting={createMutation.isPending || updateMutation.isPending}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingTransaction(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
