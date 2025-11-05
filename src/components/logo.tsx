import { PawPrint } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <PawPrint className="text-primary size-6" />
      <span className="text-lg font-semibold text-foreground">
        PetPal Quotes
      </span>
    </div>
  );
}
