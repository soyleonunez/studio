import { RecentEstimates } from '@/components/dashboard/recent-estimates';
import { getEstimates, getCompany } from '@/lib/data';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, FilePlus2, Search } from "lucide-react";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TemporaryEstimateCard } from '@/components/dashboard/temporary-estimate-card';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';


export default async function DashboardPage() {
  const [estimates, company] = await Promise.all([getEstimates(), getCompany()]);

  if (!company || !company.name || !company.address) {
    return (
        <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
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
    <div className="space-y-8">
        <div className='space-y-2'>
            <h1 className="text-3xl font-bold tracking-tight">Panel de Control</h1>
            <p className="text-muted-foreground">Aquí tienes un resumen de tu actividad reciente y acciones rápidas.</p>
        </div>
        
        <div className="grid gap-6 lg:grid-cols-3">
            <TemporaryEstimateCard company={company} className="lg:col-span-2" />
            
            <div className="space-y-6">
                <Card>
                    <CardContent className="p-4 flex items-center justify-between">
                        <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground flex-1">
                            <Link href="/estimates/new">
                                <FilePlus2 className="mr-2 h-5 w-5" />
                                Crear Presupuesto
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                         <div className="flex w-full items-center space-x-2">
                            <Input type="text" placeholder="Buscar por Cédula..." className="flex-1" />
                            <Button type="submit" size="icon" aria-label="Buscar">
                                <Search className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>

        <RecentEstimates estimates={estimates.slice(0, 5)} />
    </div>
  );
}
