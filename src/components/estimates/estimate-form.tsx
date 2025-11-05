'use client';

import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import type { Estimate } from '@/lib/types';
import { saveEstimateAction } from '@/lib/actions';
import { formatCurrency } from '@/lib/utils';
import { PlusCircle, Trash2, Loader2, Save } from 'lucide-react';
import { useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';

const lineItemSchema = z.object({
    id: z.string(),
    service: z.string().min(1, "El nombre del servicio es requerido."),
    description: z.string().min(1, "La descripción es requerida."),
    quantity: z.coerce.number().min(0.01, "La cantidad debe ser mayor que 0."),
    price: z.coerce.number().min(0, "El precio no puede ser negativo."),
});

const estimateSchema = z.object({
  id: z.string(),
  owner: z.object({
    name: z.string().min(1, "El nombre del dueño es requerido."),
    cedula: z.string().min(1, "La cédula del dueño es requerida."),
    address: z.string().min(1, "La dirección del dueño es requerida."),
    email: z.string().email("Dirección de correo inválida."),
    phone: z.string().min(1, "El teléfono del dueño es requerido."),
  }),
  pet: z.object({
    name: z.string().min(1, "El nombre de la mascota es requerido."),
    breed: z.string().min(1, "La raza de la mascota es requerida."),
    age: z.string().min(1, "La edad de la mascota es requerida."),
    gender: z.enum(['Macho', 'Hembra', 'Desconocido']),
  }),
  lineItems: z.array(lineItemSchema).min(1, "Se requiere al menos un concepto."),
  taxRate: z.coerce.number().min(0, "La tasa de impuesto no puede ser negativa.").default(0),
  status: z.enum(['Borrador', 'Enviado', 'Aprobado']),
});

type EstimateFormData = z.infer<typeof estimateSchema>;

export function EstimateForm({ estimate }: { estimate?: Estimate }) {
    const { toast } = useToast();
    const [isSaving, startSavingTransition] = useTransition();

    const form = useForm<EstimateFormData>({
        resolver: zodResolver(estimateSchema),
        defaultValues: estimate || {
            id: 'new',
            owner: { name: '', cedula: '', address: '', email: '', phone: '' },
            pet: { name: '', breed: '', age: '', gender: 'Desconocido' },
            lineItems: [{ id: '1', service: '', description: '', quantity: 1, price: 0 }],
            taxRate: 0,
            status: 'Borrador',
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
    
    const onSubmit = (data: EstimateFormData) => {
        startSavingTransition(async () => {
            await saveEstimateAction(data as Estimate);
            toast({
                title: '¡Presupuesto Guardado!',
                description: `El presupuesto ${estimate ? estimate.id : 'nuevo'} ha sido guardado exitosamente.`
            });
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Información del Cliente y Mascota</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-4">
                                    <h3 className="font-semibold">Detalles del Dueño</h3>
                                    <FormField control={form.control} name="owner.name" render={({ field }) => (
                                        <FormItem><FormLabel>Nombre</FormLabel><FormControl><Input {...field} placeholder="John Doe" /></FormControl><FormMessage /></FormItem>
                                    )}/>
                                     <FormField control={form.control} name="owner.cedula" render={({ field }) => (
                                        <FormItem><FormLabel>Cédula</FormLabel><FormControl><Input {...field} placeholder="V-12345678" /></FormControl><FormMessage /></FormItem>
                                    )}/>
                                    <FormField control={form.control} name="owner.address" render={({ field }) => (
                                        <FormItem><FormLabel>Dirección</FormLabel><FormControl><Input {...field} placeholder="123 Calle Principal" /></FormControl><FormMessage /></FormItem>
                                    )}/>
                                    <FormField control={form.control} name="owner.email" render={({ field }) => (
                                        <FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} type="email" placeholder="john@example.com"/></FormControl><FormMessage /></FormItem>
                                    )}/>
                                    <FormField control={form.control} name="owner.phone" render={({ field }) => (
                                        <FormItem><FormLabel>Teléfono</FormLabel><FormControl><Input {...field} placeholder="555-123-4567" /></FormControl><FormMessage /></FormItem>
                                    )}/>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="font-semibold">Detalles de la Mascota</h3>
                                    <FormField control={form.control} name="pet.name" render={({ field }) => (
                                        <FormItem><FormLabel>Nombre</FormLabel><FormControl><Input {...field} placeholder="Buddy" /></FormControl><FormMessage /></FormItem>
                                    )}/>
                                    <FormField control={form.control} name="pet.breed" render={({ field }) => (
                                        <FormItem><FormLabel>Raza</FormLabel><FormControl><Input {...field} placeholder="Golden Retriever" /></FormControl><FormMessage /></FormItem>
                                    )}/>
                                    <FormField control={form.control} name="pet.age" render={({ field }) => (
                                        <FormItem><FormLabel>Edad</FormLabel><FormControl><Input {...field} placeholder="5 años" /></FormControl><FormMessage /></FormItem>
                                    )}/>
                                    <FormField control={form.control} name="pet.gender" render={({ field }) => (
                                        <FormItem><FormLabel>Género</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Seleccionar género" /></SelectTrigger></FormControl>
                                            <SelectContent><SelectItem value="Macho">Macho</SelectItem><SelectItem value="Hembra">Hembra</SelectItem><SelectItem value="Desconocido">Desconocido</SelectItem></SelectContent>
                                        </Select><FormMessage /></FormItem>
                                    )}/>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Servicios y Productos</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="p-4 border rounded-lg space-y-4 relative">
                                        <div className="grid gap-4 md:grid-cols-5 items-end">
                                            <FormField control={form.control} name={`lineItems.${index}.service`} render={({ field }) => (
                                                <FormItem className="md:col-span-2"><FormLabel>Servicio/Producto</FormLabel><FormControl><Input {...field} placeholder="Examen de Bienestar Anual"/></FormControl><FormMessage /></FormItem>
                                            )}/>
                                            <FormField control={form.control} name={`lineItems.${index}.quantity`} render={({ field }) => (
                                                <FormItem><FormLabel>Cant.</FormLabel><FormControl><Input {...field} type="number" step="1" /></FormControl><FormMessage /></FormItem>
                                            )}/>
                                            <FormField control={form.control} name={`lineItems.${index}.price`} render={({ field }) => (
                                                <FormItem><FormLabel>Precio Unit.</FormLabel><FormControl><Input {...field} type="number" step="0.01" /></FormControl><FormMessage /></FormItem>
                                            )}/>
                                            <div className="flex items-center justify-end h-10">
                                                <p className="font-medium text-right w-full">{formatCurrency((lineItems[index]?.quantity || 0) * (lineItems[index]?.price || 0))}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <FormLabel>Descripción</FormLabel>
                                            </div>
                                            <FormField control={form.control} name={`lineItems.${index}.description`} render={({ field }) => (
                                                <FormItem className="!mt-0"><FormControl><Textarea {...field} placeholder="Descripción detallada del servicio..."/></FormControl><FormMessage /></FormItem>
                                            )}/>
                                        </div>
                                        {fields.length > 1 && (
                                            <Button type="button" variant="destructive" size="icon" className="absolute -top-3 -right-3 h-7 w-7" onClick={() => remove(index)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                                 <Button type="button" variant="outline" onClick={() => append({ id: `${Date.now()}`, service: '', description: '', quantity: 1, price: 0 })}>
                                    <PlusCircle className="mr-2 h-4 w-4" /> Agregar Concepto
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-1 space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Resumen</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
                                <div className="flex justify-between items-center">
                                    <FormLabel>Impuesto (%)</FormLabel>
                                    <FormField control={form.control} name="taxRate" render={({ field }) => (
                                        <FormItem><FormControl><Input {...field} type="number" step="0.01" className="w-24 h-8 text-right" /></FormControl><FormMessage /></FormItem>
                                    )}/>
                                </div>
                                <div className="flex justify-between"><span>Impuesto</span><span>{formatCurrency(taxAmount)}</span></div>
                                <Separator />
                                <div className="flex justify-between font-bold text-lg"><span>Total</span><span>{formatCurrency(total)}</span></div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" className="w-full" disabled={isSaving}>
                                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-4 w-4" />}
                                    Guardar Presupuesto
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </form>
        </Form>
    );
}
