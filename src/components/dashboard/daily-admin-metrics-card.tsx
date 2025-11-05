"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Estimate } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { ChartPieIcon, LightningIcon, WalletIcon } from "@/components/icons/phosphor";
import { Badge } from "@/components/ui/badge";

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

  const todaysEstimates = useMemo(() => {
    return estimates.filter((estimate) => {
      const estimateDate = new Date(estimate.createdAt);
      estimateDate.setHours(0, 0, 0, 0);
      return estimateDate.getTime() === today.getTime();
    });
  }, [estimates, today]);

  const totalIncome = useMemo(() => {
    return todaysEstimates.reduce((acc, estimate) => acc + calculateEstimateTotal(estimate), 0);
  }, [todaysEstimates]);

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

  const averageTicket = useMemo(() => {
    if (todaysEstimates.length === 0) return 0;
    return totalIncome / todaysEstimates.length;
  }, [todaysEstimates.length, totalIncome]);

  const [activeIndex, setActiveIndex] = useState(0);

  const slides = useMemo(() => {
    const serviceMax = frequentServices.length > 0 ? frequentServices[0].count : 1;

    return [
      {
        id: "income",
        icon: <WalletIcon className="h-6 w-6" />,
        title: "Ingresos del día",
        description: `${todaysEstimates.length} presupuestos emitidos`,
        content: (
          <div className="flex h-full flex-col justify-between">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-wide text-slate-500">Total proyectado</p>
              <p className="text-4xl font-semibold text-slate-900">{formatCurrency(totalIncome)}</p>
              <p className="text-sm text-slate-500">
                Valores calculados con la suma de todos los presupuestos generados hoy.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-900/5 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Ticket promedio</p>
                <p className="text-lg font-semibold text-slate-900">{formatCurrency(averageTicket)}</p>
              </div>
              <div className="rounded-2xl bg-slate-900/5 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Conceptos emitidos</p>
                <p className="text-lg font-semibold text-slate-900">
                  {todaysEstimates.reduce((acc, estimate) => acc + estimate.lineItems.length, 0)}
                </p>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "services",
        icon: <ChartPieIcon className="h-6 w-6" />,
        title: "Servicios frecuentes",
        description:
          frequentServices.length > 0
            ? "Top de conceptos incluidos en los presupuestos de hoy"
            : "Registra un presupuesto para ver actividad",
        content: (
          <div className="flex h-full flex-col justify-between">
            <div className="space-y-4">
              {frequentServices.length === 0 && (
                <p className="text-sm text-slate-500">
                  Aún no hay servicios registrados hoy. ¡Crea tu primer presupuesto!
                </p>
              )}
              {frequentServices.map((service) => (
                <div key={service.service} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-900">{service.service}</span>
                    <Badge variant="outline" className="rounded-full border-slate-200 px-2 py-0 text-xs font-medium">
                      {service.count}x
                    </Badge>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-slate-900"
                      style={{ width: `${Math.max((service.count / serviceMax) * 100, 10)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-2xl bg-slate-900/5 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Servicios distintos</p>
              <p className="text-lg font-semibold text-slate-900">{frequentServices.length}</p>
            </div>
          </div>
        ),
      },
    ];
  }, [averageTicket, frequentServices, todaysEstimates, totalIncome]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <Card className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/60 bg-white shadow-xl">
      <div className="pointer-events-none absolute -top-32 -left-16 h-64 w-64 rounded-full bg-sky-100 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-20 h-64 w-64 rounded-full bg-indigo-100 blur-3xl" />
      <CardHeader className="relative z-10 flex flex-row items-start justify-between gap-4 pb-4">
        <div>
          <CardTitle className="text-2xl font-semibold tracking-tight text-slate-900">Métricas diarias</CardTitle>
          <CardDescription className="text-slate-500">
            Sigue los indicadores clave del día para tomar decisiones rápidas.
          </CardDescription>
        </div>
        <div className="rounded-full bg-slate-900 p-3 text-white shadow-lg">
          <LightningIcon className="h-6 w-6" />
        </div>
      </CardHeader>
      <CardContent className="relative z-10 flex-1">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-full bg-slate-900/10 p-2 text-slate-900">
            {slides[activeIndex]?.icon}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900">{slides[activeIndex]?.title}</p>
            <p className="text-xs text-slate-500">{slides[activeIndex]?.description}</p>
          </div>
        </div>
        <div className="relative h-64 overflow-hidden">
          <div
            className="absolute inset-0 flex h-[calc(16rem*2)] flex-col transition-transform duration-500"
            style={{ transform: `translateY(-${activeIndex * 16}rem)` }}
            aria-live="polite"
          >
            {slides.map((slide) => (
              <div key={slide.id} className="h-64 space-y-6 pb-4 pr-1">
                {slide.content}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 flex items-center justify-center gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={
                "h-2 w-6 rounded-full transition-colors duration-200 " +
                (index === activeIndex ? "bg-slate-900" : "bg-slate-200 hover:bg-slate-300")
              }
              aria-label={`Ver ${slide.title}`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
