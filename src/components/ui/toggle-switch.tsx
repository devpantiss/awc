import * as Switch from '@radix-ui/react-switch';
import { cn } from '@/utils';

type ToggleSwitchProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
};

export function ToggleSwitch({ checked, onCheckedChange, label }: ToggleSwitchProps) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-background/70 px-4 py-3">
      {label ? <span className="text-sm font-medium text-foreground">{label}</span> : null}
      <Switch.Root
        checked={checked}
        onCheckedChange={onCheckedChange}
        className={cn(
          'relative h-6 w-11 rounded-full border transition-colors',
          checked ? 'border-emerald-600 bg-emerald-500' : 'border-border bg-muted'
        )}
      >
        <Switch.Thumb
          className={cn(
            'block h-4 w-4 rounded-full bg-white shadow transition-transform',
            checked ? 'translate-x-6' : 'translate-x-1'
          )}
        />
      </Switch.Root>
    </label>
  );
}
