import { RecentEstimates } from '@/components/dashboard/recent-estimates';
import { getEstimates, getCompany } from '@/lib/data';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TemporaryEstimateCard } from '@/components/dashboard/temporary-estimate-card';
import { DailyAdminMetricsCard } from '@/components/dashboard/daily-admin-metrics-card';
import { Input } from '@/components/ui/input';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { MagnifierIcon } from '@/components/icons/phosphor';

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
    <div className="space-y-10 pb-12">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 text-white shadow-2xl">
        <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-primary/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/70">Hola, {company.name}</p>
            <h1 className="text-4xl font-semibold tracking-tight">Panel administrativo</h1>
            <p className="text-sm text-white/70 md:text-base">
              Gestiona presupuestos, revisa métricas y mantén a tu equipo sincronizado desde un mismo lugar.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild className="rounded-full bg-white text-slate-900 hover:bg-slate-100">
                <Link href="/estimates/new">Nuevo presupuesto</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full border-white/30 text-white hover:bg-white/10">
                <Link href="/settings">Configurar empresa</Link>
              </Button>
            </div>
          </div>
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
            <p className="text-xs uppercase tracking-wide text-white/70">Buscar cliente o mascota</p>
            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/20 bg-white/5 px-4 py-3">
              <MagnifierIcon className="h-5 w-5 text-white/70" />
              <Input
                type="text"
                placeholder="Ingresa nombre o número de documento"
                className="border-none bg-transparent text-sm text-white placeholder:text-white/60 focus-visible:ring-white/40"
              />
            </div>
            <p className="mt-3 text-xs text-white/60">
              Encuentra presupuestos recientes por datos del propietario o de su mascota.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.1fr)]">
        <TemporaryEstimateCard company={company} />
        <DailyAdminMetricsCard estimates={estimates} />
      </section>

      <QuickActions />

      <RecentEstimates estimates={estimates.slice(0, 8)} />
    </div>
  );
}
