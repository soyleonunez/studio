import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export function DashboardActions() {
  return (
    <div className="mb-8">
      <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
        <Link href="/estimates/new">
          <PlusCircle className="mr-2 h-5 w-5" />
          Crear Nuevo Presupuesto
        </Link>
      </Button>
    </div>
  );
}
