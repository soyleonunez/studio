import { getCompany } from '@/lib/data';
import { SettingsForm } from '@/components/settings/settings-form';

export default async function SettingsPage() {
    const company = await getCompany();

    const emptyCompany = {
        id: '1',
        name: '',
        address: '',
        contactInfo: '',
        taxId: '',
        logoUrl: '',
        disclaimer: 'Este presupuesto tiene una validez de 30 días. Los precios están sujetos a cambios sin previo aviso.',
        accentColor: '#4f46e5'
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
            <SettingsForm company={company || emptyCompany} />
        </div>
    );
}
