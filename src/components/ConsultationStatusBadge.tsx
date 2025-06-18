import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, MessageSquare, RefreshCw, XCircle } from 'lucide-react';
import { ConsultationStatus } from '@/types/consultation';

interface ConsultationStatusBadgeProps {
  status: ConsultationStatus;
  className?: string;
}

const statusConfig = {
  pending: {
    label: 'Pending',
    icon: Clock,
    variant: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  },
  contacted: {
    label: 'Contacted',
    icon: MessageSquare,
    variant: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  },
  in_progress: {
    label: 'In Progress',
    icon: RefreshCw,
    variant: 'bg-purple-100 text-purple-800 hover:bg-purple-100',
  },
  completed: {
    label: 'Completed',
    icon: CheckCircle2,
    variant: 'bg-green-100 text-green-800 hover:bg-green-100',
  },
  cancelled: {
    label: 'Cancelled',
    icon: XCircle,
    variant: 'bg-red-100 text-red-800 hover:bg-red-100',
  },
} as const;

export function ConsultationStatusBadge({ status, className = '' }: ConsultationStatusBadgeProps) {
  const { label, icon: Icon, variant } = statusConfig[status];
  
  return (
    <Badge className={`inline-flex items-center gap-1.5 ${variant} ${className}`}>
      <Icon className="h-3.5 w-3.5" />
      <span>{label}</span>
    </Badge>
  );
}
