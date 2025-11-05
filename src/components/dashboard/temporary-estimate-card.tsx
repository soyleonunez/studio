'use client';

import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/utils';
import { PlusCircle, Trash2, FileDown } from 'lucide-react';
import type { Company } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { TemporaryEstimatePreview } from './temporary-estimate-preview';


const lineItemSchema = z.object({
    id: z.string(),
    service: z.string().min(1, "Requerido"),
    quantity: z.coerce.number().min(0.01, "Requerido"),
    price: z.coerce.number().min(0.01, "Requerido"),
});

const tempEstimateSchema = z.object({
  lineItems: z.array(lineItemSchema).min(1, "Se requiere al menos un concepto."),
  taxRate: z.coerce.number().min(0).default(0),
});

export type TempEstimateFormData = z.infer<typeof tempEstimateSchema>;

export function TemporaryEstimateCard({ company, className }: { company: Company, className?: string }) {

    const form = useForm<TempEstimateFormData>({
        resolver: zodResolver(tempEstimateSchema),
        defaultValues: {
            lineItems: [{ id: '1', service: '', quantity: 1, price: 0 }],
            taxRate: 0,
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'lineItems',
    });
    
    const watchedData = useWatch({ control: form.control });
    const watchedLineItems = watchedData?.lineItems ?? form.getValues("lineItems");
    const lineItems = (watchedLineItems ?? []).map((item, index) => ({
        id: item?.id ?? `${index + 1}`,
        service: item?.service ?? "",
        quantity: Number(item?.quantity ?? 0),
        price: Number(item?.price ?? 0),
    }));
    const taxRate = Number(watchedData?.taxRate ?? form.getValues("taxRate") ?? 0);

    const subtotal = lineItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount;
    const safeFormData: TempEstimateFormData = { lineItems, taxRate };

    return (
        <Card
            className={cn(
                "relative flex w-full flex-col overflow-hidden rounded-3xl border-none bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white shadow-xl",
                className,
            )}
        >
            <div className="pointer-events-none absolute -top-24 -right-16 h-64 w-64 rounded-full bg-primary/40 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />
            <CardHeader className="relative z-10 flex flex-col gap-3 pb-0">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <CardTitle className="text-2xl font-semibold tracking-tight">Presupuesto Rápido</CardTitle>
                        <CardDescription className="text-slate-300">
                            Crea un presupuesto temporal sin guardar datos y compártelo al instante.
                        </CardDescription>
                    </div>
                    <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur">
                        Total actual
                        <span className="ml-2 text-base font-semibold">{formatCurrency(total)}</span>
                    </div>
                </div>
                <div className="grid gap-2 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
                        <p className="text-xs uppercase tracking-wide text-slate-300">Subtotal</p>
                        <p className="text-lg font-semibold">{formatCurrency(subtotal)}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
                        <p className="text-xs uppercase tracking-wide text-slate-300">Impuesto</p>
                        <p className="text-lg font-semibold">{formatCurrency(taxAmount)}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
                        <p className="text-xs uppercase tracking-wide text-slate-300">Conceptos</p>
                        <p className="text-lg font-semibold">{fields.length}</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="relative z-10 flex-1">
                <Form {...form}>
                    <form className="flex h-full flex-col space-y-5">
                        <div className="flex-1 space-y-4 overflow-y-auto pr-1">
                            {fields.map((field, index) => (
                                <div key={field.id} className="grid grid-cols-12 items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                                    <FormField
                                        control={form.control}
                                        name={`lineItems.${index}.service`}
                                        render={({ field }) => (
                                            <FormItem className="col-span-12 sm:col-span-5">
                                                <FormLabel className="sr-only">Servicio</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="Servicio o producto"
                                                        className="border-white/10 bg-white/10 text-white placeholder:text-slate-400"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`lineItems.${index}.quantity`}
                                        render={({ field }) => (
                                            <FormItem className="col-span-6 sm:col-span-2">
                                                <FormLabel className="sr-only">Cantidad</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="number"
                                                        step="1"
                                                        className="border-white/10 bg-white/10 text-white placeholder:text-slate-400"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`lineItems.${index}.price`}
                                        render={({ field }) => (
                                            <FormItem className="col-span-6 sm:col-span-3">
                                                <FormLabel className="sr-only">Precio</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="number"
                                                        step="0.01"
                                                        className="border-white/10 bg-white/10 text-white placeholder:text-slate-400"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="col-span-12 flex h-10 items-center justify-end sm:col-span-2">
                                        {fields.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 rounded-full bg-white/10 text-white hover:bg-white/20"
                                                onClick={() => remove(index)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="lg"
                            className="inline-flex items-center justify-center rounded-full border-white/20 bg-white/10 text-white hover:bg-white/20"
                            onClick={() => append({ id: `${Date.now()}`, service: '', quantity: 1, price: 0 })}
                        >
                            <PlusCircle className="mr-2 h-4 w-4" /> Agregar concepto
                        </Button>
                        <Separator className="border-white/10" />
                        <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                            <div className="flex items-center justify-between text-sm uppercase tracking-wide text-slate-300">
                                <span>Impuesto (%)</span>
                                <FormField
                                    control={form.control}
                                    name="taxRate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="number"
                                                    step="0.01"
                                                    className="h-9 w-24 border-white/10 bg-white/10 text-right text-white"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Separator className="border-white/10" />
                            <div className="flex items-baseline justify-between">
                                <span className="text-sm text-slate-300">Total estimado</span>
                                <span className="text-2xl font-semibold">{formatCurrency(total)}</span>
                            </div>
                        </div>
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="relative z-10">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            className="w-full rounded-full bg-white text-slate-900 hover:bg-slate-100"
                            disabled={!form.formState.isValid}
                        >
                            <FileDown className="mr-2 h-4 w-4" />
                            Generar PDF
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-4xl">
                        <DialogHeader>
                            <DialogTitle>Vista previa de presupuesto</DialogTitle>
                        </DialogHeader>
                        <TemporaryEstimatePreview estimateData={safeFormData} company={company} />
                    </DialogContent>
                </Dialog>
            </CardFooter>
        </Card>
    );
}
