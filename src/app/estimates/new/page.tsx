import { EstimateForm } from "@/components/estimates/estimate-form";

export default function NewEstimatePage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Create New Estimate</h1>
            <EstimateForm />
        </div>
    );
}
