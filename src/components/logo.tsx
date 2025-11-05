import { PawPrint } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <PawPrint className="text-primary size-8" />
      <span className="text-lg font-semibold text-foreground hidden group-data-[state=expanded]/sidebar-wrapper:inline-block">
        PetPal Quotes
      </span>
    </div>
  );
}
