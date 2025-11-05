import {
  DailyAdminMetricsCard,
  QuickActions,
  RecentEstimates,
  TemporaryEstimateCard,
} from '@/components/dashboard';
import { getEstimates, getCompany } from '@/lib/data';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function DashboardPage() {
  const [estimates, company] = await Promise.all([getEstimates(), getCompany()]);

  if (!company || !company.name || !company.address) {
    return (
        <Alert variant="destructive">
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
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <TemporaryEstimateCard company={company} />
        <DailyAdminMetricsCard estimates={estimates} />
      </section>

      <QuickActions />

      <RecentEstimates estimates={estimates} />
    </div>
  );
}
