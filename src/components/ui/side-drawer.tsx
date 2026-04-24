import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/utils';

type SideDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
};

export function SideDrawer({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  className,
}: SideDrawerProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/45 backdrop-blur-[2px]" />
        <Dialog.Content
          className={cn(
            'fixed right-0 top-0 z-50 flex h-dvh w-full max-w-xl flex-col border-l border-border bg-background shadow-2xl outline-none data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:animate-in data-[state=open]:slide-in-from-right sm:max-w-2xl',
            className
          )}
        >
          <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
            <div>
              <Dialog.Title className="text-xl font-semibold text-foreground">{title}</Dialog.Title>
              {description ? (
                <Dialog.Description className="mt-1 text-sm text-muted-foreground">
                  {description}
                </Dialog.Description>
              ) : null}
            </div>
            <Dialog.Close className="rounded-full border border-border p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
              <X size={16} />
            </Dialog.Close>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

          {footer ? (
            <div className="border-t border-border bg-card px-6 py-4">{footer}</div>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
