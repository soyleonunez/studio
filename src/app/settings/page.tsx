import { getCompany } from '@/lib/data';
import { SettingsForm } from '@/components/settings/settings-form';

export default async function SettingsPage() {
    const company = await getCompany();

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
            <SettingsForm company={company} />
        </div>
    );
}
