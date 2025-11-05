import { EstimateForm } from "@/components/estimates/estimate-form";
import { getEstimateById } from "@/lib/data";
import { notFound } from "next/navigation";

export default async function EditEstimatePage({ params }: { params: { id: string } }) {
    const estimate = await getEstimateById(params.id);

    if (!estimate) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Edit Estimate {params.id}</h1>
            <EstimateForm estimate={estimate} />
        </div>
    );
}
