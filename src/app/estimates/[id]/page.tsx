import { getEstimateById, getCompany } from "@/lib/data";
import { EstimatePreview } from "@/components/estimates/estimate-preview";
import { notFound } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function EstimatePage({ params }: { params: { id: string } }) {
    const [estimate, company] = await Promise.all([
        getEstimateById(params.id),
        getCompany()
    ]);
    
    if (!estimate) {
        notFound();
    }
    
    if (!company || !company.name || !company.address) {
         return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error de Configuración</AlertTitle>
                <AlertDescription>
                    La información de la empresa no está completa. Por favor, configure los datos de su empresa antes de ver un presupuesto.
                    <Button asChild variant="secondary" className="mt-4">
                        <Link href="/settings">Ir a Configuración</Link>
                    </Button>
                </AlertDescription>
            </Alert>
         )
    }

    return <EstimatePreview estimate={estimate} company={company} />;
}
