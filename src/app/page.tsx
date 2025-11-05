import { DashboardActions } from '@/components/dashboard/dashboard-actions';
import { RecentEstimates } from '@/components/dashboard/recent-estimates';
import { getEstimates } from '@/lib/data';

export default async function DashboardPage() {
  const estimates = await getEstimates();

  return (
    <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Panel de Control</h1>
        <DashboardActions />
        <RecentEstimates estimates={estimates.slice(0, 5)} />
    </div>
  );
}
