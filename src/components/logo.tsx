import { PawPrint } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export function Logo({ className, logoUrl }: { className?: string, logoUrl?: string | null }) {
  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
        <div className="h-8 w-8 rounded-full flex items-center justify-center bg-background border overflow-hidden">
            {logoUrl ? (
                <Image src={logoUrl} alt="Logo de la Compañía" width={32} height={32} className="object-contain" />
            ) : (
                <PawPrint className="text-primary size-5" />
            )}
        </div>
      <span className="text-lg font-semibold text-foreground hidden group-data-[state=expanded]/sidebar-wrapper:inline-block">
        PetPal Quotes
      </span>
    </div>
  );
}
