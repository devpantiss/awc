import { AlertTriangle } from 'lucide-react';
import { cn } from '@/utils';
import type { ReactNode } from 'react';

type AlertProps = {
  title: string;
  description: string;
  tone?: 'info' | 'warning' | 'critical' | 'success';
  action?: ReactNode;
  className?: string;
};

export function Alert({ title, description, tone = 'info', action, className }: AlertProps) {
  return (
    <div
      className={cn(
        'rounded-[1.25rem] border p-4 shadow-sm',
        tone === 'info' && 'border-sky-200 bg-sky-50/80 dark:border-sky-900 dark:bg-sky-950/20',
        tone === 'warning' && 'border-amber-200 bg-amber-50/80 dark:border-amber-900 dark:bg-amber-950/20',
        tone === 'critical' && 'border-red-200 bg-red-50/80 dark:border-red-900 dark:bg-red-950/20',
        tone === 'success' && 'border-emerald-200 bg-emerald-50/80 dark:border-emerald-900 dark:bg-emerald-950/20',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'mt-0.5',
            tone === 'info' && 'text-sky-600 dark:text-sky-300',
            tone === 'warning' && 'text-amber-600 dark:text-amber-300',
            tone === 'critical' && 'text-red-600 dark:text-red-300',
            tone === 'success' && 'text-emerald-600 dark:text-emerald-300'
          )}
        >
          <AlertTriangle size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          {action ? <div className="mt-3">{action}</div> : null}
        </div>
      </div>
    </div>
  );
}
