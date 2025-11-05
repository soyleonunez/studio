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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/utils';
import { PlusCircle, Trash2 } from 'lucide-react';
import type { Company } from '@/lib/types';
import { cn } from '@/lib/utils';

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

type TempEstimateFormData = z.infer<typeof tempEstimateSchema>;

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
    
    const lineItems = useWatch({ control: form.control, name: 'lineItems' });
    const taxRate = useWatch({ control: form.control, name: 'taxRate' });

    const subtotal = lineItems.reduce((acc, item) => acc + (item.quantity * item.price || 0), 0);
    const taxAmount = subtotal * ((taxRate || 0) / 100);
    const total = subtotal + taxAmount;

    return (
        <Card className={cn("w-full", className)}>
            <CardHeader>
                <CardTitle>Presupuesto Rápido</CardTitle>
                <CardDescription>Crea un presupuesto temporal sin guardar datos.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form className="space-y-4">
                        <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                            {fields.map((field, index) => (
                                <div key={field.id} className="grid grid-cols-12 gap-2 items-start relative">
                                    <FormField control={form.control} name={`lineItems.${index}.service`} render={({ field }) => (
                                        <FormItem className="col-span-5"><FormLabel className="sr-only">Servicio</FormLabel><FormControl><Input {...field} placeholder="Servicio/Producto"/></FormControl><FormMessage /></FormItem>
                                    )}/>
                                    <FormField control={form.control} name={`lineItems.${index}.quantity`} render={({ field }) => (
                                        <FormItem className="col-span-2"><FormLabel className="sr-only">Cant.</FormLabel><FormControl><Input {...field} type="number" step="1" /></FormControl><FormMessage /></FormItem>
                                    )}/>
                                    <FormField control={form.control} name={`lineItems.${index}.price`} render={({ field }) => (
                                        <FormItem className="col-span-3"><FormLabel className="sr-only">Precio</FormLabel><FormControl><Input {...field} type="number" step="0.01" /></FormControl><FormMessage /></FormItem>
                                    )}/>
                                    <div className="col-span-2 flex items-center justify-end h-10">
                                        {fields.length > 1 && (
                                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => remove(index)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button type="button" variant="outline" size="sm" onClick={() => append({ id: `${Date.now()}`, service: '', quantity: 1, price: 0 })}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Agregar Concepto
                        </Button>
                        <Separator />
                        <div className="space-y-2">
                            <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
                            <div className="flex justify-between items-center">
                                <FormLabel>Impuesto (%)</FormLabel>
                                <FormField control={form.control} name="taxRate" render={({ field }) => (
                                    <FormItem><FormControl><Input {...field} type="number" step="0.01" className="w-20 h-8 text-right" /></FormControl></FormItem>
                                )}/>
                            </div>
                            <Separator />
                            <div className="flex justify-between font-bold text-lg"><span>Total</span><span>{formatCurrency(total)}</span></div>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
