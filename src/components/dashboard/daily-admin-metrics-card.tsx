"use client";

import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Estimate } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

function calculateEstimateTotal(estimate: Estimate) {
  const subtotal = estimate.lineItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const taxAmount = subtotal * (estimate.taxRate / 100);
  return subtotal + taxAmount;
}

export function DailyAdminMetricsCard({ estimates }: { estimates: Estimate[] }) {
  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  const yesterday = useMemo(() => {
    const date = new Date(today);
    date.setDate(date.getDate() - 1);
    return date;
  }, [today]);

  const todaysEstimates = useMemo(() => {
    return estimates.filter((estimate) => {
      const estimateDate = new Date(estimate.createdAt);
      estimateDate.setHours(0, 0, 0, 0);
      return estimateDate.getTime() === today.getTime();
    });
  }, [estimates, today]);

  const yesterdaysEstimates = useMemo(() => {
    return estimates.filter((estimate) => {
      const estimateDate = new Date(estimate.createdAt);
      estimateDate.setHours(0, 0, 0, 0);
      return estimateDate.getTime() === yesterday.getTime();
    });
  }, [estimates, yesterday]);

  const totalIncome = useMemo(() => {
    return todaysEstimates.reduce((acc, estimate) => acc + calculateEstimateTotal(estimate), 0);
  }, [todaysEstimates]);

  const previousIncome = useMemo(() => {
    return yesterdaysEstimates.reduce((acc, estimate) => acc + calculateEstimateTotal(estimate), 0);
  }, [yesterdaysEstimates]);

  const incomeDelta = totalIncome - previousIncome;
  const incomeDeltaPercentage = previousIncome > 0 ? (incomeDelta / previousIncome) * 100 : null;
  const deltaBadgeClass = incomeDeltaPercentage === null
    ? 'bg-slate-100 text-slate-600'
    : incomeDelta >= 0
      ? 'bg-emerald-100 text-emerald-700'
      : 'bg-rose-100 text-rose-600';

  const frequentServices = useMemo(() => {
    const counts: Record<string, number> = {};

    todaysEstimates.forEach((estimate) => {
      estimate.lineItems.forEach((item) => {
        counts[item.service] = (counts[item.service] || 0) + item.quantity;
      });
    });

    return Object.entries(counts)
      .map(([service, count]) => ({ service, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);
  }, [todaysEstimates]);

  const serviceMax = frequentServices.length > 0 ? frequentServices[0].count : 1;
  const conceptCount = todaysEstimates.reduce(
    (acc, estimate) => acc + estimate.lineItems.reduce((total, item) => total + item.quantity, 0),
    0,
  );

  const averageTicket = todaysEstimates.length > 0 ? totalIncome / todaysEstimates.length : 0;
  const uniquePatients = new Set(
    todaysEstimates.map((estimate) => `${estimate.owner.name}-${estimate.pet.name}`),
  ).size;

  const todayLabel = new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'long',
  }).format(today);

  return (
    <Card className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white shadow-sm">
      <CardHeader className="flex flex-col gap-3 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="text-2xl font-semibold text-slate-900">Métricas del día</CardTitle>
            <CardDescription className="text-slate-500">
              Visualiza la actividad clave de hoy para tu equipo.
            </CardDescription>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-600">
            {todayLabel}
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-slate-600">Facturación del día</span>
              <span className={`rounded-full px-2 py-1 text-xs font-semibold ${deltaBadgeClass}`}>
                {incomeDeltaPercentage !== null
                  ? `${incomeDelta >= 0 ? '+' : ''}${incomeDeltaPercentage.toFixed(1)}%`
                  : '—'}
              </span>
            </div>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{formatCurrency(totalIncome)}</p>
            <p className="mt-1 text-sm text-slate-500">
              {todaysEstimates.length > 0
                ? `${todaysEstimates.length} presupuestos emitidos hoy.`
                : 'Todavía no hay presupuestos emitidos hoy.'}
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-white/60 bg-white p-3">
                <p className="text-xs uppercase tracking-wide text-slate-400">Ticket promedio</p>
                <p className="text-lg font-semibold text-slate-900">{formatCurrency(averageTicket)}</p>
              </div>
              <div className="rounded-xl border border-white/60 bg-white p-3">
                <p className="text-xs uppercase tracking-wide text-slate-400">Conceptos emitidos</p>
                <p className="text-lg font-semibold text-slate-900">{conceptCount}</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              Comparado contra {formatCurrency(previousIncome)} facturados ayer.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-slate-600">Pacientes atendidos</span>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-500">
                {todaysEstimates.length} presupuestos
              </span>
            </div>
            <p className="mt-4 text-4xl font-semibold text-slate-900">{uniquePatients}</p>
            <p className="mt-1 text-sm text-slate-500">
              Total de mascotas distintas registradas en los presupuestos de hoy.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-white/60 bg-white p-3">
                <p className="text-xs uppercase tracking-wide text-slate-400">Ingresos por paciente</p>
                <p className="text-lg font-semibold text-slate-900">
                  {uniquePatients > 0 ? formatCurrency(totalIncome / uniquePatients) : formatCurrency(0)}
                </p>
              </div>
              <div className="rounded-xl border border-white/60 bg-white p-3">
                <p className="text-xs uppercase tracking-wide text-slate-400">Pendientes por aprobar</p>
                <p className="text-lg font-semibold text-slate-900">
                  {todaysEstimates.filter((estimate) => estimate.status !== 'Aprobado').length}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-700">Servicios más cotizados</p>
              <p className="text-xs text-slate-500">Top de conceptos incluidos en los presupuestos generados hoy.</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              {frequentServices.length} servicios
            </span>
          </div>
          <div className="mt-4 space-y-4">
            {frequentServices.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
                Crea un presupuesto para descubrir tus servicios más solicitados.
              </div>
            ) : (
              frequentServices.map((service) => (
                <div key={service.service} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-900">{service.service}</span>
                    <span className="text-xs font-semibold text-slate-500">{service.count} solicitudes</span>
                  </div>
                  <Progress
                    value={Math.max((service.count / serviceMax) * 100, 6)}
                    className="h-2 bg-slate-100 [&>div]:bg-sky-500"
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
