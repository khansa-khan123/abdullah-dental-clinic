import { cn, getStatusColor } from '@/lib/utils';

interface BadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: BadgeProps) {
  const labels: Record<string, string> = {
    PENDING: 'Pending',
    CONFIRMED: 'Confirmed',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
    PAID: 'Paid',
    PARTIAL: 'Partial',
    PATIENT: 'Patient',
    DOCTOR: 'Doctor',
    ADMIN: 'Admin',
  };

  return (
    <span className={cn('badge', getStatusColor(status), className)}>
      {labels[status] || status}
    </span>
  );
}

export function Badge({
  children,
  variant = 'default',
  className,
}: {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  className?: string;
}) {
  const variants = {
    default: 'bg-gray-100 text-gray-800 border-gray-200',
    primary: 'bg-primary-100 text-primary-800 border-primary-200',
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    danger: 'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <span className={cn('badge', variants[variant], className)}>
      {children}
    </span>
  );
}
