import { EstimateForm } from "@/components/estimates/estimate-form";

export default function NewEstimatePage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Crear Nuevo Presupuesto</h1>
            <EstimateForm />
        </div>
    );
}
