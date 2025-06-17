import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TransactionForm } from './TransactionForm';
import type { TransactionFormValues } from './TransactionForm';
import type { Transaction } from '@/lib/api/transactionService';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Transaction, '_id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => void;
  isSubmitting: boolean;
  initialData?: Partial<Transaction>;
  title?: string;
}

type FormInitialData = {
  type?: 'income' | 'expense';
  amount?: string;
  category: string;
  description: string;
  date: string;
  reference?: string;
};

export function TransactionModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  initialData = {},
  title,
}: TransactionModalProps) {
  // Prepare form initial data with proper types and default values
  const formInitialData: FormInitialData = {
    type: initialData.type || 'expense',
    amount: initialData.amount !== undefined ? String(initialData.amount) : '',
    category: initialData.category || '',
    description: initialData.description || '',
    date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    reference: initialData.reference,
  };

  const handleSubmit = (formData: TransactionFormValues) => {
    // Convert form data to transaction data
    const transactionData: Omit<Transaction, '_id' | 'createdAt' | 'updatedAt' | 'createdBy'> = {
      type: formData.type,
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description,
      date: formData.date,
      reference: formData.reference || '',
    };
    
    onSubmit(transactionData);
  };

  const modalTitle = title || (initialData?._id ? 'Edit Transaction' : 'Add New Transaction');

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{modalTitle}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <TransactionForm
            initialData={formInitialData}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            onCancel={onClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
