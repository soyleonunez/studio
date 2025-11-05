import { DashboardActions } from '@/components/dashboard/dashboard-actions';
import { RecentEstimates } from '@/components/dashboard/recent-estimates';
import { getEstimates, getCompany } from '@/lib/data';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function DashboardPage() {
  const [estimates, company] = await Promise.all([getEstimates(), getCompany()]);

  if (!company || !company.name || !company.address) {
    return (
        <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>¡Bienvenido! Empecemos</AlertTitle>
            <AlertDescription>
                Parece que es tu primera vez aquí. Para crear y gestionar presupuestos, primero debes configurar la información de tu empresa.
                <Button asChild variant="secondary" className="mt-4 block">
                    <Link href="/settings">Ir a Configuración</Link>
                </Button>
            </AlertDescription>
        </Alert>
    )
  }

  return (
    <div className="space-y-8">
        <div className='space-y-2'>
            <h1 className="text-3xl font-bold tracking-tight">Panel de Control</h1>
            <p className="text-muted-foreground">Aquí tienes un resumen de tu actividad reciente y acciones rápidas.</p>
        </div>
        <DashboardActions />
        <RecentEstimates estimates={estimates.slice(0, 5)} />
    </div>
  );
}
