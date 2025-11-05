import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Estimate } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

function getStatusVariant(status: Estimate['status']) {
  switch (status) {
    case 'Aprobado':
      return 'secondary';
    case 'Enviado':
      return 'default';
    case 'Borrador':
    default:
      return 'outline';
  }
}

function calculateTotal(estimate: Estimate): number {
    const subtotal = estimate.lineItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
    const taxAmount = subtotal * (estimate.taxRate / 100);
    return subtotal + taxAmount;
}


export async function RecentEstimates({ estimates }: { estimates: Estimate[] }) {
  const groupedByDay = estimates.reduce<Record<string, Estimate[]>>((acc, estimate) => {
    const key = format(new Date(estimate.createdAt), 'PPP', { locale: es });
    if (!acc[key]) acc[key] = [];
    acc[key].push(estimate);
    return acc;
  }, {});

  const orderedDays = Object.keys(groupedByDay);

  return (
    <Card className="rounded-3xl border border-slate-200/60 bg-white shadow-xl">
      <CardHeader className="flex flex-col gap-2 pb-4">
        <CardTitle className="text-xl font-semibold text-slate-900">Historial diario de presupuestos</CardTitle>
        <CardDescription className="text-slate-500">
          Revisa cómo avanzan tus presupuestos generados recientemente.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {orderedDays.length === 0 && (
          <div className="flex h-32 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 text-center text-sm text-slate-500">
            No se encontraron presupuestos. ¡Crea uno para empezar!
          </div>
        )}
        {orderedDays.map((day) => (
          <div key={day} className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">{day}</p>
              <span className="text-xs text-slate-400">
                {groupedByDay[day].length} {groupedByDay[day].length === 1 ? 'registro' : 'registros'}
              </span>
            </div>
            <div className="space-y-3">
              {groupedByDay[day].map((estimate) => (
                <div
                  key={estimate.id}
                  className="flex flex-col gap-3 rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900/10 text-sm font-semibold text-slate-900">
                        {estimate.pet.name[0]?.toUpperCase() ?? 'P'}
                      </div>
                      <div>
                        <Link
                          href={`/estimates/${estimate.id}`}
                          className="text-base font-semibold text-slate-900 hover:underline"
                        >
                          {estimate.pet.name}
                        </Link>
                        <p className="text-xs text-slate-500">
                          ID {estimate.id} · {formatDistanceToNow(new Date(estimate.createdAt), { addSuffix: true, locale: es })}
                        </p>
                      </div>
                    </div>
                    <Badge variant={getStatusVariant(estimate.status)} className="rounded-full px-3 py-1 text-xs">
                      {estimate.status}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
                    <span>{estimate.owner.name}</span>
                    <span className="font-semibold text-slate-900">{formatCurrency(calculateTotal(estimate))}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
