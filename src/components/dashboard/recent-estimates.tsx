import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Estimate } from '@/lib/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { formatCurrency } from '@/lib/utils';

function calculateTotal(estimate: Estimate): number {
  const subtotal = estimate.lineItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const taxAmount = subtotal * (estimate.taxRate / 100);
  return subtotal + taxAmount;
}

const STATUS_STYLES: Record<Estimate['status'], { label: string; className: string }> = {
  Aprobado: { label: 'Aprobado', className: 'bg-emerald-100 text-emerald-700' },
  Enviado: { label: 'Pendiente', className: 'bg-amber-100 text-amber-700' },
  Borrador: { label: 'Borrador', className: 'bg-slate-100 text-slate-600' },
};

export function RecentEstimates({ estimates }: { estimates: Estimate[] }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todaysEstimates = estimates
    .filter((estimate) => {
      const estimateDate = new Date(estimate.createdAt);
      estimateDate.setHours(0, 0, 0, 0);
      return estimateDate.getTime() === today.getTime();
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <CardHeader className="flex flex-col gap-2 pb-4">
        <CardTitle className="text-xl font-semibold text-slate-900">Detalle de presupuestos del día</CardTitle>
        <CardDescription className="text-slate-500">
          Lista de presupuestos emitidos hoy con sus estados y montos estimados.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {todaysEstimates.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500">
            No hay presupuestos registrados para hoy.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="w-[30%] text-slate-500">Cliente</TableHead>
                <TableHead className="w-[20%] text-slate-500">Fecha</TableHead>
                <TableHead className="w-[20%] text-slate-500">Estado</TableHead>
                <TableHead className="text-right text-slate-500">Monto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {todaysEstimates.map((estimate) => {
                const status = STATUS_STYLES[estimate.status];
                const total = calculateTotal(estimate);

                return (
                  <TableRow key={estimate.id} className="border-b border-slate-100">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
                          {estimate.pet.name[0]?.toUpperCase() ?? 'P'}
                        </div>
                        <div className="space-y-1">
                          <Link
                            href={`/estimates/${estimate.id}`}
                            className="text-sm font-semibold text-slate-900 hover:underline"
                          >
                            {estimate.owner.name}
                          </Link>
                          <p className="text-xs text-slate-500">{estimate.pet.name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">
                      {format(new Date(estimate.createdAt), 'dd/MM/yyyy', { locale: es })}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${status.className}`}>
                        {status.label}
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-sm font-semibold text-slate-900">
                      {formatCurrency(total)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
