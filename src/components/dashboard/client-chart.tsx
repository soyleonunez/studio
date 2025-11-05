'use client';

import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

type ServiceCount = {
    service: string;
    count: number;
    fill: string;
};

export function ClientChart({ chartData }: { chartData: ServiceCount[] }) {
    const chartConfig = chartData.reduce((acc, item) => {
        acc[item.service] = { label: item.service, color: item.fill };
        return acc;
    }, {} as ChartConfig);

    return (
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart
                accessibilityLayer
                data={chartData}
                layout="vertical"
                margin={{ left: 10, right: 10, top: 10, bottom: 10 }}
            >
                <CartesianGrid horizontal={false} />
                <XAxis type="number" dataKey="count" hide />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="count" layout="vertical" radius={5}>
                    {chartData.map((entry) => (
                        <Bar key={entry.service} dataKey="count" name={entry.service} fill={entry.fill} />
                    ))}
                </Bar>
            </BarChart>
        </ChartContainer>
    );
}
