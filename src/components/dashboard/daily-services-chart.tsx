'use server';

import type { Estimate } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ClientChart } from './client-chart';

type ServiceCount = {
    service: string;
    count: number;
    fill: string;
};

function processDailyServices(estimates: Estimate[]): ServiceCount[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const serviceCounts: Record<string, number> = {};

    estimates
        .filter(estimate => {
            const estimateDate = new Date(estimate.createdAt);
            estimateDate.setHours(0, 0, 0, 0);
            return estimateDate.getTime() === today.getTime();
        })
        .forEach(estimate => {
            estimate.lineItems.forEach(item => {
                serviceCounts[item.service] = (serviceCounts[item.service] || 0) + item.quantity;
            });
        });
    
    const colors = [
        'hsl(var(--chart-1))',
        'hsl(var(--chart-2))',
        'hsl(var(--chart-3))',
        'hsl(var(--chart-4))',
        'hsl(var(--chart-5))',
    ];

    const sortedServices = Object.entries(serviceCounts)
        .map(([service, count]) => ({ service, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
        .map((item, index) => ({
            ...item,
            fill: colors[index % colors.length],
        }));

    return sortedServices;
}

export async function DailyServicesChart({ estimates }: { estimates: Estimate[] }) {
    const chartData = processDailyServices(estimates);

    if (chartData.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Servicios de Hoy</CardTitle>
                    <CardDescription>No hay datos de servicios para el día de hoy.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-48">
                    <p className="text-muted-foreground">Crea un presupuesto para ver datos.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Servicios Más Solicitados Hoy</CardTitle>
                <CardDescription>Cantidad de servicios y productos en presupuestos de hoy.</CardDescription>
            </CardHeader>
            <CardContent>
                <ClientChart chartData={chartData} />
            </CardContent>
        </Card>
    );
}
