import { getEstimateById, getCompany } from "@/lib/data";
import { EstimatePreview } from "@/components/estimates/estimate-preview";
import { notFound } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default async function EstimatePage({ params }: { params: { id: string } }) {
    const [estimate, company] = await Promise.all([
        getEstimateById(params.id),
        getCompany()
    ]);
    
    if (!estimate) {
        notFound();
    }
    
    if (!company) {
         return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>No se encontró la configuración de la empresa. Por favor, configure su empresa en la página de configuración.</AlertDescription>
            </Alert>
         )
    }

    return <EstimatePreview estimate={estimate} company={company} />;
}
