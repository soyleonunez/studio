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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatCurrency, cn } from '@/lib/utils';
import { PlusCircle, Trash2, FileDown } from 'lucide-react';
import type { Company } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { TemporaryEstimatePreview } from './temporary-estimate-preview';

const lineItemSchema = z.object({
  id: z.string(),
  service: z.string().min(1, 'Requerido'),
  quantity: z.coerce.number().min(0.01, 'Requerido'),
  price: z.coerce.number().min(0.01, 'Requerido'),
});

const tempEstimateSchema = z.object({
  lineItems: z.array(lineItemSchema).min(1, 'Se requiere al menos un concepto.'),
  taxRate: z.coerce.number().min(0).default(0),
});

export type TempEstimateFormData = z.infer<typeof tempEstimateSchema>;

export function TemporaryEstimateCard({ company, className }: { company: Company; className?: string }) {
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
  const watchedLineItems = watchedData?.lineItems ?? form.getValues('lineItems');
  const lineItems = (watchedLineItems ?? []).map((item, index) => ({
    id: item?.id ?? `${index + 1}`,
    service: item?.service ?? '',
    quantity: Number(item?.quantity ?? 0),
    price: Number(item?.price ?? 0),
  }));
  const taxRate = Number(watchedData?.taxRate ?? form.getValues('taxRate') ?? 0);

  const subtotal = lineItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;
  const safeFormData: TempEstimateFormData = { lineItems, taxRate };

  return (
    <Card
      className={cn(
        'flex h-full flex-col rounded-3xl border border-slate-200 bg-white shadow-sm',
        className,
      )}
    >
      <CardHeader className="flex flex-col gap-6 pb-0">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-semibold text-slate-900">Presupuestos rápidos</CardTitle>
            <CardDescription className="text-slate-500">
              Prepara montos estimados sin guardar registros permanentes.
            </CardDescription>
          </div>
          <div className="rounded-2xl bg-slate-900 px-5 py-3 text-white shadow-sm">
            <span className="text-xs uppercase tracking-wide text-white/70">Total estimado</span>
            <p className="text-2xl font-semibold">{formatCurrency(total)}</p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Subtotal</p>
            <p className="text-lg font-semibold text-slate-900">{formatCurrency(subtotal)}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Impuesto</p>
            <p className="text-lg font-semibold text-slate-900">{formatCurrency(taxAmount)}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Conceptos</p>
            <p className="text-lg font-semibold text-slate-900">{fields.length}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pt-6">
        <Form {...form}>
          <form className="flex h-full flex-col space-y-5">
            <div className="flex-1 space-y-4 overflow-y-auto pr-1">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-12 gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
                >
                  <FormField
                    control={form.control}
                    name={`lineItems.${index}.service`}
                    render={({ field }) => (
                      <FormItem className="col-span-12 sm:col-span-5">
                        <FormLabel className="text-xs font-medium text-slate-500">Servicio o producto</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Consultas, vacunas, etc."
                            className="h-11 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-slate-300 focus-visible:ring-slate-400"
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
                        <FormLabel className="text-xs font-medium text-slate-500">Cantidad</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            step="1"
                            min="0"
                            className="h-11 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus-visible:border-slate-300 focus-visible:ring-slate-400"
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
                        <FormLabel className="text-xs font-medium text-slate-500">Precio unitario</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            step="0.01"
                            min="0"
                            className="h-11 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus-visible:border-slate-300 focus-visible:ring-slate-400"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="col-span-12 flex items-end justify-end sm:col-span-2">
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-11 w-11 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Eliminar concepto</span>
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
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-slate-700 hover:bg-slate-100"
              onClick={() => append({ id: `${Date.now()}`, service: '', quantity: 1, price: 0 })}
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Agregar concepto
            </Button>
            <Separator className="border-slate-200" />
            <div className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Impuesto (%)</span>
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
                          min="0"
                          className="h-10 w-24 rounded-xl border border-slate-200 bg-white text-right text-sm text-slate-900 focus-visible:border-slate-300 focus-visible:ring-slate-400"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <Separator className="border-slate-200" />
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-slate-500">Total actualizado</span>
                <span className="text-2xl font-semibold text-slate-900">{formatCurrency(total)}</span>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="w-full rounded-full bg-sky-500 text-white hover:bg-sky-600"
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
