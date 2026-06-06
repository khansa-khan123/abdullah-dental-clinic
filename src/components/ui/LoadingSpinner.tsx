import { cn } from '@/lib/utils';

export function LoadingSpinner({ className, size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-primary-200 border-t-primary-600',
        sizes[size],
        className
      )}
    />
  );
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <p className="text-gray-500 font-medium">Loading...</p>
      </div>
    </div>
  );
}
